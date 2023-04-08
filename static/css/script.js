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

const userId = auth.currentUser ? auth.currentUser.uid : null;

if (userId) {
  const watchlistRef = ref(database, 'users/' + userId + '/watchlist');
  watchlistRef.get().then((snapshot) => {
    const dbWatchlist = snapshot.val();
    if (dbWatchlist) {
      localStorage.setItem("watchlist", JSON.stringify(dbWatchlist));
    }
  }).finally(() => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    // Do something with the watchlist
  });

  const completedListRef = ref(database, 'users/' + userId + '/completedList');
  completedListRef.get().then((snapshot) => {
    const dbCompletedList = snapshot.val();
    if (dbCompletedList) {
      localStorage.setItem("completedList", JSON.stringify(dbCompletedList));
    }
  }).finally(() => {
    const completedList = JSON.parse(localStorage.getItem("completedList")) || [];
    // Do something with the completedList
  });

  const bookmarksRef = ref(database, 'users/' + userId + '/bookmarks');
  bookmarksRef.get().then((snapshot) => {
    const dbBookmarks = snapshot.val();
    if (dbBookmarks) {
      localStorage.setItem("bookmarks", JSON.stringify(dbBookmarks));
    }
  }).finally(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    // Do something with the bookmarks
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
        const userId = user.uid;
        set(ref(database, 'users/' + userId), {
          email: signupEmail
        }).then(() => {
          window.alert("Success! Account created.");
          window.location.href = "./login.html";
        });
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
      window.location.href = "/";
      
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
