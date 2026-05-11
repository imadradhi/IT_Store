import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

console.log("Initializing Firebase...");

const firebaseConfig = {
  apiKey: "AIzaSyBtSp-5W2zbIIVuLpl71RfK5Zc0LkydCw4",
  authDomain: "assetsmanagement-b8a6f.firebaseapp.com",
  databaseURL: "https://assetsmanagement-b8a6f-default-rtdb.firebaseio.com",
  projectId: "assetsmanagement-b8a6f",
  storageBucket: "assetsmanagement-b8a6f.firebasestorage.app",
  messagingSenderId: "720523205953",
  appId: "1:720523205953:web:57d7e6658f1bf8776255c0",
  measurementId: "G-BE2W55JZEM"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

console.log("Firebase Auth initialized.");

let analytics: any = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized.");
  }
}).catch(err => console.error("Analytics support check failed:", err));

export { app, database, auth, analytics };
