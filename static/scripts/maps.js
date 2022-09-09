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
}).setView([0, 0], 2);

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


var intervalID = setInterval(update_message,1000);

function update_message(event){    

    let url = 'http://' + window.location.host + '/_stuff';
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI(url));
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            room305.setContent(this.responseText);
            room305.update();
            $("#message").html(this.responseText);
            // console.log(this.responseText);
        }
        else {
             $("#message").html(this.statusText);
        }
    };
    
}

// Creating cluster group
var markers = L.markerClusterGroup();

// Creating popup
var room305 = new L.popup({autoPan: false}).setLatLng([-5, -30]).setContent("305°").addTo(markers);
var room307 = new L.popup().setLatLng([-20, -30]).setContent("307°").addTo(markers);
var room311 = new L.popup().setLatLng([-20, -45]).setContent("311°").addTo(markers);
var room325a = new L.popup().setLatLng([-5, -90]).setContent("325a°").addTo(markers);

map.addLayer(markers);


// var labelLocation = new L.LatLng(-5, -30);
// var labelTitle = new L.LabelOverlay(labelLocation, '<div id="temp305"></div>');
// map.addLayer(labelTitle);


// var labelLocation2 = new L.LatLng(-20, -30);
// var labelTitle2 = new L.LabelOverlay(labelLocation2, '<b>307</b>');
// map.addLayer(labelTitle2);

// // In order to prevent the text labels to "jump" when zooming in and out,
// // in Google Chrome, I added this event handler:

// map.on('movestart', function () {
//     map.removeLayer(labelTitle);
//     map.removeLayer(labelTitle2);
// });
//     map.on('moveend', function () {
//     map.addLayer(labelTitle);
//     map.addLayer(labelTitle2);
// });