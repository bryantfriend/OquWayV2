import { db, collection, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js";
import { normalizePracticeModes } from "../moduleEditor/practiceModeShells.js";
import { loadCourseAssignments } from "../courseAssignment/courseAssignmentHelpers.js";
import { createDefaultProgressDocument } from "./studentProgressHelpers.js";

export async function processLoadStudentCourse(executionState) {
  var actor = executionState.actor;
  var studentProfile = executionState.context.studentProfile;

  try {
    if (!studentProfile && !isPreviewActor(actor)) {
      return {
        valid: false,
        errors: [
          {
            code: "STUDENT_PROFILE_MISSING",
            message: "Student profile is required before assigned courses can be loaded."
          }
        ]
      };
    }

    if (!isPreviewActor(actor)) {
      var profileValidation = validateStudentProfileForDashboard(studentProfile);
      if (!profileValidation.valid) {
        return profileValidation;
      }
    }

    var courseAssignmentResult = await loadAssignedCourseIdsFromAssignments(actor, studentProfile);
    appendWarnings(executionState, courseAssignmentResult.warnings);

    var courses = await loadStudentCourses(actor, courseAssignmentResult.courseIds, executionState);

    executionState.result = {
      student: studentProfile,
      courses: courses,
      assignmentCount: courseAssignmentResult.assignmentCount,
      assignmentSource: courseAssignmentResult.source
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_COURSES_LOAD_FAILED",
          message: "Failed to load student courses: " + error.message
        }
      ]
    };
  }
}

async function loadStudentCourses(actor, assignedCourseIds, executionState) {
  var courseSnaps = [];
  var courses = [];
  var courseIndex = 0;

  if (assignedCourseIds.length > 0) {
    courseSnaps = await loadAssignedCourseSnaps(assignedCourseIds, executionState);
  } else if (isPreviewActor(actor)) {
    executionState.warnings.push({
      code: "STUDENT_DASHBOARD_DEV_FALLBACK",
      message: "No assignments found for preview student. Showing visible courses as a development fallback."
    });
    courseSnaps = await loadAllCourseSnaps();
  } else {
    courseSnaps = [];
  }

  while (courseIndex < courseSnaps.length) {
    courses.push(await buildCourseTree(actor, courseSnaps[courseIndex]));
    courseIndex = courseIndex + 1;
  }

  courses.sort(compareByOrderThenTitle);
  return courses;
}

async function loadAssignedCourseSnaps(courseIds, executionState) {
  var courseSnaps = [];
  var courseIndex = 0;

  while (courseIndex < courseIds.length) {
    var courseSnap = await getDoc(doc(db, "courses", courseIds[courseIndex]));
    if (courseSnap.exists()) {
      courseSnaps.push(courseSnap);
    } else {
      executionState.warnings.push({
        code: "ASSIGNED_COURSE_NOT_FOUND",
        message: "Assigned course was skipped because it no longer exists: " + courseIds[courseIndex]
      });
    }

    courseIndex = courseIndex + 1;
  }

  return courseSnaps;
}

async function loadAssignedCourseIdsFromAssignments(actor, studentProfile) {
  var targets = buildStudentAssignmentTargets(actor, studentProfile);
  var courseIds = [];
  var assignmentIds = [];
  var warnings = [];
  var targetIndex = 0;

  while (targetIndex < targets.length) {
    var target = targets[targetIndex];
    var assignments = await loadCourseAssignments({
      targetType: target.targetType,
      targetId: target.targetId,
      status: "active"
    });

    addAssignmentCourses(courseIds, assignmentIds, assignments);
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
    assignmentCount: assignmentIds.length,
    warnings: warnings,
    source: "courseAssignments"
  };
}

