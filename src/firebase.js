// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE5UroyyXeJ03SHzhBUPeSmYSW6H2LKLs",
  authDomain: "realtor-clone-12304.firebaseapp.com",
  projectId: "realtor-clone-12304",
  storageBucket: "realtor-clone-12304.appspot.com",
  messagingSenderId: "799709503474",
  appId: "1:799709503474:web:7443f47747c22b13c5156b",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
