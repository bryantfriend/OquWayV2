import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.108-student-class-alias-merge";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
