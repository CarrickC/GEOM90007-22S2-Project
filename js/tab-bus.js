
mapboxgl.accessToken = 'pk.eyJ1IjoiY2NhcnJpY2tjYyIsImEiOiJjbDkxaW0yc3AxYXJ3M3Z0NWc2a3d5d3RoIn0.DsBfI0AbR2c_ZEfvrUXNEA';
const busMap = new mapboxgl.Map({
    container: 'bus-map',
    style: 'mapbox://styles/ccarrickcc/cl91jeqf6001214mos5t57hx7',
    center: [144.956785, -37.812000],
    zoom: 12
});

busMap.on('render', function () {
    busMap.resize();
});

busMapContainer = document.querySelector('#bus-map');
respondToVisibility(busMapContainer, visible => {
    if (visible) {
        busMap.resize();
    }
});