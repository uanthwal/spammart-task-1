// Note: This code requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
$(document).ready(function () {
    $(".loading").show();
    $(".content").hide();
});
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });
    //var infoWindow = new google.maps.InfoWindow({ map: map });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            getWeatherInfo(pos.lat, pos.lng);
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                draggable: true,
            });
            map.setCenter(pos);
            google.maps.event.addListener(marker, 'dragend', function (event) {
                getWeatherInfo(this.getPosition().lat(), this.getPosition().lat());
            });
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
}

function getWeatherInfo(lat, long) {
    $(".loading").show();
    $(".content").hide();
    $.ajax
    ({
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=b7646ea91ce67e43e80c7dc0e3573352",
        success: function (response) {
            console.log("Data in weatherInfo success callback: %o", response);
            $(".loading").hide();
            $(".content").show();
            $("#current-name").html(response["name"]);
            $("#current-lat").html(response["coord"]["lat"]);
            $("#current-lng").html(response["coord"]["lon"]);
            $("#current-speed").html(response["wind"]["speed"]);
            $("#current-degree").html(response["wind"]["deg"]);
        },
        error: function (data) {
            console.log("Error in weatherInfo callback: %o", data.statusText);
        }
    });
}