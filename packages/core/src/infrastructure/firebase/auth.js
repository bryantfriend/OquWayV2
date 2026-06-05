import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.78-location-command-center";

export const auth = getAuth(firebaseApp);
