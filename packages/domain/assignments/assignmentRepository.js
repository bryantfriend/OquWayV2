import { collection, db, doc, getDocs, query, serverTimestamp, setDoc, where } from "../../firebase/index.js";
import { getClassById } from "../classes/index.js";
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
  var identifiers = await buildStudentAssignmentIdentifiers(studentId, studentProfile);
  var queries = buildStudentAssignmentQueries(identifiers);
  var result = createStudentAssignmentResult(studentProfile);
  var queryIndex = 0;

  result.studentIdentifiers = identifiers.studentIdentifiers;
  result.classIdentifiers = identifiers.classIdentifiers;
  result.locationIdentifiers = identifiers.locationIdentifiers;
  result.warnings = result.warnings.concat(identifiers.warnings);

  logAssignmentIdentifiers(identifiers);

  while (queryIndex < queries.length) {
    await appendAssignmentQuery(result, queries[queryIndex], identifiers);
    queryIndex = queryIndex + 1;
  }

  if (queries.length === 0) {
    result.warnings.push({
      code: "STUDENT_ASSIGNMENT_TARGETS_MISSING",
      message: "Student profile has no student, class, or location assignment targets."
    });
  }

  logMatchedAssignments(result.assignments);

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

  addTargetList(targets, "student", buildStudentIdentifiers(studentId, studentProfile));
  addTargetList(targets, "class", buildClassIdentifiers(studentProfile));
  addTarget(targets, "location", readTextField(studentProfile, "locationId"));
  addTarget(targets, "location", readTextField(studentProfile, "primaryLocationId"));
  addTarget(targets, "location", readTextField(studentProfile, "schoolId"));
  addTarget(targets, "location", readTextField(studentProfile, "locId"));
  addTargetList(targets, "location", readArrayField(studentProfile, "locationIds"));
  addTargetList(targets, "location", readArrayField(studentProfile, "schoolIds"));

  return targets;
}

async function buildStudentAssignmentIdentifiers(studentId, studentProfile) {
  var identifiers = {
    studentIdentifiers: buildStudentIdentifiers(studentId, studentProfile),
    classIdentifiers: buildClassIdentifiers(studentProfile),
    locationIdentifiers: buildLocationIdentifiers(studentProfile),
    warnings: []
  };

  await appendClassDocumentIdentifiers(identifiers, studentProfile);

  return identifiers;
}

function buildStudentIdentifiers(studentId, studentProfile) {
  var ids = [];

  addUniqueText(ids, studentId);
  addUniqueText(ids, readTextField(studentProfile, "id"));
  addUniqueText(ids, readTextField(studentProfile, "authUid"));
  addUniqueText(ids, readTextField(studentProfile, "uid"));
  addUniqueText(ids, readTextField(studentProfile, "userId"));
  addUniqueText(ids, readTextField(studentProfile, "studentId"));
  addUniqueText(ids, readTextField(studentProfile, "profileUserId"));

  if (studentProfile && studentProfile.linkedProfile) {
    addUniqueText(ids, readTextField(studentProfile.linkedProfile, "id"));
    addUniqueText(ids, readTextField(studentProfile.linkedProfile, "authUid"));
    addUniqueText(ids, readTextField(studentProfile.linkedProfile, "uid"));
    addUniqueText(ids, readTextField(studentProfile.linkedProfile, "userId"));
    addUniqueText(ids, readTextField(studentProfile.linkedProfile, "studentId"));
    addUniqueText(ids, readTextField(studentProfile.linkedProfile, "profileUserId"));
  }

  return ids;
}

function buildClassIdentifiers(studentProfile) {
  var ids = [];

  addUniqueText(ids, readTextField(studentProfile, "classId"));
  addUniqueText(ids, readTextField(studentProfile, "primaryClassId"));
  addUniqueText(ids, readTextField(studentProfile, "className"));
  addUniqueText(ids, readTextField(studentProfile, "classCode"));
  addUniqueText(ids, readTextField(studentProfile, "code"));
  addTextList(ids, readArrayField(studentProfile, "classIds"));
  addTextList(ids, readArrayField(studentProfile, "assignedClassIds"));
  addRecordClassIdentifierList(ids, studentProfile ? studentProfile.assignedClasses : null);
  addRecordClassIdentifierList(ids, studentProfile ? studentProfile.classRefs : null);
  addRecordClassIdentifierList(ids, studentProfile ? studentProfile.classes : null);

  return ids;
}

function buildLocationIdentifiers(studentProfile) {
  var ids = [];

  addUniqueText(ids, readTextField(studentProfile, "locationId"));
  addUniqueText(ids, readTextField(studentProfile, "primaryLocationId"));
  addUniqueText(ids, readTextField(studentProfile, "schoolId"));
  addUniqueText(ids, readTextField(studentProfile, "locId"));
  addTextList(ids, readArrayField(studentProfile, "locationIds"));
  addTextList(ids, readArrayField(studentProfile, "schoolIds"));

  return ids;
}

