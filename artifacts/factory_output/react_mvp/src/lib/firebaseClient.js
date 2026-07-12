// Firebase Web SDK — для ФРОНТЕНДА (react_mvp). Это НЕ то же самое, что
// серверный Admin SDK в src/lib/firebase/admin.ts — там приватный ключ,
// здесь публичная конфигурация, её можно открыто использовать в браузере.
//
// Конфиг возьми в Firebase Console → Project Settings → твой Web App
// (если веб-приложение ещё не добавлено в проект mvp-factory-crm —
// нажми "+ App hinzufügen" → Web, и Firebase сам покажет этот объект).

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy };
