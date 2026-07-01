import { collection, db, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "../../firebase/index.js";
import { isActiveAssignment, normalizeCourseAssignment } from "./index.js";

export async function getCourseAssignments(filters) {
  var safeFilters = filters || {};
  var assignmentsRef = collection(db, "courseAssignments");
  var constraints = [];

  appendEqualityConstraint(constraints, "courseId", safeFilters.courseId);
  appendEqualityConstraint(constraints, "status", safeFilters.status);
  appendEqualityConstraint(constraints, "targetType", safeFilters.targetType);
  appendEqualityConstraint(constraints, "targetId", safeFilters.targetId);

  var snapshot = constraints.length > 0
    ? await getDocs(query(assignmentsRef, ...constraints))
    : await getDocs(assignmentsRef);

  return filterAssignments(readAssignmentsFromSnapshot(snapshot), safeFilters);
}

export async function getAssignmentsForCourse(courseId) {
  if (!courseId) {
    return [];
  }

  return loadAssignments(query(
    collection(db, "courseAssignments"),
    where("courseId", "==", courseId)
  ));
}

export async function getAssignmentsForStudent(studentId) {
  if (!studentId) {
    return [];
  }

  return loadAssignmentsForTarget({
    targetType: "student",
    targetId: studentId
  });
}

export async function getAssignmentsForClass(classId) {
  if (!classId) {
    return [];
  }

  return loadAssignmentsForTarget({
    targetType: "class",
    targetId: classId
  });
}

export async function getActiveAssignmentsForStudent(studentProfile) {
  var studentId = readTextValue(studentProfile && (studentProfile.id || studentProfile.studentId || studentProfile.uid || studentProfile.authUid));
  var targets = buildStudentAssignmentTargets(studentId, studentProfile);
  var result = createStudentAssignmentResult(studentProfile);
  var targetIndex = 0;

  await appendResolvedClassIdentityTargets(targets, result);

  while (targetIndex < targets.length) {
    await appendTargetAssignments(result, targets[targetIndex]);
    targetIndex = targetIndex + 1;
  }

  if (targets.length === 0) {
    result.warnings.push({
      code: "STUDENT_ASSIGNMENT_TARGETS_MISSING",
      message: "Student profile has no student, class, or location assignment targets."
    });
  }

  return result;
}

export async function createCourseAssignment(assignmentData) {
  var normalized = normalizeCourseAssignment(assignmentData || {});
  var assignmentId = normalized.id || createCourseAssignmentId();
  var targetType = normalized.targetType || "class";
  var targetId = normalized.targetId || (targetType === "student" ? normalized.studentId : normalized.classId);
  var record = cleanAssignmentRecord(Object.assign({}, normalized, {
    id: assignmentId,
    assignmentType: normalized.assignmentType || "course",
    targetType: targetType,
    targetId: targetId,
    classId: targetType === "class" ? normalized.classId || targetId : "",
    studentId: targetType === "student" ? normalized.studentId || targetId : "",
    status: normalized.status || "active",
    visibility: normalized.visibility || "visible",
    updatedAt: serverTimestamp()
  }));

  if (!record.courseId) {
    throw new Error("createCourseAssignment requires courseId.");
  }

  if (!record.targetId) {
    throw new Error("createCourseAssignment requires targetId.");
  }

  if (!record.createdAt && !record.assignedAt) {
    record.assignedAt = serverTimestamp();
  }

  await setDoc(doc(db, "courseAssignments", assignmentId), record, { merge: true });
  return record;
}

export function normalizeAssignment(rawAssignment) {
  return normalizeCourseAssignment(rawAssignment);
}

export function buildStudentAssignmentTargets(studentId, studentProfile) {
  var targets = [];

  addTarget(targets, "student", studentId || "");
  addTarget(targets, "student", studentProfile && studentProfile.id ? studentProfile.id : "");
  addTarget(targets, "student", studentProfile && studentProfile.studentId ? studentProfile.studentId : "");
  addTarget(targets, "student", studentProfile && studentProfile.authUid ? studentProfile.authUid : "");
  addTarget(targets, "student", studentProfile && studentProfile.uid ? studentProfile.uid : "");
  addTarget(targets, "student", studentProfile && studentProfile.userId ? studentProfile.userId : "");
  addTarget(targets, "student", studentProfile && studentProfile.profileUserId ? studentProfile.profileUserId : "");
  addTarget(targets, "class", readTextField(studentProfile, "classId"));
  addTargetList(targets, "class", readArrayField(studentProfile, "classIds"));
  addTargetList(targets, "class", readArrayField(studentProfile, "assignedClassIds"));
  addRecordTargetList(targets, "class", studentProfile ? studentProfile.assignedClasses : null);
  addRecordTargetList(targets, "class", studentProfile ? studentProfile.classRefs : null);
  addRecordTargetList(targets, "class", studentProfile ? studentProfile.classes : null);
  addClassIdentityTargets(targets, studentProfile);
  addRecordClassIdentityTargetList(targets, studentProfile ? studentProfile.assignedClasses : null);
  addRecordClassIdentityTargetList(targets, studentProfile ? studentProfile.classRefs : null);
  addRecordClassIdentityTargetList(targets, studentProfile ? studentProfile.classes : null);
  addTarget(targets, "location", readTextField(studentProfile, "locationId"));
  addTarget(targets, "location", readTextField(studentProfile, "primaryLocationId"));
  addTarget(targets, "location", readTextField(studentProfile, "schoolId"));
  addTarget(targets, "location", readTextField(studentProfile, "locId"));
  addTargetList(targets, "location", readArrayField(studentProfile, "locationIds"));
  addTargetList(targets, "location", readArrayField(studentProfile, "schoolIds"));

  return targets;
}

async function loadAssignments(assignmentQuery) {
  var snapshot = await getDocs(assignmentQuery);
  var assignments = [];

  snapshot.forEach(function (assignmentSnap) {
    var assignment = normalizeCourseAssignment(Object.assign({ id: assignmentSnap.id }, assignmentSnap.data() || {}));

    if (isActiveAssignment(assignment)) {
      assignments.push(assignment);
    }
  });

  return assignments;
}

async function loadAssignmentsForTarget(target) {
  return loadAssignments(query(
    collection(db, "courseAssignments"),
    where("targetType", "==", target.targetType),
    where("targetId", "==", target.targetId)
  ));
}

async function appendTargetAssignments(result, target) {
  var queries = buildAssignmentQueriesForTarget(target);
  var queryIndex = 0;
  var appendedCount = 0;

  while (queryIndex < queries.length) {
    result.queryPaths.push(queries[queryIndex].queryPath);

    try {
      var assignments = await queries[queryIndex].loader();
      var visibleAssignments = filterAssignmentsForTarget(assignments, target);
      var beforeCount = result.assignmentIds.length;

      appendAssignments(result, visibleAssignments, target);
      appendedCount = appendedCount + (result.assignmentIds.length - beforeCount);
    } catch (error) {
      addReasonCount(result.rejectionReasons, "assignment-query-failed");
      result.warnings.push({
        code: "STUDENT_ASSIGNMENT_QUERY_FAILED",
        message: queries[queryIndex].queryPath + " failed: " + readErrorMessage(error)
      });
      logAssignmentLoadWarning("STUDENT_ASSIGNMENT_QUERY_FAILED", {
        queryPath: queries[queryIndex].queryPath,
        targetType: target.targetType,
        targetId: target.targetId,
        errorMessage: readErrorMessage(error)
      });
    }

    queryIndex = queryIndex + 1;
  }

  if (appendedCount === 0) {
    addReasonCount(result.rejectionReasons, "no-assignment-for-target");
  }
}

function buildAssignmentQueriesForTarget(target) {
  var queries = [
    {
      queryPath: "courseAssignments where targetType=" + target.targetType + ", targetId=" + target.targetId,
      loader: function () {
        return loadAssignmentsForTarget(target);
      }
    }
  ];

  if (target.targetType === "student") {
    queries.push({
      queryPath: "courseAssignments where studentId=" + target.targetId + " filtered targetType=student",
      loader: function () {
        return loadAssignmentsByField("studentId", target.targetId);
      }
    });
  } else if (target.targetType === "class") {
    queries.push({
      queryPath: "courseAssignments where classId=" + target.targetId + " filtered targetType=class",
      loader: function () {
        return loadAssignmentsByField("classId", target.targetId);
      }
    });
  } else if (target.targetType === "location") {
    queries.push({
      queryPath: "courseAssignments where locationId=" + target.targetId + " filtered targetType=location",
      loader: function () {
        return loadAssignmentsByField("locationId", target.targetId);
      }
    });
  }

  return queries;
}

async function loadAssignmentsByField(fieldName, fieldValue) {
  return loadAssignments(query(
    collection(db, "courseAssignments"),
    where(fieldName, "==", fieldValue)
  ));
}

async function appendResolvedClassIdentityTargets(targets, result) {
  var classTargetIds = [];
  var targetIndex = 0;

  while (targetIndex < targets.length) {
    if (targets[targetIndex].targetType === "class") {
      addUniqueText(classTargetIds, targets[targetIndex].targetId);
    }
    targetIndex = targetIndex + 1;
  }

  var classIndex = 0;
  while (classIndex < classTargetIds.length) {
    await appendClassIdentityTargetsFromDocument(targets, result, classTargetIds[classIndex]);
    classIndex = classIndex + 1;
  }
}

async function appendClassIdentityTargetsFromDocument(targets, result, classId) {
  if (!classId) {
    return;
  }

  result.queryPaths.push("classes/" + classId + " identity read");

  try {
    var classSnap = await getDoc(doc(db, "classes", classId));

    if (classSnap.exists()) {
      addClassIdentityTargets(targets, Object.assign({ id: classSnap.id }, classSnap.data() || {}));
    }
  } catch (error) {
    addReasonCount(result.rejectionReasons, "class-identity-read-failed");
    result.warnings.push({
      code: "STUDENT_CLASS_IDENTITY_READ_FAILED",
      message: "Class identity read failed for " + classId + ": " + readErrorMessage(error)
    });
    logAssignmentLoadWarning("STUDENT_CLASS_IDENTITY_READ_FAILED", {
      classId: classId,
      errorMessage: readErrorMessage(error)
    });
  }
}

function filterAssignmentsForTarget(assignments, target) {
  return assignments.filter(function (assignment) {
    return isVisibleAssignment(assignment) && matchesAssignmentTarget(assignment, target);
  });
}

function matchesAssignmentTarget(assignment, target) {
  if (!assignment || assignment.targetType !== target.targetType) {
    return false;
  }

  if (assignment.targetId === target.targetId) {
    return true;
  }

  if (target.targetType === "student") {
    return assignment.studentId === target.targetId;
  }

  if (target.targetType === "class") {
    return assignment.classId === target.targetId;
  }

  if (target.targetType === "location") {
    return assignment.locationId === target.targetId;
  }

  return false;
}

function appendAssignments(result, assignments, target) {
  var assignmentIndex = 0;

  while (assignmentIndex < assignments.length) {
    appendAssignment(result, assignments[assignmentIndex], target);
    assignmentIndex = assignmentIndex + 1;
  }
}

function appendAssignment(result, assignment, target) {
  if (!assignment || !assignment.id) {
    return;
  }

  if (result.assignmentIds.indexOf(assignment.id) === -1) {
    result.assignmentIds.push(assignment.id);
    result.assignments.push(assignment);

    if (target.targetType === "student") {
      result.directAssignments.push(assignment);
    } else if (target.targetType === "class") {
      result.classAssignments.push(assignment);
    } else if (target.targetType === "location") {
      result.locationAssignments.push(assignment);
    }
  }

  if (assignment.courseId) {
    addUniqueText(result.courseIds, assignment.courseId);

    if (!result.assignmentIdByCourseId[assignment.courseId]) {
      result.assignmentIdByCourseId[assignment.courseId] = assignment.id;
    }
  }
}

function readAssignmentsFromSnapshot(snapshot) {
  var assignments = [];

  snapshot.forEach(function (assignmentSnap) {
    assignments.push(normalizeCourseAssignment(Object.assign({ id: assignmentSnap.id }, assignmentSnap.data() || {})));
  });

  return assignments;
}

function appendEqualityConstraint(constraints, fieldName, value) {
  if (!value) {
    return;
  }

  constraints.push(where(fieldName, "==", value));
}

function filterAssignments(assignments, filters) {
  return assignments.filter(function (assignment) {
    return matchesFilter(assignment, "courseId", filters.courseId)
      && matchesFilter(assignment, "status", filters.status)
      && matchesFilter(assignment, "targetType", filters.targetType)
      && matchesTargetId(assignment, filters.targetId);
  });
}

function matchesFilter(assignment, fieldName, expectedValue) {
  if (!expectedValue) {
    return true;
  }

  return assignment && assignment[fieldName] === expectedValue;
}

function matchesTargetId(assignment, expectedTargetId) {
  if (!expectedTargetId) {
    return true;
  }

  return assignment
    && (assignment.targetId === expectedTargetId
      || assignment.classId === expectedTargetId
      || assignment.studentId === expectedTargetId
      || assignment.locationId === expectedTargetId);
}

function createStudentAssignmentResult(studentProfile) {
  return {
    assignments: [],
    directAssignments: [],
    classAssignments: [],
    locationAssignments: [],
    courseIds: [],
    assignmentIds: [],
    assignmentIdByCourseId: {},
    classIds: readStudentClassIds(studentProfile),
    locationIds: readStudentLocationIds(studentProfile),
    warnings: [],
    queryPaths: [],
    rejectionReasons: {},
    source: "courseAssignments"
  };
}

function isVisibleAssignment(assignment) {
  if (!assignment || assignment.visibility === "hidden") {
    return false;
  }

  if (assignment.assignmentType && assignment.assignmentType !== "course") {
    return false;
  }

  return isActiveAssignment(assignment);
}

function createCourseAssignmentId() {
  var randomText = Math.random().toString(36).slice(2, 10);
  return "assignment-" + Date.now() + "-" + randomText;
}

function cleanAssignmentRecord(record) {
  var cleanRecord = {};
  var keys = Object.keys(record || {});
  var index = 0;

  while (index < keys.length) {
    if (typeof record[keys[index]] !== "undefined") {
      cleanRecord[keys[index]] = record[keys[index]];
    }
    index = index + 1;
  }

  return cleanRecord;
}

function readStudentClassIds(studentProfile) {
  var ids = [];

  addUniqueText(ids, readTextField(studentProfile, "classId"));
  addTextList(ids, readArrayField(studentProfile, "classIds"));
  addTextList(ids, readArrayField(studentProfile, "assignedClassIds"));
  addRecordTextList(ids, studentProfile ? studentProfile.assignedClasses : null, "class");
  addRecordTextList(ids, studentProfile ? studentProfile.classRefs : null, "class");
  addRecordTextList(ids, studentProfile ? studentProfile.classes : null, "class");

  return ids;
}

function readStudentLocationIds(studentProfile) {
  var ids = [];

  addUniqueText(ids, readTextField(studentProfile, "locationId"));
  addUniqueText(ids, readTextField(studentProfile, "primaryLocationId"));
  addUniqueText(ids, readTextField(studentProfile, "schoolId"));
  addUniqueText(ids, readTextField(studentProfile, "locId"));
  addTextList(ids, readArrayField(studentProfile, "locationIds"));
  addTextList(ids, readArrayField(studentProfile, "schoolIds"));

  return ids;
}

function addTarget(targets, targetType, targetId) {
  var safeTargetId = readTextValue(targetId);

  if (!safeTargetId || hasTarget(targets, targetType, safeTargetId)) {
    return;
  }

  targets.push({
    targetType: targetType,
    targetId: safeTargetId
  });
}

function addTargetList(targets, targetType, values) {
  var source = Array.isArray(values) ? values : [];
  var valueIndex = 0;

  while (valueIndex < source.length) {
    addTarget(targets, targetType, source[valueIndex]);
    valueIndex = valueIndex + 1;
  }
}

function addRecordTargetList(targets, targetType, values) {
  var source = Array.isArray(values) ? values : [];
  var valueIndex = 0;

  while (valueIndex < source.length) {
    addTarget(targets, targetType, readRecordId(source[valueIndex], targetType));
    valueIndex = valueIndex + 1;
  }
}

function addRecordClassIdentityTargetList(targets, values) {
  var source = Array.isArray(values) ? values : [];
  var valueIndex = 0;

  while (valueIndex < source.length) {
    addClassIdentityTargets(targets, source[valueIndex]);
    valueIndex = valueIndex + 1;
  }
}

function addClassIdentityTargets(targets, source) {
  if (!source || typeof source !== "object") {
    return;
  }

  addTarget(targets, "class", source.id);
  addTarget(targets, "class", source.classId);
  addTarget(targets, "class", source.classCode);
  addTarget(targets, "class", source.code);
  addTarget(targets, "class", source.className);
  addTarget(targets, "class", source.name);
  addTarget(targets, "class", source.displayName);
  addTarget(targets, "class", source.title);
  addTarget(targets, "class", source.label);
  addTarget(targets, "class", source.section);
  addTarget(targets, "class", source.shortName);
  addTarget(targets, "class", readLocalizedText(source.name));
  addTarget(targets, "class", readLocalizedText(source.title));
  addTarget(targets, "class", readLocalizedText(source.displayName));
}

function hasTarget(targets, targetType, targetId) {
  var targetIndex = 0;

  while (targetIndex < targets.length) {
    if (targets[targetIndex].targetType === targetType && targets[targetIndex].targetId === targetId) {
      return true;
    }

    targetIndex = targetIndex + 1;
  }

  return false;
}

function addTextList(values, source) {
  var index = 0;
  var safeSource = Array.isArray(source) ? source : [];

  while (index < safeSource.length) {
    addUniqueText(values, safeSource[index]);
    index = index + 1;
  }
}

function addRecordTextList(values, source, targetType) {
  var index = 0;
  var safeSource = Array.isArray(source) ? source : [];

  while (index < safeSource.length) {
    addUniqueText(values, readRecordId(safeSource[index], targetType));
    index = index + 1;
  }
}

function readRecordId(value, targetType) {
  if (!value || typeof value !== "object") {
    return readTextValue(value);
  }

  if (targetType === "class") {
    return readTextValue(value.id || value.classId || value.refId || value.uid);
  }

  return readTextValue(value.id || value.locationId || value.schoolId || value.refId || value.uid);
}

function readTextField(source, fieldName) {
  return source && typeof source[fieldName] === "string" ? source[fieldName] : "";
}

function readArrayField(source, fieldName) {
  return source && Array.isArray(source[fieldName]) ? source[fieldName] : [];
}

function addUniqueText(values, value) {
  var text = readTextValue(value);

  if (text && values.indexOf(text) === -1) {
    values.push(text);
  }
}

function addReasonCount(reasons, reason) {
  reasons[reason] = (reasons[reason] || 0) + 1;
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}

function readTextValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function readLocalizedText(value) {
  if (!value || typeof value !== "object") {
    return "";
  }

  return readTextValue(value.en || value.english || value.default || value.value);
}

function logAssignmentLoadWarning(code, details) {
  if (!isStudentAssignmentDebugEnabled() || typeof console === "undefined" || !console.warn) {
    return;
  }

  console.warn("[student-assignment-load:warning]", Object.assign({ code: code }, details || {}));
}

function isStudentAssignmentDebugEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  var hostname = window.location.hostname;
  var search = window.location.search || "";

  return hostname === "localhost"
    || hostname === "127.0.0.1"
    || hostname === ""
    || search.indexOf("debugStudentCourses=1") !== -1
    || search.indexOf("debug=student-courses") !== -1;
}
