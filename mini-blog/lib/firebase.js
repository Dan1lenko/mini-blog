// lib/firebase.js

import config from "@/postcss.config.mjs";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; ❌ прибери

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // ✅ виправлено
  authDomain: "mini-blog-a4ab3.firebaseapp.com",
  projectId: "mini-blog-a4ab3",
  storageBucket: "mini-blog-a4ab3.appspot.com", // ✅ виправлено
  messagingSenderId: "421569622864",
  appId: "1:421569622864:web:89e67f852ccdad0c513255",
  measurementId: "G-DGE1T8ZKS2",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// export let analytics;
// if (typeof window !== "undefined") {
//   analytics = getAnalytics(app);
// }
