import { getIdTokenResult } from "firebase/auth";
import { auth } from "../auth/index.js";

export async function getCurrentUserClaims(forceRefresh) {
  if (!auth.currentUser) {
    return {};
  }

  if (forceRefresh && auth.currentUser.getIdToken) {
    await auth.currentUser.getIdToken(true);
  }

  var token = await getIdTokenResult(auth.currentUser);
  return token && token.claims ? token.claims : {};
}
