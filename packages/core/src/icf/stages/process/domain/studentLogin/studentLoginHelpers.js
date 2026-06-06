import { functions, httpsCallable } from "../../../../../infrastructure/firebase/functions.js?v=1.1.109-student-assignment-status-fallback";

export async function callStudentLoginFunction(payload) {
  return callCallableFunction("studentLogin", payload);
}

export async function callGetStudentsForClassFunction(payload) {
  return callCallableFunction("studentLogin", Object.assign({ action: "listStudents" }, payload));
}

async function callCallableFunction(functionName, payload) {
  var callable = httpsCallable(functions, "studentLogin");

  var response = await callable(payload);

  if (!response || !response.data) {
    throw new Error(functionName + " returned an empty response.");
  }

  if (response.data.success === false) {
    throw new Error(response.data.message || functionName + " request failed.");
  }

  return response.data;
}

export function sanitizeProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return null;
  }

  var roles = readRoles(profile);
  var classIds = readIdList([
    profile.classId,
    profile.classIds,
    profile.assignedClassIds,
    profile.assignedClasses,
    profile.classRefs,
    profile.classes
  ]);
  var locationIds = readIdList([
    profile.locationId,
    profile.primaryLocationId,
    profile.locationIds,
    profile.locations,
    profile.schoolId,
    profile.schoolIds
  ]);

  return {
    id: readText(profile.id),
    name: readText(profile.name),
    displayName: readText(profile.displayName),
    photoUrl: readText(profile.photoUrl),
    classId: readText(profile.classId) || readFirstText(classIds),
    classIds: classIds,
    className: readText(profile.className),
    classCode: readText(profile.classCode || profile.code),
    locationId: readText(profile.locationId || profile.primaryLocationId || profile.schoolId) || readFirstText(locationIds),
    locationIds: locationIds,
    primaryLocationId: readText(profile.primaryLocationId),
    schoolId: readText(profile.schoolId),
    role: readPrimaryRole(roles),
    roles: roles,
    status: readStudentStatus(profile),
    isActive: profile.isActive === true,
    email: readText(profile.email),
    username: readText(profile.username)
  };
}

export function isActiveStudentStatus(status) {
  if (status && typeof status === "object") {
    return isActiveStudentProfile(status);
  }

  if (!status) {
    return true;
  }

  return status === "active" || status === "approved";
}

export function hasStudentRole(profile) {
  return readRoles(profile).indexOf("student") !== -1;
}

export function isActiveStudentProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return false;
  }

  if (profile.isActive === true) {
    return true;
  }

  return isActiveStudentStatus(readText(profile.status));
}

function readRoles(profile) {
  var source = [];
  var roles = [];
  var index = 0;

  if (profile && Array.isArray(profile.roles)) {
    source = source.concat(profile.roles);
  }

  if (profile && profile.role) {
    source.push(profile.role);
  }

  while (index < source.length) {
    var normalizedRole = normalizeRole(source[index]);

    if (normalizedRole && roles.indexOf(normalizedRole) === -1) {
      roles.push(normalizedRole);
    }

    index = index + 1;
  }

  return roles;
}

function normalizeRole(role) {
  var normalizedRole = readText(role).replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (normalizedRole === "student" || normalizedRole === "rolestudent") {
    return "student";
  }

  if (normalizedRole === "teacher" || normalizedRole === "roleteacher") {
    return "teacher";
  }

  if (normalizedRole === "parent" || normalizedRole === "roleparent") {
    return "parent";
  }

  if (normalizedRole === "assistant" || normalizedRole === "roleassistant") {
    return "assistant";
  }

  if (normalizedRole === "schooladmin" || normalizedRole === "roleschooladmin") {
    return "schoolAdmin";
  }

  if (normalizedRole === "platformadmin" || normalizedRole === "roleplatformadmin") {
    return "platformAdmin";
  }

  if (normalizedRole === "superadmin" || normalizedRole === "rolesuperadmin") {
    return "superAdmin";
  }

  return "";
}

function readPrimaryRole(roles) {
  if (roles.indexOf("student") !== -1) {
    return "student";
  }

  return roles.length > 0 ? roles[0] : "";
}

function readStudentStatus(profile) {
  var status = readText(profile.status);

  if (status) {
    return status;
  }

  if (profile.isActive === true) {
    return "active";
  }

  return "active";
}

function readIdList(value) {
  var source = value;
  var ids = [];

  if (typeof source === "string") {
    source = source.split(",");
  }

  if (!Array.isArray(source)) {
    source = [source];
  }

  source.forEach(function (item) {
    if (Array.isArray(item)) {
      readIdList(item).forEach(function (nestedId) {
        if (ids.indexOf(nestedId) === -1) {
          ids.push(nestedId);
        }
      });
      return;
    }

    var id = readRecordId(item);

    if (id && ids.indexOf(id) === -1) {
      ids.push(id);
    }
  });

  return ids;
}

function readRecordId(value) {
  if (!value || typeof value !== "object") {
    return readText(value);
  }

  return readText(value.id || value.uid || value.refId || value.classId || value.locationId || value.schoolId);
}

function readFirstText(values) {
  if (Array.isArray(values) && values.length > 0) {
    return values[0];
  }

  return "";
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}
