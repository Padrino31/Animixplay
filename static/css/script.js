import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";


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
const database = getDatabase(app);

const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct");

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

const returnBtn = document.getElementById("return-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;

// Store the watchlist, bookmark, and completed-list to Firebase
function saveListsToFirebase(userId, watchlist, bookmarks, completedList) {
  set(ref(database, 'users/' + userId), {
    email: email,
    watchlist: watchlist,
    bookmarks: bookmarks,
    completedList: completedList
  });
}

// Retrieve the watchlist, bookmark, and completed-list from Firebase
function retrieveListsFromFirebase(userId) {
  onValue(ref(database, 'users/' + userId), (snapshot) => {
    const user = snapshot.val();
    if (user) {
      const watchlist = user.watchlist || [];
      const bookmarks = user.bookmarks || [];
      const completedList = user.completedList || [];
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      localStorage.setItem("completedList", JSON.stringify(completedList));
    }
  });
}

// Check if the user is new or existing, and save or retrieve the watchlist, bookmark, and completed-list accordingly
function handleUserLists(user) {
  const userId = user.uid;
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  const completedList = JSON.parse(localStorage.getItem("completedList")) || [];
  retrieveListsFromFirebase(userId); // retrieve lists from Firebase
  saveListsToFirebase(userId, watchlist, bookmarks, completedList); // store lists to Firebase
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
    window.alert("Success! Account created.");
    handleUserLists(user); // save or retrieve lists
    window.location.href = "/"; // redirect to home page
  })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert("Error occurred. Try again.");
      });
  }
});

submitButton.addEventListener("click", function() {
  email = emailInput.value;
  password = passwordInput.value;

 signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("Success! Welcome back!");
    handleUserLists(user); // save or retrieve lists
    window.location.href = "/"; // redirect to home page
  })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert("Error occurred. Try again.");
    });
});


signupButton.addEventListener("click", function() {
    main.style.display = "none";
    createacct.style.display = "block";
});

returnBtn.addEventListener("click", function() {
    main.style.display = "block";
    createacct.style.display = "none";
});
