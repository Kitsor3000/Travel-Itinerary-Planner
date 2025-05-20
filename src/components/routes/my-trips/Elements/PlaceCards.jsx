import { useContext } from "react";
import { LogInContext } from "@/Context/LogInContext/Login";
import PlaceCard from "../Cards/PlaceCard.jsx";
import { useRefContext } from "@/Context/RefContext/RefContext";

function PlaceCards() {

  const { trip } = useContext(LogInContext);
  const itinerary = trip?.tripData?.itinerary;

  const { placesRef } = useRefContext();

  return (
    <>
      {itinerary?.map((day, idx) => {
        return (
          <div ref={placesRef} key={idx} className="main-container mt-5 sm:mt-10">
            <div className="places-heading text-center my-5">
              <h3 className="md:text-4xl font-black bg-gradient-to-b from-yellow-400 to-orange-500 bg-clip-text text-center text-transparent">
                День {day.day}
              </h3>
              <h4 className="md:text-3xl text-center text-primary/80">
                {day.title}
              </h4>
            </div>
            <div className="cards flex flex-col md:flex-row flex-wrap gap-5">
              {day.places.map((place, idx) => {
                return (
                  <div key={idx} className="md:w-[48%]">
                    <PlaceCard className="place-card" place={place} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default PlaceCards;
