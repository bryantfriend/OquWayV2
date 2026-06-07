import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.121-student-dashboard-open-clean";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
