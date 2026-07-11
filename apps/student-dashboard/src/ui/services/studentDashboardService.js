import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.220-student-dashboard-timeout-helper";
import { getIntentDefinition, runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.220-student-dashboard-timeout-helper";
import { isStudentDashboardProfile, readStudentProfileRejectReason } from "../../../../../packages/domain/users/index.js?v=1.1.220-student-dashboard-timeout-helper";
import { studentDashboardStore } from "../state/studentDashboardState.js?v=1.1.220-student-dashboard-timeout-helper";

export const studentDashboardService = {
  loadVerifiedStudentProfile: async function () {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
      studentDashboardStore.setState({
        isLoading: false,
        error: "Please log in with your student account first.",
        actorIsPreview: false
      });
      return null;
    }

    try {
      var profileResult = await runStudentIntent("LoadStudentProfileIntent", {});
      console.log("[StudentDashboard] profile result", profileResult);

      if (profileResult && profileResult.emitted && profileResult.emitted.success) {
        var profileData = readIntentData(profileResult);
        var profile = profileData.student;
        logStartupProfileResult(true, profile);

        if (isValidStudentProfile(profile)) {
          return profile;
        }

        logStartupProfileRejection(profile, readStudentProfileRejectReason(profile));
        return null;
      }

      logStartupProfileResult(false, null);
      throw new Error(readIntentErrorMessage(profileResult));
    } catch (error) {
      studentDashboardStore.setState({
        isLoading: false,
        error: error.message,
        actorIsPreview: false
      });
      return null;
    }
  },

  loadDashboard: async function (verifiedStudentProfile) {
    studentDashboardStore.setState({
      isLoading: true,
      error: null,
      statusMessage: ""
    });

    try {
      var profile = verifiedStudentProfile;

      if (!isPreviewMode() && !hasConfirmedStudentSession()) {
        redirectToStudentLogin("Please choose your student card and enter your fruit password.");
        return null;
      }

      if (!isPreviewMode() && !profile) {
        profile = await this.loadVerifiedStudentProfile();
      }

      if (!isPreviewMode() && !isValidStudentProfile(profile)) {
        redirectToStudentLogin("Please log in with your student account first.");
        return null;
      }

      var dashboardResult = await runStudentIntentWithTimeout("LoadStudentDashboardIntent", {}, 30000);
      console.log("[StudentDashboard] dashboard result", dashboardResult);
      console.log("[StudentDashboard] dashboard result keys", Object.keys(dashboardResult || {}));

      if (dashboardResult && dashboardResult.emitted && dashboardResult.emitted.success) {
        var dashboardPayload = resolveDashboardPayload(dashboardResult);
        var courses = dashboardPayload.courses;
        console.log("[StudentDashboard] resolved dashboard payload", dashboardPayload);
        console.log("[StudentDashboard] resolved courses", courses);
        console.log("[StudentDashboard] resolved modules", readDashboardModulesForDebug(courses));
        studentDashboardStore.setState({
          isLoading: false,
          student: dashboardPayload.student,
          courses: courses,
          continueLearning: dashboardPayload.continueLearning || null,
          dailyBonus: dashboardPayload.dailyBonus || null,
          intentionPoints: dashboardPayload.intentionPoints || createEmptyIntentionPoints(),
          progressSummary: dashboardPayload.progressSummary || null,
          selectedCourseId: readFirstCourseId(courses),
          actorIsPreview: auth.currentUser ? false : true
        });
        return dashboardPayload;
      }

      throw new Error(readIntentErrorMessage(dashboardResult));
    } catch (error) {
      console.warn("[StudentDashboard] dashboard hydration failed", {
        message: error.message
      });
      studentDashboardStore.setState({
        isLoading: false,
        error: error && error.message === "MALFORMED_STUDENT_DASHBOARD_PAYLOAD"
          ? "We loaded your profile, but could not prepare your dashboard."
          : readDashboardLoadErrorMessage(error),
        statusMessage: "",
        actorIsPreview: auth.currentUser ? false : true
      });
      return null;
    }
  },

  continueLearning: async function (courses) {
    try {
      var result = await runStudentIntent("ContinueLearningIntent", {
        courses: courses || []
      });

      if (result && result.emitted && result.emitted.success) {
        return readIntentData(result).continueLearning;
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        error: error.message
      });
      return null;
    }
  },

  openCourse: async function (courseId) {
    studentDashboardStore.setState({
      isCourseOpening: true,
      error: null,
      statusMessage: "Opening your course..."
    });

    console.info("[student-course-card:click]", {
      studentId: readStudentActorId(),
      courseId: courseId
    });

    try {
      var result = await runStudentIntent("StudentOpenCourseIntent", {
        studentId: readStudentActorId(),
        courseId: courseId
      });

      if (result && result.emitted && result.emitted.success) {
        var openCourseData = readIntentData(result);
        console.info("[student-course:open-result]", {
          courseId: courseId,
          hasCourse: Boolean(openCourseData.course),
          moduleCount: openCourseData.modules ? openCourseData.modules.length : 0,
          hasActivity: openCourseData.hasActivity === true,
          openTarget: openCourseData.openTarget || null
        });
        return openCourseData;
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        isCourseOpening: false,
        error: "Could not load this course.",
        statusMessage: ""
      });
      return null;
    }
  },

  claimDailyBonus: async function () {
    studentDashboardStore.setState({
      statusMessage: "Claiming daily bonus...",
      error: null
    });

    try {
      var result = await runStudentIntent("ClaimDailyBonusIntent", {});

      if (result && result.emitted && result.emitted.success) {
        var bonusData = readIntentData(result);
        studentDashboardStore.setState({
          dailyBonus: bonusData.dailyBonus,
          statusMessage: "Daily bonus claimed."
        });
        return bonusData.dailyBonus;
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        error: error.message,
        statusMessage: ""
      });
      return null;
    }
  },

  startPracticeMode: async function (courseId, moduleId, sessionId, practiceModeKey) {
    studentDashboardStore.setState({
      isPlayerLoading: true,
      error: null,
      statusMessage: ""
    });

    try {
      var result = await runStudentIntent("StartPracticeModeIntent", {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId,
        practiceModeKey: practiceModeKey
      });

      if (result && result.emitted && result.emitted.success) {
        return readIntentData(result);
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        isPlayerLoading: false,
        error: error.message
      });
      return null;
    }
  },

  completeStep: async function (courseId, moduleId, sessionId, practiceModeKey, stepId, completionResult) {
    studentDashboardStore.setState({
      isSavingProgress: true,
      error: null,
      statusMessage: "Saving progress..."
    });

    try {
      var result = await runStudentIntent("CompleteStudentStepIntent", {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId,
        practiceModeKey: practiceModeKey,
        stepId: stepId,
        completionResult: completionResult
      });

      if (result && result.emitted && result.emitted.success) {
        return readIntentData(result);
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        isSavingProgress: false,
        error: error.message,
        statusMessage: ""
      });
      return null;
    }
  },

  completePracticeMode: async function (courseId, moduleId, sessionId, practiceModeKey) {
    studentDashboardStore.setState({
      isSavingProgress: true,
      error: null,
      statusMessage: "Completing practice mode..."
    });

    try {
      var result = await runStudentIntent("CompleteStudentPracticeModeIntent", {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId,
        practiceModeKey: practiceModeKey
      });

      if (result && result.emitted && result.emitted.success) {
        return readIntentData(result);
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        isSavingProgress: false,
        error: error.message,
        statusMessage: ""
      });
      return null;
    }
  },

  submitExternalTask: async function (payload) {
    studentDashboardStore.setState({
      isSavingProgress: true,
      error: null,
      statusMessage: "Submitting external task..."
    });

    try {
      var safePayload = payload || {};
      var intentType = safePayload.isResubmission ? "ResubmitExternalTaskIntent" : "SubmitExternalTaskIntent";
      var result = await runStudentIntent(intentType, safePayload);

      if (result && result.emitted && result.emitted.success) {
        studentDashboardStore.setState({
          isSavingProgress: false,
          statusMessage: "Submitted for teacher review."
        });
        return readIntentData(result);
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        isSavingProgress: false,
        error: error.message,
        statusMessage: ""
      });
      throw error;
    }
  },

  loadExternalTaskStep: async function (payload) {
    try {
      var result = await runStudentIntent("LoadStudentExternalTaskSubmissionIntent", payload || {});

      if (result && result.emitted && result.emitted.success) {
        return readIntentData(result);
      }

      return null;
    } catch (error) {
      return null;
    }
  }
};

