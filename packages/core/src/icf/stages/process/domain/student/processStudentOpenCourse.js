import { processContinueLearning } from "./processContinueLearning.js?v=1.1.82-shared-command-center-shell";
import { getAssignedCourseIds, validateStudentCourseOpen } from "../../../../../../../domain/courses/index.js?v=1.1.208-student-dashboard-scope";
import { resolveStudentId } from "../../../../../../../domain/users/index.js";

export async function processStudentOpenCourse(executionState) {
  var payload = executionState.payload || {};
  var courseId = readText(payload.courseId);
  var studentId = resolveStudentId(executionState.context.studentProfile, executionState.actor) || readText(payload.studentId || (executionState.actor ? executionState.actor.id : ""));
  var courses = Array.isArray(executionState.context.studentOpenCourses) ? executionState.context.studentOpenCourses : [];
  var profileWithActor = Object.assign({}, executionState.context.studentProfile || {}, {
    __actor: Object.assign({}, executionState.actor || {}, { id: studentId })
  });
  var assignmentResult = await waitForStudentCourseOpenRead(
    getAssignedCourseIds(studentId, profileWithActor),
    "student course assignment lookup"
  );
  var assignmentId = assignmentResult.assignmentIdByCourseId[courseId] || readText(payload.assignmentId || payload.courseAssignmentId);
  var isAssignedCourse = assignmentResult.courseIds.indexOf(courseId) !== -1;
  var course = executionState.context.studentOpenCourse || findCourseById(courses, courseId);
  var requireAssignment = !isPreviewActor(executionState.actor);

  if (!course || (!isAssignedCourse && requireAssignment)) {
    return finishCourseOpenValidation(executionState, {
      course: course,
      modules: [],
      assignmentId: assignmentId,
      courseId: courseId,
      studentId: studentId,
      validation: createCourseOpenValidation("courseUnavailable", "This course is not available right now.", "Course is missing or not assigned.")
    });
  }

  course = attachAssignmentId(course, assignmentId);
  courses = [course];

  if (!assignmentId && !isPreviewActor(executionState.actor)) {
    executionState.warnings.push({
      code: "STUDENT_COURSE_ASSIGNMENT_ID_MISSING",
      message: "Course is visible from a legacy profile course field, but no courseAssignments document was found for progress context."
    });
  }

  var modules = Array.isArray(course.modules) ? course.modules : [];
  var validation = validateStudentCourseOpen(course, {
    assignmentId: assignmentId || course.assignmentId || course.courseAssignmentId,
    requireAssignment: requireAssignment
  });
  var openTarget = validation.openTarget || await selectCourseOpenTarget(executionState, course);
  var hasActivity = validation.playable === true && hasOpenableActivity(course, openTarget);

  if (!validation.playable) {
    if (validation.code === "moduleMissing") {
      executionState.warnings.push({
        code: "STUDENT_COURSE_MODULE_MISSING",
        message: "Some course content could not be loaded for course " + courseId + "."
      });
    }

    return finishCourseOpenValidation(executionState, {
      course: course,
      modules: modules,
      assignmentId: assignmentId,
      courseId: courseId,
      studentId: studentId,
      validation: validation
    });
  }

  if (modules.length === 0) {
    openTarget = createEmptyCourseTarget(course);
  } else if (!openTarget.moduleId) {
    openTarget = createModuleOnlyTarget(course, modules[0]);
  }

  logCourseOpenTiming(executionState, {
    studentIdPresent: Boolean(studentId),
    courseId: courseId,
    assignmentIdPresent: Boolean(course.assignmentId),
    assignmentSource: assignmentId ? assignmentResult.source : "legacy-profile-course",
    moduleCount: modules.length,
    selectedModuleId: openTarget.moduleId,
    selectedSessionId: openTarget.sessionId,
    selectedPracticeModeKey: openTarget.practiceModeKey,
    hasActivity: hasActivity
  });

  logCourseOpenDebug(executionState, {
    courseId: courseId,
    assignmentId: course.assignmentId || "",
    moduleCount: modules.length,
    playableModuleCount: validation.playableModuleCount || 0,
    validationResult: validation.validationResult,
    error: ""
  });

  executionState.result = {
    student: executionState.context.studentProfile,
    course: course,
    courses: courses,
    modules: modules,
    openTarget: openTarget,
    hasModules: modules.length > 0,
    hasActivity: hasActivity,
    courseOpenState: null,
    emptyCourseState: null,
    validationResult: validation.validationResult
  };

  return {
    valid: true,
    data: executionState.result
  };
}

function finishCourseOpenValidation(executionState, details) {
  var validation = details.validation || createCourseOpenValidation("unexpectedError", "Something went wrong while loading this course.", "Please try again or contact your teacher.");
  var modules = Array.isArray(details.modules) ? details.modules : [];
  var course = details.course ? attachAssignmentId(details.course, details.assignmentId) : null;

  logCourseOpenDebug(executionState, {
    courseId: details.courseId,
    assignmentId: details.assignmentId || "",
    moduleCount: modules.length,
    playableModuleCount: validation.playableModuleCount || 0,
    validationResult: validation.validationResult || validation.code,
    error: validation.message || validation.title || ""
  });

  executionState.result = {
    student: executionState.context.studentProfile,
    course: course,
    courses: course ? [course] : [],
    modules: modules,
    openTarget: createEmptyCourseTarget(course || { id: details.courseId }),
    hasModules: modules.length > 0,
    hasActivity: false,
    validationResult: validation.validationResult || validation.code,
    courseOpenState: createStudentCourseOpenState(validation),
    emptyCourseState: createStudentCourseOpenState(validation)
  };

  return {
    valid: true,
    data: executionState.result
  };
}

