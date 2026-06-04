export { firebaseApp } from "../core/src/infrastructure/firebase/firebaseApp.js";
export { auth } from "../core/src/infrastructure/firebase/auth.js";
export {
  collection,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where
} from "../core/src/infrastructure/firebase/firestore.js";
export { functions, httpsCallable } from "../core/src/infrastructure/firebase/functions.js";
export { storage } from "../core/src/infrastructure/firebase/storage.js";
