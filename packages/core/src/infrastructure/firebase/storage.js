import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "firebase/storage";
import { firebaseApp } from "./firebaseApp.js?v=1.1.113-student-rules-read";

export const storage = getStorage(firebaseApp);

export {
  getDownloadURL,
  ref,
  uploadBytes
};
