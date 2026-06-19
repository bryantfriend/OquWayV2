import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.82-shared-command-center-shell";
import { getAssignedCourseIds } from "../../../../../../../domain/courses/index.js";
import {
  isStudentDashboardProfile,
  readStudentClassIdentifiers,
  readStudentIdentifiers,
  readStudentProfileRejectReason,
  resolveStudentId
} from "../../../../../../../domain/users/index.js";

export async function processLoadStudentDashboard(executionState) {
  var actor = executionState.actor;
  var studentProfile = executionState.context.studentProfile;
  var resolvedStudentId = resolveStudentId(studentProfile, actor);
  var resolvedActor = createResolvedStudentActor(actor, resolvedStudentId);

  try {
    ensureWarnings(executionState);

    if (!studentProfile && !isPreviewActor(actor)) {
      return createValidationError("STUDENT_PROFILE_MISSING", "Student profile is required before the dashboard can be loaded.");
    }

    if (!isPreviewActor(actor)) {
      var profileValidation = validateStudentProfileForDashboard(studentProfile);
      if (!profileValidation.valid) {
        return profileValidation;
      }
    }

    var courseAssignmentResult = await waitForStudentDashboardRead(
      loadAssignedCourseIds(resolvedActor, studentProfile, executionState),
      "student course assignment lookup"
    );
    appendWarnings(executionState, courseAssignmentResult.warnings || []);

    var courses = await waitForStudentDashboardRead(
      loadLightweightStudentCourses(courseAssignmentResult.courseIds || [], courseAssignmentResult.assignmentIdByCourseId || {}, executionState),
      "student course summary lookup"
    );
    var progressSummary = buildProgressSummary(courses);
    var debugInfo = buildStudentDashboardDebugInfo({
      actor: actor,
      studentProfile: studentProfile,
      resolvedStudentId: resolvedStudentId,
      courseAssignmentResult: courseAssignmentResult,
      courses: courses
    });

    executionState.result = {
      student: studentProfile,
      courses: courses,
      assignmentCount: courseAssignmentResult.assignmentCount || 0,
      assignmentSource: courseAssignmentResult.source || "courseAssignments",
      continueLearning: buildContinueLearning(courses),
      intentionPoints: readIntentionPoints(studentProfile),
      dailyBonus: readDailyBonus(studentProfile),
      progressSummary: progressSummary,
      debugInfo: shouldEmitDebug(executionState) ? debugInfo : null,
      emptyStateMessage: courses.length === 0 ? "No courses are ready yet. Your teacher will assign learning soon." : ""
    };

    logStudentDashboardDebug(debugInfo, executionState);

    return {
      valid: true,
      data: executionState.result
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_DASHBOARD_LOAD_FAILED",
          message: "Failed to load student dashboard: " + readErrorMessage(error)
        }
      ]
    };
  }
}

async function loadLightweightStudentCourses(courseIds, assignmentIdByCourseId, executionState) {
  var safeCourseIds = dedupeTextList(courseIds);
  var courseCache = {};
  var courses = [];
  var courseIndex = 0;

  while (courseIndex < safeCourseIds.length) {
    var course = await loadCourseSummary(safeCourseIds[courseIndex], assignmentIdByCourseId, courseCache, executionState);

    if (course) {
      courses.push(course);
    }

    courseIndex = courseIndex + 1;
  }

  courses.sort(compareByOrderThenTitle);
  return courses;
}

async function loadCourseSummary(courseId, assignmentIdByCourseId, cache, executionState) {
  if (!courseId) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(cache, courseId)) {
    return cache[courseId];
  }

  cache[courseId] = await readCourseSummaryFromSource(courseId, "courses", assignmentIdByCourseId, executionState)
    || await readCourseSummaryFromSource(courseId, "catalogCourses", assignmentIdByCourseId, executionState);

  if (!cache[courseId]) {
    executionState.warnings.push({
      code: "ASSIGNED_COURSE_NOT_FOUND",
      message: "Assigned course was skipped because it no longer exists: " + courseId
    });
  }

  return cache[courseId];
}

async function readCourseSummaryFromSource(courseId, source, assignmentIdByCourseId, executionState) {
  try {
    var courseSnap = await getDoc(doc(db, source, courseId));

    if (!courseSnap.exists()) {
      return null;
    }

    if (!isStudentVisibleCourseSummary(courseSnap.data() || {})) {
      executionState.warnings.push({
        code: "ASSIGNED_COURSE_NOT_READY",
        message: "Assigned course is not published or ready for students: " + courseId
      });
      return null;
    }

    return normalizeCourseSummary(courseSnap.id, courseSnap.data() || {}, source, assignmentIdByCourseId);
  } catch (error) {
    executionState.warnings.push({
      code: "ASSIGNED_COURSE_READ_FAILED",
      message: "Assigned course could not be read from " + source + ": " + readErrorMessage(error)
    });
    return null;
  }
}