async function appendClassDocumentIdentifiers(identifiers, studentProfile) {
  if (studentProfile && studentProfile.linkedProfile) {
    addTextList(identifiers.classIdentifiers, buildClassIdentifiers(studentProfile.linkedProfile));
  }

  var originalClassIds = identifiers.classIdentifiers.slice();
  var classIndex = 0;

  while (classIndex < originalClassIds.length) {
    await appendClassDocumentIdentifier(identifiers, originalClassIds[classIndex]);
    classIndex = classIndex + 1;
  }
}

async function appendClassDocumentIdentifier(identifiers, classId) {
  if (!classId) {
    return;
  }

  try {
    var classRecord = await getClassById(classId);

    if (!classRecord) {
      return;
    }

    addClassRecordIdentifiers(identifiers.classIdentifiers, classRecord);
  } catch (error) {
    identifiers.warnings.push({
      code: "STUDENT_CLASS_ALIAS_READ_FAILED",
      message: "Class aliases could not be read for " + classId + ": " + readErrorMessage(error)
    });
  }
}

function buildStudentAssignmentQueries(identifiers) {
  var queries = [];
  var studentIndex = 0;
  var classIndex = 0;
  var locationIndex = 0;

  while (studentIndex < identifiers.studentIdentifiers.length) {
    addAssignmentQuery(queries, "student-targetId", "student", [
      where("targetType", "==", "student"),
      where("targetId", "==", identifiers.studentIdentifiers[studentIndex])
    ], identifiers.studentIdentifiers[studentIndex]);
    addAssignmentQuery(queries, "student-studentId", "student", [
      where("studentId", "==", identifiers.studentIdentifiers[studentIndex])
    ], identifiers.studentIdentifiers[studentIndex]);
    studentIndex = studentIndex + 1;
  }

  while (classIndex < identifiers.classIdentifiers.length) {
    addAssignmentQuery(queries, "class-targetId", "class", [
      where("targetType", "==", "class"),
      where("targetId", "==", identifiers.classIdentifiers[classIndex])
    ], identifiers.classIdentifiers[classIndex]);
    addAssignmentQuery(queries, "class-classId", "class", [
      where("classId", "==", identifiers.classIdentifiers[classIndex])
    ], identifiers.classIdentifiers[classIndex]);
    classIndex = classIndex + 1;
  }

  while (locationIndex < identifiers.locationIdentifiers.length) {
    addAssignmentQuery(queries, "location-targetId", "location", [
      where("targetType", "==", "location"),
      where("targetId", "==", identifiers.locationIdentifiers[locationIndex])
    ], identifiers.locationIdentifiers[locationIndex]);
    addAssignmentQuery(queries, "location-locationId", "location", [
      where("locationId", "==", identifiers.locationIdentifiers[locationIndex])
    ], identifiers.locationIdentifiers[locationIndex]);
    locationIndex = locationIndex + 1;
  }

  return queries;
}

function addAssignmentQuery(queries, queryType, targetType, constraints, identifier) {
  var key = queryType + ":" + identifier;

  if (!identifier || hasAssignmentQuery(queries, key)) {
    return;
  }

  queries.push({
    key: key,
    queryType: queryType,
    targetType: targetType,
    identifier: identifier,
    query: query(collection(db, "courseAssignments"), ...constraints)
  });
}

function hasAssignmentQuery(queries, key) {
  var queryIndex = 0;

  while (queryIndex < queries.length) {
    if (queries[queryIndex].key === key) {
      return true;
    }

    queryIndex = queryIndex + 1;
  }

  return false;
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
  var queryPath = "courseAssignments where targetType=" + target.targetType + ", targetId=" + target.targetId;

  result.queryPaths.push(queryPath);

  try {
    var assignments = await loadAssignmentsForTarget(target);
    var visibleAssignments = assignments.filter(isVisibleAssignment);

    appendAssignments(result, visibleAssignments, target);

    if (assignments.length === 0) {
      addReasonCount(result.rejectionReasons, "no-assignment-for-target");
    }
  } catch (error) {
    addReasonCount(result.rejectionReasons, "assignment-query-failed");
    result.warnings.push({
      code: "STUDENT_ASSIGNMENT_QUERY_FAILED",
      message: queryPath + " failed: " + readErrorMessage(error)
    });
  }
}

async function appendAssignmentQuery(result, assignmentQuery, identifiers) {
  var queryPath = readAssignmentQueryPath(assignmentQuery);

  result.queryPaths.push(queryPath);

  try {
    var assignments = await loadAssignments(assignmentQuery.query);
    var visibleAssignments = assignments.filter(isVisibleAssignment).filter(function (assignment) {
      return matchesStudentAssignmentScope(assignment, assignmentQuery.targetType, identifiers);
    });

    appendAssignments(result, visibleAssignments, {
      targetType: assignmentQuery.targetType,
      targetId: assignmentQuery.identifier
    });

    if (assignments.length === 0) {
      addReasonCount(result.rejectionReasons, "no-assignment-for-target");
    }
  } catch (error) {
    addReasonCount(result.rejectionReasons, "assignment-query-failed");
    result.warnings.push({
      code: "STUDENT_ASSIGNMENT_QUERY_FAILED",
      message: queryPath + " failed: " + readErrorMessage(error)
    });
  }
}

