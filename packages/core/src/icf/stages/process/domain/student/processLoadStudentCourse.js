import { db, collection, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.82-shared-command-center-shell";
import { normalizePracticeModes } from "../moduleEditor/practiceModeShells.js?v=1.1.82-shared-command-center-shell";
import { getAssignedCourseIds } from "../../../../../../../domain/courses/index.js?v=1.1.213-emotional-checkin-owner";
import { getModulesForCourse } from "../../../../../../../domain/modules/index.js?v=1.1.213-emotional-checkin-owner";
import { getStudentExternalTaskSubmissions } from "../../../../../../../domain/externalTasks/index.js?v=1.1.82-shared-command-center-shell";
import {
  isStudentDashboardProfile,
  readStudentClassIdentifiers,
  readStudentClassIds,
  readStudentIdentifiers,
  readStudentLocationIds,
  readStudentProfileRejectReason,
  resolveStudentId
} from "../../../../../../../domain/users/index.js";
import { createDefaultProgressDocument } from "./studentProgressHelpers.js?v=1.1.82-shared-command-center-shell";

export async function processLoadStudentCourse(executionState) {
  var actor = executionState.actor;
  var studentProfile = executionState.context.studentProfile;
  var resolvedStudentId = resolveStudentId(studentProfile, actor);
  var resolvedActor = createResolvedStudentActor(actor, resolvedStudentId);

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

    var courseAssignmentResult = await loadAssignedCourseIds(resolvedActor, studentProfile, executionState);
    appendWarnings(executionState, courseAssignmentResult.warnings);

    var courses = await loadStudentCourses(resolvedActor, courseAssignmentResult.courseIds, executionState, courseAssignmentResult.assignmentIdByCourseId);
    var debugInfo = buildStudentCourseDebugInfo({
      actor: actor,
      studentProfile: studentProfile,
      resolvedStudentId: resolvedStudentId,
      courseAssignmentResult: courseAssignmentResult,
      courses: courses
    });

    logStudentCourseDebug(Object.assign({}, debugInfo, {
      studentId: resolvedStudentId,
      uid: actor && actor.id ? actor.id : "",
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
      debugRequested: shouldEmitDebug(executionState),
      rejectionReasons: courseAssignmentResult.rejectionReasons
    }));

    executionState.result = {
      student: studentProfile,
      courses: courses,
      assignmentCount: courseAssignmentResult.assignmentCount,
      assignmentSource: courseAssignmentResult.source,
      debugInfo: shouldEmitDebug(executionState) ? debugInfo : null,
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
  } else if (isPreviewActor(actor) && shouldAllowPreviewCourseFallback(executionState)) {
    executionState.warnings.push({
      code: "STUDENT_DASHBOARD_DEV_FALLBACK",
      message: "No assignments found for preview student. Showing visible courses as a development fallback."
    });
    courseSnaps = await loadAllCourseSnaps();
  } else {
    courseSnaps = [];
  }

  while (courseIndex < courseSnaps.length) {
    var course = attachAssignmentIdToCourse(
      await buildCourseTree(actor, courseSnaps[courseIndex]),
      assignmentIdByCourseId || {}
    );
    logStudentCourseHydration(actor, course, executionState);
    courses.push(await attachExternalTaskSubmissionsToCourse(actor, course));
    courseIndex = courseIndex + 1;
  }

  courses.sort(compareByOrderThenTitle);
  return courses;
}

function shouldAllowPreviewCourseFallback(executionState) {
  return Boolean(
    executionState
      && executionState.payload
      && executionState.payload.allowPreviewCourseFallback === true
  );
}

async function attachExternalTaskSubmissionsToCourse(actor, course) {
  var submissions = [];

  if (!course || !course.id || !actor || !actor.id || isPreviewActor(actor)) {
    return course;
  }

  try {
    submissions = await getStudentExternalTaskSubmissions({
      studentId: actor.id,
      courseId: course.id,
      assignmentId: course.assignmentId || course.courseAssignmentId || "",
      courseAssignmentId: course.courseAssignmentId || course.assignmentId || ""
    });

    if (submissions.length === 0 && (course.assignmentId || course.courseAssignmentId)) {
      submissions = await getStudentExternalTaskSubmissions({
        studentId: actor.id,
        courseId: course.id
      });
    }
  } catch (error) {
    console.warn("[student-course:external-task-status-failed]", {
      studentId: actor.id,
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
  var sourceIndex = 0;

  while (sourceIndex < sources.length) {
    try {
      var courseSnap = await getDoc(doc(db, sources[sourceIndex], courseId));

      if (courseSnap.exists()) {
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

  executionState.warnings.push({
    code: "ASSIGNED_COURSE_NOT_FOUND",
    message: "Assigned course was skipped because it no longer exists: " + courseId
  });

  return null;
}

async function loadAssignedCourseIds(actor, studentProfile, executionState) {
  var contextCourseIds = executionState && executionState.context ? executionState.context.assignedCourseIds : [];
  var profileWithActor = Object.assign({}, studentProfile || {}, {
    __actor: actor || null
  });

  return getAssignedCourseIds(actor && actor.id ? actor.id : "", profileWithActor, contextCourseIds);
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
  if (!isDevelopmentHost() && !details.debugRequested) {
    return;
  }

  console.info("[student-course-debug]", {
    resolvedStudentId: details.resolvedStudentId || details.studentId,
    authUid: details.authUid || details.uid,
    tokenStudentId: details.tokenStudentId || "",
    profileId: details.profileId || "",
    classIdentifiers: details.classIdentifiers || details.classIds,
    studentIdentifiers: details.studentIdentifiers || [],
    locationId: details.locationId,
    classId: details.classId,
    queryPath: details.queryPaths,
    directAssignmentCount: details.directAssignmentCount || details.directCount,
    classAssignmentCount: details.classAssignmentCount || details.classCount,
    locationCount: details.locationCount,
    mergedAssignmentCount: details.mergedAssignmentCount || details.mergedCount,
    loadedCourseCount: details.loadedCourseCount || details.filteredCourseCount,
    courseIds: details.courseIds || [],
    queryErrors: details.queryErrors || [],
    rejectionReasons: details.rejectionReasons
  });

  console.info("[assignments:student-load]", {
    studentId: details.resolvedStudentId || details.studentId,
    classIds: details.classIdentifiers || details.classIds,
    directCount: details.directAssignmentCount || details.directCount,
    classCount: details.classAssignmentCount || details.classCount,
    mergedCount: details.mergedAssignmentCount || details.mergedCount
  });
}

function buildStudentCourseDebugInfo(details) {
  var actor = details.actor || {};
  var studentProfile = details.studentProfile || {};
  var assignmentResult = details.courseAssignmentResult || {};
  var courses = Array.isArray(details.courses) ? details.courses : [];

  return {
    resolvedStudentId: details.resolvedStudentId || "",
    authUid: actor.id || "",
    tokenStudentId: actor.claims && typeof actor.claims.studentId === "string" ? actor.claims.studentId : "",
    profileId: studentProfile.id || "",
    classIdentifiers: readStudentClassIdentifiers(studentProfile, actor),
    studentIdentifiers: readStudentIdentifiers(studentProfile, actor),
    directAssignmentCount: assignmentResult.directCount || 0,
    classAssignmentCount: assignmentResult.classCount || 0,
    mergedAssignmentCount: assignmentResult.mergedCount || assignmentResult.assignmentCount || 0,
    loadedCourseCount: courses.length,
    courseIds: courses.map(function (course) {
      return course && course.id ? course.id : "";
    }).filter(Boolean),
    queryErrors: readQueryErrors(assignmentResult)
  };
}

function readQueryErrors(assignmentResult) {
  var errors = Array.isArray(assignmentResult && assignmentResult.queryErrors) ? assignmentResult.queryErrors.slice() : [];
  var warnings = Array.isArray(assignmentResult && assignmentResult.warnings) ? assignmentResult.warnings : [];
  var warningIndex = 0;

  while (warningIndex < warnings.length) {
    if (warnings[warningIndex] && warnings[warningIndex].code === "STUDENT_ASSIGNMENT_QUERY_FAILED") {
      errors.push(warnings[warningIndex].message || warnings[warningIndex].code);
    }
    warningIndex = warningIndex + 1;
  }

  return errors.filter(function (error, index, list) {
    return error && list.indexOf(error) === index;
  });
}

function shouldEmitDebug(executionState) {
  return Boolean(executionState && executionState.payload && executionState.payload.debug === true);
}

function createResolvedStudentActor(actor, resolvedStudentId) {
  return Object.assign({}, actor || {}, {
    id: resolvedStudentId || (actor && actor.id ? actor.id : "")
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
    || courseData.status === "published"
    || courseData.status === "ready";
}

async function buildCourseTree(actor, courseSnap) {
  var course = Object.assign({ id: courseSnap.id }, courseSnap.data());
  var courseRecordSource = readCourseCollectionName(courseSnap);
  var moduleContext = await loadModuleContext(actor, courseRecordSource, course.id, course);

  return Object.assign({}, course, {
    source: courseRecordSource,
    courseRecordSource: courseRecordSource,
    canonicalCourseId: moduleContext.canonicalCourseId,
    moduleCourseId: moduleContext.moduleCourseId,
    moduleSource: moduleContext.moduleSource,
    moduleCount: moduleContext.modules.length,
    modules: moduleContext.modules
  });
}

function readCourseCollectionName(courseSnap) {
  if (courseSnap && courseSnap.ref && courseSnap.ref.parent && courseSnap.ref.parent.id) {
    return courseSnap.ref.parent.id;
  }

  return "courses";
}

async function loadModuleContext(actor, courseCollectionName, courseId, course) {
  var sources = buildCanonicalModuleSourceOrder(courseCollectionName);
  var modules = await getModulesForCourse(courseId, {
    sources: sources,
    course: course || {}
  });
  var moduleSource = readLoadedModuleSource(modules) || (sources.length > 0 ? sources[0] : "catalogCourses");
  modules.sort(compareByOrderThenTitle);
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    modules[moduleIndex] = await hydrateModuleForStudent(actor, modules[moduleIndex].source || moduleSource, courseId, modules[moduleIndex]);
    moduleIndex = moduleIndex + 1;
  }

  if (modules.length === 0 && hasStoredModuleHints(course)) {
    console.warn("[student-course-hydration:empty]", {
      courseId: courseId,
      canonicalPath: "catalogCourses/" + courseId + "/modules",
      fallbackPath: courseCollectionName === "courses" ? "courses/" + courseId + "/modules" : "",
      courseStatus: course && (course.status || course.state) ? course.status || course.state : "",
      storedModuleCount: readStoredModuleCount(course)
    });
  }

  return {
    modules: modules,
    moduleSource: moduleSource,
    moduleCourseId: courseId,
    canonicalCourseId: courseId
  };
}

function buildCanonicalModuleSourceOrder(courseCollectionName) {
  var sources = [];

  addModuleSource(sources, "catalogCourses");
  addModuleSource(sources, courseCollectionName);
  addModuleSource(sources, "courses");

  return sources;
}

function addModuleSource(sources, source) {
  if ((source === "catalogCourses" || source === "courses") && sources.indexOf(source) === -1) {
    sources.push(source);
  }
}

function readLoadedModuleSource(modules) {
  var safeModules = Array.isArray(modules) ? modules : [];

  if (safeModules.length > 0 && safeModules[0] && (safeModules[0].source === "catalogCourses" || safeModules[0].source === "courses")) {
    return safeModules[0].source;
  }

  return "";
}
function hasStoredModuleHints(course) {
  return readStoredModuleCount(course) > 0;
}

function readStoredModuleCount(course) {
  if (!course || typeof course !== "object") {
    return 0;
  }

  if (Array.isArray(course.modules) && course.modules.length > 0) {
    return course.modules.length;
  }

  if (Array.isArray(course.moduleIds) && course.moduleIds.length > 0) {
    return course.moduleIds.length;
  }

  if (Array.isArray(course.moduleOrder) && course.moduleOrder.length > 0) {
    return course.moduleOrder.length;
  }

  if (typeof course.moduleCount === "number" && Number.isFinite(course.moduleCount)) {
    return Math.max(0, Math.round(course.moduleCount));
  }

  return 0;
}

function logStudentCourseHydration(actor, course, executionState) {
  if (!shouldEmitDebug(executionState) && !isDevelopmentHost()) {
    return;
  }

  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var moduleSource = course && course.moduleSource ? course.moduleSource : "catalogCourses";
  var courseId = course && course.id ? course.id : "";

  console.log("[student-course-hydration]", {
    actorId: actor && actor.id ? actor.id : "",
    courseId: courseId,
    assignmentId: course && (course.assignmentId || course.courseAssignmentId) ? course.assignmentId || course.courseAssignmentId : "",
    courseStatus: course && (course.status || course.state) ? course.status || course.state : "",
    moduleReadPath: moduleSource + "/" + courseId + "/modules",
    loadedModuleCount: modules.length,
    visibleModuleCount: countVisibleStudentModules(modules),
    completedModuleCount: countCompletedStudentModules(modules),
    moduleIds: modules.map(readModuleIdForLog),
    moduleStatuses: modules.map(readModuleStatusForLog)
  });
}

function countVisibleStudentModules(modules) {
  var safeModules = Array.isArray(modules) ? modules : [];
  var count = 0;
  var index = 0;

  while (index < safeModules.length) {
    if (isStudentVisibleModule(safeModules[index])) {
      count = count + 1;
    }
    index = index + 1;
  }

  return count;
}

function countCompletedStudentModules(modules) {
  var safeModules = Array.isArray(modules) ? modules : [];
  var count = 0;
  var index = 0;

  while (index < safeModules.length) {
    if (readTextValue(safeModules[index] && (safeModules[index].learningStatus || safeModules[index].status)).toLowerCase() === "complete") {
      count = count + 1;
    }
    index = index + 1;
  }

  return count;
}

function isStudentVisibleModule(module) {
  var status = readTextValue(module && module.status).toLowerCase();

  return !status || status === "published" || status === "active" || status === "ready" || status === "assigned";
}

function readModuleIdForLog(module) {
  return module && (module.id || module.moduleId) ? module.id || module.moduleId : "";
}

function readModuleStatusForLog(module) {
  return module && module.status ? module.status : "";
}
async function hydrateModuleForStudent(actor, courseCollectionName, courseId, module) {
  var moduleId = readTextValue(module && (module.id || module.moduleId));
  var sessions = await loadSessions(actor, courseCollectionName, courseId, moduleId);
  var learningModes = await loadLearningModes(courseCollectionName, courseId, moduleId, module ? module.learningModes : {});

  return Object.assign({}, module, {
    learningModes: learningModes,
    sessions: await hydrateSessionsFromLearningModes(actor, courseId, moduleId, sessions, learningModes)
  });
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

async function loadLearningModes(courseCollectionName, courseId, moduleId, embeddedLearningModes) {
  var learningModes = normalizeEmbeddedLearningModes(embeddedLearningModes);
  var modesSnap = null;
  var modeRecords = [];
  var modeIndex = 0;

  try {
    modesSnap = await getDocs(collection(db, courseCollectionName, courseId, "modules", moduleId, "learningModes"));
  } catch (error) {
    return learningModes;
  }

  modesSnap.forEach(function (modeSnap) {
    modeRecords.push(Object.assign({ id: modeSnap.id, key: modeSnap.id }, modeSnap.data() || {}));
  });

  while (modeIndex < modeRecords.length) {
    learningModes[modeRecords[modeIndex].id] = await hydrateLearningModeSteps(
      courseCollectionName,
      courseId,
      moduleId,
      Object.assign({}, learningModes[modeRecords[modeIndex].id] || {}, modeRecords[modeIndex])
    );
    modeIndex = modeIndex + 1;
  }

  return learningModes;
}

function normalizeEmbeddedLearningModes(embeddedLearningModes) {
  var modes = embeddedLearningModes && typeof embeddedLearningModes === "object" && !Array.isArray(embeddedLearningModes)
    ? embeddedLearningModes
    : {};
  var modeIds = Object.keys(modes);
  var normalized = {};
  var modeIndex = 0;

  while (modeIndex < modeIds.length) {
    normalized[modeIds[modeIndex]] = Object.assign({
      id: modeIds[modeIndex],
      key: modeIds[modeIndex]
    }, modes[modeIds[modeIndex]] || {});
    modeIndex = modeIndex + 1;
  }

  return normalized;
}

async function hydrateLearningModeSteps(courseCollectionName, courseId, moduleId, learningMode) {
  var steps = Array.isArray(learningMode.steps) ? learningMode.steps.slice() : [];

  if (steps.length === 0) {
    try {
      steps = await loadLearningModeSteps(courseCollectionName, courseId, moduleId, learningMode.id || learningMode.key);
    } catch (error) {
      steps = [];
    }
  }

  steps = sortStepsByStableOrder(steps, learningMode.stepOrder);

  return Object.assign({}, learningMode, {
    steps: steps,
    stepOrder: steps.map(function (step) {
      return step && step.id ? step.id : "";
    }).filter(Boolean),
    stepCount: steps.length
  });
}

async function loadLearningModeSteps(courseCollectionName, courseId, moduleId, modeId) {
  var stepsSnap = await getDocs(collection(db, courseCollectionName, courseId, "modules", moduleId, "learningModes", modeId, "steps"));
  var steps = [];

  stepsSnap.forEach(function (stepSnap) {
    steps.push(Object.assign({ id: stepSnap.id }, stepSnap.data() || {}));
  });

  return steps;
}

async function hydrateSessionsFromLearningModes(actor, courseId, moduleId, sessions, learningModes) {
  var hydratedSessions = Array.isArray(sessions) ? sessions.slice() : [];
  var modeIds = Object.keys(learningModes || {});
  var modeIndex = 0;

  while (modeIndex < modeIds.length) {
    hydratedSessions = await hydrateSessionForLearningMode(actor, courseId, moduleId, hydratedSessions, learningModes[modeIds[modeIndex]], modeIds[modeIndex]);
    modeIndex = modeIndex + 1;
  }

  hydratedSessions.sort(compareSessionOrder);
  return hydratedSessions;
}

async function hydrateSessionForLearningMode(actor, courseId, moduleId, sessions, learningMode, modeId) {
  var steps = Array.isArray(learningMode && learningMode.steps) ? learningMode.steps : [];
  var sessionIndex = findLearningModeSessionIndex(sessions, learningMode, modeId);
  var session = sessionIndex >= 0 ? sessions[sessionIndex] : createSessionFromLearningMode(learningMode, modeId, sessions.length + 1);
  var practiceModeKey = readPracticeModeKeyForLearningMode(learningMode);
  var practiceModes = normalizePracticeModes(session.practiceModes);
  var currentMode = practiceModes[practiceModeKey] || {};
  var hydratedSession = null;

  if (steps.length === 0) {
    return sessions;
  }

  practiceModes[practiceModeKey] = Object.assign({}, currentMode, {
    key: practiceModeKey,
    title: normalizeLocalizedTitle(learningMode.title, currentMode.title),
    purpose: readTextValue(learningMode.purpose) || currentMode.purpose || "",
    status: learningMode.status || currentMode.status || "draft",
    enabled: learningMode.enabled !== false,
    steps: sortStepsByStableOrder(steps, learningMode.stepOrder)
  });

  hydratedSession = Object.assign({}, session, {
    learningModeId: modeId,
    learningModeType: learningMode.modeType || session.learningModeType || "custom",
    isLearningModeShell: true,
    practiceModes: practiceModes,
    progress: session.progress || await loadProgress(actor, courseId, moduleId, session.id)
  });

  if (sessionIndex >= 0) {
    sessions[sessionIndex] = hydratedSession;
    return sessions;
  }

  sessions.push(hydratedSession);
  return sessions;
}

function findLearningModeSessionIndex(sessions, learningMode, modeId) {
  var legacySessionId = readTextValue(learningMode && learningMode.legacySessionId);
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    if ((legacySessionId && sessions[sessionIndex].id === legacySessionId) || sessions[sessionIndex].learningModeId === modeId) {
      return sessionIndex;
    }

    sessionIndex = sessionIndex + 1;
  }

  return -1;
}

function createSessionFromLearningMode(learningMode, modeId, order) {
  return {
    id: readTextValue(learningMode && learningMode.legacySessionId) || "mode-" + modeId,
    title: normalizeLocalizedTitle(learningMode ? learningMode.title : "", { en: "Learning Mode", ru: "", ky: "" }),
    description: readTextValue(learningMode && learningMode.purpose),
    sessionNumber: readNumber(learningMode && learningMode.order, order),
    order: readNumber(learningMode && learningMode.order, order),
    status: learningMode && learningMode.status ? learningMode.status : "draft",
    learningModeId: modeId,
    learningModeType: learningMode && learningMode.modeType ? learningMode.modeType : "custom",
    isLearningModeShell: true,
    practiceModes: normalizePracticeModes(null)
  };
}

function readPracticeModeKeyForLearningMode(learningMode) {
  if (learningMode && isValidStudentPracticeModeKey(learningMode.practiceModeKey)) {
    return learningMode.practiceModeKey;
  }

  if (learningMode && learningMode.modeType === "review") {
    return "afterClass";
  }

  if (learningMode && learningMode.modeType === "practice") {
    return "dailyPractice";
  }

  if (learningMode && learningMode.modeType === "assessment") {
    return "classroomLesson";
  }

  return "beforeClass";
}

function isValidStudentPracticeModeKey(practiceModeKey) {
  return practiceModeKey === "beforeClass"
    || practiceModeKey === "classroomLesson"
    || practiceModeKey === "afterClass"
    || practiceModeKey === "dailyPractice";
}

function sortStepsByStableOrder(steps, stepOrder) {
  var safeSteps = Array.isArray(steps) ? steps.slice() : [];
  var order = Array.isArray(stepOrder) ? stepOrder : [];
  var orderIndexByStepId = {};

  order.forEach(function (stepId, index) {
    if (typeof stepId === "string" && stepId.length > 0) {
      orderIndexByStepId[stepId] = index;
    }
  });

  safeSteps.sort(function (firstStep, secondStep) {
    var firstId = firstStep && firstStep.id ? firstStep.id : "";
    var secondId = secondStep && secondStep.id ? secondStep.id : "";
    var firstHasOrder = Object.prototype.hasOwnProperty.call(orderIndexByStepId, firstId);
    var secondHasOrder = Object.prototype.hasOwnProperty.call(orderIndexByStepId, secondId);

    if (firstHasOrder && secondHasOrder) {
      return orderIndexByStepId[firstId] - orderIndexByStepId[secondId];
    }

    if (firstHasOrder) {
      return -1;
    }

    if (secondHasOrder) {
      return 1;
    }

    return readStepOrder(firstStep) - readStepOrder(secondStep);
  });

  return safeSteps;
}

function normalizeLocalizedTitle(title, fallbackTitle) {
  if (typeof title === "string" && title.trim().length > 0) {
    return { en: title.trim(), ru: "", ky: "" };
  }

  if (title && typeof title === "object" && !Array.isArray(title)) {
    return {
      en: readTextValue(title.en) || readTextValue(fallbackTitle && fallbackTitle.en) || "Learning Mode",
      ru: readTextValue(title.ru) || readTextValue(fallbackTitle && fallbackTitle.ru),
      ky: readTextValue(title.ky) || readTextValue(fallbackTitle && fallbackTitle.ky)
    };
  }

  return fallbackTitle || { en: "Learning Mode", ru: "", ky: "" };
}

function readNumber(value, fallbackValue) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallbackValue;
}

function readStepOrder(step) {
  if (step && typeof step.order === "number" && Number.isFinite(step.order)) {
    return step.order;
  }

  return 0;
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
