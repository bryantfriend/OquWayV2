import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../../infrastructure/firebase/auth.js?v=1.1.105-student-active-assignment-query";
import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.105-student-active-assignment-query";
import { hasStudentRole, isActiveStudentStatus, sanitizeProfile } from "./studentLoginHelpers.js?v=1.1.105-student-active-assignment-query";

export async function processStudentStandardLogin(executionState) {
  var payload = executionState.payload;

  try {
    if (payload.identifier.indexOf("@") === -1) {
      throw new Error("Username login is reserved for a future username mapping. Please use email for now.");
    }

    var credential = await signInWithEmailAndPassword(auth, payload.identifier, payload.password);
    var userProfile = await loadAndVerifyStudentProfile(credential.user.uid, payload.locationId);

    executionState.result = {
      student: sanitizeProfile(userProfile),
      loginMethod: "standard"
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "STANDARD_LOGIN_FAILED",
          message: friendlyStandardLoginMessage(error)
        }
      ]
    };
  }
}

async function loadAndVerifyStudentProfile(studentId, locationId) {
  var userSnap = await getDoc(doc(db, "users", studentId));

  if (!userSnap.exists()) {
    throw new Error("Student profile was not found.");
  }

  var profile = Object.assign({ id: userSnap.id }, userSnap.data());

  if (!hasStudentRole(profile)) {
    throw new Error("This account is not a student account.");
  }

  if (!isActiveStudentStatus(profile.status)) {
    throw new Error("This student account is not active.");
  }

  if (profile.locationId && profile.locationId !== locationId) {
    throw new Error("This student account belongs to a different location.");
  }

  return profile;
}

function friendlyStandardLoginMessage(error) {
  if (error && error.message) {
    return error.message;
  }

  return "Standard login failed. Check your email and password.";
}
