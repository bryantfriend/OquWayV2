export const EMOTIONAL_CHECK_IN_CATEGORIES = [
  {
    key: "ready",
    label: "Ready To Learn",
    moodValue: 2,
    options: [
      { key: "happy", emoji: "😊", label: "Happy" },
      { key: "motivated", emoji: "🚀", label: "Motivated" },
      { key: "confident", emoji: "😎", label: "Confident" }
    ]
  },
  {
    key: "neutral",
    label: "Neutral",
    moodValue: 1,
    options: [
      { key: "okay", emoji: "🙂", label: "Okay" },
      { key: "calm", emoji: "😌", label: "Calm" },
      { key: "quiet", emoji: "😶", label: "Quiet" }
    ]
  },
  {
    key: "lowEnergy",
    label: "Low Energy",
    moodValue: 0,
    options: [
      { key: "tired", emoji: "😴", label: "Tired" },
      { key: "sleepy", emoji: "🥱", label: "Sleepy" },
      { key: "bored", emoji: "😐", label: "Bored" }
    ]
  },
  {
    key: "needSupport",
    label: "Need Support",
    moodValue: -1,
    options: [
      { key: "confused", emoji: "😕", label: "Confused" },
      { key: "nervous", emoji: "😬", label: "Nervous" },
      { key: "worried", emoji: "😟", label: "Worried" },
      { key: "overwhelmed", emoji: "😰", label: "Overwhelmed" },
      { key: "frustrated", emoji: "😤", label: "Frustrated" },
      { key: "angry", emoji: "😡", label: "Angry" },
      { key: "sad", emoji: "😢", label: "Sad" },
      { key: "notFeelingWell", emoji: "🤒", label: "Not Feeling Well" }
    ]
  },
  {
    key: "other",
    label: "Other",
    moodValue: null,
    options: [
      { key: "silly", emoji: "🙃", label: "Silly" },
      { key: "preferNotToSay", emoji: "🤐", label: "I Don't Want To Say" }
    ]
  }
];

export const EMOTIONAL_CHECK_IN_OPTIONS = createFlatOptions();

export function normalizeEmotionKey(value) {
  var text = readText(value);
  var normalized = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (normalized === "not-feeling-well" || normalized === "notfeelingwell") {
    return "notFeelingWell";
  }

  if (normalized === "prefer-not-to-say" || normalized === "i-don-t-want-to-say" || normalized === "prefernot-tosay" || normalized === "prefernottosay") {
    return "preferNotToSay";
  }

  return normalized;
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

export function getEmotionalCheckInCategory(value) {
  var option = getEmotionalCheckInOption(value);
  return option ? option.category : null;
}

function createFlatOptions() {
  var options = [];

  EMOTIONAL_CHECK_IN_CATEGORIES.forEach(function (category) {
    category.options.forEach(function (option) {
      options.push(Object.assign({}, option, {
        category: category.key,
        categoryLabel: category.label,
        moodValue: category.moodValue
      }));
    });
  });

  return options;
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}
