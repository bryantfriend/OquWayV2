import { db, collection, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.124-location-icon-upload";
import { normalizePracticeModes } from "../moduleEditor/practiceModeShells.js?v=1.1.124-location-icon-upload";
import { getAssignedCourseIds } from "../../../../../../../domain/courses/index.js?v=1.1.124-location-icon-upload";
import { getStudentExternalTaskSubmissions } from "../../../../../../../domain/externalTasks/index.js?v=1.1.124-location-icon-upload";
import { isStudentDashboardProfile, readStudentClassIds, readStudentLocationIds, readStudentProfileRejectReason, resolveActorStudentId } from "../../../../../../../domain/users/index.js?v=1.1.124-location-icon-upload";
import { createDefaultProgressDocument } from "./studentProgressHelpers.js?v=1.1.124-location-icon-upload";

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

    var courseAssignmentResult = await loadAssignedCourseIds(actor, studentProfile, executionState);
    appendWarnings(executionState, courseAssignmentResult.warnings);
    logStudentCourseTrace("studentProfile", studentProfile);
    logStudentCourseTrace("assignments", courseAssignmentResult.assignments || []);

    var courses = await loadStudentCourses(actor, courseAssignmentResult.courseIds, executionState, courseAssignmentResult.assignmentIdByCourseId);
    logStudentCourseTrace("courses", courses);
    logStudentCourseLoad({
      resolvedStudentId: resolveActorStudentId(actor, studentProfile),
      classIdentifiers: courseAssignmentResult.classIdentifiers || [],
      assignmentCount: courseAssignmentResult.assignmentCount || 0,
      loadedCourseCount: courses.length
    });

    logStudentCourseDebug({
      studentId: studentProfile && studentProfile.id ? studentProfile.id : "",
      uid: actor && actor.authUid ? actor.authUid : actor && actor.id ? actor.id : "",
      locationId: readFirstProfileLocationId(studentProfile),
      classId: readFirstProfileClassId(studentProfile),
      classIds: readProfileClassIds(studentProfile),
      queryPaths: courseAssignmentResult.queryPaths,
      directCount: courseAssignmentResult.directCount || 0,
      classCount: courseAssignmentResult.classCount || 0,
      locationCount: courseAssignmentResult.locationCount || 0,
      mergedCount: courseAssignmentResult.mergedCount || courseAssignmentResult.assignmentCount || 0,
      rawCourseCount: courseAssignmentResult.courseIds.length,
      filteredCourseCount: courses.length,
      rejectionReasons: courseAssignmentResult.rejectionReasons
    });

    executionState.result = {
      student: studentProfile,
      courses: courses,
      actorIsPreview: isPreviewActor(actor),
      assignmentCount: courseAssignmentResult.assignmentCount,
      assignmentSource: courseAssignmentResult.source,
      assignmentDebug: buildAssignmentDebug(courseAssignmentResult, courses),
      emptyStateMessage: courses.length === 0 ? "No courses assigned yet." : ""
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

async function loadStudentCourses(actor, assignedCourseIds, executionState, assignmentIdByCourseId) {
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
    courses.push(await loadStudentCourseRecord(actor, courseSnaps[courseIndex], executionState, assignmentIdByCourseId || {}));
    courseIndex = courseIndex + 1;
  }

  courses.sort(compareByOrderThenTitle);
  return courses;
}

async function loadStudentCourseRecord(actor, courseSnap, executionState, assignmentIdByCourseId) {
  var courseShell = attachAssignmentIdToCourse(buildCourseShell(courseSnap), assignmentIdByCourseId);

  try {
    var course = attachAssignmentIdToCourse(
      await withTimeout(buildCourseTree(actor, courseSnap), 15000, "STUDENT_COURSE_TREE_LOAD_TIMEOUT"),
      assignmentIdByCourseId
    );

    return await withTimeout(attachExternalTaskSubmissionsToCourse(actor, course), 10000, "STUDENT_COURSE_SUBMISSIONS_LOAD_TIMEOUT");
  } catch (error) {
    appendStudentCourseLoadWarning(executionState, courseShell.id, error);
    logStudentCourseLoadWarning(courseShell.id, error);
    return Object.assign({}, courseShell, {
      courseTreeLoadWarning: readErrorMessage(error)
    });
  }
}

function buildCourseShell(courseSnap) {
  var source = readCourseCollectionName(courseSnap);
  var course = Object.assign({ id: courseSnap.id }, courseSnap.data() || {}, {
    id: courseSnap.id,
    courseRecordSource: source
  });

  if (!Array.isArray(course.modules)) {
    course.modules = [];
  }

  return course;
}

async function attachExternalTaskSubmissionsToCourse(actor, course) {
  var submissions = [];

  if (!course || !course.id || !actor || !actor.id || isPreviewActor(actor)) {
    return course;
  }

  try {
    submissions = await getStudentExternalTaskSubmissions({
      studentId: resolveActorStudentId(actor),
      courseId: course.id,
      assignmentId: course.assignmentId || course.courseAssignmentId || "",
      courseAssignmentId: course.courseAssignmentId || course.assignmentId || ""
    });

    if (submissions.length === 0 && (course.assignmentId || course.courseAssignmentId)) {
      submissions = await getStudentExternalTaskSubmissions({
        studentId: resolveActorStudentId(actor),
        courseId: course.id
      });
    }
  } catch (error) {
    console.warn("[student-course:external-task-status-failed]", {
      studentId: resolveActorStudentId(actor),
      courseId: course.id,
      errorMessage: readErrorMessage(error)
    });
    return course;
  }

  return Object.assign({}, course, {
    externalTaskSubmissions: submissions,
    modules: attachExternalTaskSubmissionsToModules(course.modules, submissions)
  });
}

function attachExternalTaskSubmissionsToModules(modules, submissions) {
  var safeModules = Array.isArray(modules) ? modules : [];
  var moduleIndex = 0;
  var result = [];

  while (moduleIndex < safeModules.length) {
    result.push(attachExternalTaskSubmissionsToModule(safeModules[moduleIndex], submissions));
    moduleIndex = moduleIndex + 1;
  }

  return result;
}

function attachExternalTaskSubmissionsToModule(module, submissions) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var sessionIndex = 0;
  var updatedSessions = [];

  while (sessionIndex < sessions.length) {
    updatedSessions.push(attachExternalTaskSubmissionsToSession(module, sessions[sessionIndex], submissions));
    sessionIndex = sessionIndex + 1;
  }

  return Object.assign({}, module, {
    sessions: updatedSessions
  });
}

