import {
  getEmotionalCheckInOption,
  normalizeCheckInContext,
  normalizeEmotionKey
} from "../../../../../../../domain/emotionalCheckIns/index.js?v=1.1.207-emotional-check-in-save";

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
      moodKey: emotion ? normalizeEmotionKey(emotion.key) : normalizeEmotionKey(payload.emotionKey),
      moodLabel: emotion ? emotion.label : "",
      moodCategory: emotion ? emotion.category : "",
      moodCategoryLabel: emotion ? emotion.categoryLabel : "",
      moodValue: emotion ? emotion.moodValue : null,
      checkInDate: context.localDate,
      source: context.checkInSource || "student_panel",
      version: "1.1.0"
    })
  };
}
