import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.81-class-command-center";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
