import PlaceCards from "./PlaceCards.jsx";

function Places() {
  return (
    <div className="my-[15vh]">
      <h2 className="opacity-90 mx-auto text-center text-3xl font-black text-primary/80 md:text-5xl">
        Місця
      </h2>
      <div className="main-info mt-2 md:mt-4">
        <PlaceCards />
      </div>
    </div>
  );
}

export default Places;
