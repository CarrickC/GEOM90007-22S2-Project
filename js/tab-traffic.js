
/*
    Variable initialize
*/
var apiKey = "NXXiqvnNA5ONcLNg0m7Cf9O2JWULZfVq";
var centerCoords = [144.9588, -37.815];
var initialZoom = 15;


var searchBoxInstance;
var startCornerLngLat;
var endCornerLngLat;
var mousePressed;
var drawBoundingBoxButtonPressed;
var styleRelative = "relative";
var incidentListContainer = document.getElementById("incident-list");
var trafficFlowTilesToggle = document.getElementById("flow-toggle");
var flow_layer_control = false
var incidents_layer_control = false


var map = tt.map({
    key: apiKey,
    container: "map",
    style: "../config/traffic_map_style.json",
    center: centerCoords,
    zoom: initialZoom
});


var commonSearchBoxOptions = {
    key: apiKey,
    center: map.getCenter()
};

/*
    Initialize two layers: Flow & Incidents
*/
var trafficIncidentsTier = new tt.TrafficIncidentTier({
    key: apiKey,
    incidentDetails: {
        style: "s1"
    },
    incidentTiles: {
        style: "tomtom://vector/1/s1",
    },
    refresh: 40000
});

var trafficFlowTilesTier = new tt.TrafficFlowTilesTier({
    key: apiKey,
    style:"../config/traffic_flow_style.json",
    refresh: 40000
});

map.addTier(trafficFlowTilesTier);


/*
    Layer control
*/

// traffic layer toggle
function toggleTrafficFlowTilesTier() {

    if (!flow_layer_control) {
        map.addTier(trafficFlowTilesTier);
        // style switch
        let current = $('.tf-layer-button.flow-linear-background')
        current.toggleClass('flow-linear-background flow-selected')

        flow_layer_control = true;
    } else {
        map.removeTier(trafficFlowTilesTier.getId());

        // style switch
        let current = $('.tf-layer-button.flow-selected')
        current.toggleClass('flow-selected flow-linear-background')

        flow_layer_control = false;
    }
    
    console.log("flow layer control: {%s}", flow_layer_control)
}

// flow layer toggle
function toggleTrafficIncidentsTier() {
    if (!incidents_layer_control) {
        showTrafficIncidentsTier();
        // style switch
        let current = $('.tf-layer-button.incidents-linear-background')
        current.toggleClass('incidents-linear-background incidents-selected')

        incidents_layer_control = true;
    } else {
        hideTrafficIncidentsTier();
        // style switch
        let current = $('.tf-layer-button.incidents-selected')
        current.toggleClass('incidents-selected incidents-linear-background')


        incidents_layer_control = false
    }
    console.log("incidents_layer_control: {%s}", incidents_layer_control)
}


function showTrafficIncidentsTier() {    
    map.addTier(trafficIncidentsTier);
}

function hideTrafficIncidentsTier() {
    map.removeTier(trafficIncidentsTier.getId());
    clearIncidentList();
    removeBoundingBox();
}






/*
    Rectangle
    Show incidents information on Rectangle
*/
function enableBoundingBoxDraw() {
    drawBoundingBoxButtonPressed = true;
    removeBoundingBox();
    clearIncidentList();
}

function removeBoundingBox() {
    if (map.getSource("sourceID")) {
        map.removeLayer("layerFillID");
        map.removeLayer("layerOutlineID")
        map.removeSource("sourceID");
    }
}

// Drawing rectangle (add outline layer and fill layer)
function onMouseDown(eventDetails) {
    if (drawBoundingBoxButtonPressed) {
        eventDetails.preventDefault();
        mousePressed = true;
        startCornerLngLat = eventDetails.lngLat;
        removeBoundingBox();
        // Add rectangle data
        map.addSource("sourceID", getPolygonSource(startCornerLngLat, startCornerLngLat));

        // Add rectangle inner
        map.addLayer({
            id: "layerFillID",
            type: "fill",
            source: "sourceID",
            layout: {},
            paint: {
                "fill-color": "#777",
                "fill-opacity": 0.2
            }
        });
        // Add Retangle edge
        map.addLayer({
            id: "layerOutlineID",
            type: "line",
            source: "sourceID",
            layout: {},
            paint: {
                "line-width": 4,
                "line-color": "#424242",
                "line-dasharray": [2, 1],
                "line-blur": 0.5
            }
        });
    }
}