function normalizeCourseSummary(courseId, data, source, assignmentIdByCourseId) {
  var assignmentId = assignmentIdByCourseId[courseId] || data.assignmentId || data.courseAssignmentId || "";

  return {
    id: courseId,
    courseId: courseId,
    source: source,
    title: data.title || data.name || data.displayName || "Untitled Course",
    description: data.description || data.summary || "",
    status: data.status || data.state || "assigned",
    order: readNumber(data.order, readNumber(data.sortOrder, 0)),
    moduleCount: readCourseModuleCount(data),
    progressPercent: readStoredProgressPercent(data),
    assignmentId: assignmentId,
    courseAssignmentId: assignmentId,
    isLightweight: true
  };
}

async function loadAssignedCourseIds(actor, studentProfile, executionState) {
  var contextCourseIds = executionState && executionState.context ? executionState.context.assignedCourseIds : [];
  var profileWithActor = Object.assign({}, studentProfile || {}, {
    __actor: actor || null
  });

  return getAssignedCourseIds(actor && actor.id ? actor.id : "", profileWithActor, contextCourseIds);
}

function buildContinueLearning(courses) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var firstCourse = safeCourses.length > 0 ? safeCourses[0] : null;

  if (!firstCourse) {
    return {
      courseId: "",
      moduleId: "",
      sessionId: "",
      title: "Start your first course",
      courseTitle: "",
      moduleTitle: "",
      progressPercent: 0,
      status: "empty",
      actionLabel: "Start Learning",
      lastOpenedAt: 0
    };
  }

  var progressPercent = readStoredProgressPercent(firstCourse);

  return {
    courseId: firstCourse.id,
    moduleId: "",
    sessionId: "",
    title: progressPercent > 0 ? "Continue Learning" : "Start your first course",
    courseTitle: readLocalizedText(firstCourse.title, "Untitled Course"),
    moduleTitle: "Open course to load activities",
    progressPercent: progressPercent,
    status: progressPercent >= 100 ? "completed" : (progressPercent > 0 ? "inProgress" : "notStarted"),
    actionLabel: progressPercent > 0 ? "Continue" : "Start Learning",
    lastOpenedAt: 0
  };
}

function buildProgressSummary(courses) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var totalCourses = safeCourses.length;
  var completedCourses = 0;
  var inProgressCourses = 0;
  var overallProgress = 0;
  var courseIndex = 0;

  while (courseIndex < safeCourses.length) {
    var progressPercent = readStoredProgressPercent(safeCourses[courseIndex]);
    overallProgress = overallProgress + progressPercent;

    if (progressPercent >= 100) {
      completedCourses = completedCourses + 1;
    } else if (progressPercent > 0) {
      inProgressCourses = inProgressCourses + 1;
    }

    courseIndex = courseIndex + 1;
  }

  return {
    totalCourses: totalCourses,
    completedCourses: completedCourses,
    inProgressCourses: inProgressCourses,
    overallProgressPercent: totalCourses > 0 ? Math.round(overallProgress / totalCourses) : 0
  };
}

function readIntentionPoints(student) {
  var source = student && typeof student.intentionPoints === "object" ? student.intentionPoints : {};
  var rewards = student && typeof student.rewards === "object" ? student.rewards : {};

  return {
    cognitive: readNumber(source.cognitive, rewards.cognitivePoints),
    physical: readNumber(source.physical, rewards.physicalPoints),
    creative: readNumber(source.creative, rewards.creativePoints),
    social: readNumber(source.social, rewards.socialPoints)
  };
}

function readDailyBonus(student) {
  var dailyBonus = student && typeof student.dailyBonus === "object" ? student.dailyBonus : {};
  var lastClaimedDate = typeof dailyBonus.lastClaimedDate === "string" ? dailyBonus.lastClaimedDate : "";
  var today = new Date().toISOString().slice(0, 10);
  var claimed = lastClaimedDate === today;

  return {
    available: !claimed,
    claimed: claimed,
    lastClaimedDate: lastClaimedDate,
    rewardXp: readNumber(dailyBonus.rewardXp, 10),
    nextAvailableAt: claimed ? today + "T24:00:00.000Z" : "",
    countdownLabel: claimed ? "Available again tomorrow" : "Ready now"
  };
}

