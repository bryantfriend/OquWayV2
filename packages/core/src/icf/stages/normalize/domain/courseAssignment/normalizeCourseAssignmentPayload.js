export function normalizeCourseAssignmentPayload(executionState) {
  var payload = executionState.payload || {};
  var targetType = normalizeTargetType(payload.targetType);
  var locationId = normalizeText(payload.locationId);
  var classId = normalizeText(payload.classId);
  var studentId = normalizeText(payload.studentId);
  var responsibleTeacherId = normalizeText(payload.responsibleTeacherId || payload.teacherId || payload.teacherUid);

  return {
    assignmentType: normalizeAssignmentType(payload.assignmentType),
    courseId: normalizeText(payload.courseId),
    moduleId: normalizeText(payload.moduleId) || null,
    targetType: targetType,
    targetId: normalizeTargetId(payload.targetId, targetType, locationId, classId, studentId),
    locationId: locationId,
    classId: targetType === "class" ? classId : "",
    studentId: targetType === "student" ? studentId : "",
    status: normalizeStatus(payload.status),
    startsAt: normalizeNullableText(payload.startsAt),
    dueAt: normalizeNullableText(payload.dueAt),
    visibility: normalizeVisibility(payload.visibility),
    responsibleTeacherId: responsibleTeacherId,
    assistantIds: normalizeIdArray([payload.assistantIds, payload.teacherIds], responsibleTeacherId),
    responsibleTeacherName: normalizeText(payload.responsibleTeacherName),
    assistantNames: normalizeTextArray(payload.assistantNames, [])
  };
}

export function normalizeCourseAssignmentUpdatePayload(executionState) {
  var payload = executionState.payload || {};

  return {
    assignmentId: normalizeText(payload.assignmentId),
    status: normalizeStatus(payload.status),
    responsibleTeacherId: normalizeText(payload.responsibleTeacherId || payload.teacherId || payload.teacherUid),
    assistantIds: normalizeIdArray([payload.assistantIds, payload.teacherIds], normalizeText(payload.responsibleTeacherId || payload.teacherId || payload.teacherUid)),
    responsibleTeacherName: normalizeText(payload.responsibleTeacherName),
    assistantNames: normalizeTextArray(payload.assistantNames, [])
  };
}

export function normalizeCourseAssignmentOwnershipPayload(executionState) {
  var payload = executionState.payload || {};
  var responsibleTeacherId = normalizeText(payload.responsibleTeacherId || payload.teacherId || payload.teacherUid);

  return {
    assignmentId: normalizeText(payload.assignmentId || payload.id),
    responsibleTeacherId: responsibleTeacherId,
    assistantIds: normalizeIdArray([payload.assistantIds, payload.teacherIds], responsibleTeacherId),
    responsibleTeacherName: normalizeText(payload.responsibleTeacherName),
    assistantNames: normalizeTextArray(payload.assistantNames, [])
  };
}

export function normalizeCourseAssignmentDisablePayload(executionState) {
  var payload = executionState.payload || {};

  return {
    assignmentId: normalizeText(payload.assignmentId),
    status: "disabled"
  };
}

export function normalizeCourseAssignmentListPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    courseId: normalizeText(payload.courseId),
    targetType: normalizeText(payload.targetType),
    targetId: normalizeText(payload.targetId),
    status: normalizeText(payload.status)
  };
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeTextArray(value, fallback) {
  var result = [];
  var index = 0;
  var source = value;

  if (typeof source === "string") {
    source = source.split(",");
  }

  if (!Array.isArray(source)) {
    return fallback.slice();
  }

  while (index < source.length) {
    var item = normalizeText(source[index]);

    if (item && result.indexOf(item) === -1) {
      result.push(item);
    }

    index = index + 1;
  }

  return result;
}

function normalizeIdArray(value, excludedId) {
  var ids = [];
  var excluded = normalizeText(excludedId);

  appendIdValue(ids, value);

  return ids.filter(function (id) {
    return id && id !== excluded;
  });
}

function appendIdValue(ids, value) {
  var index = 0;

  if (Array.isArray(value)) {
    while (index < value.length) {
      appendIdValue(ids, value[index]);
      index = index + 1;
    }
    return;
  }

  normalizeTextArray(value, []).forEach(function (id) {
    if (ids.indexOf(id) === -1) {
      ids.push(id);
    }
  });
}

function normalizeNullableText(value) {
  var text = normalizeText(value);

  return text || null;
}

function normalizeAssignmentType(value) {
  return normalizeText(value) === "module" ? "module" : "course";
}

function normalizeTargetType(value) {
  return normalizeText(value) === "student" ? "student" : "class";
}

function normalizeTargetId(value, targetType, locationId, classId, studentId) {
  var targetId = normalizeText(value);

  if (targetId) {
    return targetId;
  }

  if (targetType === "student") {
    return studentId;
  }

  if (targetType === "class") {
    return classId;
  }

  return locationId;
}

function normalizeStatus(value) {
  var status = normalizeText(value);

  if (status === "paused" || status === "archived" || status === "disabled") {
    return status;
  }

  return "active";
}

function normalizeVisibility(value) {
  var visibility = normalizeText(value);

  if (visibility === "hidden") {
    return "hidden";
  }

  return "visible";
}
