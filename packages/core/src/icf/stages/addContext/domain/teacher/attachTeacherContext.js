import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.29-module-render-fix";

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
    var profileSnap = await getDoc(doc(db, "users", actor.id));
    var profile = profileSnap.exists() ? Object.assign({ id: profileSnap.id }, profileSnap.data() || {}) : null;

    return {
      valid: true,
      data: {
        teacherProfile: profile,
        teacherClassIds: readTeacherClassIds(profile),
        teacherLocationIds: readTeacherLocationIds(profile)
      }
    };
  } catch (error) {
    console.warn("[teacher-dashboard:add-context-failed]", {
      teacherId: actor.id || "",
      attemptedProfilePath: actor.id ? "users/" + actor.id : "",
      errorMessage: readErrorMessage(error)
    });

    return {
      valid: true,
      data: {
        teacherProfile: null,
        teacherClassIds: [],
        teacherLocationIds: []
      }
    };
  }
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
    var submissionSnap = await getDoc(doc(db, "externalTaskSubmissions", payload.submissionId));

    return {
      valid: true,
      data: {
        externalTaskSubmission: submissionSnap.exists()
          ? Object.assign({ id: submissionSnap.id }, submissionSnap.data() || {})
          : null
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
