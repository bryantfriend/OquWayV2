import { listStepTypeDefinitions, normalizeStepType } from "../stepTypes/stepTypeRegistry.js?v=1.1.224-learning-activity-editor-stability";
import { cardRevealActivityDefinition } from "./card-reveal/cardReveal.registry.js?v=1.1.224-learning-activity-editor-stability";

var learningActivities = createLearningActivities();

var activityAliases = {
  "card-reveal": "cardReveal",
  "introCard": "intro-card",
  "intro-card": "intro-card",
  sorting: "sorting",
  roadmap: "roadmap",
  "multiple-choice": "multiple-choice",
  multipleChoice: "multiple-choice",
  "multi-select": "multi-select",
  multiSelect: "multi-select"
};

var unknownActivityWarnings = {};
var unknownTemplateWarnings = {};

export function listLearningActivityDefinitions() {
  return Object.keys(learningActivities).map(function (activityType) {
    return learningActivities[activityType];
  }).sort(function (a, b) {
    return readActivityText(a, "displayName", "").localeCompare(readActivityText(b, "displayName", ""));
  });
}

export function getLearningActivityDefinition(activityType) {
  var normalizedActivityType = normalizeLearningActivityType(activityType);

  if (!normalizedActivityType || !learningActivities[normalizedActivityType]) {
    warnUnknownActivity(activityType);
    return null;
  }

  return learningActivities[normalizedActivityType];
}

export function getLearningActivityTemplateDefinition(activityType, templateId) {
  var activityDefinition = getLearningActivityDefinition(activityType);
  var normalizedTemplateId = readRequestedTemplateId(activityDefinition, templateId);
  var templates = activityDefinition && Array.isArray(activityDefinition.templates) ? activityDefinition.templates : [];
  var index = 0;

  while (index < templates.length) {
    if (templates[index].meta && templates[index].meta.templateId === normalizedTemplateId) {
      return templates[index];
    }

    index = index + 1;
  }

  warnUnknownTemplate(activityDefinition, templateId);
  return null;
}

export function normalizeLearningActivityTemplateId(activityType, templateId) {
  var activityDefinition = getLearningActivityDefinition(activityType);
  var defaultTemplate = readActivityDefaultTemplate(activityDefinition);

  if (!activityDefinition) {
    return templateId || "";
  }

  if (getLearningActivityTemplateDefinition(activityType, templateId)) {
    return templateId || defaultTemplate;
  }

  console.warn("[LearningActivityRegistry] Explicit template fallback", {
    activityType: activityType || "",
    requestedTemplateId: templateId || "",
    fallbackTemplateId: defaultTemplate
  });

  return defaultTemplate;
}

export function checkLearningActivityRegistryIntegrity() {
  var activities = listLearningActivityDefinitions();
  var warnings = [];
  var templateCount = 0;
  var index = 0;

  while (index < activities.length) {
    var activity = activities[index];
    var templates = activity && Array.isArray(activity.templates) ? activity.templates : [];
    templateCount = templateCount + templates.length;

    requireActivityField(activity, "activityType", warnings);
    requireActivityField(activity, "displayName", warnings);
    requireActivityField(activity, "legacyStepType", warnings);
    requireActivityField(activity, "defaultTemplateId", warnings);
    requireActivityField(activity, "category", warnings);
    requireActivityField(activity, "icon", warnings);

    if (templates.length === 0) {
      warnings.push(readActivityText(activity, "activityType", "unknown") + " has no templates");
    }

    index = index + 1;
  }

  console.info("[LearningActivityRegistry] Loaded " + activities.length + " activities, " + templateCount + " templates, " + warnings.length + " warnings");

  if (warnings.length > 0) {
    console.warn("[LearningActivityRegistry] Integrity warnings", warnings);
  }

  return {
    activityCount: activities.length,
    templateCount: templateCount,
    warningCount: warnings.length,
    warnings: warnings
  };
}

function normalizeLearningActivityType(activityType) {
  if (typeof activityType !== "string" || activityType.length === 0) {
    return "";
  }

  if (activityAliases[activityType]) {
    return activityAliases[activityType];
  }

  var normalizedStepType = normalizeStepType(activityType);
  if (learningActivities[normalizedStepType]) {
    return normalizedStepType;
  }

  return activityType;
}

