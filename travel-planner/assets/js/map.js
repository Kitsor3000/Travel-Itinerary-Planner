let map;
let markers = [];
let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 50.4501, lng: 30.5234 },
    zoom: 13,
    styles: [{
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]
    }]
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true
  });

  // Ініціалізація пошуку
  const searchBox = new google.maps.places.SearchBox(
    document.getElementById('place-search')
  );

  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;
    addPlaceToItinerary(places[0]);
  });
}

function addPlaceToItinerary(place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name
  });
  markers.push(marker);
}