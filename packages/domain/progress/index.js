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

export function isExternalTaskReviewPending(submission) {
  return Boolean(submission && (!submission.reviewStatus || submission.reviewStatus === "pending"));
}

export function isExternalTaskReviewNeedsWork(submission) {
  return Boolean(submission && (submission.reviewStatus === "needsWork" || submission.reviewStatus === "incomplete"));
}

export function readCourseLearningStatus(course) {
  return readLearningStatus(countCourseCompletedSteps(course), countCourseSteps(course), readCourseExternalTaskStatus(course));
}

export function readModuleLearningStatus(module) {
  return readLearningStatus(countModuleCompletedSteps(module), countModuleSteps(module), readModuleExternalTaskStatus(module));
}

export function readSessionLearningStatus(session) {
  return readLearningStatus(countSessionCompletedSteps(session), countSessionSteps(session), readSessionExternalTaskStatus(session));
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
  var practiceModes = session && session.practiceModes && typeof session.practiceModes === "object" ? session.practiceModes : {};
  var progressModes = session && session.progress && session.progress.practiceModes ? session.progress.practiceModes : {};
  var keys = Object.keys(practiceModes);
  var completedCount = 0;
  var keyIndex = 0;

  while (keyIndex < keys.length) {
    completedCount = completedCount + countPracticeModeCompletedSteps(practiceModes[keys[keyIndex]], progressModes[keys[keyIndex]]);
    keyIndex = keyIndex + 1;
  }

  return completedCount;
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

function countPracticeModeCompletedSteps(practiceMode, progress) {
  var steps = practiceMode && Array.isArray(practiceMode.steps) ? practiceMode.steps : [];
  var completedStepIds = progress && Array.isArray(progress.completedStepIds) ? progress.completedStepIds : [];
  var stepIndex = 0;
  var count = 0;

  while (stepIndex < steps.length) {
    if (isStepCompletedForProgress(steps[stepIndex], completedStepIds)) {
      count = count + 1;
    }
    stepIndex = stepIndex + 1;
  }

  return count;
}

function isStepCompletedForProgress(step, completedStepIds) {
  if (isExternalTaskStep(step)) {
    return isExternalTaskReviewComplete(readStepExternalTaskSubmission(step));
  }

  return completedStepIds.indexOf(readStepId(step)) !== -1;
}

function readLearningStatus(completedCount, totalCount, externalStatus) {
  if (externalStatus === "needsWork") {
    return "needsWork";
  }

  if (externalStatus === "pendingReview") {
    return "pendingReview";
  }

  if (totalCount > 0 && completedCount >= totalCount) {
    return "complete";
  }

  if (completedCount > 0) {
    return "inProgress";
  }

  return "notStarted";
}

function readCourseExternalTaskStatus(course) {
  return readNestedExternalTaskStatus(course && Array.isArray(course.modules) ? course.modules : [], readModuleExternalTaskStatus);
}

function readModuleExternalTaskStatus(module) {
  return readNestedExternalTaskStatus(module && Array.isArray(module.sessions) ? module.sessions : [], readSessionExternalTaskStatus);
}

function readSessionExternalTaskStatus(session) {
  var practiceModes = session && session.practiceModes && typeof session.practiceModes === "object" ? session.practiceModes : {};
  var keys = Object.keys(practiceModes);
  var status = "";
  var keyIndex = 0;

  while (keyIndex < keys.length) {
    status = mergeExternalTaskStatus(status, readPracticeModeExternalTaskStatus(practiceModes[keys[keyIndex]]));
    keyIndex = keyIndex + 1;
  }

  return status;
}

function readPracticeModeExternalTaskStatus(practiceMode) {
  var steps = practiceMode && Array.isArray(practiceMode.steps) ? practiceMode.steps : [];
  var status = "";
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    status = mergeExternalTaskStatus(status, readStepExternalTaskStatus(steps[stepIndex]));
    stepIndex = stepIndex + 1;
  }

  return status;
}

function readNestedExternalTaskStatus(records, readStatus) {
  var status = "";
  var index = 0;

  while (index < records.length) {
    status = mergeExternalTaskStatus(status, readStatus(records[index]));
    index = index + 1;
  }

  return status;
}

function readStepExternalTaskStatus(step) {
  var submission = readStepExternalTaskSubmission(step);

  if (!isExternalTaskStep(step) || !submission) {
    return "";
  }

  if (isExternalTaskReviewNeedsWork(submission)) {
    return "needsWork";
  }

  if (isExternalTaskReviewPending(submission)) {
    return "pendingReview";
  }

  return "";
}

function mergeExternalTaskStatus(currentStatus, nextStatus) {
  if (currentStatus === "needsWork" || nextStatus === "needsWork") {
    return "needsWork";
  }

  if (currentStatus === "pendingReview" || nextStatus === "pendingReview") {
    return "pendingReview";
  }

  return "";
}

function isExternalTaskStep(step) {
  var type = step && typeof step.type === "string" ? step.type : "";
  return type === "externalTask" || type === "ExternalTaskStep";
}

function readStepExternalTaskSubmission(step) {
  if (!step || typeof step !== "object") {
    return null;
  }

  return step.latestExternalTaskSubmission || step.externalTaskSubmission || null;
}

function readStepId(step) {
  return step && typeof step.id === "string" ? step.id : "";
}
