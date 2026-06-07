import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "firebase/storage";
import { firebaseApp } from "./firebaseApp.js?v=1.1.124-location-icon-upload";

export const storage = getStorage(firebaseApp);

export {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
};
