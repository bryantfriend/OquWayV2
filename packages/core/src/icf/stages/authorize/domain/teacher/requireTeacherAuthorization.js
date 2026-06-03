export function allowTeacherLoginAuthorization() {
  return { valid: true };
}

export function requireTeacherDashboardAuthorization(executionState) {
  var profile = executionState.context ? executionState.context.teacherProfile : null;
  var roles = readProfileRoles(profile);
  var uid = executionState.actor && executionState.actor.id ? executionState.actor.id : "";

  console.info("[teacher-auth] normalized roles", {
    roles: roles
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
  var actorRole = readPrimaryActorRole(actor);
  var profile = executionState.context ? executionState.context.teacherProfile : null;
  var profileRoles = readProfileRoles(profile);

  if (!actor.id) {
    return createError("EXTERNAL_TASK_REVIEWER_REQUIRED", "A signed-in reviewer is required.");
  }

  if (isAdminRole(actorRole) || actorRole === "courseCreator") {
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

function readPrimaryActorRole(actor) {
  return normalizeRole(actor && actor.role ? actor.role : "");
}

function normalizeRole(role) {
  var normalized = typeof role === "string"
    ? role.replace(/^ROLE_/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase()
    : "";

  if (normalized === "teacher") return "teacher";
  if (normalized === "schooladmin") return "schoolAdmin";
  if (normalized === "platformadmin") return "platformAdmin";
  if (normalized === "superadmin") return "superAdmin";
  if (normalized === "coursecreator") return "courseCreator";
  if (normalized === "admin") return "admin";
  if (normalized === "student") return "student";
  if (normalized === "parent") return "parent";
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
