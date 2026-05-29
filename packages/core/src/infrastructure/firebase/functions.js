import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
