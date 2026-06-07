export { firebaseApp } from "../core/src/infrastructure/firebase/firebaseApp.js?v=1.1.124-location-icon-upload";
export { auth } from "../core/src/infrastructure/firebase/auth.js?v=1.1.124-location-icon-upload";
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
} from "../core/src/infrastructure/firebase/firestore.js?v=1.1.124-location-icon-upload";
export { functions, httpsCallable } from "../core/src/infrastructure/firebase/functions.js?v=1.1.124-location-icon-upload";
export { deleteObject, getDownloadURL, ref, storage, uploadBytes } from "../core/src/infrastructure/firebase/storage.js?v=1.1.124-location-icon-upload";
export { getCurrentUserClaims } from "./claims/index.js";
