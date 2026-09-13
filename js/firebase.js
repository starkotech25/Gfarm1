/**
 * @file firebase.js
 * @description Firebase initialization for the Gfarm HTML/CSS/JS project.
 */

/* Firebase App */
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

/* Firebase Authentication */
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

/* Firebase Firestore */
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIGURATION
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyDFys6LRFEqONdypiGu2s0-eUp8o2w2Qas",
  authDomain: "gfarm-22d8d.firebaseapp.com",
  projectId: "gfarm-22d8d",
  storageBucket: "gfarm-22d8d.firebasestorage.app",
  messagingSenderId: "570911763883",
  appId: "1:570911763883:web:2cf714bea72d750430b6ee",
  measurementId: "G-Y5PJM8JNKM"
};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

export const app = initializeApp(firebaseConfig);


/* =========================================================
   FIREBASE AUTHENTICATION
   ========================================================= */

export const auth = getAuth(app);


/* =========================================================
   FIRESTORE DATABASE
   ========================================================= */

export const db = getFirestore(app);


/* =========================================================
   FARM CONFIGURATION
   ========================================================= */

export const FARM_ID = "default";

export const ADMIN_EMAIL =
  `admin@${firebaseConfig.projectId}.local`;


/* =========================================================
   USERNAME → FIREBASE EMAIL
   ========================================================= */

export function usernameToEmail(username) {

  const normalized = username
    .trim()
    .toLowerCase();


  /*
   * Simple usernames containing only:
   * letters
   * numbers
   * underscores
   */
  if (/^[a-z0-9_]+$/.test(normalized)) {

    return `${normalized}@${firebaseConfig.projectId}.local`;
  }


  /*
   * Encode spaces and other supported characters
   * into a valid and unique Firebase email key.
   */
  const encoded = [...normalized]
    .map((character) =>
      character.codePointAt(0).toString(36)
    )
    .join("-");


  return `u-${encoded}@${firebaseConfig.projectId}.local`;
}