function buildStudentAssignmentTargets(actor, studentProfile) {
  var targets = [];

  if (actor && actor.id) {
    addTarget(targets, "student", actor.id);
  }

  if (studentProfile && studentProfile.id) {
    addTarget(targets, "student", studentProfile.id);
  }

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

function addAssignmentCourses(courseIds, assignmentIds, assignments) {
  var assignmentIndex = 0;

  while (assignmentIndex < assignments.length) {
    var assignment = assignments[assignmentIndex];

    if (assignment && assignment.id) {
      addUniqueText(assignmentIds, assignment.id);
    }

    if (assignment && assignment.courseId) {
      addUniqueText(courseIds, assignment.courseId);
    }

    assignmentIndex = assignmentIndex + 1;
  }
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
  var valueIndex = 0;

  while (valueIndex < values.length) {
    addTarget(targets, targetType, values[valueIndex]);
    valueIndex = valueIndex + 1;
  }
}

function addRecordTargetList(targets, targetType, values) {
  var valueIndex = 0;
  var source = values;

  if (!Array.isArray(source)) {
    source = [];
  }

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

function addUniqueText(values, value) {
  if (typeof value !== "string" || value.length === 0) {
    return;
  }

  if (values.indexOf(value) === -1) {
    values.push(value);
  }
}

function readTextField(source, fieldName) {
  if (!source || typeof source[fieldName] !== "string") {
    return "";
  }

  return source[fieldName];
}

function readArrayField(source, fieldName) {
  if (!source || !Array.isArray(source[fieldName])) {
    return [];
  }

  return source[fieldName];
}

function appendWarnings(executionState, warnings) {
  var warningIndex = 0;

  while (warningIndex < warnings.length) {
    executionState.warnings.push(warnings[warningIndex]);
    warningIndex = warningIndex + 1;
  }
}

function isPreviewActor(actor) {
  return actor && actor.id === "preview-student";
}

function validateStudentProfileForDashboard(studentProfile) {
  if (!studentProfile) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_PROFILE_MISSING",
          message: "Student profile is required."
        }
      ]
    };
  }

  if (!hasStudentRole(studentProfile)) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_ROLE_REQUIRED",
          message: "Only student accounts can open the student dashboard."
        }
      ]
    };
  }

  if (!isActiveStudentProfile(studentProfile)) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_ACCOUNT_INACTIVE",
          message: "This student account is not active."
        }
      ]
    };
  }

  if (!hasStudentClass(studentProfile)) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_CLASS_REQUIRED",
          message: "This student profile is missing a class."
        }
      ]
    };
  }

  if (!hasStudentLocation(studentProfile)) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_LOCATION_REQUIRED",
          message: "This student profile is missing a location."
        }
      ]
    };
  }

  return { valid: true };
}

function isActiveStudentStatus(status) {
  if (!status) {
    return true;
  }

  return status === "active" || status === "approved";
}

function isActiveStudentProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return false;
  }

  if (profile.isActive === true) {
    return true;
  }

  return isActiveStudentStatus(readTextField(profile, "status"));
}

function hasStudentRole(profile) {
  return readRoles(profile).indexOf("student") !== -1;
}

function readRoles(profile) {
  var source = [];
  var roles = [];
  var index = 0;

  if (profile && Array.isArray(profile.roles)) {
    source = source.concat(profile.roles);
  }

  if (profile && profile.role) {
    source.push(profile.role);
  }

  while (index < source.length) {
    var role = normalizeRole(source[index]);

    if (role && roles.indexOf(role) === -1) {
      roles.push(role);
    }

    index = index + 1;
  }

  return roles;
}

function normalizeRole(role) {
  var normalizedRole = readTextValue(role).replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (normalizedRole === "student" || normalizedRole === "rolestudent") {
    return "student";
  }

  return normalizedRole;
}

function hasStudentClass(profile) {
  return Boolean(
    readTextField(profile, "classId")
      || readArrayField(profile, "classIds").length > 0
      || readArrayField(profile, "assignedClassIds").length > 0
      || readRecordList(profile ? profile.assignedClasses : null, "class").length > 0
      || readRecordList(profile ? profile.classRefs : null, "class").length > 0
      || readRecordList(profile ? profile.classes : null, "class").length > 0
  );
}

function hasStudentLocation(profile) {
  return Boolean(
    readTextField(profile, "locationId")
      || readTextField(profile, "primaryLocationId")
      || readTextField(profile, "schoolId")
      || readTextField(profile, "locId")
      || readArrayField(profile, "locationIds").length > 0
      || readArrayField(profile, "schoolIds").length > 0
  );
}

