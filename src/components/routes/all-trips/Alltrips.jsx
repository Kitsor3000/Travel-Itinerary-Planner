import { LogInContext } from "@/Context/LogInContext/Login";
import { db } from "@/Service/Firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import AlltripsCard from "./AlltripsCard";
import { useNavigate } from "react-router-dom";

function Alltrips() {
  const { user } = useContext(LogInContext);
  const [allTrips, setAllTrips] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getAllTrips = async () => {
    const tripsRef = collection(db, "Trips");
    const q = query(tripsRef, where("userEmail", "==", user?.email));
    const snapshot = await getDocs(q);
    const trips = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAllTrips(trips.reverse());
  };

  const handleDeleteTrip = async (id) => {
    try {
      await deleteDoc(doc(db, "Trips", id));
      setAllTrips((prev) => prev.filter((trip) => trip.id !== id));
      setMessage("Подорож успішно видалена!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Помилка видалення:", error);
      setMessage("Сталася помилка при видаленні.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    getAllTrips();
  }, [user]);

  return (
    <div className="mb-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center my-5 md:my-10 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Усі подорожі
      </h1>

      {message && (
        <div className="text-center text-green-600 font-semibold my-4">
          {message}
        </div>
      )}

      <div className="flex gap-3 flex-wrap justify-evenly items-center">
        {allTrips.length > 0 ? (
          allTrips.map((trip) => (
            <div key={trip.id} className="w-full md:w-[48%]">
              <AlltripsCard
                trip={trip}
                onDelete={() => handleDeleteTrip(trip.id)}
                onClick={() => navigate("/my-trips/" + trip.tripId)}
              />
            </div>
          ))
        ) : (
          [1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className="w-[48%] h-52 rounded-md border bg-card-foreground/50 animate-pulse"
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

export default Alltrips;
