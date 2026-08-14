import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.231-platform-performance-release";
import { ListeningStep } from "../../stepTypes/ListeningStep.js?v=1.1.231-platform-performance-release";
import { listeningSchema } from "./listening.schema.js?v=1.1.231-platform-performance-release";
import { listeningStandardMeta } from "./templates/listening-standard/listeningStandard.meta.js?v=1.1.231-platform-performance-release";
import * as listeningStandardTemplate from "./templates/listening-standard/listeningStandard.template.js?v=1.1.231-platform-performance-release";
import { listeningEchoResponseMeta } from "./templates/listening-echo-response/listeningEchoResponse.meta.js?v=1.1.231-platform-performance-release";
import * as listeningEchoResponseTemplate from "./templates/listening-echo-response/listeningEchoResponse.template.js?v=1.1.231-platform-performance-release";
import { listeningTranscriptHuntMeta } from "./templates/listening-transcript-hunt/listeningTranscriptHunt.meta.js?v=1.1.231-platform-performance-release";
import * as listeningTranscriptHuntTemplate from "./templates/listening-transcript-hunt/listeningTranscriptHunt.template.js?v=1.1.231-platform-performance-release";
import { listeningSoundDetectiveMeta } from "./templates/listening-sound-detective/listeningSoundDetective.meta.js?v=1.1.231-platform-performance-release";
import * as listeningSoundDetectiveTemplate from "./templates/listening-sound-detective/listeningSoundDetective.template.js?v=1.1.231-platform-performance-release";
import { listeningRadioSequenceMeta } from "./templates/listening-radio-sequence/listeningRadioSequence.meta.js?v=1.1.231-platform-performance-release";
import * as listeningRadioSequenceTemplate from "./templates/listening-radio-sequence/listeningRadioSequence.template.js?v=1.1.231-platform-performance-release";

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
      meta: listeningEchoResponseMeta,
      module: listeningEchoResponseTemplate
    },
    {
      meta: listeningTranscriptHuntMeta,
      module: listeningTranscriptHuntTemplate
    },
    {
      meta: listeningSoundDetectiveMeta,
      module: listeningSoundDetectiveTemplate
    },
    {
      meta: listeningRadioSequenceMeta,
      module: listeningRadioSequenceTemplate
    }
  ]
});