function readRecordList(values, targetType) {
  var result = [];
  var valueIndex = 0;
  var source = values;

  if (!Array.isArray(source)) {
    return result;
  }

  while (valueIndex < source.length) {
    addUniqueText(result, readRecordId(source[valueIndex], targetType));
    valueIndex = valueIndex + 1;
  }

  return result;
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

function readTextValue(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}

async function loadAllCourseSnaps() {
  var snap = await getDocs(collection(db, "courses"));
  var courseSnaps = [];

  snap.forEach(function (courseSnap) {
    if (isStudentVisibleCourse(courseSnap.data())) {
      courseSnaps.push(courseSnap);
    }
  });

  return courseSnaps;
}

function isStudentVisibleCourse(courseData) {
  if (!courseData || typeof courseData.status !== "string") {
    return true;
  }

  return courseData.status === "active"
    || courseData.status === "draft"
    || courseData.status === "published"
    || courseData.status === "ready";
}

async function buildCourseTree(actor, courseSnap) {
  var course = Object.assign({ id: courseSnap.id }, courseSnap.data());
  course.modules = await loadModules(actor, course.id);
  return course;
}

async function loadModules(actor, courseId) {
  var modulesSnap = await getDocs(collection(db, "courses", courseId, "modules"));
  var modules = [];

  modulesSnap.forEach(function (moduleSnap) {
    modules.push(Object.assign({ id: moduleSnap.id }, moduleSnap.data()));
  });

  modules.sort(compareByOrderThenTitle);

  var moduleIndex = 0;
  while (moduleIndex < modules.length) {
    modules[moduleIndex].sessions = await loadSessions(actor, courseId, modules[moduleIndex].id);
    moduleIndex = moduleIndex + 1;
  }

  return modules;
}

async function loadSessions(actor, courseId, moduleId) {
  var sessionsSnap = await getDocs(collection(db, "courses", courseId, "modules", moduleId, "sessions"));
  var sessions = [];

  sessionsSnap.forEach(function (sessionSnap) {
    var session = Object.assign({ id: sessionSnap.id }, sessionSnap.data());
    session.practiceModes = normalizePracticeModes(session.practiceModes);
    sessions.push(session);
  });

  sessions.sort(compareSessionOrder);

  var sessionIndex = 0;
  while (sessionIndex < sessions.length) {
    sessions[sessionIndex].progress = await loadProgress(actor, courseId, moduleId, sessions[sessionIndex].id);
    sessionIndex = sessionIndex + 1;
  }

  return sessions;
}

async function loadProgress(actor, courseId, moduleId, sessionId) {
  if (!actor || !actor.id) {
    return createDefaultProgressDocument(courseId, moduleId, sessionId);
  }

  try {
    var progressRef = doc(db, "studentProgress", actor.id, "courses", courseId, "sessions", sessionId);
    var progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      return createDefaultProgressDocument(courseId, moduleId, sessionId);
    }

    return Object.assign(createDefaultProgressDocument(courseId, moduleId, sessionId), progressSnap.data());
  } catch (error) {
    return createDefaultProgressDocument(courseId, moduleId, sessionId);
  }
}

function compareByOrderThenTitle(a, b) {
  var orderDifference = readOrder(a) - readOrder(b);

  if (orderDifference !== 0) {
    return orderDifference;
  }

  return readEnglishTitle(a).localeCompare(readEnglishTitle(b));
}

function compareSessionOrder(a, b) {
  var aOrder = readSessionOrder(a);
  var bOrder = readSessionOrder(b);

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return readEnglishTitle(a).localeCompare(readEnglishTitle(b));
}

function readOrder(value) {
  if (!value || typeof value.order !== "number") {
    return 9999;
  }

  return value.order;
}

function readSessionOrder(value) {
  if (value && typeof value.order === "number") {
    return value.order;
  }

  if (value && typeof value.sessionNumber === "number") {
    return value.sessionNumber;
  }

  return 9999;
}

function readEnglishTitle(value) {
  if (!value || !value.title) {
    return "";
  }

  if (typeof value.title === "string") {
    return value.title;
  }

  if (typeof value.title.en === "string") {
    return value.title.en;
  }

  return "";
}
