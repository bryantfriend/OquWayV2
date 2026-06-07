import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.116-student-token-ready";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
