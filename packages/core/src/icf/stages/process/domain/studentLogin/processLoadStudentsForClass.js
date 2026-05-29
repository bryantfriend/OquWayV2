import { callGetStudentsForClassFunction } from "./studentLoginHelpers.js";

export async function processLoadStudentsForClass(executionState) {
  var payload = executionState.payload;

  try {
    var data = await callGetStudentsForClassFunction({
      classId: payload.classId
    });

    executionState.result = {
      students: normalizeStudentsResponse(data)
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "LOGIN_STUDENTS_LOAD_FAILED",
          message: error.message
        }
      ]
    };
  }
}

function normalizeStudentsResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.students)) {
    return data.students;
  }

  return [];
}
