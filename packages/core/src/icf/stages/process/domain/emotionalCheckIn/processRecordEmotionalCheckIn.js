import { saveEmotionalCheckIn } from "../../../../../../../domain/emotionalCheckIns/index.js?v=1.1.207-emotional-check-in-save";

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
    return {
      valid: false,
      errors: [
        {
          code: "EMOTIONAL_CHECK_IN_SAVE_FAILED",
          retryable: true,
          firebaseCode: error && error.code ? error.code : "",
          documentPathPattern: "emotionalCheckIns/{location_context_participantUserId}",
          message: "Could not save your check-in. Please try again."
        }
      ]
    };
  }
}
