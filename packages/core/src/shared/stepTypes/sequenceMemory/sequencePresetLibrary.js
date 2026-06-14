export var SEQUENCE_MEMORY_DEFAULT_THEME = "synth-matrix";

var defaultPads = [
  createPad("pad-0", "1", "triangle", 261.63),
  createPad("pad-1", "2", "circle", 293.66),
  createPad("pad-2", "3", "square", 329.63),
  createPad("pad-3", "4", "diamond", 349.23),
  createPad("pad-4", "5", "pulse", 392),
  createPad("pad-5", "6", "wave", 440),
  createPad("pad-6", "7", "spark", 493.88),
  createPad("pad-7", "8", "beam", 523.25),
  createPad("pad-8", "9", "node", 587.33)
];

var presets = {
  "synth-matrix": {
    id: "synth-matrix",
    name: "Music / Sound",
    soundEnabled: true,
    pads: [
      createPad("pad-0", "C", "note", 261.63),
      createPad("pad-1", "D", "note", 293.66),
      createPad("pad-2", "E", "note", 329.63),
      createPad("pad-3", "F", "note", 349.23),
      createPad("pad-4", "G", "note", 392),
      createPad("pad-5", "A", "note", 440),
      createPad("pad-6", "B", "note", 493.88),
      createPad("pad-7", "C2", "note", 523.25),
      createPad("pad-8", "D2", "note", 587.33)
    ]
  },
  "ict-algorithms": {
    id: "ict-algorithms",
    name: "ICT / Algorithms",
    soundEnabled: false,
    pads: [
      createPad("pad-0", "INPUT", "in", 261.63),
      createPad("pad-1", "PROCESS", "cpu", 293.66),
      createPad("pad-2", "OUTPUT", "out", 329.63),
      createPad("pad-3", "STORE", "db", 349.23),
      createPad("pad-4", "SEND", "net", 392),
      createPad("pad-5", "CHECK", "ok", 440),
      createPad("pad-6", "RETRY", "loop", 493.88),
      createPad("pad-7", "DEBUG", "bug", 523.25),
      createPad("pad-8", "END", "stop", 587.33)
    ]
  },
  coding: {
    id: "coding",
    name: "Coding",
    soundEnabled: false,
    pads: [
      createPad("pad-0", "START", "start", 261.63),
      createPad("pad-1", "LOOP", "loop", 293.66),
      createPad("pad-2", "IF", "if", 329.63),
      createPad("pad-3", "ELSE", "else", 349.23),
      createPad("pad-4", "PRINT", "print", 392),
      createPad("pad-5", "END", "end", 440),
      createPad("pad-6", "CALL", "call", 493.88),
      createPad("pad-7", "RETURN", "return", 523.25),
      createPad("pad-8", "FIX", "fix", 587.33)
    ]
  },
  math: {
    id: "math",
    name: "Math",
    soundEnabled: false,
    pads: [
      createPad("pad-0", "1", "num", 261.63),
      createPad("pad-1", "2", "num", 293.66),
      createPad("pad-2", "3", "num", 329.63),
      createPad("pad-3", "+", "add", 349.23),
      createPad("pad-4", "-", "sub", 392),
      createPad("pad-5", "x", "mul", 440),
      createPad("pad-6", "/", "div", 493.88),
      createPad("pad-7", "=", "eq", 523.25),
      createPad("pad-8", "?", "solve", 587.33)
    ]
  },
  science: {
    id: "science",
    name: "Science",
    soundEnabled: false,
    pads: [
      createPad("pad-0", "OBSERVE", "eye", 261.63),
      createPad("pad-1", "PREDICT", "idea", 293.66),
      createPad("pad-2", "TEST", "lab", 329.63),
      createPad("pad-3", "RECORD", "note", 349.23),
      createPad("pad-4", "CONCLUDE", "check", 392),
      createPad("pad-5", "REPEAT", "loop", 440),
      createPad("pad-6", "MEASURE", "ruler", 493.88),
      createPad("pad-7", "COMPARE", "scale", 523.25),
      createPad("pad-8", "SHARE", "talk", 587.33)
    ]
  },
  english: {
    id: "english",
    name: "English",
    soundEnabled: false,
    pads: [
      createPad("pad-0", "WHO", "person", 261.63),
      createPad("pad-1", "WHERE", "place", 293.66),
      createPad("pad-2", "WHEN", "time", 329.63),
      createPad("pad-3", "PROBLEM", "plot", 349.23),
      createPad("pad-4", "ACTION", "move", 392),
      createPad("pad-5", "ENDING", "end", 440),
      createPad("pad-6", "DETAIL", "detail", 493.88),
      createPad("pad-7", "QUOTE", "quote", 523.25),
      createPad("pad-8", "THEME", "theme", 587.33)
    ]
  }
};

export function listSequenceMemoryThemeOptions() {
  return Object.keys(presets).map(function (key) {
    return {
      value: presets[key].id,
      label: presets[key].name
    };
  });
}

export function readSequenceMemoryTheme(themeId) {
  var preset = presets[themeId] || presets[SEQUENCE_MEMORY_DEFAULT_THEME];

  return {
    id: preset.id,
    name: preset.name,
    soundEnabled: preset.soundEnabled === true,
    pads: preset.pads.map(clonePad)
  };
}

export function createDefaultPadsText() {
  return serializePadsText(defaultPads);
}

export function serializePadsText(pads) {
  return (Array.isArray(pads) ? pads : []).map(function (pad) {
    return [pad.label, pad.icon, pad.frequency].join("|");
  }).join("\n");
}

function createPad(id, label, icon, frequency) {
  return {
    id: id,
    label: label,
    icon: icon,
    frequency: frequency
  };
}

function clonePad(pad) {
  return createPad(pad.id, pad.label, pad.icon, pad.frequency);
}
