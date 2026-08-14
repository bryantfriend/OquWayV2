export const COURSE_IMPORT_SCHEMA_VERSION = 1;
export const COURSE_IMPORT_MAX_MODULES = 12;
export const COURSE_IMPORT_MAX_MODES_PER_MODULE = 6;
export const COURSE_IMPORT_MAX_STEPS = 200;

export const COURSE_IMPORT_STEP_TYPES = [
  "textBriefing",
  "vocabulary",
  "phrase",
  "listening",
  "speakingPrompt",
  "reflection",
  "customExperience",
  "cyberCodeMission",
  "dragMatchIsland",
  "externalTask",
  "cardReveal"
];

var STEP_TYPE_ALIASES = {
  "card-reveal": "cardReveal",
  "intro-card": "textBriefing",
  introCard: "textBriefing",
  sorting: "dragMatchIsland",
  roadmap: "customExperience",
  "multiple-choice": "customExperience",
  multipleChoice: "customExperience",
  "multi-select": "customExperience",
  multiSelect: "customExperience"
};

var LEARNING_CONTENT_KEYS = [
  "vocabulary",
  "definitions",
  "concepts",
  "rules",
  "examples",
  "images",
  "audio",
  "video",
  "attachments",
  "customContent"
];

export function parseCourseImportText(rawText) {
  var text = typeof rawText === "string" ? rawText.trim() : "";

  if (!text) {
    throw createImportError("IMPORT_EMPTY", "Paste the JSON created by ChatGPT.");
  }

  if (text.length > 1000000) {
    throw createImportError("IMPORT_TOO_LARGE", "The pasted JSON is larger than 1 MB.");
  }

  text = stripMarkdownFence(text);
  text = stripJavaScriptWrapper(text);

  try {
    return JSON.parse(text);
  } catch (error) {
    throw createImportError(
      "IMPORT_INVALID_JSON",
      "The pasted code is not valid JSON. Ask ChatGPT to return JSON only. " + error.message
    );
  }
}

export function normalizeCourseImportDefinition(input) {
  var root = readPlainObject(input);
  var extracted = extractCourseAndModules(root);
  var modules = extracted.modules;
  var errors = [];
  var warnings = [];

  if (modules.length === 0) {
    errors.push(createIssue("IMPORT_MODULES_REQUIRED", "Add at least one module.", "modules"));
  }

  if (modules.length > COURSE_IMPORT_MAX_MODULES) {
    errors.push(createIssue(
      "IMPORT_TOO_MANY_MODULES",
      "Import up to " + COURSE_IMPORT_MAX_MODULES + " modules at a time.",
      "modules"
    ));
  }

  var normalizedModules = modules.slice(0, COURSE_IMPORT_MAX_MODULES).map(function (module, moduleIndex) {
    return normalizeModule(module, moduleIndex, errors, warnings);
  });
  var totalSteps = normalizedModules.reduce(function (count, module) {
    return count + module.learningModes.reduce(function (modeCount, mode) {
      return modeCount + mode.steps.length;
    }, 0);
  }, 0);

  if (totalSteps > COURSE_IMPORT_MAX_STEPS) {
    errors.push(createIssue(
      "IMPORT_TOO_MANY_STEPS",
      "Import up to " + COURSE_IMPORT_MAX_STEPS + " steps at a time.",
      "modules"
    ));
  }

  var normalized = {
    schemaVersion: COURSE_IMPORT_SCHEMA_VERSION,
    course: normalizeCourseMetadata(extracted.course),
    modules: normalizedModules,
    counts: {
      modules: normalizedModules.length,
      modes: normalizedModules.reduce(function (count, module) {
        return count + module.learningModes.length;
      }, 0),
      steps: totalSteps
    },
    warnings: warnings
  };

  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings,
    data: normalized
  };
}

