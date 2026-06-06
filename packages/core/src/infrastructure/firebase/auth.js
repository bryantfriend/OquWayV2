import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.109-student-assignment-status-fallback";

export const auth = getAuth(firebaseApp);
