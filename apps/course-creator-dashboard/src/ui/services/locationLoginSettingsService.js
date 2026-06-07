import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.116-student-token-ready";
import { getIntentDefinition } from "../../../../../packages/icf/index.js?v=1.1.116-student-token-ready";
import { runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.116-student-token-ready";

export const locationLoginSettingsService = {
  listLocations: async function () {
    var result = await runLocationIntent("ListLocationsIntent", {});
    var data = readIntentDataOrThrow(result);

    if (data && Array.isArray(data.locations)) {
      return data.locations;
    }

    return [];
  },

  updateLocationLoginMode: async function (locationId, loginMode) {
    var result = await runLocationIntent("UpdateLocationLoginModeIntent", {
      locationId: locationId,
      loginMode: loginMode
    });

    return readIntentDataOrThrow(result);
  }
};

async function runLocationIntent(intentType, payload) {
  return runIntentPipeline(getIntentDefinition(intentType), {
    payload: payload,
    actor: getActor(),
    meta: {
      createdAt: Date.now(),
      source: "course-creator-dashboard"
    }
  });
}

function getActor() {
  if (auth.currentUser) {
    return {
      id: auth.currentUser.uid,
      role: "ROLE_COURSE_CREATOR"
    };
  }

  return null;
}

function readIntentDataOrThrow(result) {
  if (result && result.emitted && result.emitted.success) {
    return result.emitted.data;
  }

  throw new Error(readIntentErrorMessage(result));
}

function readIntentErrorMessage(result) {
  if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
    if (result.emitted.errors[0].message) {
      return result.emitted.errors[0].message;
    }

    if (result.emitted.errors[0].code) {
      return result.emitted.errors[0].code;
    }
  }

  return "Unknown location login settings error";
}
