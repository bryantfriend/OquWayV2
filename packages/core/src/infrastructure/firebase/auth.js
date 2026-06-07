import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.112-student-assignment-error-debug";

export const auth = getAuth(firebaseApp);
