import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.114-student-profile-rules";

export const auth = getAuth(firebaseApp);
