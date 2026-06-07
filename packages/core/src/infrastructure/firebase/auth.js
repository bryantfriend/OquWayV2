import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.110-student-class-alias-query";

export const auth = getAuth(firebaseApp);
