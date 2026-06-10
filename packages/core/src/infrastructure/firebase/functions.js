import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.162-modal-stack";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