function buildStudentDashboardDebugInfo(details) {
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
    locationAssignmentCount: assignmentResult.locationCount || 0,
    mergedAssignmentCount: assignmentResult.mergedCount || assignmentResult.assignmentCount || 0,
    loadedCourseCount: courses.length,
    courseIds: courses.map(function (course) {
      return course && course.id ? course.id : "";
    }).filter(Boolean),
    queryPaths: assignmentResult.queryPaths || [],
    queryErrors: readQueryErrors(assignmentResult),
    rejectionReasons: assignmentResult.rejectionReasons || []
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

  return errors;
}

function logStudentDashboardDebug(debugInfo, executionState) {
  if (!shouldEmitDebug(executionState) && !isDevelopmentHost()) {
    return;
  }

  console.info("[student-dashboard:summary-load]", debugInfo);
}

function validateStudentProfileForDashboard(studentProfile) {
  var reason = readStudentProfileRejectReason(studentProfile);

  if (isStudentDashboardProfile(studentProfile)) {
    return { valid: true };
  }

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

function createResolvedStudentActor(actor, resolvedStudentId) {
  return Object.assign({}, actor || {}, {
    id: resolvedStudentId || (actor && actor.id ? actor.id : "preview-student"),
    role: "ROLE_STUDENT"
  });
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

function readCourseModuleCount(data) {
  if (typeof data.moduleCount === "number" && Number.isFinite(data.moduleCount)) {
    return Math.max(0, Math.round(data.moduleCount));
  }

  if (Array.isArray(data.modules)) {
    return data.modules.length;
  }

  if (Array.isArray(data.moduleIds)) {
    return data.moduleIds.length;
  }

  if (Array.isArray(data.moduleOrder)) {
    return data.moduleOrder.length;
  }

  return 0;
}

function isStudentVisibleCourseSummary(data) {
  var status = readText(data && (data.status || data.state)).toLowerCase();

  if (!data || typeof data !== "object") {
    return false;
  }

  if (data.isPublished === true || data.published === true) {
    return true;
  }

  return status === "published" || status === "active" || status === "ready" || status === "assigned";
}

function readStoredProgressPercent(course) {
  var progress = course && typeof course.progress === "object" ? course.progress : {};

  return clampPercent(
    readNumber(
      course ? course.progressPercent : 0,
      readNumber(course ? course.completionPercent : 0, readNumber(course ? course.percentComplete : 0, progress.percent))
    )
  );
}

function readNumber(primaryValue, fallbackValue) {
  if (typeof primaryValue === "number" && Number.isFinite(primaryValue)) {
    return Math.max(0, Math.round(primaryValue));
  }

  if (typeof fallbackValue === "number" && Number.isFinite(fallbackValue)) {
    return Math.max(0, Math.round(fallbackValue));
  }

  return 0;
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, readNumber(value, 0)));
}

function compareByOrderThenTitle(left, right) {
  var leftOrder = typeof left.order === "number" ? left.order : 0;
  var rightOrder = typeof right.order === "number" ? right.order : 0;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return readLocalizedText(left.title, "").localeCompare(readLocalizedText(right.title, ""));
}

function dedupeTextList(values) {
  var source = Array.isArray(values) ? values : [];
  var output = [];
  var index = 0;

  while (index < source.length) {
    if (typeof source[index] === "string" && source[index].length > 0 && output.indexOf(source[index]) === -1) {
      output.push(source[index]);
    }

    index = index + 1;
  }

  return output;
}

function appendWarnings(executionState, warnings) {
  var warningIndex = 0;

  ensureWarnings(executionState);

  while (warningIndex < warnings.length) {
    executionState.warnings.push(warnings[warningIndex]);
    warningIndex = warningIndex + 1;
  }
}

function ensureWarnings(executionState) {
  if (!Array.isArray(executionState.warnings)) {
    executionState.warnings = [];
  }
}

function isPreviewActor(actor) {
  return actor && actor.id === "preview-student";
}

function shouldEmitDebug(executionState) {
  return Boolean(executionState && executionState.payload && executionState.payload.debug === true);
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && window.location
    && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "");
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
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

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function waitForStudentDashboardRead(promise, label) {
  var timeoutMs = 12000;

  return new Promise(function (resolve, reject) {
    var settled = false;
    var timer = setTimeout(function () {
      if (settled) {
        return;
      }

      settled = true;
      reject(new Error(label + " timed out."));
    }, timeoutMs);

    Promise.resolve(promise).then(function (value) {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timer);
      resolve(value);
    }).catch(function (error) {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timer);
      reject(error);
    });
  });
}
