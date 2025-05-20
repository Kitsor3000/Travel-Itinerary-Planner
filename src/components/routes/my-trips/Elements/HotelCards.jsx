import { useContext, useState } from "react";
import { LogInContext } from "@/Context/LogInContext/Login";
import HotelCard from "../Cards/HotelCard.jsx";
import { useRefContext } from "@/Context/RefContext/RefContext";

function HotelCards() {

  const [id, setId] = useState("");

  const { trip } = useContext(LogInContext);
  const hotels = trip?.tripData?.hotels;

  const { hotelsRef } = useRefContext();

  return (
    <div ref={hotelsRef} className="flex flex-col md:flex-row flex-wrap gap-5">
      {hotels?.map((hotel, idx) => {
        return (
          <div key={idx} className="md:w-[48%]">
            <HotelCard className="hotel-card" id={id} hotel={hotel} />
          </div>
        );
      })}
    </div>
  );
}

export default HotelCards;
