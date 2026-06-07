import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseApp.js?v=1.1.124-location-icon-upload";

export const auth = getAuth(firebaseApp);