function attachAssignmentId(course, assignmentId) {
  if (!course) {
    return course;
  }

  return Object.assign({}, course, {
    assignmentId: assignmentId || course.assignmentId || "",
    courseAssignmentId: assignmentId || course.courseAssignmentId || course.assignmentId || ""
  });
}

function isPreviewActor(actor) {
  return actor && actor.id === "preview-student";
}

async function selectCourseOpenTarget(executionState, course) {
  var continueState = Object.assign({}, executionState, {
    payload: {
      courses: [course]
    },
    result: null
  });
  var continueResult = await processContinueLearning(continueState);
  var recommendation = continueState.result && continueState.result.continueLearning
    ? continueState.result.continueLearning
    : null;

  if (!continueResult || continueResult.valid === false || !recommendation) {
    return createEmptyCourseTarget(course);
  }

  return {
    courseId: readText(recommendation.courseId || course.id),
    moduleId: readText(recommendation.moduleId),
    sessionId: readText(recommendation.sessionId),
    practiceModeKey: readText(recommendation.practiceModeKey) || "beforeClass",
    learningModeId: readText(recommendation.learningModeId),
    actionLabel: readText(recommendation.actionLabel) || "Start Learning",
    recommendationReason: readText(recommendation.recommendationReason)
  };
}

function hasOpenableActivity(course, openTarget) {
  var module = findModuleById(course, openTarget ? openTarget.moduleId : "");
  var session = findSessionById(module, openTarget ? openTarget.sessionId : "");
  var practiceModeKey = openTarget && openTarget.practiceModeKey ? openTarget.practiceModeKey : "beforeClass";
  var practiceMode = session && session.practiceModes ? session.practiceModes[practiceModeKey] : null;

  return Boolean(practiceMode && Array.isArray(practiceMode.steps) && practiceMode.steps.length > 0);
}

function createStudentCourseOpenState(validation) {
  return {
    type: validation.code || validation.validationResult || "unexpectedError",
    title: validation.title || "Something went wrong while loading this course.",
    message: validation.message || "Please try again or contact your teacher.",
    primaryActionLabel: "Return to Dashboard",
    secondaryActionLabel: "Refresh"
  };
}

function createCourseOpenValidation(code, title, message) {
  return {
    code: code,
    validationResult: code,
    playable: false,
    title: title,
    message: message
  };
}

function logCourseOpenDebug(executionState, details) {
  if (!executionState || !executionState.payload || executionState.payload.debug !== true) {
    return;
  }

  console.log("[course-open-debug]", {
    courseId: details.courseId || "",
    assignmentId: details.assignmentId || "",
    moduleCount: details.moduleCount || 0,
    playableModuleCount: details.playableModuleCount || 0,
    validationResult: details.validationResult || "",
    error: details.error || ""
  });
}

function logCourseOpenTiming(executionState, details) {
  if (!shouldLogCourseOpenTiming(executionState)) {
    return;
  }

  console.info("[student-course:open]", details || {});
}

function shouldLogCourseOpenTiming(executionState) {
  return Boolean(executionState && executionState.payload && executionState.payload.debug === true) || isDevelopmentHost();
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && window.location
    && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "");
}

function findCourseById(courses, courseId) {
  var courseIndex = 0;

  while (courseIndex < courses.length) {
    if (courses[courseIndex] && courses[courseIndex].id === courseId) {
      return courses[courseIndex];
    }

    courseIndex = courseIndex + 1;
  }

  return null;
}

function findModuleById(course, moduleId) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    if (modules[moduleIndex] && modules[moduleIndex].id === moduleId) {
      return modules[moduleIndex];
    }

    moduleIndex = moduleIndex + 1;
  }

  return null;
}

function findSessionById(module, sessionId) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    if (sessions[sessionIndex] && sessions[sessionIndex].id === sessionId) {
      return sessions[sessionIndex];
    }

    sessionIndex = sessionIndex + 1;
  }

  return null;
}

function createEmptyCourseTarget(course) {
  return {
    courseId: readText(course ? course.id : ""),
    moduleId: "",
    sessionId: "",
    practiceModeKey: "beforeClass",
    learningModeId: "",
    actionLabel: "Start Learning",
    recommendationReason: "emptyCourse"
  };
}

function createModuleOnlyTarget(course, module) {
  return {
    courseId: readText(course ? course.id : ""),
    moduleId: readText(module ? module.id : ""),
    sessionId: "",
    practiceModeKey: "beforeClass",
    learningModeId: "",
    actionLabel: "Start Learning",
    recommendationReason: "firstModule"
  };
}

function readText(value) {
  return typeof value === "string" ? value : "";
}

function waitForStudentCourseOpenRead(promise, label) {
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
