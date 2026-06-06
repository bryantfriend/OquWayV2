export { firebaseApp } from "../core/src/infrastructure/firebase/firebaseApp.js?v=1.1.108-student-class-alias-merge";
export { auth } from "../core/src/infrastructure/firebase/auth.js?v=1.1.108-student-class-alias-merge";
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
} from "../core/src/infrastructure/firebase/firestore.js?v=1.1.108-student-class-alias-merge";
export { functions, httpsCallable } from "../core/src/infrastructure/firebase/functions.js?v=1.1.108-student-class-alias-merge";
export { storage } from "../core/src/infrastructure/firebase/storage.js?v=1.1.108-student-class-alias-merge";
export { getCurrentUserClaims } from "./claims/index.js";
