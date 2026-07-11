export function normalizeTeacherLoginPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      email: normalizeEmail(payload.email),
      password: typeof payload.password === "string" ? payload.password : ""
    }
  };
}

export function normalizeTeacherPasswordResetPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      email: normalizeEmail(payload.email)
    }
  };
}

export function normalizeTeacherDashboardPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      classId: normalizeText(payload.classId),
      courseId: normalizeText(payload.courseId),
      moduleId: normalizeText(payload.moduleId),
      reviewStatus: Object.prototype.hasOwnProperty.call(payload, "reviewStatus") ? normalizeText(payload.reviewStatus) : "pending",
      studentSearch: normalizeText(payload.studentSearch || payload.searchStudentName)
    }
  };
}


export function normalizeTeacherAttendancePayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      classId: normalizeText(payload.classId),
      attendanceDate: normalizeDate(payload.attendanceDate),
      statuses: normalizeAttendanceStatuses(payload.statuses),
      notes: normalizeAttendanceNotes(payload.notes)
    }
  };
}

export function normalizeTeacherStudentDetailPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      studentId: normalizeText(payload.studentId),
      classId: normalizeText(payload.classId)
    }
  };
}
function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDate(value) {
  var text = normalizeText(value);

  if (text) {
    return text;
  }

  return new Date().toISOString().slice(0, 10);
}

function normalizeAttendanceStatuses(statuses) {
  var safeStatuses = statuses && typeof statuses === "object" && !Array.isArray(statuses) ? statuses : {};
  var result = {};
  var studentIds = Object.keys(safeStatuses);
  var index = 0;

  while (index < studentIds.length) {
    result[normalizeText(studentIds[index])] = normalizeAttendanceStatus(safeStatuses[studentIds[index]]);
    index = index + 1;
  }

  return result;
}

function normalizeAttendanceNotes(notes) {
  var safeNotes = notes && typeof notes === "object" && !Array.isArray(notes) ? notes : {};
  var result = {};
  var studentIds = Object.keys(safeNotes);
  var index = 0;

  while (index < studentIds.length) {
    result[normalizeText(studentIds[index])] = normalizeText(safeNotes[studentIds[index]]).slice(0, 240);
    index = index + 1;
  }

  return result;
}

function normalizeAttendanceStatus(value) {
  var text = normalizeText(value);

  if (text === "absent" || text === "late" || text === "excused") {
    return text;
  }

  if (text === "") {
    return "";
  }

  return "present";
}