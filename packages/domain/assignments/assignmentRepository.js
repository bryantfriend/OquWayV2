import { collection, db, doc, getDocs, query, serverTimestamp, setDoc, where } from "../../firebase/index.js";
import { isActiveAssignment, normalizeCourseAssignment } from "./index.js";
import {
  readStudentClassIdentifiers as readDomainStudentClassIdentifiers,
  readStudentIdentifiers as readDomainStudentIdentifiers,
  readStudentLocationIds as readDomainStudentLocationIds,
  resolveStudentId
} from "../users/index.js";

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
  var actor = studentProfile && studentProfile.__actor ? studentProfile.__actor : null;
  var studentId = resolveStudentId(studentProfile, actor);
  var targets = buildStudentAssignmentTargets(studentId, studentProfile, actor);
  var result = createStudentAssignmentResult(studentProfile);
  var targetIndex = 0;

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

export function buildStudentAssignmentTargets(studentId, studentProfile, actor) {
  var targets = [];

  addTarget(targets, "student", studentId || "");
  addTargetList(targets, "student", readDomainStudentIdentifiers(studentProfile, actor));
  addTargetList(targets, "class", readDomainStudentClassIdentifiers(studentProfile, actor));
  addTargetList(targets, "location", readDomainStudentLocationIds(studentProfile));

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
  return loadAssignmentsForTargetField(target, "targetId");
}

async function loadAssignmentsForTargetField(target, fieldName) {
  var assignments = fieldName === "targetId"
    ? await loadAssignments(query(
      collection(db, "courseAssignments"),
      where("targetType", "==", target.targetType),
      where("targetId", "==", target.targetId)
    ))
    : await loadAssignments(query(
      collection(db, "courseAssignments"),
      where(fieldName, "==", target.targetId)
    ));

  return assignments.filter(function (assignment) {
    return assignment && assignment.targetType === target.targetType;
  });
}

async function appendTargetAssignments(result, target) {
  var fieldNames = readAssignmentTargetFieldNames(target.targetType);
  var fieldIndex = 0;

  while (fieldIndex < fieldNames.length) {
    await appendTargetFieldAssignments(result, target, fieldNames[fieldIndex]);
    fieldIndex = fieldIndex + 1;
  }
}

async function appendTargetFieldAssignments(result, target, fieldName) {
  var queryPath = "courseAssignments where targetType=" + target.targetType + ", " + fieldName + "=" + target.targetId;

  result.queryPaths.push(queryPath);

  try {
    var assignments = await loadAssignmentsForTargetField(target, fieldName);
    var visibleAssignments = assignments.filter(isVisibleAssignment);

    appendAssignments(result, visibleAssignments, target);

    if (assignments.length === 0) {
      addReasonCount(result.rejectionReasons, "no-assignment-for-target");
    }
  } catch (error) {
    addReasonCount(result.rejectionReasons, "assignment-query-failed");
    result.queryErrors.push(queryPath + " failed: " + readErrorMessage(error));
    result.warnings.push({
      code: "STUDENT_ASSIGNMENT_QUERY_FAILED",
      message: queryPath + " failed: " + readErrorMessage(error)
    });
  }
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
    queryErrors: [],
    rejectionReasons: {},
    source: "courseAssignments",
    studentIdentifiers: readDomainStudentIdentifiers(studentProfile, studentProfile && studentProfile.__actor ? studentProfile.__actor : null)
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
  return readDomainStudentClassIdentifiers(studentProfile, studentProfile && studentProfile.__actor ? studentProfile.__actor : null);
}

function readStudentLocationIds(studentProfile) {
  return readDomainStudentLocationIds(studentProfile);
}

function readAssignmentTargetFieldNames(targetType) {
  if (targetType === "student") {
    return ["targetId", "studentId"];
  }

  if (targetType === "class") {
    return ["targetId", "classId"];
  }

  if (targetType === "location") {
    return ["targetId", "locationId"];
  }

  return ["targetId"];
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
