// create tiles 
var floor3 = L.tileLayer('static/maps/floor3/{z}/{x}/{y}.png', {
	minZoom: 1,
	maxZoom: 4,
	// noWrap: true,
	attribution: '3 корпус <a href="https://mai.ru">МАИ</a>, 3 этаж'
})

var floor3_dark = L.tileLayer('static/maps/floor3_dark/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 4,
    // noWrap: true,
    attribution: '3 корпус <a href="https://mai.ru">МАИ</a>, 3 этаж'
})

var map = L.map('map',{
    closePopupOnClick: false,
    layers: [floor3, floor3_dark]
}).setView([0, 0], 1);

var baseMaps = {
    "floor3 dark": floor3_dark,
    "floor3": floor3
};

var layerControl = L.control.layers(baseMaps).addTo(map);

map.on('layeradd', function(event) {

  var layer = event.layer;

  if (layer instanceof L.Marker && !(layer instanceof L.MarkerCluster)) {
    layer.openPopup();
  }
  
});

// Creating cluster group
var clusterLayer = L.markerClusterGroup();

var intervalID = setInterval(update_message,1000);

function update_message(event){    
    let url = 'http://' + window.location.host + '/json';

    let xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI(url));
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            // let obj = {"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"mac":"DEVICE_MAC","name":"DEVICE NAME","temperature":10.1,"humidity":12.34}};
            // let obj = {"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "Point", "coordinates": [0, 0]}, "properties": {"mac": "DEVICE_MAC1", "name": "DEVICE NAME", "temperature": 10.1, "humidity": 12.34}}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [0, 0]}, "properties": {"mac": "DEVICE_MAC2", "name": "DEVICE NAME", "temperature": 10.1, "humidity": 12.34}}]};
            L.geoJSON(obj, {
                onEachFeature: onEachFeature,
                pointToLayer: hideMarker
            }).addTo(clusterLayer);
            map.addLayer(clusterLayer);

            // console.log(obj);
            $("#message").html(JSON.stringify(obj));
        }
        else {
             $("#message").html(this.statusText);
        }
    };
    clusterLayer.clearLayers()
    
}

// Creating popup
var room305 = new L.popup().setLatLng([-5, -30]).setContent("305").addTo(clusterLayer);
var room307 = new L.popup().setLatLng([-20, -30]).setContent("307").addTo(clusterLayer);
var room311 = new L.popup().setLatLng([-20, -45]).setContent("311").addTo(clusterLayer);
var room325a = new L.popup().setLatLng([-5, -90]).setContent("325a").addTo(clusterLayer);

map.addLayer(clusterLayer);

function onEachFeature(feature, layer) {

    let customOptions = {
        'maxWidth': 'auto',
        'minWidth' : 'auto',
        'closeButton': false,
        'autoClose': false 
    }
    // does this feature have a property named temperatyre and humidity?
    if (feature.properties) {
        layer.bindPopup(feature.properties.temperature.toString() + "°<br>" + feature.properties.humidity.toString() +"%", customOptions).openPopup();
    }

}

function hideMarker(point, latlng) {
    return L.marker(latlng, { icon: L.divIcon({popupAnchor:  [0, 0]}), opacity: 0});
}

// var geojsonFeature = {"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"mac":"DEVICE_MAC","name":"DEVICE NAME","temperature":10.1,"humidity":12.34}};
// var geojsonFeature = {"type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"mac":"DEVICE_MAC1","name":"DEVICE NAME1","temperature":10,"humidity":12}}, {"type":"Feature","geometry":{"type":"Point","coordinates":[40,40]},"properties":{"mac":"DEVICE_MAC2","name":"DEVICE NAME2","temperature":16,"humidity":14}}]};

// L.geoJSON(geojsonFeature, {
//     onEachFeature: onEachFeature,
//     pointToLayer: hideMarker
// }).addTo(markers);
// map.addLayer(markers);
