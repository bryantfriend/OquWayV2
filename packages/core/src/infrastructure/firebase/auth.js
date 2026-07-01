import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.82-shared-command-center-shell";

export const auth = getAuth(firebaseApp);
