function getLocation() {
    var lat = document.getElementById("Lat");
    var long = document.getElementById("Long");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        lat.value = "Geolocation is not supported by this browser.";
        long.value = "Geolocation is not supported by this browser.";
      }
      function showPosition(position) {
        lat.value = position.coords.latitude;
        long.value = position.coords.longitude;
      }

}