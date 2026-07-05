import { normalizeStepType } from "../stepTypes/stepTypeRegistry.js?v=1.1.226-learning-activity-files";
import { cardRevealActivityDefinition } from "./card-reveal/cardReveal.registry.js?v=1.1.226-learning-activity-files";
import { customExperienceActivityDefinition } from "./custom-experience/customExperience.registry.js?v=1.1.226-learning-activity-files";
import { cyberCodeMissionActivityDefinition } from "./cyber-code-mission/cyberCodeMission.registry.js?v=1.1.226-learning-activity-files";
import { dragMatchIslandActivityDefinition } from "./drag-match-island/dragMatchIsland.registry.js?v=1.1.226-learning-activity-files";
import { externalTaskActivityDefinition } from "./external-task/externalTask.registry.js?v=1.1.226-learning-activity-files";
import { introCardActivityDefinition } from "./intro-card/introCard.registry.js?v=1.1.226-learning-activity-files";
import { listeningActivityDefinition } from "./listening/listening.registry.js?v=1.1.226-learning-activity-files";
import { multiSelectActivityDefinition } from "./multi-select/multiSelect.registry.js?v=1.1.226-learning-activity-files";
import { multipleChoiceActivityDefinition } from "./multiple-choice/multipleChoice.registry.js?v=1.1.226-learning-activity-files";
import { phraseActivityDefinition } from "./phrase/phrase.registry.js?v=1.1.226-learning-activity-files";
import { reflectionActivityDefinition } from "./reflection/reflection.registry.js?v=1.1.226-learning-activity-files";
import { roadmapActivityDefinition } from "./roadmap/roadmap.registry.js?v=1.1.226-learning-activity-files";
import { sortingActivityDefinition } from "./sorting/sorting.registry.js?v=1.1.226-learning-activity-files";
import { speakingPromptActivityDefinition } from "./speaking-prompt/speakingPrompt.registry.js?v=1.1.226-learning-activity-files";
import { textBriefingActivityDefinition } from "./text-briefing/textBriefing.registry.js?v=1.1.226-learning-activity-files";
import { vocabularyActivityDefinition } from "./vocabulary/vocabulary.registry.js?v=1.1.226-learning-activity-files";

var learningActivityDefinitions = [
  cardRevealActivityDefinition,
  customExperienceActivityDefinition,
  cyberCodeMissionActivityDefinition,
  dragMatchIslandActivityDefinition,
  externalTaskActivityDefinition,
  introCardActivityDefinition,
  listeningActivityDefinition,
  multiSelectActivityDefinition,
  multipleChoiceActivityDefinition,
  phraseActivityDefinition,
  reflectionActivityDefinition,
  roadmapActivityDefinition,
  sortingActivityDefinition,
  speakingPromptActivityDefinition,
  textBriefingActivityDefinition,
  vocabularyActivityDefinition
];

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
  var index = 0;

  while (index < learningActivityDefinitions.length) {
    var activityDefinition = learningActivityDefinitions[index];

    if (activityDefinition && activityDefinition.activityType) {
      activities[activityDefinition.activityType] = activityDefinition;
    }

    index = index + 1;
  }

  return activities;
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
