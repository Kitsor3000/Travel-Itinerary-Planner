import { db, createTrip, getTripData, updateTrip, deleteTrip, getAllTrips } from './firebase.js';

let currentTripId = null;

document.getElementById('tripForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const trip = {
    title: document.getElementById('title').value,
    totalBudget: parseFloat(document.getElementById('budget').value),
    budget: {
      food: parseFloat(document.getElementById('food').value),
      accommodation: parseFloat(document.getElementById('accommodation').value),
      transport: parseFloat(document.getElementById('transport').value),
      shopping: parseFloat(document.getElementById('shopping').value),
      entertainment: parseFloat(document.getElementById('entertainment').value),
    },
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    location: {
      city: document.getElementById('city').value,
      country: document.getElementById('country').value,
    },
    createdAt: new Date()
  };

  if (currentTripId) {
    await updateTrip(currentTripId, trip);
    alert('Подорож оновлено!');
    currentTripId = null;
  } else {
    await createTrip(trip);
    alert('Подорож створено!');
  }

  document.getElementById('tripForm').reset();
  loadAllTrips();
});

async function loadTrip(id) {
  const trip = await getTripData(id);
  if (!trip) return;

  document.getElementById('title').value = trip.title;
  document.getElementById('budget').value = trip.totalBudget;
  document.getElementById('food').value = trip.budget.food;
  document.getElementById('accommodation').value = trip.budget.accommodation;
  document.getElementById('transport').value = trip.budget.transport;
  document.getElementById('shopping').value = trip.budget.shopping;
  document.getElementById('entertainment').value = trip.budget.entertainment;
  document.getElementById('startDate').value = trip.startDate;
  document.getElementById('endDate').value = trip.endDate;
  document.getElementById('city').value = trip.location.city;
  document.getElementById('country').value = trip.location.country;

  currentTripId = id;
}

async function loadAllTrips() {
  const tripList = document.getElementById('tripList');
  tripList.innerHTML = '';
  const trips = await getAllTrips();

  trips.forEach((doc) => {
    const trip = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${trip.title}</strong> (${trip.location.city}, ${trip.location.country})<br>
      <button data-id="${doc.id}" class="edit">Редагувати</button>
      <button data-id="${doc.id}" class="delete">Видалити</button>
    `;
    tripList.appendChild(li);
  });

  document.querySelectorAll('.edit').forEach(btn =>
    btn.addEventListener('click', () => loadTrip(btn.dataset.id))
  );

  document.querySelectorAll('.delete').forEach(btn =>
    btn.addEventListener('click', async () => {
      if (confirm('Видалити подорож?')) {
        await deleteTrip(btn.dataset.id);
        loadAllTrips();
      }
    })
  );
}

window.addEventListener('DOMContentLoaded', loadAllTrips);
