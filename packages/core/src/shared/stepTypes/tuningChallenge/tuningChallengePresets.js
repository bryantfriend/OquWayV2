export var TUNING_CHALLENGE_DEFAULT_THEME = "science-wave-tuner";

var tuningChallengePresets = {
  "science-wave-tuner": {
    id: "science-wave-tuner",
    name: "Science Wave Tuner",
    targetType: "wave",
    title: "Frequency Tuner",
    instructions: "Adjust frequency and amplitude until your signal matches the target wave.",
    controls: [
      createControl("frequency", "Frequency", 1, 10, 0.1, 5),
      createControl("amplitude", "Amplitude", 1, 10, 0.1, 5)
    ],
    targetValues: {
      frequency: 7.2,
      amplitude: 3.5
    }
  },
  "ict-signal-tuner": {
    id: "ict-signal-tuner",
    name: "ICT Signal Tuner",
    targetType: "wave",
    title: "Network Signal Tuner",
    instructions: "Tune the signal strength and rhythm to stabilize the connection.",
    controls: [
      createControl("frequency", "Signal Rhythm", 1, 10, 0.1, 4),
      createControl("amplitude", "Signal Strength", 1, 10, 0.1, 4)
    ],
    targetValues: {
      frequency: 6.5,
      amplitude: 7
    }
  },
  "math-graph-match": {
    id: "math-graph-match",
    name: "Math Graph Match",
    targetType: "graph",
    title: "Graph Match",
    instructions: "Adjust the graph controls until your model matches the target.",
    controls: [
      createControl("frequency", "Slope", 1, 10, 0.1, 5),
      createControl("amplitude", "Height", 1, 10, 0.1, 5)
    ],
    targetValues: {
      frequency: 6,
      amplitude: 4
    }
  },
  "music-pitch-tuner": {
    id: "music-pitch-tuner",
    name: "Music Pitch Tuner",
    targetType: "wave",
    title: "Pitch Tuner",
    instructions: "Match the pitch and volume to tune the sound.",
    controls: [
      createControl("frequency", "Pitch", 1, 10, 0.1, 3),
      createControl("amplitude", "Volume", 1, 10, 0.1, 6)
    ],
    targetValues: {
      frequency: 5.8,
      amplitude: 6.8
    }
  },
  "design-color-match": {
    id: "design-color-match",
    name: "Design Color Match",
    targetType: "color",
    title: "Color Match",
    instructions: "Adjust the controls to match the design target.",
    controls: [
      createControl("frequency", "Brightness", 1, 10, 0.1, 5),
      createControl("amplitude", "Contrast", 1, 10, 0.1, 5)
    ],
    targetValues: {
      frequency: 8,
      amplitude: 4.2
    }
  }
};

export function listTuningChallengePresetOptions() {
  return Object.keys(tuningChallengePresets).map(function (key) {
    var preset = tuningChallengePresets[key];

    return {
      value: preset.id,
      label: preset.name
    };
  });
}

export function readTuningChallengePreset(themeId) {
  var preset = tuningChallengePresets[themeId] || tuningChallengePresets[TUNING_CHALLENGE_DEFAULT_THEME];

  return {
    id: preset.id,
    name: preset.name,
    title: preset.title,
    instructions: preset.instructions,
    targetType: preset.targetType,
    controls: preset.controls.map(cloneObject),
    targetValues: Object.assign({}, preset.targetValues)
  };
}

function createControl(id, label, min, max, step, defaultValue) {
  return {
    id: id,
    label: label,
    min: min,
    max: max,
    step: step,
    defaultValue: defaultValue
  };
}

function cloneObject(value) {
  return Object.assign({}, value);
}
