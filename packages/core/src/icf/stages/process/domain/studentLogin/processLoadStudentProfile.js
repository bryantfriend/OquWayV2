import { getStudentProfileByAuthUid } from "../../../../../../../domain/users/index.js?v=1.1.94-student-profile-context";
import { hasStudentRole, isActiveStudentProfile, sanitizeProfile } from "./studentLoginHelpers.js?v=1.1.94-student-profile-context";

export async function processLoadStudentProfile(executionState) {
  var actor = executionState.actor;

  try {
    if (!actor || !actor.id) {
      throw new Error("A signed-in student is required.");
    }

    var profilePath = "users/" + actor.id + " or authUid=" + actor.id;
    var profile = await getStudentProfileByAuthUid(actor.id);

    if (!profile) {
      logStudentProfileDebug({
        authUid: actor.id,
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
      logRejectedProfile(actor.id, profilePath, sanitizedProfile, "not-student-role");
      throw new Error("This account is not a student account.");
    }

    if (!isActiveStudentProfile(contextualProfile)) {
      logRejectedProfile(actor.id, profilePath, sanitizedProfile, "inactive-status");
      throw new Error("This student account is not active.");
    }

    if (!sanitizedProfile.classId) {
      logRejectedProfile(actor.id, profilePath, sanitizedProfile, "missing-class");
      throw new Error("This student profile is missing a class.");
    }

    if (!sanitizedProfile.locationId) {
      logRejectedProfile(actor.id, profilePath, sanitizedProfile, "missing-location");
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

    return { valid: true };
  } catch (error) {
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

function isStudentProfileDebugEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.search.indexOf("debug=true") !== -1
    || isDevelopmentHost();
}

function mergeActorStudentContext(profile, actor) {
  var mergedProfile = Object.assign({}, profile || {});

  if (actor && actor.classId && !mergedProfile.classId) {
    mergedProfile.classId = actor.classId;
  }

  if (actor && actor.className && !mergedProfile.className) {
    mergedProfile.className = actor.className;
  }

  if (actor && actor.locationId && !mergedProfile.locationId) {
    mergedProfile.locationId = actor.locationId;
  }

  return mergedProfile;
}
