import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.29-module-render-fix";

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

  if (Array.isArray(profile.assignedCourses)) {
    return filterCourseIds(profile.assignedCourses);
  }

  if (Array.isArray(profile.courses)) {
    return filterCourseIds(profile.courses);
  }

  return [];
}

function filterCourseIds(values) {
  var result = [];
  var valueIndex = 0;

  while (valueIndex < values.length) {
    var courseId = readCourseId(values[valueIndex]);

    if (courseId && result.indexOf(courseId) === -1) {
      result.push(courseId);
    }

    valueIndex = valueIndex + 1;
  }

  return result;
}

function readCourseId(value) {
  if (!value || typeof value !== "object") {
    return typeof value === "string" ? value : "";
  }

  return typeof value.id === "string" ? value.id
    : typeof value.courseId === "string" ? value.courseId
      : typeof value.refId === "string" ? value.refId
        : "";
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
