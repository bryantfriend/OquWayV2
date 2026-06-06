import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "firebase/storage";
import { firebaseApp } from "./firebaseApp.js?v=1.1.79-user-command-center";

export const storage = getStorage(firebaseApp);

export {
  getDownloadURL,
  ref,
  uploadBytes
};
