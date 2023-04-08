import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

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

const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const watchlistContainer = document.getElementById("watchlist-container");

// Function to update the Firebase database with the current watchlist
function updateWatchlist() {
  // Get the user ID from Firebase Auth
  const userId = auth.currentUser.uid;

  // Update the "watchlist" key in the user's data in the Firebase database
  set(ref(database, `users/${userId}/watchlist`), watchlist);
}

// Function to add an anime to the watchlist and update the UI and Firebase database
function addAnime(anime) {
  watchlist.push(anime);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  updateWatchlist();
  renderWatchlist();
}

// Function to remove an anime from the watchlist and update the UI and Firebase database
function removeAnime(anime) {
  const index = watchlist.indexOf(anime);
  if (index > -1) {
    watchlist.splice(index, 1);
  }
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  updateWatchlist();
  renderWatchlist();
}

// Function to render the watchlist in the UI
function renderWatchlist() {
  watchlistContainer.innerHTML = "";

  watchlist.forEach((anime) => {
    const listItem = document.createElement("li");
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.addEventListener("click", () => {
      removeAnime(anime);
    });
    listItem.innerText = anime;
    listItem.appendChild(removeButton);
    watchlistContainer.appendChild(listItem);
  });
}

// Initialize the UI with the current watchlist
renderWatchlist();

// Add event listener to the "Add Anime" button
const addButton = document.getElementById("add-anime");
addButton.addEventListener("click", () => {
  const anime = prompt("Enter the name of the anime:");
  if (anime) {
    addAnime(anime);
  }
});

// Add event listener to the window object to listen for changes to localStorage
window.addEventListener("storage", () => {
  // Check if the watchlist has changed in localStorage
  const newWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (JSON.stringify(newWatchlist) !== JSON.stringify(watchlist)) {
    watchlist = newWatchlist;
    renderWatchlist();
    updateWatchlist();
  }
});


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

// Listen for changes in localStorage
window.addEventListener("storage", function(event) {
  if (event.key === "watchlist") {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const user = auth.currentUser;
    if (user) {
      set(ref(database, 'users/' + user.uid + '/watchlist'), watchlist);
    }
  }
});

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
        set(ref(database, 'users/' + userId), {
          email: signupEmail
        });
        window.alert("Success! Account created.");
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
