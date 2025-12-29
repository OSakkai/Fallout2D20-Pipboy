import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Database } from 'firebase/database';
import type { Auth } from 'firebase/auth';

// Firebase configuration
// IMPORTANTE: Substitua com suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app: FirebaseApp;
let database: Database;
let auth: Auth;

export const initializeFirebase = () => {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
    console.log('Firebase initialized successfully');
    return { app, database, auth };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

export const getFirebaseDatabase = () => database;
export const getFirebaseAuth = () => auth;
export const getFirebaseApp = () => app;
