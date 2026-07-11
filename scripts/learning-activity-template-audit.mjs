import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const cardRevealTemplateIds = [
  "mystery-flip-cards",
  "treasure-hunt-map",
  "digital-file-explorer",
  "x-ray-scanner",
  "detective-board",
  "time-machine-timeline"
];

const checks = [
  {
    file: "packages/core/src/shared/learningActivities/card-reveal/cardReveal.registry.js",
    contains: [
      "defaultTemplate: \"mystery-flip-cards\"",
      "treasureHuntMapTemplate",
      "digitalFileExplorerTemplate",
      "xRayScannerTemplate",
      "detectiveBoardTemplate",
      "timeMachineTimelineTemplate"
    ].concat(cardRevealTemplateIds)
  },
  {
    file: "packages/core/src/shared/learningActivities/card-reveal/cardReveal.schema.js",
    contains: [
      "options: [\"mystery-flip-cards\", \"treasure-hunt-map\", \"digital-file-explorer\", \"x-ray-scanner\", \"detective-board\", \"time-machine-timeline\"",
      "Data entered into a computer system.",
      "The result produced by the computer."
    ]
  },
  {
    file: "packages/core/src/shared/stepTypes/CardRevealStep.js",
    contains: [
      "getCardRevealPreviewContent",
      "renderCardRevealActivity(target, previewConfig, {})",
      "oqu-card-reveal-shell-preview"
    ]
  },
  {
    file: "packages/core/src/shared/learningActivities/card-reveal/templates/mystery-flip-cards/mysteryFlipCards.template.js",
    contains: ["oqu-mystery-flip-all", "rotateY(180deg)", "cards revealed", "getTemplateDefaultContent", "getTemplatePreviewContent"]
  },
  {
    file: "packages/core/src/shared/learningActivities/card-reveal/templates/treasure-hunt-map/treasureHuntMap.template.js",
    contains: ["oqu-map-hotspot", "oqu-map-panel", "getTemplateDefaultContent", "getTemplatePreviewContent"]
  },
  {
    file: "packages/core/src/shared/learningActivities/card-reveal/templates/digital-file-explorer/digitalFileExplorer.template.js",
    contains: ["oqu-folder-tab", "oqu-file-item", "Computer Concepts Explorer", "getTemplateDefaultContent", "getTemplatePreviewContent"]
  },
  {
    file: "packages/core/src/shared/learningActivities/card-reveal/templates/x-ray-scanner/xRayScanner.template.js",
    contains: ["pointermove", "oqu-xray-lens", "Hardware X-Ray", "getTemplateDefaultContent", "getTemplatePreviewContent"]
  },
  {
    file: "packages/core/src/shared/learningActivities/card-reveal/templates/detective-board/detectiveBoard.template.js",
    contains: ["oqu-evidence-card", "case-solved", "Who Helped Create Modern Computing?", "getTemplateDefaultContent", "getTemplatePreviewContent"]
  },
  {
    file: "packages/core/src/shared/learningActivities/card-reveal/templates/time-machine-timeline/timeMachineTimeline.template.js",
    contains: ["oqu-time-node", "disabled", "Evolution of Computers", "getTemplateDefaultContent", "getTemplatePreviewContent"]
  },
  {
    file: "packages/core/src/shared/learningActivities/reflection/reflection.registry.js",
    contains: [
      "reflectionEmojiCheckInMeta",
      "reflectionEmojiCheckInTemplate",
      "reflection-emoji-check-in"
    ]
  },
  {
    file: "packages/core/src/shared/stepTypes/ReflectionStep.js",
    contains: [
      "value: \"emoji\"",
      "Emoji Check-In",
      "oqu-emoji-checkin-grid",
      "Why did you choose that emoji?"
    ]
  },
  {
    file: "packages/core/src/shared/learningActivities/reflection/templates/reflection-emoji-check-in/reflectionEmojiCheckIn.template.js",
    contains: [
      "reflection-emoji-check-in",
      "responseType: \"emoji\"",
      "Choose an emoji that shows how you feel",
      "getTemplateDefaultContent",
      "getTemplatePreviewContent"
    ]
  }
];

let failures = 0;

checks.forEach(function (check) {
  const filePath = resolve(root, check.file);
  const text = readFileSync(filePath, "utf8");

  check.contains.forEach(function (needle) {
    if (!text.includes(needle)) {
      failures += 1;
      console.error("[learning-template-audit:missing]", check.file, needle);
    }
  });
});

if (failures > 0) {
  console.error("[learning-template-audit:failed]", failures + " missing marker(s)");
  process.exit(1);
}

console.log("[learning-template-audit:passed]", cardRevealTemplateIds.length + " distinct card reveal templates and reflection emoji template checked");
