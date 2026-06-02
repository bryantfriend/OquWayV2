import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.29-module-render-fix";

export const auth = getAuth(firebaseApp);
