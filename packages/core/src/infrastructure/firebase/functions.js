import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.82-shared-command-center-shell";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
