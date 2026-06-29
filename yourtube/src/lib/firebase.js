import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCji8X42z0GRRwCtIpXuesdm2I5cOR59kI",
  authDomain: "yourtube-f7106.firebaseapp.com",
  projectId: "yourtube-f7106",
  storageBucket: "yourtube-f7106.firebasestorage.app",
  messagingSenderId: "258359884452",
  appId: "1:258359884452:web:f1a6eb35d76c844034c431",
  measurementId: "G-JYEKRCHG61",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };