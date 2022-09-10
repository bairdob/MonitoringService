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


var intervalID = setInterval(update_message,1000);
function update_message(event){    

    let url = 'http://' + window.location.host + '/json';
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI(url));
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            let data = obj.devices[0].sensors[0];
            // console.log(obj['devices'][0]);
            room305.setContent(data.value.toString()+data.unit);
            room305.update();
            $("#message").html(JSON.stringify(obj));
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
var room305 = new L.popup({autoPan: false}).setLatLng([-5, -30]).setContent("305").addTo(markers);
var room307 = new L.popup().setLatLng([-20, -30]).setContent("307").addTo(markers);
var room311 = new L.popup().setLatLng([-20, -45]).setContent("311").addTo(markers);
var room325a = new L.popup().setLatLng([-5, -90]).setContent("325a").addTo(markers);

map.addLayer(markers);