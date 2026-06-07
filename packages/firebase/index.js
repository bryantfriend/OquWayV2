export { firebaseApp } from "../core/src/infrastructure/firebase/firebaseApp.js?v=1.1.114-student-profile-rules";
export { auth } from "../core/src/infrastructure/firebase/auth.js?v=1.1.114-student-profile-rules";
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
} from "../core/src/infrastructure/firebase/firestore.js?v=1.1.114-student-profile-rules";
export { functions, httpsCallable } from "../core/src/infrastructure/firebase/functions.js?v=1.1.114-student-profile-rules";
export { storage } from "../core/src/infrastructure/firebase/storage.js?v=1.1.114-student-profile-rules";
export { getCurrentUserClaims } from "./claims/index.js";
