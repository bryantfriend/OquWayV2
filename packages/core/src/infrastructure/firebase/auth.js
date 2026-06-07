import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.117-student-identity-binding";

export const auth = getAuth(firebaseApp);
