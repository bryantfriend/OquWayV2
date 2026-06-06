import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.80-course-module-command-center";

export const auth = getAuth(firebaseApp);