export function buildChatGPTCourseImportPrompt(courseContext) {
  var context = readPlainObject(courseContext);
  var courseTitle = readText(context.title, "this course");
  var courseSubject = readText(context.subject, "");
  var courseLevel = readText(context.level, "");
  var contextLine = "Create a complete course that I can import into OquWay.";

  if (courseTitle || courseSubject || courseLevel) {
    contextLine += " Current course context: title=\"" + courseTitle + "\", subject=\"" + courseSubject + "\", level=\"" + courseLevel + "\".";
  }

  return [
    contextLine,
    "",
    "Return ONLY valid JSON. Do not use markdown fences, comments, trailing commas, JavaScript variables, or explanatory text.",
    "Use this exact top-level shape:",
    JSON.stringify(createCourseImportExample(), null, 2),
    "",
    "Rules:",
    "- schemaVersion must be 1.",
    "- Include 1-" + COURSE_IMPORT_MAX_MODULES + " complete modules and no more than " + COURSE_IMPORT_MAX_STEPS + " total steps.",
    "- Every module needs a title and at least one learning mode. Use id \"primary\" for the main path.",
    "- Supported step types: " + COURSE_IMPORT_STEP_TYPES.join(", ") + ".",
    "- Every step needs type, title, instructions, and a config object.",
    "- Keep all student-facing wording age-appropriate, specific, and ready to teach.",
    "- Use textBriefing config {heading, bodyText, calloutText, imageUrl}.",
    "- Use vocabulary config {word, translation, exampleSentence, imageUrl, audioUrl}.",
    "- Use phrase config {phrase, meaning, exampleSentence, audioUrl}.",
    "- Use listening config {prompt, transcript, audioUrl, question}.",
    "- Use speakingPrompt config {prompt, exampleResponse, preparationSeconds, speakingSeconds}.",
    "- Use reflection config {prompt, sentenceStarter, minLength}.",
    "- Use dragMatchIsland config {pairs:[{left,right}]}.",
    "- Use cardReveal config {cards:[{front,back}]}.",
    "- Use externalTask config {taskTitle, taskDescription, submissionInstructions}.",
    "- Use customExperience or cyberCodeMission only when their config contains everything needed to render the activity.",
    "- Leave media URLs as empty strings unless you have a real public URL.",
    "- Use learningContent arrays to capture reusable vocabulary, definitions, concepts, rules, and examples.",
    "- Set course metadata and all module content in the language requested by the course context."
  ].join("\n");
}

export function createCourseImportExample() {
  return {
    schemaVersion: COURSE_IMPORT_SCHEMA_VERSION,
    course: {
      title: "Digital Safety Foundations",
      description: "A practical introduction to safe online choices.",
      subject: "ICT",
      level: "Grade 7",
      language: "en"
    },
    modules: [
      {
        title: "Strong Passwords",
        description: "Students learn how to build and protect strong passwords.",
        subject: "ICT",
        topic: "Cyber safety",
        level: "Grade 7",
        estimatedMinutes: 30,
        language: "en",
        learningContent: {
          vocabulary: ["password", "passphrase"],
          definitions: ["A secret used to access an account.", "A longer password made from several words."],
          concepts: ["Length and uniqueness make passwords safer."],
          rules: ["Never reuse an important password."],
          examples: ["A passphrase can combine unrelated memorable words."],
          customContent: [],
          notes: ""
        },
        learningModes: [
          {
            id: "primary",
            title: "Learn",
            purpose: "Understand and apply the core idea.",
            modeType: "primary",
            steps: [
              {
                type: "textBriefing",
                title: "Why passwords matter",
                instructions: "Read the short briefing.",
                config: {
                  heading: "Your first line of defense",
                  bodyText: "A strong, unique password helps keep an account private.",
                  calloutText: "Long and unique beats short and complicated.",
                  imageUrl: ""
                }
              },
              {
                type: "reflection",
                title: "Make a safer choice",
                instructions: "Explain one change you can make.",
                config: {
                  prompt: "What is one habit that makes passwords safer?",
                  sentenceStarter: "I can make my passwords safer by...",
                  minLength: 20
                }
              }
            ]
          }
        ]
      }
    ]
  };
}

function extractCourseAndModules(root) {
  if (!root) {
    return { course: {}, modules: [] };
  }

  if (root.course && isPlainObject(root.course) && Array.isArray(root.course.modules)) {
    return {
      course: root.course,
      modules: root.course.modules
    };
  }

  if (Array.isArray(root.modules)) {
    return {
      course: root.course && isPlainObject(root.course) ? root.course : root,
      modules: root.modules
    };
  }

  if (root.module && isPlainObject(root.module)) {
    return {
      course: root.course && isPlainObject(root.course) ? root.course : {},
      modules: [root.module]
    };
  }

  if (looksLikeModule(root)) {
    return {
      course: {},
      modules: [root]
    };
  }

  return {
    course: root.course && isPlainObject(root.course) ? root.course : {},
    modules: []
  };
}

function normalizeCourseMetadata(course) {
  var safeCourse = readPlainObject(course);

  return {
    title: readText(safeCourse.title, ""),
    description: readText(safeCourse.description, ""),
    subject: readText(safeCourse.subject, ""),
    level: readText(safeCourse.level || safeCourse.grade, ""),
    language: normalizeLanguage(safeCourse.language || safeCourse.defaultLanguage),
    tags: normalizeStringArray(safeCourse.tags, 30)
  };
}

