
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuc3Nzc3MiLCJhIjoiY2w5NnF5cnh5MnBrbzNvcDg2NGZxMmdkZSJ9.t-C_lxlkb_FxdbZWQ7Y70g';
const railMap = new mapboxgl.Map({
    container: 'rail-map',
    style: 'mapbox://styles/dansssss/cl972aw08000g14ofpbilwkgy',
    center: [144.956785, -37.812000],
    zoom: 12
});

railMap.on('render', function () {
    railMap.resize();
});

railMap.on('load', e => {
  let layers = [{
      "name": "Electric",
      "color": "#6db06d"
    },
    {
      "name": "Not electric & unknown",
      "color": "#d2b74b"
    }
  ];
  let legend = document.querySelector('#legend');

    for (let layer of layers) {
      let item = document.createElement('div');

      let key = document.createElement('span');
      key.classList.add('legend-key');
      key.style.backgroundColor = layer.color;

      let value = document.createElement('span');
      value.innerHTML = layer.name;

      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    }
  });


railMapContainer = document.querySelector('#rail-map');
respondToVisibility(railMapContainer, visible => {
    if (visible) {
        railMap.resize();
    }
});