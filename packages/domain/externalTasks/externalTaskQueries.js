import { collection, db, getDocs, query, where } from "../../firebase/index.js";
import { normalizeExternalTaskSubmission } from "./externalTaskModel.js?v=1.1.120-student-course-debug-summary";

export async function getStudentExternalTaskSubmissions(filters) {
  var safeFilters = filters || {};
  var studentId = safeFilters.studentId || "";
  var submissionsRef = collection(db, "externalTaskSubmissions");
  var snapshot = null;
  var submissions = [];

  if (!studentId) {
    return [];
  }

  snapshot = await getDocs(query(submissionsRef, where("studentId", "==", studentId)));
  snapshot.forEach(function (submissionSnap) {
    var submission = normalizeExternalTaskSubmission(Object.assign({ id: submissionSnap.id }, submissionSnap.data() || {}));

    if (matchesExternalTaskFilters(submission, safeFilters)) {
      submissions.push(submission);
    }
  });

  return submissions.sort(compareSubmissionByCreatedAt);
}

export async function getLatestStudentExternalTaskSubmission(filters) {
  var submissions = await getStudentExternalTaskSubmissions(filters || {});
  return submissions.length > 0 ? submissions[0] : null;
}

export async function getExternalTaskSubmissions(filters) {
  var safeFilters = filters || {};
  var submissionsRef = collection(db, "externalTaskSubmissions");
  var constraints = [];
  var snapshot = null;
  var submissions = [];

  appendWhere(constraints, "studentId", safeFilters.studentId);
  appendWhere(constraints, "courseId", safeFilters.courseId);
  appendWhere(constraints, "moduleId", safeFilters.moduleId);
  appendWhere(constraints, "stepId", safeFilters.stepId);
  appendWhere(constraints, "classId", safeFilters.classId);
  appendWhere(constraints, "locationId", safeFilters.locationId);
  appendWhere(constraints, "assignmentId", safeFilters.assignmentId || safeFilters.courseAssignmentId);
  appendWhere(constraints, "teacherOwnershipIds", safeFilters.teacherOwnershipId, "array-contains");
  appendWhere(constraints, "status", safeFilters.status);
  appendWhere(constraints, "reviewStatus", safeFilters.reviewStatus);

  try {
    snapshot = constraints.length > 0
      ? await getDocs(query(submissionsRef, ...constraints))
      : await getDocs(submissionsRef);
  } catch (error) {
    if (!isRecoverableEmptyQueryError(error)) {
      throw error;
    }

    snapshot = await queryExternalTaskSubmissionsFallback(submissionsRef, safeFilters);
  }

  snapshot.forEach(function (submissionSnap) {
    var submission = normalizeExternalTaskSubmission(Object.assign({ id: submissionSnap.id }, submissionSnap.data() || {}));

    if (matchesExternalTaskFilters(submission, safeFilters)) {
      submissions.push(submission);
    }
  });

  return submissions.sort(compareSubmissionByCreatedAt);
}

export async function getScopedExternalTaskSubmissions(filters) {
  var submissions = [];
  var safeFilters = filters || {};
  var classIds = safeFilters.classIds || [];
  var assignmentIds = safeFilters.assignmentIds || [];
  var courseIds = safeFilters.courseIds || [];
  var teacherIds = safeFilters.teacherIds || [];
  var index = 0;

  while (index < teacherIds.length) {
    await appendSubmissionQuery(submissions, buildSubmissionQuery("teacherOwnershipIds", teacherIds[index], safeFilters, "array-contains"), {
      classId: "",
      assignmentId: "",
      courseId: "",
      queryShape: readSubmissionQueryShape("teacherOwnershipIds", safeFilters)
    });
    index = index + 1;
  }

  index = 0;
  while (index < assignmentIds.length) {
    await appendSubmissionQuery(submissions, buildSubmissionQuery("assignmentId", assignmentIds[index], safeFilters), {
      classId: "",
      assignmentId: assignmentIds[index],
      courseId: "",
      queryShape: readSubmissionQueryShape("assignmentId", safeFilters)
    });
    await appendSubmissionQuery(submissions, buildSubmissionQuery("courseAssignmentId", assignmentIds[index], safeFilters), {
      classId: "",
      assignmentId: assignmentIds[index],
      courseId: "",
      queryShape: readSubmissionQueryShape("courseAssignmentId", safeFilters)
    });
    index = index + 1;
  }

  index = 0;
  while (index < classIds.length) {
    await appendSubmissionQuery(submissions, buildSubmissionQuery("classId", classIds[index], safeFilters), {
      classId: classIds[index],
      assignmentId: "",
      courseId: "",
      queryShape: readSubmissionQueryShape("classId", safeFilters)
    });
    index = index + 1;
  }

  if (assignmentIds.length === 0 && classIds.length === 0) {
    index = 0;
    while (index < courseIds.length) {
      await appendSubmissionQuery(submissions, buildSubmissionQuery("courseId", courseIds[index], safeFilters), {
        classId: "",
        assignmentId: "",
        courseId: courseIds[index],
        queryShape: readSubmissionQueryShape("courseId", safeFilters)
      });
      index = index + 1;
    }
  }

  return submissions.filter(function (submission) {
    return isSubmissionInOwnedScope(submission, safeFilters)
      && matchesOptional(submission.reviewStatus, safeFilters.reviewStatus)
      && matchesOptional(submission.courseId, safeFilters.courseId)
      && matchesOptional(submission.moduleId, safeFilters.moduleId);
  }).sort(compareSubmissionByCreatedAt);
}

