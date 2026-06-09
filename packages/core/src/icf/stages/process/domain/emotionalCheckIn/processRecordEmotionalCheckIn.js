import { saveEmotionalCheckIn } from "../../../../../../../domain/emotionalCheckIns/index.js?v=1.1.161-universal-check-in";

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
          message: "Failed to save emotional check-in: " + (error && error.message ? error.message : "Unknown error.")
        }
      ]
    };
  }
}
