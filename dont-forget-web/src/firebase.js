// 소셜 로그인

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUPYMP68Zps3QFokR61RyyuU8HCbryafY",
  authDomain: "dont-forget-web.firebaseapp.com",
  projectId: "dont-forget-web",
  storageBucket: "dont-forget-web.firebasestorage.app",
  messagingSenderId: "54726353081",
  appId: "1:54726353081:web:a7bd5ff90482dd3cbabb68"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();