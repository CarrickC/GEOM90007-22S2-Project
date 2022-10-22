mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JvdXA5MiIsImEiOiJjbDk3YzEyaGIyd2lqM3VteDV4Nmtqd3ZnIn0.f3fuko4inv9oX1FwG5DZcw';
const parkMap = new mapboxgl.Map({
    container: 'park-map',
    style: 'mapbox://styles/group92/cl9if3y0v000115mk30nlomdj'
});
//pmap.boxZoom.disable();

parkMap.on('render', function () {
    parkMap.resize();
});

respondToVisibility($('#park-map')[0], visible => {
    if (visible) {
        parkMap.resize();
    }
});

// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
    maxWidth: '500px',
    closeButton: false
});
// Add the control to the map.
parkMap.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);
parkMap.on('load', e => {
    // the rest of the code goes in here
    parkMap.on('click', 'on-street-parking-bays-cjix2f', e => {
        console.log(e.features[0].properties);
        new mapboxgl.Popup({maxWidth: '500px'})
            .setLngLat(e.lngLat)
            .setHTML(`
            <div class='parking-popup-content'>
            Address:${e.features[0].properties.rd_seg_dsc}
            </div>
            `)
            .addTo(parkMap);
        // the code in step 3 below must go in here
    });
    const canvas = parkMap.getCanvasContainer();
    let start;
    let current;
    let box;

    canvas.addEventListener('mousedown', mouseDown, true);

    function mousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return new mapboxgl.Point(
            e.clientX - rect.left - canvas.clientLeft,
            e.clientY - rect.top - canvas.clientTop
        );
    }

    function mouseDown(e) {
// Continue the rest of the function if the shiftkey is pressed.
        if (!(e.shiftKey && e.button === 0)) return;

// Disable default drag zooming when the shift key is held down.
        parkMap.dragPan.disable();

// Call functions for the following events
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('keydown', onKeyDown);

// Capture the first xy coordinates
        start = mousePos(e);
    }

    function onMouseMove(e) {
// Capture the ongoing xy coordinates
        current = mousePos(e);

// Append the box element if it doesnt exist
        if (!box) {
            box = document.createElement('div');
            box.classList.add('boxdraw');
            canvas.appendChild(box);
        }

        const minX = Math.min(start.x, current.x),
            maxX = Math.max(start.x, current.x),
            minY = Math.min(start.y, current.y),
            maxY = Math.max(start.y, current.y);

// Adjust width and xy position of the box element ongoing
        box.style.transform = `translate(${minX}px, ${minY}px)`;
        box.style.width = maxX - minX + 'px';
        box.style.height = maxY - minY + 'px';
    }

    function onMouseUp(e) {
// Capture xy coordinates
        finish([start, mousePos(e)]);
    }

    function onKeyDown(e) {
// If the ESC key is pressed
        if (e.keyCode === 27) finish();
    }

    function finish(bbox) {
// Remove these events now that finish has been called.
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('mouseup', onMouseUp);

        if (box) {
            box.parentNode.removeChild(box);
            box = null;
        }

// If bbox exists. use this value as the argument for `queryRenderedFeatures`
        if (bbox) {
            const features = parkMap.queryRenderedFeatures(bbox, {
                layers: ['on-street-parking-bays-cjix2f']
            });

            // if (features.length >= 1000) {
            //     return window.alert('Select a smaller number of features');
            // }


            const ids = features.map((feature) => feature.properties['bay_id']);

            parkMap.setFilter('on-street-parking-bays-cjix2f', ['in', 'bay_id', ...ids]);
        }

        parkMap.dragPan.enable();
    }


    parkMap.on('click', 'off-street-car-parks-with-cap-aw9fts', e => {
        console.log(e.features[0].properties);
        new mapboxgl.Popup({
            maxWidth: '500px',
            closeButton: false,
            closeOnClick: true,
        })
            .setLngLat(e.lngLat)
            .setHTML(`
                <div class="parking-popup-content">
                    Address:  ${e.features[0].properties['street_nam']}<br>
                    Available space: ${parseInt(e.features[0].properties.parking_sp)}
                </div>
            `)

            .addTo(parkMap);
        // the code in step 3 below must go in here
    });
});

parkMap.on('click', (e) => {
    let feats = parkMap.queryRenderedFeatures(
        e.point,
        {layers: ['on-street-parking-bays-cjix2f']}
    );

    if (feats.length === 0) {
        parkMap.setFilter('on-street-parking-bays-cjix2f', null);
    }
});
parkMap.on('mousemove', (e) => {
    const features = parkMap.queryRenderedFeatures(e.point, {
        layers: ['on-street-parking-bays-cjix2f']
    });

    // Change the cursor style as a UI indicator.
    parkMap.getCanvas().style.cursor = features.length ? 'pointer' : '';

    if (!features.length) {
        popup.remove();
        return;
    }

    popup
        .setLngLat(e.lngLat)
        .setText(features[0].properties.rd_seg_dsc)
        .addTo(parkMap);
});
parkMap.on('idle', () => {
// If these two layers were not added to the map, abort
    if (!parkMap.getLayer('on-street-parking-bays-cjix2f') || !parkMap.getLayer('off-street-car-parks-with-cap-aw9fts')) {
        return;
    }

// Enumerate ids of the layers.
    const toggleableLayerIds =
        [
            'on-street-parking-bays-cjix2f',


            'off-street-car-parks-with-cap-aw9fts'
        ]
    ;

// Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
// Skip layers that already have a button set up.
        if (document.getElementById(id)) {
            console.log(id);
            continue;
        }
        //link = document.createElement('a');
// Create a link.
    const link = document.createElement('a');
    link.id = id;
    link.href = '#';
    if (id === 'on-street-parking-bays-cjix2f') {
        link.textContent = 'On Street';
    } else {
        link.textContent = 'Off Street';
    }
    link.className = 'active';
// Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            clickedLayer = this.id;
            e.preventDefault();
            e.stopPropagation();

            const visibility = parkMap.getLayoutProperty(
                clickedLayer,
                'visibility'
            );

// Toggle layer visibility by changing the layout object's visibility property.
            if (visibility === 'visible') {
                parkMap.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                parkMap.setLayoutProperty(
                    clickedLayer,
                    'visibility',
                    'visible'
                );
            }
        };

        const layers = document.getElementById('park-menu');
        layers.appendChild(link);
    }
});