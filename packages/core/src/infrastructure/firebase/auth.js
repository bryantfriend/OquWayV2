import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.121-student-dashboard-open-clean";

export const auth = getAuth(firebaseApp);
