import { listStepTypeDefinitions } from "../stepTypes/stepTypeRegistry.js?v=1.1.82-shared-command-center-shell";
import { cardRevealActivityDefinition } from "./card-reveal/cardReveal.registry.js?v=1.1.223-learning-activity-catalog";

var learningActivities = createLearningActivities();

var activityAliases = {
  "card-reveal": "cardReveal"
};

export function listLearningActivityDefinitions() {
  return Object.keys(learningActivities).map(function (activityType) {
    return learningActivities[activityType];
  });
}

export function getLearningActivityDefinition(activityType) {
  var normalizedActivityType = normalizeLearningActivityType(activityType);

  if (!normalizedActivityType || !learningActivities[normalizedActivityType]) {
    return null;
  }

  return learningActivities[normalizedActivityType];
}

export function getLearningActivityTemplateDefinition(activityType, templateId) {
  var activityDefinition = getLearningActivityDefinition(activityType);
  var templates = activityDefinition && Array.isArray(activityDefinition.templates) ? activityDefinition.templates : [];
  var index = 0;

  while (index < templates.length) {
    if (templates[index].meta && templates[index].meta.templateId === templateId) {
      return templates[index];
    }

    index = index + 1;
  }

  return null;
}

export function normalizeLearningActivityTemplateId(activityType, templateId) {
  var activityDefinition = getLearningActivityDefinition(activityType);
  var defaultTemplate = activityDefinition ? activityDefinition.defaultTemplate : "";

  if (getLearningActivityTemplateDefinition(activityType, templateId)) {
    return templateId;
  }

  console.warn("[learning-activity-registry] Explicit template fallback", {
    activityType: activityType || "",
    requestedTemplateId: templateId || "",
    fallbackTemplateId: defaultTemplate
  });

  return defaultTemplate;
}

function normalizeLearningActivityType(activityType) {
  if (typeof activityType !== "string" || activityType.length === 0) {
    return "";
  }

  return activityAliases[activityType] || activityType;
}

function createLearningActivities() {
  var activities = {};
  var stepDefinitions = listStepTypeDefinitions();
  var index = 0;

  while (index < stepDefinitions.length) {
    var StepTypeDefinition = stepDefinitions[index];
    var stepType = readStepDefinitionText(StepTypeDefinition, "type", "");

    if (stepType) {
      activities[stepType] = createStepBackedActivityDefinition(StepTypeDefinition);
    }

    index = index + 1;
  }

  activities.cardReveal = cardRevealActivityDefinition;
  return activities;
}

function createStepBackedActivityDefinition(StepTypeDefinition) {
  var stepType = readStepDefinitionText(StepTypeDefinition, "type", "");
  var label = readStepDefinitionText(StepTypeDefinition, "label", "Learning Activity");
  var templateId = stepType + "-standard";
  var templateModule = createStepBackedTemplateModule(StepTypeDefinition, templateId);

  return {
    activityType: stepType,
    displayName: label,
    description: readStepDefinitionText(StepTypeDefinition, "description", "Reusable learning activity."),
    defaultTemplate: templateId,
    baseFiles: {
      registry: "packages/core/src/shared/learningActivities/learningActivityRegistry.js",
      stepType: "packages/core/src/shared/stepTypes/" + readStepDefinitionName(StepTypeDefinition),
      preview: "apps/course-creator-dashboard/src/ui/pages/ActivityStudioPage.js"
    },
    schema: StepTypeDefinition.editorSchema || { fields: [] },
    previewHandler: {
      type: "PracticeModePlayer",
      route: "#activity-studio"
    },
    templates: [
      {
        meta: createStepBackedTemplateMeta(StepTypeDefinition, templateId),
        module: templateModule
      }
    ]
  };
}

function createStepBackedTemplateMeta(StepTypeDefinition, templateId) {
  var stepType = readStepDefinitionText(StepTypeDefinition, "type", "");
  var label = readStepDefinitionText(StepTypeDefinition, "label", "Learning Activity");

  return {
    templateId: templateId,
    activityType: stepType,
    displayName: label + " Standard",
    description: readStepDefinitionText(StepTypeDefinition, "description", "Reusable learning activity."),
    supportsPreview: true,
    supportsStudentMode: true,
    supportsTeacherPreview: true,
    requiredContentFields: readSchemaFieldKeys(StepTypeDefinition.editorSchema),
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

function createStepBackedTemplateModule(StepTypeDefinition, templateId) {
  return {
    getTemplatePreviewContent: function () {
      return createPreviewConfig(StepTypeDefinition, templateId);
    },
    getTemplateDefaultContent: function () {
      return createPreviewConfig(StepTypeDefinition, templateId);
    }
  };
}

function createPreviewConfig(StepTypeDefinition, templateId) {
  var stepType = readStepDefinitionText(StepTypeDefinition, "type", "");
  var seedConfig = createSeedConfig(stepType);
  var config = StepTypeDefinition.createConfig
    ? StepTypeDefinition.createConfig(seedConfig)
    : Object.assign({}, StepTypeDefinition.defaultConfig || {}, seedConfig);

  return Object.assign({ templateId: templateId, type: stepType }, config);
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