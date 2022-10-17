
mapboxgl.accessToken = 'pk.eyJ1IjoiY2NhcnJpY2tjYyIsImEiOiJjbDkxaW0yc3AxYXJ3M3Z0NWc2a3d5d3RoIn0.DsBfI0AbR2c_ZEfvrUXNEA';
let ptMap = new mapboxgl.Map({
    container: 'bus-map',
    style: 'mapbox://styles/ccarrickcc/cl91jeqf6001214mos5t57hx7',
    center: [144.956785, -37.812000],
    zoom: 11.9
});

ptMap.addControl(new mapboxgl.NavigationControl());
ptMap.addControl(new mapboxgl.ScaleControl({
    maxWidth: 200,
}));

const allLayers = {
    "Bus": [
        'ptv-metro-bus-route',
        'ptv-metro-bus-stop'
    ],
    "Tram": [
        'ptv-metro-tram-route',
        'ptv-metro-tram-stop'
    ],
    "Train": [
        'ptv-train-track-centreline',
        'ptv-metro-train-station'
    ]
};

let currLayers = 'Bus';

ptMap.on('render', function () {
    ptMap.resize();
});

respondToVisibility($('#bus-map')[0], visible => {
    if (visible) {
        ptMap.resize();
    }
});


busRouteStops = {};
busRouteProps = {};
busStopProps = {};


ptMap.on('load', () => {

    let busStopFeats = ptMap.querySourceFeatures(
        'composite',
        {sourceLayer: 'PTV_METRO_BUS_STOP-82rco0'}
    );

    // console.log(busStopFeats);

    busStopFeats.forEach((feat) => {
        // console.log(feat.properties);
        let routes = feat.properties['ROUTEUSSP'].split(',');
        routes.forEach((route) => {
            if (route in busRouteStops) {
                busRouteStops[route].add(feat.properties['STOP_ID'])
            } else {
                busRouteStops[route] = new Set([feat.properties['STOP_ID']]);
            }
        });

        busStopProps[feat.properties['STOP_ID']] = feat.properties
    });

    let busRouteFeats = ptMap.querySourceFeatures(
        'composite',
        {sourceLayer: 'PTV_METRO_BUS_ROUTE-cgxses'}
    );

    busRouteFeats.forEach((feat) => {
        busRouteProps[feat.properties['ROUTESHTNM']]  = feat.properties;
    });

});

ptMap.on('mouseenter', allLayers['Bus'], () => {
    ptMap.getCanvas().style.cursor = 'pointer';
});

ptMap.on('mouseleave', allLayers['Bus'], () => {
    ptMap.getCanvas().style.cursor = '';
});

ptMap.on('click', 'ptv-metro-bus-stop', (e) => {
    ptMap.setFilter('ptv-metro-bus-route', null);
    let busStopID = e.features[0].properties['STOP_ID']
    ptMap.setFilter(
        'ptv-metro-bus-stop',
        ['in', 'STOP_ID', busStopID]
    );
    ptMap.setFilter(
        'ptv-metro-bus-route',
        ['in', 'ROUTESHTNM', ...busStopProps[busStopID]['ROUTEUSSP'].split(',')]
    );
});

ptMap.on('click', 'ptv-metro-bus-route', (e) => {
    let busStopfeats = ptMap.queryRenderedFeatures(
        e.point,
        {layers: ['ptv-metro-bus-stop']}
    );

    if (busStopfeats.length === 0) {
        let routes = e.features.map(feat => feat.properties['ROUTESHTNM']);
        ptMap.setFilter(
            'ptv-metro-bus-route',
            ['in', 'ROUTESHTNM', ...routes]
        );

        let stops = new Set();
        routes.forEach((route) => {
            busRouteStops[route].forEach(stop => stops.add(stop));
        });
        ptMap.setFilter(
            'ptv-metro-bus-stop',
            ['in', 'STOP_ID', ...stops]
        );
    }

    console.log(e.features);
});

ptMap.on('click', (e) => {
    let feats = ptMap.queryRenderedFeatures(
        e.point,
        {layers: allLayers['Bus']}
    );

    if (feats.length === 0) {
        allLayers['Bus'].forEach(layer => ptMap.setFilter(layer, null))
    }
});

let toggleLayers = function (toHide, toVisi) {
    allLayers[toHide].forEach(layer => ptMap.setLayoutProperty(layer, 'visibility', 'none'));
    allLayers[toVisi].forEach(layer => ptMap.setLayoutProperty(layer, 'visibility', 'visible'));
};

$layerButtons = $('.pt-layer-button')
$layerButtons.on('click', (e) => {
    let clicked = $(e.target);
    if (!clicked.hasClass('current')) {
        let current = $('.pt-layer-button.current')
        if (current.text() === 'Bus') {
            current.toggleClass('bus-selected bus-linear-background');
        } else if (current.text() === 'Tram') {
            current.toggleClass('tram-selected tram-linear-background');
        } else if (current.text() === 'Train') {
            current.toggleClass('train-selected train-linear-background');
        }
        if (clicked.text() === 'Bus') {
            clicked.toggleClass('bus-linear-background bus-selected');
        } else if (clicked.text() === 'Tram') {
            clicked.toggleClass('tram-linear-background tram-selected');
        } else if (clicked.text() === 'Train') {
            clicked.toggleClass('train-linear-background train-selected');
        }
        clicked.toggleClass('current');
        current.toggleClass('current');
        currLayers = clicked.text();
        toggleLayers(current.text(), clicked.text())
    }
});

$('.bus-route-title').on('click', (e) => {
    let content = $(e.currentTarget).next();
    $(e.currentTarget).toggleClass('bus-route-title bus-route-title-expend');
    $(e.currentTarget).toggleClass('bus-linear-background');
    content.toggleClass('collapse expand');

    let icon = $(e.currentTarget).children().last();
    icon.toggleClass('fa-angle-down fa-angle-up')
});


$('#pt-mode-select').selectize({
    maxItems: 1,
    valueField: 'id',
    labelField: 'id',
    searchField: 'id',
    options: [
        {id: 'Bus'},
        {id: 'Tram'},
        {id: 'Train'},
    ],
    items: ['Bus'],
    create: false,
});

$('#pt-route-select').selectize({
    maxItems: 1,
    valueField: 'id',
    labelField: 'title',
    searchField: 'title',
    options: [
        {id: 1, title: '402 Oh Yeah'}
    ],
    create: false,
});

