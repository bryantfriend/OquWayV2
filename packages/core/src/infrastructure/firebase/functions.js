import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.120-student-course-debug-summary";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
