export var CARE_SIMULATOR_DEFAULT_THEME = "ict-robot-habitat";

var presets = {
  "ict-robot-habitat": createPreset("ict-robot-habitat", "ICT Robot Habitat", "Robot", "robot", "Energy", ["Data", "Power", "Coolant"], ["Virus", "Corrupt File"]),
  "science-ecosystem": createPreset("science-ecosystem", "Science Ecosystem", "Plant", "plant", "Health", ["Sunlight", "Water", "Nutrients"], ["Pollution", "Drought"]),
  "english-reading-buddy": createPreset("english-reading-buddy", "English Reading Buddy", "Reading Buddy", "reading-buddy", "Focus", ["Vocabulary", "Main Idea", "Details"], ["Distraction", "Missing Evidence"]),
  "math-problem-bot": createPreset("math-problem-bot", "Math Problem Bot", "Math Bot", "math-bot", "Confidence", ["Formula", "Example", "Calculation"], ["Guess", "Wrong Operation"]),
  "history-museum-curator": createPreset("history-museum-curator", "History Museum Curator", "Curator", "curator", "Accuracy", ["Primary Source", "Date", "Artifact"], ["Fake Source", "Wrong Timeline"]),
  "sel-classroom-habits": createPreset("sel-classroom-habits", "SEL Classroom Habits", "Student Avatar", "student-avatar", "Readiness", ["Quiet Waiting", "Check Work", "Ask for Help"], ["Distract Others", "Random Websites"])
};

export function listCareSimulatorPresetOptions() {
  return Object.keys(presets).map(function (key) {
    return { value: presets[key].id, label: presets[key].name };
  });
}

export function readCareSimulatorPreset(themeId) {
  var preset = presets[themeId] || presets[CARE_SIMULATOR_DEFAULT_THEME];

  return {
    id: preset.id,
    name: preset.name,
    characterName: preset.characterName,
    characterType: preset.characterType,
    statusMeterName: preset.statusMeterName,
    resources: preset.resources.map(cloneObject)
  };
}

function createPreset(id, name, characterName, characterType, statusMeterName, helpful, wrong) {
  return {
    id: id,
    name: name,
    characterName: characterName,
    characterType: characterType,
    statusMeterName: statusMeterName,
    resources: helpful.map(function (label, index) {
      return { id: slugify(label), label: label, icon: label.slice(0, 4).toUpperCase(), statusEffect: 18 + (index * 6), type: "helpful" };
    }).concat(wrong.map(function (label) {
      return { id: slugify(label), label: label, icon: "NO", statusEffect: -18, type: "wrong" };
    }))
  };
}

function cloneObject(value) { return Object.assign({}, value); }
function slugify(value) { return String(value || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item"; }
