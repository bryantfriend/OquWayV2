// Deprecated Phase 1 shim: Firebase shared layer lives in packages/firebase.
export {
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  functions,
  getDoc,
  getDocs,
  httpsCallable,
  serverTimestamp,
  setDoc,
  storage
} from "../../../../../packages/firebase/index.js";
