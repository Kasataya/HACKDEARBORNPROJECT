// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import the database functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgHHyMo4fq6yv7dof3X9wYiLGJBuSi6Fk",
  authDomain: "newproject1-5b86a.firebaseapp.com",
  databaseURL: "https://newproject1-5b86a-default-rtdb.firebaseio.com",
  projectId: "newproject1-5b86a",
  storageBucket: "newproject1-5b86a.appspot.com",
  messagingSenderId: "401109158985",
  appId: "1:401109158985:web:c17267c85740f1118c4398"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

export { database }; // Export the database for use in your app
