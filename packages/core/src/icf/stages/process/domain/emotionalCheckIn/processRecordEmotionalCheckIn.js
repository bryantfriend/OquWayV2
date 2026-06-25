import { buildEmotionalCheckInDocumentId, saveEmotionalCheckIn } from "../../../../../../../domain/emotionalCheckIns/index.js?v=1.1.213-emotional-checkin-owner";

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
    var documentId = safeBuildCheckInDocumentId(payload);
    var writePath = "emotionalCheckIns/" + documentId;
    var safeWriteContext = {
      actorId: readText(actor.id || actor.uid || actor.authUid || actor.userId),
      actorAuthUid: readText(actor.authUid || actor.uid),
      actorRole: readText(actor.role || payload.participantRole),
      authenticatedUid: readAuthenticatedUid(executionState),
      canonicalStudentId: readText(actor.studentId || payload.studentId),
      participantUserId: readText(payload.participantUserId),
      participantProfileId: readText(payload.participantProfileId),
      actorIdMatchesParticipantUserId: readText(actor.id || actor.uid || actor.authUid || actor.userId) == readText(payload.participantUserId),
      collection: "emotionalCheckIns",
      writeOperationType: "upsert-deterministic-daily-check-in",
      writeMethod: "setDoc",
      writePath: writePath,
      documentId: documentId,
      payloadFieldNames: readPayloadFieldNames(payload),
      dateKey: readText(payload.checkInDate || payload.localDate),
      emotionKey: readText(payload.emotionKey),
      errorName: error && error.name ? error.name : "",
      errorCode: error && error.code ? error.code : "",
      errorMessage: error && error.message ? error.message : String(error || "unknown error")
    };

    console.error("[emotional-check-in:process-error]", safeWriteContext);

    return {
      valid: false,
      errors: [
        {
          code: "EMOTIONAL_CHECK_IN_SAVE_FAILED",
          retryable: true,
          firebaseCode: error && error.code ? error.code : "",
          internal: safeWriteContext,
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

function readAuthenticatedUid(executionState) {
  var auth = executionState && executionState.auth ? executionState.auth : {};
  var request = executionState && executionState.request ? executionState.request : {};
  var requestAuth = request && request.auth ? request.auth : {};
  var user = executionState && executionState.user ? executionState.user : {};
  return readText(auth.uid || requestAuth.uid || user.uid || "");
}

function readPayloadFieldNames(payload) {
  return Object.keys(payload || {}).sort();
}