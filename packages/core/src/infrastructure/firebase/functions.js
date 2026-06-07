import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.114-student-profile-rules";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