function attachExternalTaskSubmissionsToSession(module, session, submissions) {
  var practiceModes = session && session.practiceModes && typeof session.practiceModes === "object" ? session.practiceModes : {};
  var keys = Object.keys(practiceModes);
  var updatedPracticeModes = Object.assign({}, practiceModes);
  var keyIndex = 0;

  while (keyIndex < keys.length) {
    updatedPracticeModes[keys[keyIndex]] = attachExternalTaskSubmissionsToPracticeMode(
      module,
      practiceModes[keys[keyIndex]],
      submissions
    );
    keyIndex = keyIndex + 1;
  }

  return Object.assign({}, session, {
    practiceModes: updatedPracticeModes
  });
}

function attachExternalTaskSubmissionsToPracticeMode(module, practiceMode, submissions) {
  var steps = practiceMode && Array.isArray(practiceMode.steps) ? practiceMode.steps : [];
  var updatedSteps = [];
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    updatedSteps.push(attachExternalTaskSubmissionToStep(module, steps[stepIndex], submissions));
    stepIndex = stepIndex + 1;
  }

  return Object.assign({}, practiceMode, {
    steps: updatedSteps
  });
}

function attachExternalTaskSubmissionToStep(module, step, submissions) {
  var latestSubmission = null;

  if (!isExternalTaskStep(step)) {
    return step;
  }

  latestSubmission = findLatestExternalTaskSubmission(submissions, module ? module.id : "", step.id || "");

  if (!latestSubmission) {
    return step;
  }

  return Object.assign({}, step, {
    latestExternalTaskSubmission: latestSubmission,
    externalTaskReviewStatus: latestSubmission.reviewStatus || "pending"
  });
}