function readAssignmentQueryPath(assignmentQuery) {
  if (assignmentQuery.queryType === "student-targetId") {
    return "courseAssignments where targetType=student, targetId=" + assignmentQuery.identifier;
  }

  if (assignmentQuery.queryType === "student-studentId") {
    return "courseAssignments where studentId=" + assignmentQuery.identifier;
  }

  if (assignmentQuery.queryType === "class-targetId") {
    return "courseAssignments where targetType=class, targetId=" + assignmentQuery.identifier;
  }

  if (assignmentQuery.queryType === "class-classId") {
    return "courseAssignments where classId=" + assignmentQuery.identifier;
  }

  if (assignmentQuery.queryType === "location-targetId") {
    return "courseAssignments where targetType=location, targetId=" + assignmentQuery.identifier;
  }

  if (assignmentQuery.queryType === "location-locationId") {
    return "courseAssignments where locationId=" + assignmentQuery.identifier;
  }

  return "courseAssignments assignment query";
}

function matchesStudentAssignmentScope(assignment, targetType, identifiers) {
  if (targetType === "student") {
    return matchesDirectStudentAssignment(assignment, identifiers.studentIdentifiers);
  }

  if (targetType === "class") {
    return matchesClassAssignment(assignment, identifiers.classIdentifiers);
  }

  if (targetType === "location") {
    return matchesLocationAssignment(assignment, identifiers.locationIdentifiers);
  }

  return false;
}

function matchesDirectStudentAssignment(assignment, studentIdentifiers) {
  return assignment
    && ((assignment.targetType === "student" && idListContains(studentIdentifiers, assignment.targetId))
      || idListContains(studentIdentifiers, assignment.studentId));
}

function matchesClassAssignment(assignment, classIdentifiers) {
  return assignment
    && ((assignment.targetType === "class" && idListContains(classIdentifiers, assignment.targetId))
      || idListContains(classIdentifiers, assignment.classId));
}

function matchesLocationAssignment(assignment, locationIdentifiers) {
  return assignment
    && ((assignment.targetType === "location" && idListContains(locationIdentifiers, assignment.targetId))
      || idListContains(locationIdentifiers, assignment.locationId));
}

function idListContains(values, value) {
  var text = readTextValue(value);

  return Boolean(text && values.indexOf(text) !== -1);
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
    studentIdentifiers: [],
    classIdentifiers: [],
    locationIdentifiers: [],
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
  addUniqueText(ids, readTextField(studentProfile, "primaryClassId"));
  addTextList(ids, readArrayField(studentProfile, "classIds"));
  addTextList(ids, readArrayField(studentProfile, "assignedClassIds"));
  addRecordClassIdentifierList(ids, studentProfile ? studentProfile.assignedClasses : null);
  addRecordClassIdentifierList(ids, studentProfile ? studentProfile.classRefs : null);
  addRecordClassIdentifierList(ids, studentProfile ? studentProfile.classes : null);

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

function addRecordClassIdentifierList(ids, values) {
  var index = 0;
  var safeValues = Array.isArray(values) ? values : [];

  while (index < safeValues.length) {
    addClassRecordIdentifiers(ids, safeValues[index]);
    index = index + 1;
  }
}

function addClassRecordIdentifiers(ids, classRecord) {
  if (!classRecord || typeof classRecord !== "object") {
    addUniqueText(ids, classRecord);
    return;
  }

  addUniqueText(ids, classRecord.id);
  addUniqueText(ids, classRecord.classId);
  addUniqueText(ids, classRecord.primaryClassId);
  addUniqueText(ids, classRecord.refId);
  addUniqueText(ids, classRecord.uid);
  addUniqueText(ids, classRecord.className);
  addUniqueText(ids, classRecord.name);
  addUniqueText(ids, classRecord.displayName);
  addUniqueText(ids, classRecord.title);
  addUniqueText(ids, classRecord.code);
  addUniqueText(ids, classRecord.classCode);
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

function logAssignmentIdentifiers(identifiers) {
  if (!isStudentCourseDebugEnabled()) {
    return;
  }

  console.log("[student-course-debug] assignment identifiers", {
    studentIdentifiers: identifiers.studentIdentifiers,
    classIdentifiers: identifiers.classIdentifiers,
    locationIdentifiers: identifiers.locationIdentifiers
  });
}

function logMatchedAssignments(assignments) {
  if (!isStudentCourseDebugEnabled()) {
    return;
  }

  console.log("[student-course-debug] matched assignments");
  console.table(assignments.map(function (assignment) {
    return {
      id: assignment.id,
      courseId: assignment.courseId,
      targetType: assignment.targetType,
      targetId: assignment.targetId,
      classId: assignment.classId,
      studentId: assignment.studentId,
      status: assignment.status,
      visibility: assignment.visibility
    };
  }));
}

function isStudentCourseDebugEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.search.indexOf("debug=true") !== -1
    || window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
    || window.location.hostname === "";
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
