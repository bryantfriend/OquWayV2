export var FALLING_TARGET_DEFAULT_THEME = "ict-firewall-breach";

var presets = {
  "ict-firewall-breach": createPreset("ict-firewall-breach", "ICT Firewall Breach", "Core Data Line", ["Virus", "Malware", "Trojan"], ["Rapid Fire", "Firewall Shield"]),
  "math-rain": createPreset("math-rain", "Math Rain", "Answer Line", ["Wrong Answer", "Error", "Confusion"], ["Calculator Boost", "Hint Shield"]),
  "english-word-catch": createPreset("english-word-catch", "English Word Catch", "Sentence Line", ["Spelling Error", "Grammar Bug", "Wrong Word"], ["Dictionary Boost", "Grammar Shield"]),
  "science-lab-defense": createPreset("science-lab-defense", "Science Lab Defense", "Lab Table", ["Germ", "Spill", "Contamination"], ["Safety Goggles", "Lab Shield"]),
  "history-timeline-defense": createPreset("history-timeline-defense", "History Timeline Defense", "Timeline", ["Wrong Date", "Fake Source", "Lost Artifact"], ["Primary Source", "Research Boost"])
};

export function listFallingTargetPresetOptions() {
  return Object.keys(presets).map(function (key) {
    return { value: presets[key].id, label: presets[key].name };
  });
}

export function readFallingTargetPreset(themeId) {
  var preset = presets[themeId] || presets[FALLING_TARGET_DEFAULT_THEME];

  return {
    id: preset.id,
    name: preset.name,
    dangerZoneName: preset.dangerZoneName,
    fallingTargets: preset.fallingTargets.map(cloneObject)
  };
}

function createPreset(id, name, dangerZoneName, enemies, powerUps) {
  var targets = enemies.map(function (label, index) {
    return {
      id: slugify(label),
      label: label,
      icon: label.slice(0, 4).toUpperCase(),
      points: 100 + (index * 20),
      damage: 1,
      type: "enemy"
    };
  });

  powerUps.forEach(function (label, index) {
    targets.push({
      id: slugify(label),
      label: label,
      icon: index === 0 ? "FAST" : "SHLD",
      type: "powerup",
      effect: index === 0 ? "rapid-fire" : "shield",
      durationSeconds: index === 0 ? 3 : 5
    });
  });

  return {
    id: id,
    name: name,
    dangerZoneName: dangerZoneName,
    fallingTargets: targets
  };
}

function cloneObject(value) {
  return Object.assign({}, value);
}

function slugify(value) {
  return String(value || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
}
