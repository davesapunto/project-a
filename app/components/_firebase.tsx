import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "project-a-60ef1.firebaseapp.com",
  projectId: "project-a-60ef1",
  storageBucket: "project-a-60ef1.firebasestorage.app",
  messagingSenderId: "699129702492",
  appId: "1:699129702492:web:3fa38a3ed1c4c17eb91e99",
  measurementId: "G-EG08WDC14G"
};
const app = initializeApp(firebaseConfig);
export default function getApp(){
    return app
}