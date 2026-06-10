import { collection, db, doc, getDocs, query, serverTimestamp, setDoc, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";

export async function processUpdateLocationLoginSlug(executionState) {
  var payload = executionState.payload || {};

  try {
    var duplicateResult = await findDuplicateSlug(payload.loginSlug, payload.locationId);

    if (duplicateResult.hasDuplicate) {
      return createProcessError("LOCATION_LOGIN_SLUG_DUPLICATE", "That loginSlug is already used by another location.");
    }

    await setDoc(doc(db, "locations", payload.locationId), {
      loginSlug: payload.loginSlug,
      loginPath: "/l/" + payload.loginSlug,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      locationId: payload.locationId,
      loginSlug: payload.loginSlug,
      loginPath: "/l/" + payload.loginSlug
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("LOCATION_LOGIN_SLUG_UPDATE_FAILED", "Failed to update location loginSlug: " + error.message);
  }
}

async function findDuplicateSlug(loginSlug, locationId) {
  var slugQuery = query(collection(db, "locations"), where("loginSlug", "==", loginSlug));
  var snapshot = await getDocs(slugQuery);
  var hasDuplicate = false;

  snapshot.forEach(function (locationSnap) {
    if (locationSnap.id !== locationId) {
      hasDuplicate = true;
    }
  });

  return {
    hasDuplicate: hasDuplicate
  };
}

function createProcessError(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}
