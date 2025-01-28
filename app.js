// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration (replace with your actual config values)
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
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements for Login/Signup Page
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const submitButton = document.getElementById('submit-button');
const toggleMode = document.getElementById('toggle-mode');
const errorMessage = document.getElementById('error-message');

// Sign up/Login toggle
let isSignUpMode = false;

// Toggle between Sign Up and Login
toggleMode.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    submitButton.textContent = isSignUpMode ? 'Sign Up' : 'Login';
    toggleMode.textContent = isSignUpMode ? 'Already have an account? Login' : 'Don\'t have an account? Sign up';
});

// Authentication Form Submission
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    console.log('Form submitted! Email:', email, 'Password:', password);  // Debugging log

    if (isSignUpMode) {
        // Sign Up
        console.log('Attempting sign up...');
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Signed up successfully:', user.email);

                // Store user info in Firestore
                const userRef = doc(db, "users", user.uid);
                setDoc(userRef, {
                    email: user.email,
                    createdAt: new Date(),
                })
                    .then(() => {
                        console.log('User data stored in Firestore');
                        window.location.href = 'dashboard.html'; // Redirect to dashboard
                    })
                    .catch((error) => {
                        console.error("Error storing user data in Firestore:", error);
                        errorMessage.textContent = `Error storing user data: ${error.message}`;
                    });
            })
            .catch((error) => {
                console.error("Error during sign-up:", error);
                errorMessage.textContent = `Error during sign-up: ${error.message}`;
            });
    } else {
        // Login
        console.log('Attempting login...');
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Logged in successfully:', user.email);
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            })
            .catch((error) => {
                console.error("Error during login:", error);
                errorMessage.textContent = `Error during login: ${error.message}`;
            });
    }
});

// Monitor authentication state (for Dashboard)
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is logged in:', user.email);
    } else {
        console.log('No user logged in');
        window.location.href = 'index.html';  // Redirect to login page if not authenticated
    }
});

// Logout functionality (Dashboard)
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('User logged out');
            window.location.href = 'index.html'; // Redirect to login page after logout
        })
        .catch((error) => {
            console.error('Error logging out:', error);
        });
});
