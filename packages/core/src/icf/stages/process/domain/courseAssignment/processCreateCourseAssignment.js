import { serverTimestamp } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.79-user-command-center";
import { createCourseAssignment } from "../../../../../../../domain/assignments/index.js";
import { createCourseAssignmentId, loadCourseAssignments } from "./courseAssignmentHelpers.js?v=1.1.79-user-command-center";
import { buildCourseAssignmentOwnershipFields } from "./courseAssignmentOwnershipHelpers.js?v=1.1.79-user-command-center";

export async function processCreateCourseAssignment(executionState) {
  var payload = executionState.payload;
  var actor = executionState.actor;

  try {
    var duplicateAssignments = await readDuplicateAssignments(payload, executionState);

    if (duplicateAssignments.length > 0) {
      executionState.warnings.push({
        code: "COURSE_ASSIGNMENT_ALREADY_EXISTS",
        message: "A matching assignment already exists. The existing assignment was returned."
      });
      executionState.result = duplicateAssignments[0];
      return {
        valid: true,
        data: executionState.result
      };
    }

    var assignmentId = createCourseAssignmentId();
    var ownershipFields = await buildCourseAssignmentOwnershipFields(payload);
    var assignmentRecord = cleanAssignmentRecord({
      id: assignmentId,
      assignmentType: payload.assignmentType || "course",
      courseId: payload.courseId,
      moduleId: payload.moduleId || null,
      targetType: payload.targetType,
      targetId: payload.targetId,
      locationId: payload.locationId || "",
      classId: payload.targetType === "class" ? payload.classId || payload.targetId : "",
      studentId: payload.targetType === "student" ? payload.studentId || payload.targetId : null,
      status: payload.status,
      visibility: payload.visibility || "visible",
      assignedBy: actor && actor.id ? actor.id : "",
      assignedAt: serverTimestamp(),
      startsAt: payload.startsAt || null,
      dueAt: payload.dueAt || null,
      responsibleTeacherId: ownershipFields.responsibleTeacherId,
      assistantIds: ownershipFields.assistantIds,
      teacherOwnershipIds: ownershipFields.teacherOwnershipIds,
      responsibleTeacherName: ownershipFields.responsibleTeacherName,
      assistantNames: ownershipFields.assistantNames,
      updatedAt: serverTimestamp()
    });

    executionState.result = await createCourseAssignment(assignmentRecord);
    return {
      valid: true,
      data: executionState.result
    };
  } catch (error) {
    logCourseAssignmentCreateDebug(error, payload);
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_CREATE_FAILED",
          message: "Failed to create course assignment: " + readErrorMessage(error)
        }
      ]
    };
  }
}

async function readDuplicateAssignments(payload, executionState) {
  try {
    return findDuplicateAssignments(await loadCourseAssignments({
      courseId: payload.courseId,
      targetType: payload.targetType,
      targetId: payload.targetId
    }), payload);
  } catch (error) {
    executionState.warnings.push({
      code: "COURSE_ASSIGNMENT_DUPLICATE_CHECK_SKIPPED",
      message: "Duplicate check was skipped before create: " + readErrorMessage(error)
    });
    logCourseAssignmentCreateDebug(error, payload);
    return [];
  }
}

function findDuplicateAssignments(assignments, payload) {
  var duplicateAssignments = [];
  var assignmentIndex = 0;

  while (assignmentIndex < assignments.length) {
    var assignment = assignments[assignmentIndex];

    if (assignment.courseId === payload.courseId
        && assignment.targetType === payload.targetType
        && assignment.targetId === payload.targetId
        && assignment.status === payload.status) {
      duplicateAssignments.push(assignment);
    }

    assignmentIndex = assignmentIndex + 1;
  }

  return duplicateAssignments;
}

function cleanAssignmentRecord(record) {
  var cleanRecord = {};
  var keys = Object.keys(record);
  var index = 0;

  while (index < keys.length) {
    if (typeof record[keys[index]] !== "undefined") {
      cleanRecord[keys[index]] = record[keys[index]];
    }
    index = index + 1;
  }

  return cleanRecord;
}

function logCourseAssignmentCreateDebug(error, payload) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.warn("[course-assignment-debug] CreateCourseAssignmentIntent process issue.", {
    collection: "courseAssignments",
    errorCode: error && error.code ? error.code : "",
    errorMessage: readErrorMessage(error),
    courseId: payload && payload.courseId ? payload.courseId : "",
    targetType: payload && payload.targetType ? payload.targetType : "",
    targetIdExists: !!(payload && payload.targetId),
    locationIdExists: !!(payload && payload.locationId),
    classIdExists: !!(payload && payload.classId),
    studentIdExists: !!(payload && payload.studentId)
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
