// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";   // if you need authentication
import { getFirestore } from "firebase/firestore"; // if you need Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAjGOPCV3JYf9ElJwLS-7SsqNVrfVXe-H8",
    authDomain: "civicbridgeapp.firebaseapp.com",
    projectId: "civicbridgeapp",
    storageBucket: "civicbridgeapp.firebasestorage.app",
    messagingSenderId: "54854600532",
    appId: "1:54854600532:web:4d11083ff3bf6913422ac1"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseapp);
export const db = getFirestore(firebaseapp);

export default firebaseapp;