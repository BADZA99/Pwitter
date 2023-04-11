// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  //   "AIzaSyDr8WZxg2LGxy2Jt6jVBYLya3wn7S5lOys",
  authDomain: "pwitter-be7b2.firebaseapp.com",
  projectId: "pwitter-be7b2",
  storageBucket: "pwitter-be7b2.appspot.com",
  messagingSenderId: "54232140524",
  appId: "1:54232140524:web:4cbabb9c0c1ce9b0fcb3c9",
};

// Initialize Firebase
const app = !getApps.length  ?  initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export {app,db,storage};
