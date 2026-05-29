import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { isActiveStudentStatus, sanitizeProfile } from "./studentLoginHelpers.js";

export async function processLoadStudentProfile(executionState) {
  var actor = executionState.actor;

  try {
    if (!actor || !actor.id) {
      throw new Error("A signed-in student is required.");
    }

    var userSnap = await getDoc(doc(db, "users", actor.id));

    if (!userSnap.exists()) {
      throw new Error("Student profile was not found.");
    }

    var profile = Object.assign({ id: userSnap.id }, userSnap.data());

    if (profile.role !== "student" && profile.role !== "ROLE_STUDENT") {
      throw new Error("This account is not a student account.");
    }

    if (!isActiveStudentStatus(profile.status)) {
      throw new Error("This student account is not active.");
    }

    if (!profile.classId) {
      throw new Error("This student profile is missing a class.");
    }

    if (!profile.locationId) {
      throw new Error("This student profile is missing a location.");
    }

    executionState.result = {
      student: sanitizeProfile(profile)
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_PROFILE_LOAD_FAILED",
          message: error.message
        }
      ]
    };
  }
}
