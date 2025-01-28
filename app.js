// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUmMTlt0SILwQ4DEKDxU1vEjx7eCLp_IU",
    authDomain: "loginsystem-8e494.firebaseapp.com",
    projectId: "loginsystem-8e494",
    storageBucket: "loginsystem-8e494.firebasestorage.app",
    messagingSenderId: "388289876256",
    appId: "1:388289876256:web:d5f680b5f7ccb1f752c745"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const authForm = document.getElementById('auth-form');
const submitButton = document.getElementById('submit-button');
const formTitle = document.getElementById('form-title');
const toggleLink = document.getElementById('toggle-link');
const toggleText = document.getElementById('toggle-text');

// Initial Mode: Sign In
let isSignUpMode = false;

// Toggle Between Sign-In and Sign-Up
toggleLink.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
        formTitle.textContent = "Sign Up";
        submitButton.textContent = "Sign Up";
        toggleText.innerHTML = "Already have an account? <span id='toggle-link'>Login</span>";
    } else {
        formTitle.textContent = "Login";
        submitButton.textContent = "Login";
        toggleText.innerHTML = "Don't have an account? <span id='toggle-link'>Sign Up</span>";
    }
});

// Handle Form Submission
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    if (isSignUpMode) {
        // Sign Up
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User successfully signed up
                const user = userCredential.user;
                console.log('Signed up with:', user.email);

                // Store user info in Firestore
                const userRef = doc(db, "users", user.uid);
                setDoc(userRef, {
                    email: user.email,
                    createdAt: new Date(),
                    // Add any other user details here (e.g., name, profilePic)
                })
                    .then(() => {
                        console.log('User data stored in Firestore');
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });

                // Optionally, you can redirect to another page after successful sign up
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessageText = error.message;
                errorMessage.textContent = `Error: ${errorMessageText}`;
            });
    } else {
        // Sign In
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User successfully signed in
                const user = userCredential.user;
                console.log('Signed in with:', user.email);
                // Redirect or perform another action after successful sign in
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessageText = error.message;
                errorMessage.textContent = `Error: ${errorMessageText}`;
            });
    }
});
