// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCPxYhGY7bDsPNbynS4uW4Ag8ULD4WJm4",
  authDomain: "portfolioqb-7669b.firebaseapp.com",
  projectId: "portfolioqb-7669b",
  storageBucket: "portfolioqb-7669b.firebasestorage.app",
  messagingSenderId: "1089807923379",
  appId: "1:1089807923379:web:4215ee0457ca24b40918c6",
  measurementId: "G-6L4MGVK4M7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);