
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

railMap.on('load', e => {
railMap.addSource('stations', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [{
          'type': 'Feature',
          'properties': {
            'description': '<strong>South Kensington</strong><p>Williamstown,Werribee</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.925469, -37.799531]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Kensington</strong><p>Craigieburn</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.930524, -37.79378]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Macaulay</strong><p>Upfield</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.936166, -37.794267]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Flemington Bridge</strong><p>Upfield</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.939323, -37.78814]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Royal Park</strong><p>Upfield</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.952301, -37.781193]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>North Melbourne</strong><p>Flemington, Sunbury, Upfield, Werribee, Williamstown, Craigieburn</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.94257, -37.807419]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Southern Cross</strong><p>Belgrave, Craigieburn, Cranbourne, Flemington, Frankston, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sandringham, Sunbury, Upfield, Werribee, Williamstown, Alamein</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.951411, -37.817936]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Flagstaff</strong><p>Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.955654, -37.811981]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Melbourne Central</strong><p>Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.962594, -37.809939]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Flinders Street</strong><p>Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.966964, -37.818305]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Parliament</strong><p>Belgrave, Craigieburn, Cranbourne, Flemington, Glen Waverley, Hurstbridge, Lilydale, Mernda, Pakenham, Sunbury, Upfield, Alamein</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.972911, -37.811054]
          }
        },
        {
          'type': 'Feature',
          'properties': {
            'description': '<strong>Jolimont</strong><p>Mernda,Hurstbridge</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [144.984098, -37.816527]
          }
        }
      ]
    }
  });
  // Add a layer showing the stations.
  railMap.addLayer({
    'id': 'stations',
    'type': 'circle',
    'source': 'stations',
    'paint': {
      'circle-color': '#cd4747',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff'
    }
  });

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  railMap.on('mouseenter', 'stations', (e) => {
    // Change the cursor style as a UI indicator.
    railMap.getCanvas().style.cursor = 'pointer';

    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(railMap);
  });

  railMap.on('mouseleave', 'stations', () => {
    railMap.getCanvas().style.cursor = '';
    popup.remove();
  });

  });

railMapContainer = document.querySelector('#rail-map');


respondToVisibility(railMapContainer, visible => {
    if (visible) {
        railMap.resize();
    }
});