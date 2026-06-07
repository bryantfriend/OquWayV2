import { getStudentProfileByAuthUid, resolveActorStudentId } from "../../../../../../../domain/users/index.js?v=1.1.124-location-icon-upload";
import { hasStudentRole, isActiveStudentProfile, sanitizeProfile } from "./studentLoginHelpers.js?v=1.1.124-location-icon-upload";

export async function processLoadStudentProfile(executionState) {
  var actor = executionState.actor;

  try {
    logStudentProfileTrace("actor", executionState.actor);
    logStudentProfileTrace("payload", executionState.payload);
    logStudentProfileTrace("contextStudent", executionState.context && executionState.context.studentProfile);
    logStudentProfileTrace("result", executionState.result);

    if (!actor || !actor.id) {
      throw new Error("A signed-in student is required.");
    }

    var resolvedStudentId = resolveActorStudentId(actor);
    var profilePath = "users/" + resolvedStudentId + " or authUid=" + (actor.authUid || actor.id);
    var profile = await loadStudentProfile(actor);

    if (!profile) {
      logStudentProfileDebug({
        authUid: actor.authUid || actor.id,
        profilePath: profilePath,
        profileExists: false,
        role: "",
        roles: [],
        status: "",
        reasonRejected: "profile-missing"
      });
      throw new Error("Student profile was not found.");
    }

    var contextualProfile = mergeActorStudentContext(profile, actor);
    var sanitizedProfile = sanitizeProfile(contextualProfile);

    if (!hasStudentRole(contextualProfile)) {
      logRejectedProfile(actor.authUid || actor.id, profilePath, sanitizedProfile, "not-student-role");
      throw new Error("This account is not a student account.");
    }

    if (!isActiveStudentProfile(contextualProfile)) {
      logRejectedProfile(actor.authUid || actor.id, profilePath, sanitizedProfile, "inactive-status");
      throw new Error("This student account is not active.");
    }

    if (!sanitizedProfile.classId) {
      logRejectedProfile(actor.authUid || actor.id, profilePath, sanitizedProfile, "missing-class");
      throw new Error("This student profile is missing a class.");
    }

    if (!sanitizedProfile.locationId) {
      logRejectedProfile(actor.authUid || actor.id, profilePath, sanitizedProfile, "missing-location");
      throw new Error("This student profile is missing a location.");
    }

    logStudentProfileDebug({
      authUid: actor.id,
      profilePath: profilePath,
      profileExists: true,
      role: sanitizedProfile.role,
      roles: sanitizedProfile.roles,
      status: sanitizedProfile.status,
      classId: sanitizedProfile.classId,
      locationId: sanitizedProfile.locationId,
      reasonRejected: ""
    });

    executionState.result = {
      student: sanitizedProfile
    };
    logStudentProfileTrace("result", executionState.result);

    return { valid: true };
  } catch (error) {
    console.error("[student-profile-process-error]", error);
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_PROFILE_LOAD_FAILED",
          message: error.message
        }
      ]
    };
  }
}

function logRejectedProfile(authUid, profilePath, profile, reasonRejected) {
  logStudentProfileDebug({
    authUid: authUid,
    profilePath: profilePath,
    profileExists: true,
    role: profile && profile.role ? profile.role : "",
    roles: profile && Array.isArray(profile.roles) ? profile.roles : [],
    status: profile && profile.status ? profile.status : "",
    classId: profile && profile.classId ? profile.classId : "",
    locationId: profile && profile.locationId ? profile.locationId : "",
    reasonRejected: reasonRejected
  });
}

function logStudentProfileDebug(details) {
  if (!isStudentProfileDebugEnabled()) {
    return;
  }

  console.info("[student-profile-debug]", {
    authUid: details.authUid,
    profilePath: details.profilePath,
    profileExists: details.profileExists,
    role: details.role,
    roles: details.roles,
    status: details.status,
    classId: details.classId,
    locationId: details.locationId,
    reasonRejected: details.reasonRejected
  });
}

function isDevelopmentHost() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
    || window.location.hostname === "";
}