export async function getExternalTaskSubmissionsForTeacher(filters) {
  var safeFilters = normalizeTeacherSubmissionFilters(filters || {});
  var submissions = await getScopedExternalTaskSubmissions(safeFilters);
  var search = readSearchText(safeFilters.studentSearch || safeFilters.searchStudentName || safeFilters.search);

  return submissions.filter(function (submission) {
    return matchesOptional(submission.classId, safeFilters.classId)
      && matchesOptional(submission.courseId, safeFilters.courseId)
      && matchesOptional(submission.moduleId, safeFilters.moduleId)
      && matchesOptional(submission.reviewStatus, safeFilters.reviewStatus)
      && matchesStudentSearch(submission, search);
  }).sort(compareSubmissionByCreatedAt);
}

export function isSubmissionInOwnedScope(submission, filters) {
  var safeFilters = filters || {};
  var classIds = safeFilters.classIds || [];
  var assignmentIds = safeFilters.assignmentIds || [];
  var courseIds = safeFilters.courseIds || [];
  var teacherIds = safeFilters.teacherIds || [];

  if (Array.isArray(submission.teacherOwnershipIds) && submission.teacherOwnershipIds.some(function (teacherId) {
    return teacherIds.indexOf(teacherId) !== -1;
  })) {
    return true;
  }

  if (submission.assignmentId && assignmentIds.indexOf(submission.assignmentId) !== -1) {
    return true;
  }

  if (submission.courseAssignmentId && assignmentIds.indexOf(submission.courseAssignmentId) !== -1) {
    return true;
  }

  if (submission.classId && classIds.indexOf(submission.classId) !== -1) {
    return true;
  }

  return assignmentIds.length === 0 && classIds.length === 0 && submission.courseId && courseIds.indexOf(submission.courseId) !== -1;
}

function normalizeTeacherSubmissionFilters(filters) {
  var safeFilters = Object.assign({}, filters || {});

  if (safeFilters.reviewStatus === "all") {
    safeFilters.reviewStatus = "";
  }

  if (safeFilters.classId && (!Array.isArray(safeFilters.classIds) || safeFilters.classIds.length === 0)) {
    safeFilters.classIds = [safeFilters.classId];
  }

  return safeFilters;
}

function matchesStudentSearch(submission, search) {
  if (!search) {
    return true;
  }

  return readSearchText([
    submission.studentName,
    submission.studentDisplayName,
    submission.studentId
  ].join(" ")).indexOf(search) !== -1;
}

function readSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

function buildSubmissionQuery(scopeField, scopeValue, filters, operator) {
  if (filters && filters.reviewStatus) {
    return query(collection(db, "externalTaskSubmissions"), where(scopeField, operator || "==", scopeValue), where("reviewStatus", "==", filters.reviewStatus));
  }

  return query(collection(db, "externalTaskSubmissions"), where(scopeField, operator || "==", scopeValue));
}

function readSubmissionQueryShape(scopeField, filters) {
  var operatorLabel = scopeField === "teacherOwnershipIds" ? "array-contains" : "==";

  return filters && filters.reviewStatus
    ? "externalTaskSubmissions where " + scopeField + " " + operatorLabel + " scopeValue and reviewStatus == " + filters.reviewStatus
    : "externalTaskSubmissions where " + scopeField + " " + operatorLabel + " scopeValue";
}