function normalizeModule(module, moduleIndex, errors, warnings) {
  var safeModule = readPlainObject(module);
  var path = "modules[" + moduleIndex + "]";
  var title = readText(safeModule.title || safeModule.name, "");
  var modesInput = normalizeModesInput(safeModule);

  if (modesInput.length > COURSE_IMPORT_MAX_MODES_PER_MODULE) {
    errors.push(createIssue(
      "IMPORT_TOO_MANY_MODES",
      "Module " + (moduleIndex + 1) + " has too many learning modes. Use up to " + COURSE_IMPORT_MAX_MODES_PER_MODULE + ".",
      path + ".learningModes"
    ));
    modesInput = modesInput.slice(0, COURSE_IMPORT_MAX_MODES_PER_MODULE);
  }
  var modeIds = {};
  var learningModes = [];

  if (!title) {
    errors.push(createIssue("IMPORT_MODULE_TITLE_REQUIRED", "Module " + (moduleIndex + 1) + " needs a title.", path + ".title"));
    title = "Untitled Module";
  }

  modesInput.forEach(function (mode, modeIndex) {
    var normalizedMode = normalizeMode(mode, modeIndex, path, errors, warnings);
    var baseId = normalizedMode.id;
    var suffix = 2;

    while (modeIds[normalizedMode.id]) {
      normalizedMode.id = baseId + "-" + suffix;
      suffix += 1;
    }

    if (normalizedMode.id !== baseId) {
      warnings.push(createIssue(
        "IMPORT_DUPLICATE_MODE_ID",
        "A duplicate learning mode id was renamed to " + normalizedMode.id + ".",
        path + ".learningModes[" + modeIndex + "].id"
      ));
    }

    modeIds[normalizedMode.id] = true;
    learningModes.push(normalizedMode);
  });

  if (learningModes.length === 0) {
    learningModes.push(normalizeMode({
      id: "primary",
      title: "Primary Mode",
      modeType: "primary",
      steps: []
    }, 0, path, errors, warnings));
    warnings.push(createIssue(
      "IMPORT_EMPTY_MODE_CREATED",
      "A primary learning mode was added to " + title + ".",
      path + ".learningModes"
    ));
  }

  if (!learningModes.some(function (mode) { return mode.id === "primary"; })) {
    learningModes[0].id = "primary";
    learningModes[0].modeType = "primary";
    warnings.push(createIssue(
      "IMPORT_PRIMARY_MODE_ASSIGNED",
      "The first learning mode in " + title + " was assigned the required id \"primary\".",
      path + ".learningModes[0].id"
    ));
  }

  return {
    title: title,
    description: readText(safeModule.description, ""),
    subject: readText(safeModule.subject, ""),
    topic: readText(safeModule.topic, ""),
    level: readText(safeModule.level || safeModule.grade, ""),
    estimatedMinutes: normalizeNumber(safeModule.estimatedMinutes, 15, 1, 600),
    language: normalizeLanguage(safeModule.language),
    status: "draft",
    learningContent: normalizeLearningContent(safeModule.learningContent),
    learningModes: learningModes
  };
}

function normalizeModesInput(module) {
  if (Array.isArray(module.learningModes)) {
    return module.learningModes;
  }

  if (isPlainObject(module.learningModes)) {
    return Object.keys(module.learningModes).map(function (modeId) {
      var value = module.learningModes[modeId];

      if (Array.isArray(value)) {
        return { id: modeId, steps: value };
      }

      return Object.assign({}, readPlainObject(value), { id: readPlainObject(value).id || modeId });
    });
  }

  if (Array.isArray(module.steps)) {
    return [{
      id: "primary",
      title: "Primary Mode",
      purpose: "Main learning path for this module.",
      modeType: "primary",
      steps: module.steps
    }];
  }

  return [];
}

function normalizeMode(mode, modeIndex, modulePath, errors, warnings) {
  var safeMode = readPlainObject(mode);
  var path = modulePath + ".learningModes[" + modeIndex + "]";
  var id = normalizeIdentifier(safeMode.id || safeMode.key || safeMode.modeType || ("mode-" + (modeIndex + 1)));
  var steps = Array.isArray(safeMode.steps) ? safeMode.steps : [];

  return {
    id: id || "mode-" + (modeIndex + 1),
    title: readText(safeMode.title, id === "primary" ? "Primary Mode" : "Learning Mode"),
    purpose: readText(safeMode.purpose || safeMode.description, ""),
    modeType: readText(safeMode.modeType || safeMode.type, id === "primary" ? "primary" : "custom"),
    practiceModeKey: normalizePracticeModeKey(safeMode.practiceModeKey),
    steps: steps.map(function (step, stepIndex) {
      return normalizeStep(step, stepIndex, path, errors, warnings);
    })
  };
}

