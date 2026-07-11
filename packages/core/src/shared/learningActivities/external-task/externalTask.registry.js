import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { ExternalTaskStep } from "../../stepTypes/ExternalTaskStep.js?v=1.1.228-learning-activity-drag-interactions";
import { externalTaskSchema } from "./externalTask.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { externalTaskStandardMeta } from "./templates/external-task-standard/externalTaskStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as externalTaskStandardTemplate from "./templates/external-task-standard/externalTaskStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { externalTaskScreenshotProofMeta } from "./templates/external-task-screenshot-proof/externalTaskScreenshotProof.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as externalTaskScreenshotProofTemplate from "./templates/external-task-screenshot-proof/externalTaskScreenshotProof.template.js?v=1.1.228-learning-activity-drag-interactions";
import { externalTaskOfflineProjectMeta } from "./templates/external-task-offline-project/externalTaskOfflineProject.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as externalTaskOfflineProjectTemplate from "./templates/external-task-offline-project/externalTaskOfflineProject.template.js?v=1.1.228-learning-activity-drag-interactions";
import { externalTaskOfficeQuestMeta } from "./templates/external-task-office-quest/externalTaskOfficeQuest.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as externalTaskOfficeQuestTemplate from "./templates/external-task-office-quest/externalTaskOfficeQuest.template.js?v=1.1.228-learning-activity-drag-interactions";
import { externalTaskReviewStationMeta } from "./templates/external-task-review-station/externalTaskReviewStation.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as externalTaskReviewStationTemplate from "./templates/external-task-review-station/externalTaskReviewStation.template.js?v=1.1.228-learning-activity-drag-interactions";

export const externalTaskActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: ExternalTaskStep,
  activityType: "externalTask",
  legacyStepType: "externalTask",
  displayName: "External Task",
  description: "A real-world or software task submitted for teacher review.",
  icon: "fa-solid fa-upload",
  category: "Assessment",
  complexity: "Medium",
  templateId: "externalTask-standard",
  templateDisplayName: "Proof Upload",
  registryFile: "packages/core/src/shared/learningActivities/external-task/externalTask.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/external-task/externalTask.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/external-task/externalTask.schema.js",
  schema: externalTaskSchema,
  templates: [
    {
      meta: externalTaskStandardMeta,
      module: externalTaskStandardTemplate
    },
    {
      meta: externalTaskScreenshotProofMeta,
      module: externalTaskScreenshotProofTemplate
    },
    {
      meta: externalTaskOfflineProjectMeta,
      module: externalTaskOfflineProjectTemplate
    },
    {
      meta: externalTaskOfficeQuestMeta,
      module: externalTaskOfficeQuestTemplate
    },
    {
      meta: externalTaskReviewStationMeta,
      module: externalTaskReviewStationTemplate
    }
  ]
});