// Track & Update rectangle lng and lat
function onMouseMove(eventDetails) {
    if (mousePressed) {
        endCornerLngLat = eventDetails.lngLat;
        updateRectangleData(startCornerLngLat, endCornerLngLat);
    }
}

// When drawing finish, clear previous layer and display new layer
function onMouseUp(eventDetails) {
    mousePressed = false;
    if (drawBoundingBoxButtonPressed) {
        endCornerLngLat = eventDetails.lngLat;
        if (startCornerLngLat.lat !== endCornerLngLat.lat && startCornerLngLat.lng !== endCornerLngLat.lng) {
            updateRectangleData(startCornerLngLat, endCornerLngLat);
            clearIncidentList();
            displayTrafficIncidents(getLngLatBoundsForIncidentDetailsCall(startCornerLngLat, endCornerLngLat));
            showTrafficIncidentsTier();
        } else {
            console.log("Bigger rectangle")
        }
    }
    drawBoundingBoxButtonPressed = false;
}



/*
    Rectangle data
    Get rectangle bounding area for flitering
*/

function updateRectangleData(startCornerLngLat, endCornerLngLat) {
    map.getSource("sourceID").setData(getPolygonSourceData(startCornerLngLat, endCornerLngLat));
}

function getLngLatBoundsForIncidentDetailsCall(startCornerLngLat, endCornerLngLat) {
    var bottomLeftCorner = new tt.LngLat(
        startCornerLngLat.lng < endCornerLngLat.lng ? startCornerLngLat.lng : endCornerLngLat.lng,
        startCornerLngLat.lat < endCornerLngLat.lat ? startCornerLngLat.lat : endCornerLngLat.lat);
    var topRightCorner = new tt.LngLat(
        startCornerLngLat.lng > endCornerLngLat.lng ? startCornerLngLat.lng : endCornerLngLat.lng,
        startCornerLngLat.lat > endCornerLngLat.lat ? startCornerLngLat.lat : endCornerLngLat.lat);
    return tt.LngLatBounds.convert([bottomLeftCorner.toArray(), topRightCorner.toArray()]);
}

function getPolygonSourceData(startCornerLngLat, endCornerLngLat) {
    console.log(startCornerLngLat.lng, startCornerLngLat.lat)
    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [
                [
                    [startCornerLngLat.lng, startCornerLngLat.lat],
                    [startCornerLngLat.lng, endCornerLngLat.lat],
                    [endCornerLngLat.lng, endCornerLngLat.lat],
                    [endCornerLngLat.lng, startCornerLngLat.lat],
                    [startCornerLngLat.lng, startCornerLngLat.lat]
                ]
            ]
        }
    };
}

function getPolygonSource(startCornerLngLat, endCornerLngLat) {
    return {
        type: "geojson",
        data: getPolygonSourceData(startCornerLngLat, endCornerLngLat)
    };
}





/**
 *  Incident List interactivity (leverage internal tt api functionality)
 *  Display incident details within bounding box
 *  Create buttom for each information (inject html)
 */

function clearIncidentList() {
    incidentListContainer.innerHTML = "";
}

function isCluster(incident) {
    return incident.id.includes("CLUSTER");
}

