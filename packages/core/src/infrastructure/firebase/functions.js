import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.37-teacher-login-auth";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
