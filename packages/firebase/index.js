export { firebaseApp } from "../core/src/infrastructure/firebase/firebaseApp.js?v=1.1.162-modal-stack";
export { auth } from "../core/src/infrastructure/firebase/auth.js?v=1.1.162-modal-stack";
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
} from "../core/src/infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";
export { functions, httpsCallable } from "../core/src/infrastructure/firebase/functions.js?v=1.1.162-modal-stack";
export { deleteObject, getDownloadURL, ref, storage, uploadBytes } from "../core/src/infrastructure/firebase/storage.js?v=1.1.162-modal-stack";
export { getCurrentUserClaims } from "./claims/index.js";
