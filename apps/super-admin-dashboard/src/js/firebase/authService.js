import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig.js";

export function signInAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOutAdminAuth() {
  return signOut(auth);
}

export function sendStaffResetEmail(email) {
  return sendPasswordResetEmail(auth, email);
}
