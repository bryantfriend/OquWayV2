import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { CyberCodeMissionStep } from "../../stepTypes/CyberCodeMissionStep.js?v=1.1.226-learning-activity-files";
import { cyberCodeMissionSchema } from "./cyberCodeMission.schema.js?v=1.1.226-learning-activity-files";
import { cyberCodeMissionStandardMeta } from "./templates/cyber-code-mission-standard/cyberCodeMissionStandard.meta.js?v=1.1.226-learning-activity-files";
import * as cyberCodeMissionStandardTemplate from "./templates/cyber-code-mission-standard/cyberCodeMissionStandard.template.js?v=1.1.226-learning-activity-files";

export const cyberCodeMissionActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CyberCodeMissionStep,
  activityType: "cyberCodeMission",
  legacyStepType: "cyberCodeMission",
  displayName: "Cyber Code Mission",
  description: "A coding mission shell with starter code, instructions, and success feedback.",
  icon: "fa-solid fa-code",
  category: "Coding",
  complexity: "Hard",
  templateId: "cyberCodeMission-standard",
  templateDisplayName: "Cyber Code Mission Standard",
  registryFile: "packages/core/src/shared/learningActivities/cyber-code-mission/cyberCodeMission.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/cyber-code-mission/cyberCodeMission.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/cyber-code-mission/cyberCodeMission.schema.js",
  schema: cyberCodeMissionSchema,
  templates: [
    {
      meta: cyberCodeMissionStandardMeta,
      module: cyberCodeMissionStandardTemplate
    }
  ]
});
