import { browserLocalPersistence, setPersistence, signInWithCustomToken } from "firebase/auth";
import { auth } from "../../../../../infrastructure/firebase/auth.js?v=1.1.107-student-firebase-auth-chain";
import { callStudentLoginFunction, sanitizeProfile } from "./studentLoginHelpers.js?v=1.1.107-student-firebase-auth-chain";

export async function processStudentFruitLogin(executionState) {
  var payload = executionState.payload;

  try {
    logFruitLoginDebug("submit", {
      studentId: payload.studentId,
      locationId: payload.locationId,
      classId: payload.classId,
      className: payload.className,
      submittedNormalizedSequence: payload.fruits
    });

    var data = await callStudentLoginFunction({
      action: "login",
      locationId: payload.locationId,
      classId: payload.classId,
      className: payload.className,
      studentId: payload.studentId,
      fruits: payload.fruits,
      fruitPassword: payload.fruits
    });
    var token = data.customToken || data.token;

    if (!token) {
      throw new Error("Student login service did not return a custom token.");
    }

    await setPersistence(auth, browserLocalPersistence);
    var credential = await signInWithCustomToken(auth, token);
    await credential.user.getIdToken(true);
    logFruitLoginDebug("signed-in", {
      studentId: payload.studentId,
      locationId: payload.locationId,
      classId: payload.classId,
      className: payload.className,
      authUid: auth.currentUser && auth.currentUser.uid ? auth.currentUser.uid : "",
      submittedNormalizedSequence: []
    });
    var studentProfile = Object.assign({ id: payload.studentId }, data.student || {});

    executionState.result = {
      student: sanitizeProfile(studentProfile),
      loginMethod: "fruit"
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "FRUIT_LOGIN_FAILED",
          message: error.message
        }
      ]
    };
  }
}

function logFruitLoginDebug(eventName, details) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.info("[fruit-login-debug]", eventName, {
    studentId: details.studentId,
    locationId: details.locationId,
    classId: details.classId,
    className: details.className,
    authUid: details.authUid,
    submittedNormalizedSequence: details.submittedNormalizedSequence
  });
}

function isDevelopmentHost() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
    || window.location.hostname === "";
}
