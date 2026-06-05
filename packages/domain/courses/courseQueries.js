import { collection, db, getDocs, query, where } from "../../firebase/index.js";

export async function getAssignedCourses(studentId, studentProfile) {
  var assignmentResult = await getAssignedCourseIds(studentId, studentProfile);

  return {
    courseIds: assignmentResult.courseIds,
    assignmentIdByCourseId: assignmentResult.assignmentIdByCourseId,
    assignmentCount: assignmentResult.assignmentCount,
    source: assignmentResult.source,
    warnings: assignmentResult.warnings,
    queryPaths: assignmentResult.queryPaths,
    rejectionReasons: assignmentResult.rejectionReasons
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

export function buildStudentAssignmentTargets(studentId, studentProfile) {
  var targets = [];

  addTarget(targets, "student", studentId || "");
  addTarget(targets, "student", studentProfile && studentProfile.id ? studentProfile.id : "");
  addTarget(targets, "class", readTextField(studentProfile, "classId"));
  addTargetList(targets, "class", readArrayField(studentProfile, "classIds"));
  addTargetList(targets, "class", readArrayField(studentProfile, "assignedClassIds"));
  addRecordTargetList(targets, "class", studentProfile ? studentProfile.assignedClasses : null);
  addRecordTargetList(targets, "class", studentProfile ? studentProfile.classRefs : null);
  addRecordTargetList(targets, "class", studentProfile ? studentProfile.classes : null);
  addTarget(targets, "location", readTextField(studentProfile, "locationId"));
  addTarget(targets, "location", readTextField(studentProfile, "primaryLocationId"));
  addTarget(targets, "location", readTextField(studentProfile, "schoolId"));
  addTarget(targets, "location", readTextField(studentProfile, "locId"));
  addTargetList(targets, "location", readArrayField(studentProfile, "locationIds"));
  addTargetList(targets, "location", readArrayField(studentProfile, "schoolIds"));

  return targets;
}

async function getAssignedCourseIdsFromAssignments(studentId, studentProfile) {
  var targets = buildStudentAssignmentTargets(studentId, studentProfile);
  var courseIds = [];
  var assignmentIds = [];
  var assignmentIdByCourseId = {};
  var warnings = [];
  var queryPaths = [];
  var rejectionReasons = {};
  var targetIndex = 0;

  while (targetIndex < targets.length) {
    var target = targets[targetIndex];
    var queryPath = "courseAssignments where targetType=" + target.targetType + ", targetId=" + target.targetId + ", status=active";

    queryPaths.push(queryPath);

    try {
      var assignments = await loadCourseAssignmentsForTarget(target);
      addAssignmentCourses(courseIds, assignmentIds, assignmentIdByCourseId, assignments.filter(isVisibleAssignment));

      if (assignments.length === 0) {
        addReasonCount(rejectionReasons, "no-assignment-for-target");
      }
    } catch (error) {
      addReasonCount(rejectionReasons, "assignment-query-failed");
      warnings.push({
        code: "STUDENT_ASSIGNMENT_QUERY_FAILED",
        message: queryPath + " failed: " + readErrorMessage(error)
      });
    }

    targetIndex = targetIndex + 1;
  }

  if (targets.length === 0) {
    warnings.push({
      code: "STUDENT_ASSIGNMENT_TARGETS_MISSING",
      message: "Student profile has no student, class, or location assignment targets."
    });
  }

  return {
    courseIds: courseIds,
    assignmentIdByCourseId: assignmentIdByCourseId,
    assignmentCount: assignmentIds.length,
    warnings: warnings,
    source: "courseAssignments",
    queryPaths: queryPaths,
    rejectionReasons: rejectionReasons
  };
}

async function loadCourseAssignmentsForTarget(target) {
  var snapshot = await getDocs(query(
    collection(db, "courseAssignments"),
    where("targetType", "==", target.targetType),
    where("targetId", "==", target.targetId),
    where("status", "==", "active")
  ));
  var assignments = [];

  snapshot.forEach(function (assignmentSnap) {
    assignments.push(Object.assign({ id: assignmentSnap.id }, assignmentSnap.data() || {}));
  });

  return assignments;
}

function addAssignmentCourses(courseIds, assignmentIds, assignmentIdByCourseId, assignments) {
  var assignmentIndex = 0;

  while (assignmentIndex < assignments.length) {
    var assignment = assignments[assignmentIndex];

    if (assignment && assignment.id) {
      addUniqueText(assignmentIds, assignment.id);
    }

    if (assignment && assignment.courseId) {
      addUniqueText(courseIds, assignment.courseId);
      if (assignment.id && !assignmentIdByCourseId[assignment.courseId]) {
        assignmentIdByCourseId[assignment.courseId] = assignment.id;
      }
    }

    assignmentIndex = assignmentIndex + 1;
  }
}

function isVisibleAssignment(assignment) {
  if (!assignment || assignment.visibility === "hidden") {
    return false;
  }

  if (assignment.assignmentType && assignment.assignmentType !== "course") {
    return false;
  }

  return true;
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

function addTarget(targets, targetType, targetId) {
  if (typeof targetId !== "string" || targetId.length === 0) {
    return;
  }

  if (hasTarget(targets, targetType, targetId)) {
    return;
  }

  targets.push({
    targetType: targetType,
    targetId: targetId
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
  return typeof value === "string" ? value : "";
}
