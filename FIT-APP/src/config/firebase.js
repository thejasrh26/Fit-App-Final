// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyBYQEoodQ2QsWpEYOPVV6syGRrOVs9oN1I",
  authDomain: "fitness--app-60dba.firebaseapp.com",
  projectId: "fitness--app-60dba",
  storageBucket: "fitness--app-60dba.firebasestorage.app",
  messagingSenderId: "694266646337",
  appId: "1:694266646337:web:0cb59f28dd4572cf271bc0",
  measurementId: "G-02SCT0D3FQ"
};

const app = initializeApp(firebaseConfig);

// ✅ ADD THESE (VERY IMPORTANT)
export const auth = getAuth(app);
export const db = getFirestore(app);

