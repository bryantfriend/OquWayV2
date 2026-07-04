import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.225-learning-activity-source-folders";

export const introCardActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: TextBriefingStep,
  activityType: "intro-card",
  legacyStepType: "textBriefing",
  displayName: "Intro Card",
  description: "A focused opening card for a lesson objective, hook, or brief context.",
  icon: "fa-solid fa-id-card",
  category: "Basic",
  complexity: "Easy",
  templateId: "intro-card-standard",
  templateDisplayName: "Intro Card Standard",
  registryFile: "packages/core/src/shared/learningActivities/intro-card/introCard.registry.js",
  seedConfig: {
      "heading": "Lesson Introduction",
      "bodyText": "Start here to understand the main idea.",
      "calloutText": "Look for the one concept you should remember."
  }
});
