import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.79-user-command-center";

export async function buildCourseAssignmentOwnershipFields(payload) {
  var responsibleTeacherId = readText(payload.responsibleTeacherId);
  var assistantIds = readIdList(payload.assistantIds).filter(function (assistantId) {
    return assistantId !== responsibleTeacherId;
  });
  var assistantNames = [];
  var teacherOwnershipIds = [];
  var index = 0;

  if (responsibleTeacherId) {
    await requireStaffRole(responsibleTeacherId, ["teacher"], "Responsible teacher must be active and have the teacher role.");
    await appendUserOwnershipIds(teacherOwnershipIds, responsibleTeacherId);
  }

  while (index < assistantIds.length) {
    await requireStaffRole(assistantIds[index], ["teacher", "assistant"], "Course assistants must be active and have teacher or assistant role.");
    await appendUserOwnershipIds(teacherOwnershipIds, assistantIds[index]);
    assistantNames.push(await readUserDisplayName(assistantIds[index]));
    index = index + 1;
  }

  return {
    responsibleTeacherId: responsibleTeacherId,
    assistantIds: assistantIds,
    teacherOwnershipIds: teacherOwnershipIds,
    responsibleTeacherName: responsibleTeacherId ? await readUserDisplayName(responsibleTeacherId) : "",
    assistantNames: assistantNames.filter(Boolean)
  };
}

export function readCourseAssignmentOwnership(data) {
  var responsibleTeacherId = readText(data.responsibleTeacherId || data.teacherId || data.teacherUid);
  var assistantIds = readIdList([data.assistantIds, data.teacherIds]).filter(function (assistantId) {
    return assistantId !== responsibleTeacherId;
  });

  return {
    responsibleTeacherId: responsibleTeacherId,
    assistantIds: assistantIds,
    teacherOwnershipIds: readIdList([data.teacherOwnershipIds, responsibleTeacherId, assistantIds]),
    responsibleTeacherName: readText(data.responsibleTeacherName),
    assistantNames: Array.isArray(data.assistantNames) ? data.assistantNames.map(readText).filter(Boolean) : []
  };
}

async function appendUserOwnershipIds(ids, userId) {
  var safeId = readText(userId);

  appendUniqueId(ids, safeId);

  if (!safeId) {
    return;
  }

  try {
    var userSnap = await getDoc(doc(db, "users", safeId));
    var data = userSnap.exists() ? userSnap.data() || {} : {};

    appendUniqueId(ids, userSnap.id);
    appendUniqueId(ids, data.authUid);
    appendUniqueId(ids, data.profileUserId);

    if (data.linkedProfile && typeof data.linkedProfile === "object") {
      appendUniqueId(ids, data.linkedProfile.id);
      appendUniqueId(ids, data.linkedProfile.authUid);
      appendUniqueId(ids, data.linkedProfile.profileUserId);
    }
  } catch (error) {
    appendUniqueId(ids, safeId);
  }
}

function appendUniqueId(ids, value) {
  var id = readText(value);

  if (id && ids.indexOf(id) === -1) {
    ids.push(id);
  }
}

async function requireStaffRole(userId, allowedRoles, message) {
  var userSnap = await getDoc(doc(db, "users", userId));
  var data = userSnap.exists() ? userSnap.data() || {} : {};
  var roles = readRoles(data);
  var status = readText(data.status || "active");
  var index = 0;

  if (status !== "active" && status !== "approved") {
    throw new Error(message);
  }

  while (index < allowedRoles.length) {
    if (roles.indexOf(allowedRoles[index]) !== -1) {
      return;
    }
    index = index + 1;
  }

  throw new Error(message);
}

async function readUserDisplayName(userId) {
  var safeId = readText(userId);

  if (!safeId) {
    return "";
  }

  try {
    var userSnap = await getDoc(doc(db, "users", safeId));
    var data = userSnap.exists() ? userSnap.data() || {} : {};

    return readText(data.displayName || data.name || data.email || safeId);
  } catch (error) {
    return safeId;
  }
}

function readRoles(data) {
  var source = [];
  var roles = [];
  var index = 0;

  if (Array.isArray(data.roles)) {
    source = source.concat(data.roles);
  }

  if (data.role) {
    source.push(data.role);
  }

  while (index < source.length) {
    var normalizedRole = normalizeRole(source[index]);

    if (normalizedRole && roles.indexOf(normalizedRole) === -1) {
      roles.push(normalizedRole);
    }

    index = index + 1;
  }

  if (data.ROLE_TEACHER === true && roles.indexOf("teacher") === -1) {
    roles.push("teacher");
  }

  if (data.ROLE_ASSISTANT === true && roles.indexOf("assistant") === -1) {
    roles.push("assistant");
  }

  return roles;
}

function normalizeRole(role) {
  var normalizedRole = readText(role).replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (normalizedRole === "teacher" || normalizedRole === "roleteacher") {
    return "teacher";
  }

  if (normalizedRole === "assistant" || normalizedRole === "roleassistant") {
    return "assistant";
  }

  return "";
}

function readIdList(value) {
  var ids = [];

  appendIdValue(ids, value);

  return ids;
}

function appendIdValue(ids, value) {
  var source = value;
  var index = 0;

  if (typeof source === "string") {
    source = source.split(",");
  }

  if (!Array.isArray(source)) {
    return;
  }

  while (index < source.length) {
    if (Array.isArray(source[index])) {
      appendIdValue(ids, source[index]);
    } else {
      var id = readText(source[index]).trim();

      if (id && ids.indexOf(id) === -1) {
        ids.push(id);
      }
    }

    index = index + 1;
  }
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
