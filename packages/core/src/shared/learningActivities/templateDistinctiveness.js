var PERSONALITIES = [
  {
    id: "detective",
    keywords: ["detective", "mystery", "clue", "evidence", "case", "x-ray"],
    icon: "⌕",
    formatLabel: "Case file",
    setting: "a clue-led investigation",
    callToAction: "Close the case"
  },
  {
    id: "cartography",
    keywords: ["map", "quest", "treasure", "island", "harbor", "tour", "journey"],
    icon: "⌁",
    formatLabel: "Field map",
    setting: "an exploratory field map",
    callToAction: "Finish the expedition"
  },
  {
    id: "cyber",
    keywords: ["cyber", "firewall", "debug", "html", "terminal", "code", "radar", "scanner", "threat"],
    icon: "⌘",
    formatLabel: "Mission console",
    setting: "a live digital mission",
    callToAction: "Complete the mission"
  },
  {
    id: "studio",
    keywords: ["podcast", "radio", "newsroom", "listening", "echo", "sound", "speaking", "pitch", "trailer"],
    icon: "◉",
    formatLabel: "Studio session",
    setting: "a hands-on media studio",
    callToAction: "Wrap the session"
  },
  {
    id: "editorial",
    keywords: ["story", "comic", "journal", "brief", "file", "concept", "spotlight", "reflection"],
    icon: "✎",
    formatLabel: "Editorial notebook",
    setting: "an illustrated learner notebook",
    callToAction: "Finish the page"
  },
  {
    id: "botanical",
    keywords: ["garden", "growth", "recycle", "nature"],
    icon: "❋",
    formatLabel: "Growth lab",
    setting: "an organic growth space",
    callToAction: "Record the growth"
  },
  {
    id: "workshop",
    keywords: ["builder", "workbench", "prototype", "lab", "draft", "project", "office"],
    icon: "◇",
    formatLabel: "Maker bench",
    setting: "a practical maker workshop",
    callToAction: "Ship the build"
  },
  {
    id: "summit",
    keywords: ["boss", "battle", "climb", "checkpoint", "challenge", "sprint"],
    icon: "▲",
    formatLabel: "Challenge arena",
    setting: "a high-stakes challenge arena",
    callToAction: "Clear the challenge"
  },
  {
    id: "timeline",
    keywords: ["timeline", "roadmap", "path", "sequence", "lane", "history"],
    icon: "↗",
    formatLabel: "Progress route",
    setting: "a milestone-driven progress route",
    callToAction: "Reach the destination"
  },
  {
    id: "language",
    keywords: ["word", "vocabulary", "phrase", "dialog", "response", "memory", "rapid"],
    icon: "Aa",
    formatLabel: "Language lab",
    setting: "a focused language practice space",
    callToAction: "Lock in the language"
  },
  {
    id: "safety",
    keywords: ["safety", "rescue", "warning", "security", "proof", "review"],
    icon: "!",
    formatLabel: "Safety station",
    setting: "a decision-focused safety station",
    callToAction: "Confirm the safe choice"
  },
  {
    id: "classic",
    keywords: ["standard", "classic"],
    icon: "✦",
    formatLabel: "Core practice",
    setting: "a clean, focused practice desk",
    callToAction: "Complete the practice"
  }
];

var PALETTES = [
  { secondary: "#0f766e", surface: "#f0fdfa", ink: "#134e4a" },
  { secondary: "#7c3aed", surface: "#f5f3ff", ink: "#4c1d95" },
  { secondary: "#c2410c", surface: "#fff7ed", ink: "#7c2d12" },
  { secondary: "#0369a1", surface: "#f0f9ff", ink: "#0c4a6e" },
  { secondary: "#be123c", surface: "#fff1f2", ink: "#881337" },
  { secondary: "#3f6212", surface: "#f7fee7", ink: "#365314" },
  { secondary: "#a16207", surface: "#fffbeb", ink: "#713f12" },
  { secondary: "#4338ca", surface: "#eef2ff", ink: "#312e81" },
  { secondary: "#0f766e", surface: "#ecfeff", ink: "#164e63" },
  { secondary: "#9f1239", surface: "#fdf2f8", ink: "#831843" }
];

