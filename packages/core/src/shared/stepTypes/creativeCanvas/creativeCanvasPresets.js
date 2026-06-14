export var CREATIVE_CANVAS_DEFAULT_PRESET = "ict-design";

export var creativeCanvasPresets = {
  "ict-design": createPreset({
    id: "ict-design",
    name: "ICT Design",
    stampPack: "ict",
    canvasBackground: "blank-dark",
    prompt: "Draw technology around you.",
    stamps: [
      createStamp("computer", "Computer", "PC"),
      createStamp("phone", "Phone", "PH"),
      createStamp("server", "Server", "SV"),
      createStamp("wifi", "WiFi", "WF"),
      createStamp("robot", "Robot", "RB"),
      createStamp("battery", "Battery", "BT"),
      createStamp("tools", "Tools", "TL")
    ]
  }),
  "science-diagram": createPreset({
    id: "science-diagram",
    name: "Science Diagram",
    stampPack: "science",
    canvasBackground: "grid-light",
    prompt: "Draw and label a science diagram.",
    stamps: [
      createStamp("atom", "Atom", "AT"),
      createStamp("cell", "Cell", "CL"),
      createStamp("planet", "Planet", "PL"),
      createStamp("microscope", "Microscope", "MS"),
      createStamp("leaf", "Leaf", "LF"),
      createStamp("water-drop", "Water", "WD")
    ]
  }),
  "math-sketch": createPreset({
    id: "math-sketch",
    name: "Math Sketch",
    stampPack: "math",
    canvasBackground: "grid-light",
    prompt: "Draw a shape and label its sides.",
    stamps: [
      createStamp("shape", "Shape", "SH"),
      createStamp("number", "Number", "12"),
      createStamp("graph", "Graph", "GR"),
      createStamp("ruler", "Ruler", "RL"),
      createStamp("angle", "Angle", "AN")
    ]
  }),
  "english-storyboard": createPreset({
    id: "english-storyboard",
    name: "English Storyboard",
    stampPack: "english",
    canvasBackground: "paper",
    prompt: "Draw the beginning of a story.",
    stamps: [
      createStamp("character", "Character", "CH"),
      createStamp("speech", "Speech", "SP"),
      createStamp("book", "Book", "BK"),
      createStamp("setting", "Setting", "ST"),
      createStamp("emotion", "Emotion", "EM")
    ]
  }),
  "history-artifact": createPreset({
    id: "history-artifact",
    name: "History Artifact",
    stampPack: "history",
    canvasBackground: "paper",
    prompt: "Draw an artifact from the lesson.",
    stamps: [
      createStamp("map", "Map", "MP"),
      createStamp("scroll", "Scroll", "SC"),
      createStamp("crown", "Crown", "CR"),
      createStamp("castle", "Castle", "CS"),
      createStamp("coin", "Coin", "CN")
    ]
  })
};

export function readCreativeCanvasPreset(presetId) {
  var safePresetId = typeof presetId === "string" ? presetId.trim() : "";
  var preset = creativeCanvasPresets[safePresetId] || creativeCanvasPresets[CREATIVE_CANVAS_DEFAULT_PRESET];

  return {
    id: preset.id,
    name: preset.name,
    stampPack: preset.stampPack,
    canvasBackground: preset.canvasBackground,
    prompt: preset.prompt,
    stamps: preset.stamps.map(function (stamp) {
      return Object.assign({}, stamp);
    })
  };
}

export function listCreativeCanvasPresetOptions() {
  return Object.keys(creativeCanvasPresets).map(function (presetId) {
    return {
      value: presetId,
      label: creativeCanvasPresets[presetId].name
    };
  });
}

function createPreset(preset) {
  return preset;
}

function createStamp(id, label, glyph) {
  return {
    id: id,
    label: label,
    glyph: glyph
  };
}
