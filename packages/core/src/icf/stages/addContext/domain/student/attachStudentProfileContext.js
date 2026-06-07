import { getStudentProfileByAuthUid, readAssignedCourseIds, resolveActorStudentId } from "../../../../../../../domain/users/index.js?v=1.1.120-student-course-debug-summary";

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
    var payloadProfile = executionState.payload && executionState.payload.studentProfile ? executionState.payload.studentProfile : null;
    var profile = payloadProfile || actor.studentProfile || null;
    var lookupProfile = await loadStudentProfile(actor);

    if (lookupProfile) {
      profile = mergeStudentProfiles(lookupProfile, profile);
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
    var fallbackProfile = executionState.payload && executionState.payload.studentProfile
      ? executionState.payload.studentProfile
      : actor.studentProfile || null;

    if (fallbackProfile) {
      var fallbackMergedProfile = mergeActorStudentContext(fallbackProfile, actor);

      return {
        valid: true,
        data: {
          studentProfile: fallbackMergedProfile,
          assignedCourseIds: readAssignedCourseIds(fallbackMergedProfile)
        }
      };
    }

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
    return await getStudentProfileByAuthUid(resolveActorStudentId(actor) || actor.id);
  } catch (error) {
    return null;
  }
}

function mergeStudentProfiles(lookupProfile, trustedProfile) {
  if (!trustedProfile) {
    return lookupProfile;
  }

  if (!lookupProfile) {
    return trustedProfile;
  }

  return Object.assign({}, lookupProfile, trustedProfile, {
    name: trustedProfile.name || lookupProfile.name || "",
    displayName: trustedProfile.displayName || lookupProfile.displayName || trustedProfile.name || lookupProfile.name || "",
    classId: trustedProfile.classId || lookupProfile.classId || "",
    className: trustedProfile.className || lookupProfile.className || "",
    locationId: trustedProfile.locationId || lookupProfile.locationId || lookupProfile.primaryLocationId || "",
    roles: Array.isArray(trustedProfile.roles) && trustedProfile.roles.length > 0 ? trustedProfile.roles : lookupProfile.roles,
    linkedProfile: lookupProfile.linkedProfile || trustedProfile.linkedProfile || null
  });
}

function mergeActorStudentContext(profile, actor) {
  var mergedProfile = Object.assign({}, profile || {});

  if (actor && actor.classId && !mergedProfile.classId) {
    mergedProfile.classId = actor.classId;
  }

  if (actor && actor.classId) {
    mergedProfile.classIds = mergeTextLists(mergedProfile.classIds, [actor.classId]);
  }

  if (actor && actor.className && !mergedProfile.className) {
    mergedProfile.className = actor.className;
  }

  if (actor && actor.locationId && !mergedProfile.locationId) {
    mergedProfile.locationId = actor.locationId;
  }

  return mergedProfile;
}

function mergeTextLists(primaryValues, fallbackValues) {
  var result = [];

  appendTextValues(result, primaryValues);
  appendTextValues(result, fallbackValues);

  return result;
}

function appendTextValues(result, values) {
  if (typeof values === "string") {
    appendUniqueText(result, values);
    return;
  }

  if (!Array.isArray(values)) {
    return;
  }

  values.forEach(function (value) {
    appendTextValues(result, value);
  });
}

function appendUniqueText(result, value) {
  if (typeof value !== "string" || value.length === 0) {
    return;
  }

  if (result.indexOf(value) === -1) {
    result.push(value);
  }
}
