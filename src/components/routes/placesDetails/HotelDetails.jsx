import { useCache } from "@/Context/Cache/CacheContext";
import { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Polyline,
} from "@react-google-maps/api";
import { useNavigate, useParams } from "react-router-dom";
import { getRoute } from "@/Service/GlobalApi";
import polyline from "@mapbox/polyline";

class Place {
  constructor(details) {
    if (new.target === Place) {
      throw new Error("Cannot instantiate abstract class Place directly");
    }
    Object.assign(this, details);
  }

  getUrl() {
    throw new Error("Method 'getUrl()' must be implemented in subclass");
  }
}

class Hotel extends Place {
  constructor(details) {
    super(details);
  }

  getUrl() {
    const { checkInDate, checkOutDate, name, city, location, adults = 2, childrenCount = 0, rooms = 1 } = this;
    const encodedPOI = encodeURIComponent(`${name}, ${city}`);
    const roomStayQualifier = `${adults}e${childrenCount}e`;
    const rsc = `${rooms}e${adults}e${childrenCount}e`;

    return `https://www.makemytrip.com/hotels/hotel-listing/?checkin=${checkInDate}&checkout=${checkOutDate}&searchText=${encodedPOI}&roomStayQualifier=${roomStayQualifier}&reference=hotel&type=poi&rsc=${rsc}`;
  }

  getBookingUrl() {
    const { checkInDate, checkOutDate, name, location } = this;
    const { latitude: lat, longitude: lng } = location;
    return `https://www.booking.com/searchresults.html?checkin=${checkInDate}&checkout=${checkOutDate}&latitude=${lat}&longitude=${lng}&ss=${encodeURIComponent(name)}`;
  }
}

class Restaurant extends Place {
  constructor(details) {
    super(details);
  }

  getUrl() {
    const { name, location, cuisine = "" } = this;
    const { latitude: lat, longitude: lng } = location;
    return `https://www.google.com/maps/search/${encodeURIComponent(cuisine)}+restaurant+near+${encodeURIComponent(name)}/@${lat},${lng},15z`;
  }
}

class MapRoute {
  constructor(origin, destination) {
    this.origin = origin;
    this.destination = destination;
  }

  async fetchRoute() {
    const routeInfo = await getRoute(this.origin, this.destination);
    if (!routeInfo) return null;

    const decodedPath = polyline
      .decode(routeInfo.polyline.encodedPolyline)
      .map(([lat, lng]) => ({ lat, lng }));

    return {
      distanceMeters: routeInfo.distanceMeters,
      duration: routeInfo.duration,
      decodedPath,
    };
  }
}

const HotelDetails = ({ HotelDetailsPageRef }) => {
  const {
    selectedHotel,
    checkInDate,
    checkOutDate,
    adults,
    childrenCount,
    rooms,
  } = useCache();


  const { name, address, rating, price, city, location, photos, description, id } =
    selectedHotel || {};


  const { lat, lng } = useParams();
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const navigate = useNavigate();

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [decodedPath, setDecodedPath] = useState([]);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [placeId, setPlaceId] = useState(null);


  useEffect(() => {
    if (!selectedHotel) return;
    const hotel = new Hotel(selectedHotel);

    const url = hotel.generateMakeMyTripHotelURL({
      checkinDate: checkInDate,
      checkoutDate: checkOutDate,
      poiName: name + "," + city,
      lat: latitude,
      lng: longitude,
      adults: adults,
      children: childrenCount,
      rooms: rooms,
    });

    console.log("Generated URL:", url);
  }, [selectedHotel]);

  useEffect(() => {
    if (!selectedPlace) return;

    const origin = { latitude, longitude };
    const destination = {
      latitude: selectedPlace.location.latitude,
      longitude: selectedPlace.location.longitude,
    };

    const mapRoute = new MapRoute(origin, destination);

    mapRoute.fetchRoute().then((routeInfo) => {
      if (routeInfo) {
        setDistance(routeInfo.distanceMeters);
        setTime(routeInfo.duration);
        setDecodedPath(routeInfo.decodedPath);
      }
    });

    if (selectedPlace.googleMapsUri) {
      const placeId = extractPlaceId(selectedPlace.googleMapsUri);
      setPlaceId(placeId);
    }
  }, [selectedPlace]);

  function extractPlaceId(url) {
    const match = url.match(/place_id:([^&]+)/);
    return match ? match[1] : null;
  }


  const getTime = (value) => {
    const seconds = parseInt(value);
    return Math.ceil(seconds / 60);
  };

  const getDistance = (value) => {
    const meters = parseInt(value);
    return (meters / 1000).toFixed(2);
  };

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const mapCenter = {
    lat: latitude || 0,
    lng: longitude || 0,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ["places", "marker"],
  });


 return (
    <div ref={HotelDetailsPageRef} className="main">
      <div className="hotel-details mt-5">
        <div className="text text-center">
          <h2 className="text-3xl md:text-5xl mt-5 font-bold flex items-center justify-center">
            <span className="bg-gradient-to-b text-7xl from-yellow-400 to-orange-500 bg-clip-text text-center text-transparent">
              {name}
            </span>
          </h2>
          📍
          <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent text-xl">
            {address}
          </span>
        </div>

        <div className="flex items-center justify-center py-2 gap-2 mt-2">
          <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
            💵 {price}
          </h3>
          <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
            ⭐ {rating} Зірок
          </h3>
        </div>
      </div>

      <div className="map-location mt-5 w-full bg-gradient-to-b from-primary/90 to-primary/60 font-bold bg-clip-text text-transparent text-3xl text-center">
        Місце на мапі
      </div>
      <div className="hotel-map rounded-lg m-4 md:m-2 overflow-hidden shadow-md flex flex-col gap-2 md:flex-row">
        {!isLoaded ? (
          <div className="flex items-center justify-center w-full h-[400px]">
            <span className="text-gray-500 animate-pulse">Loading Map...</span>
          </div>
        ) : (
          <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={15}>
            <Marker
              position={{
                lat: latitude,
                lng: longitude,
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: "black",
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#ffffff",
              }}
              label="🏨"
            />
            {selectedPlace && (
              <>
                <Polyline
                  path={decodedPath}
                  options={{
                    strokeColor: "#1E90FF",
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                  }}
                />
                <Marker
                  position={{
                    lat: selectedPlace.location.latitude,
                    lng: selectedPlace.location.longitude,
                  }}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: "black",
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "#ffffff",
                  }}
                  label="📍"
                />
              </>
            )}
          </GoogleMap>
        )}
      </div>

      {distance && time && (
        <div className="flex items-center justify-center py-2 gap-2 mt-2">
          <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
            Distance: {distance} meters ( {getDistance(distance)} km )
          </h3>
          <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
            Time: {getTime(time)} minutes
          </h3>
        </div>
      )}
    </div>
  );
};
export default HotelDetails;