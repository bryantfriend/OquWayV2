export function allowTeacherLoginAuthorization() {
  return { valid: true };
}

export function requireTeacherDashboardAuthorization(executionState) {
  var profile = executionState.context ? executionState.context.teacherProfile : null;
  var profileRoles = readProfileRoles(profile);
  var claimsRoles = readActorClaimRoles(executionState.actor || {});
  var roles = mergeTrustedRoles(claimsRoles, profileRoles);
  var uid = executionState.actor && executionState.actor.id ? executionState.actor.id : "";

  console.info("[teacher-auth] normalized roles", {
    claimsRoles: claimsRoles,
    profileRoles: profileRoles,
    combinedRoles: roles,
    resolvedProfileId: profile && profile.id ? profile.id : "",
    resolvedProfileRole: profile && profile.role ? profile.role : ""
  });

  if (!executionState.actor || !executionState.actor.id) {
    console.warn("[teacher-auth] unauthorized", {
      uid: uid,
      roles: roles
    });
    return createError("TEACHER_AUTH_REQUIRED", "Please sign in with a teacher account.");
  }

  if (!profile) {
    console.warn("[teacher-auth] unauthorized", {
      uid: uid,
      roles: roles
    });
    return createError("TEACHER_PROFILE_REQUIRED", "No teacher profile was found for this account.");
  }

  if (!isActiveProfile(profile)) {
    console.warn("[teacher-auth] unauthorized", {
      uid: uid,
      roles: roles
    });
    return createError("TEACHER_ACCOUNT_INACTIVE", "This teacher account is not active.");
  }

  if (isExplicitStudentOrParentProfile(profileRoles)) {
    console.warn("[teacher-auth] unauthorized", {
      uid: uid,
      roles: roles,
      profileRoles: profileRoles,
      reason: "resolved-profile-is-student-or-parent"
    });
    return createError("TEACHER_ROLE_REQUIRED", "This account is not authorized for the Teacher Dashboard.");
  }

  if (!roles.some(isAllowedTeacherDashboardRole)) {
    console.warn("[teacher-auth] unauthorized", {
      uid: uid,
      roles: roles
    });
    return createError("TEACHER_ROLE_REQUIRED", "This account is not authorized for the Teacher Dashboard.");
  }

  return { valid: true };
}

export function requireTeacherReviewScopeAuthorization(executionState) {
  var actor = executionState.actor || {};
  var actorRoles = readActorClaimRoles(actor);
  var profile = executionState.context ? executionState.context.teacherProfile : null;
  var profileRoles = readProfileRoles(profile);

  if (!actor.id) {
    return createError("EXTERNAL_TASK_REVIEWER_REQUIRED", "A signed-in reviewer is required.");
  }

  if (actorRoles.some(isAdminRole) || actorRoles.indexOf("courseCreator") !== -1 || actorRoles.indexOf("assistant") !== -1) {
    return { valid: true };
  }

  if (profileRoles.some(isAdminRole)) {
    return { valid: true };
  }

  var submission = executionState.context ? executionState.context.externalTaskSubmission : null;

  if (!profile || !isActiveProfile(profile) || profileRoles.indexOf("teacher") === -1) {
    return createError("TEACHER_ROLE_REQUIRED", "This account is not authorized to review submissions.");
  }

  if (!submission) {
    return createError("EXTERNAL_TASK_SUBMISSION_REQUIRED", "The submission could not be found.");
  }

  if (isSubmissionInTeacherScope(submission, executionState.context.teacherClassIds || [], executionState.context.teacherLocationIds || [])) {
    return { valid: true };
  }

  return createError("EXTERNAL_TASK_REVIEW_SCOPE_DENIED", "This submission is outside this teacher's assigned classes.");
}

export function isAllowedTeacherDashboardRole(role) {
  return role === "teacher"
    || role === "schoolAdmin"
    || role === "platformAdmin"
    || role === "superAdmin";
}