async function appendSubmissionQuery(submissions, submissionsQuery, details) {
  console.info("[teacher-dashboard:submissions-query]", {
    classId: details && details.classId ? details.classId : "",
    assignmentId: details && details.assignmentId ? details.assignmentId : "",
    courseId: details && details.courseId ? details.courseId : "",
    queryShape: details && details.queryShape ? details.queryShape : "externalTaskSubmissions scoped query"
  });

  try {
    var snapshot = await getDocs(submissionsQuery);
    snapshot.forEach(function (submissionSnap) {
      addUniqueRecord(submissions, Object.assign({ id: submissionSnap.id }, submissionSnap.data() || {}));
    });
  } catch (error) {
    console.warn("[teacher-dashboard:submissions-query-failed]", {
      classId: details && details.classId ? details.classId : "",
      assignmentId: details && details.assignmentId ? details.assignmentId : "",
      courseId: details && details.courseId ? details.courseId : "",
      queryShape: details && details.queryShape ? details.queryShape : "externalTaskSubmissions scoped query",
      errorMessage: readErrorMessage(error)
    });
  }
}

function compareSubmissionByCreatedAt(a, b) {
  return readMillis(b.createdAt) - readMillis(a.createdAt);
}

function matchesExternalTaskFilters(submission, filters) {
  var safeFilters = filters || {};

  return matchesOptional(submission.courseId, safeFilters.courseId)
    && matchesOptional(submission.moduleId, safeFilters.moduleId)
    && matchesOptional(submission.stepId, safeFilters.stepId)
    && matchesOptional(submission.studentId, safeFilters.studentId)
    && matchesOptional(submission.classId, safeFilters.classId)
    && matchesOptional(submission.locationId, safeFilters.locationId)
    && matchesAssignmentFilter(submission, safeFilters.assignmentId, safeFilters.courseAssignmentId)
    && matchesOwnershipFilter(submission.teacherOwnershipIds, safeFilters.teacherOwnershipId)
    && matchesOptional(submission.status, safeFilters.status)
    && matchesOptional(submission.reviewStatus, safeFilters.reviewStatus);
}

function matchesOptional(actual, expected) {
  return !expected || actual === expected;
}

function matchesAssignmentFilter(submission, assignmentId, courseAssignmentId) {
  var expectedId = assignmentId || courseAssignmentId || "";

  return !expectedId
    || submission.assignmentId === expectedId
    || submission.courseAssignmentId === expectedId;
}

function matchesOwnershipFilter(actualIds, expectedId) {
  return !expectedId || (Array.isArray(actualIds) && actualIds.indexOf(expectedId) !== -1);
}

async function queryExternalTaskSubmissionsFallback(submissionsRef, filters) {
  if (filters.studentId) {
    return await getDocs(query(submissionsRef, where("studentId", "==", filters.studentId)));
  }

  if (filters.courseId) {
    return await getDocs(query(submissionsRef, where("courseId", "==", filters.courseId)));
  }

  if (filters.classId) {
    return await getDocs(query(submissionsRef, where("classId", "==", filters.classId)));
  }

  if (filters.locationId) {
    return await getDocs(query(submissionsRef, where("locationId", "==", filters.locationId)));
  }

  if (filters.assignmentId) {
    return await getDocs(query(submissionsRef, where("assignmentId", "==", filters.assignmentId)));
  }

  if (filters.courseAssignmentId) {
    return await getDocs(query(submissionsRef, where("courseAssignmentId", "==", filters.courseAssignmentId)));
  }

  if (filters.teacherOwnershipId) {
    return await getDocs(query(submissionsRef, where("teacherOwnershipIds", "array-contains", filters.teacherOwnershipId)));
  }

  if (filters.reviewStatus) {
    return await getDocs(query(submissionsRef, where("reviewStatus", "==", filters.reviewStatus)));
  }

  return await getDocs(submissionsRef);
}

function appendWhere(constraints, fieldName, value, operator) {
  if (value) {
    constraints.push(where(fieldName, operator || "==", value));
  }
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

function addUniqueRecord(records, record) {
  if (!record || !record.id) {
    return;
  }

  if (!records.some(function (item) { return item.id === record.id; })) {
    records.push(record);
  }
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

  if (value.seconds) {
    return value.seconds * 1000;
  }

  return 0;
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}
