import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.70-external-task-feedback";

export const auth = getAuth(firebaseApp);
