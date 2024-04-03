import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaBnq5E51cd7Bnmt6u3GRSGkJx2ayX5_4",
  authDomain: "scentreel-df024.firebaseapp.com",
  databaseURL: "https://scentreel-df024-default-rtdb.firebaseio.com",
  projectId: "scentreel-df024",
  storageBucket: "scentreel-df024.appspot.com",
  messagingSenderId: "627958583324",
  appId: "1:627958583324:web:a58583d730d4a66169cfd9",
  measurementId: "G-VRVWZS0PLX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
