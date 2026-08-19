import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import {
  getAuth,
  type Auth,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

function getApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  app = initializeApp(config);
  return app;
}

export function getDb(): Firestore {
  if (db) return db;

  app = getApp();
  db = getFirestore(app);
  return db;
}

export function getAuthInstance(): Auth {
  if (auth) return auth;

  app = getApp();
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence);
  return auth;
}
