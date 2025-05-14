import { useCache } from "@/Context/Cache/CacheContext";
import React, { useEffect, useState } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  useJsApiLoader,
  Polyline,
} from "@react-google-maps/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getRoute } from "@/Service/GlobalApi";

import polyline from "@mapbox/polyline";
import { distance } from "framer-motion";
import { Loader, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const HotelDetails = ({ HotelDetailsPageRef }) => {
  const {
    selectedHotel,
    checkInDate,
    checkOutDate,
    adults,
    childrenCount,
    rooms,
  } = useCache();
  const {
    name,
    address,
    rating,
    price,
    city,
    location,
    photos,
    description,
    id,
  } = selectedHotel || {};
  const { lat, lng } = useParams();
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const navigate = useNavigate();

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [decodedPath, setDecodedPath] = useState([]);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [image_url, setImageUrl] = useState(null);
  const [placeId, setPlaceId] = useState(null);

  const [imagesMap, setImagesMap] = useState(new Map());

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!latitude || !longitude) return;

      try {
        const placesRes = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/places?lat=${latitude}&lng=${longitude}&type=tourist_attraction`
        );

        const placesData = await placesRes.json();
        setNearbyPlaces(placesData || []);
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Check console.");
      }
    };

    fetchNearbyPlaces();
  }, []);


  function generateMakeMyTripHotelURL({
    checkinDate, 
    checkoutDate, 
    poiName, 
    lat, 
    lng, 
    adults = 2,
    children = 0,
    rooms = 1,
  }) {
   
    const encodedPOI = encodeURIComponent(poiName);
    console.log("Encoded POI:", encodedPOI);


    const roomStayQualifier = `${adults}e${children}e`;
    const rsc = `${rooms}e${adults}e${children}e`;

    return `https://www.makemytrip.com/hotels/hotel-listing/?checkin=${checkinDate}&checkout=${checkoutDate}&searchText=${encodedPOI}&roomStayQualifier=${roomStayQualifier}&reference=hotel&type=poi&rsc=${rsc}`;
  }

  useEffect(() => {
    const url = generateMakeMyTripHotelURL({
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
  }, []);

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

  const handleSelectPlace = (place) => () => {
    setSelectedPlace(place);
  };

  function extractPlaceId(url) {
    const match = url.match(/place_id:([^&]+)/);
    return match ? match[1] : null;
  }

  const fetchGooglePhotoUrl = async (photoReference) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/get-photo-url?photoReference=${photoReference}`
      );
      const data = await res.json();

      if (data.imageUrl) {
        return data.imageUrl;
      } else {
        console.error(data.error);
        return null;
      }
    } catch (err) {
      console.error("Error fetching photo URL:", err);
      return null;
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      const origin = { latitude: latitude, longitude: longitude };
      const destination = {
        latitude: selectedPlace?.location.latitude,
        longitude: selectedPlace?.location.longitude,
      };

      getRoute(origin, destination).then((routeInfo) => {
        if (routeInfo) {
          setDistance(routeInfo.distanceMeters);
          setTime(routeInfo.duration);

          const decodedPath = polyline
            .decode(routeInfo.polyline.encodedPolyline)
            .map(([lat, lng]) => ({
              lat,
              lng,
            }));
          setDecodedPath(decodedPath);
          // }
        }
      });

      let googleMapsUri = selectedPlace?.googleMapsUri;
      if (googleMapsUri) {
        const placeId = extractPlaceId(googleMapsUri);
        setPlaceId(placeId);
      }
    }
  }, [selectedPlace]);

  useEffect(() => {
    nearbyPlaces.forEach((place) => {
      if (place.photos) {
        const photoUrl = imagesMap.get(place.photos);
        if (!photoUrl) {
          fetchGooglePhotoUrl(place.photos).then((url) => {
            setImagesMap((prevMap) => new Map(prevMap).set(place.photos, url));
          });
        }
      }
    });
  }, [nearbyPlaces]);

  const getImage = (key) => {
    return imagesMap.get(key);
  };

  const getTime = (value) => {
    const seconds = parseInt(value);
    const minutes = Math.ceil(seconds / 60);
    return minutes;
  };

  const getDistance = (value) => {
    const meters = parseInt(value);
    const kilometers = (meters / 1000).toFixed(2);
    return kilometers;
  };

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
                fillColor: "#black", 
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#ffffff", 
              }}
              label="🏨"
            />
            {/* <Marker position={mapCenter} /> */}
            {selectedPlace && (
              <>
                {/* Draw a line between hotel and place */}
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
        <>
          <div className="flex items-center justify-center py-2 gap-2 mt-2">
            <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
              Distance: {distance} meters ( {getDistance(distance)} km )
            </h3>
            <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
              Time: {getTime(time)} minutes
            </h3>
          </div>
        </>
      )}

     
    </div>
  );
};

export default HotelDetails;

