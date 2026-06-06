import { getActiveAssignmentsForStudent } from "../assignments/index.js?v=1.1.101-student-profile-fallback";

export { buildStudentAssignmentTargets } from "../assignments/index.js?v=1.1.101-student-profile-fallback";

export async function getAssignedCourses(studentId, studentProfile) {
  var assignmentResult = await getAssignedCourseIds(studentId, studentProfile);

  return {
    courseIds: assignmentResult.courseIds,
    assignmentIdByCourseId: assignmentResult.assignmentIdByCourseId,
    assignmentCount: assignmentResult.assignmentCount,
    source: assignmentResult.source,
    warnings: assignmentResult.warnings,
    queryPaths: assignmentResult.queryPaths,
    rejectionReasons: assignmentResult.rejectionReasons,
    assignments: assignmentResult.assignments || [],
    directCount: assignmentResult.directCount || 0,
    classCount: assignmentResult.classCount || 0,
    locationCount: assignmentResult.locationCount || 0,
    mergedCount: assignmentResult.mergedCount || assignmentResult.assignmentCount || 0
  };
}

export async function getAssignedCourseIds(studentId, studentProfile, contextCourseIds) {
  var assignmentResult = await getAssignedCourseIdsFromAssignments(studentId, studentProfile);
  var directCourseIds = readDirectCourseIds(studentProfile, contextCourseIds);
  var directIndex = 0;

  while (directIndex < directCourseIds.length) {
    addUniqueText(assignmentResult.courseIds, directCourseIds[directIndex]);
    directIndex = directIndex + 1;
  }

  if (directCourseIds.length > 0) {
    assignmentResult.source = assignmentResult.source + "+profileCourseIds";
    assignmentResult.queryPaths.push("users/" + (studentProfile && studentProfile.id ? studentProfile.id : "") + ".assignedCourseIds|courseIds|courses|assignedCourses");
  }

  return assignmentResult;
}

async function getAssignedCourseIdsFromAssignments(studentId, studentProfile) {
  var assignmentResult = await getActiveAssignmentsForStudent(Object.assign({}, studentProfile || {}, {
    id: studentProfile && studentProfile.id ? studentProfile.id : studentId
  }));

  return {
    courseIds: assignmentResult.courseIds,
    assignmentIdByCourseId: assignmentResult.assignmentIdByCourseId,
    assignmentCount: assignmentResult.assignmentIds.length,
    warnings: assignmentResult.warnings,
    source: "courseAssignments",
    queryPaths: assignmentResult.queryPaths,
    rejectionReasons: assignmentResult.rejectionReasons,
    assignments: assignmentResult.assignments || [],
    directCount: assignmentResult.directAssignments.length,
    classCount: assignmentResult.classAssignments.length,
    locationCount: assignmentResult.locationAssignments.length,
    mergedCount: assignmentResult.assignments.length
  };
}

function readDirectCourseIds(studentProfile, contextCourseIds) {
  var courseIds = [];

  addCourseIdList(courseIds, contextCourseIds);
  addCourseIdList(courseIds, studentProfile ? studentProfile.assignedCourseIds : null);
  addCourseIdList(courseIds, studentProfile ? studentProfile.courseIds : null);
  addCourseIdList(courseIds, studentProfile ? studentProfile.courses : null);
  addCourseIdList(courseIds, studentProfile ? studentProfile.assignedCourses : null);

  return courseIds;
}

function addCourseIdList(courseIds, values) {
  var source = Array.isArray(values) ? values : [];
  var valueIndex = 0;

  while (valueIndex < source.length) {
    addUniqueText(courseIds, readCourseId(source[valueIndex]));
    valueIndex = valueIndex + 1;
  }
}

function readCourseId(value) {
  if (!value || typeof value !== "object") {
    return readTextValue(value);
  }

  return readTextValue(value.id || value.courseId || value.refId || value.uid);
}

function addUniqueText(values, value) {
  var text = readTextValue(value);

  if (text && values.indexOf(text) === -1) {
    values.push(text);
  }
}

function readTextValue(value) {
  return typeof value === "string" ? value : "";
}
