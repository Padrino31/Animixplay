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

let email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;
let userId, watchlist, complete, bookmark;

// Retrieve data from local storage
watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
complete = JSON.parse(localStorage.getItem("complete")) || [];
bookmark = JSON.parse(localStorage.getItem("bookmark")) || [];

// Update local storage
const updateLocalStorage = () => {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  localStorage.setItem("complete", JSON.stringify(complete));
  localStorage.setItem("bookmark", JSON.stringify(bookmark));
};

createacctbtn.addEventListener("click", function() {
  let isVerified = true;

  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if (signupEmail != confirmSignupEmail) {
    window.alert("Email fields do not match. Try again.");
    isVerified = false;
  }

  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if (signupPassword != confirmSignUpPassword) {
    window.alert("Password fields do not match. Try again.");
    isVerified = false;
  }

  if (signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }

  if (isVerified) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        userId = user.uid; // set userId to the UID of the newly created user
        main.style.display = "block"; // display the main content
        createacct.style.display = "none"; // hide the create account form
            // Create a new user in the database with their email as the key
    set(ref(database, "users/" + userId), {
      email: signupEmail,
      watchlist: watchlist,
      complete: complete,
      bookmark: bookmark
    });

    // Update local storage to reflect new user
    updateLocalStorage();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert(errorMessage);
  });
}
});

// Function to sign in a user with their email and password
const signInUser = () => {
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
const user = userCredential.user;
userId = user.uid; // set userId to the UID of the signed in user
setUserData(); // retrieve user data from the database and update local storage
main.style.display = "block"; // display the main content
login.style.display = "none"; // hide the login form
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
window.alert(errorMessage);
});
};

submitButton.addEventListener("click", function() {
email = emailInput.value;
password = passwordInput.value;
signInUser();
});

signupButton.addEventListener("click", function() {
main.style.display = "none"; // hide the main content
createacct.style.display = "block"; // display the create account form
});

returnBtn.addEventListener("click", function() {
main.style.display = "none"; // hide the main content
createacct.style.display = "none"; // hide the create account form
login.style.display = "block"; // display the login form
});

const setUserData = () => {
  const userRef = database.ref("users/" + userId);
  userRef.once("value")
    .then((snapshot) => {
      const data = snapshot.val();
      watchlist = data.watchlist;
      complete = data.complete;
      bookmark = data.bookmark;
      updateLocalStorage();
    })
    .catch((error) => {
      console.error(error);
    });
};


