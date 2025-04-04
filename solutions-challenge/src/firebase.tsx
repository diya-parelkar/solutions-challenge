// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgi5b0EwccjtxVDxNlJctf-MEaklaNE5c",
  authDomain: "solutions-challenge-2eb89.firebaseapp.com",
  projectId: "solutions-challenge-2eb89",
  storageBucket: "solutions-challenge-2eb89.firebasestorage.app",
  messagingSenderId: "357806147230",
  appId: "1:357806147230:web:88ea94672f36d609429d8f",
  measurementId: "G-ZHBECDB70B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;