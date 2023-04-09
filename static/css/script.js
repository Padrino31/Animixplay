import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, set, update} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";


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
        const userId = user.uid;

        // Get the data from localStorage
        const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        const completedList = JSON.parse(localStorage.getItem("completedList")) || [];

        // Store the data in Firebase Realtime database
        set(ref(database, `users/${userId}`), {
          email: signupEmail,
          watchlist,
          bookmarks,
          completedList,
        }).then(() => {
          window.alert("Success! Account created.");
          window.location.href = "./login.html"; // redirect to homepage
        }).catch((error) => {
          window.alert("Error occurred while creating user. Try again.");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert("Error occurred while creating user. Try again.");
      });
  }
});

// Save the data to Firebase Realtime Database when the page is refreshed or closed
window.onbeforeunload = function() {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const completedList = JSON.parse(localStorage.getItem("completedList")) || [];
    
    update(ref(database, `users/${userId}`), {
      watchlist,
      bookmarks,
      completedList,
    })
    .then(() => {
      console.log("Data saved to Firebase Realtime Database");
    })
    .catch((error) => {
      console.error("Error occurred while saving data to Firebase Realtime Database:", error);
    });
  }
};

// Sign in and save the data to Firebase Realtime Database on button click
submitButton.addEventListener("click", function() {
  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed in as", user.email);
      const userId = user.uid;

      // Get the data from Firebase Realtime Database
      onValue(ref(database, `users/${userId}`), (snapshot) => {
        const data = snapshot.val();
        const watchlist = data.watchlist || [];
        const bookmarks = data.bookmarks || [];
        const completedList = data.completedList || [];

        // Store the data in localStorage
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        localStorage.setItem("completedList", JSON.stringify(completedList));

        console.log("Data retrieved from Firebase Realtime Database");
        window.location.href = "/"; // Redirect to homepage
      }, {
        onlyOnce: true // Listen for the value only once to avoid memory leaks
      });
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

