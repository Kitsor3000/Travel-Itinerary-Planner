import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoyt3LwRfAw-m-1VrAc9VhOOwVyhz2sPI",
  authDomain: "travel-itenerary-planner-d311c.firebaseapp.com",
  projectId: "travel-itenerary-planner-d311c",
  storageBucket: "travel-itenerary-planner-d311c.appspot.com",
  messagingSenderId: "941216034249",
  appId: "1:941216034249:web:4339b2853f68ce255e8c18",
  measurementId: "G-FQD9M2DXTM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('registerBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Успішна реєстрація: " + userCredential.user.email);
    })
    .catch((error) => {
      alert("Помилка реєстрації: " + error.message);
    });
});

document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Вхід успішний: " + userCredential.user.email);
    })
    .catch((error) => {
      alert("Помилка входу: " + error.message);
    });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => alert("Вихід виконано"));
});

onAuthStateChanged(auth, (user) => {
  const status = document.getElementById('authStatus');
  if (user) {
    status.textContent = `Увійшли як: ${user.email}`;
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
  } else {
    status.textContent = 'Не автентифіковано';
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
  }
});
