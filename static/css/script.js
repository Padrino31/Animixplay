import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAn7QiOmZcOkdCXS9Ugp0S6gGMx7x-cDIk",
  authDomain: "login-app-695a4.firebaseapp.com",
  projectId: "login-app-695a4",
  storageBucket: "login-app-695a4.appspot.com",
  messagingSenderId: "710961899998",
  appId: "1:710961899998:web:7f79123b6e67129bc8154f"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
});

auth.onAuthStateChanged((user) => {
  if (user) {
    location.replace("welcome.html");
  } else {
    location.replace("index.html");
  }
});

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .catch((error) => {
      document.getElementById("error").innerHTML = error.message;
    });
}

function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .catch((error) => {
      document.getElementById("error").innerHTML = error.message;
    });
}

function forgotPass() {
  const email = document.getElementById("email").value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Reset link sent to your email id");
    })
    .catch((error) => {
      document.getElementById("error").innerHTML = error.message;
    });
}

function logout() {
  auth.signOut();
}
