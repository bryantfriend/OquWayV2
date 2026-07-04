import { cardRevealSchema } from "./cardReveal.schema.js?v=1.1.220-activity-studio";
import { classicCardRevealMeta } from "./templates/classic-card-reveal/classicCardReveal.meta.js?v=1.1.220-activity-studio";
import * as classicCardRevealTemplate from "./templates/classic-card-reveal/classicCardReveal.template.js?v=1.1.220-activity-studio";
import { mysteryFlipCardsMeta } from "./templates/mystery-flip-cards/mysteryFlipCards.meta.js?v=1.1.220-activity-studio";
import * as mysteryFlipCardsTemplate from "./templates/mystery-flip-cards/mysteryFlipCards.template.js?v=1.1.220-activity-studio";

export const cardRevealActivityDefinition = {
  activityType: "cardReveal",
  displayName: "Card Reveal",
  description: "Reveal hidden answers from cards while the base activity controls validation, completion, and event routing.",
  defaultTemplate: "classic-card-reveal",
  baseFiles: {
    activity: "packages/core/src/shared/learningActivities/card-reveal/cardReveal.activity.js",
    schema: "packages/core/src/shared/learningActivities/card-reveal/cardReveal.schema.js",
    preview: "apps/course-creator-dashboard/src/ui/pages/ActivityStudioPage.js",
    registry: "packages/core/src/shared/learningActivities/card-reveal/cardReveal.registry.js",
    stepType: "packages/core/src/shared/stepTypes/CardRevealStep.js"
  },
  schema: cardRevealSchema,
  previewHandler: {
    type: "PracticeModePlayer",
    route: "#activity-studio"
  },
  templates: [
    {
      meta: classicCardRevealMeta,
      module: classicCardRevealTemplate
    },
    {
      meta: mysteryFlipCardsMeta,
      module: mysteryFlipCardsTemplate
    }
  ]
};

export function listCardRevealTemplates() {
  return cardRevealActivityDefinition.templates.slice();
}

export function getCardRevealTemplateDefinition(templateId) {
  var templates = cardRevealActivityDefinition.templates;
  var index = 0;

  while (index < templates.length) {
    if (templates[index].meta.templateId === templateId) {
      return templates[index];
    }

    index = index + 1;
  }

  return null;
}
