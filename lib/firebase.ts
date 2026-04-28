import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC94QaGDcC0j5anqQJboMdP5xZ3CVCfrkY",
  authDomain: "all-in-one-cc967.firebaseapp.com",
  projectId: "all-in-one-cc967",
  storageBucket: "all-in-one-cc967.firebasestorage.app",
  messagingSenderId: "463183347121",
  appId: "1:463183347121:web:aa3b56e58487540bf89190",
  measurementId: "G-PQLJE2WDYP"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
