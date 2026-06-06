import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.107-student-firebase-auth-chain";

export const auth = getAuth(firebaseApp);
