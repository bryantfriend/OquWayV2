import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.108-student-class-alias-merge";

export const auth = getAuth(firebaseApp);
