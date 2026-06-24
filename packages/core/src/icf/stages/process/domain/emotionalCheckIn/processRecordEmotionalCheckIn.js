import { buildEmotionalCheckInDocumentId, saveEmotionalCheckIn } from "../../../../../../../domain/emotionalCheckIns/index.js?v=1.1.207-emotional-check-in-save";

export async function processRecordEmotionalCheckIn(executionState) {
  try {
    var payload = executionState.payload || {};
    var result = await saveEmotionalCheckIn(payload, payload.emotionKey);
    var checkIn = Object.assign({}, result.record, {
      id: result.id
    });

    return {
      valid: true,
      data: {
        checkInId: result.id,
        alreadyExists: result.exists === true,
        checkIn: checkIn
      }
    };
  } catch (error) {
    var payload = executionState.payload || {};
    var actor = executionState.actor || {};
    var writePath = "emotionalCheckIns/" + safeBuildCheckInDocumentId(payload);

    console.error("[emotional-check-in:process-error]", {
      actorId: readText(actor.id || actor.uid || actor.authUid || actor.userId),
      actorRole: readText(actor.role || payload.participantRole),
      writePath: writePath,
      dateKey: readText(payload.checkInDate || payload.localDate),
      emotionKey: readText(payload.emotionKey),
      errorCode: error && error.code ? error.code : "",
      errorMessage: error && error.message ? error.message : String(error || "unknown error")
    });

    return {
      valid: false,
      errors: [
        {
          code: "EMOTIONAL_CHECK_IN_SAVE_FAILED",
          retryable: true,
          firebaseCode: error && error.code ? error.code : "",
          internal: {
            writePath: writePath,
            errorCode: error && error.code ? error.code : "",
            errorMessage: error && error.message ? error.message : String(error || "unknown error")
          },
          documentPathPattern: "emotionalCheckIns/{location_context_participantUserId}",
          message: "Could not save your check-in. Please try again."
        }
      ]
    };
  }
}

function safeBuildCheckInDocumentId(payload) {
  try {
    return buildEmotionalCheckInDocumentId(payload || {});
  } catch (error) {
    return "unknown";
  }
}

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}
