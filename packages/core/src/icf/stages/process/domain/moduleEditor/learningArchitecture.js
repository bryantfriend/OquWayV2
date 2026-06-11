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

export function parseLearningContentText(rawText) {
  var text = typeof rawText === "string" ? rawText : "";
  var lines = text.split(/\r?\n/);
  var vocabulary = [];
  var definitions = [];
  var customContent = [];
  var warnings = [];
  var lineIndex = 0;

  while (lineIndex < lines.length) {
    var line = lines[lineIndex].trim();
    if (line.length > 0) {
      appendParsedLearningLine(line, vocabulary, definitions, customContent, warnings, lineIndex + 1);
    }
    lineIndex = lineIndex + 1;
  }

  if (vocabulary.length === 0 && customContent.length === 0) {
    warnings.push({
      code: "NO_LEARNING_CONTENT_PARSED",
      message: "No vocabulary pairs were found. You can still add content manually."
    });
  }

  return {
    learningContent: createDefaultLearningContent({
      vocabulary: vocabulary,
      definitions: definitions,
      customContent: customContent
    }),
    warnings: warnings
  };
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

  var normalizedMode = createLearningModeRecord({
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

  if (Array.isArray(safeMode.steps)) {
    normalizedMode.steps = safeMode.steps.slice();
  }

  if (Array.isArray(safeMode.stepOrder)) {
    normalizedMode.stepOrder = safeMode.stepOrder.slice();
  } else if (Array.isArray(safeMode.steps)) {
    normalizedMode.stepOrder = safeMode.steps.map(function (step) {
      return step && step.id ? step.id : "";
    }).filter(Boolean);
  }

  normalizedMode.stepCount = typeof safeMode.stepCount === "number"
    ? safeMode.stepCount
    : (Array.isArray(normalizedMode.stepOrder) ? normalizedMode.stepOrder.length : 0);

  return normalizedMode;
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

export function createStarterStepsForMode(mode, learningContent, options) {
  var safeMode = mode && typeof mode === "object" ? mode : {};
  var modeType = readText(safeMode.modeType || safeMode.id, "primary");
  var content = createDefaultLearningContent(learningContent);
  var generatedAt = options && options.generatedAt ? options.generatedAt : Date.now();

  if (modeType === "review") {
    return createReviewStarterSteps(safeMode, content, generatedAt);
  }

  if (modeType === "practice") {
    return createPracticeStarterSteps(safeMode, content, generatedAt);
  }

  if (modeType === "assessment") {
    return createAssessmentStarterSteps(safeMode, content, generatedAt);
  }

  return createPrimaryStarterSteps(safeMode, content, generatedAt);
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

function appendParsedLearningLine(line, vocabulary, definitions, customContent, warnings, lineNumber) {
  var separatorIndex = findLearningContentSeparator(line);

  if (separatorIndex === -1) {
    customContent.push(line);
    warnings.push({
      code: "UNPAIRED_LEARNING_CONTENT_LINE",
      message: "Line " + lineNumber + " was added as custom content because it has no separator."
    });
    return;
  }

  var term = line.slice(0, separatorIndex).trim();
  var definition = line.slice(separatorIndex + readSeparatorLength(line, separatorIndex)).trim();

  if (!term || !definition) {
    customContent.push(line);
    warnings.push({
      code: "INCOMPLETE_LEARNING_CONTENT_PAIR",
      message: "Line " + lineNumber + " needs both a term and a definition."
    });
    return;
  }

  vocabulary.push(term);
  definitions.push(definition);
}

function findLearningContentSeparator(line) {
  var separators = ["=", "-", ":", "->"];
  var separatorIndex = -1;
  var index = 0;

  while (index < separators.length) {
    var foundIndex = line.indexOf(separators[index]);
    if (foundIndex > 0 && (separatorIndex === -1 || foundIndex < separatorIndex)) {
      separatorIndex = foundIndex;
    }
    index = index + 1;
  }

  return separatorIndex;
}

function readSeparatorLength(line, separatorIndex) {
  if (line.slice(separatorIndex, separatorIndex + 2) === "->") {
    return 2;
  }

  return 1;
}

function createPrimaryStarterSteps(mode, content, generatedAt) {
  return [
    createStarterStep(mode, "primer", 1, "textBriefing", "Primer", "Meet the key ideas before practice begins.", {
      body: createPrimerText(content),
      source: "learningContent"
    }, generatedAt),
    createStarterStep(mode, "simple-practice", 2, "vocabulary", "Simple Practice", "Practice the core vocabulary for this module.", {
      words: content.vocabulary.slice(0, 12)
    }, generatedAt),
    createStarterStep(mode, "reflection-check", 3, "reflection", "Reflection Check", "Write one thing you learned and one question you still have.", {
      prompt: "What do you remember from this module?"
    }, generatedAt)
  ];
}

function createReviewStarterSteps(mode, content, generatedAt) {
  return [
    createStarterStep(mode, "flashcard-review", 1, "vocabulary", "Flashcard Review", "Review important words and meanings.", {
      words: content.vocabulary.slice(0, 12)
    }, generatedAt),
    createStarterStep(mode, "matching-game", 2, "dragMatchIsland", "Matching Game", "Match each term with its meaning.", {
      pairs: createVocabularyPairs(content, 10)
    }, generatedAt)
  ];
}

function createPracticeStarterSteps(mode, content, generatedAt) {
  return [
    createStarterStep(mode, "practice-activity", 1, "vocabulary", "Practice Activity", "Build confidence with short repeated practice.", {
      words: content.vocabulary.slice(0, 15)
    }, generatedAt),
    createStarterStep(mode, "practice-game", 2, "dragMatchIsland", "Practice Game", "Use the learning content in a quick game.", {
      pairs: createVocabularyPairs(content, 12)
    }, generatedAt)
  ];
}

function createAssessmentStarterSteps(mode, content, generatedAt) {
  return [
    createStarterStep(mode, "quiz-question", 1, "reflection", "Quiz Question", "Answer a short check question from the module content.", {
      prompt: createAssessmentPrompt(content)
    }, generatedAt),
    createStarterStep(mode, "final-check", 2, "reflection", "Final Check", "Explain what you can now do after this module.", {
      prompt: "What can you do now that you could not do before?"
    }, generatedAt)
  ];
}

function createStarterStep(mode, key, order, type, title, instructions, config, generatedAt) {
  var modeId = readText(mode.id || mode.key, PRIMARY_MODE_ID);
  return {
    id: modeId + "-" + key,
    type: type,
    title: {
      en: title,
      ru: "",
      ky: ""
    },
    instructions: {
      en: instructions,
      ru: "",
      ky: ""
    },
    status: "draft",
    order: order,
    config: Object.assign({}, config || {}, {
      sourceType: "learningContent",
      sourceFields: readStarterStepSourceFields(type),
      generatedFromLearningContent: true,
      generatedAt: generatedAt,
      creatorCanEdit: true
    }),
    createdAt: generatedAt,
    updatedAt: generatedAt
  };
}

function readStarterStepSourceFields(stepType) {
  if (stepType === "dragMatchIsland") {
    return ["vocabulary", "definitions"];
  }

  if (stepType === "vocabulary") {
    return ["vocabulary"];
  }

  return ["vocabulary", "definitions", "concepts", "examples", "customContent"];
}

function createPrimerText(content) {
  if (content.vocabulary.length === 0 && content.customContent.length === 0) {
    return "Start this module by introducing the main idea, then add learning content when you are ready.";
  }

  var text = "In this module, students will explore: " + content.vocabulary.slice(0, 6).join(", ") + ".";
  if (content.customContent.length > 0) {
    text += " Notes: " + content.customContent.slice(0, 2).join(" ");
  }
  return text;
}

function createAssessmentPrompt(content) {
  if (content.vocabulary.length > 0) {
    return "Choose one term from this module and explain what it means: " + content.vocabulary.slice(0, 6).join(", ");
  }

  return "Explain the most important idea from this module in your own words.";
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
