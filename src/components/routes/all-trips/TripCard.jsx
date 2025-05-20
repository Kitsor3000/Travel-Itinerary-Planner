import { getCityDetails, PHOTO_URL } from "@/Service/GlobalApi";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const TripCard = ({ trip, onDelete, onClick }) => {
  const [cityDets, setCityDets] = useState([]);
  const [photos, setPhotos] = useState("");
  const [Url, setUrl] = useState("");

  const city = trip?.tripData?.location;

  const getCityInfo = async () => {
    const data = { textQuery: city };
    try {
      const res = await getCityDetails(data);
      setCityDets(res.data.places[0]);
      setPhotos(res.data.places[0].photos[0].name);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    trip && getCityInfo();
  }, [trip]);

  useEffect(() => {
    const url = PHOTO_URL.replace("{replace}", photos);
    setUrl(url);
  }, [photos]);

  return (
   <div
  onClick={onClick}
  className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-background border border-border"
>
  {/* Кнопка видалення */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete(trip.id);
    }}
    className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-destructive/90 hover:bg-destructive text-white shadow-sm transition-all"
    title="Видалити подорож"
  >
    <Trash2 size={18} />
  </button>

  {/* Зображення міста */}
  <div className="h-56 w-full overflow-hidden relative">
    <img
      src={Url || "/logo.png"}
      alt={city}
      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
    />

    {/* Прозора інформація з анімацією */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-1">
      <p className="text-lg font-semibold text-white tracking-wide">
        {trip.userSelection.location}
      </p>
      <p className="text-sm text-gray-200">
        {trip.userSelection.noOfDays}{" "}
        {trip.userSelection.noOfDays > 1 ? "днів" : "день"}
      </p>
      <p className="text-sm text-gray-200">
        Бюджет: <span className="font-medium">{trip.userSelection.Budget}</span>
      </p>
    </div>
  </div>
</div>

  );
};

export default TripCard;
