// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZRFf6B-wxMajBtxL7pxMbb0gNN5-chO4",
  authDomain: "journeyjoy-50e78.firebaseapp.com",
  projectId: "journeyjoy-50e78",
  storageBucket: "journeyjoy-50e78.appspot.com",
  messagingSenderId: "31304601115",
  appId: "1:31304601115:web:63e3740fdc0c5e0e1532be",
  measurementId: "G-PS1MFK2MB3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
