function initMap() {
    var map = L.map('map');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

    addMarkersAndDrawRoute(map);
}

function addMarkersAndDrawRoute(map) {
    var selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];

    if (selectedItems.length >= 2) {
        var routeLatLngs = selectedItems.map(function (item) {
            return [item.long, item.lat];
        });

        var bounds = L.latLngBounds(routeLatLngs);

        routeLatLngs.forEach(function (latLng, index) {
            L.marker(latLng).addTo(map)
                .bindPopup('<b>' + selectedItems[index].title + '</b>');
        });

        map.fitBounds(bounds);

        var waypoints = routeLatLngs.map(function (latLng) {
            return L.latLng(latLng[0], latLng[1]);
        });

        L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            show: true,
            router: L.Routing.mapbox('pk.eyJ1IjoiZXJoc2VzIiwiYSI6ImNscXZ4cXgxdTUxd3oya280YjQ5ZDU4NTMifQ.BypQD2x71oOXPLpGmWp7ew'), //api key for mapbox
            createMarker: function (i, waypoint, n) {
                return L.marker(waypoint.latLng, {
                    draggable: true,
                    icon: L.divIcon({ className: 'leaflet-div-icon', html: '<span>' + (i + 1) + '</span>' })
                });
            }
        })
        .on('routesfound', function(e) {
            console.log('Routes found:', e.routes);
        })
        .on('routingerror', function(e) {
            console.error('Routing error:', e.error);
        })
        .addTo(map);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initMap();
});
