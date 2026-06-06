import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.107-student-firebase-auth-chain";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
