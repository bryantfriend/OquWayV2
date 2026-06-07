import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.117-student-identity-binding";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
