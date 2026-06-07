import { db, doc, getDoc, serverTimestamp, setDoc } from "../../firebase/index.js";
import { getDownloadURL, ref, storage, uploadBytes } from "../../firebase/storage/index.js?v=1.1.117-student-identity-binding";
import { getCourseAssignments } from "../assignments/index.js";
import {
  canResubmitExternalTaskSubmission,
  normalizeExternalTaskSubmission,
  readExternalTaskAttemptNumber
} from "./externalTaskModel.js?v=1.1.117-student-identity-binding";
import { getStudentExternalTaskSubmissions, getLatestStudentExternalTaskSubmission } from "./externalTaskQueries.js?v=1.1.117-student-identity-binding";

export async function getExternalTaskSubmissionById(submissionId) {
  if (!submissionId) {
    return null;
  }

  var submissionSnap = await getDoc(doc(db, "externalTaskSubmissions", submissionId));

  if (!submissionSnap.exists()) {
    return null;
  }

  return Object.assign({ id: submissionSnap.id }, submissionSnap.data() || {});
}

export async function updateExternalTaskReview(submissionId, reviewData) {
  var update = Object.assign({}, reviewData || {}, {
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await setDoc(doc(db, "externalTaskSubmissions", submissionId), update, { merge: true });

  return Object.assign({ id: submissionId }, update);
}

export async function createStudentExternalTaskSubmission(payload, actor, profile) {
  var safePayload = payload || {};
  var safeActor = actor || {};
  var safeProfile = profile || {};
  var submissionId = createSubmissionId();
  var files = Array.isArray(safePayload.files) ? safePayload.files : [];
  var uploadedFiles = [];
  var fileIndex = 0;
  var previousSubmissions = await getStudentExternalTaskSubmissions(createStudentSubmissionFilters(safePayload, safeActor));
  var attemptNumber = readExternalTaskAttemptNumber(previousSubmissions);
  var assignment = await loadSubmissionAssignment(safePayload, safeActor, safeProfile);

  while (fileIndex < files.length) {
    uploadedFiles.push(await uploadExternalTaskFile(safePayload, safeActor, submissionId, files[fileIndex]));
    fileIndex = fileIndex + 1;
  }

  return await writeStudentExternalTaskSubmission(
    safePayload,
    safeActor,
    safeProfile,
    submissionId,
    uploadedFiles,
    attemptNumber,
    assignment,
    safePayload.previousSubmissionId || ""
  );
}

export async function createStudentExternalTaskResubmission(payload, actor, profile) {
  var safePayload = payload || {};
  var safeActor = actor || {};
  var latestSubmission = await getLatestStudentExternalTaskSubmission(createStudentSubmissionFilters(safePayload, safeActor));

  if (!latestSubmission) {
    throw new Error("No previous external task submission was found to resubmit.");
  }

  if (!canResubmitExternalTaskSubmission(latestSubmission)) {
    throw new Error("This external task is not open for resubmission.");
  }

  return await createStudentExternalTaskSubmission(
    Object.assign({}, safePayload, {
      previousSubmissionId: safePayload.previousSubmissionId || latestSubmission.id || latestSubmission.submissionId || ""
    }),
    actor,
    profile
  );
}

export async function uploadExternalTaskFile(payload, actor, submissionId, file) {
  validateUploadFile(file, payload);

  var storagePath = buildStoragePath(payload || {}, actor || {}, submissionId, file.name);
  var storageRef = ref(storage, storagePath);
  var metadata = {
    contentType: file.type || "application/octet-stream"
  };

  await uploadBytes(storageRef, file, metadata);

  return {
    name: file.name || "upload",
    storagePath: storagePath,
    downloadUrl: await getDownloadURL(storageRef),
    contentType: file.type || "",
    size: file.size || 0,
    uploadedAt: Date.now()
  };
}

async function writeStudentExternalTaskSubmission(payload, actor, profile, submissionId, files, attemptNumber, assignment, previousSubmissionId) {
  var record = createSubmissionRecord(payload, actor, profile, submissionId, files, attemptNumber, assignment, previousSubmissionId);

  await setDoc(doc(db, "externalTaskSubmissions", submissionId), record, { merge: true });

  return normalizeExternalTaskSubmission(Object.assign({ id: submissionId }, record));
}

function createStudentSubmissionFilters(payload, actor) {
  return {
    courseId: payload.courseId,
    assignmentId: payload.assignmentId || payload.courseAssignmentId,
    courseAssignmentId: payload.courseAssignmentId || payload.assignmentId,
    moduleId: payload.moduleId,
    stepId: payload.stepId,
    studentId: actor && actor.id ? actor.id : ""
  };
}

async function loadSubmissionAssignment(payload, actor, profile) {
  var assignmentId = payload.assignmentId || payload.courseAssignmentId || "";
  var targets = [];
  var index = 0;

  if (assignmentId) {
    try {
      var assignmentSnap = await getDoc(doc(db, "courseAssignments", assignmentId));
      if (assignmentSnap.exists()) {
        return Object.assign({ id: assignmentSnap.id }, assignmentSnap.data() || {});
      }
    } catch (error) {
      return null;
    }
  }

  addAssignmentTarget(targets, "student", actor && actor.id ? actor.id : "");
  addAssignmentTarget(targets, "student", profile && profile.id ? profile.id : "");
  addAssignmentTarget(targets, "class", payload.classId || (profile ? profile.classId : ""));
  addAssignmentTarget(targets, "location", payload.locationId || (profile ? (profile.locationId || profile.primaryLocationId) : ""));

  while (index < targets.length) {
    try {
      var assignments = await getCourseAssignments({
        courseId: payload.courseId,
        targetType: targets[index].targetType,
        targetId: targets[index].targetId,
        status: "active"
      });

      if (assignments.length > 0) {
        return assignments[0];
      }
    } catch (error) {
      // Keep submission usable even if assignment metadata cannot be copied.
    }

    index = index + 1;
  }

  return null;
}

function addAssignmentTarget(targets, targetType, targetId) {
  if (targetId) {
    targets.push({
      targetType: targetType,
      targetId: targetId
    });
  }
}

function createSubmissionRecord(payload, actor, profile, submissionId, files, attemptNumber, assignment, previousSubmissionId) {
  var assignmentId = payload.assignmentId || payload.courseAssignmentId || (assignment && assignment.id ? assignment.id : "");

  return {
    submissionId: submissionId,
    stepId: payload.stepId,
    modeId: payload.modeId,
    sessionId: payload.sessionId,
    moduleId: payload.moduleId,
    courseId: payload.courseId,
    assignmentId: assignmentId,
    courseAssignmentId: assignmentId,
    studentId: actor.id || "",
    studentName: profile.displayName || profile.name || actor.id || "",
    classId: payload.classId || profile.classId || "",
    locationId: payload.locationId || profile.locationId || profile.primaryLocationId || "",
    taskTitle: payload.taskTitle,
    checklistSnapshot: Array.isArray(payload.checklistSnapshot) ? payload.checklistSnapshot : [],
    studentNote: payload.studentNote || "",
    files: files,
    status: "submitted",
    reviewStatus: "pending",
    previousSubmissionId: previousSubmissionId || "",
    reviewedBy: null,
    reviewedAt: null,
    teacherFeedback: "",
    teacherOwnershipIds: readTeacherOwnershipIdsFromAssignment(assignment),
    attemptNumber: attemptNumber,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function readTeacherOwnershipIdsFromAssignment(assignment) {
  var ids = [];

  if (!assignment) {
    return ids;
  }

  appendUniqueText(ids, assignment.teacherOwnershipIds);
  appendUniqueText(ids, assignment.responsibleTeacherId);
  appendUniqueText(ids, assignment.assistantIds);

  return ids;
}

function appendUniqueText(ids, value) {
  var index = 0;

  if (typeof value === "string") {
    if (value && ids.indexOf(value) === -1) {
      ids.push(value);
    }
    return;
  }

  if (!Array.isArray(value)) {
    return;
  }

  while (index < value.length) {
    appendUniqueText(ids, value[index]);
    index = index + 1;
  }
}

function validateUploadFile(file, payload) {
  var maxFileSizeMb = readNumber(payload.maxFileSizeMb, 10);
  var maxBytes = maxFileSizeMb * 1024 * 1024;

  if (!file) {
    throw new Error("File is required.");
  }

  if (file.size > maxBytes) {
    throw new Error("File is larger than " + maxFileSizeMb + " MB.");
  }

  if (!isAllowedContentType(file.type || "")) {
    throw new Error("File type is not allowed.");
  }
}

function buildStoragePath(payload, actor, submissionId, fileName) {
  return "external-task-submissions/"
    + cleanSegment(payload.courseId) + "/"
    + cleanSegment(payload.moduleId) + "/"
    + cleanSegment(payload.stepId) + "/"
    + cleanSegment(actor.id) + "/"
    + cleanSegment(submissionId) + "/"
    + Date.now() + "-" + cleanFileName(fileName);
}

function createSubmissionId() {
  return "external-task-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}

function cleanSegment(value) {
  return String(value || "unknown").replace(/[^a-zA-Z0-9_-]/g, "-");
}

function cleanFileName(value) {
  return String(value || "upload").replace(/[^a-zA-Z0-9._-]/g, "-");
}

function isAllowedContentType(contentType) {
  return contentType.indexOf("image/") === 0
    || contentType === "application/pdf"
    || contentType === "application/msword"
    || contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    || contentType === "application/vnd.ms-powerpoint"
    || contentType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    || contentType === "application/vnd.ms-excel"
    || contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    || contentType === "text/plain"
    || contentType === "text/csv";
}

function readNumber(value, fallback) {
  var numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}
