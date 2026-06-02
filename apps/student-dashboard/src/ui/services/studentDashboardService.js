import { auth } from "../../../../../packages/core/src/infrastructure/firebase/auth.js?v=1.1.31-student-open-context";
import { getIntentDefinition } from "../../../../../packages/core/src/icf/engine/intentRegistry.js?v=1.1.31-student-open-context";
import { runIntentPipeline } from "../../../../../packages/core/src/icf/engine/runIntentPipeline.js?v=1.1.31-student-open-context";
import { studentDashboardStore } from "../state/studentDashboardState.js?v=1.1.31-student-open-context";

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
      var result = await runStudentIntent("LoadStudentProfileIntent", {});

      if (result && result.emitted && result.emitted.success) {
        var profile = result.emitted.data.student;
        logStartupProfileResult(true, profile);

        if (isValidStudentProfile(profile)) {
          return profile;
        }

        logStartupProfileRejection(profile, readStudentProfileRejectReason(profile));
        return null;
      }

      logStartupProfileResult(false, null);
      throw new Error(readIntentErrorMessage(result));
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

      var result = await runStudentIntent("LoadStudentDashboardIntent", {});

      if (result && result.emitted && result.emitted.success) {
        var courses = result.emitted.data.courses || [];
        studentDashboardStore.setState({
          isLoading: false,
          student: result.emitted.data.student,
          courses: courses,
          continueLearning: result.emitted.data.continueLearning || null,
          dailyBonus: result.emitted.data.dailyBonus || null,
          intentionPoints: result.emitted.data.intentionPoints || createEmptyIntentionPoints(),
          progressSummary: result.emitted.data.progressSummary || null,
          selectedCourseId: readFirstCourseId(courses),
          actorIsPreview: auth.currentUser ? false : true
        });
        return result.emitted.data;
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        isLoading: false,
        error: error.message,
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
        return result.emitted.data.continueLearning;
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
      studentId: auth.currentUser && auth.currentUser.uid ? auth.currentUser.uid : "preview-student",
      courseId: courseId
    });

    try {
      var result = await runStudentIntent("StudentOpenCourseIntent", {
        studentId: auth.currentUser && auth.currentUser.uid ? auth.currentUser.uid : "preview-student",
        courseId: courseId
      });

      if (result && result.emitted && result.emitted.success) {
        console.info("[student-course:open-result]", {
          courseId: courseId,
          hasCourse: Boolean(result.emitted.data.course),
          moduleCount: result.emitted.data.modules ? result.emitted.data.modules.length : 0,
          hasActivity: result.emitted.data.hasActivity === true,
          openTarget: result.emitted.data.openTarget || null
        });
        return result.emitted.data;
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        isCourseOpening: false,
        error: error.message,
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
        studentDashboardStore.setState({
          dailyBonus: result.emitted.data.dailyBonus,
          statusMessage: "Daily bonus claimed."
        });
        return result.emitted.data.dailyBonus;
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
        return result.emitted.data;
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
        return result.emitted.data;
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
        return result.emitted.data;
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
      var result = await runStudentIntent("SubmitExternalTaskIntent", payload || {});

      if (result && result.emitted && result.emitted.success) {
        studentDashboardStore.setState({
          isSavingProgress: false,
          statusMessage: "Submitted for teacher review."
        });
        return result.emitted.data;
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
      var result = await runStudentIntent("LoadExternalTaskStepIntent", payload || {});

      if (result && result.emitted && result.emitted.success) {
        return result.emitted.data;
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

function getActor() {
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
  return readStudentProfileRejectReason(profile) === "";
}

function readStudentProfileRejectReason(profile) {
  if (!profile) {
    return "profile-missing";
  }

  if (!isStudentRole(profile)) {
    return "not-student-role";
  }

  if (!isActiveStudentStatus(profile)) {
    return "inactive-status";
  }

  if (!hasStudentClass(profile)) {
    return "missing-class";
  }

  if (!hasStudentLocation(profile)) {
    return "missing-location";
  }

  return "";
}

function isStudentRole(profile) {
  var roles = [];

  if (profile && Array.isArray(profile.roles)) {
    roles = roles.concat(profile.roles);
  }

  if (profile && profile.role) {
    roles.push(profile.role);
  }

  return roles.some(function (role) {
    var normalizedRole = readText(role).replace(/[^a-z0-9]/gi, "").toLowerCase();
    return normalizedRole === "student" || normalizedRole === "rolestudent";
  });
}

function isActiveStudentStatus(profile) {
  if (profile.status === "active") {
    return true;
  }

  if (profile.status === "approved") {
    return true;
  }

  if (profile.isActive === true) {
    return true;
  }

  if (!profile.status) {
    return true;
  }

  return false;
}

function hasStudentClass(profile) {
  return Boolean(profile.classId || (Array.isArray(profile.classIds) && profile.classIds.length > 0));
}

function hasStudentLocation(profile) {
  return Boolean(profile.locationId || profile.primaryLocationId || profile.schoolId || (Array.isArray(profile.locationIds) && profile.locationIds.length > 0));
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

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
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