var ARCHETYPE_DESCRIPTIONS = {
  "quest-map": "Learners choose destinations and reveal content by moving across the route.",
  "lab-switchboard": "Learners activate panels, compare signals, and bring a compact system online.",
  "evidence-board": "Learners uncover clues one at a time and connect details before resolving the case.",
  "drag-bays": "Learners physically sort prompts into labeled bays and watch the layout take shape.",
  "terminal-challenge": "Learners inspect code-like information and run deliberate commands to progress.",
  "scanner-grid": "Learners move a scanner through a field and inspect hidden signals at their own pace.",
  "boss-battle": "Learners choose strategic moves that visibly reduce a challenge meter.",
  "timeline-unlock": "Learners unlock a sequence one milestone at a time, making order and progress explicit.",
  "builder-workbench": "Learners select tools, assemble ideas, and produce a short constructed response.",
  "media-mixer": "Learners play a sample, isolate useful words, and check the transcript when needed.",
  "upload-studio": "Learners follow a proof checklist, attach their work, and send a note for review.",
  "mood-meter": "Learners choose a confidence level and explain the evidence behind that choice.",
  "emoji-checkin": "Learners select an expressive check-in and add a brief personal explanation.",
  "dialog-builder": "Learners choose the next line in a conversation and see the exchange develop.",
  "roadmap-trail": "Learners advance through connected checkpoints while a progress trail fills in.",
  "card-stack": "Learners flip through layered cards, revealing one compact idea at a time.",
  "quiz-show": "Learners make a focused choice from a bold question-and-answer stage.",
  "matrix-grid": "Learners scan a tile grid and toggle every item that fits the prompt."
};

export function resolveTemplatePersonality(templateId, displayName, archetype) {
  var identitySource = (text(templateId) + " " + text(displayName)).toLowerCase();
  var archetypeSource = text(archetype).toLowerCase();
  var source = (identitySource + " " + archetypeSource).trim();
  var hash = hashText(source || "oquway-template");
  var personality =
    findPersonality(identitySource) ||
    findPersonality(archetypeSource) ||
    PERSONALITIES[hash % PERSONALITIES.length];
  var palette = PALETTES[hash % PALETTES.length];

  return {
    id: personality.id,
    icon: personality.icon,
    formatLabel: personality.formatLabel,
    setting: personality.setting,
    callToAction: personality.callToAction,
    secondary: palette.secondary,
    surface: palette.surface,
    ink: palette.ink,
    pattern: hash % 6,
    radius: [6, 10, 14, 18, 24][hash % 5],
    signature: hash.toString(36)
  };
}

export function enrichTemplateMetadata(meta, activityDefinition) {
  var safeMeta = meta && typeof meta === "object" ? meta : {};
  var activity = activityDefinition && typeof activityDefinition === "object" ? activityDefinition : {};
  var archetype = readArchetype(safeMeta);
  var personality = resolveTemplatePersonality(safeMeta.templateId, safeMeta.displayName, archetype);
  var description = buildTemplateDescription(safeMeta, activity, archetype, personality);
  var features = Array.isArray(safeMeta.visualFeatures) ? safeMeta.visualFeatures.slice() : [];

  [personality.formatLabel, personality.setting, "signature-" + personality.signature].forEach(function (feature) {
    if (features.indexOf(feature) === -1) {
      features.push(feature);
    }
  });

  return Object.assign({}, safeMeta, {
    description: description,
    visualFeatures: features,
    personality: {
      id: personality.id,
      formatLabel: personality.formatLabel,
      signature: personality.signature
    }
  });
}

function buildTemplateDescription(meta, activity, archetype, personality) {
  var name = text(meta.displayName) || "This template";
  var activityName = text(activity.displayName) || humanize(text(meta.activityType)) || "learning";
  var interaction = ARCHETYPE_DESCRIPTIONS[archetype] || "Learners interact with the content through a focused, responsive practice flow.";

  return name + " frames " + activityName.toLowerCase() + " as " + personality.setting + ". " + interaction;
}

function findPersonality(source) {
  var best = null;
  var bestScore = 0;

  PERSONALITIES.forEach(function (personality) {
    var score = personality.keywords.reduce(function (count, keyword) {
      return count + (source.indexOf(keyword) !== -1 ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      best = personality;
      bestScore = score;
    }
  });

  return best;
}

function readArchetype(meta) {
  var features = Array.isArray(meta.visualFeatures) ? meta.visualFeatures : [];
  var index = 0;

  while (index < features.length) {
    if (ARCHETYPE_DESCRIPTIONS[features[index]]) {
      return features[index];
    }
    index += 1;
  }

  return "";
}

function hashText(value) {
  var hash = 2166136261;
  var index = 0;

  while (index < value.length) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
    index += 1;
  }

  return hash >>> 0;
}

function humanize(value) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/^./, function (letter) { return letter.toUpperCase(); });
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
