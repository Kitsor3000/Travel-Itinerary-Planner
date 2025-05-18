import { useContext } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { LogInContext } from "@/Context/LogInContext/Login";
import Marquee from "../ui/marquee";

const AnimatedShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-orange-400/10 blur-md animate-float1"></div>
      <div className="absolute top-1/4 right-20 w-60 h-60 rounded-full bg-orange-400/10 blur-md animate-float2"></div>
      <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-orange-400/10 blur-md animate-float3"></div>
    </div>
  );
};

function Hero({ heroRef }) {
  const { isAuthenticated } = useContext(LogInContext);
  const images = [
    {
      name: "Chichen Itza",
      src: "/hero/chichen.webp",
      link: "https://en.wikipedia.org/wiki/Chichen_Itza",
    },
    {
      name: "Christ the Redeemer",
      src: "/hero/christ.webp",
      link: "https://en.wikipedia.org/wiki/Christ_the_Redeemer_(statue)",
    },
    {
      name: "Colosseum",
      src: "/hero/colosseum.webp",
      link: "https://en.wikipedia.org/wiki/Colosseum",
    },
    {
      name: "Great Pyramid of Giza",
      src: "/hero/giza.webp",
      link: "https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza",
    },
    {
      name: "Machu Picchu",
      src: "/hero/peru.webp",
      link: "https://en.wikipedia.org/wiki/Machu_Picchu",
    },
    {
      name: "Taj Mahal",
      src: "/hero/taj.webp",
      link: "https://en.wikipedia.org/wiki/Taj_Mahal",
    },
    {
      name: "India Gate",
      src: "/hero/india.webp",
      link: "https://en.wikipedia.org/wiki/India_Gate",
    },
    {
      name: "Great Wall of China",
      src: "/hero/wall.webp",
      link: "https://en.wikipedia.org/wiki/Great_Wall_of_China",
    },
    {
      name: "Eiffel Tower",
      src: "/hero/tower.webp",
      link: "https://en.wikipedia.org/wiki/Eiffel_Tower",
    },
    {
      name: "Statue of Liberty",
      src: "/hero/liberty.webp",
      link: "https://en.wikipedia.org/wiki/Statue_of_Liberty",
    },
    {
      name: "Sydney Opera House",
      src: "/hero/sydney.webp",
      link: "https://en.wikipedia.org/wiki/Sydney_Opera_House",
    },
    {
      name: "Mount Everest",
      src: "/hero/everest.webp",
      link: "https://en.wikipedia.org/wiki/Mount_Everest",
    },
    {
      name: "Stonehenge",
      src: "/hero/stonehenge.webp",
      link: "https://en.wikipedia.org/wiki/Stonehenge",
    },
  ];

  const first = images.slice(0, images.length / 2);
  const second = images.slice(images.length / 2);

  return (
    <div
      ref={heroRef}
      className="relative flex items-center flex-col text-center justify-center min-h-screen py-10 overflow-hidden"
    >
      <AnimatedShapes />
      
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-40px) translateX(20px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(30px) translateX(-30px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(20px) translateX(40px); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .animate-float1 { animation: float1 15s ease-in-out infinite; }
        .animate-float2 { animation: float2 18s ease-in-out infinite; }
        .animate-float3 { animation: float3 20s ease-in-out infinite; }
        .animate-float4 { animation: float4 12s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>

      <div className="text px-10 md:px-40 flex flex-col items-center justify-center gap-4 relative z-10">
        <div className="heading p-2 md:py-5">
          <h1 className="font-black text-3xl md:text-5xl bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
            Travel Itinerary <br /> Planner
          </h1>
          <h1 className="font-black text-5xl md:text-9xl bg-gradient-to-b from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            RoaMap
          </h1>
        </div>
        <div className="desc">
          <h5 className="opacity-90 mx-auto text-center text-lg font-medium tracking-tight text-primary/80 md:text-xl">
            Плануй свої подорожі зручно.
          </h5>
        </div>
        <div className="buttons flex flex-col gap-3 md:flex-row">
  <Link to="/plan-a-trip">
    <Button className="text-base sm:text-lg md:text-xl px-6 sm:px-8 py-3 sm:py-4 font-semibold tracking-wide uppercase rounded-xl bg-gradient-to-br from-green-700 to-green-400 hover:from-emerald-600 hover:to-emerald-800 text-black shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:ring-opacity-60">
      {isAuthenticated ? "Створити подорож" : "Розпочати"}
    </Button>
  </Link>
</div>

        <div className="marquee relative flex w-[75vw] flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
          <Marquee reverse pauseOnHover className="[--duration:60s]">
            {second.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="img cursor-pointer border hover:border-foreground transition-all overflow-hidden rounded-md w-[200px] md:w-[250px]"
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    className="h-full hover:scale-110 duration-300"
                    loading="lazy"
                    role="presentation"
                    fetchPriority="high"
                  />
                </Link>
              );
            })}
          </Marquee>
          <Marquee pauseOnHover className="[--duration:60s]">
            {first.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="img cursor-pointer border hover:border-foreground transition-all overflow-hidden rounded-md w-[200px] md:w-[250px]"
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    className="h-full hover:scale-110 duration-300"
                    loading="lazy"
                    role="presentation"
                    fetchPriority="high"
                  />
                </Link>
              );
            })}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
