import { processLoadStudentCourse } from "./processLoadStudentCourse.js?v=1.1.113-student-rules-read";
import { processContinueLearning } from "./processContinueLearning.js?v=1.1.113-student-rules-read";
import { calculateCourseCompletion, calculateCourseProgressSummary } from "../../../../../../../domain/progress/index.js";

export async function processLoadStudentDashboard(executionState) {
  var courseResult = await processLoadStudentCourse(executionState);
  logStudentDashboardDebug("courseResult", courseResult);
  logStudentDashboardDebug("executionState.result", executionState.result);

  if (courseResult && courseResult.valid === false) {
    return courseResult;
  }

  var result = executionState.result || {};
  var student = result.student || executionState.context.studentProfile || null;
  var courses = dedupeCourses(result.courses || []);
  var continueLearning = await selectContinueLearning(executionState, courses);

  executionState.result = Object.assign({}, result, {
    student: student,
    courses: courses,
    continueLearning: continueLearning,
    intentionPoints: readIntentionPoints(student),
    dailyBonus: readDailyBonus(student),
    progressSummary: calculateCourseProgressSummary(courses),
    actorIsPreview: result.actorIsPreview === true
  });

  return {
    valid: true,
    data: executionState.result
  };
}

function logStudentDashboardDebug(label, value) {
  if (!isStudentDashboardDebugEnabled()) {
    return;
  }

  console.log("[student-dashboard-debug] " + label, JSON.stringify(value));
}

function isStudentDashboardDebugEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.search.indexOf("debug=true") !== -1
    || window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
    || window.location.hostname === "";
}

async function selectContinueLearning(executionState, courses) {
  var continueState = Object.assign({}, executionState, {
    payload: { courses: courses },
    result: {}
  });
  var result = await processContinueLearning(continueState);

  if (result && result.valid && continueState.result && continueState.result.continueLearning) {
    return continueState.result.continueLearning;
  }

  return buildContinueLearning(courses);
}

function dedupeCourses(courses) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var seen = [];
  var uniqueCourses = [];
  var courseIndex = 0;

  while (courseIndex < safeCourses.length) {
    var course = safeCourses[courseIndex];
    var courseId = course && course.id ? course.id : "";

    if (courseId && seen.indexOf(courseId) === -1) {
      seen.push(courseId);
      uniqueCourses.push(course);
    }

    courseIndex = courseIndex + 1;
  }

  return uniqueCourses;
}

function buildContinueLearning(courses) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var bestInProgress = null;
  var firstCourse = safeCourses.length > 0 ? safeCourses[0] : null;
  var courseIndex = 0;

  while (courseIndex < safeCourses.length) {
    var candidate = buildCourseRecommendation(safeCourses[courseIndex]);

    if (candidate.status === "inProgress" && (!bestInProgress || candidate.lastOpenedAt > bestInProgress.lastOpenedAt)) {
      bestInProgress = candidate;
    }

    courseIndex = courseIndex + 1;
  }

  if (bestInProgress) {
    return bestInProgress;
  }

  if (firstCourse) {
    return Object.assign(buildCourseRecommendation(firstCourse), {
      title: "Start your first course",
      actionLabel: "Start Learning"
    });
  }

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

function buildCourseRecommendation(course) {
  var modules = Array.isArray(course && course.modules) ? course.modules : [];
  var progressPercent = readCourseProgressPercent(course);
  var firstModule = modules.length > 0 ? modules[0] : null;
  var firstSession = firstModule && Array.isArray(firstModule.sessions) && firstModule.sessions.length > 0 ? firstModule.sessions[0] : null;
  var lastOpenedAt = readCourseLastOpenedAt(course);

  return {
    courseId: course && course.id ? course.id : "",
    moduleId: firstModule && firstModule.id ? firstModule.id : "",
    sessionId: firstSession && firstSession.id ? firstSession.id : "",
    title: progressPercent > 0 ? "Continue Learning" : "Start your first course",
    courseTitle: readLocalizedText(course ? course.title : "", "Untitled Course"),
    moduleTitle: readLocalizedText(firstModule ? firstModule.title : "", "First module"),
    progressPercent: progressPercent,
    status: progressPercent >= 100 ? "completed" : (progressPercent > 0 ? "inProgress" : "notStarted"),
    actionLabel: progressPercent > 0 ? "Continue" : "Start Learning",
    lastOpenedAt: lastOpenedAt
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
    var progressPercent = readCourseProgressPercent(safeCourses[courseIndex]);
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

function readCourseProgressPercent(course) {
  return calculateCourseCompletion(course);
}

function countCourseSteps(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var total = 0;
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    total = total + countModuleSteps(modules[moduleIndex]);
    moduleIndex = moduleIndex + 1;
  }

  return total;
}

function countCourseCompletedSteps(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var total = 0;
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    total = total + countModuleCompletedSteps(modules[moduleIndex]);
    moduleIndex = moduleIndex + 1;
  }

  return total;
}

function countModuleSteps(module) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var total = 0;
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    total = total + countSessionSteps(sessions[sessionIndex]);
    sessionIndex = sessionIndex + 1;
  }

  return total;
}

function countModuleCompletedSteps(module) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var total = 0;
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    total = total + countSessionCompletedSteps(sessions[sessionIndex]);
    sessionIndex = sessionIndex + 1;
  }

  return total;
}

function countSessionSteps(session) {
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

function countSessionCompletedSteps(session) {
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

function readCourseLastOpenedAt(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var lastOpenedAt = 0;
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    lastOpenedAt = Math.max(lastOpenedAt, readModuleLastOpenedAt(modules[moduleIndex]));
    moduleIndex = moduleIndex + 1;
  }

  return lastOpenedAt;
}

function readModuleLastOpenedAt(module) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var lastOpenedAt = 0;
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    lastOpenedAt = Math.max(lastOpenedAt, readTimestampMillis(sessions[sessionIndex].progress ? sessions[sessionIndex].progress.updatedAt : null));
    sessionIndex = sessionIndex + 1;
  }

  return lastOpenedAt;
}

function readTimestampMillis(value) {
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

function readLocalizedText(value, fallbackValue) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (value && typeof value.en === "string" && value.en.length > 0) {
    return value.en;
  }

  return fallbackValue;
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
