import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.112-student-assignment-error-debug";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
