import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQTl-Y4OzIPp58Kte8c5p_NvtCxjtmfhY",
  authDomain: "portfolio-e7379.firebaseapp.com",
  projectId: "portfolio-e7379",
  storageBucket: "portfolio-e7379.firebasestorage.app",
  messagingSenderId: "989854749436",
  appId: "1:989854749436:web:b310c6342f45bda0bbfd79",
  measurementId: "G-QNNT1XYDZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// This exports the 'auth' object so you can use it in your Zustand store
export const auth = getAuth(app);