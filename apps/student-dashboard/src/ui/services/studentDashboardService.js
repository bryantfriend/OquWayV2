import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.151-student-loading-practice-context";
import { OQUWAY_BUILD_VERSION } from "../../../../../packages/shared/version.js?v=1.1.151-student-loading-practice-context";
import { getIntentDefinition, runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.151-student-loading-practice-context";
import { isStudentDashboardProfile, readStudentProfileRejectReason, readStudentProfileId, resolveFruitLoginStudentIdentity } from "../../../../../packages/domain/users/index.js?v=1.1.151-student-loading-practice-context";
import { studentDashboardStore } from "../state/studentDashboardState.js?v=1.1.151-student-loading-practice-context";

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
        logStudentCourseProfileDebug(profile);

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

      if (!isPreviewMode() && !profile) {
        profile = await this.loadVerifiedStudentProfile();
      }

      if (!isPreviewMode() && !isValidStudentProfile(profile)) {
        redirectToStudentLogin("Please log in with your student account first.");
        return null;
      }

      await ensureAuthenticatedFirestoreToken();

      var result = await runStudentIntent("LoadStudentDashboardIntent", {
        studentProfile: profile
      }, profile);

      if (result && result.emitted && result.emitted.success) {
        var courses = result.emitted.data.courses || [];
        var actorIsPreview = result.emitted.data.actorIsPreview === true;
        logStudentCourseProfileDebug(result.emitted.data.student || profile);
        logLoadedCoursesDebug(courses);
        writeStudentDashboardDebugState(result.emitted.data);
        studentDashboardStore.setState({
          isLoading: false,
          student: result.emitted.data.student,
          courses: courses,
          assignmentDebug: result.emitted.data.assignmentDebug || null,
          continueLearning: result.emitted.data.continueLearning || null,
          dailyBonus: result.emitted.data.dailyBonus || null,
          intentionPoints: result.emitted.data.intentionPoints || createEmptyIntentionPoints(),
          progressSummary: result.emitted.data.progressSummary || null,
          selectedCourseId: readFirstCourseId(courses),
          actorIsPreview: actorIsPreview
        });
        return result.emitted.data;
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      studentDashboardStore.setState({
        isLoading: false,
        error: "Could not load courses.",
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
      studentId: readCurrentDashboardStudentId(),
      courseId: courseId
    });

    try {
      var result = await runStudentIntent("StudentOpenCourseIntent", {
        studentId: readCurrentDashboardStudentId(),
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

  startPracticeMode: async function (courseId, moduleId, sessionId, practiceModeKey, courseRecordSource) {
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
        practiceModeKey: practiceModeKey,
        courseRecordSource: courseRecordSource || ""
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
      var safePayload = payload || {};
      var intentType = safePayload.isResubmission ? "ResubmitExternalTaskIntent" : "SubmitExternalTaskIntent";
      var result = await runStudentIntent(intentType, safePayload);

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
      var result = await runStudentIntent("LoadStudentExternalTaskSubmissionIntent", payload || {});

      if (result && result.emitted && result.emitted.success) {
        return result.emitted.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
};

async function runStudentIntent(intentType, payload, studentProfile) {
  return runIntentPipeline(getIntentDefinition(intentType), {
    payload: payload,
    actor: await getActor(studentProfile),
    meta: {
      createdAt: Date.now(),
      source: "student-dashboard"
    }
  });
}

async function getActor(studentProfile) {
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    return {
      id: "anonymous-user",
      role: "ROLE_GUEST"
    };
  }

  if (auth.currentUser) {
    var sessionContext = readStudentSessionContext();
    var claimContext = await readStudentClaimContext(auth.currentUser);
    var profile = studentProfile || sessionContext.studentProfile;
    var identity = resolveFruitLoginStudentIdentity(auth.currentUser, claimContext, profile);

    logStudentIdentityContract(identity);

    return {
      id: identity.resolvedStudentId || auth.currentUser.uid,
      authUid: auth.currentUser.uid,
      uid: auth.currentUser.uid,
      studentId: identity.resolvedStudentId || auth.currentUser.uid,
      tokenStudentId: identity.tokenStudentId,
      tokenClaims: claimContext,
      role: "ROLE_STUDENT",
      classId: sessionContext.classId || identity.classId,
      className: sessionContext.className || identity.className,
      locationId: sessionContext.locationId || identity.locationId,
      studentProfile: profile
    };
  }

  if (studentProfile) {
    return {
      id: readStudentProfileActorId(studentProfile),
      authUid: studentProfile.authUid || "",
      uid: studentProfile.authUid || studentProfile.uid || "",
      studentId: readStudentProfileId(studentProfile),
      role: "ROLE_STUDENT",
      classId: studentProfile.classId || "",
      className: studentProfile.className || "",
      locationId: studentProfile.locationId || studentProfile.primaryLocationId || "",
      studentProfile: studentProfile
    };
  }

  return {
    id: "preview-student",
    role: "ROLE_STUDENT"
  };
}

function readStudentProfileActorId(studentProfile) {
  if (!studentProfile || typeof studentProfile !== "object") {
    return "preview-student";
  }

  return readStudentProfileId(studentProfile)
    || studentProfile.authUid
    || "preview-student";
}

function isValidStudentProfile(profile) {
  return isStudentDashboardProfile(profile);
}

function isPreviewMode() {
  return window.location.search.indexOf("preview=1") !== -1;
}

function redirectToStudentLogin(message) {
  if (message && window.sessionStorage) {
    window.sessionStorage.setItem("oquwayStudentLoginMessage", message);
  }

  clearStudentSessionMarker();

  window.location.href = "../student-login/index.html?cb=" + encodeURIComponent(OQUWAY_BUILD_VERSION);
}

function clearStudentSessionMarker() {
  if (!window.sessionStorage) {
    return;
  }

  window.sessionStorage.removeItem("oquwayStudentSessionUid");
  window.sessionStorage.removeItem("oquwayStudentSessionStartedAt");
  window.sessionStorage.removeItem("oquwayStudentClassId");
  window.sessionStorage.removeItem("oquwayStudentClassName");
  window.sessionStorage.removeItem("oquwayStudentLocationId");
  window.sessionStorage.removeItem("oquwayStudentProfile");
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

async function readStudentClaimContext(user) {
  try {
    var tokenResult = await user.getIdTokenResult();
    var claims = tokenResult && tokenResult.claims ? tokenResult.claims : {};

    return {
      classId: typeof claims.classId === "string" ? claims.classId : "",
      className: typeof claims.className === "string" ? claims.className : "",
      locationId: typeof claims.locationId === "string" ? claims.locationId : "",
      studentId: typeof claims.studentId === "string" ? claims.studentId : ""
    };
  } catch (error) {
    return {
      classId: "",
      className: "",
      locationId: "",
      studentId: ""
    };
  }
}

function readStudentSessionContext() {
  if (!window.sessionStorage) {
    return {
      classId: "",
      className: "",
      locationId: ""
    };
  }

  return {
    classId: window.sessionStorage.getItem("oquwayStudentClassId") || "",
    className: window.sessionStorage.getItem("oquwayStudentClassName") || "",
    locationId: window.sessionStorage.getItem("oquwayStudentLocationId") || "",
    studentProfile: readStoredStudentProfile()
  };
}

function readStoredStudentProfile() {
  var value = "";

  if (!window.sessionStorage) {
    return null;
  }

  value = window.sessionStorage.getItem("oquwayStudentProfile") || "";

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function logStudentCourseProfileDebug(studentProfile) {
  if (!isStudentCourseDebugEnabled()) {
    return;
  }

  console.log("[student-course-debug] profile", JSON.stringify({
    id: studentProfile && studentProfile.id ? studentProfile.id : "",
    uid: studentProfile && studentProfile.uid ? studentProfile.uid : "",
    authUid: studentProfile && studentProfile.authUid ? studentProfile.authUid : "",
    userId: studentProfile && studentProfile.userId ? studentProfile.userId : "",
    studentId: studentProfile && studentProfile.studentId ? studentProfile.studentId : "",
    classId: studentProfile && studentProfile.classId ? studentProfile.classId : "",
    primaryClassId: studentProfile && studentProfile.primaryClassId ? studentProfile.primaryClassId : "",
    className: studentProfile && studentProfile.className ? studentProfile.className : "",
    locationId: studentProfile && studentProfile.locationId ? studentProfile.locationId : ""
  }));
}

function logLoadedCoursesDebug(courses) {
  if (!isStudentCourseDebugEnabled()) {
    return;
  }

  console.log("[student-course-debug] loaded courses", JSON.stringify((courses || []).map(function (course) {
    return {
      id: course && course.id ? course.id : "",
      title: readLocalizedText(course ? course.title : "", "Untitled Course"),
      assignmentId: course && course.assignmentId ? course.assignmentId : "",
      courseAssignmentId: course && course.courseAssignmentId ? course.courseAssignmentId : ""
    };
  })));
  console.table((courses || []).map(function (course) {
    return {
      id: course && course.id ? course.id : "",
      title: readLocalizedText(course ? course.title : "", "Untitled Course"),
      assignmentId: course && course.assignmentId ? course.assignmentId : "",
      courseAssignmentId: course && course.courseAssignmentId ? course.courseAssignmentId : ""
    };
  }));
}

function logStudentIdentityContract(identity) {
  if (!isStudentCourseDebugEnabled()) {
    return;
  }

  console.log("[student-identity-contract]", JSON.stringify({
    authUid: identity.authUid,
    tokenStudentId: identity.tokenStudentId,
    resolvedStudentId: identity.resolvedStudentId,
    profileId: identity.profileId,
    classId: identity.classId,
    className: identity.className,
    locationId: identity.locationId
  }));
}

function writeStudentDashboardDebugState(data) {
  if (!isStudentCourseDebugEnabled() || typeof window === "undefined") {
    return;
  }

  window.__oquwayStudentDebug = {
    buildVersion: OQUWAY_BUILD_VERSION,
    student: data && data.student ? {
      id: data.student.id || "",
      uid: data.student.uid || "",
      authUid: data.student.authUid || "",
      userId: data.student.userId || "",
      studentId: data.student.studentId || "",
      classId: data.student.classId || "",
      primaryClassId: data.student.primaryClassId || "",
      className: data.student.className || "",
      classIds: Array.isArray(data.student.classIds) ? data.student.classIds.slice() : [],
      locationId: data.student.locationId || ""
    } : null,
    assignmentDebug: data && data.assignmentDebug ? data.assignmentDebug : null,
    courseTitles: (data && Array.isArray(data.courses) ? data.courses : []).map(function (course) {
      return readLocalizedText(course ? course.title : "", "Untitled Course");
    })
  };

  console.log("[student-dashboard-debug] state", JSON.stringify(window.__oquwayStudentDebug));
}

function isDevelopmentHost() {
  return window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
    || window.location.hostname === "";
}

function isStudentCourseDebugEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.search.indexOf("debug=true") !== -1
    || isDevelopmentHost();
}

function readFirstCourseId(courses) {
  if (Array.isArray(courses) && courses.length > 0) {
    return courses[0].id;
  }

  return null;
}

function readCurrentDashboardStudentId() {
  var state = studentDashboardStore.getState();
  var student = state && state.student ? state.student : readStoredStudentProfile();

  return readStudentProfileId(student) || (auth.currentUser && auth.currentUser.uid ? auth.currentUser.uid : "preview-student");
}

function createEmptyIntentionPoints() {
  return {
    cognitive: 0,
    physical: 0,
    creative: 0,
    social: 0
  };
}

async function ensureAuthenticatedFirestoreToken() {
  if (!auth.currentUser || auth.currentUser.isAnonymous || typeof auth.currentUser.getIdToken !== "function") {
    return;
  }

  await auth.currentUser.getIdToken(true);
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
