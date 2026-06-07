import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "firebase/storage";
import { firebaseApp } from "./firebaseApp.js?v=1.1.110-student-class-alias-query";

export const storage = getStorage(firebaseApp);

export {
  getDownloadURL,
  ref,
  uploadBytes
};
