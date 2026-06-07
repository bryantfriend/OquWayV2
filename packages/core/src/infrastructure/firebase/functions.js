import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.110-student-class-alias-query";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
