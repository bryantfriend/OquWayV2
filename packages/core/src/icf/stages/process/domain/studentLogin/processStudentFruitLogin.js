import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../../../../infrastructure/firebase/auth.js";
import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { callStudentLoginFunction, sanitizeProfile } from "./studentLoginHelpers.js";

export async function processStudentFruitLogin(executionState) {
  var payload = executionState.payload;

  try {
    var data = await callStudentLoginFunction({
      studentId: payload.studentId,
      fruitPassword: payload.fruits
    });

    if (!data.token) {
      throw new Error("Student login service did not return a custom token.");
    }

    await signInWithCustomToken(auth, data.token);
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
