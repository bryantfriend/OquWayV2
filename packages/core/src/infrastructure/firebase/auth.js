import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.81-class-command-center";

export const auth = getAuth(firebaseApp);
