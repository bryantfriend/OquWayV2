export var TIMED_SEQUENCE_DEFAULT_THEME = "system-defusal";

var presets = {
  "system-defusal": {
    id: "system-defusal",
    name: "ICT System Defusal",
    items: [
      createItem("red", "RED", "red"),
      createItem("blue", "BLUE", "blue"),
      createItem("green", "GREEN", "green"),
      createItem("yellow", "YELLOW", "yellow")
    ]
  },
  "ict-workflow": {
    id: "ict-workflow",
    name: "ICT Workflow",
    items: [
      createItem("open-app", "Open App", "blue"),
      createItem("login", "Login", "green"),
      createItem("save-file", "Save File", "purple"),
      createItem("submit-work", "Submit Work", "amber")
    ]
  },
  coding: {
    id: "coding",
    name: "Coding",
    items: [
      createItem("start", "START", "green"),
      createItem("input", "INPUT", "blue"),
      createItem("process", "PROCESS", "purple"),
      createItem("output", "OUTPUT", "amber"),
      createItem("end", "END", "slate")
    ]
  },
  "science-method": {
    id: "science-method",
    name: "Science Method",
    items: [
      createItem("observe", "Observe", "blue"),
      createItem("predict", "Predict", "purple"),
      createItem("test", "Test", "red"),
      createItem("record", "Record", "amber"),
      createItem("conclude", "Conclude", "green")
    ]
  },
  "math-procedure": {
    id: "math-procedure",
    name: "Math Procedure",
    items: [
      createItem("read", "Read Problem", "blue"),
      createItem("choose", "Choose Operation", "purple"),
      createItem("calculate", "Calculate", "amber"),
      createItem("check", "Check Answer", "green")
    ]
  },
  "english-writing": {
    id: "english-writing",
    name: "English Writing",
    items: [
      createItem("plan", "Plan", "blue"),
      createItem("draft", "Draft", "purple"),
      createItem("revise", "Revise", "amber"),
      createItem("edit", "Edit", "red"),
      createItem("publish", "Publish", "green")
    ]
  },
  "classroom-routine": {
    id: "classroom-routine",
    name: "Classroom Routine",
    items: [
      createItem("check-work", "Check Work", "blue"),
      createItem("extension", "Extension Activity", "purple"),
      createItem("wait", "Wait Quietly", "green"),
      createItem("ask-teacher", "Ask Teacher", "amber")
    ]
  }
};

export function listTimedSequenceThemeOptions() {
  return Object.keys(presets).map(function (key) {
    return {
      value: presets[key].id,
      label: presets[key].name
    };
  });
}

export function readTimedSequenceTheme(themeId) {
  var preset = presets[themeId] || presets[TIMED_SEQUENCE_DEFAULT_THEME];

  return {
    id: preset.id,
    name: preset.name,
    items: preset.items.map(cloneItem)
  };
}

export function createDefaultSequenceItemsText() {
  return serializeSequenceItemsText(presets[TIMED_SEQUENCE_DEFAULT_THEME].items);
}

export function serializeSequenceItemsText(items) {
  return (Array.isArray(items) ? items : []).map(function (item) {
    return [item.label, item.colorClass].join("|");
  }).join("\n");
}

function createItem(id, label, colorClass) {
  return {
    id: id,
    label: label,
    colorClass: colorClass
  };
}

function cloneItem(item) {
  return createItem(item.id, item.label, item.colorClass);
}