async function runStudentIntent(intentType, payload) {
  return runIntentPipeline(getIntentDefinition(intentType), {
    payload: payload,
    actor: getActor(),
    meta: {
      createdAt: Date.now(),
      source: "student-dashboard"
    }
  });
}

async function runStudentIntentWithTimeout(intentType, payload, timeoutMs) {
  var safeTimeoutMs = typeof timeoutMs === "number" && timeoutMs > 0 ? timeoutMs : 30000;
  var timeoutId = null;
  var timeoutPromise = new Promise(function (_resolve, reject) {
    timeoutId = window.setTimeout(function () {
      var timeoutError = new Error("STUDENT_DASHBOARD_LOAD_TIMEOUT");
      timeoutError.intentType = intentType;
      reject(timeoutError);
    }, safeTimeoutMs);
  });

  try {
    return await Promise.race([
      runStudentIntent(intentType, payload),
      timeoutPromise
    ]);
  } finally {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
}

function readStudentActorId() {
  if (isPreviewMode()) {
    return "preview-student";
  }

  return auth.currentUser && auth.currentUser.uid ? auth.currentUser.uid : "preview-student";
}
function getActor() {
  if (isPreviewMode()) {
    return {
      id: "preview-student",
      role: "ROLE_STUDENT"
    };
  }

  if (auth.currentUser && auth.currentUser.isAnonymous) {
    return {
      id: "anonymous-user",
      role: "ROLE_GUEST"
    };
  }

  if (auth.currentUser) {
    return {
      id: auth.currentUser.uid,
      role: "ROLE_STUDENT"
    };
  }

  return {
    id: "preview-student",
    role: "ROLE_STUDENT"
  };
}

function isValidStudentProfile(profile) {
  return isStudentDashboardProfile(profile);
}

function hasConfirmedStudentSession() {
  if (!window.sessionStorage || !auth.currentUser || !auth.currentUser.uid) {
    return false;
  }

  return window.sessionStorage.getItem("oquwayStudentSessionUid") === auth.currentUser.uid;
}

function isPreviewMode() {
  return window.location.search.indexOf("preview=1") !== -1;
}

function redirectToStudentLogin(message) {
  if (message && window.sessionStorage) {
    window.sessionStorage.setItem("oquwayStudentLoginMessage", message);
  }

  clearStudentSessionMarker();

  window.location.href = "../student-login/index.html";
}

function clearStudentSessionMarker() {
  if (!window.sessionStorage) {
    return;
  }

  window.sessionStorage.removeItem("oquwayStudentSessionUid");
  window.sessionStorage.removeItem("oquwayStudentSessionStartedAt");
}

function logStartupProfileResult(success, profile) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.log("[Startup] profile result", {
    success: success,
    authUid: auth.currentUser && auth.currentUser.uid ? auth.currentUser.uid : "",
    profilePathChecked: auth.currentUser && auth.currentUser.uid ? "users/" + auth.currentUser.uid : "",
    profileExists: Boolean(profile),
    role: profile && profile.role ? profile.role : "",
    roles: profile && Array.isArray(profile.roles) ? profile.roles : [],
    status: profile && profile.status ? profile.status : "",
    classId: profile && profile.classId ? profile.classId : "",
    classIds: profile && Array.isArray(profile.classIds) ? profile.classIds : [],
    locationId: profile && profile.locationId ? profile.locationId : "",
    locationIds: profile && Array.isArray(profile.locationIds) ? profile.locationIds : []
  });
}

