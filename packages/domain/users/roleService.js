export function getUserRoles(userProfile) {
  var source = [];

  appendRole(source, userProfile && userProfile.role);
  appendRoles(source, userProfile && userProfile.roles);
  appendClaimRole(source, userProfile, "ROLE_TEACHER", "ROLE_TEACHER");
  appendClaimRole(source, userProfile, "ROLE_ASSISTANT", "ROLE_ASSISTANT");
  appendClaimRole(source, userProfile, "ROLE_COURSE_CREATOR", "ROLE_COURSE_CREATOR");
  appendClaimRole(source, userProfile, "ROLE_SCHOOL_ADMIN", "ROLE_SCHOOL_ADMIN");
  appendClaimRole(source, userProfile, "ROLE_PLATFORM_ADMIN", "ROLE_PLATFORM_ADMIN");
  appendClaimRole(source, userProfile, "ROLE_SUPER_ADMIN", "ROLE_SUPER_ADMIN");
  appendClaimRole(source, userProfile, "ROLE_STUDENT", "ROLE_STUDENT");
  appendClaimRole(source, userProfile, "ROLE_PARENT", "ROLE_PARENT");

  return normalizeRoleList(source);
}

export function getActorClaimRoles(actor) {
  var source = [];
  var claims = actor && actor.claims ? actor.claims : {};

  appendRole(source, actor && actor.role);
  appendRoles(source, actor && actor.roles);
  appendRoles(source, actor && actor.userRoles);
  appendRole(source, claims.role);
  appendRoles(source, claims.roles);
  appendRoles(source, claims.userRoles);
  appendClaimRole(source, claims, "ROLE_TEACHER", "ROLE_TEACHER");
  appendClaimRole(source, claims, "ROLE_ASSISTANT", "ROLE_ASSISTANT");
  appendClaimRole(source, claims, "ROLE_COURSE_CREATOR", "ROLE_COURSE_CREATOR");
  appendClaimRole(source, claims, "ROLE_SCHOOL_ADMIN", "ROLE_SCHOOL_ADMIN");
  appendClaimRole(source, claims, "ROLE_PLATFORM_ADMIN", "ROLE_PLATFORM_ADMIN");
  appendClaimRole(source, claims, "ROLE_SUPER_ADMIN", "ROLE_SUPER_ADMIN");
  appendClaimRole(source, claims, "ROLE_STUDENT", "ROLE_STUDENT");
  appendClaimRole(source, claims, "ROLE_PARENT", "ROLE_PARENT");

  return normalizeRoleList(source);
}

export function normalizeUserRoles(userProfile, claims) {
  var actor = {
    claims: claims || {}
  };

  return mergeUniqueRoles(getUserRoles(userProfile).concat(getActorClaimRoles(actor)));
}

export function isTeacherProfile(userProfile) {
  return getUserRoles(userProfile).some(isTeacherDashboardRole);
}

export function isStudentProfile(userProfile) {
  var roles = getUserRoles(userProfile);

  if (roles.length === 0) {
    return Boolean(userProfile && (userProfile.classId || Array.isArray(userProfile.classIds)));
  }

  return roles.indexOf("student") !== -1;
}

export function isStudentDashboardProfile(userProfile) {
  return readStudentProfileRejectReason(userProfile) === "";
}

export function readStudentProfileRejectReason(userProfile) {
  if (!userProfile) {
    return "profile-missing";
  }

  if (!hasExplicitStudentRole(userProfile)) {
    return "not-student-role";
  }

  if (!isActiveUserProfile(userProfile)) {
    return "inactive-status";
  }

  if (!hasStudentClass(userProfile)) {
    return "missing-class";
  }

  if (!hasStudentLocation(userProfile)) {
    return "missing-location";
  }

  return "";
}

export function hasStudentClass(userProfile) {
  return Boolean(
    readTextField(userProfile, "classId")
      || readTextArray(userProfile && userProfile.classIds).length > 0
      || readTextArray(userProfile && userProfile.assignedClassIds).length > 0
      || readRecordList(userProfile && userProfile.assignedClasses, "class").length > 0
      || readRecordList(userProfile && userProfile.classRefs, "class").length > 0
      || readRecordList(userProfile && userProfile.classes, "class").length > 0
  );
}

export function hasStudentLocation(userProfile) {
  return Boolean(
    readTextField(userProfile, "locationId")
      || readTextField(userProfile, "primaryLocationId")
      || readTextField(userProfile, "schoolId")
      || readTextField(userProfile, "locId")
      || readTextArray(userProfile && userProfile.locationIds).length > 0
      || readTextArray(userProfile && userProfile.schoolIds).length > 0
  );
}

export function hasExplicitStudentRole(userProfile) {
  return getUserRoles(userProfile).indexOf("student") !== -1;
}

export function readStudentClassIds(userProfile) {
  var ids = [];

  appendUniqueText(ids, readTextField(userProfile, "classId"));
  appendTextValues(ids, userProfile && userProfile.classIds);
  appendTextValues(ids, userProfile && userProfile.assignedClassIds);
  appendTextValues(ids, readRecordList(userProfile && userProfile.assignedClasses, "class"));
  appendTextValues(ids, readRecordList(userProfile && userProfile.classRefs, "class"));
  appendTextValues(ids, readRecordList(userProfile && userProfile.classes, "class"));

  return ids;
}

export function readStudentLocationIds(userProfile) {
  var ids = [];

  appendUniqueText(ids, readTextField(userProfile, "locationId"));
  appendUniqueText(ids, readTextField(userProfile, "primaryLocationId"));
  appendUniqueText(ids, readTextField(userProfile, "schoolId"));
  appendUniqueText(ids, readTextField(userProfile, "locId"));
  appendTextValues(ids, userProfile && userProfile.locationIds);
  appendTextValues(ids, userProfile && userProfile.schoolIds);

  return ids;
}

