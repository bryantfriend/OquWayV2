import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { ListeningStep } from "../../stepTypes/ListeningStep.js?v=1.1.228-learning-activity-drag-interactions";
import { listeningSchema } from "./listening.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { listeningStandardMeta } from "./templates/listening-standard/listeningStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as listeningStandardTemplate from "./templates/listening-standard/listeningStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { listeningTranscriptHuntMeta } from "./templates/listening-transcript-hunt/listeningTranscriptHunt.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as listeningTranscriptHuntTemplate from "./templates/listening-transcript-hunt/listeningTranscriptHunt.template.js?v=1.1.228-learning-activity-drag-interactions";
import { listeningEchoResponseMeta } from "./templates/listening-echo-response/listeningEchoResponse.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as listeningEchoResponseTemplate from "./templates/listening-echo-response/listeningEchoResponse.template.js?v=1.1.228-learning-activity-drag-interactions";

export const listeningActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: ListeningStep,
  activityType: "listening",
  legacyStepType: "listening",
  displayName: "Listening",
  description: "A listening challenge shell.",
  icon: "fa-solid fa-headphones",
  category: "Media",
  complexity: "Easy",
  templateId: "listening-standard",
  templateDisplayName: "Listen and Check",
  registryFile: "packages/core/src/shared/learningActivities/listening/listening.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/listening/listening.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/listening/listening.schema.js",
  schema: listeningSchema,
  templates: [
    {
      meta: listeningStandardMeta,
      module: listeningStandardTemplate
    },
    {
      meta: listeningTranscriptHuntMeta,
      module: listeningTranscriptHuntTemplate
    },
    {
      meta: listeningEchoResponseMeta,
      module: listeningEchoResponseTemplate
    }
  ]
});
