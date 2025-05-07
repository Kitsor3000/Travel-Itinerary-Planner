import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  signOut(auth).then(() => alert("Вихід виконано"));
});
