import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.79-user-command-center";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
