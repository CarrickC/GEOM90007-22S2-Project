
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
        'id': "chart1"
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
    },{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [144.962594, -37.809939]
      },
      'properties': {
        'address': 'Melbourne Central',
        'rail': 'Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein',
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
      `<div class="content">
      <h4>${currentFeature.properties.address}</h4><div>${currentFeature.properties.rail}</div>
      <canvas id={currentFeature.properties.id} width="100" height="100"></canvas>
        </div>`
    )
    .addTo(railMap);
}

// popup table
let table1 = [{
    "year": "2018",
    "entries": 289550
  },
  {
    "year": "2019",
    "entries": 225150
  },
  {
    "year": "2020",
    "entries": 101750
  }

];

let chart1 = new Chart('chart1', {
  type: 'bar',
  data: {
    datasets: [{
      data: table1,
      parsing: {
        xAxisKey: 'year',
        yAxisKey: 'entries'
      },
      categoryPercentage: 0.75,
      barPercentage: 1,
      backgroundColor: "green"
    }]
  },
  options: {
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {},
        title: {}
      },
      y: {
        grid: {},
        ticks: {},
        title: {}
      }
    },
    animation: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Annual entries from 2018 to 2020'
      },
      tooltip: {
        xAlign: 'center',
        yAlign: 'bottom',
        displayColors: false,
        titleAlign: 'center',
        bodyAlign: 'center'
      }
    }
  }
});

Chart.defaults.font.family = 'Montserrat';
Chart.defaults.font.size = 15;

railMapContainer = document.querySelector('#rail-map');

respondToVisibility(railMapContainer, visible => {
    if (visible) {
        railMap.resize();
    }
});