import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "firebase/storage";
import { firebaseApp } from "./firebaseApp.js?v=1.1.162-modal-stack";

export const storage = getStorage(firebaseApp);

export {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
};
