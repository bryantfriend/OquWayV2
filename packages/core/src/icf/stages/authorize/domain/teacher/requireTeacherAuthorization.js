import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.110-student-class-alias-query";
import { canAccessTeacherDashboard } from "../../../../../../../permissions/index.js";
import {
  getActorClaimRoles,
  getUserRoles,
  isActiveUserProfile,
  isExplicitStudentOrParentProfile as isExplicitStudentOrParentProfileShared,
  mergeTrustedTeacherDashboardRoles
} from "../../../../../../../domain/users/index.js";

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

  if (!canAccessTeacherDashboard(profile, executionState.actor || {})) {
    console.warn("[teacher-auth] unauthorized", {
      uid: uid,
      roles: roles
    });
    return createError("TEACHER_ROLE_REQUIRED", "This account is not authorized for the Teacher Dashboard.");
  }

  return { valid: true };
}

export async function requireTeacherReviewScopeAuthorization(executionState) {
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

  if (await isSubmissionInTeacherOwnershipScope(submission, executionState.context || {}, actor)) {
    return { valid: true };
  }

  return createError("EXTERNAL_TASK_REVIEW_SCOPE_DENIED", "This submission is outside this teacher's owned classes or course assignments.");
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
  return getUserRoles(profile);
}

function readActorClaimRoles(actor) {
  return getActorClaimRoles(actor);
}

function mergeTrustedRoles(claimsRoles, profileRoles) {
  return mergeTrustedTeacherDashboardRoles(claimsRoles, profileRoles);
}

function isExplicitStudentOrParentProfile(profileRoles) {
  return isExplicitStudentOrParentProfileShared(profileRoles);
}

async function isSubmissionInTeacherOwnershipScope(submission, context, actor) {
  var profile = context.teacherProfile || null;
  var teacherIds = readTeacherOwnershipIds(context, profile, actor);
  var assignmentId = submission.courseAssignmentId || submission.assignmentId || "";

  if (Array.isArray(submission.teacherOwnershipIds) && submission.teacherOwnershipIds.some(function (teacherId) {
    return teacherIds.indexOf(teacherId) !== -1;
  })) {
    return true;
  }

  if (assignmentId && await isOwnedCourseAssignment(assignmentId, teacherIds)) {
    return true;
  }

  if (submission.classId && await isOwnedClass(submission.classId, teacherIds)) {
    return true;
  }

  return false;
}

async function isOwnedClass(classId, teacherIds) {
  if (!classId || teacherIds.length === 0) {
    return false;
  }

  try {
    var classSnap = await getDoc(doc(db, "classes", classId));
    return classSnap.exists() && recordHasTeacherOwnership(classSnap.data() || {}, teacherIds, "primaryTeacherId");
  } catch (error) {
    return false;
  }
}

async function isOwnedCourseAssignment(assignmentId, teacherIds) {
  if (!assignmentId || teacherIds.length === 0) {
    return false;
  }

  try {
    var assignmentSnap = await getDoc(doc(db, "courseAssignments", assignmentId));
    return assignmentSnap.exists() && recordHasTeacherOwnership(assignmentSnap.data() || {}, teacherIds, "responsibleTeacherId");
  } catch (error) {
    return false;
  }
}

function recordHasTeacherOwnership(data, teacherIds, primaryFieldName) {
  return data && (
    (Array.isArray(data.teacherOwnershipIds) && data.teacherOwnershipIds.some(function (teacherId) {
      return teacherIds.indexOf(teacherId) !== -1;
    }))
    || (typeof data[primaryFieldName] === "string" && teacherIds.indexOf(data[primaryFieldName]) !== -1)
    || (Array.isArray(data.assistantIds) && data.assistantIds.some(function (teacherId) {
      return teacherIds.indexOf(teacherId) !== -1;
    }))
  );
}

function readTeacherOwnershipIds(context, profile, actor) {
  var ids = [];

  addText(ids, context ? context.profileUserId : "");
  addText(ids, context ? context.authUid : "");
  addTextList(ids, context ? context.teacherOwnershipIds : []);
  addText(ids, actor ? actor.id : "");
  addText(ids, actor ? actor.authUid : "");
  addText(ids, profile ? profile.profileUserId : "");
  addText(ids, profile ? profile.id : "");
  addText(ids, profile ? profile.authUid : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.id : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.profileUserId : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.authUid : "");

  return ids;
}

function addText(ids, value) {
  var text = typeof value === "string" ? value.trim() : "";

  if (text && ids.indexOf(text) === -1) {
    ids.push(text);
  }
}

function addTextList(ids, values) {
  var safeValues = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < safeValues.length) {
    addText(ids, safeValues[index]);
    index = index + 1;
  }
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
  return isActiveUserProfile(profile);
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


