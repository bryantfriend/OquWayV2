import { getIdTokenResult, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.109-student-assignment-status-fallback";
import { getIntentDefinition, runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.109-student-assignment-status-fallback";

var currentTeacherClaims = {};

export const teacherDashboardService = {
  onAuthStateChanged: function (callback) {
    return onAuthStateChanged(auth, callback);
  },

  login: async function (email, password) {
    var result = await runTeacherIntent("TeacherLoginIntent", {
      email: email,
      password: password
    }, {
      id: "teacher-login",
      role: "ROLE_GUEST"
    });

    await refreshCurrentTeacherClaims(true);
    return readIntentData(result);
  },

  sendPasswordReset: async function (email) {
    var result = await runTeacherIntent("SendTeacherPasswordResetIntent", {
      email: email
    }, {
      id: "teacher-password-reset",
      role: "ROLE_GUEST"
    });

    return readIntentData(result);
  },

  loadDashboard: async function (filters) {
    await refreshCurrentTeacherClaims(false);
    var result = await runTeacherIntent("LoadTeacherDashboardIntent", filters || {}, getCurrentTeacherActor());
    return readIntentData(result);
  },

  loadReviewQueue: async function (filters) {
    await refreshCurrentTeacherClaims(false);
    var result = await runTeacherIntent("LoadTeacherReviewQueueIntent", filters || {}, getCurrentTeacherActor());
    return readIntentData(result);
  },

  loadCourses: async function (filters) {
    await refreshCurrentTeacherClaims(false);
    var result = await runTeacherIntent("LoadTeacherCoursesIntent", filters || {}, getCurrentTeacherActor());
    return readIntentData(result);
  },

  loadClassDetail: async function (classId) {
    await refreshCurrentTeacherClaims(false);
    var result = await runTeacherIntent("LoadTeacherClassDetailIntent", {
      classId: classId
    }, getCurrentTeacherActor());
    return readIntentData(result);
  },

  loadCourseDetail: async function (assignmentId, courseId) {
    await refreshCurrentTeacherClaims(false);
    var result = await runTeacherIntent("LoadTeacherCourseDetailIntent", {
      assignmentId: assignmentId,
      courseId: courseId || ""
    }, getCurrentTeacherActor());
    return readIntentData(result);
  },

  reviewSubmission: async function (submissionId, reviewStatus, teacherFeedback) {
    await refreshCurrentTeacherClaims(false);
    var result = await runTeacherIntent("ReviewExternalTaskSubmissionIntent", {
      submissionId: submissionId,
      reviewStatus: reviewStatus,
      teacherFeedback: teacherFeedback || ""
    }, getCurrentTeacherActor());

    return readIntentData(result);
  },

  logout: async function () {
    await signOut(auth);
  },

  getCurrentUser: function () {
    return auth.currentUser;
  }
};

async function runTeacherIntent(intentType, payload, actor) {
  console.info("[teacher-intent:run]", {
    intentType: intentType,
    teacherId: actor && actor.id ? actor.id : "",
    payloadKeys: Object.keys(payload || {})
  });

  return runIntentPipeline(getIntentDefinition(intentType), {
    payload: payload || {},
    actor: actor || getCurrentTeacherActor(),
    meta: {
      createdAt: Date.now(),
      source: "teacher-dashboard"
    }
  });
}

function getCurrentTeacherActor() {
  var user = auth.currentUser;

  if (!user) {
    return {
      id: "",
      role: "ROLE_GUEST",
      claims: {}
    };
  }

  return {
    id: user.uid,
    authUid: user.uid,
    role: "ROLE_AUTHENTICATED",
    claims: currentTeacherClaims || {}
  };
}

async function refreshCurrentTeacherClaims(forceRefresh) {
  var user = auth.currentUser;

  if (!user) {
    currentTeacherClaims = {};
    return currentTeacherClaims;
  }

  if (forceRefresh && user.getIdToken) {
    await user.getIdToken(true);
  }

  try {
    var tokenResult = await getIdTokenResult(user, forceRefresh === true);
    currentTeacherClaims = tokenResult && tokenResult.claims ? tokenResult.claims : {};
  } catch (error) {
    currentTeacherClaims = {};
  }

  return currentTeacherClaims;
}

function readIntentData(result) {
  if (result && result.emitted && result.emitted.success) {
    return result.emitted.data || {};
  }

  throw new Error(readIntentErrorMessage(result));
}

function readIntentErrorMessage(result) {
  if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
    return readFirstErrorText(result.emitted.errors[0]);
  }

  if (result && result.errors && result.errors.length > 0) {
    return readFirstErrorText(result.errors[0]);
  }

  return "Unknown ICF error";
}

function readFirstErrorText(error) {
  if (!error) {
    return "Unknown ICF error";
  }

  return error.message || error.code || String(error);
}


