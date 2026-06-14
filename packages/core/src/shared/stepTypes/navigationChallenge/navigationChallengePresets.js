export var NAVIGATION_CHALLENGE_DEFAULT_THEME = "space-navigation";

var presets = {
  "space-navigation": createPreset("space-navigation", "Space Navigation", "spaceship", "Data Fragment", "Asteroid", ["Asteroid", "Space Debris"], ["Data Fragment", "Star Crystal"], "Laser"),
  "ict-network-route": createPreset("ict-network-route", "ICT Network Route", "data-packet", "Clean Data", "Firewall Block", ["Firewall Block", "Malware Wall", "Broken Cable"], ["Clean Data", "Signal Boost"], "Debug Beam"),
  "science-cell-journey": createPreset("science-cell-journey", "Science Cell Journey", "cell", "Nutrient", "Toxin", ["Toxin", "Virus", "Barrier"], ["Nutrient", "Oxygen", "Energy"], "Antibody Burst"),
  "math-path-finder": createPreset("math-path-finder", "Math Path Finder", "number-bot", "Correct Answer", "Error Block", ["Error Block", "Wrong Formula"], ["Correct Answer", "Formula Piece"], "Solve Beam"),
  "english-story-quest": createPreset("english-story-quest", "English Story Quest", "story-hero", "Vocabulary Word", "Grammar Trap", ["Grammar Trap", "Spelling Cloud"], ["Vocabulary Word", "Story Clue"], "Edit Beam"),
  "history-explorer": createPreset("history-explorer", "History Explorer", "explorer", "Artifact", "Fake Source", ["Fake Source", "Timeline Error"], ["Artifact", "Primary Source"], "Research Beam")
};

export function listNavigationChallengePresetOptions() {
  return Object.keys(presets).map(function (key) {
    return { value: presets[key].id, label: presets[key].name };
  });
}

export function readNavigationChallengePreset(themeId) {
  var preset = presets[themeId] || presets[NAVIGATION_CHALLENGE_DEFAULT_THEME];

  return {
    id: preset.id,
    name: preset.name,
    avatarType: preset.avatarType,
    collectibleName: preset.collectibleName,
    obstacleName: preset.obstacleName,
    actionName: preset.actionName,
    obstacles: preset.obstacles.map(cloneObject),
    collectibles: preset.collectibles.map(cloneObject)
  };
}

function createPreset(id, name, avatarType, collectibleName, obstacleName, obstacles, collectibles, actionName) {
  return {
    id: id,
    name: name,
    avatarType: avatarType,
    collectibleName: collectibleName,
    obstacleName: obstacleName,
    actionName: actionName,
    obstacles: obstacles.map(function (label) {
      return { id: slugify(label), label: label, points: 50, damage: 1, canBeDestroyed: true };
    }),
    collectibles: collectibles.map(function (label) {
      return { id: slugify(label), label: label, points: 100, type: "collectible" };
    })
  };
}

function cloneObject(value) { return Object.assign({}, value); }
function slugify(value) { return String(value || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item"; }
