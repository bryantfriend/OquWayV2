import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const cardRevealTemplateIds = [
  "mystery-flip-cards",
  "treasure-hunt-map",
  "digital-file-explorer",
  "x-ray-scanner",
  "detective-board",
  "time-machine-timeline"
];
const nonCardActivityFolders = [
  "custom-experience",
  "cyber-code-mission",
  "drag-match-island",
  "external-task",
  "intro-card",
  "listening",
  "multi-select",
  "multiple-choice",
  "phrase",
  "reflection",
  "roadmap",
  "sorting",
  "speaking-prompt",
  "text-briefing",
  "vocabulary"
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
    file: "packages/core/src/shared/learningActivities/miniGameTemplateRenderer.js",
    contains: [
      "renderMiniGameTemplate",
      "quest-map",
      "lab-switchboard",
      "evidence-board",
      "drag-bays",
      "terminal-challenge",
      "scanner-grid",
      "boss-battle",
      "timeline-unlock",
      "upload-studio",
      "emoji-checkin"
    ]
  },
  {
    file: "packages/core/src/shared/learningActivities/reflection/templates/reflection-emoji-check-in/reflectionEmojiCheckIn.template.js",
    contains: ["emoji-checkin", "responseType"]
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

nonCardActivityFolders.forEach(function (folder) {
  const templateRoot = resolve(root, "packages/core/src/shared/learningActivities", folder, "templates");
  const registryPath = resolve(root, "packages/core/src/shared/learningActivities", folder, readRegistryFileName(folder));
  const registryText = readFileSync(registryPath, "utf8");
  const templateDirs = readdirSync(templateRoot).filter(function (entry) {
    return statSync(join(templateRoot, entry)).isDirectory();
  });
  const archetypes = new Set();
  let templateCount = 0;

  templateDirs.forEach(function (dir) {
    const dirPath = join(templateRoot, dir);
    const templateFile = readdirSync(dirPath).find(function (name) { return name.endsWith(".template.js"); });
    const metaFile = readdirSync(dirPath).find(function (name) { return name.endsWith(".meta.js"); });

    if (!templateFile || !metaFile) {
      failures += 1;
      console.error("[learning-template-audit:missing-template-files]", folder, dir);
      return;
    }

    const templateText = readFileSync(join(dirPath, templateFile), "utf8");
    const metaText = readFileSync(join(dirPath, metaFile), "utf8");
    const idMatch = metaText.match(/templateId:\s*"([^"]+)"/);
    const archetypeMatch = templateText.match(/"archetype":\s*"([^"]+)"/);
    const templateId = idMatch ? idMatch[1] : "";
    const archetype = archetypeMatch ? archetypeMatch[1] : "";

    templateCount += 1;
    if (archetype) archetypes.add(archetype);

    if (!templateText.includes("renderMiniGameTemplate")) {
      failures += 1;
      console.error("[learning-template-audit:not-mini-game]", folder, templateFile);
    }
    if (templateText.includes("renderLearningActivityTemplate") || templateText.includes("templateRenderer.js")) {
      failures += 1;
      console.error("[learning-template-audit:old-skin-renderer]", folder, templateFile);
    }
    if (!templateText.includes("getTemplateDefaultContent") || !templateText.includes("getTemplatePreviewContent")) {
      failures += 1;
      console.error("[learning-template-audit:missing-defaults]", folder, templateFile);
    }
    if (!templateId || !registryText.includes(toCamel(templateId) + "Meta")) {
      failures += 1;
      console.error("[learning-template-audit:not-registered]", folder, templateId || dir);
    }
  });

  if (templateCount < 5) {
    failures += 1;
    console.error("[learning-template-audit:too-few-templates]", folder, templateCount);
  }
  if (archetypes.size < 5) {
    failures += 1;
    console.error("[learning-template-audit:not-distinct-enough]", folder, Array.from(archetypes).join(","));
  }
});

if (failures > 0) {
  console.error("[learning-template-audit:failed]", failures + " issue(s)");
  process.exit(1);
}

console.log("[learning-template-audit:passed]", "card reveal plus " + nonCardActivityFolders.length + " activities have distinct mini-game templates");

function toCamel(value) {
  return String(value || "").replace(/[-_]+([a-zA-Z0-9])/g, function (_, char) { return char.toUpperCase(); }).replace(/^[A-Z]/, function (char) { return char.toLowerCase(); });
}

function readRegistryFileName(folder) {
  const map = {
    "custom-experience": "customExperience.registry.js",
    "cyber-code-mission": "cyberCodeMission.registry.js",
    "drag-match-island": "dragMatchIsland.registry.js",
    "external-task": "externalTask.registry.js",
    "intro-card": "introCard.registry.js",
    "multi-select": "multiSelect.registry.js",
    "multiple-choice": "multipleChoice.registry.js",
    "speaking-prompt": "speakingPrompt.registry.js",
    "text-briefing": "textBriefing.registry.js"
  };
  return map[folder] || folder + ".registry.js";
}