
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JvdXA5MiIsImEiOiJjbDk3YzEyaGIyd2lqM3VteDV4Nmtqd3ZnIn0.f3fuko4inv9oX1FwG5DZcw';
let ptMap = new mapboxgl.Map({
    container: 'pt-map',
    style: 'mapbox://styles/group92/cl9iwhbdt000115nzsxnrxmmz/draft',
    center: [144.956785, -37.812000],
    zoom: 11.9
});

ptMap.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        flyTo: {
            zoom: 13.5
        },
        language: 'en',
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
    ],
    "Train": [
        'ptv-metro-train-station',
        'ptv-train-track'
    ]
};

let currLayers = 'Bus';

ptMap.on('render', function () {
    ptMap.resize();
});

respondToVisibility($('#pt-map')[0], visible => {
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
        {mode: 'Tram'}
    ],
    items: ['Bus'],
    create: false,
})[0].selectize;

modeSelectize.on('change', function (value) {
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
        {sourceLayer: 'PTV_METRO_BUS_STOP-849v0z'}
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
        {sourceLayer: 'PTV_METRO_BUS_ROUTE-4kof5w'}
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
        {sourceLayer: 'PTV_METRO_TRAM_STOP-diuya1'}
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
        {sourceLayer: 'Order_tram_final-5mguxu'}
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
    // console.log(busRouteProps);
    // console.log(tramRouteProps);
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

ptMap.on('mouseenter', allLayers['Train'], () => {
    ptMap.getCanvas().style.cursor = 'pointer';
});

ptMap.on('mouseleave', allLayers['Train'], () => {
    ptMap.getCanvas().style.cursor = '';
});


let ptPopup;

Object.entries([allLayers['Bus'], allLayers['Tram']]).forEach(([key, layers]) => {
    let stopLayer = layers[0];
    let routeLayer = layers[1];
    let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        maxWidth: '600px'
    });

    ptMap.on('mouseenter', stopLayer, (e) => {
        const coord = e.features[0].geometry.coordinates.slice();
        const name = e.features[0].properties['STOP_NAME'];

        while (Math.abs(e.lngLat.lng - coord[0]) > 180) {
            coord[0] += e.lngLat.lng > coord[0] ? 360 : -360;
        }

        let html = `
            <span class="pt-popup-content">${name}</span>
        `;

        popup.setLngLat(coord).setHTML(html).addTo(ptMap);
    });

    ptMap.on('mouseleave', stopLayer, () => {
        popup.remove();
    });

    ptMap.on('click', stopLayer, (e) => {
        const coord = e.features[0].geometry.coordinates.slice();
        const prop = e.features[0].properties;

        while (Math.abs(e.lngLat.lng - coord[0]) > 180) {
            coord[0] += e.lngLat.lng > coord[0] ? 360 : -360;
        }

        let html = `
            <div class="pt-popup-content">
                Stop: ${prop['STOP_NAME']} <br>
                Route: ${prop['ROUTEUSSP'].replaceAll(',', ', ')}
            </div>
        `;

        ptPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: true,
            maxWidth: '600px'
        });

        ptPopup.setLngLat(coord)
            .setHTML(html)
            .addTo(ptMap);
    });

    ptMap.on('click', stopLayer, (e) => {
        ptMap.setFilter(routeLayer, null);
        let busStopID = e.features[0].properties['STOP_ID']
        ptMap.setFilter(
            stopLayer,
            ['in', 'STOP_ID', busStopID]
        );

        let routes = e.features[0].properties['ROUTEUSSP'].split(',')
        ptMap.setFilter(
            routeLayer,
            ['in', 'ROUTESHTNM', ...routes]
        );

        $('#routes-list').empty();
        routes.forEach((route) => {
            addRouteItem(currLayers, routeProps[currLayers][route]);
        })
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
        currRouteProps = routeProps[clicked.text()];
        toggleLayers(current.text(), clicked.text())
    }
});

let addRouteItem = function (mode, prop) {
    let routeList = $('#routes-list');
    let itemTitleBg;
    let itemIconBg;
    let icon;
    let routeID = prop['id'];
    if (mode === 'Bus') {
        itemTitleBg = 'bus-linear-background';
        itemIconBg = 'bus-bg';
        icon = 'icon-bus';
    } else {
        itemTitleBg = 'tram-linear-background';
        itemIconBg = 'tram-bg';
        icon = 'icon-tram';
    }

    let item = $(`
    <li class="route-item">
        <div class="route-item-title ${itemTitleBg}" data-mode="${mode}" data-route="${routeID}">
            <div class="${itemIconBg} route-item-icon">
                <i class="icon ${icon}"></i>
                ${prop['id']}
            </div>
            ${prop['name']}
            <i class="icon fa-solid fa-angle-down fa-lg"></i>
        </div>
        <div class="route-item-content collapse">
            Timetable:  
            <span class="timetable-link">
                Find more on Public Transport Victoria Timetable
                <i class="link-icon fa-solid fa-arrow-up-right-from-square"></i>
            </span>
            
        </div>
    </li>
    `);

    item.children().eq(0).on('click', (e) => {
        let content = $(e.currentTarget).next();
        $(e.currentTarget).toggleClass('route-item-title bus-route-title-expend');
        $(e.currentTarget).toggleClass(`${itemTitleBg} ${itemIconBg}`);
        content.toggleClass('collapse expand');

        $(e.currentTarget).children().last().toggleClass('fa-angle-down fa-angle-up');

        let mode = $(e.target).data('mode');
        let routeID = $(e.target).data('route');
        if (mode === 'Bus') {
            $('#pt-layer-bus-btn').click();
        } else {
            $('#pt-layer-tram-btn').click();
        }
        console.log(routeID);
        ptMap.setFilter(
            allLayers[mode][0],
            null
        );
        console.log(routeID);
        ptMap.setFilter(
            allLayers[mode][0],
            ['in', 'STOP_ID', ...routeStops[mode][routeID]]
        );
        ptMap.setFilter(
            allLayers[mode][1],
            null
        );
        ptMap.setFilter(
            allLayers[mode][1],
            ['in', 'ROUTESHTNM', `${routeID}`]
        );
        ptPopup.remove();
    });

    item.children().eq(1).find('span').on('click', () => {
        let text = 'You will be directed to:\n' +
            'https://www.ptv.vic.gov.au/timetables';
        if (confirm(text) === true) {
            let win = window.open('https://www.ptv.vic.gov.au/timetables');
            win.focus();
        }
    });

    routeList.append(item);
}

routeSelectize.on('change', (value) => {
    let mode = modeSelectize.getValue();
    $('#routes-list').empty();
    addRouteItem(mode, routeProps[mode][value]);
});



