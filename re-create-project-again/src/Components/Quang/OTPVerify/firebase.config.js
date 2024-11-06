// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDtsra_hF7LlTprcz8c-_JC9HIY1_EIU_M",
//   authDomain: "tourbooking-958b8.firebaseapp.com",
//   projectId: "tourbooking-958b8",
//   storageBucket: "tourbooking-958b8.appspot.com",
//   messagingSenderId: "926555771078",
//   appId: "1:926555771078:web:5af2234785ef4a777b47c7",
//   measurementId: "G-9WRKQ7HRXR",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// ///===========
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtsra_hF7LlTprcz8c-_JC9HIY1_EIU_M",
  authDomain: "tourbooking-958b8.firebaseapp.com",
  projectId: "tourbooking-958b8",
  storageBucket: "tourbooking-958b8.appspot.com",
  messagingSenderId: "926555771078",
  appId: "1:926555771078:web:5af2234785ef4a777b47c7",
  measurementId: "G-9WRKQ7HRXR",
};

// Check if Firebase has already been initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // if already initialized, use that one
}

const auth = getAuth(app);

export { auth };
