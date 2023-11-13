// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e87c4.firebaseapp.com",
  projectId: "mern-estate-e87c4",
  storageBucket: "mern-estate-e87c4.appspot.com",
  messagingSenderId: "445195578829",
  appId: "1:445195578829:web:bce3cfd56433f61efea884",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
