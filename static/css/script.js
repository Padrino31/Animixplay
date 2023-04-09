import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";




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


const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct")

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

const returnBtn = document.getElementById("return-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;
function storeDataToFirebase(user) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + user.uid);
  const watchlist = localStorage.getItem("watchlist");
  const completedList = localStorage.getItem("completedList");
  const bookmarks = localStorage.getItem("bookmarks");
  set(userRef, {
    watchlist: watchlist,
    completedList: completedList,
    bookmarks: bookmarks
  });
}

createacctbtn.addEventListener("click", function() {
  var isVerified = true;

  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if(signupEmail != confirmSignupEmail) {
      window.alert("Email fields do not match. Try again.")
      isVerified = false;
  }

  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if(signupPassword != confirmSignUpPassword) {
      window.alert("Password fields do not match. Try again.")
      isVerified = false;
  }
  
  if(signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }
  
  if(isVerified) {
   createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
  .then((userCredential) => {
    const user = userCredential.user;
    storeDataToFirebase(user);
    window.alert("Success! Account created.");
    window.location.href = "./login.html"; // redirect to homepage
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert("Error occurred. Try again.");
  });
      
function restoreDataFromFirebase(user) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + user.uid);
  get(userRef).then((snapshot) => {
    const data = snapshot.val();
    localStorage.setItem("watchlist", data.watchlist);
    localStorage.setItem("completedList", data.completedList);
    localStorage.setItem("bookmarks", data.bookmarks);
  });
}


submitButton.addEventListener("click", function() {
  email = emailInput.value;
  console.log(email);
  password = passwordInput.value;
  console.log(password);

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    restoreDataFromFirebase(user);
    console.log("Success! Welcome back!");
    window.alert("Success! Welcome back!");
    window.location.href = "/"; // redirect to homepage
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Error occurred. Try again.");
    window.alert("Error occurred. Try again.");
  });


signupButton.addEventListener("click", function() {
    main.style.display = "none";
    createacct.style.display = "block";
});

returnBtn.addEventListener("click", function() {
    main.style.display = "block";
    createacct.style.display = "none";
});
