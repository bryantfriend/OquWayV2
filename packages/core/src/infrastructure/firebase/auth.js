import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.113-student-rules-read";

export const auth = getAuth(firebaseApp);
