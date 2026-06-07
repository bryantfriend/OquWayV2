import { collection, db, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.118-fruit-login-student-identity";

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

  if (!location.status) {
    location.status = location.isArchived === true ? "archived" : "active";
  }

  if (location.status === "archived") {
    location.isArchived = true;
  } else if (location.isArchived === true) {
    location.status = "archived";
  } else {
    location.isArchived = false;
  }

  if (!location.type) {
    location.type = "Private location";
  }

  if (!location.country) {
    location.country = "Kyrgyzstan";
  }

  if (!location.photoUrl && location.imageUrl) {
    location.photoUrl = location.imageUrl;
  }

  if (!location.socialLinks) {
    location.socialLinks = {};
  }

  if (!Array.isArray(location.languages)) {
    location.languages = ["en", "ru"];
  }

  if (!Array.isArray(location.adminUids)) {
    location.adminUids = [];
  }

  if (!location.subscription) {
    location.subscription = {};
  }

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
