// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZQgjFNHNaVOXh-GpFWhqZu7IzGLvVU48",
  authDomain: "nailsbere.firebaseapp.com",
  projectId: "nailsbere",
  storageBucket: "nailsbere.firebasestorage.app",
  messagingSenderId: "443819455697",
  appId: "1:443819455697:web:09ca24f597992abe6101f0",
  measurementId: "G-267XBH3LXZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
