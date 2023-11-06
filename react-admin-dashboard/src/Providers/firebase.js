// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {  getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1JWmSmlwc5dH9UC8hf4Y9nDeDjWbBMRY",
  authDomain: "timepass-c8588.firebaseapp.com",
  projectId: "timepass-c8588",
  storageBucket: "timepass-c8588.appspot.com",
  messagingSenderId: "262634270025",
  appId: "1:262634270025:web:20eb0b7ee6dbfe13aafe98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const db = getFirestore(app);