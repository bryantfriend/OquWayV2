export var DEFENSE_CHALLENGE_DEFAULT_THEME = "ict-system-defense";

var defenseChallengePresets = {
  "ict-system-defense": {
    id: "ict-system-defense",
    name: "ICT System Defense",
    protectedTargetName: "System",
    threats: [
      createThreat("bug", "Bug", "BUG", 100, 10, 1),
      createThreat("virus", "Virus", "VRS", 120, 12, 1),
      createThreat("malware", "Malware", "MAL", 140, 14, 1),
      createThreat("boss-bug", "Boss Bug", "BOSS", 500, 20, 3, true)
    ],
    powerUps: [
      createPowerUp("health-patch", "Health Patch", "HP", 25),
      createPowerUp("firewall-boost", "Firewall Boost", "FW", 15)
    ]
  },
  "science-body-defense": {
    id: "science-body-defense",
    name: "Science Body Defense",
    protectedTargetName: "Body",
    threats: [
      createThreat("germ", "Germ", "GERM", 100, 10, 1),
      createThreat("virus", "Virus", "VRS", 130, 12, 1),
      createThreat("bacteria", "Bacteria", "BAC", 150, 14, 1)
    ],
    powerUps: [
      createPowerUp("medicine", "Medicine", "MED", 25),
      createPowerUp("antibody", "Antibody", "AB", 20)
    ]
  },
  "math-castle-defense": {
    id: "math-castle-defense",
    name: "Math Castle Defense",
    protectedTargetName: "Math Castle",
    threats: [
      createThreat("wrong-answer", "Wrong Answer", "ERR", 100, 10, 1),
      createThreat("error-monster", "Error Monster", "MON", 150, 15, 1),
      createThreat("confusion-cloud", "Confusion Cloud", "???", 120, 12, 1)
    ],
    powerUps: [
      createPowerUp("hint", "Hint", "HINT", 20),
      createPowerUp("formula-shield", "Formula Shield", "FORM", 25)
    ]
  },
  "english-grammar-defense": {
    id: "english-grammar-defense",
    name: "English Grammar Defense",
    protectedTargetName: "Sentence",
    threats: [
      createThreat("spelling-error", "Spelling Error", "SPL", 100, 10, 1),
      createThreat("grammar-bug", "Grammar Bug", "GRAM", 130, 12, 1),
      createThreat("punctuation-problem", "Punctuation Problem", "PUNC", 120, 12, 1)
    ],
    powerUps: [
      createPowerUp("dictionary", "Dictionary", "DICT", 20),
      createPowerUp("grammar-shield", "Grammar Shield", "SHLD", 25)
    ]
  },
  "history-museum-defense": {
    id: "history-museum-defense",
    name: "History Museum Defense",
    protectedTargetName: "Museum",
    threats: [
      createThreat("lost-artifact", "Lost Artifact", "LOST", 100, 10, 1),
      createThreat("fake-source", "Fake Source", "FAKE", 140, 14, 1),
      createThreat("timeline-error", "Timeline Error", "TIME", 120, 12, 1)
    ],
    powerUps: [
      createPowerUp("research-note", "Research Note", "NOTE", 20),
      createPowerUp("primary-source", "Primary Source", "SRC", 25)
    ]
  }
};

export function listDefenseChallengePresetOptions() {
  return Object.keys(defenseChallengePresets).map(function (key) {
    var preset = defenseChallengePresets[key];

    return {
      value: preset.id,
      label: preset.name
    };
  });
}

export function readDefenseChallengePreset(themeId) {
  var preset = defenseChallengePresets[themeId] || defenseChallengePresets[DEFENSE_CHALLENGE_DEFAULT_THEME];

  return {
    id: preset.id,
    name: preset.name,
    protectedTargetName: preset.protectedTargetName,
    threats: preset.threats.map(cloneObject),
    powerUps: preset.powerUps.map(cloneObject)
  };
}

function createThreat(id, label, icon, points, damage, hp, isBoss) {
  return {
    id: id,
    label: label,
    icon: icon,
    points: points,
    damage: damage,
    hp: hp,
    isCorrect: true,
    isBoss: isBoss === true
  };
}

function createPowerUp(id, label, icon, healAmount) {
  return {
    id: id,
    label: label,
    icon: icon,
    healAmount: healAmount
  };
}

function cloneObject(value) {
  return Object.assign({}, value);
}
