import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { ListeningStep } from "../../stepTypes/ListeningStep.js?v=1.1.226-learning-activity-files";
import { listeningSchema } from "./listening.schema.js?v=1.1.226-learning-activity-files";
import { listeningStandardMeta } from "./templates/listening-standard/listeningStandard.meta.js?v=1.1.226-learning-activity-files";
import * as listeningStandardTemplate from "./templates/listening-standard/listeningStandard.template.js?v=1.1.226-learning-activity-files";

export const listeningActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: ListeningStep,
  activityType: "listening",
  legacyStepType: "listening",
  displayName: "Listening",
  description: "Guide learners through a listening prompt or transcript-based check.",
  icon: "fa-solid fa-headphones",
  category: "Media",
  complexity: "Medium",
  templateId: "listening-standard",
  templateDisplayName: "Listening Standard",
  registryFile: "packages/core/src/shared/learningActivities/listening/listening.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/listening/listening.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/listening/listening.schema.js",
  schema: listeningSchema,
  templates: [
    {
      meta: listeningStandardMeta,
      module: listeningStandardTemplate
    }
  ]
});
