import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.118-fruit-login-student-identity";

export const auth = getAuth(firebaseApp);
