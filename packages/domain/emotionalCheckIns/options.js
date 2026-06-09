export const EMOTIONAL_CHECK_IN_OPTIONS = [
  { key: "happy", emoji: "😊", label: "Happy" },
  { key: "excited", emoji: "😄", label: "Excited" },
  { key: "calm", emoji: "😌", label: "Calm" },
  { key: "okay", emoji: "🙂", label: "Okay" },
  { key: "confident", emoji: "😎", label: "Confident" },
  { key: "curious", emoji: "🤔", label: "Curious" },
  { key: "focused", emoji: "🎯", label: "Focused" },
  { key: "motivated", emoji: "🚀", label: "Motivated" },
  { key: "peaceful", emoji: "🌿", label: "Peaceful" },
  { key: "tired", emoji: "😴", label: "Tired" },
  { key: "sleepy", emoji: "🥱", label: "Sleepy" },
  { key: "bored", emoji: "😐", label: "Bored" },
  { key: "confused", emoji: "😕", label: "Confused" },
  { key: "nervous", emoji: "😬", label: "Nervous" },
  { key: "worried", emoji: "😟", label: "Worried" },
  { key: "overwhelmed", emoji: "😰", label: "Overwhelmed" },
  { key: "frustrated", emoji: "😤", label: "Frustrated" },
  { key: "angry", emoji: "😡", label: "Angry" },
  { key: "sad", emoji: "😢", label: "Sad" },
  { key: "quiet", emoji: "😶", label: "Quiet" },
  { key: "not-feeling-well", emoji: "🤒", label: "Not Feeling Well" },
  { key: "silly", emoji: "🙃", label: "Silly" },
  { key: "prefer-not-to-say", emoji: "🤐", label: "I Don't Want to Say" }
];

export function normalizeEmotionKey(value) {
  return readText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getEmotionalCheckInOption(value) {
  var key = normalizeEmotionKey(value);
  var index = 0;

  while (index < EMOTIONAL_CHECK_IN_OPTIONS.length) {
    if (EMOTIONAL_CHECK_IN_OPTIONS[index].key === key) {
      return EMOTIONAL_CHECK_IN_OPTIONS[index];
    }
    index += 1;
  }

  return null;
}

export function isKnownEmotionalCheckInOption(value) {
  return getEmotionalCheckInOption(value) !== null;
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}
