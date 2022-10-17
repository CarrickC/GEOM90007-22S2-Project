
mapboxgl.accessToken = 'pk.eyJ1IjoiY2NhcnJpY2tjYyIsImEiOiJjbDkxaW0yc3AxYXJ3M3Z0NWc2a3d5d3RoIn0.DsBfI0AbR2c_ZEfvrUXNEA';
let busMap = new mapboxgl.Map({
    container: 'bus-map',
    style: 'mapbox://styles/ccarrickcc/cl91jeqf6001214mos5t57hx7/draft',
    center: [144.956785, -37.812000],
    zoom: 11.9
});

busMap.addControl(new mapboxgl.NavigationControl());
busMap.addControl(new mapboxgl.ScaleControl({
    maxWidth: 200,
}));

busLayers = [
    'ptv-metro-bus-route',
    'ptv-metro-bus-stop'
];

busMap.on('render', function () {
    busMap.resize();
});

respondToVisibility($('#bus-map')[0], visible => {
    if (visible) {
        busMap.resize();
    }
});


busRouteStops = {};
busRouteProps = {};
busStopProps = {};


busMap.on('load', () => {

    let busStopFeats = busMap.querySourceFeatures(
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

    let busRouteFeats = busMap.querySourceFeatures(
        'composite',
        {sourceLayer: 'PTV_METRO_BUS_ROUTE-cgxses'}
    );

    busRouteFeats.forEach((feat) => {
        busRouteProps[feat.properties['ROUTESHTNM']]  = feat.properties;
    });

});

busMap.on('mouseenter', busLayers, () => {
    busMap.getCanvas().style.cursor = 'pointer';
});

busMap.on('mouseleave', busLayers, () => {
    busMap.getCanvas().style.cursor = '';
});

busMap.on('click', 'ptv-metro-bus-stop', (e) => {
    busMap.setFilter('ptv-metro-bus-route', null);
    let busStopID = e.features[0].properties['STOP_ID']
    busMap.setFilter(
        'ptv-metro-bus-stop',
        ['in', 'STOP_ID', busStopID]
    );
    busMap.setFilter(
        'ptv-metro-bus-route',
        ['in', 'ROUTESHTNM', ...busStopProps[busStopID]['ROUTEUSSP'].split(',')]
    );
});

busMap.on('click', 'ptv-metro-bus-route', (e) => {
    let busStopfeats = busMap.queryRenderedFeatures(
        e.point,
        {layers: ['ptv-metro-bus-stop']}
    );

    if (busStopfeats.length === 0) {
        let routes = e.features.map(feat => feat.properties['ROUTESHTNM']);
        busMap.setFilter(
            'ptv-metro-bus-route',
            ['in', 'ROUTESHTNM', ...routes]
        );

        let stops = new Set();
        routes.forEach((route) => {
            busRouteStops[route].forEach(stop => stops.add(stop));
        });
        busMap.setFilter(
            'ptv-metro-bus-stop',
            ['in', 'STOP_ID', ...stops]
        );
    }

    console.log(e.features);
});

busMap.on('click', (e) => {
    let feats = busMap.queryRenderedFeatures(
        e.point,
        {layers: busLayers}
    );

    if (feats.length === 0) {
        busLayers.forEach(layer => busMap.setFilter(layer, null))
    }
});

busRouteTitles = $('.bus-route-title')
busRouteTitles.on('click', (e) => {
    let content = $(e.currentTarget).next();
    $(e.currentTarget).toggleClass('bus-route-title bus-route-title-expend');
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