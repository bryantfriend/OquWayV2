import { callGetStudentsForClassFunction } from "./studentLoginHelpers.js?v=1.1.93-student-class-alias";

export async function processLoadStudentsForClass(executionState) {
  var payload = executionState.payload;

  try {
    var data = await callGetStudentsForClassFunction({
      locationId: payload.locationId,
      classId: payload.classId,
      className: payload.className,
      debug: isDevelopmentHost()
    });
    var students = normalizeStudentsResponse(data);

    logLoadStudentsDebug({
      selectedLocationId: payload.locationId,
      selectedClassId: payload.classId,
      selectedClassName: payload.className,
      queryCollection: data && data.debug ? data.debug.queryCollection : "users",
      rawResultCount: data && data.debug ? data.debug.rawResultCount : students.length,
      filteredResultCount: data && data.debug ? data.debug.filteredResultCount : students.length,
      filteredReasons: data && data.debug ? data.debug.filteredReasons : {}
    });

    executionState.result = {
      students: students
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

function logLoadStudentsDebug(details) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.info("[student-list-debug]", {
    selectedLocationId: details.selectedLocationId,
    selectedClassId: details.selectedClassId,
    selectedClassName: details.selectedClassName,
    queryCollection: details.queryCollection,
    rawResultCount: details.rawResultCount,
    filteredResultCount: details.filteredResultCount,
    filteredReasons: details.filteredReasons
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

function normalizeStudentsResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.students)) {
    return data.students;
  }

  return [];
}
