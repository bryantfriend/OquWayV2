import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../../../../infrastructure/firebase/auth.js";
import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { callStudentLoginFunction, sanitizeProfile } from "./studentLoginHelpers.js";

export async function processStudentFruitLogin(executionState) {
  var payload = executionState.payload;

  try {
    logFruitLoginDebug("submit", {
      studentId: payload.studentId,
      locationId: payload.locationId,
      classId: payload.classId,
      submittedNormalizedSequence: payload.fruits
    });

    var data = await callStudentLoginFunction({
      action: "login",
      locationId: payload.locationId,
      classId: payload.classId,
      studentId: payload.studentId,
      fruits: payload.fruits,
      fruitPassword: payload.fruits
    });
    var token = data.customToken || data.token;

    if (!token) {
      throw new Error("Student login service did not return a custom token.");
    }

    await signInWithCustomToken(auth, token);
    var studentProfile = await loadStudentProfile(payload.studentId);

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

async function loadStudentProfile(studentId) {
  var userSnap = await getDoc(doc(db, "users", studentId));

  if (!userSnap.exists()) {
    return { id: studentId };
  }

  return Object.assign({ id: userSnap.id }, userSnap.data());
}

function logFruitLoginDebug(eventName, details) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.info("[fruit-login-debug]", eventName, {
    studentId: details.studentId,
    locationId: details.locationId,
    classId: details.classId,
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