async function loadStudentProfile(actor) {
  try {
    var trustedProfile = actor.studentProfile || null;
    var resolvedStudentId = resolveActorStudentId(actor);
    var lookupProfile = await getStudentProfileByAuthUid(resolvedStudentId || actor.id);

    return mergeStudentProfiles(lookupProfile, trustedProfile);
  } catch (error) {
    var fallbackStudentId = resolveActorStudentId(actor) || actor.id;

    logStudentProfileDebug({
      authUid: actor.authUid || actor.id,
      profilePath: "users/" + fallbackStudentId + " or authUid=" + (actor.authUid || actor.id),
      profileExists: Boolean(actor.studentProfile),
      role: actor.studentProfile && actor.studentProfile.role ? actor.studentProfile.role : "",
      roles: actor.studentProfile && Array.isArray(actor.studentProfile.roles) ? actor.studentProfile.roles : [],
      status: actor.studentProfile && actor.studentProfile.status ? actor.studentProfile.status : "",
      classId: actor.studentProfile && actor.studentProfile.classId ? actor.studentProfile.classId : "",
      locationId: actor.studentProfile && actor.studentProfile.locationId ? actor.studentProfile.locationId : "",
      reasonRejected: "profile-lookup-failed"
    });

    return actor.studentProfile || null;
  }
}

function mergeStudentProfiles(lookupProfile, trustedProfile) {
  if (!trustedProfile) {
    return lookupProfile || null;
  }

  if (!lookupProfile) {
    return trustedProfile;
  }

  return Object.assign({}, lookupProfile, trustedProfile, {
    id: trustedProfile.id || lookupProfile.id || "",
    authUid: trustedProfile.authUid || lookupProfile.authUid || "",
    studentId: trustedProfile.studentId || lookupProfile.studentId || trustedProfile.id || lookupProfile.id || "",
    name: trustedProfile.name || lookupProfile.name || "",
    displayName: trustedProfile.displayName || lookupProfile.displayName || trustedProfile.name || lookupProfile.name || "",
    classId: trustedProfile.classId || lookupProfile.classId || "",
    className: trustedProfile.className || lookupProfile.className || "",
    locationId: trustedProfile.locationId || lookupProfile.locationId || lookupProfile.primaryLocationId || "",
    roles: Array.isArray(trustedProfile.roles) && trustedProfile.roles.length > 0 ? trustedProfile.roles : lookupProfile.roles,
    linkedProfile: lookupProfile.linkedProfile || trustedProfile.linkedProfile || null
  });
}

function isStudentProfileDebugEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.search.indexOf("debug=true") !== -1
    || isDevelopmentHost();
}

function logStudentProfileTrace(label, value) {
  if (!isStudentProfileDebugEnabled()) {
    return;
  }

  console.log("[student-profile-debug] " + label, JSON.stringify(value || null));
}

function mergeActorStudentContext(profile, actor) {
  var mergedProfile = Object.assign({}, profile || {});

  if (actor && actor.classId && !mergedProfile.classId) {
    mergedProfile.classId = actor.classId;
  }

  if (actor && actor.classId) {
    mergedProfile.classIds = mergeTextLists(mergedProfile.classIds, [actor.classId]);
  }

  if (actor && actor.className && !mergedProfile.className) {
    mergedProfile.className = actor.className;
  }

  if (actor && actor.locationId && !mergedProfile.locationId) {
    mergedProfile.locationId = actor.locationId;
  }

  return mergedProfile;
}

function mergeTextLists(primaryValues, fallbackValues) {
  var result = [];

  appendTextValues(result, primaryValues);
  appendTextValues(result, fallbackValues);

  return result;
}

function appendTextValues(result, values) {
  if (typeof values === "string") {
    appendUniqueText(result, values);
    return;
  }

  if (!Array.isArray(values)) {
    return;
  }

  values.forEach(function (value) {
    appendTextValues(result, value);
  });
}

function appendUniqueText(result, value) {
  if (typeof value !== "string" || value.length === 0) {
    return;
  }

  if (result.indexOf(value) === -1) {
    result.push(value);
  }
}
