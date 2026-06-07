import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.111-student-assignment-debug-panel";

export const auth = getAuth(firebaseApp);
