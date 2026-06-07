import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.124-location-icon-upload";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
