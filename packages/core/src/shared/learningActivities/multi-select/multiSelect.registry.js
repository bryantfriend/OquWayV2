import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.228-learning-activity-drag-interactions";
import { multiSelectSchema } from "./multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { multiSelectStandardMeta } from "./templates/multi-select-standard/multiSelectStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as multiSelectStandardTemplate from "./templates/multi-select-standard/multiSelectStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { multiSelectSafetyScanMeta } from "./templates/multi-select-safety-scan/multiSelectSafetyScan.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as multiSelectSafetyScanTemplate from "./templates/multi-select-safety-scan/multiSelectSafetyScan.template.js?v=1.1.228-learning-activity-drag-interactions";
import { multiSelectTeamDraftMeta } from "./templates/multi-select-team-draft/multiSelectTeamDraft.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as multiSelectTeamDraftTemplate from "./templates/multi-select-team-draft/multiSelectTeamDraft.template.js?v=1.1.228-learning-activity-drag-interactions";
import { multiSelectThreatRadarMeta } from "./templates/multi-select-threat-radar/multiSelectThreatRadar.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as multiSelectThreatRadarTemplate from "./templates/multi-select-threat-radar/multiSelectThreatRadar.template.js?v=1.1.228-learning-activity-drag-interactions";
import { multiSelectCollectionCaseMeta } from "./templates/multi-select-collection-case/multiSelectCollectionCase.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as multiSelectCollectionCaseTemplate from "./templates/multi-select-collection-case/multiSelectCollectionCase.template.js?v=1.1.228-learning-activity-drag-interactions";

export const multiSelectActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CustomExperienceStep,
  activityType: "multi-select",
  legacyStepType: "customExperience",
  displayName: "Multi Select",
  description: "A multi-select activity shell backed by the custom experience player.",
  icon: "fa-regular fa-square-check",
  category: "Quiz",
  complexity: "Medium",
  templateId: "multi-select-standard",
  templateDisplayName: "Pick All That Apply",
  registryFile: "packages/core/src/shared/learningActivities/multi-select/multiSelect.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/multi-select/multiSelect.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/multi-select/multiSelect.schema.js",
  schema: multiSelectSchema,
  templates: [
    {
      meta: multiSelectStandardMeta,
      module: multiSelectStandardTemplate
    },
    {
      meta: multiSelectSafetyScanMeta,
      module: multiSelectSafetyScanTemplate
    },
    {
      meta: multiSelectTeamDraftMeta,
      module: multiSelectTeamDraftTemplate
    },
    {
      meta: multiSelectThreatRadarMeta,
      module: multiSelectThreatRadarTemplate
    },
    {
      meta: multiSelectCollectionCaseMeta,
      module: multiSelectCollectionCaseTemplate
    }
  ]
});
