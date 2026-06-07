import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.118-fruit-login-student-identity";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
