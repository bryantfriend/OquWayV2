import { collection, db, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.79-user-command-center";

export async function processResolveLocationBySlug(executionState) {
  var payload = executionState.payload || {};

  try {
    var locationQuery = query(collection(db, "locations"), where("loginSlug", "==", payload.loginSlug));
    var snapshot = await getDocs(locationQuery);
    var locations = [];

    snapshot.forEach(function (locationSnap) {
      locations.push(normalizeLocationRecord(locationSnap.id, locationSnap.data()));
    });

    if (locations.length === 0) {
      return createProcessError("LOCATION_SLUG_NOT_FOUND", "We could not find that school login link.");
    }

    if (locations.length > 1) {
      return createProcessError("LOCATION_SLUG_DUPLICATE", "This login link matches more than one location. Please ask an admin to fix it.");
    }

    if (locations[0].status && locations[0].status !== "active") {
      return createProcessError("LOCATION_INACTIVE", "This school login link is not active right now.");
    }

    executionState.result = {
      location: locations[0]
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("LOCATION_SLUG_RESOLVE_FAILED", "Failed to resolve location login link: " + error.message);
  }
}

function normalizeLocationRecord(locationId, data) {
  var location = Object.assign({ id: locationId }, data || {});

  if (!location.loginMode) {
    location.loginMode = "fruit";
  }

  if (!location.loginSlug) {
    location.loginSlug = "";
  }

  if (!location.loginPath) {
    location.loginPath = location.loginSlug ? "/l/" + location.loginSlug : "";
  }

  return location;
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
