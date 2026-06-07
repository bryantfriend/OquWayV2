import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.118-fruit-login-student-identity";

export async function processUpdateLocationLoginMode(executionState) {
  var payload = executionState.payload;

  try {
    var updateData = {
      loginMode: payload.loginMode,
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, "locations", payload.locationId), updateData, { merge: true });

    executionState.result = {
      locationId: payload.locationId,
      loginMode: payload.loginMode
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "LOCATION_LOGIN_MODE_UPDATE_FAILED",
          message: "Failed to update location login mode: " + error.message
        }
      ]
    };
  }
}
