
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider ,signInWithEmailAndPassword,sendPasswordResetEmail} from "firebase/auth";
import {getFirestore, writeBatch} from'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCC8BrvM9t9Kcd74S2E-9anaf4OShlMM5Y",
  authDomain: "ecoroute-4eeb1.firebaseapp.com",
  projectId: "ecoroute-4eeb1",
  storageBucket: "ecoroute-4eeb1.appspot.com",
  messagingSenderId: "852541175665",
  appId: "1:852541175665:web:a965041eed047b32d728d0",
  measurementId: "G-CBCC4ES2DM",

};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db, createUserWithEmailAndPassword ,signInWithEmailAndPassword,sendPasswordResetEmail};