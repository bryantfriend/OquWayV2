export const multiSelectTeamDraftMeta = {
  templateId: "multi-select-team-draft",
  activityType: "multi-select",
  displayName: "Team Draft",
  description: "A multi-select activity shell backed by the custom experience player.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["skill-sprint", "choice", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-team-draft/multiSelectTeamDraft.template.js",
    css: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-team-draft/multiSelectTeamDraft.css",
    meta: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-team-draft/multiSelectTeamDraft.meta.js"
  }
};
