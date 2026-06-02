import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.29-module-render-fix";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
