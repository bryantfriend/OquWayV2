import { getStudentProfileByAuthUid, readAssignedCourseIds } from "../../../../../../../domain/users/index.js";

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
    var profile = await getStudentProfileByAuthUid(actor.id);

    if (!profile) {
      return {
        valid: true,
        data: {
          studentProfile: null,
          assignedCourseIds: []
        }
      };
    }

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
