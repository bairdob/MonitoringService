var map = L.map('map').setView([0, 0], 1);
var tiles = L.tileLayer('static/maps/{z}/{x}/{y}.png', {
	minZoom: 1,
	maxZoom: 4,
	// noWrap: true,
	attribution: '3 корпус МАИ, 3 этаж'
}).addTo(map);


var intervalID = setInterval(update_message,1000);

function update_message(event){
    
    let url = 'http://' + window.location.host + '/_stuff';
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI(url));
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $("#message").html(this.responseText);
            console.log(this.responseText);
        }
        else {
             $("#message").html(this.statusText);
        }
    };
    
}