function findLatestExternalTaskSubmission(submissions, moduleId, stepId) {
  var safeSubmissions = Array.isArray(submissions) ? submissions : [];
  var index = 0;

  while (index < safeSubmissions.length) {
    if ((!moduleId || safeSubmissions[index].moduleId === moduleId) && safeSubmissions[index].stepId === stepId) {
      return safeSubmissions[index];
    }
    index = index + 1;
  }

  return null;
}

function isExternalTaskStep(step) {
  var type = step && typeof step.type === "string" ? step.type : "";
  return type === "externalTask" || type === "ExternalTaskStep";
}

function attachAssignmentIdToCourse(course, assignmentIdByCourseId) {
  if (!course || !course.id) {
    return course;
  }

  return Object.assign({}, course, {
    assignmentId: assignmentIdByCourseId[course.id] || course.assignmentId || "",
    courseAssignmentId: assignmentIdByCourseId[course.id] || course.courseAssignmentId || course.assignmentId || ""
  });
}

function buildAssignmentDebug(courseAssignmentResult, courses) {
  return {
    studentIdentifiers: courseAssignmentResult.studentIdentifiers || [],
    classIdentifiers: courseAssignmentResult.classIdentifiers || [],
    locationIdentifiers: courseAssignmentResult.locationIdentifiers || [],
    queryPaths: courseAssignmentResult.queryPaths || [],
    rejectionReasons: courseAssignmentResult.rejectionReasons || {},
    warnings: courseAssignmentResult.warnings || [],
    assignmentCount: courseAssignmentResult.assignmentCount || 0,
    directCount: courseAssignmentResult.directCount || 0,
    classCount: courseAssignmentResult.classCount || 0,
    locationCount: courseAssignmentResult.locationCount || 0,
    assignments: summarizeAssignments(courseAssignmentResult.assignments || []),
    courses: summarizeCourses(courses || [])
  };
}

function summarizeAssignments(assignments) {
  var result = [];
  var assignmentIndex = 0;

  while (assignmentIndex < assignments.length) {
    result.push({
      id: assignments[assignmentIndex].id || "",
      courseId: assignments[assignmentIndex].courseId || "",
      targetType: assignments[assignmentIndex].targetType || "",
      targetId: assignments[assignmentIndex].targetId || "",
      classId: assignments[assignmentIndex].classId || "",
      studentId: assignments[assignmentIndex].studentId || "",
      status: assignments[assignmentIndex].status || "",
      visibility: assignments[assignmentIndex].visibility || ""
    });
    assignmentIndex = assignmentIndex + 1;
  }

  return result;
}

function summarizeCourses(courses) {
  var result = [];
  var courseIndex = 0;

  while (courseIndex < courses.length) {
    result.push({
      id: courses[courseIndex].id || "",
      title: readLocalizedText(courses[courseIndex].title, "Untitled Course"),
      assignmentId: courses[courseIndex].assignmentId || "",
      courseAssignmentId: courses[courseIndex].courseAssignmentId || ""
    });
    courseIndex = courseIndex + 1;
  }

  return result;
}

async function loadAssignedCourseSnaps(courseIds, executionState) {
  var courseSnaps = [];
  var courseIndex = 0;

  while (courseIndex < courseIds.length) {
    var courseSnap = await loadCourseSnap(courseIds[courseIndex], executionState);
    if (courseSnap) {
      courseSnaps.push(courseSnap);
    }

    courseIndex = courseIndex + 1;
  }

  return courseSnaps;
}

