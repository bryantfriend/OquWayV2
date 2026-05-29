import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js";

export async function attachStudentProfileContext(executionState) {
  var actor = executionState.actor;

  if (!actor || !actor.id) {
    return {
      valid: true,
      data: {
        studentProfile: null,
        assignedCourseIds: []
      }
    };
  }

  try {
    var userRef = doc(db, "users", actor.id);
    var userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return {
        valid: true,
        data: {
          studentProfile: null,
          assignedCourseIds: []
        }
      };
    }

    var profile = Object.assign({ id: userSnap.id }, userSnap.data());

    return {
      valid: true,
      data: {
        studentProfile: profile,
        assignedCourseIds: readAssignedCourseIds(profile)
      }
    };
  } catch (error) {
    return {
      valid: true,
      data: {
        studentProfile: null,
        assignedCourseIds: []
      }
    };
  }
}

function readAssignedCourseIds(profile) {
  if (!profile || typeof profile !== "object") {
    return [];
  }

  if (Array.isArray(profile.assignedCourseIds)) {
    return filterTextArray(profile.assignedCourseIds);
  }

  if (Array.isArray(profile.courseIds)) {
    return filterTextArray(profile.courseIds);
  }

  if (Array.isArray(profile.courses)) {
    return filterTextArray(profile.courses);
  }

  return [];
}

function filterTextArray(values) {
  var result = [];
  var valueIndex = 0;

  while (valueIndex < values.length) {
    if (typeof values[valueIndex] === "string" && values[valueIndex].length > 0) {
      result.push(values[valueIndex]);
    }

    valueIndex = valueIndex + 1;
  }

  return result;
}
