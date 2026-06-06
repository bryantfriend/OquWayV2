import { collection, db, doc, getDoc, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.109-student-assignment-status-fallback";
import { getExternalTaskSubmissionById } from "../../../../../../../domain/externalTasks/index.js";
import { getUserProfileByAuthUid, getUserRoles } from "../../../../../../../domain/users/index.js";

export async function attachTeacherProfileContext(executionState) {
  var actor = executionState.actor || {};

  if (!actor.id) {
    return {
      valid: true,
      data: {
        teacherProfile: null,
        teacherClassIds: [],
        teacherLocationIds: []
      }
    };
  }

  try {
    var lookup = await loadTeacherProfileByAuthUid(actor.id);
    var profile = lookup.profile;

    return {
      valid: true,
      data: {
        teacherProfile: profile,
        authUid: actor.id,
        profileUserId: profile && profile.profileUserId ? profile.profileUserId : "",
        teacherOwnershipIds: readTeacherOwnershipIds(profile, actor.id),
        teacherClassIds: readTeacherClassIds(profile),
        teacherLocationIds: readTeacherLocationIds(profile)
      }
    };
  } catch (error) {
    console.warn("[teacher-dashboard:add-context-failed]", {
      teacherId: actor.id || "",
      attemptedProfilePath: actor.id ? "users/" + actor.id : "",
      attemptedAuthUidQuery: actor.id ? "users where authUid == " + actor.id : "",
      errorMessage: readErrorMessage(error)
    });

    return {
      valid: true,
      data: {
        teacherProfile: null,
        authUid: actor.id || "",
        profileUserId: "",
        teacherOwnershipIds: actor.id ? [actor.id] : [],
        teacherClassIds: [],
        teacherLocationIds: []
      }
    };
  }
}

async function loadTeacherProfileByAuthUid(authUid) {
  if (!authUid) {
    return { profile: null };
  }

  var lookup = await getUserProfileByAuthUid(authUid);
  var profile = lookup.profile;
  var directProfile = lookup.directProfile;

  console.info("[teacher-profile:direct]", {
    authUid: authUid,
    path: "users/" + authUid,
    found: lookup.directProfileFound,
    profileUserId: directProfile && directProfile.profileUserId ? directProfile.profileUserId : "",
    roles: readProfileRoles(directProfile)
  });

  console.info("[teacher-profile:lookup]", {
    authUid: authUid,
    triedDirectProfile: true,
    directProfileFound: lookup.directProfileFound,
    authUidQueryFound: lookup.authUidQueryFound,
    profileUserId: profile && profile.profileUserId ? profile.profileUserId : "",
    role: profile && profile.role ? profile.role : "",
    roles: readProfileRoles(profile)
  });

  console.info("[teacher-profile:linked]", {
    authUid: authUid,
    profileUserId: profile && profile.profileUserId ? profile.profileUserId : "",
    found: Boolean(profile && profile.linkedProfile),
    roles: readProfileRoles(profile)
  });

  return {
    profile: profile
  };
}

function readProfileRoles(profile) {
  return getUserRoles(profile);
}

export async function attachExternalTaskSubmissionReviewContext(executionState) {
  var payload = executionState.payload || {};

  if (!payload.submissionId) {
    return {
      valid: true,
      data: {
        externalTaskSubmission: null
      }
    };
  }

  try {
    var submission = await getExternalTaskSubmissionById(payload.submissionId);

    return {
      valid: true,
      data: {
        externalTaskSubmission: submission
      }
    };
  } catch (error) {
    console.warn("[teacher-review:add-context-failed]", {
      submissionId: payload.submissionId,
      attemptedPath: "externalTaskSubmissions/" + payload.submissionId,
      errorMessage: readErrorMessage(error)
    });

    return {
      valid: false,
      errors: [
        {
          code: "EXTERNAL_TASK_SUBMISSION_CONTEXT_FAILED",
          message: "Could not load the submission before review."
        }
      ]
    };
  }
}

export function readTeacherClassIds(profile) {
  var ids = [];

  addText(ids, profile ? profile.classId : "");
  addTextList(ids, profile ? profile.classIds : null);
  addTextList(ids, profile ? profile.assignedClassIds : null);
  addRecordList(ids, profile ? profile.assignedClasses : null, "class");
  addRecordList(ids, profile ? profile.classes : null, "class");
  addRecordList(ids, profile ? profile.classRefs : null, "class");

  return ids;
}

export function readTeacherLocationIds(profile) {
  var ids = [];

  addText(ids, profile ? profile.locationId : "");
  addText(ids, profile ? profile.primaryLocationId : "");
  addText(ids, profile ? profile.schoolId : "");
  addText(ids, profile ? profile.locId : "");
  addTextList(ids, profile ? profile.locationIds : null);
  addTextList(ids, profile ? profile.schoolIds : null);
  addRecordList(ids, profile ? profile.locations : null, "location");
  addRecordList(ids, profile ? profile.schools : null, "location");

  return ids;
}

function readTeacherOwnershipIds(profile, authUid) {
  var ids = [];

  addText(ids, authUid || "");
  addText(ids, profile ? profile.id : "");
  addText(ids, profile ? profile.profileUserId : "");
  addText(ids, profile ? profile.authUid : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.id : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.profileUserId : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.authUid : "");

  return ids;
}

function addRecordList(ids, values, targetType) {
  var safeValues = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < safeValues.length) {
    addText(ids, readRecordId(safeValues[index], targetType));
    index = index + 1;
  }
}

function readRecordId(value, targetType) {
  if (!value || typeof value !== "object") {
    return typeof value === "string" ? value : "";
  }

  if (targetType === "class") {
    return readText(value.id || value.classId || value.refId || value.uid);
  }

  return readText(value.id || value.locationId || value.schoolId || value.refId || value.uid);
}

function addTextList(ids, values) {
  var safeValues = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < safeValues.length) {
    addText(ids, safeValues[index]);
    index = index + 1;
  }
}

function addText(ids, value) {
  var text = readText(value);

  if (text && ids.indexOf(text) === -1) {
    ids.push(text);
  }
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}


