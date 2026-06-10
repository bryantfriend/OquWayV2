import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.162-modal-stack";

export const auth = getAuth(firebaseApp);