function logStartupProfileRejection(profile, reasonRejected) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.log("[Startup] profile rejected", {
    authUid: auth.currentUser && auth.currentUser.uid ? auth.currentUser.uid : "",
    profilePathChecked: auth.currentUser && auth.currentUser.uid ? "users/" + auth.currentUser.uid : "",
    profileExists: Boolean(profile),
    role: profile && profile.role ? profile.role : "",
    roles: profile && Array.isArray(profile.roles) ? profile.roles : [],
    status: profile && profile.status ? profile.status : "",
    classId: profile && profile.classId ? profile.classId : "",
    locationId: profile && profile.locationId ? profile.locationId : "",
    reasonRejected: reasonRejected
  });
}

function isDevelopmentHost() {
  return window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
    || window.location.hostname === "";
}

function readFirstCourseId(courses) {
  if (Array.isArray(courses) && courses.length > 0) {
    return courses[0].id;
  }

  return null;
}

function createEmptyIntentionPoints() {
  return {
    cognitive: 0,
    physical: 0,
    creative: 0,
    social: 0
  };
}

function readDashboardModulesForDebug(courses) {
  var modules = [];
  var safeCourses = Array.isArray(courses) ? courses : [];
  var courseIndex = 0;

  while (courseIndex < safeCourses.length) {
    var course = safeCourses[courseIndex];
    var courseModules = course && Array.isArray(course.modules) ? course.modules : [];
    var moduleIndex = 0;

    while (moduleIndex < courseModules.length) {
      modules.push(courseModules[moduleIndex]);
      moduleIndex = moduleIndex + 1;
    }

    courseIndex = courseIndex + 1;
  }

  return modules;
}