function createLearningActivities() {
  var activities = {};
  var stepDefinitions = listStepTypeDefinitions();
  var index = 0;

  while (index < stepDefinitions.length) {
    var StepTypeDefinition = stepDefinitions[index];
    var stepType = readStepDefinitionText(StepTypeDefinition, "type", "");

    if (stepType) {
      activities[stepType] = createStepBackedActivityDefinition(StepTypeDefinition, stepType, "");
    }

    index = index + 1;
  }

  activities.cardReveal = enrichCardRevealActivityDefinition();
  addLegacyActivityDefinitions(activities);
  return activities;
}

function addLegacyActivityDefinitions(activities) {
  activities["intro-card"] = createLegacyActivityDefinition({
    activityType: "intro-card",
    legacyStepType: "textBriefing",
    displayName: "Intro Card",
    description: "A focused opening card for a lesson objective, hook, or brief context.",
    icon: "fa-solid fa-id-card",
    category: "Basic",
    complexity: "Easy",
    seedConfig: {
      heading: "Lesson Introduction",
      bodyText: "Start here to understand the main idea.",
      calloutText: "Look for the one concept you should remember."
    }
  });

  activities.sorting = createLegacyActivityDefinition({
    activityType: "sorting",
    legacyStepType: "dragMatchIsland",
    displayName: "Sorting",
    description: "Sort or match items using the existing drag-match activity engine.",
    icon: "fa-solid fa-arrow-down-a-z",
    category: "Games",
    complexity: "Medium",
    seedConfig: {
      title: "Sort the Ideas",
      subtitle: "Move each item to the best matching place.",
      items: "Example 1\nExample 2\nExample 3\nExample 4",
      theme: "sunny"
    }
  });

  activities.roadmap = createLegacyActivityDefinition({
    activityType: "roadmap",
    legacyStepType: "customExperience",
    displayName: "Roadmap",
    description: "Show a learning path or sequence using the custom experience shell.",
    icon: "fa-solid fa-route",
    category: "Custom",
    complexity: "Medium",
    seedConfig: {
      experienceType: "roadmap",
      title: "Learning Roadmap",
      theme: "pathway",
      instructions: "Review the checkpoints before you continue.",
      data: "{\"checkpoints\":[\"Start\",\"Practice\",\"Apply\"]}"
    }
  });

  activities["multiple-choice"] = createLegacyActivityDefinition({
    activityType: "multiple-choice",
    legacyStepType: "customExperience",
    displayName: "Multiple Choice",
    description: "Ask learners to choose one answer using the custom activity shell.",
    icon: "fa-regular fa-circle-dot",
    category: "Assessment",
    complexity: "Easy",
    seedConfig: {
      experienceType: "multiple-choice",
      title: "Check Your Understanding",
      theme: "assessment",
      instructions: "Choose the best answer, then complete the activity.",
      data: "{\"question\":\"What is the best answer?\",\"choices\":[\"A\",\"B\",\"C\"]}"
    }
  });

  activities["multi-select"] = createLegacyActivityDefinition({
    activityType: "multi-select",
    legacyStepType: "customExperience",
    displayName: "Multi Select",
    description: "Ask learners to select more than one answer using the custom activity shell.",
    icon: "fa-regular fa-square-check",
    category: "Assessment",
    complexity: "Medium",
    seedConfig: {
      experienceType: "multi-select",
      title: "Select All That Apply",
      theme: "assessment",
      instructions: "Select every correct option, then complete the activity.",
      data: "{\"question\":\"Which options apply?\",\"choices\":[\"A\",\"B\",\"C\"]}"
    }
  });
}

function enrichCardRevealActivityDefinition() {
  var defaultTemplate = readActivityDefaultTemplate(cardRevealActivityDefinition) || "classic-card-reveal";

  return Object.assign({}, cardRevealActivityDefinition, {
    activityType: "cardReveal",
    legacyStepType: "cardReveal",
    displayName: "Card Reveal",
    icon: "fa-solid fa-clone",
    category: "Interactive",
    complexity: "Easy",
    defaultTemplate: defaultTemplate,
    defaultTemplateId: defaultTemplate,
    previewRenderer: {
      type: "PracticeModePlayer",
      legacyStepType: "cardReveal"
    },
    inspectorAdapter: {
      type: "StepTypeEditorSchema",
      legacyStepType: "cardReveal"
    }
  });
}

