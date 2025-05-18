import { useCache } from "@/Context/Cache/CacheContext";
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Polyline,
} from "@react-google-maps/api";
import { useNavigate, useParams } from "react-router-dom";
import { getRoute } from "@/Service/GlobalApi";
import polyline from "@mapbox/polyline";

class BasePlace {
  constructor(data) {
    this.name = data.name;
    this.address = data.address;
    this.city = data.city;
    this.location = data.location;
  }

  getFullAddress() {
    return `${this.address}, ${this.city}`;
  }
}

class Place extends BasePlace {
  constructor(data) {
    super(data);
    this.rating = data.rating;
    this.price = data.price;
    this.photos = data.photos;
    this.description = data.description;
    this.id = data.id;
  }

  getFullAddress() {
    return `${this.name} — ${super.getFullAddress()}`;
  }
}

class AbstractRoute {
  constructor() {
    if (new.target === AbstractRoute) {
      throw new Error("Cannot instantiate abstract class");
    }
  }

  async fetchRoute() {
    throw new Error("Method 'fetchRoute()' must be implemented");
  }

  getDistance() {
    throw new Error("Method 'getDistance()' must be implemented");
  }

  getDuration() {
    throw new Error("Method 'getDuration()' must be implemented");
  }
}

class BaseRoute extends AbstractRoute {
  #origin;
  #destination;
  #distance = null;
  #time = null;
  #decodedPath = [];

  constructor(origin, destination) {
    super();
    this.#origin = origin;
    this.#destination = destination;
  }

  async #fetchRouteData() {
    return await getRoute(this.#origin, this.#destination);
  }

  async fetchRoute() {
    const routeInfo = await this.#fetchRouteData();
    if (routeInfo) {
      this.#distance = routeInfo.distanceMeters;
      this.#time = routeInfo.duration;
      this.#decodedPath = polyline
        .decode(routeInfo.polyline.encodedPolyline)
        .map(([lat, lng]) => ({ lat, lng }));
    }
  }

  getDistance() {
    return this.#distance;
  }

  getDuration() {
    return this.#time;
  }

  get origin() { return this.#origin; }
  get destination() { return this.#destination; }
  get decodedPath() { return this.#decodedPath; }
}

class Route extends BaseRoute {
  constructor(origin, destination) {
    super(origin, destination);
  }

  getDistanceKm() {
    return this.getDistance() ? (this.getDistance() / 1000).toFixed(2) : null;
  }

  getTimeMinutes() {
    return this.getDuration() ? Math.ceil(this.getDuration() / 60) : null;
  }
}

const PlacesDetails = ({ PlaceDetailsPageRef }) => {
  const { selectedPlace } = useCache();
  const place = selectedPlace ? new Place(selectedPlace) : null;

  const { lat, lng } = useParams();
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [route, setRoute] = useState(null);

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

  useEffect(() => {
    if (selectedLocation) {
      const origin = { latitude, longitude };
      const destination = {
        latitude: selectedLocation.location.latitude,
        longitude: selectedLocation.location.longitude,
      };

      const newRoute = new Route(origin, destination);
      newRoute.fetchRoute().then(() => {
        setRoute(newRoute);
      });
    }
  }, [selectedLocation]);

  return (
    <div ref={PlaceDetailsPageRef} className="main">
      <div className="place-details mt-5">
        <div className="text text-center">
          <h2 className="text-3xl md:text-5xl mt-5 font-bold flex items-center justify-center">
            <span className="bg-gradient-to-b text-7xl from-yellow-400 to-orange-500 bg-clip-text text-center text-transparent">
              {place?.name}
            </span>
          </h2>
          📍
          <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent text-xl">
            {place?.getFullAddress()}
          </span>
        </div>

        <div className="flex items-center justify-center py-2 gap-2 mt-2">
          <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
            💵 {place?.price}
          </h3>
          <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
            ⭐ {place?.rating} Зірок
          </h3>
        </div>
      </div>

      <div className="map-location-place mt-5 w-full bg-gradient-to-b from-primary/90 to-primary/60 font-bold bg-clip-text text-transparent text-3xl text-center">
        Місце на мапі
      </div>
      <div className="place-map rounded-lg m-4 md:m-2 overflow-hidden shadow-md flex flex-col gap-2 md:flex-row">
        {!isLoaded ? (
          <div className="flex items-center justify-center w-full h-[400px]">
            <span className="text-gray-500 animate-pulse">Loading Map...</span>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={15}
          >
            <Marker
              position={{
                lat: latitude,
                lng: longitude,
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: "#000000",
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#ffffff",
              }}
              label="🏨"
            />

            {selectedLocation && route && (
              <>
                <Polyline
                  path={route.decodedPath}
                  options={{
                    strokeColor: "#1E90FF",
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                  }}
                />
                <Marker
                  position={{
                    lat: selectedLocation.location.latitude,
                    lng: selectedLocation.location.longitude,
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

      {route?.distance && route?.time && (
        <div className="flex items-center justify-center py-2 gap-2 mt-2">
          <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
            Distance: {route.distance} meters ( {route.getDistanceKm()} km )
          </h3>
          <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
            Time: {route.getTimeMinutes()} minutes
          </h3>
        </div>
      )}
    </div>
  );
};

export default PlacesDetails;
