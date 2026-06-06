import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.80-course-module-command-center";
import { hasStudentRole, isActiveStudentProfile, sanitizeProfile } from "./studentLoginHelpers.js?v=1.1.80-course-module-command-center";

export async function processLoadStudentProfile(executionState) {
  var actor = executionState.actor;

  try {
    if (!actor || !actor.id) {
      throw new Error("A signed-in student is required.");
    }

    var profilePath = "users/" + actor.id;
    var userSnap = await getDoc(doc(db, "users", actor.id));

    if (!userSnap.exists()) {
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

    var profile = Object.assign({ id: userSnap.id }, userSnap.data());
    var sanitizedProfile = sanitizeProfile(profile);

    if (!hasStudentRole(profile)) {
      logRejectedProfile(actor.id, profilePath, sanitizedProfile, "not-student-role");
      throw new Error("This account is not a student account.");
    }

    if (!isActiveStudentProfile(profile)) {
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
  if (!isDevelopmentHost()) {
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