function createLegacyActivityDefinition(options) {
  var StepTypeDefinition = findStepTypeDefinition(options.legacyStepType);
  var templateId = options.activityType + "-standard";
  var templateModule = createStepBackedTemplateModule(StepTypeDefinition, templateId, options.seedConfig || {}, options.activityType);
  var baseDefinition = createStepBackedActivityDefinition(StepTypeDefinition, options.legacyStepType, options.activityType);

  return Object.assign({}, baseDefinition, {
    activityType: options.activityType,
    legacyStepType: options.legacyStepType,
    displayName: options.displayName,
    description: options.description,
    icon: options.icon,
    category: options.category,
    complexity: options.complexity,
    defaultTemplate: templateId,
    defaultTemplateId: templateId,
    schema: StepTypeDefinition && StepTypeDefinition.editorSchema ? StepTypeDefinition.editorSchema : { fields: [] },
    templates: [
      {
        meta: Object.assign({}, createStepBackedTemplateMeta(StepTypeDefinition, templateId, options.activityType), {
          activityType: options.activityType,
          displayName: options.displayName + " Standard",
          description: options.description,
          visualFeatures: [options.category, options.complexity, "legacy-compatible"]
        }),
        module: templateModule
      }
    ]
  });
}

function createStepBackedActivityDefinition(StepTypeDefinition, overrideStepType, overrideActivityType) {
  var stepType = overrideStepType || readStepDefinitionText(StepTypeDefinition, "type", "");
  var activityType = overrideActivityType || stepType;
  var label = readStepDefinitionText(StepTypeDefinition, "label", "Learning Activity");
  var templateId = activityType + "-standard";
  var templateModule = createStepBackedTemplateModule(StepTypeDefinition, templateId, {}, activityType);

  return {
    activityType: activityType,
    legacyStepType: stepType,
    displayName: label,
    description: readStepDefinitionText(StepTypeDefinition, "description", "Reusable learning activity."),
    icon: readStepDefinitionIcon(stepType),
    category: readStepDefinitionText(StepTypeDefinition, "category", "Custom"),
    complexity: readStepDefinitionText(StepTypeDefinition, "complexity", "Easy"),
    defaultTemplate: templateId,
    defaultTemplateId: templateId,
    baseFiles: {
      registry: "packages/core/src/shared/learningActivities/learningActivityRegistry.js",
      stepType: "packages/core/src/shared/stepTypes/" + readStepDefinitionName(StepTypeDefinition),
      preview: "apps/course-creator-dashboard/src/ui/pages/ActivityStudioPage.js"
    },
    schema: StepTypeDefinition && StepTypeDefinition.editorSchema ? StepTypeDefinition.editorSchema : { fields: [] },
    previewHandler: {
      type: "PracticeModePlayer",
      route: "#activity-studio"
    },
    previewRenderer: {
      type: "PracticeModePlayer",
      legacyStepType: stepType
    },
    inspectorAdapter: {
      type: "StepTypeEditorSchema",
      legacyStepType: stepType
    },
    templates: [
      {
        meta: createStepBackedTemplateMeta(StepTypeDefinition, templateId, activityType),
        module: templateModule
      }
    ]
  };
}

function createStepBackedTemplateMeta(StepTypeDefinition, templateId, activityType) {
  var stepType = readStepDefinitionText(StepTypeDefinition, "type", "");
  var label = readStepDefinitionText(StepTypeDefinition, "label", "Learning Activity");

  return {
    templateId: templateId,
    activityType: activityType || stepType,
    displayName: label + " Standard",
    description: readStepDefinitionText(StepTypeDefinition, "description", "Reusable learning activity."),
    supportsPreview: true,
    supportsStudentMode: true,
    supportsTeacherPreview: true,
    requiredContentFields: readSchemaFieldKeys(StepTypeDefinition && StepTypeDefinition.editorSchema),
    visualFeatures: [
      readStepDefinitionText(StepTypeDefinition, "category", "Activity"),
      readStepDefinitionText(StepTypeDefinition, "complexity", "Easy"),
      readStepDefinitionText(StepTypeDefinition, "completionMode", "manual")
    ],
    files: {
      stepType: "packages/core/src/shared/stepTypes/" + readStepDefinitionName(StepTypeDefinition),
      registry: "packages/core/src/shared/learningActivities/learningActivityRegistry.js"
    }
  };
}

