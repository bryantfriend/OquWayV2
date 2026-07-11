export const treasureHuntMapMeta = {
  templateId: "treasure-hunt-map",
  activityType: "cardReveal",
  displayName: "Treasure Hunt Map",
  description: "Students explore glowing hotspots on a themed scene and reveal each discovery in an information panel.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: ["cards.front", "cards.back"],
  visualFeatures: ["hotspot exploration", "map path", "discovery panel", "completion trail"],
  files: {
    template: "packages/core/src/shared/learningActivities/card-reveal/templates/treasure-hunt-map/treasureHuntMap.template.js",
    css: "packages/core/src/shared/learningActivities/card-reveal/templates/treasure-hunt-map/treasureHuntMap.css",
    meta: "packages/core/src/shared/learningActivities/card-reveal/templates/treasure-hunt-map/treasureHuntMap.meta.js"
  }
};
