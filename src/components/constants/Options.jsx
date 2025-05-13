export const SelectBudgetOptions = [
    {
        id:1,
        icon: "💵",
        title:"Cheap",
        desc: "Economize and Save"
    },
    {
        id: 2,
        icon: "💰",
        title:"Moderate",
        desc: "Balance Cost and Comfort"
    },
    {
        id:3,
        icon: "💎",
        title:"Luxury",
        desc: "Induldge without Limits"
    },
]

export const SelectNoOfPersons = [
    {
        id:1,
        icon: "🚶",
        title: "Самостійно",
        desc: "Тільки для вас",
        no: "1 людина"
    },
    {
        id:2,
        icon: "💑",
        title: "З партнером",
        desc: "З коханою людиною",
        no: "2 людини"
    },
    {
        id:3,
        icon: "👨‍👩‍👧‍👦",
        title: "Сім'я",
        desc: "Разом з рідними",
        no: "3 чи 5 людей"
    },
    {
        id:4,
        icon: "🤝",
        title: "Друзі",
        desc: "В компанії веселіше",
        no: "5 чи 10 людей"
    },
]

export const PROMPT = "Create an optimal trip itinerary based on the specified location, duration, budget, and number of persons. Generate Travel Plan for Location: {location} for no of days: {noOfDays} Days with no of People or group: {People} with Budget: {Budget}; give me list of hotels with hotel name, description, address, rating, price, location in map, coordinates, image url; also for the same create the itinerary for {noOfDays} days, suggest places, give name, details, pricing, timings, place images urls, location (coordinate or in map); Remember all have to cover in the {Budget} level budget. Important: give the result in JSON Format"