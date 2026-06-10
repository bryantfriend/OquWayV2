import {
  getEmotionalCheckInOption,
  normalizeCheckInContext,
  normalizeEmotionKey
} from "../../../../../../../domain/emotionalCheckIns/index.js?v=1.1.162-modal-stack";

export function normalizeEmotionalCheckInPayload(executionState) {
  var payload = executionState.payload || {};
  var emotion = getEmotionalCheckInOption(payload.emotionKey);
  var context = normalizeCheckInContext(payload);

  return {
    valid: true,
    data: Object.assign({}, context, {
    emotionKey: normalizeEmotionKey(payload.emotionKey),
    emotionLabel: emotion ? emotion.label : "",
    emoji: emotion ? emotion.emoji : "",
    version: "1.0.0"
    })
  };
}
