mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuc3Nzc3MiLCJhIjoiY2w5NnF5cnh5MnBrbzNvcDg2NGZxMmdkZSJ9.t-C_lxlkb_FxdbZWQ7Y70g';
const railMap = new mapboxgl.Map({
    container: 'rail-map',
    style: 'mapbox://styles/dansssss/cl972aw08000g14ofpbilwkgy/draft',
    center: [144.956785, -37.812000],
    zoom: 12
});
railMap.on('render', function () {
    railMap.resize();
});

const stations = {
    'type': 'FeatureCollection',
    'features': [{
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [144.925469, -37.799531]
        },
        'properties': {
            'address': 'South Kensington',
            'rail': 'Williamstown, Werribee',
        }
    },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.930524, -37.79378]
            },
            'properties': {
                'address': 'Kensington',
                'rail': 'Craigieburn',
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.936166, -37.794267]
            },
            'properties': {
                'address': 'Macaulay',
                'rail': 'Upfield',
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.939323, -37.78814]
            },
            'properties': {
                'address': 'Flemington Bridge',
                'rail': 'Upfield',
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.952301, -37.781193]
            },
            'properties': {
                'address': 'Royal Park',
                'rail': 'Upfield',
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.94257, -37.807419]
            },
            'properties': {
                'address': 'North Melbourne',
                'rail': 'Flemington, Sunbury, Upfield, Werribee, Williamstown, Craigieburn',
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.951411, -37.817936]
            },
            'properties': {
                'address': 'Southern Cross',
                'rail': 'Belgrave, Craigieburn, Cranbourne, Flemington, Frankston, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sandringham, Sunbury, Upfield, Werribee, Williamstown, Alamein',
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.955654, -37.811981]
            },
            'properties': {
                'address': 'Flagstaff',
                'rail': 'Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein',
            }
        }, {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.962594, -37.809939]
            },
            'properties': {
                'address': 'Melbourne Central',
                'rail': 'Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein',
            }
        }, {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.966964, -37.818305]
            },
            'properties': {
                'address': 'Flinders Street',
                'rail': 'Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein',
            }
        }, {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.972911, -37.811054]
            },
            'properties': {
                'address': 'Parliament',
                'rail': 'Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein',
            }
        }, {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.984098, -37.816527]
            },
            'properties': {
                'address': 'Jolimont',
                'rail': 'Mernda, Hurstbridge',
            }
        }
    ]
};
stations.features.forEach((station, i) => {
    station.properties.id = i;
});

railMap.on('click', (event) => {
    // If the user clicked on one of your markers, get its information.
    const features = railMap.queryRenderedFeatures(event.point, {
        layers: ['tram_stop'] // replace with your layer name
    });
    if (!features.length) {
        return;
    }
    const feature = features[0];

    // Code from the next step will go here.
    const popup = new mapboxgl.Popup({offset: [0, -15]})
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
            `<h5>TRAM STOP: ${feature.properties.STOP_NAME}</h5>
      <div>
      <b>AVAILABLE ROUTE: ${feature.properties.ROUTEUSSP}</b>
      </div>`
        )
        .addTo(railMap);
});

railMap.on('load', e => {
    railMap.addSource('places', {
        'type': 'geojson',
        'data': stations
    });

    addMarkers();

});

function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    for (const marker of stations.features) {
        /* Create a div element for the marker. */
        const el = document.createElement('div');
        /* Assign a unique `id` to the marker. */
        el.id = `marker-${marker.properties.id}`;
        el.className = 'marker';

        new mapboxgl.Marker(el, {
            offset: [0, -23]
        })
            .setLngLat(marker.geometry.coordinates)
            .addTo(railMap);

        el.addEventListener('click', (e) => {
            /* Fly to the point */
            flyToStation(marker);
            createPopUp(marker);

            /* Highlight listing in sidebar */
            const activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            const listing = document.getElementById(
                `listing-${marker.properties.id}`
            );
            //listing.classList.add('active');
        });
    }
}

/**
 * Use Mapbox GL JS's `flyTo` to move the camera smoothly
 * a given center point.
 **/
function flyToStation(currentFeature) {
    railMap.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 12.5
    });
}

/**
 * Create a Mapbox GL JS `Popup`.
 **/
function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();


    const popup = new mapboxgl.Popup({
        closeOnClick: true
    })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(
            `
      <h4>${currentFeature.properties.address}</h4>
      <h5>Rail: ${currentFeature.properties.rail}</h5>
      <h6>city circle station entries 2018 - 2020</h6>
      <div class="chart"><canvas id= "lineChart"style="min-height: 200px; height: 350px; max-height: 300px; max-width: 100%;" ></canvas></div>`
        )
        .addTo(railMap);

    var areaChartData = {
        labels: ['2018', '2019', '2020'],
        datasets: [
            {
                label: 'Flagstaff',
                backgroundColor: 'rgba(29, 72, 35, 0.8)',
                data: [4854950, 2882250, 1378000]
            },
            {
                label: 'Flinders Street',
                backgroundColor: 'rgba(75, 120, 81, 0.8)',
                data: [28320650, 21503500, 8528000]
            },
            {
                label: 'Melbourne Central',
                backgroundColor: 'rgba(125, 156, 129, 0.8)',
                data: [15250700, 10865600, 4206700]
            },
            {
                label: 'Parliament',
                backgroundColor: 'rgba(78, 178, 92, 0.8)',
                data: [10124200, 7646300, 2213650]
            },
            {
                label: 'Southern Cross',
                backgroundColor: 'rgba(180, 227, 186, 0.8)',
                data: [19551450, 14895400, 4556450]
            }
        ]
    }

    //these are the options for testing
    var areaChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false,
                }
            }]
        }
    }

    var lineChartCanvas = $('#lineChart').get(0).getContext('2d')
    var lineChartOptions = jQuery.extend(true, {}, areaChartOptions)
    var lineChartData = jQuery.extend(true, {}, areaChartData)
    lineChartData.datasets[0].fill = false;
    lineChartData.datasets[1].fill = false;
    lineChartOptions.datasetFill = false

    var lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: lineChartData,
        options: lineChartOptions
    })

}

Chart.defaults.font.family = 'Montserrat';
Chart.defaults.font.size = 15;


railMapContainer = document.querySelector('#rail-map');
respondToVisibility(railMapContainer, visible => {
    if (visible) {
        railMap.resize();
    }
});