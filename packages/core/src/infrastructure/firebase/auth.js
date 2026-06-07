import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.119-student-dashboard-debug-safe";

export const auth = getAuth(firebaseApp);
