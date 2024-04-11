import {getDatabase} from "firebase/database";
import {initializeApp, getApps} from "firebase/app";

import {
  FIREBASE_apiKey,
  FIREBASE_authDomain,
  FIREBASE_databaseURL,
  FIREBASE_projectId,
  FIREBASE_storageBucket,
  FIREBASE_messagingSenderId,
  FIREBASE_appId,
  FIREBASE_measurementId,
} from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_apiKey,
  authDomain: FIREBASE_authDomain,
  databaseURL: FIREBASE_databaseURL,
  projectId: FIREBASE_projectId,
  storageBucket: FIREBASE_storageBucket,
  messagingSenderId: FIREBASE_messagingSenderId,
  appId: FIREBASE_appId,
  measurementId: FIREBASE_measurementId,
};
// Initialize Firebase only if no apps have been initialized yet
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getDatabase();

export {db};
