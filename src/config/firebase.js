import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBs4hyVMyKx7y4QgwvVPfWvI0mK9yEieps",
  authDomain: "gitlearning-914d4.firebaseapp.com",
  projectId: "gitlearning-914d4",
  storageBucket: "gitlearning-914d4.firebasestorage.app",
  messagingSenderId: "310863875942",
  appId: "1:310863875942:web:bf64fb6d2cd865edb942a7",
  measurementId: "G-B4KDWFJYSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;