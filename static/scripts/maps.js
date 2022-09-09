var map = L.map('map',{closePopupOnClick: false}).setView([0, 0], 1);
var tiles = L.tileLayer('static/maps/{z}/{x}/{y}.png', {
	minZoom: 1,
	maxZoom: 4,
	// noWrap: true,
	attribution: '3 корпус МАИ, 3 этаж'
})
map.addLayer(tiles)


var intervalID = setInterval(update_message,1000);
var temp;
function update_message(event){
    
    let url = 'http://' + window.location.host + '/_stuff';
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI(url));
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            temp = this.responseText;
            room305.getPopup().setContent(this.responseText);
            room305.getPopup().update();
            $("#message").html(this.responseText);
            $("#temp305").html(this.responseText);
            console.log(this.responseText);
        }
        else {
             $("#message").html(this.statusText);
        }
    };
    
}




// var popup = L.popup({
//   closeButton: false,
//   autoClose: false
// })
// .setLatLng([0, 0])
// .setContent('<p>Text box on a map</p>')
// .openOn(map);

// var popup1 = L.popup({
//   closeButton: false,
//   autoClose: false
// })
// .setLatLng([10, 10])
// .setContent('<p>Text box on a map</p>')
// .openOn(map);

// Creating markers
var room305 = new L.Marker([-5, -30]).bindPopup(L.popup().setContent("305")).openPopup();
var room307 = new L.Marker([-20, -30]);
var room311 = new L.Marker([-20, -45]);
var room325a = new L.Marker([-5, -90]);

// Creating cluster group
var markers = L.markerClusterGroup();
markers.addLayer(room305);
markers.addLayer(room307);
markers.addLayer(room311);
markers.addLayer(room325a);
map.addLayer(markers);


var labelLocation = new L.LatLng(-5, -30);
var labelTitle = new L.LabelOverlay(labelLocation, '<div id="temp305"></div>');
map.addLayer(labelTitle);


var labelLocation2 = new L.LatLng(-20, -30);
var labelTitle2 = new L.LabelOverlay(labelLocation2, '<b>307</b>');
map.addLayer(labelTitle2);

// In order to prevent the text labels to "jump" when zooming in and out,
// in Google Chrome, I added this event handler:

map.on('movestart', function () {
    map.removeLayer(labelTitle);
    map.removeLayer(labelTitle2);
});
    map.on('moveend', function () {
    map.addLayer(labelTitle);
    map.addLayer(labelTitle2);
});