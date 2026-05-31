import { auth } from "../../../../../packages/core/src/infrastructure/firebase/auth.js";
import { getIntentDefinition } from "../../../../../packages/core/src/icf/engine/intentRegistry.js";
import { runIntentPipeline } from "../../../../../packages/core/src/icf/engine/runIntentPipeline.js";
import { studentDashboardStore } from "../state/studentDashboardState.js";

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

      var result = await runStudentIntent("LoadStudentCoursesIntent", {});

      if (result && result.emitted && result.emitted.success) {
        studentDashboardStore.setState({
          isLoading: false,
          student: result.emitted.data.student,
          courses: result.emitted.data.courses || [],
          selectedCourseId: readFirstCourseId(result.emitted.data.courses || []),
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
