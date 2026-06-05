export function createEmptyProgressSummary() {
  return {
    completedStepCount: 0,
    totalStepCount: 0,
    completedModuleCount: 0,
    totalModuleCount: 0
  };
}

export function createDefaultProgressDocument(courseId, moduleId, sessionId) {
  return {
    courseId: courseId,
    moduleId: moduleId,
    sessionId: sessionId,
    practiceModes: {},
    updatedAt: null
  };
}

export function isStepComplete(progress, stepId) {
  var completedStepIds = progress && Array.isArray(progress.completedStepIds) ? progress.completedStepIds : [];
  return completedStepIds.indexOf(stepId) !== -1;
}

export function isExternalTaskReviewComplete(submission) {
  return Boolean(submission && submission.reviewStatus === "complete");
}

export function calculateCourseCompletion(course) {
  var total = countCourseSteps(course);
  var completed = countCourseCompletedSteps(course);

  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

export function calculateCourseProgressSummary(courses) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var totalCourses = safeCourses.length;
  var completedCourses = 0;
  var inProgressCourses = 0;
  var overallProgress = 0;
  var courseIndex = 0;

  while (courseIndex < safeCourses.length) {
    var progressPercent = calculateCourseCompletion(safeCourses[courseIndex]);
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

export function getCourseProgress(studentId, courseId) {
  return {
    studentId: studentId || "",
    courseId: courseId || "",
    progressPercent: 0
  };
}

export function getModuleProgress(studentId, moduleId) {
  return {
    studentId: studentId || "",
    moduleId: moduleId || "",
    progressPercent: 0
  };
}

export function countCourseSteps(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var total = 0;
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    total = total + countModuleSteps(modules[moduleIndex]);
    moduleIndex = moduleIndex + 1;
  }

  return total;
}

export function countCourseCompletedSteps(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var total = 0;
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    total = total + countModuleCompletedSteps(modules[moduleIndex]);
    moduleIndex = moduleIndex + 1;
  }

  return total;
}

export function countModuleSteps(module) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var total = 0;
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    total = total + countSessionSteps(sessions[sessionIndex]);
    sessionIndex = sessionIndex + 1;
  }

  return total;
}

export function countModuleCompletedSteps(module) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var total = 0;
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    total = total + countSessionCompletedSteps(sessions[sessionIndex]);
    sessionIndex = sessionIndex + 1;
  }

  return total;
}

export function countSessionSteps(session) {
  var practiceModes = session && session.practiceModes && typeof session.practiceModes === "object" ? session.practiceModes : {};
  var keys = Object.keys(practiceModes);
  var total = 0;
  var keyIndex = 0;

  while (keyIndex < keys.length) {
    total = total + (Array.isArray(practiceModes[keys[keyIndex]].steps) ? practiceModes[keys[keyIndex]].steps.length : 0);
    keyIndex = keyIndex + 1;
  }

  return total;
}

export function countSessionCompletedSteps(session) {
  var practiceModes = session && session.progress && session.progress.practiceModes ? session.progress.practiceModes : {};
  var keys = Object.keys(practiceModes);
  var completedStepIds = [];
  var keyIndex = 0;

  while (keyIndex < keys.length) {
    if (Array.isArray(practiceModes[keys[keyIndex]].completedStepIds)) {
      completedStepIds = completedStepIds.concat(practiceModes[keys[keyIndex]].completedStepIds);
    }
    keyIndex = keyIndex + 1;
  }

  return completedStepIds.filter(function (stepId, index, list) {
    return stepId && list.indexOf(stepId) === index;
  }).length;
}

export function readCourseLastOpenedAt(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var lastOpenedAt = 0;
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    lastOpenedAt = Math.max(lastOpenedAt, readModuleLastOpenedAt(modules[moduleIndex]));
    moduleIndex = moduleIndex + 1;
  }

  return lastOpenedAt;
}

export function readModuleLastOpenedAt(module) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var lastOpenedAt = 0;
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    lastOpenedAt = Math.max(lastOpenedAt, readTimestampMillis(sessions[sessionIndex].progress ? sessions[sessionIndex].progress.updatedAt : null));
    sessionIndex = sessionIndex + 1;
  }

  return lastOpenedAt;
}

export function readTimestampMillis(value) {
  if (!value) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value.seconds) {
    return value.seconds * 1000;
  }

  return 0;
}
