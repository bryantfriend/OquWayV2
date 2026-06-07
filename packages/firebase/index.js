export { firebaseApp } from "../core/src/infrastructure/firebase/firebaseApp.js?v=1.1.111-student-assignment-debug-panel";
export { auth } from "../core/src/infrastructure/firebase/auth.js?v=1.1.111-student-assignment-debug-panel";
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
} from "../core/src/infrastructure/firebase/firestore.js?v=1.1.111-student-assignment-debug-panel";
export { functions, httpsCallable } from "../core/src/infrastructure/firebase/functions.js?v=1.1.111-student-assignment-debug-panel";
export { storage } from "../core/src/infrastructure/firebase/storage.js?v=1.1.111-student-assignment-debug-panel";
export { getCurrentUserClaims } from "./claims/index.js";
