var map = L.map('map').setView([0, 0], 1);
var tiles = L.tileLayer('static/maps/{z}/{x}/{y}.png', {
	minZoom: 1,
	maxZoom: 4,
	noWrap: true,
	attribution: '3 корпус МАИ, 3 этаж'
}).addTo(map);



