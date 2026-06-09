import { isKnownEmotionalCheckInOption } from "../../../../../../../domain/emotionalCheckIns/index.js?v=1.1.161-universal-check-in";

export function validateEmotionalCheckInPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  requireText(errors, payload.participantUserId, "PARTICIPANT_USER_ID_REQUIRED", "participantUserId is required.");
  requireText(errors, payload.participantRole, "PARTICIPANT_ROLE_REQUIRED", "participantRole is required.");
  requireText(errors, payload.programId, "PROGRAM_ID_REQUIRED", "programId is required.");
  requireText(errors, payload.programType, "PROGRAM_TYPE_REQUIRED", "programType is required.");
  requireText(errors, payload.contextScope, "CONTEXT_SCOPE_REQUIRED", "contextScope is required.");
  requireText(errors, payload.emotionKey, "EMOTION_KEY_REQUIRED", "emotionKey is required.");

  if (payload.contextScope === "class-session" && !readText(payload.classId)) {
    errors.push({
      code: "CLASS_ID_REQUIRED",
      message: "classId is required for class-session check-ins."
    });
  }

  if (readText(payload.emotionKey) && !isKnownEmotionalCheckInOption(payload.emotionKey)) {
    errors.push({
      code: "UNKNOWN_EMOTION_KEY",
      message: "Unknown emotional check-in option."
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors
    };
  }

  return { valid: true };
}

function requireText(errors, value, code, message) {
  if (!readText(value)) {
    errors.push({
      code: code,
      message: message
    });
  }
}

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}
