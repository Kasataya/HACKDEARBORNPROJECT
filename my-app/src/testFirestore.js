// testFirestore.js
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6mDHbL8gbTYAVZ3moYAHISqiPe5yW3AE",
    authDomain: "judgedbyai.firebaseapp.com",
    databaseURL: "https://judgedbyai-default-rtdb.firebaseio.com",
    projectId: "judgedbyai",
    storageBucket: "judgedbyai.appspot.com",
    messagingSenderId: "1087198177229",
    appId: "1:1087198177229:web:a43bd1e6c557782c6cc684",
    measurementId: "G-JDKTGG6YW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch user data from Firestore
const fetchUserData = async (userId) => {
  const userDocRef = doc(db, "users", userId); // Change "users" to your collection name
  const userDoc = await getDoc(userDocRef);
  
  if (userDoc.exists()) {
    console.log("User data:", userDoc.data());
  } else {
    console.log("No such document!");
  }
};

// Replace 'user.uid' with the actual user ID you want to test
fetchUserData('user.uid'); // Change this to the document ID you want to test
