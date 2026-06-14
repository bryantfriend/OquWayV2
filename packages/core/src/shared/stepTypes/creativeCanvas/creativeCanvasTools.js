export var CREATIVE_CANVAS_TOOLS = [
  createTool("brush", "Brush"),
  createTool("square-brush", "Square"),
  createTool("spray", "Spray"),
  createTool("fill", "Fill"),
  createTool("eraser", "Eraser"),
  createTool("stamp", "Stamp"),
  createTool("label", "Label")
];

export function listCreativeCanvasToolOptions() {
  return CREATIVE_CANVAS_TOOLS.map(function (tool) {
    return {
      value: tool.id,
      label: tool.label
    };
  });
}

export function normalizeToolList(value, settings) {
  var rawTools = Array.isArray(value)
    ? value
    : String(value || "").split(/[\n,]/);
  var enabled = {};
  var tools = [];

  CREATIVE_CANVAS_TOOLS.forEach(function (tool) {
    enabled[tool.id] = false;
  });

  rawTools.forEach(function (toolId) {
    var id = String(toolId || "").trim();
    if (Object.prototype.hasOwnProperty.call(enabled, id)) {
      enabled[id] = true;
    }
  });

  if (rawTools.length === 0 || Object.keys(enabled).every(function (key) { return enabled[key] === false; })) {
    enabled.brush = true;
    enabled.eraser = true;
    enabled.fill = true;
    enabled.stamp = true;
  }

  if (settings.allowBrush === false) {
    enabled.brush = false;
    enabled["square-brush"] = false;
  }
  if (settings.allowSpray === false) {
    enabled.spray = false;
  }
  if (settings.allowFill === false) {
    enabled.fill = false;
  }
  if (settings.allowStamps === false) {
    enabled.stamp = false;
  }
  if (settings.allowLabels === false) {
    enabled.label = false;
  }

  CREATIVE_CANVAS_TOOLS.forEach(function (tool) {
    if (enabled[tool.id]) {
      tools.push(tool.id);
    }
  });

  return tools.length > 0 ? tools : ["brush"];
}

export function readToolLabel(toolId) {
  var match = CREATIVE_CANVAS_TOOLS.find(function (tool) {
    return tool.id === toolId;
  });

  return match ? match.label : "Tool";
}

function createTool(id, label) {
  return {
    id: id,
    label: label
  };
}
