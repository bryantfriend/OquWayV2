export const multiSelectTeamDraftMeta = {
  templateId: "multi-select-team-draft",
  activityType: "multi-select",
  displayName: "Team Draft",
  description: "Team Draft turns Multi Select into a drag bays mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "drag-bays",
  "distinct-interaction",
  "Medium"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-team-draft/multiSelectTeamDraft.template.js",
  "css": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-team-draft/multiSelectTeamDraft.css",
  "meta": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-team-draft/multiSelectTeamDraft.meta.js"
}
};
