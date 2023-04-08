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

function handleUserLists(user) {
  const userId = user.uid;
  retrieveListsFromFirebase(userId); // retrieve lists from Firebase

  // Listen for changes to the watchlist, bookmarks, and completed list in Firebase
  onValue(ref(database, 'users/' + userId), (snapshot) => {
    const user = snapshot.val();
    if (user) {
      const watchlist = user.watchlist || [];
      const bookmarks = user.bookmarks || [];
      const completedList = user.completedList || [];

      // Load watchlist to watchlist.html
      const watchlistHtml = document.getElementById("watchlist");
      watchlistHtml.innerHTML = "";
      watchlist.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        watchlistHtml.appendChild(li);
      });

      // Load bookmarks to bookmark.html
      const bookmarkHtml = document.getElementById("bookmark");
      bookmarkHtml.innerHTML = "";
      bookmarks.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        bookmarkHtml.appendChild(li);
      });

      // Load completed list to complete.html
      const completedHtml = document.getElementById("complete");
      completedHtml.innerHTML = "";
      completedList.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        completedHtml.appendChild(li);
      });
    }
  });
}

function main() {
  // Check if user is signed in or not
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      handleUserLists(user); // save or retrieve lists

      // Add event listener for submitting anime to watchlist
      const watchlistForm = document.getElementById("watchlist-form");
      watchlistForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const animeName = document.getElementById("watchlist-input").value;
        const userId = user.uid;
        const watchlistRef = ref(database, `users/${userId}/watchlist`);
        // Add the anime to the watchlist in Firebase
        set(watchlistRef, [...watchlist, animeName]);
      });

      // Add event listener for submitting completed anime
      const completedForm = document.getElementById("completed-form");
      completedForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const animeName = document.getElementById("completed-input").value;
        const userId = user.uid;
        const completedRef = ref(database, `users/${userId}/completedList`);
        // Add the anime to the completed list in Firebase
        set(completedRef, [...completedList, animeName]);
      });

      // Add event listener for bookmarking an episode
      const bookmarkButton = document.getElementById("bookmark-button");
      bookmarkButton.addEventListener("click", (event) => {
        const episodeName = document.getElementById("episode-name").textContent;
        const userId = user.uid;
        const bookmarksRef = ref(database, `users/${userId}/bookmarks`);
        // Add the bookmark to the bookmarks list in Firebase
        set(bookmarksRef, [...bookmarks, episodeName]);
      });
    } else {
      // User is not signed in
      main.classList.remove("hidden");
      createacct.classList.add("hidden");

    
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