function normalizeStep(step, stepIndex, modePath, errors, warnings) {
  var safeStep = readPlainObject(step);
  var path = modePath + ".steps[" + stepIndex + "]";
  var rawType = readText(safeStep.type || safeStep.stepType || safeStep.stepTypeId, "");
  var type = STEP_TYPE_ALIASES[rawType] || rawType;
  var title = readText(safeStep.title || safeStep.name, "");

  if (COURSE_IMPORT_STEP_TYPES.indexOf(type) === -1) {
    errors.push(createIssue(
      "IMPORT_UNSUPPORTED_STEP_TYPE",
      "Unsupported step type \"" + (rawType || "missing") + "\". Choose one of: " + COURSE_IMPORT_STEP_TYPES.join(", ") + ".",
      path + ".type"
    ));
    type = "customExperience";
  }

  if (!title) {
    title = defaultStepTitle(type, stepIndex);
    warnings.push(createIssue(
      "IMPORT_STEP_TITLE_DEFAULTED",
      "A missing step title was replaced with \"" + title + "\".",
      path + ".title"
    ));
  }

  return {
    type: type,
    title: title,
    instructions: readText(safeStep.instructions, ""),
    status: "draft",
    practiceModeKey: normalizePracticeModeKey(safeStep.practiceModeKey),
    config: sanitizeJsonValue(isPlainObject(safeStep.config) ? safeStep.config : {}, 0)
  };
}

function normalizeLearningContent(content) {
  var safeContent = readPlainObject(content);
  var normalized = {};

  LEARNING_CONTENT_KEYS.forEach(function (key) {
    normalized[key] = normalizeStringArray(safeContent[key], 100);
  });
  normalized.notes = readText(safeContent.notes, "");

  return normalized;
}

function sanitizeJsonValue(value, depth) {
  if (depth > 8) {
    return null;
  }

  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (Array.isArray(value)) {
    return value.slice(0, 100).map(function (item) {
      return sanitizeJsonValue(item, depth + 1);
    });
  }

  if (isPlainObject(value)) {
    var result = {};
    Object.keys(value).slice(0, 100).forEach(function (key) {
      if (!/^__.*__$/.test(key)) {
        result[key] = sanitizeJsonValue(value[key], depth + 1);
      }
    });
    return result;
  }

  return String(value);
}

function stripMarkdownFence(text) {
  var match = text.match(/^```(?:json|javascript|js)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : text;
}

function stripJavaScriptWrapper(text) {
  var stripped = text
    .replace(/^\s*(?:export\s+default\s+|(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*)/, "")
    .trim();

  if (stripped.endsWith(";")) {
    stripped = stripped.slice(0, -1).trim();
  }

  return stripped;
}

function looksLikeModule(value) {
  return isPlainObject(value) && (
    Array.isArray(value.steps) ||
    Array.isArray(value.learningModes) ||
    isPlainObject(value.learningModes)
  );
}

function normalizeStringArray(value, limit) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, limit).map(function (item) {
    return readText(item, "");
  }).filter(Boolean);
}

function normalizeLanguage(value) {
  var language = readText(value, "en").toLowerCase();
  return language === "ru" || language === "ky" ? language : "en";
}

function normalizeIdentifier(value) {
  return readText(value, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function normalizePracticeModeKey(value) {
  var key = readText(value, "");
  return key === "beforeClass" || key === "classroomLesson" || key === "dailyPractice" || key === "afterClass"
    ? key
    : "";
}

function normalizeNumber(value, fallback, minimum, maximum) {
  var parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function defaultStepTitle(type, stepIndex) {
  var label = type.replace(/([A-Z])/g, " $1").replace(/^./, function (letter) {
    return letter.toUpperCase();
  });
  return label + " " + (stepIndex + 1);
}

function readText(value, fallback) {
  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  if (isPlainObject(value)) {
    return readText(value.en || value.ru || value.ky, fallback);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

function readPlainObject(value) {
  return isPlainObject(value) ? value : {};
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function createIssue(code, message, path) {
  return {
    code: code,
    message: message,
    path: path || ""
  };
}

function createImportError(code, message) {
  var error = new Error(message);
  error.code = code;
  return error;
}