function readDashboardLoadErrorMessage(error) {
  if (error && error.message === "STUDENT_DASHBOARD_LOAD_TIMEOUT") {
    return "Could not load courses. Please check your connection and try again.";
  }

  return "Could not load courses.";
}

function readIntentData(result) {
  var data = result && result.emitted ? result.emitted.data : null;

  if (data && typeof data === "object" && data.valid === true && data.data && typeof data.data === "object") {
    return data.data;
  }

  if (data && typeof data === "object" && data.ok === true && data.data && typeof data.data === "object") {
    return data.data;
  }

  return data || {};
}

function resolveDashboardPayload(result) {
  var payload = readIntentData(result);

  if (!isValidDashboardPayload(payload)) {
    console.warn("[StudentDashboard] malformed dashboard payload", {
      hasPayload: Boolean(payload),
      hasStudent: Boolean(payload && payload.student),
      coursesIsArray: Boolean(payload && Array.isArray(payload.courses)),
      keys: payload && typeof payload === "object" ? Object.keys(payload) : []
    });
    throw new Error("MALFORMED_STUDENT_DASHBOARD_PAYLOAD");
  }

  return {
    student: payload.student || null,
    courses: payload.courses,
    continueLearning: payload.continueLearning || null,
    dailyBonus: payload.dailyBonus || null,
    intentionPoints: payload.intentionPoints || createEmptyIntentionPoints(),
    progressSummary: payload.progressSummary || null
  };
}

function isValidDashboardPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }

  if (!Array.isArray(payload.courses)) {
    return false;
  }

  return true;
}
function summarizeCoursesForContinue(courses) {
  var summaries = [];
  var courseIndex = 0;

  while (courseIndex < courses.length) {
    summaries.push(summarizeCourseForContinue(courses[courseIndex]));
    courseIndex = courseIndex + 1;
  }

  return summaries;
}

function summarizeCourseForContinue(course) {
  var firstModule = course && Array.isArray(course.modules) && course.modules.length > 0 ? course.modules[0] : null;
  var firstSession = firstModule && Array.isArray(firstModule.sessions) && firstModule.sessions.length > 0 ? firstModule.sessions[0] : null;

  return {
    courseId: course && course.id ? course.id : "",
    moduleId: firstModule && firstModule.id ? firstModule.id : "",
    sessionId: firstSession && firstSession.id ? firstSession.id : "",
    courseTitle: readLocalizedText(course ? course.title : "", "Untitled Course"),
    moduleTitle: readLocalizedText(firstModule ? firstModule.title : "", "First module"),
    progressPercent: readCourseProgressPercent(course),
    lastOpenedAt: readCourseLastOpenedAt(course)
  };
}

function readCourseProgressPercent(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var total = 0;
  var complete = 0;
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    total = total + countModuleSteps(modules[moduleIndex]);
    complete = complete + countModuleCompletedSteps(modules[moduleIndex]);
    moduleIndex = moduleIndex + 1;
  }

  return total > 0 ? Math.round((complete / total) * 100) : 0;
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
  var completed = [];
  var keyIndex = 0;

  while (keyIndex < keys.length) {
    if (Array.isArray(practiceModes[keys[keyIndex]].completedStepIds)) {
      completed = completed.concat(practiceModes[keys[keyIndex]].completedStepIds);
    }
    keyIndex = keyIndex + 1;
  }

  return completed.filter(function (stepId, index, list) {
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

function readIntentErrorMessage(result) {
  if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
    if (result.emitted.errors[0].message) {
      return result.emitted.errors[0].message;
    }

    if (result.emitted.errors[0].code) {
      return result.emitted.errors[0].code;
    }
  }

  if (result && result.errors && result.errors.length > 0) {
    if (result.errors[0].message) {
      return result.errors[0].message;
    }

    if (result.errors[0].code) {
      return result.errors[0].code;
    }
  }

  return "Unknown ICF error";
}
