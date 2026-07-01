import { getActiveAssignmentsForStudent } from "../assignments/index.js?v=1.1.85-visual-helpers-syntax";

export { buildStudentAssignmentTargets } from "../assignments/index.js?v=1.1.85-visual-helpers-syntax";

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
    directAssignments: assignmentResult.directAssignments || [],
    classAssignments: assignmentResult.classAssignments || [],
    mergedAssignments: assignmentResult.mergedAssignments || [],
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

  if (assignmentResult.courseIds.length === 0 && directCourseIds.length > 0) {
    while (directIndex < directCourseIds.length) {
      addUniqueText(assignmentResult.courseIds, directCourseIds[directIndex]);
      directIndex = directIndex + 1;
    }
    assignmentResult.source = assignmentResult.source + "+profileCourseIds";
    assignmentResult.queryPaths.push("users/" + (studentProfile && studentProfile.id ? studentProfile.id : "") + ".assignedCourseIds|courseIds|courses|assignedCourses");
  }

  logStudentAssignmentLoadDebug({
    studentId: readStudentDocumentId(studentId, studentProfile),
    authUid: readStudentAuthUid(studentId, studentProfile),
    classId: readFirstClassId(studentProfile),
    className: readProfileClassName(studentProfile),
    directAssignments: assignmentResult.directAssignments || [],
    classAssignments: assignmentResult.classAssignments || [],
    mergedAssignments: assignmentResult.mergedAssignments || [],
    courseIds: assignmentResult.courseIds
  });

  return assignmentResult;
}

async function getAssignedCourseIdsFromAssignments(studentId, studentProfile) {
  var normalizedProfile = Object.assign({}, studentProfile || {});

  if (!normalizedProfile.id) {
    normalizedProfile.id = studentId;
  }

  if (!normalizedProfile.authUid) {
    normalizedProfile.authUid = studentId;
  }

  if (!normalizedProfile.uid) {
    normalizedProfile.uid = studentId;
  }

  var assignmentResult = await getActiveAssignmentsForStudent(normalizedProfile);

  return {
    courseIds: assignmentResult.courseIds,
    assignmentIdByCourseId: assignmentResult.assignmentIdByCourseId,
    assignmentCount: assignmentResult.assignmentIds.length,
    warnings: assignmentResult.warnings,
    source: "courseAssignments",
    queryPaths: assignmentResult.queryPaths,
    rejectionReasons: assignmentResult.rejectionReasons,
    directAssignments: assignmentResult.directAssignments,
    classAssignments: assignmentResult.classAssignments,
    locationAssignments: assignmentResult.locationAssignments,
    mergedAssignments: assignmentResult.assignments,
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

function logStudentAssignmentLoadDebug(details) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.log("[student-assignment-load]", {
    studentId: details.studentId,
    authUid: details.authUid,
    classId: details.classId,
    className: details.className,
    directAssignments: summarizeAssignmentsForDebug(details.directAssignments),
    classAssignments: summarizeAssignmentsForDebug(details.classAssignments),
    mergedAssignments: summarizeAssignmentsForDebug(details.mergedAssignments),
    courseIds: details.courseIds
  });
}

function summarizeAssignmentsForDebug(assignments) {
  var source = Array.isArray(assignments) ? assignments : [];
  var index = 0;
  var result = [];

  while (index < source.length) {
    result.push({
      id: source[index].id || "",
      assignmentId: source[index].assignmentId || source[index].id || "",
      courseAssignmentId: source[index].courseAssignmentId || source[index].id || "",
      courseId: source[index].courseId || "",
      targetType: source[index].targetType || "",
      targetId: source[index].targetId || "",
      studentId: source[index].studentId || "",
      classId: source[index].classId || "",
      status: source[index].status || "",
      visibility: source[index].visibility || ""
    });
    index = index + 1;
  }

  return result;
}

function isDevelopmentHost() {
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

function readStudentDocumentId(studentId, studentProfile) {
  return readTextValue(studentProfile && (studentProfile.id || studentProfile.studentId || studentProfile.profileUserId)) || readTextValue(studentId);
}

function readStudentAuthUid(studentId, studentProfile) {
  return readTextValue(studentProfile && (studentProfile.authUid || studentProfile.uid)) || readTextValue(studentId);
}

function readFirstClassId(studentProfile) {
  var classIds = [];

  addUniqueText(classIds, studentProfile ? studentProfile.classId : "");
  addCourseIdList(classIds, studentProfile ? studentProfile.classIds : null);
  addCourseIdList(classIds, studentProfile ? studentProfile.assignedClassIds : null);
  addRecordIdList(classIds, studentProfile ? studentProfile.assignedClasses : null, "class");
  addRecordIdList(classIds, studentProfile ? studentProfile.classRefs : null, "class");
  addRecordIdList(classIds, studentProfile ? studentProfile.classes : null, "class");

  return classIds.length > 0 ? classIds[0] : "";
}

function readProfileClassName(studentProfile) {
  return readTextValue(studentProfile && (
    studentProfile.className
      || studentProfile.classTitle
      || studentProfile.classCode
      || studentProfile.code
      || studentProfile.assignedClassName
      || studentProfile.homeroomName
  ));
}

function addRecordIdList(ids, values, targetType) {
  var source = Array.isArray(values) ? values : [];
  var valueIndex = 0;

  while (valueIndex < source.length) {
    addUniqueText(ids, readRecordId(source[valueIndex], targetType));
    valueIndex = valueIndex + 1;
  }
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

function readRecordId(value, targetType) {
  if (!value || typeof value !== "object") {
    return readTextValue(value);
  }

  if (targetType === "class") {
    return readTextValue(value.id || value.classId || value.refId || value.uid);
  }

  return readTextValue(value.id || value.refId || value.uid);
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
