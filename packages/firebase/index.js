export { firebaseApp } from "../core/src/infrastructure/firebase/firebaseApp.js?v=1.1.107-student-firebase-auth-chain";
export { auth } from "../core/src/infrastructure/firebase/auth.js?v=1.1.107-student-firebase-auth-chain";
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
} from "../core/src/infrastructure/firebase/firestore.js?v=1.1.107-student-firebase-auth-chain";
export { functions, httpsCallable } from "../core/src/infrastructure/firebase/functions.js?v=1.1.107-student-firebase-auth-chain";
export { storage } from "../core/src/infrastructure/firebase/storage.js?v=1.1.107-student-firebase-auth-chain";
export { getCurrentUserClaims } from "./claims/index.js";
