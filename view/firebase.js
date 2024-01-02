// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJVNt_VImxES9tVd_m7rxfm8ZLB69a5sM",
  authDomain: "imageclassification-61c58.firebaseapp.com",
  projectId: "imageclassification-61c58",
  storageBucket: "imageclassification-61c58.appspot.com",
  messagingSenderId: "322592620313",
  appId: "1:322592620313:web:2bf39bb19912822cc8cf88",
  measurementId: "G-15RH30BJZ1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const GetFirebase = getFirestore(app);
