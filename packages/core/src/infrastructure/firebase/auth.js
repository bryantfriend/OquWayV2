import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.116-student-token-ready";

export const auth = getAuth(firebaseApp);
