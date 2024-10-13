// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db }; // Export both auth and db
