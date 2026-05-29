import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "firebase/storage";
import { firebaseApp } from "./firebaseApp.js";

export const storage = getStorage(firebaseApp);

export {
  getDownloadURL,
  ref,
  uploadBytes
};
