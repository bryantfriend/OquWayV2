import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.120-student-course-debug-summary";

export const auth = getAuth(firebaseApp);
