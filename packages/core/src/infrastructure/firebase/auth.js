import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.79-user-command-center";

export const auth = getAuth(firebaseApp);
