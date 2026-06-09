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

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}
