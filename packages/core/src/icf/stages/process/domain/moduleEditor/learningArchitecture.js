export const PRIMARY_MODE_ID = "primary";

export function createDefaultLearningContent(existingContent) {
  var content = existingContent && typeof existingContent === "object" && !Array.isArray(existingContent)
    ? existingContent
    : {};

  return {
    vocabulary: readArray(content.vocabulary),
    definitions: readArray(content.definitions),
    concepts: readArray(content.concepts),
    rules: readArray(content.rules),
    examples: readArray(content.examples),
    images: readArray(content.images),
    audio: readArray(content.audio),
    video: readArray(content.video),
    attachments: readArray(content.attachments),
    customContent: readArray(content.customContent),
    notes: readText(content.notes, "")
  };
}

export function normalizeLearningContentPayload(payload) {
  var content = payload && payload.learningContent ? payload.learningContent : {};
  return createDefaultLearningContent(content);
}

export function createDefaultLearningModes(existingModes, sessions) {
  var modes = existingModes && typeof existingModes === "object" && !Array.isArray(existingModes)
    ? existingModes
    : {};
  var normalizedModes = {};
  var hasPrimary = false;

  Object.keys(modes).forEach(function (modeId) {
    var mode = normalizeLearningMode(modeId, modes[modeId], null);
    if (mode.status !== "deleted") {
      normalizedModes[mode.id] = mode;
      if (mode.id === PRIMARY_MODE_ID) {
        hasPrimary = true;
      }
    }
  });

  if (!hasPrimary) {
    var primarySession = findFirstSession(sessions);
    normalizedModes[PRIMARY_MODE_ID] = createLearningModeRecord({
      modeId: PRIMARY_MODE_ID,
      title: "Primary Mode",
      purpose: "Main learning path for this module.",
      modeType: "primary",
      order: 1,
      required: true,
      legacySessionId: primarySession ? primarySession.id : null
    });
  }

  return normalizedModes;
}

export function createLearningModesForTemplate(templateKey, sessions) {
  var template = readTemplateKey(templateKey);
  var modes = {};
  var specs = readTemplateSpecs(template);
  var sessionIndex = 0;

  specs.forEach(function (spec, index) {
    var session = Array.isArray(sessions) && sessions.length > sessionIndex ? sessions[sessionIndex] : null;
    modes[spec.id] = createLearningModeRecord({
      modeId: spec.id,
      title: spec.title,
      purpose: spec.purpose,
      modeType: spec.modeType,
      order: index + 1,
      required: spec.id === PRIMARY_MODE_ID,
      legacySessionId: session ? session.id : null,
      generatedFrom: null
    });
    sessionIndex = sessionIndex + 1;
  });

  return modes;
}

export function createLearningModeRecord(options) {
  var id = readText(options.modeId, generateLearningModeId(options.modeType || "custom"));

  return {
    id: id,
    key: id,
    title: readText(options.title, "Custom Mode"),
    purpose: readText(options.purpose, "Custom learning experience."),
    modeType: readText(options.modeType, "custom"),
    status: readText(options.status, "draft"),
    order: readNumber(options.order, 99),
    required: Boolean(options.required),
    canDelete: !Boolean(options.required) && id !== PRIMARY_MODE_ID,
    legacySessionId: options.legacySessionId || null,
    generated: Boolean(options.generated),
    generatedFrom: options.generatedFrom || null,
    createdAt: options.createdAt || Date.now(),
    updatedAt: Date.now()
  };
}

export function normalizeLearningMode(modeId, mode, fallbackSession) {
  var safeMode = mode && typeof mode === "object" && !Array.isArray(mode) ? mode : {};
  var id = readText(safeMode.id || safeMode.key || modeId, PRIMARY_MODE_ID);
  var title = readText(safeMode.title, fallbackSession ? readLocalizedTitle(fallbackSession.title, "Learning Mode") : "Learning Mode");

  return createLearningModeRecord({
    modeId: id,
    title: title,
    purpose: safeMode.purpose || safeMode.description || "",
    modeType: safeMode.modeType || (id === PRIMARY_MODE_ID ? "primary" : "custom"),
    status: safeMode.status || "draft",
    order: safeMode.order,
    required: safeMode.required || id === PRIMARY_MODE_ID,
    legacySessionId: safeMode.legacySessionId || (fallbackSession ? fallbackSession.id : null),
    generated: safeMode.generated,
    generatedFrom: safeMode.generatedFrom,
    createdAt: safeMode.createdAt
  });
}

