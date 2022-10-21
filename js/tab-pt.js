
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JvdXA5MiIsImEiOiJjbDk3YzEyaGIyd2lqM3VteDV4Nmtqd3ZnIn0.f3fuko4inv9oX1FwG5DZcw';
let ptMap = new mapboxgl.Map({
    container: 'bus-map',
    style: 'mapbox://styles/group92/cl9iwhbdt000115nzsxnrxmmz',
    center: [144.956785, -37.812000],
    zoom: 11.9
});

ptMap.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        flyTo: {
            zoom: 13.5
        }
    })
);
ptMap.addControl(new mapboxgl.NavigationControl());
ptMap.addControl(new mapboxgl.ScaleControl({
    maxWidth: 200,
}));

const allLayers = {
    "Bus": [
        'ptv-metro-bus-stop',
        'ptv-metro-bus-route'
    ],
    "Tram": [
        'ptv-metro-tram-stop',
        'ptv-metro-tram-route'
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

const busRouteStops = {};
const busRouteProps = {};
const tramRouteStops = {};
const tramRouteProps = {};

const routeStops = {
    'Bus': busRouteStops,
    'Tram': tramRouteStops,
}
const routeProps = {
    'Bus': busRouteProps,
    'Tram': tramRouteProps,
}

let currRouteProps = routeProps['Bus'];

let routeSelectize = $('#pt-route-select').selectize({
    maxItems: 1,
    valueField: 'id',
    labelField: 'text',
    searchField: 'text',
    sortField: 'id',
    create: false,
})[0].selectize;

let modeSelectize = $('#pt-mode-select').selectize({
    maxItems: 1,
    valueField: 'mode',
    labelField: 'mode',
    searchField: 'mode',
    options: [
        {mode: 'Bus'},
        {mode: 'Tram'},
        {mode: 'Train'},
    ],
    items: ['Bus'],
    create: false,
})[0].selectize;

modeSelectize.on('change', function(value) {
    routeSelectize.clear(true);
    routeSelectize.clearOptions(true);
    routeSelectize.addOption(Object.values(routeProps[value]))
});

$('#clear-button').on('click', () => {
    // routeSelectize.clear(false);
    $('#routes-list').empty();
});

ptMap.on('load', () => {

    let busStopFeats = ptMap.querySourceFeatures(
        'composite',
        {sourceLayer: 'PTV_METRO_BUS_STOP-82rco0'}
    );
    busStopFeats.forEach((feat) => {
        let routes = feat.properties['ROUTEUSSP'].split(',');
        routes.forEach((route) => {
            if (route in busRouteStops) {
                busRouteStops[route].add(feat.properties['STOP_ID'])
            } else {
                busRouteStops[route] = new Set([feat.properties['STOP_ID']]);
            }
        });
    });
    let busRouteFeats = ptMap.querySourceFeatures(
        'composite',
        {sourceLayer: 'PTV_METRO_BUS_ROUTE-cgxses'}
    );
    busRouteFeats.forEach((feat) => {
        let routeID = feat.properties['ROUTESHTNM']
        let routeName = feat.properties['ROUTELONGN']
        busRouteProps[routeID] = {
            'id': routeID,
            'name': routeName,
            'text': routeID + ' ' + routeName
        };
    });

    let tramStopFeats = ptMap.querySourceFeatures(
        'composite',
        {sourceLayer: 'PTV_METRO_TRAM_STOP-0a76zk'}
    );
    tramStopFeats.forEach((feat) => {
        let routes = feat.properties['ROUTEUSSP'].split(',');
        routes.forEach((route) => {
            if (route in tramRouteStops) {
                tramRouteStops[route].add(feat.properties['STOP_ID'])
            } else {
                tramRouteStops[route] = new Set([feat.properties['STOP_ID']]);
            }
        });
    });
    let tramRouteFeats = ptMap.querySourceFeatures(
        'composite',
        {sourceLayer: 'PTV_METRO_TRAM_ROUTE-9xqbxk'}
    );
    tramRouteFeats.forEach((feat) => {
        let routeID = feat.properties['ROUTESHTNM']
        let routeName = feat.properties['ROUTELONGN']
        tramRouteProps[routeID] = {
            'id': routeID,
            'name': routeName,
            'text': routeID + ' ' + routeName
        };
    });

    routeSelectize.addOption(Object.values(routeProps['Bus']));
    console.log(busRouteProps);
    console.log(tramRouteProps);
});

ptMap.on('mouseenter', allLayers['Bus'], () => {
    ptMap.getCanvas().style.cursor = 'pointer';
});

ptMap.on('mouseleave', allLayers['Bus'], () => {
    ptMap.getCanvas().style.cursor = '';
});

ptMap.on('mouseenter', allLayers['Tram'], () => {
    ptMap.getCanvas().style.cursor = 'pointer';
});

ptMap.on('mouseleave', allLayers['Tram'], () => {
    ptMap.getCanvas().style.cursor = '';
});


Object.entries(allLayers).forEach(([key, layers]) => {
    let stopLayer = layers[0];
    let routeLayer = layers[1];

    ptMap.on('click', stopLayer, (e) => {
        ptMap.setFilter(routeLayer, null);
        let busStopID = e.features[0].properties['STOP_ID']
        ptMap.setFilter(
            stopLayer,
            ['in', 'STOP_ID', busStopID]
        );
        ptMap.setFilter(
            routeLayer,
            ['in', 'ROUTESHTNM', ...e.features[0].properties['ROUTEUSSP'].split(',')]
        );
    });

    ptMap.on('click', routeLayer, (e) => {
        let stopfeats = ptMap.queryRenderedFeatures(
            e.point,
            {layers: [stopLayer]}
        );

        if (stopfeats.length === 0) {
            let routes = e.features.map(feat => feat.properties['ROUTESHTNM']);
            ptMap.setFilter(
                routeLayer,
                ['in', 'ROUTESHTNM', ...routes]
            );

            let stops = new Set();
            routes.forEach((route) => {
                routeStops[currLayers][route].forEach(stop => stops.add(stop));
            });
            ptMap.setFilter(
                stopLayer,
                ['in', 'STOP_ID', ...stops]
            );
        }
    });
});

ptMap.on('click', (e) => {
    let feats = ptMap.queryRenderedFeatures(
        e.point,
        {layers: allLayers[currLayers]}
    );

    if (feats.length === 0) {
        allLayers[currLayers].forEach(layer => ptMap.setFilter(layer, null))
    }
});

let toggleLayers = function (toHide, toVisi) {
    allLayers[toHide].forEach(layer => ptMap.setLayoutProperty(layer, 'visibility', 'none'));
    allLayers[toVisi].forEach(layer => ptMap.setLayoutProperty(layer, 'visibility', 'visible'));
};


$('.pt-layer-button').on('click', (e) => {
    let clicked = $(e.target);
    if (!clicked.hasClass('current')) {
        let current = $('.pt-layer-button.current')
        if (current.text() === 'Bus') {
            current.toggleClass('bus-selected bus-linear-background');
        } else if (current.text() === 'Tram') {
            current.toggleClass('tram-selected tram-linear-background');
        }
        if (clicked.text() === 'Bus') {
            clicked.toggleClass('bus-linear-background bus-selected');
        } else if (clicked.text() === 'Tram') {
            clicked.toggleClass('tram-linear-background tram-selected');
        }
        clicked.toggleClass('current');
        current.toggleClass('current');
        currLayers = clicked.text();
        currRouteProps = routeProps[clicked.text()];
        toggleLayers(current.text(), clicked.text())
    }
});

let addRouteItems = function (mode, routes) {
    let routeList = $('#routes-list');
    let itemTitleBg;
    let itemIconBg;
    let icon;
    if (mode === 'Bus') {
        itemTitleBg = 'bus-linear-background';
        itemIconBg = 'bus-bg'
        icon = 'icon-bus';
    } else {
        itemTitleBg = 'tram-linear-background';
        itemIconBg = 'tram-bg'
        icon = 'icon-tram';
    }

    routes.forEach((route) => {
        let item = $(`
        <li class="route-item">
            <div class="route-item-title ${itemTitleBg}">
                <div class="${itemIconBg} route-item-icon">
                    <i class="icon ${icon}"></i>
                    ${route['id']}
                </div>
                ${route['name']}
                <i class="icon fa-solid fa-angle-down fa-lg"></i>
            </div>
            <div class="route-item-content collapse">
                Route content
            </div>
        </li>
        `);

        item.children().first().on('click', (e) => {
            let content = $(e.currentTarget).next();
            $(e.currentTarget).toggleClass('route-item-title bus-route-title-expend');
            $(e.currentTarget).toggleClass(`${itemTitleBg} ${itemIconBg}`);
            content.toggleClass('collapse expand');

            let icon = $(e.currentTarget).children().last();
            icon.toggleClass('fa-angle-down fa-angle-up')
        });

        routeList.append(item);
    });
}



routeSelectize.on('change', (value) => {
    let mode = modeSelectize.getValue();
    $('#routes-list').empty();
    addRouteItems(mode, [routeProps[mode][value]]);
});

