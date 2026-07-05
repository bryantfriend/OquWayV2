export function createStepBackedActivityDefinition(options) {
  var safeOptions = options && typeof options === "object" ? options : {};
  var StepTypeDefinition = safeOptions.StepTypeDefinition;
  var legacyStepType = readText(safeOptions.legacyStepType, readStepDefinitionText(StepTypeDefinition, "type", ""));
  var activityType = readText(safeOptions.activityType, legacyStepType);
  var displayName = readText(safeOptions.displayName, readStepDefinitionText(StepTypeDefinition, "label", "Learning Activity"));
  var description = readText(safeOptions.description, readStepDefinitionText(StepTypeDefinition, "description", "Reusable learning activity."));
  var category = readText(safeOptions.category, readStepDefinitionText(StepTypeDefinition, "category", "Custom"));
  var complexity = readText(safeOptions.complexity, readStepDefinitionText(StepTypeDefinition, "complexity", "Easy"));
  var templateId = readText(safeOptions.templateId, activityType + "-standard");
  var registryFile = readText(safeOptions.registryFile, "packages/core/src/shared/learningActivities/" + activityType + "/" + activityType + ".registry.js");
  var activityFile = readText(safeOptions.activityFile, "");
  var schemaFile = readText(safeOptions.schemaFile, "");
  var seedConfig = safeOptions.seedConfig && typeof safeOptions.seedConfig === "object" && !Array.isArray(safeOptions.seedConfig)
    ? safeOptions.seedConfig
    : {};
  var schema = safeOptions.schema || (StepTypeDefinition && StepTypeDefinition.editorSchema ? StepTypeDefinition.editorSchema : { fields: [] });
  var templates = Array.isArray(safeOptions.templates) && safeOptions.templates.length > 0
    ? safeOptions.templates
    : [
      {
        meta: createTemplateMeta(StepTypeDefinition, {
          activityType: activityType,
          templateId: templateId,
          displayName: readText(safeOptions.templateDisplayName, displayName + " Standard"),
          description: description,
          category: category,
          complexity: complexity,
          registryFile: registryFile
        }),
        module: createTemplateModule(StepTypeDefinition, templateId, seedConfig, activityType)
      }
    ];

  return {
    activityType: activityType,
    legacyStepType: legacyStepType,
    displayName: displayName,
    description: description,
    icon: readText(safeOptions.icon, readStepDefinitionIcon(legacyStepType)),
    category: category,
    complexity: complexity,
    defaultTemplate: templateId,
    defaultTemplateId: templateId,
    baseFiles: {
      activity: activityFile,
      schema: schemaFile,
      registry: registryFile,
      stepType: "packages/core/src/shared/stepTypes/" + readStepDefinitionName(StepTypeDefinition),
      preview: "apps/course-creator-dashboard/src/ui/pages/ActivityStudioPage.js"
    },
    schema: schema,
    previewHandler: {
      type: "PracticeModePlayer",
      route: "#activity-studio"
    },
    previewRenderer: {
      type: "PracticeModePlayer",
      legacyStepType: legacyStepType
    },
    inspectorAdapter: {
      type: "StepTypeEditorSchema",
      legacyStepType: legacyStepType
    },
    templates: templates
  };
}

function createTemplateMeta(StepTypeDefinition, options) {
  return {
    templateId: options.templateId,
    activityType: options.activityType,
    displayName: options.displayName,
    description: options.description,
    supportsPreview: true,
    supportsStudentMode: true,
    supportsTeacherPreview: true,
    requiredContentFields: readSchemaFieldKeys(StepTypeDefinition && StepTypeDefinition.editorSchema),
    visualFeatures: [
      options.category,
      options.complexity,
      readStepDefinitionText(StepTypeDefinition, "completionMode", "manual")
    ],
    files: {
      stepType: "packages/core/src/shared/stepTypes/" + readStepDefinitionName(StepTypeDefinition),
      registry: options.registryFile
    }
  };
}

function createTemplateModule(StepTypeDefinition, templateId, seedConfig, activityType) {
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
  var config = StepTypeDefinition && StepTypeDefinition.createConfig
    ? StepTypeDefinition.createConfig(seedConfig)
    : Object.assign({}, StepTypeDefinition && StepTypeDefinition.defaultConfig ? StepTypeDefinition.defaultConfig : {}, seedConfig);

  return Object.assign({ templateId: templateId, type: stepType, activityType: activityType || stepType }, config);
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

function readText(value, fallbackText) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  return fallbackText;
}