async function loadCourseSnap(courseId, executionState) {
  var sources = ["catalogCourses", "courses"];
  var archivedSources = [];
  var sourceIndex = 0;

  while (sourceIndex < sources.length) {
    try {
      var courseSnap = await getDoc(doc(db, sources[sourceIndex], courseId));

      if (courseSnap.exists()) {
        if (isArchivedCourseData(courseSnap.data())) {
          archivedSources.push(sources[sourceIndex]);
          executionState.warnings.push({
            code: "ASSIGNED_COURSE_ARCHIVED",
            message: "Assigned course source was archived and a fallback source will be checked: " + sources[sourceIndex] + "/" + courseId
          });
          sourceIndex = sourceIndex + 1;
          continue;
        }

        return courseSnap;
      }
    } catch (error) {
      executionState.warnings.push({
        code: "ASSIGNED_COURSE_READ_FAILED",
        message: "Assigned course could not be read from " + sources[sourceIndex] + ": " + readErrorMessage(error)
      });
    }

    sourceIndex = sourceIndex + 1;
  }

  if (archivedSources.length > 0) {
    executionState.warnings.push({
      code: "ASSIGNED_COURSE_ARCHIVED",
      message: "Assigned course was skipped because every readable source was archived: " + courseId + " (" + archivedSources.join(", ") + ")"
    });
    return null;
  }

  executionState.warnings.push({
    code: "ASSIGNED_COURSE_NOT_FOUND",
    message: "Assigned course was skipped because it no longer exists: " + courseId
  });

  return null;
}

async function loadAssignedCourseIds(actor, studentProfile, executionState) {
  var contextCourseIds = executionState && executionState.context ? executionState.context.assignedCourseIds : [];

  return getAssignedCourseIds(resolveActorStudentId(actor, studentProfile), studentProfile, contextCourseIds);
}

function addUniqueText(values, value) {
  if (typeof value !== "string" || value.length === 0) {
    return;
  }

  if (values.indexOf(value) === -1) {
    values.push(value);
  }
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
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

function appendStudentCourseLoadWarning(executionState, courseId, error) {
  executionState.warnings.push({
    code: "STUDENT_ASSIGNED_COURSE_TREE_LOAD_FAILED",
    message: "Assigned course shell was loaded, but course details were not ready for " + courseId + ": " + readErrorMessage(error)
  });
}

function isPreviewActor(actor) {
  return actor && actor.id === "preview-student";
}

function validateStudentProfileForDashboard(studentProfile) {
  var reason = readStudentProfileRejectReason(studentProfile);

  if (isStudentDashboardProfile(studentProfile)) {
    return { valid: true };
  }

  return createStudentProfileValidationError(reason);
}

function createStudentProfileValidationError(reason) {
  if (reason === "profile-missing") {
    return createValidationError("STUDENT_PROFILE_MISSING", "Student profile is required.");
  }

  if (reason === "not-student-role") {
    return createValidationError("STUDENT_ROLE_REQUIRED", "Only student accounts can open the student dashboard.");
  }

  if (reason === "inactive-status") {
    return createValidationError("STUDENT_ACCOUNT_INACTIVE", "This student account is not active.");
  }

  if (reason === "missing-class") {
    return createValidationError("STUDENT_CLASS_REQUIRED", "This student profile is missing a class.");
  }

  if (reason === "missing-location") {
    return createValidationError("STUDENT_LOCATION_REQUIRED", "This student profile is missing a location.");
  }

  return createValidationError("STUDENT_PROFILE_INVALID", "Student profile is not valid for the dashboard.");
}

function createValidationError(code, message) {
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

function readFirstProfileClassId(profile) {
  var classIds = readProfileClassIds(profile);

  return classIds.length > 0 ? classIds[0] : "";
}

function readProfileClassIds(profile) {
  return readStudentClassIds(profile);
}

function readFirstProfileLocationId(profile) {
  var locationIds = readStudentLocationIds(profile);

  return locationIds.length > 0 ? locationIds[0] : "";
}

function addTextList(target, values) {
  var valueIndex = 0;

  while (valueIndex < values.length) {
    addUniqueText(target, values[valueIndex]);
    valueIndex = valueIndex + 1;
  }
}

function logStudentCourseDebug(details) {
  if (!isStudentCourseDebugEnabled()) {
    return;
  }

  console.info("[student-course-debug] summary", JSON.stringify({
    studentId: details.studentId,
    uid: details.uid,
    locationId: details.locationId,
    classId: details.classId,
    classIds: details.classIds,
    queryPath: details.queryPaths,
    directCount: details.directCount,
    classCount: details.classCount,
    locationCount: details.locationCount,
    mergedCount: details.mergedCount,
    rawCourseCount: details.rawCourseCount,
    filteredCourseCount: details.filteredCourseCount,
    rejectionReasons: details.rejectionReasons
  }));

  console.info("[assignments:student-load]", {
    studentId: details.studentId,
    classIds: details.classIds,
    directCount: details.directCount,
    classCount: details.classCount,
    mergedCount: details.mergedCount
  });
}

function isDevelopmentHost() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
    || window.location.hostname === "";
}

function logStudentCourseTrace(label, value) {
  if (!isStudentCourseDebugEnabled()) {
    return;
  }

  console.log("[student-course-debug] " + label, JSON.stringify(value));
}

function logStudentCourseLoad(details) {
  if (!isStudentCourseDebugEnabled()) {
    return;
  }

  console.log("[student-course-load]", JSON.stringify({
    resolvedStudentId: details.resolvedStudentId,
    classIdentifiers: details.classIdentifiers,
    assignmentCount: details.assignmentCount,
    loadedCourseCount: details.loadedCourseCount
  }));
}

function logStudentCourseLoadWarning(courseId, error) {
  if (!isStudentCourseDebugEnabled()) {
    return;
  }

  console.warn("[student-course-debug] course tree fallback", JSON.stringify({
    courseId: courseId,
    error: readErrorMessage(error)
  }));
}

function isStudentCourseDebugEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.search.indexOf("debug=true") !== -1
    || isDevelopmentHost();
}

