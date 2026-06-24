export function requireEmotionalCheckInAuthorization(executionState) {
  var actor = executionState.actor || {};
  var payload = executionState.payload || {};
  var participantUserId = readText(payload.participantUserId);
  var actorIds = [
    actor.id,
    actor.uid,
    actor.authUid,
    actor.userId,
    actor.studentId,
    actor.profileId
  ].map(readText).filter(Boolean);

  if (!participantUserId) {
    return {
      valid: false,
      errors: [{ code: "PARTICIPANT_USER_ID_REQUIRED", message: "participantUserId is required." }]
    };
  }

  if (!isStudentCheckInActor(actor, payload)) {
    return {
      valid: false,
      errors: [{ code: "STUDENT_CHECK_IN_REQUIRED", message: "Only students can record this emotional check-in." }]
    };
  }

  if (actorIds.indexOf(participantUserId) !== -1) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: [
      {
        code: "CHECK_IN_OWN_USER_REQUIRED",
        message: "Users can only create their own emotional check-ins."
      }
    ]
  };
}

function isStudentCheckInActor(actor, payload) {
  var roleValues = [];

  roleValues.push(payload.participantRole);
  roleValues.push(actor.role);
  if (Array.isArray(actor.roles)) {
    roleValues = roleValues.concat(actor.roles);
  }

  return roleValues.map(normalizeRole).indexOf("student") !== -1;
}

function normalizeRole(role) {
  var normalizedRole = readText(role).replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (normalizedRole === "student" || normalizedRole === "rolestudent") {
    return "student";
  }

  return normalizedRole;
}

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}
