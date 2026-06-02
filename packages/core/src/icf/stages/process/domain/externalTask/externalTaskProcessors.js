import { collection, db, doc, getDocs, query, serverTimestamp, setDoc, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.29-module-render-fix";
import { getDownloadURL, ref, storage, uploadBytes } from "../../../../../infrastructure/firebase/storage.js?v=1.1.29-module-render-fix";

export async function processLoadExternalTaskStep(executionState) {
  var payload = executionState.payload || {};
  var actor = executionState.actor || {};

  try {
    var submissions = await queryExternalTaskSubmissions({
      courseId: payload.courseId,
      moduleId: payload.moduleId,
      stepId: payload.stepId,
      studentId: payload.studentId || actor.id
    });

    executionState.result = {
      submission: readLatestSubmission(submissions),
      submissions: submissions
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("LoadExternalTaskStepIntent", executionState, error, "externalTaskSubmissions");
    return createProcessError("EXTERNAL_TASK_STEP_LOAD_FAILED", "Could not load external task status: " + readErrorMessage(error));
  }
}

export async function processUploadExternalTaskFile(executionState) {
  var payload = executionState.payload || {};

  try {
    var fileRecord = await uploadExternalTaskFile(payload, executionState.actor || {}, payload.submissionId, payload.file);
    executionState.result = {
      file: fileRecord
    };
    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("UploadExternalTaskFileIntent", executionState, error, "external-task-submissions");
    return createProcessError("EXTERNAL_TASK_FILE_UPLOAD_FAILED", "Could not upload proof file: " + readErrorMessage(error));
  }
}

export async function processSubmitExternalTask(executionState) {
  var payload = executionState.payload || {};
  var actor = executionState.actor || {};
  var profile = executionState.context.studentProfile || {};
  var submissionId = createSubmissionId();
  var files = Array.isArray(payload.files) ? payload.files : [];

  try {
    var uploadedFiles = [];
    var fileIndex = 0;
    var previousSubmissions = await queryExternalTaskSubmissions({
      courseId: payload.courseId,
      moduleId: payload.moduleId,
      stepId: payload.stepId,
      studentId: actor.id || ""
    });
    var attemptNumber = readNextAttemptNumber(previousSubmissions);

    while (fileIndex < files.length) {
      uploadedFiles.push(await uploadExternalTaskFile(payload, actor, submissionId, files[fileIndex]));
      fileIndex = fileIndex + 1;
    }

    var record = createSubmissionRecord(payload, actor, profile, submissionId, uploadedFiles, attemptNumber);

    await setDoc(doc(db, "externalTaskSubmissions", submissionId), record, { merge: true });

    executionState.result = {
      submission: Object.assign({ id: submissionId }, record)
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("SubmitExternalTaskIntent", executionState, error, "externalTaskSubmissions/" + submissionId);
    return createProcessError("EXTERNAL_TASK_SUBMIT_FAILED", "Could not submit external task: " + readErrorMessage(error));
  }
}

export async function processResubmitExternalTask(executionState) {
  return processSubmitExternalTask(executionState);
}

export async function processLoadExternalTaskSubmissions(executionState) {
  try {
    var submissions = await queryExternalTaskSubmissions(executionState.payload || {});
    executionState.result = {
      submissions: submissions
    };
    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskSubmissionsFailure(executionState, error, "externalTaskSubmissions");
    return createProcessError("EXTERNAL_TASK_SUBMISSIONS_LOAD_FAILED", "Could not load external task submissions: " + readErrorMessage(error));
  }
}

export async function processReviewExternalTaskSubmission(executionState) {
  var payload = executionState.payload || {};
  var actor = executionState.actor || {};

  try {
    var update = {
      reviewStatus: payload.reviewStatus,
      reviewedBy: actor.id || "",
      reviewedAt: serverTimestamp(),
      teacherFeedback: payload.teacherFeedback || "",
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, "externalTaskSubmissions", payload.submissionId), update, { merge: true });

    executionState.result = {
      submissionId: payload.submissionId,
      reviewStatus: payload.reviewStatus,
      teacherFeedback: payload.teacherFeedback || ""
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("ReviewExternalTaskSubmissionIntent", executionState, error, "externalTaskSubmissions/" + payload.submissionId);
    return createProcessError("EXTERNAL_TASK_REVIEW_FAILED", "Could not save teacher review: " + readErrorMessage(error));
  }
}

async function uploadExternalTaskFile(payload, actor, submissionId, file) {
  validateUploadFile(file, payload);

  var storagePath = buildStoragePath(payload, actor, submissionId, file.name);
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

function createSubmissionRecord(payload, actor, profile, submissionId, files, attemptNumber) {
  return {
    stepId: payload.stepId,
    modeId: payload.modeId,
    sessionId: payload.sessionId,
    moduleId: payload.moduleId,
    courseId: payload.courseId,
    assignmentId: payload.assignmentId || "",
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
    reviewedBy: null,
    reviewedAt: null,
    teacherFeedback: "",
    attemptNumber: attemptNumber,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

async function queryExternalTaskSubmissions(filters) {
  var constraints = [];
  var submissionsRef = collection(db, "externalTaskSubmissions");
  var snapshot = null;
  var submissions = [];

  appendWhere(constraints, "courseId", filters.courseId);
  appendWhere(constraints, "moduleId", filters.moduleId);
  appendWhere(constraints, "stepId", filters.stepId);
  appendWhere(constraints, "studentId", filters.studentId);
  appendWhere(constraints, "classId", filters.classId);
  appendWhere(constraints, "locationId", filters.locationId);
  appendWhere(constraints, "status", filters.status);
  appendWhere(constraints, "reviewStatus", filters.reviewStatus);

  try {
    snapshot = constraints.length > 0
      ? await getDocs(query(submissionsRef, ...constraints))
      : await getDocs(submissionsRef);
  } catch (error) {
    if (isRecoverableEmptyQueryError(error)) {
      logExternalTaskSubmissionsFailure({
        actor: {},
        payload: filters || {}
      }, error, "externalTaskSubmissions");
      return [];
    }

    throw error;
  }

  snapshot.forEach(function (submissionSnap) {
    submissions.push(Object.assign({ id: submissionSnap.id }, submissionSnap.data() || {}));
  });

  submissions.sort(function (a, b) {
    return readMillis(b.createdAt) - readMillis(a.createdAt);
  });

  return submissions;
}

function isRecoverableEmptyQueryError(error) {
  if (!error) {
    return false;
  }

  var code = error.code || "";
  var message = readErrorMessage(error).toLowerCase();

  return code === "failed-precondition" ||
    code === "permission-denied" ||
    message.indexOf("index") !== -1 ||
    message.indexOf("requires an index") !== -1 ||
    message.indexOf("permission") !== -1;
}

function logExternalTaskSubmissionsFailure(executionState, error, queryPath) {
  if (!isDevelopmentHost()) {
    return;
  }

  var payload = executionState && executionState.payload ? executionState.payload : {};
  var actor = executionState && executionState.actor ? executionState.actor : {};

  console.warn("[external-task-submissions] load failed", {
    actorUid: actor.id || "unknown",
    courseId: payload.courseId || "",
    classId: payload.classId || "",
    locationId: payload.locationId || "",
    queryPath: queryPath || "externalTaskSubmissions",
    errorCode: error && error.code ? error.code : "",
    errorMessage: readErrorMessage(error)
  });
}

function appendWhere(constraints, fieldName, value) {
  if (value) {
    constraints.push(where(fieldName, "==", value));
  }
}

function readLatestSubmission(submissions) {
  return Array.isArray(submissions) && submissions.length > 0 ? submissions[0] : null;
}

function readNextAttemptNumber(submissions) {
  var maxAttempt = 0;
  var index = 0;
  var safeSubmissions = Array.isArray(submissions) ? submissions : [];

  while (index < safeSubmissions.length) {
    if (typeof safeSubmissions[index].attemptNumber === "number" && safeSubmissions[index].attemptNumber > maxAttempt) {
      maxAttempt = safeSubmissions[index].attemptNumber;
    }
    index = index + 1;
  }

  return maxAttempt + 1;
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
    || contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}

function readNumber(value, fallback) {
  var numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function readMillis(value) {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value === "number") {
    return value;
  }

  return 0;
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

function logExternalTaskProcessError(intentName, executionState, error, path) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.warn("[external-task-debug] Process failed.", {
    intentName: executionState.intentType || intentName,
    actor: executionState.actor && executionState.actor.id ? executionState.actor.id : "unknown",
    path: path,
    firebaseErrorCode: error && error.code ? error.code : "",
    message: readErrorMessage(error)
  });
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && (window.location.hostname === "localhost"
      || window.location.hostname === "127.0.0.1"
      || window.location.hostname === "");
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  if (error.code && error.message) {
    return error.code + " " + error.message;
  }

  return error.message || String(error);
}