function withTimeout(promise, timeoutMs, code) {
  return Promise.race([
    promise,
    new Promise(function (_resolve, reject) {
      setTimeout(function () {
        reject(new Error(code));
      }, timeoutMs);
    })
  ]);
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
  if (isArchivedCourseData(courseData)) {
    return false;
  }

  if (!courseData || typeof courseData.status !== "string") {
    return true;
  }

  return courseData.status === "active"
    || courseData.status === "draft"
    || courseData.status === "published"
    || courseData.status === "ready";
}

function isArchivedCourseData(courseData) {
  var status = readTextValue(courseData && courseData.status).toLowerCase();

  return Boolean(
    courseData
      && (
        courseData.isArchived === true
        || status === "archived"
        || status === "disabled"
        || status === "deleted"
      )
  );
}

async function buildCourseTree(actor, courseSnap) {
  var course = Object.assign({ id: courseSnap.id }, courseSnap.data());
  course.modules = await loadModules(actor, readCourseCollectionName(courseSnap), course.id);
  return course;
}

function readCourseCollectionName(courseSnap) {
  if (courseSnap && courseSnap.ref && courseSnap.ref.parent && courseSnap.ref.parent.id) {
    return courseSnap.ref.parent.id;
  }

  return "courses";
}

async function loadModules(actor, courseCollectionName, courseId) {
  var modulesSnap = await getDocs(collection(db, courseCollectionName, courseId, "modules"));
  var modules = [];

  modulesSnap.forEach(function (moduleSnap) {
    modules.push(Object.assign({ id: moduleSnap.id }, moduleSnap.data()));
  });

  modules.sort(compareByOrderThenTitle);

  var moduleIndex = 0;
  while (moduleIndex < modules.length) {
    modules[moduleIndex].sessions = await loadSessions(actor, courseCollectionName, courseId, modules[moduleIndex].id);
    moduleIndex = moduleIndex + 1;
  }

  return modules;
}

async function loadSessions(actor, courseCollectionName, courseId, moduleId) {
  var sessionsSnap = await getDocs(collection(db, courseCollectionName, courseId, "modules", moduleId, "sessions"));
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
    var progressRef = doc(db, "studentProgress", resolveActorStudentId(actor), "courses", courseId, "sessions", sessionId);
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

function readLocalizedText(value, fallbackValue) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (value && typeof value.en === "string" && value.en.length > 0) {
    return value.en;
  }

  return fallbackValue;
}
