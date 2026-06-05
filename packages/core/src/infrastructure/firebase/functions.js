import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebaseApp.js?v=1.1.70-external-task-feedback";

export const functions = getFunctions(firebaseApp);

export {
  httpsCallable
};
