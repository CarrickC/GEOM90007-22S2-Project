
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

railMapContainer = document.querySelector('#rail-map');


respondToVisibility(railMapContainer, visible => {
    if (visible) {
        railMap.resize();
    }
});