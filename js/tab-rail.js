
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
let table_annual = [
              {
                "2018": 289550,
                "2019": 225150,
                "2020": 101750,
                "Stop_ID": 19972,
                "Stop_name": "Macaulay",
                "Stop_lat": -37.79426673,
                "Stop_long": 144.9361663,
                "Average": 205483.3333,
                "daily": 562.9680365
              },
              {
                "2018": 286650,
                "2019": 269450,
                "2020": 94250,
                "Stop_ID": 19971,
                "Stop_name": "Flemington Bridge",
                "Stop_lat": -37.78813995,
                "Stop_long": 144.9393233,
                "Average": 216783.3333,
                "daily": 593.9269406
              },
              {
                "2018": 533050,
                "2019": 488800,
                "2020": 302600,
                "Stop_ID": 20041,
                "Stop_name": "Kensington",
                "Stop_lat": -37.79378022,
                "Stop_long": 144.9305244,
                "Average": 441483.3333,
                "daily": 1209.543379
              },
              {
                "2018": 412850,
                "2019": 4038750,
                "2020": 127950,
                "Stop_ID": 20026,
                "Stop_name": "South Kensington",
                "Stop_lat": -37.79953087,
                "Stop_long": 144.925469,
                "Average": 1526516.667,
                "daily": 4182.237443
              },
              {
                "2018": 4854950,
                "2019": 441650,
                "2020": 103900,
                "Stop_ID": 19841,
                "Stop_name": "Flagstaff",
                "Stop_lat": -37.81198131,
                "Stop_long": 144.9556538,
                "Average": 1800166.667,
                "daily": 4931.96347
              },
              {
                "2018": 10124200,
                "2019": 181900,
                "2020": 327900,
                "Stop_ID": 19843,
                "Stop_name": "Parliament",
                "Stop_lat": -37.81105406,
                "Stop_long": 144.9729109,
                "Average": 3544666.667,
                "daily": 9711.415525
              },
              {
                "2018": 1497300,
                "2019": 10865600,
                "2020": 2213650,
                "Stop_ID": 19973,
                "Stop_name": "North Melbourne",
                "Stop_lat": -37.80630984,
                "Stop_long": 144.9415102,
                "Average": 4858850,
                "daily": 13311.91781
              },
              {
                "2018": 15250700,
                "2019": 184700,
                "2020": 70900,
                "Stop_ID": 19842,
                "Stop_name": "Melbourne Central",
                "Stop_lat": -37.80993877,
                "Stop_long": 144.9625935,
                "Average": 5168766.667,
                "daily": 14161.00457
              },
              {
                "2018": 1096750,
                "2019": 7646300,
                "2020": 8528000,
                "Stop_ID": 19979,
                "Stop_name": "Jolimont",
                "Stop_lat": -37.81652702,
                "Stop_long": 144.9840983,
                "Average": 5757016.667,
                "daily": 15772.6484
              },
              {
                "2018": 28320650,
                "2019": 527250,
                "2020": 1378000,
                "Stop_ID": 19854,
                "Stop_name": "Flinders Street",
                "Stop_lat": -37.81830513,
                "Stop_long": 144.9669643,
                "Average": 10075300,
                "daily": 27603.56164
              },
              {
                "2018": 19551450,
                "2019": 21503500,
                "2020": 1292650,
                "Stop_ID": 22180,
                "Stop_name": "Southern Cross",
                "Stop_lat": -37.81793643,
                "Stop_long": 144.9514112,
                "Average": 14115866.67,
                "daily": 38673.60731
              }
            ];

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
      listing.classList.add('active');
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
      closeOnClick: false
    })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(
      `<h4>${currentFeature.properties.address}</h4><div>${currentFeature.properties.rail}</div>`
    )
    .addTo(railMap);
}

railMapContainer = document.querySelector('#rail-map');

respondToVisibility(railMapContainer, visible => {
    if (visible) {
        railMap.resize();
    }
});