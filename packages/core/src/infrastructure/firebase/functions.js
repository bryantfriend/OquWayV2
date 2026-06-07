import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.119-student-dashboard-debug-safe";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
