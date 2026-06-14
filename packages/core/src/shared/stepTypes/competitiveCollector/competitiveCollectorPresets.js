export var COMPETITIVE_COLLECTOR_DEFAULT_THEME = "ict-data-mining";

export var competitiveCollectorPresets = {
  "ict-data-mining": createPreset({
    id: "ict-data-mining",
    name: "ICT Data Mining",
    resourceName: "DATA",
    collectibles: [
      createCollectible("file", "File", 25, "common", true),
      createCollectible("server", "Server", 40, "common", true),
      createCollectible("bug", "Bug", 0, "common", false),
      createCollectible("gold-server", "Golden Server", 100, "rare", true)
    ],
    upgrades: [
      createUpgrade("auto-miner", "Auto Miner", 50, 1.5, 1),
      createUpgrade("firewall-bot", "Firewall Bot", 150, 1.6, 3),
      createUpgrade("processor-boost", "Processor Boost", 300, 1.7, 7)
    ],
    rivals: ["AlphaUnit", "CyberNinja", "PixelBot"]
  }),
  "science-lab": createPreset({
    id: "science-lab",
    name: "Science Lab",
    resourceName: "ENERGY",
    collectibles: [
      createCollectible("atom", "Atom", 20, "common", true),
      createCollectible("cell", "Cell", 35, "common", true),
      createCollectible("unstable-sample", "Unstable Sample", 0, "common", false),
      createCollectible("crystal", "Crystal", 95, "rare", true)
    ],
    upgrades: [
      createUpgrade("lab-assistant", "Lab Assistant", 50, 1.5, 1),
      createUpgrade("microscope", "Microscope", 140, 1.6, 3),
      createUpgrade("research-bot", "Research Bot", 300, 1.7, 7)
    ],
    rivals: ["NovaLab", "AtomAce", "OrbitBot"]
  }),
  "math-quest": createPreset({
    id: "math-quest",
    name: "Math Quest",
    resourceName: "POINTS",
    collectibles: [
      createCollectible("number", "Number", 20, "common", true),
      createCollectible("equation", "Equation", 35, "common", true),
      createCollectible("wrong-turn", "Wrong Turn", 0, "common", false),
      createCollectible("golden-formula", "Golden Formula", 100, "rare", true)
    ],
    upgrades: [
      createUpgrade("calculator", "Calculator", 50, 1.5, 1),
      createUpgrade("formula-helper", "Formula Helper", 140, 1.6, 3),
      createUpgrade("math-bot", "Math Bot", 300, 1.7, 7)
    ],
    rivals: ["NumberNinja", "ShapeStar", "ProofBot"]
  }),
  "english-word-hunt": createPreset({
    id: "english-word-hunt",
    name: "English Word Hunt",
    resourceName: "WORDS",
    collectibles: [
      createCollectible("noun", "Noun", 20, "common", true),
      createCollectible("verb", "Verb", 35, "common", true),
      createCollectible("fragment", "Fragment", 0, "common", false),
      createCollectible("golden-word", "Golden Word", 100, "rare", true)
    ],
    upgrades: [
      createUpgrade("dictionary", "Dictionary", 50, 1.5, 1),
      createUpgrade("grammar-helper", "Grammar Helper", 140, 1.6, 3),
      createUpgrade("reading-buddy", "Reading Buddy", 300, 1.7, 7)
    ],
    rivals: ["WordWizard", "GrammarHero", "StoryBot"]
  }),
  "history-artifact-hunt": createPreset({
    id: "history-artifact-hunt",
    name: "History Artifact Hunt",
    resourceName: "ARTIFACTS",
    collectibles: [
      createCollectible("map", "Map", 20, "common", true),
      createCollectible("scroll", "Scroll", 35, "common", true),
      createCollectible("fake-relic", "Fake Relic", 0, "common", false),
      createCollectible("ancient-coin", "Ancient Coin", 100, "rare", true)
    ],
    upgrades: [
      createUpgrade("archaeologist", "Archaeologist", 50, 1.5, 1),
      createUpgrade("museum-team", "Museum Team", 140, 1.6, 3),
      createUpgrade("research-crew", "Research Crew", 300, 1.7, 7)
    ],
    rivals: ["ArchiveAce", "RelicRunner", "TimelineBot"]
  })
};

export function readCompetitiveCollectorPreset(themeId) {
  var safeThemeId = typeof themeId === "string" ? themeId.trim() : "";
  var preset = competitiveCollectorPresets[safeThemeId] || competitiveCollectorPresets[COMPETITIVE_COLLECTOR_DEFAULT_THEME];

  return clonePreset(preset);
}

export function listCompetitiveCollectorPresetOptions() {
  return Object.keys(competitiveCollectorPresets).map(function (themeId) {
    return {
      value: themeId,
      label: competitiveCollectorPresets[themeId].name
    };
  });
}

function createPreset(preset) {
  return preset;
}

function createCollectible(id, label, points, rarity, isCorrect) {
  return {
    id: id,
    label: label,
    points: points,
    rarity: rarity,
    isCorrect: isCorrect
  };
}

function createUpgrade(id, name, baseCost, costMultiplier, pointsPerSecond) {
  return {
    id: id,
    name: name,
    baseCost: baseCost,
    costMultiplier: costMultiplier,
    pointsPerSecond: pointsPerSecond
  };
}

function clonePreset(preset) {
  return {
    id: preset.id,
    name: preset.name,
    resourceName: preset.resourceName,
    collectibles: preset.collectibles.map(function (item) {
      return Object.assign({}, item);
    }),
    upgrades: preset.upgrades.map(function (upgrade) {
      return Object.assign({}, upgrade);
    }),
    rivals: preset.rivals.slice()
  };
}
