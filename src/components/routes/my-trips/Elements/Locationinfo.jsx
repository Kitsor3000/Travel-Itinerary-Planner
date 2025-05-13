import { LogInContext } from "@/Context/LogInContext/Login";
import { getCityDetails, PHOTO_URL } from "@/Service/GlobalApi";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRefContext } from "@/Context/RefContext/RefContext";
import { useCache } from "@/Context/Cache/CacheContext";

function Locationinfo() {
  const { trip } = useContext(LogInContext);
  const [cityDets, setCityDets] = useState([]);
  const [photos, setPhotos] = useState("");
  const [Url, setUrl] = useState("");
  const { locationInfoRef } = useRefContext();

  const [allImages, setAllImages] = useState([]);

  const compliments = [
"Справді чудовий вибір!",
"Хм, це одне з найкращих місць — влучний вибір!",
"О, безперечно! Це відмінний вибір.",
"Бачу, ти маєш талант обирати найкраще.",
"Ах, це вищий клас. У тебе відмінний смак!",
"Не посперечаєшся — геніальний вибір!",
"Вау, ти завжди знаєш, як обрати ідеальне.",
"Хм, не можу не погодитися — це фантастично.",
"Це чудовий вибір, у тебе влучне око!",
"Відмінний вибір, ти влучив у саме яблучко!",
"Ти справжній талант у виборі найкращого.",
"Точно в ціль! Саме це я б і обрав.",
"Великі уми думають однаково — який вибір!",
"У тебе відчуття стилю — це точно.",
"Це вражаючий вибір, дуже круто!",
"Бачу, ти провів гарне дослідження — топовий вибір.",
"Цей вибір я повністю підтримую.",
"Ти маєш хист обирати переможців!",
"Це чудова знахідка — молодець!",
"Я б і сам не зміг вибрати краще!",
"Який чудовий вибір, ти справді розумієшся на цьому.",
"Фантастичний вибір, у тебе є стиль!",
"Це розумне рішення, я вражений!",
"У тебе відмінний смак, це факт.",
"Це був очевидний переможець — чудовий вибір!",
"Вау, це просто ідеально — гарно підібрано!",
"Це вибір, сповнений мудрості та класу.",
  ];

  const randomCompliment =
    compliments[Math.floor(Math.random() * compliments.length)];

  const city = trip?.tripData?.location;

  const getCityInfo = async () => {
    const data = {
      textQuery: city,
    };
    const result = await getCityDetails(data)
      .then((res) => {
        setCityDets(res.data.places[0]);
        // console.log("Res Data", res.data.places[0]);
        setAllImages(res.data.places[0].photos);
        setPhotos(res.data.places[0].photos[0].name);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    trip && getCityInfo();
  }, [trip]);

  const getUrl = (name) => {
    return PHOTO_URL.replace("{replace}", name);
  };

  useEffect(() => {
    const url = PHOTO_URL.replace("{replace}", photos);
    setUrl(url);
  }, [photos]);

  function getCheckinAndCheckout_MMDDYYYY(daysToStay) {
    daysToStay = parseInt(daysToStay, 10); // 👈 fix here

    const today = new Date();
    const checkoutDate = new Date(today.getTime());
    checkoutDate.setDate(today.getDate() + daysToStay);

    const formatToMMDDYYYY = (date) => {
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${mm}${dd}${yyyy}`;
    };

    const checkin = formatToMMDDYYYY(today);
    const checkout = formatToMMDDYYYY(checkoutDate);

    return { checkin, checkout };
  }

  function getAdultsAndChildren(peopleString) {
    switch (peopleString) {
      case "1 Person":
        return { adults: 1, children: 0, rooms: 1 };

      case "2 People":
        return { adults: 2, children: 0, rooms: 1 }; // assume 2 adults, no children

      case "3 to 5 People":
        return { adults: 2, children: 2, rooms: 1 }; // assume average group of 4: 2 adults + 2 children

      case "5 to 10 People":
        return { adults: 8, children: 0, rooms: 2 }; // assume 8 total: 8 adults + 0 children

      default:
        return { adults: 2, children: 0, rooms: 1 }; // fallback default
    }
  }

  const {
    // checkInDate,
    setCheckInDate,
    // checkOutDate,
    setCheckOutDate,
    setAdults,
    setChildrenCount,
    setRooms,
    // adults,
    // childrenCount,
    // rooms,
  } = useCache();

  useEffect(() => {
    const { checkin, checkout } = getCheckinAndCheckout_MMDDYYYY(
      trip?.userSelection?.noOfDays
    );
    const { adults, children, rooms } = getAdultsAndChildren(
      trip?.userSelection?.People
    );
    setCheckInDate(checkin);
    setCheckOutDate(checkout);
    setAdults(adults);
    setChildrenCount(children);
    setRooms(rooms);
  }, []);

  return (
    <div ref={locationInfoRef} className="my-1 md:my-5">
      <div className="location text text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-2">
          <span className="bg-gradient-to-b from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {city}{" "}
          </span>{" "}
        </h2>
        <p className="opacity-90 mx-auto text-center text-md font-medium tracking-tight text-primary/80 md:text-xl">
          {randomCompliment}
        </p>
      </div>
      <div className="carousel img opacity-90 mx-auto text-center text-lg font-medium tracking-tight text-primary/80 md:text-lg">
        Take a sneak peek at what's ahead!
      </div>
      <Carousel className="carousel w-full ">
        <CarouselContent>
          {allImages?.map((imgs, index) => (
            <CarouselItem key={index}>
              <div className="p-1 h-full w-full">
                <Card>
                  <CardContent className="flex max-h-[50vh] rounded-lg overflow-hidden h-full w-full items-center justify-center p-1">
                    <img
                      src={
                        getUrl(imgs.name) || "/images/main_img_placeholder.jpg"
                      }
                      className="rounded-lg cursor-pointer"
                      alt={imgs.name}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      {/* <Link to={cityDets.googleMapsUri} className="cursor-pointer">
        <img
          src={Url || "/images/main_img_placeholder.jpg"}
          className="w-full object-cover rounded-lg"
          alt="place"
        />
      </Link> */}
      <h2 className="location-info md:mt-4 opacity-90 mx-auto text-center text-lg font-medium tracking-tight text-primary/80 md:text-xl">
        Ah, these are your picks—looking great so far!
        {/* <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
          Adventure
        </span>{" "} */}
      </h2>
      <div className="location-info flex items-center justify-center py-2 gap-2 mt-2">
        <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
          💵 {trip?.userSelection?.Budget}
        </h3>
        <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
          👨‍👩‍👧‍👦 {trip?.userSelection?.People}
        </h3>
        <h3 className="location-info opacity-90 bg-foreground/20 px-2 md:px-4 flex items-center justify-center rounded-md text-center text-md font-medium tracking-tight text-primary/80 md:text-lg">
          📆 {trip?.userSelection?.noOfDays} Дні
        </h3>
      </div>
    </div>
  );
}

export default Locationinfo;