export function readAssignedCourseIds(userProfile) {
  var ids = [];

  appendTextValues(ids, userProfile && userProfile.assignedCourseIds);
  appendTextValues(ids, userProfile && userProfile.courseIds);
  appendTextValues(ids, readCourseRecordIds(userProfile && userProfile.assignedCourses));
  appendTextValues(ids, readCourseRecordIds(userProfile && userProfile.courses));

  return ids;
}

export function isActiveUserProfile(userProfile) {
  if (!userProfile) {
    return false;
  }

  if (userProfile.isActive === true) {
    return true;
  }

  if (!userProfile.status) {
    return true;
  }

  return userProfile.status === "active" || userProfile.status === "approved";
}

export function mergeTrustedTeacherDashboardRoles(claimsRoles, profileRoles) {
  var profileIsExplicitStudentOrParent = isExplicitStudentOrParentProfile(profileRoles);
  var source = Array.isArray(profileRoles) ? profileRoles.slice() : [];

  if (!profileIsExplicitStudentOrParent) {
    (claimsRoles || []).forEach(function (role) {
      if (isAdminRole(role)) {
        source.push(role);
      }
    });
  }

  return mergeUniqueRoles(source);
}

export function isExplicitStudentOrParentProfile(profileRoles) {
  var roles = Array.isArray(profileRoles) ? profileRoles : [];
  var hasTeacherOrAdmin = roles.some(isTeacherDashboardRole);

  return !hasTeacherOrAdmin
    && (roles.indexOf("student") !== -1 || roles.indexOf("parent") !== -1);
}

export function isTeacherDashboardRole(role) {
  return role === "teacher"
    || role === "schoolAdmin"
    || role === "platformAdmin"
    || role === "superAdmin";
}

export function isAdminRole(role) {
  return role === "schoolAdmin"
    || role === "platformAdmin"
    || role === "superAdmin"
    || role === "admin";
}

function normalizeRoleList(source) {
  var roles = [];
  var index = 0;

  while (index < source.length) {
    var normalized = normalizeUserRole(source[index]);

    if (normalized && roles.indexOf(normalized) === -1) {
      roles.push(normalized);
    }

    index = index + 1;
  }

  return roles;
}

function normalizeUserRole(role) {
  var normalizedRole = typeof role === "string"
    ? role.replace(/[^a-z0-9]/gi, "").toLowerCase().replace(/^role/, "")
    : "";

  if (normalizedRole === "schooladmin") {
    return "schoolAdmin";
  }

  if (normalizedRole === "regionaladmin") {
    return "regionalAdmin";
  }

  if (normalizedRole === "ministryuser" || normalizedRole === "ministry") {
    return "ministryUser";
  }

  if (normalizedRole === "platformadmin") {
    return "platformAdmin";
  }

  if (normalizedRole === "superadmin") {
    return "superAdmin";
  }

  if (normalizedRole === "coursecreator") {
    return "courseCreator";
  }

  if (normalizedRole === "admin") {
    return "admin";
  }

  if (normalizedRole === "student" || normalizedRole === "teacher" || normalizedRole === "assistant" || normalizedRole === "parent") {
    return normalizedRole;
  }

  return "";
}

function mergeUniqueRoles(source) {
  var roles = [];

  (source || []).forEach(function (role) {
    if (role && roles.indexOf(role) === -1) {
      roles.push(role);
    }
  });

  return roles;
}

function appendRoles(source, roles) {
  if (!Array.isArray(roles)) {
    return;
  }

  roles.forEach(function (role) {
    appendRole(source, role);
  });
}

function appendRole(source, role) {
  if (role) {
    source.push(role);
  }
}

function appendClaimRole(source, record, claimKey, role) {
  if (record && record[claimKey] === true) {
    appendRole(source, role);
  }
}

function readTextField(source, fieldName) {
  return source && typeof source[fieldName] === "string" ? source[fieldName] : "";
}

function readTextArray(values) {
  var result = [];
  appendTextValues(result, values);
  return result;
}

function readRecordList(values, targetType) {
  var result = [];
  var source = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < source.length) {
    appendUniqueText(result, readRecordId(source[index], targetType));
    index = index + 1;
  }

  return result;
}

function readCourseRecordIds(values) {
  var result = [];
  var source = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < source.length) {
    appendUniqueText(result, readCourseRecordId(source[index]));
    index = index + 1;
  }

  return result;
}

function readCourseRecordId(value) {
  if (!value || typeof value !== "object") {
    return typeof value === "string" ? value : "";
  }

  return readTextValue(value.id || value.courseId || value.refId || value.uid);
}

function readRecordId(value, targetType) {
  if (!value || typeof value !== "object") {
    return typeof value === "string" ? value : "";
  }

  if (targetType === "class") {
    return readTextValue(value.id || value.classId || value.refId || value.uid);
  }

  return readTextValue(value.id || value.locationId || value.schoolId || value.refId || value.uid);
}

function appendTextValues(result, value) {
  if (typeof value === "string") {
    appendUniqueText(result, value);
    return;
  }

  if (!Array.isArray(value)) {
    return;
  }

  value.forEach(function (item) {
    appendTextValues(result, item);
  });
}

function appendUniqueText(values, value) {
  var text = readTextValue(value);

  if (text && values.indexOf(text) === -1) {
    values.push(text);
  }
}

function readTextValue(value) {
  return typeof value === "string" ? value : "";
}
