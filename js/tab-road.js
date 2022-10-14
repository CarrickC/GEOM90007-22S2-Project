
mapboxgl.accessToken = 'pk.eyJ1IjoieXVhbnpoaXMiLCJhIjoiY2w5OGFucnBxMGl0bDN3bjRwemFiZmh2YiJ9.MV-weoc9lK2N67lgxk51bg';
const parkingMap = new mapboxgl.Map({
    container: 'parking-map',
    style: 'mapbox://styles/yuanzhis/cl98jzm2o003k14qu1826uxyw/draft',
    center: [144.956785, -37.812000],
    zoom: 14
});

parkingMap.on('render', function () {
    parkingMap.resize();
});

const popup = new mapboxgl.Popup()
parkingMap.on('mouseenter', 'on-street-parking-bays', e => {
    parkingMap.getCanvas().style.cursor = 'pointer';
    popup
    .setLngLat(e.lngLat)
    .setHTML(e.features[0].properties.rd_seg_dsc)
    .addTo(parkingMap);
});

parkingMap.on('mouseleave', 'on-street-parking-bays', e => {
    parkingMap.getCanvas().style.cursor = '';
    mapboxgl.visible = false
    popup.remove()
});

parkingMapContainer = document.querySelector('#parking-map');
respondToVisibility(parkingMapContainer, visible => {
    if (visible) {
        parkingMap.resize();
    }
});