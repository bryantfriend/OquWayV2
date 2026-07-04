import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { ExternalTaskStep } from "../../stepTypes/ExternalTaskStep.js?v=1.1.225-learning-activity-source-folders";

export const externalTaskActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: ExternalTaskStep,
  activityType: "externalTask",
  legacyStepType: "externalTask",
  displayName: "External Task",
  description: "Assign work outside the player and collect proof for review.",
  icon: "fa-solid fa-upload",
  category: "Assessment",
  complexity: "Medium",
  templateId: "externalTask-standard",
  templateDisplayName: "External Task Standard",
  registryFile: "packages/core/src/shared/learningActivities/external-task/externalTask.registry.js",
  seedConfig: {
      "title": "Create a One-Slide Summary",
      "instructions": "Create one slide that explains the lesson idea, then upload proof for review.",
      "checklist": [
          "Slide has a title",
          "Slide has one useful example",
          "Slide is saved clearly"
      ],
      "proofRequired": "false",
      "allowedProofTypes": "image,document",
      "allowStudentNote": "true",
      "maxFiles": 3,
      "maxFileSizeMb": 10,
      "completionMode": "teacherReview"
  }
});
