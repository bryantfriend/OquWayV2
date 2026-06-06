import { getStudentProfileByAuthUid, readAssignedCourseIds } from "../../../../../../../domain/users/index.js?v=1.1.101-student-profile-fallback";

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
    var profile = await loadStudentProfile(actor);

    if (!profile && actor.studentProfile) {
      profile = actor.studentProfile;
    }

    if (!profile) {
      return {
        valid: true,
        data: {
          studentProfile: null,
          assignedCourseIds: []
        }
      };
    }

    var mergedProfile = mergeActorStudentContext(profile, actor);

    return {
      valid: true,
      data: {
        studentProfile: mergedProfile,
        assignedCourseIds: readAssignedCourseIds(mergedProfile)
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

async function loadStudentProfile(actor) {
  try {
    var profile = await getStudentProfileByAuthUid(actor.id);

    return profile || actor.studentProfile || null;
  } catch (error) {
    return actor.studentProfile || null;
  }
}

function mergeActorStudentContext(profile, actor) {
  var mergedProfile = Object.assign({}, profile || {});

  if (actor && actor.classId && !mergedProfile.classId) {
    mergedProfile.classId = actor.classId;
  }

  if (actor && actor.className && !mergedProfile.className) {
    mergedProfile.className = actor.className;
  }

  if (actor && actor.locationId && !mergedProfile.locationId) {
    mergedProfile.locationId = actor.locationId;
  }

  return mergedProfile;
}
