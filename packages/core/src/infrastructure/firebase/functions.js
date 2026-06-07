import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.111-student-assignment-debug-panel";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
