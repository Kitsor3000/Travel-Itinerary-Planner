import { db } from './firebase.js';  
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

document.getElementById('tripForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const totalBudget = parseFloat(document.getElementById('budget').value);

  const trip = {
    title,
    totalBudget,
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

  try {
    const docRef = await addDoc(collection(db, "trips"), trip);
    alert("Подорож створена! ID: " + docRef.id);
    e.target.reset();
  } catch (error) {
    console.error("Помилка при збереженні: ", error);
    alert("Помилка при збереженні подорожі.");
  }
});
