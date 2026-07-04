import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.225-learning-activity-source-folders";

export const textBriefingActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: TextBriefingStep,
  activityType: "textBriefing",
  legacyStepType: "textBriefing",
  displayName: "Text Briefing",
  description: "A structured reading or instruction card for introducing lesson content.",
  icon: "fa-regular fa-file-lines",
  category: "Basic",
  complexity: "Easy",
  templateId: "textBriefing-standard",
  templateDisplayName: "Text Briefing Standard",
  registryFile: "packages/core/src/shared/learningActivities/text-briefing/textBriefing.registry.js",
  seedConfig: {
      "heading": "Digital Safety Briefing",
      "bodyText": "Read the key idea, then continue when you are ready.",
      "calloutText": "Pause and look for the one idea you can use today."
  }
});
