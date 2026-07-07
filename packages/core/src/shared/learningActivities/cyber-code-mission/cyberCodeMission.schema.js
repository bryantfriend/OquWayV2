import { CyberCodeMissionStep } from "../../stepTypes/CyberCodeMissionStep.js?v=1.1.228-learning-activity-drag-interactions";

export const cyberCodeMissionSchema = CyberCodeMissionStep.editorSchema || { fields: [] };

export function getCyberCodeMissionDefaultContent() {
  return {
    "missionTitle": "Repair the Signal",
    "missionSubtitle": "Find the missing HTML structure.",
    "instructions": "Inspect the starter code and complete the mission checklist.",
    "starterCode": "<h1>Welcome</h1>\n<p>Stay curious.</p>",
    "successMessage": "Signal restored.",
    "theme": "neon"
  };
}

export function normalizeCyberCodeMissionConfig(config) {
  return CyberCodeMissionStep.createConfig(Object.assign({}, getCyberCodeMissionDefaultContent(), config || {}));
}

export function validateCyberCodeMissionConfig(config) {
  var normalized = normalizeCyberCodeMissionConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
