import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import {
  PROMPT,
  SelectBudgetOptions,
  SelectNoOfPersons,
} from "../../constants/Options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { chatSession } from "@/Service/AiModel";
import { LogInContext } from "@/Context/LogInContext/Login";
import { db } from "@/Service/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AnimatedShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-20 left-0 w-40 h-40 rounded-full bg-orange-400/10 blur-md animate-float1"></div>
      <div className="absolute top-1/4 right-0 w-60 h-60 rounded-full bg-orange-400/10 blur-md animate-float2"></div>
      
      <div className="absolute bottom-1/4 left-1/3 w-0 h-0 border-l-[80px] border-l-transparent border-b-[140px] border-b-yellow-400/5 border-r-[80px] border-r-transparent blur-md animate-spin-slow"></div>
    
      <div className="absolute bottom-1/3 right-1/5 w-60 h-60 bg-orange-400/5 blur-xl animate-pulse-slow rotate-45"></div>
    </div>
  );
};

function CreateTrip({createTripPageRef}) {
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { user, loginWithPopup, isAuthenticated } = useContext(LogInContext);

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const SignIn = async () => {
    loginWithPopup();
  };

  const SaveUser = async () => {
    const User = JSON.parse(localStorage.getItem("User"));
    const id = User?.email;
    await setDoc(doc(db, "Users", id), {
      userName: User?.name,
      userEmail: User?.email,
      userPicture: User?.picture,
      userNickname: User?.nickname,
    });
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem("User", JSON.stringify(user));
      SaveUser();
    }
  }, [user]);

  const SaveTrip = async (TripData) => {
    const User = JSON.parse(localStorage.getItem("User"));
    const id = Date.now().toString();
    setIsLoading(true);
    await setDoc(doc(db, "Trips", id), {
      tripId: id,
      userSelection: formData,
      tripData: TripData,
      userName: User?.name,
      userEmail: User?.email,
    });
    setIsLoading(false);
    localStorage.setItem("Trip", JSON.stringify(TripData));
    localStorage.setItem("UserSelection", JSON.stringify(formData));

    navigate("/my-trips/" + id);
  };

  const generateTrip = async () => {
    if (!isAuthenticated) {
      toast("Увійдіть щоб продовжити", {
        icon: "⚠️",
      });
      return setIsDialogOpen(true);
    }
    if (
      !formData?.noOfDays ||
      !formData?.location ||
      !formData?.People ||
      !formData?.Budget
    ) {
      return toast.error("Будь ласка, заповніть всі поля.");
    }
    if (formData?.noOfDays > 5) {
      return toast.error("Максимальна кількість днів - 5");
    }
    if (formData?.noOfDays < 1) {
      return toast.error("Некоректна кількість днів");
    }
    const FINAL_PROMPT = PROMPT.replace(/{location}/g, formData?.location)
      .replace(/{noOfDays}/g, formData?.noOfDays)
      .replace(/{People}/g, formData?.People)
      .replace(/{Budget}/g, formData?.Budget);

    try {
      const toastId = toast.loading("Створюємо подорож...", {
        icon: "✈️",
      });

      setIsLoading(true);
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const trip = JSON.parse(result.response.text());
      setIsLoading(false);
      SaveTrip(trip);

      toast.dismiss(toastId);
      toast.success("Подорож успішно створена!");
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      toast.error("Помилка при створенні подорожі. Спробуйте ще раз.");
      console.error(error);
    }
  };

  return (
    <div ref={createTripPageRef} className="relative mt-10 text-center overflow-hidden">
      <AnimatedShapes />
      
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(20px) translateX(-30px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.05); }
        }
        .animate-float1 { animation: float1 18s ease-in-out infinite; }
        .animate-float2 { animation: float2 20s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 40s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
      `}</style>

     <div className="relative z-10">
  <div className="text text-center">
    <h2 className="text-3xl md:text-5xl font-extrabold mb-5 flex items-center justify-center">
      <span className="hidden md:block">🚀</span>
      <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Досліджуй світ{" "}
      </span>
      <span className="hidden md:block">🚀</span>
    </h2>
    <p className="opacity-90 mx-auto text-center text-lg md:text-2xl font-medium tracking-tight text-primary/80 mb-6">
      Створи подорож своєї мрії всього за декілька кліків. <br />
      <span className="text-2xl bg-gradient-to-b from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        RoaMap
      </span>
      <br />
      Розробіть персональний маршрут з урахуванням ваших власних вподобань
    </p>
  </div>

  <div className="form mt-8 flex flex-col gap-8 md:gap-12">
    <div className="place">
      <h2 className="font-semibold text-lg md:text-3xl mb-3">
        <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
          Де ви хочете побувати?
        </span>{" "}
        🏖️
      </h2>
      <Autocomplete
        apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
        className="flex w-[80%] md:w-[60%] mx-auto h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/90 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
        onPlaceSelected={(place) => {
          setPlace(place);
          handleInputChange("location", place.formatted_address);
        }}
      />
    </div>

    <div className="day">
      <h2 className="font-semibold text-lg md:text-3xl mb-3">
        <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
          Скільки буде тривати ваша подорож?
        </span>{" "}
        🕜
      </h2>
      <Input
        className="text-center w-[80%] md:w-[60%] mx-auto bg-background/80 text-base rounded-md px-3 py-2 border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/90"
        placeholder="Кількість днів"
        type="number"
        min="1"
        max="7"
        name="noOfDays"
        required
        onChange={(day) => handleInputChange("noOfDays", Number(day.target.value))}
      />
    </div>

    <div className="budget">
      <h2 className="font-semibold text-lg md:text-3xl mb-3">
        <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
          Яким буде ваш бюджет?
        </span>{" "}
        💳
      </h2>
      <Input
        className="text-center w-[80%] md:w-[60%] mx-auto bg-background/80 text-base rounded-md px-3 py-2 border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/90"
        placeholder="$ 5000"
        type="number"
        min="100"
        max="100000"
        name="Budget"
        required
        onChange={(budget) => handleInputChange("Budget", Number(budget.target.value))}
      />
    </div>

          <div className="people">
            <h2 className="font-semibold text-lg md:text-3xl mb-3">
              <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
                З ким буде ваша подорож?{" "}
              </span>{" "}
              🚗
            </h2>
            <div className="options grid grid-cols-1 gap-5 md:grid-cols-3">
              {SelectNoOfPersons.map((item) => {
                return (
                  <div
                    onClick={(e) => handleInputChange("People", item.no)}
                    key={item.id}
                    className={`option cursor-pointer transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border rounded-lg hover:shadow-foreground/10 hover:shadow-md
                      ${formData?.People == item.no && "border border-foreground/80"}
                    `}
                  >
                    <h3 className="font-bold text-[15px] md:font-[18px]">
                      {item.icon} <span className={`
                        ${formData?.People == item.no ? 
                        "bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent" :
                        ""}
                        `}>{item.title}</span>
                    </h3>
                    <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">{item.desc}</p>
                    <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">{item.no}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

       <div className="create-trip-btn w-full flex items-center justify-center h-32">
  <Button disabled={isLoading} onClick={generateTrip} className="w-full max-w-xs h-12 bg-primary text-black rounded-lg flex items-center justify-center transition-all duration-300">
    {isLoading ? (
      <AiOutlineLoading3Quarters className="h-6 w-6 text-black animate-spin" />
    ) : (
      <span className="text-lg font-semibold tracking-normal">Підтвердити 🌏</span>
    )}
  </Button>
</div>


        <Dialog
          className="m-4"
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
                {user ? "Дякуємо за вхід" : "Увійдіть щоб продовжити"}
              </DialogTitle>
              <DialogDescription>
                <span className="flex gap-2">
                  <span className="text-center w-full opacity-90 mx-auto tracking-tight text-primary/80">
                    {user
                      ? "Ви успішно увійшли за допомогою Google"
                      : "Увійдіть за допомогою Google"}
                  </span>
                </span>
                {user ? (
                  ""
                ) : (
                  <Button
                    onClick={SignIn}
                    className="w-full mt-5 flex gap-2 items-center justify-center"
                  >
                    Увійти за допомогою <FcGoogle className="h-5 w-5" />
                  </Button>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose className="w-full">
                <Button variant="outline" className="w-full">
                  Закрити
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateTrip;