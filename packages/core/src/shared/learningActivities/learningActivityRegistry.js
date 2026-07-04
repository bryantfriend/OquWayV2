import { cardRevealActivityDefinition } from "./card-reveal/cardReveal.registry.js?v=1.1.220-activity-studio";

var learningActivities = {
  cardReveal: cardRevealActivityDefinition
};

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
