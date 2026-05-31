export async function processContinueLearning(executionState) {
  var payload = executionState.payload || {};
  var courses = Array.isArray(payload.courses) ? payload.courses : [];
  var recommendation = findInProgressCourse(courses) || findFirstCourse(courses) || createEmptyRecommendation();

  executionState.result = {
    continueLearning: recommendation
  };

  return {
    valid: true,
    data: executionState.result
  };
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
    courseTitle: readText(course.courseTitle || course.title),
    moduleTitle: readText(course.moduleTitle),
    progressPercent: readNumber(course.progressPercent),
    actionLabel: actionLabel,
    lastOpenedAt: readNumber(course.lastOpenedAt)
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

function readNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return 0;
}