export function createModeFromPayload(payload, existingModes) {
  var modeId = readText(payload.modeId, generateLearningModeId(payload.modeType || "custom"));
  var order = Object.keys(existingModes || {}).length + 1;

  return createLearningModeRecord({
    modeId: modeId,
    title: payload.title,
    purpose: payload.purpose,
    modeType: payload.modeType || modeId,
    order: order,
    required: modeId === PRIMARY_MODE_ID
  });
}

export function createPulledStepDraft(payload, learningContent) {
  var stepType = readText(payload.stepType, "customExperience");
  var source = readText(payload.source, "vocabulary");
  var content = createDefaultLearningContent(learningContent);

  if (stepType === "dragMatchIsland" || stepType === "matchingGame") {
    return {
      type: "dragMatchIsland",
      title: "Vocabulary Match",
      config: {
        source: source,
        pairs: createVocabularyPairs(content, readNumber(payload.limit, 10))
      }
    };
  }

  if (stepType === "vocabulary") {
    return {
      type: "vocabulary",
      title: "Vocabulary Review",
      config: {
        words: content.vocabulary.slice(0, readNumber(payload.limit, 12))
      }
    };
  }

  if (stepType === "reflection") {
    return {
      type: "reflection",
      title: "Learning Reflection",
      config: {
        prompt: "What do you remember from this module's learning content?"
      }
    };
  }

  return {
    type: stepType,
    title: "Generated Draft",
    config: {
      source: source,
      items: readContentSource(content, source).slice(0, readNumber(payload.limit, 10))
    }
  };
}

export function readTemplateSpecs(templateKey) {
  if (templateKey === "school") {
    return [
      { id: PRIMARY_MODE_ID, title: "Primary Mode", purpose: "Full student lesson path.", modeType: "primary" },
      { id: "review", title: "Review Mode", purpose: "Reinforce the primary lesson.", modeType: "review" }
    ];
  }

  if (templateKey === "intensive") {
    return [
      { id: PRIMARY_MODE_ID, title: "Primary Mode", purpose: "Full student lesson path.", modeType: "primary" },
      { id: "review", title: "Review Mode", purpose: "Structured review after the lesson.", modeType: "review" },
      { id: "practice", title: "Practice Mode", purpose: "Independent skill repetition.", modeType: "practice" },
      { id: "assessment", title: "Assessment Mode", purpose: "Check understanding and readiness.", modeType: "assessment" }
    ];
  }

  return [
    { id: PRIMARY_MODE_ID, title: "Primary Mode", purpose: templateKey === "educationCenter" ? "Reinforcement path after teacher-led lesson." : "Main learning path for this module.", modeType: "primary" }
  ];
}

export function readTemplateKey(value) {
  if (value === "school" || value === "educationCenter" || value === "intensive" || value === "custom") {
    return value;
  }

  return "custom";
}

export function generateLearningModeId(prefix) {
  return readText(prefix, "mode").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()
    + "-" + Date.now().toString(36)
    + "-" + Math.random().toString(36).slice(2, 6);
}

function findFirstSession(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return null;
  }

  return sessions[0];
}

function createVocabularyPairs(content, limit) {
  var pairs = [];
  var vocabulary = content.vocabulary;
  var definitions = content.definitions;
  var index = 0;

  while (index < vocabulary.length && pairs.length < limit) {
    pairs.push({
      term: readContentItemText(vocabulary[index]),
      match: readContentItemText(definitions[index]) || readContentItemText(vocabulary[index])
    });
    index = index + 1;
  }

  return pairs;
}

function readContentSource(content, source) {
  if (source === "definitions") return content.definitions;
  if (source === "concepts") return content.concepts;
  if (source === "rules") return content.rules;
  if (source === "examples") return content.examples;
  return content.vocabulary;
}

function readArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice();
}

function readContentItemText(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object") {
    return readText(value.term || value.word || value.title || value.text || value.definition, "");
  }

  return "";
}

function readLocalizedTitle(title, fallback) {
  if (typeof title === "string") {
    return title;
  }

  if (title && typeof title === "object") {
    return readText(title.en || title.default, fallback);
  }

  return fallback;
}

function readText(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  var trimmed = value.trim();
  return trimmed || fallback;
}

function readNumber(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallback;
}
