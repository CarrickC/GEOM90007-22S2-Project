
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
        'id': 'chart1'
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
        'id': 'chart1'
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
        'id': 'chart1'
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
        'id': 'chart1'
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
        'id': 'chart1'
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
        'id': 'chart1'
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
        'id': 'chart1'
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
        'id': 'chart1'
      }
    },{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [144.962594, -37.809939]
      },
      'properties': {
        'address': 'Melbourne Central',
        'rail': 'Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein',
        'id': 'chart1'
      }
    },{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [144.966964, -37.818305]
      },
      'properties': {
        'address': 'Flinders Street',
        'rail': 'Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein',
        'id': 'chart1'
      }
    },{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [144.972911, -37.811054]
      },
      'properties': {
        'address': 'Parliament',
        'rail': 'Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein',
        'id': 'chart1'
      }
    },{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [144.984098, -37.816527]
      },
      'properties': {
        'address': 'Jolimont',
        'rail': 'Mernda, Hurstbridge',
        'id': 'chart1'
      }
    }
  ]
};
stations.features.forEach((station, i) => {
  station.properties.id = i;
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
      var areaChartData = {
      		  labels: ['2018', '2019', '2020'],
      		  datasets: [{
      		      label: 'flow',
      		      backgroundColor: 'rgba(60,141,188,0.9)',
      		      borderColor: 'rgba(60,141,188,0.8)',
      		      pointRadius: false,
      		      pointColor: '#3b8bba',
      		      pointStrokeColor: 'rgba(60,141,188,1)',
      		      pointHighlightFill: '#fff',
      		      pointHighlightStroke: 'rgba(60,141,188,1)',
      		      data: [289550, 225150, 101750]
      		    },{}
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


      		var chart1Canvas = $('#chart1').get(0).getContext('2d')
      		var chart1Options = jQuery.extend(true, {}, areaChartOptions)
      		var chart1Data = jQuery.extend(true, {}, areaChartData)
      		chart1Data.datasets[0].fill = false;
      		chart1Data.datasets[1].fill = false;
      		chart1Options.datasetFill = false

      		var chart1 = new Chart(chart1Canvas, {
      		  type: 'bar',
      		  data: chart1Data,
      		  options: chart1Options
      		})

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
      <h4>${currentFeature.properties.address}</h4><div>${currentFeature.properties.rail}</div>
      <div>
      <div class="chart"><canvas id="chart1"></canvas></div>
        </div>`
    )
    .addTo(railMap);
}

// popup table


Chart.defaults.font.family = 'Montserrat';
Chart.defaults.font.size = 15;

railMapContainer = document.querySelector('#rail-map');

respondToVisibility(railMapContainer, visible => {
    if (visible) {
        railMap.resize();
    }
});