export function readRoles(profile, actor) {
  var source = [];
  var roles = [];
  var index = 0;

  if (profile && Array.isArray(profile.roles)) {
    source = source.concat(profile.roles);
  }

  if (profile && profile.role) {
    source.push(profile.role);
  }

  if (actor && actor.role) {
    source.push(actor.role);
  }

  if (actor && Array.isArray(actor.roles)) {
    source = source.concat(actor.roles);
  }

  if (actor && Array.isArray(actor.userRoles)) {
    source = source.concat(actor.userRoles);
  }

  if (profile && profile.ROLE_TEACHER === true) {
    source.push("ROLE_TEACHER");
  }

  if (profile && profile.ROLE_SCHOOL_ADMIN === true) {
    source.push("ROLE_SCHOOL_ADMIN");
  }

  if (profile && profile.ROLE_PLATFORM_ADMIN === true) {
    source.push("ROLE_PLATFORM_ADMIN");
  }

  if (profile && profile.ROLE_SUPER_ADMIN === true) {
    source.push("ROLE_SUPER_ADMIN");
  }

  if (actor && actor.claims) {
    if (actor.claims.role) {
      source.push(actor.claims.role);
    }

    if (Array.isArray(actor.claims.roles)) {
      source = source.concat(actor.claims.roles);
    }

    if (Array.isArray(actor.claims.userRoles)) {
      source = source.concat(actor.claims.userRoles);
    }

    if (actor.claims.ROLE_TEACHER === true) source.push("ROLE_TEACHER");
    if (actor.claims.ROLE_SCHOOL_ADMIN === true) source.push("ROLE_SCHOOL_ADMIN");
    if (actor.claims.ROLE_PLATFORM_ADMIN === true) source.push("ROLE_PLATFORM_ADMIN");
    if (actor.claims.ROLE_SUPER_ADMIN === true) source.push("ROLE_SUPER_ADMIN");
  }

  while (index < source.length) {
    var normalized = normalizeRole(source[index]);

    if (normalized && roles.indexOf(normalized) === -1) {
      roles.push(normalized);
    }

    index = index + 1;
  }

  return roles;
}

function readProfileRoles(profile) {
  return readRoles(profile, null);
}

function readActorClaimRoles(actor) {
  return readRoles(null, actor);
}

function mergeTrustedRoles(claimsRoles, profileRoles) {
  var roles = [];
  var profileIsExplicitStudentOrParent = isExplicitStudentOrParentProfile(profileRoles);
  var source = profileRoles.slice();

  if (!profileIsExplicitStudentOrParent) {
    claimsRoles.forEach(function (role) {
      if (isAdminRole(role)) {
        source.push(role);
      }
    });
  }

  source.forEach(function (role) {
    if (role && roles.indexOf(role) === -1) {
      roles.push(role);
    }
  });

  return roles;
}

function isExplicitStudentOrParentProfile(profileRoles) {
  var hasTeacherOrAdmin = profileRoles.some(isAllowedTeacherDashboardRole);

  return !hasTeacherOrAdmin
    && (profileRoles.indexOf("student") !== -1 || profileRoles.indexOf("parent") !== -1);
}

function isSubmissionInTeacherScope(submission, classIds, locationIds) {
  if (submission.classId && classIds.indexOf(submission.classId) !== -1) {
    return true;
  }

  if (submission.locationId && locationIds.indexOf(submission.locationId) !== -1) {
    return true;
  }

  return false;
}

function isAdminRole(role) {
  return role === "schoolAdmin" || role === "platformAdmin" || role === "superAdmin" || role === "admin";
}

function normalizeRole(role) {
  var normalized = typeof role === "string"
    ? role.replace(/^ROLE_/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase()
    : "";

  if (normalized === "teacher") return "teacher";
  if (normalized === "assistant") return "assistant";
  if (normalized === "schooladmin") return "schoolAdmin";
  if (normalized === "platformadmin") return "platformAdmin";
  if (normalized === "superadmin") return "superAdmin";
  if (normalized === "coursecreator") return "courseCreator";
  if (normalized === "admin") return "admin";
  if (normalized === "student") return "student";
  if (normalized === "parent") return "parent";
  if (normalized === "authenticated" || normalized === "guest") return "";
  return normalized;
}

function isActiveProfile(profile) {
  if (!profile) {
    return false;
  }

  if (profile.isActive === true) {
    return true;
  }

  if (!profile.status) {
    return true;
  }

  return profile.status === "active" || profile.status === "approved";
}

function createError(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}


