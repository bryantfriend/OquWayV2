export async function processContinueLearning(executionState) {
  var payload = executionState.payload || {};
  var courses = Array.isArray(payload.courses) ? payload.courses : [];
  var recommendation = selectLearningPath(courses) || findInProgressCourse(courses) || findFirstCourse(courses) || createEmptyRecommendation();

  executionState.result = {
    continueLearning: recommendation
  };

  return {
    valid: true,
    data: executionState.result
  };
}

function selectLearningPath(courses) {
  var courseIndex = 0;

  while (courseIndex < courses.length) {
    var recommendation = selectCourseLearningPath(courses[courseIndex]);
    if (recommendation) {
      return recommendation;
    }
    courseIndex = courseIndex + 1;
  }

  return null;
}

function selectCourseLearningPath(course) {
  var modules = Array.isArray(course && course.modules) ? course.modules : [];
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    var module = modules[moduleIndex];
    var primary = findModeSession(module, "primary");
    var review = findModeSession(module, "review");
    var practice = findModeSession(module, "practice");
    var assessment = findModeSession(module, "assessment");
    var selected = null;
    var reason = "primary";

    if (primary && !isSessionComplete(primary)) {
      selected = primary;
      reason = "primaryIncomplete";
    } else if (review && !isSessionComplete(review)) {
      selected = review;
      reason = "reviewRecommended";
    } else if (practice && shouldRecommendPractice(module, primary)) {
      selected = practice;
      reason = "practiceRecommended";
    } else if (assessment && !isSessionComplete(assessment)) {
      selected = assessment;
      reason = "assessmentRecommended";
    } else if (primary) {
      selected = primary;
      reason = "fallbackPrimary";
    }

    if (selected) {
      return normalizeRecommendation({
        id: course.id || course.courseId,
        title: course.title,
        moduleId: module.id || module.moduleId,
        sessionId: selected.id,
        moduleTitle: module.title,
        progressPercent: readSessionProgressPercent(selected),
        lastOpenedAt: readProgressUpdatedAt(selected),
        learningModeId: selected.learningModeId || readModeIdForSession(module, selected.id),
        recommendationReason: reason
      }, readSessionProgressPercent(selected) > 0 ? "Continue Learning" : "Start Learning");
    }

    moduleIndex = moduleIndex + 1;
  }

  return null;
}

function findModeSession(module, modeType) {
  var modes = module && module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var sessions = Array.isArray(module && module.sessions) ? module.sessions : [];
  var modeKeys = Object.keys(modes);
  var keyIndex = 0;

  while (keyIndex < modeKeys.length) {
    var mode = modes[modeKeys[keyIndex]];
    if (mode && mode.modeType === modeType && mode.status !== "deleted") {
      return findSessionById(sessions, mode.legacySessionId) || findSessionByLearningModeId(sessions, mode.id || modeKeys[keyIndex]);
    }
    keyIndex = keyIndex + 1;
  }

  if (modeType === "primary" && sessions.length > 0) {
    return sessions[0];
  }

  return findSessionByType(sessions, modeType);
}

function findSessionById(sessions, sessionId) {
  return sessions.find(function (session) { return session && session.id === sessionId; }) || null;
}

function findSessionByLearningModeId(sessions, modeId) {
  return sessions.find(function (session) { return session && session.learningModeId === modeId; }) || null;
}

function findSessionByType(sessions, modeType) {
  return sessions.find(function (session) { return session && session.learningModeType === modeType; }) || null;
}

function readModeIdForSession(module, sessionId) {
  var modes = module && module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var keys = Object.keys(modes);
  var index = 0;

  while (index < keys.length) {
    if (modes[keys[index]] && modes[keys[index]].legacySessionId === sessionId) {
      return keys[index];
    }
    index = index + 1;
  }

  return "";
}

function isSessionComplete(session) {
  return readSessionProgressPercent(session) >= 100;
}

function shouldRecommendPractice(module, primarySession) {
  if (!primarySession) {
    return false;
  }

  var progress = readSessionProgressPercent(primarySession);
  return progress > 0 && progress < 80;
}

function readSessionProgressPercent(session) {
  var total = countSessionSteps(session);
  var completed = countSessionCompletedSteps(session);
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function countSessionSteps(session) {
  var practiceModes = session && session.practiceModes && typeof session.practiceModes === "object" ? session.practiceModes : {};
  return Object.keys(practiceModes).reduce(function (count, key) {
    var steps = practiceModes[key] && Array.isArray(practiceModes[key].steps) ? practiceModes[key].steps : [];
    return count + steps.length;
  }, 0);
}

function countSessionCompletedSteps(session) {
  var progressModes = session && session.progress && session.progress.practiceModes ? session.progress.practiceModes : {};
  var completed = [];
  Object.keys(progressModes).forEach(function (key) {
    if (Array.isArray(progressModes[key].completedStepIds)) {
      completed = completed.concat(progressModes[key].completedStepIds);
    }
  });
  return completed.filter(function (stepId, index, list) {
    return stepId && list.indexOf(stepId) === index;
  }).length;
}

function readProgressUpdatedAt(session) {
  var value = session && session.progress ? session.progress.updatedAt : null;
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value.seconds) return value.seconds * 1000;
  return 0;
}

function findInProgressCourse(courses) {
  var bestCourse = null;
  var courseIndex = 0;

  while (courseIndex < courses.length) {
    var course = courses[courseIndex];
    var progressPercent = readNumber(course.progressPercent);

    if (progressPercent > 0 && progressPercent < 100 && (!bestCourse || readNumber(course.lastOpenedAt) > readNumber(bestCourse.lastOpenedAt))) {
      bestCourse = course;
    }

    courseIndex = courseIndex + 1;
  }

  return bestCourse ? normalizeRecommendation(bestCourse, "Continue") : null;
}

function findFirstCourse(courses) {
  if (courses.length === 0) {
    return null;
  }

  return normalizeRecommendation(courses[0], readNumber(courses[0].progressPercent) > 0 ? "Continue" : "Start Learning");
}

function normalizeRecommendation(course, actionLabel) {
  return {
    courseId: readText(course.courseId || course.id),
    moduleId: readText(course.moduleId),
    sessionId: readText(course.sessionId),
    courseTitle: readTitle(course.courseTitle || course.title, ""),
    moduleTitle: readTitle(course.moduleTitle, ""),
    progressPercent: readNumber(course.progressPercent),
    actionLabel: actionLabel,
    lastOpenedAt: readNumber(course.lastOpenedAt),
    learningModeId: readText(course.learningModeId),
    recommendationReason: readText(course.recommendationReason)
  };
}

function createEmptyRecommendation() {
  return {
    courseId: "",
    moduleId: "",
    sessionId: "",
    courseTitle: "",
    moduleTitle: "",
    progressPercent: 0,
    actionLabel: "Start Learning",
    lastOpenedAt: 0
  };
}

function readText(value) {
  return typeof value === "string" ? value : "";
}

function readTitle(value, fallback) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && typeof value.en === "string") {
    return value.en;
  }

  return fallback;
}

function readNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return 0;
}
