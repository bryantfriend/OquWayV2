import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { CyberCodeMissionStep } from "../../stepTypes/CyberCodeMissionStep.js?v=1.1.225-learning-activity-source-folders";

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
  seedConfig: {
      "missionTitle": "Repair the Signal",
      "missionSubtitle": "Find the missing HTML structure.",
      "instructions": "Inspect the starter code and complete the mission checklist.",
      "starterCode": "<h1>Welcome</h1>\n<p>Stay curious.</p>",
      "successMessage": "Signal restored.",
      "theme": "neon"
  }
});