function createStepBackedTemplateModule(StepTypeDefinition, templateId, seedConfig, activityType) {
  return {
    getTemplatePreviewContent: function () {
      return createPreviewConfig(StepTypeDefinition, templateId, seedConfig, activityType);
    },
    getTemplateDefaultContent: function () {
      return createPreviewConfig(StepTypeDefinition, templateId, seedConfig, activityType);
    }
  };
}

function createPreviewConfig(StepTypeDefinition, templateId, seedConfig, activityType) {
  var stepType = readStepDefinitionText(StepTypeDefinition, "type", "");
  var seed = Object.assign({}, createSeedConfig(stepType), seedConfig || {});
  var config = StepTypeDefinition && StepTypeDefinition.createConfig
    ? StepTypeDefinition.createConfig(seed)
    : Object.assign({}, StepTypeDefinition && StepTypeDefinition.defaultConfig ? StepTypeDefinition.defaultConfig : {}, seed);

  return Object.assign({ templateId: templateId, type: stepType, activityType: activityType || stepType }, config);
}

function createSeedConfig(stepType) {
  if (stepType === "textBriefing") {
    return {
      heading: "Digital Safety Briefing",
      bodyText: "Read the key idea, then continue when you are ready.",
      calloutText: "Pause and look for the one idea you can use today."
    };
  }

  if (stepType === "vocabulary") {
    return {
      word: "Algorithm",
      translation: "A clear sequence of steps",
      exampleSentence: "We followed an algorithm to solve the problem."
    };
  }

  if (stepType === "phrase") {
    return {
      phrase: "Can you explain that?",
      meaning: "Ask someone to say more clearly what they mean.",
      usageExample: "Can you explain that? I want to understand your idea."
    };
  }

  if (stepType === "listening") {
    return {
      questionPrompt: "Listen for the main idea.",
      transcript: "The speaker explains how to check whether a website is safe."
    };
  }

  if (stepType === "speakingPrompt") {
    return {
      prompt: "Explain one way to stay safe online.",
      preparationSeconds: 20,
      speakingSeconds: 45
    };
  }

  if (stepType === "reflection") {
    return {
      question: "How confident do you feel about this skill?",
      responseType: "scale",
      minWords: 0
    };
  }

  if (stepType === "customExperience") {
    return {
      experienceType: "interactive-shell",
      title: "Custom Learning Experience",
      theme: "studio",
      instructions: "Use this shell to prototype a specialized activity.",
      data: "{\"mode\":\"preview\"}"
    };
  }

  if (stepType === "cyberCodeMission") {
    return {
      missionTitle: "Repair the Signal",
      missionSubtitle: "Find the missing HTML structure.",
      instructions: "Inspect the starter code and complete the mission checklist.",
      starterCode: "<h1>Welcome</h1>\n<p>Stay curious.</p>",
      successMessage: "Signal restored.",
      theme: "neon"
    };
  }

  if (stepType === "dragMatchIsland") {
    return {
      title: "Input Device Island",
      subtitle: "Match each item to the right place.",
      items: "Keyboard\nMouse\nMonitor\nPrinter",
      theme: "sunny"
    };
  }

  if (stepType === "externalTask") {
    return {
      title: "Create a One-Slide Summary",
      instructions: "Create one slide that explains the lesson idea, then upload proof for review.",
      checklist: [
        "Slide has a title",
        "Slide has one useful example",
        "Slide is saved clearly"
      ],
      proofRequired: "false",
      allowedProofTypes: "image,document",
      allowStudentNote: "true",
      maxFiles: 3,
      maxFileSizeMb: 10,
      completionMode: "teacherReview"
    };
  }

  return {};
}

