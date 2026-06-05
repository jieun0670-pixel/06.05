import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  push,
  ref,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "project-3314422616667103627.firebaseapp.com",
  databaseURL: "https://project-3314422616667103627-default-rtdb.firebaseio.com",
  projectId: "project-3314422616667103627",
  storageBucket: "project-3314422616667103627.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const hasFirebaseConfig = !Object.values(firebaseConfig).some((value) => value.startsWith("YOUR_"));

let db = null;

if (hasFirebaseConfig) {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
}

window.saveGameWinner = async function saveGameWinner(result) {
  if (!db) return;

  await push(ref(db, "numberMemoryWinners"), {
    ...result,
    createdAt: serverTimestamp(),
  });
};