function displayTrafficIncidents(boundingBox) {
    var iconsMapping = ["danger", "accident", "fog", "danger", "rain", "ice", "incident", "laneclosed", "roadclosed", "roadworks", "wind", "flooding", "detour", ""];
    var delayMagnitudeMapping = ["unknown", "minor", "moderate", "major", "undefined"];

    tt.services.incidentDetails({
            key: apiKey,
            boundingBox: boundingBox,
            style: "s1",
            zoomLevel: parseInt(map.getZoom())
        })
        .go()
        .then(function (results) {
            if (results.tm.poi.length === 0) {
                console.log("No incidents data")
            } else {
                results.tm.poi.forEach(function (incident) {
                    var buttonListItem = createButtonItem(incident.p);

                    if (isCluster(incident)) {
                        buttonListItem.innerHTML = getButtonClusterContent(incident.id, incident.cs, delayMagnitudeMapping[incident.ty]);
                        incidentListContainer.appendChild(buttonListItem);
                    } else {
                        buttonListItem.innerHTML = getButtonIncidentContent(incident.d.toUpperCase(), iconsMapping[incident.ic], delayMagnitudeMapping[incident.ty], incident.f, incident.t);
                        incidentListContainer.appendChild(buttonListItem);
                    }
                });
            }
        });
}

function createButtonItem(incidentPosition) {
    var incidentBtn = document.createElement("button");
    incidentBtn.setAttribute("type", "button");
    incidentBtn.classList.add("list-group-item", "list-group-item-action", "incidendDetailsListItemButton");
    incidentBtn.addEventListener("click", function () {
        map.flyTo({
            center: incidentPosition
        });
    }, false);

    return incidentBtn;
}

function getButtonIncidentContent(description, iconCategory, delayMagnitude, fromAddress, toAddress) {
    return `<div class="row align-items-center pb-2"> <div class="col-sm-2"> <div class="tt-traffic-icon"> <div class="tt-icon-circle-${delayMagnitude} traffic-icon"> <div class="tt-icon-${iconCategory}"></div></div></div></div><div class="col label pl-0"> ${description} </div></div><div class="row"> <div class="col-sm-2"><label class="label">From: </label></div><div class="col"><label class="incident-details-list-normal-text">${fromAddress}</label> </div></div><div class="row"> <div class="col-sm-2"><label class="label">To: </label></div><div class="col"><label class="incident-details-list-normal-text">${toAddress}</label></div></div>`;
}

function getButtonClusterContent(description, numberOfIncidents, delayMagnitude) {
    return `<div class="row align-items-center pb-2"> <div class="col-sm-2"> <div class="tt-traffic-icon"> <div class="tt-icon-circle-${delayMagnitude} traffic-icon"> <div id="cluster-icon" class="tt-icon-number">${numberOfIncidents}</div></div></div></div><div class="col label pl-0"> ${description} </div></div>`;
}



/**
 * Running applications
 */
function initApplication() {
    searchBoxInstance = new tt.plugins.SearchBox(tt.services, {
        minNumberOfCharacters: 0,
        labels: {
            placeholder: "Enter a location"
        },
        noResultsMessage: "No results found.",
        searchOptions: commonSearchBoxOptions,
        autocompleteOptions: commonSearchBoxOptions
    });


    // Append searchBox inner html document 
    document.getElementById("search-panel").append(searchBoxInstance.getSearchBoxHTML());

    // Return search result and move map to position
    searchBoxInstance.on("tomtom.searchbox.resultselected", function(result) {
        map.flyTo({
            center: result.data.result.position,
            speed: 3
        });
    });
    
    // Add flow layer when toggle
    trafficFlowTilesToggle.addEventListener("click", toggleTrafficFlowTilesTier);

    document.getElementById("incidents-toggle").addEventListener("click", toggleTrafficIncidentsTier);


    // When click, start to record lat and lng
    document.getElementById("bounding-box-button").addEventListener("click", enableBoundingBoxDraw);

    map.on("mousedown", onMouseDown);
    map.on("mouseup", onMouseUp);
    map.on("mousemove", onMouseMove);

    /*
        Search box
        
        Update search range with current map position
    */
    map.on("moveend", function(){
        var updatedOptions = Object.assign(commonSearchBoxOptions, {
            center: map.getCenter()
        });
        searchBoxInstance.updateOptions({
            minNumberOfCharacters: 0,
            searchOptions: updatedOptions,
            autocompleteOptions: updatedOptions
        });
    });

    
}

initApplication();