function readSchemaFieldKeys(schema) {
  var fields = schema && Array.isArray(schema.fields) ? schema.fields : [];

  return fields.map(function (field) {
    return field && field.key ? field.key : "";
  }).filter(Boolean);
}

function findStepTypeDefinition(stepType) {
  var normalizedStepType = normalizeStepType(stepType);
  var definitions = listStepTypeDefinitions();
  var index = 0;

  while (index < definitions.length) {
    if (readStepDefinitionText(definitions[index], "type", "") === normalizedStepType) {
      return definitions[index];
    }

    index = index + 1;
  }

  return null;
}

function readStepDefinitionName(StepTypeDefinition) {
  if (!StepTypeDefinition || !StepTypeDefinition.name) {
    return "BaseStep.js";
  }

  return StepTypeDefinition.name + ".js";
}

function readStepDefinitionText(StepTypeDefinition, propertyName, fallbackText) {
  if (!StepTypeDefinition) {
    return fallbackText;
  }

  if (typeof StepTypeDefinition[propertyName] === "string" && StepTypeDefinition[propertyName].length > 0) {
    return StepTypeDefinition[propertyName];
  }

  return fallbackText;
}

function readStepDefinitionIcon(stepType) {
  if (stepType === "textBriefing") { return "fa-regular fa-file-lines"; }
  if (stepType === "vocabulary") { return "fa-solid fa-book"; }
  if (stepType === "phrase") { return "fa-solid fa-comments"; }
  if (stepType === "listening") { return "fa-solid fa-headphones"; }
  if (stepType === "speakingPrompt") { return "fa-solid fa-microphone"; }
  if (stepType === "reflection") { return "fa-regular fa-lightbulb"; }
  if (stepType === "customExperience") { return "fa-solid fa-wand-magic-sparkles"; }
  if (stepType === "cyberCodeMission") { return "fa-solid fa-code"; }
  if (stepType === "dragMatchIsland") { return "fa-solid fa-gamepad"; }
  if (stepType === "externalTask") { return "fa-solid fa-upload"; }
  if (stepType === "cardReveal") { return "fa-solid fa-clone"; }
  return "fa-solid fa-shapes";
}

function readActivityDefaultTemplate(activityDefinition) {
  if (!activityDefinition) {
    return "";
  }

  if (typeof activityDefinition.defaultTemplateId === "string" && activityDefinition.defaultTemplateId.length > 0) {
    return activityDefinition.defaultTemplateId;
  }

  if (typeof activityDefinition.defaultTemplate === "string" && activityDefinition.defaultTemplate.length > 0) {
    return activityDefinition.defaultTemplate;
  }

  return "";
}

function readRequestedTemplateId(activityDefinition, templateId) {
  if (typeof templateId === "string" && templateId.length > 0) {
    return templateId;
  }

  return readActivityDefaultTemplate(activityDefinition);
}

function readActivityText(activityDefinition, propertyName, fallbackText) {
  if (!activityDefinition || typeof activityDefinition[propertyName] !== "string") {
    return fallbackText;
  }

  return activityDefinition[propertyName] || fallbackText;
}

function requireActivityField(activityDefinition, fieldName, warnings) {
  if (!activityDefinition || typeof activityDefinition[fieldName] !== "string" || activityDefinition[fieldName].length === 0) {
    warnings.push(readActivityText(activityDefinition, "activityType", "unknown") + " missing " + fieldName);
  }
}

function warnUnknownActivity(activityType) {
  var key = activityType || "unknown";

  if (unknownActivityWarnings[key]) {
    return;
  }

  unknownActivityWarnings[key] = true;
  console.warn("[LearningActivityRegistry] Unknown activity type", { activityType: activityType || "" });
}

function warnUnknownTemplate(activityDefinition, templateId) {
  var activityType = readActivityText(activityDefinition, "activityType", "unknown");
  var key = activityType + ":" + (templateId || "default");

  if (unknownTemplateWarnings[key]) {
    return;
  }

  unknownTemplateWarnings[key] = true;
  console.warn("[LearningActivityRegistry] Unknown template", {
    activityType: activityType,
    templateId: templateId || ""
  });
}

checkLearningActivityRegistryIntegrity();
