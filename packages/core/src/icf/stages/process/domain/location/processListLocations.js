import { collection, db, getDocs } from "../../../../../infrastructure/firebase/firestore.js";

export async function processListLocations(executionState) {
  try {
    var locations = [];
    var snapshot = await getDocs(collection(db, "locations"));

    snapshot.forEach(function (locationSnap) {
      var location = normalizeLocationRecord(locationSnap.id, locationSnap.data());

      if (shouldIncludeLocation(executionState, location)) {
        locations.push(location);
      }
    });

    locations.sort(compareLocations);
    executionState.result = {
      locations: locations
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "LOCATIONS_LOAD_FAILED",
          message: "Failed to load locations: " + error.message
        }
      ]
    };
  }
}

function shouldIncludeLocation(executionState, location) {
  if (executionState.intentType !== "LoadLocationsIntent") {
    return true;
  }

  if (!location.status) {
    return true;
  }

  return location.status === "active";
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

function compareLocations(a, b) {
  return readLocationName(a).localeCompare(readLocationName(b));
}

function readLocationName(location) {
  if (!location) {
    return "";
  }

  if (typeof location.name === "string") {
    return location.name;
  }

  if (location.title && typeof location.title.en === "string") {
    return location.title.en;
  }

  return location.id || "";
}
