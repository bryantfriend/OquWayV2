import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.113-student-rules-read";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
