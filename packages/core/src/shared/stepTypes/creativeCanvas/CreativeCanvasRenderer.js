import { createGamificationSummary, renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { renderCanvasPalette } from "./CanvasPalette.js?v=1.1.192-timed-sequence";
import { renderCanvasSubmitPanel } from "./CanvasSubmitPanel.js?v=1.1.192-timed-sequence";
import { renderCanvasToolbar } from "./CanvasToolbar.js?v=1.1.192-timed-sequence";
import { renderCanvasWorkspace } from "./CanvasWorkspace.js?v=1.1.192-timed-sequence";
import { renderStampPicker } from "./StampPicker.js?v=1.1.192-timed-sequence";
import { normalizeCreativeCanvasConfig } from "./creativeCanvasConfig.js?v=1.1.192-timed-sequence";
import { calculateTimeSpentSeconds, createCanvasSubmission } from "./creativeCanvasSerializer.js?v=1.1.192-timed-sequence";

export class CreativeCanvasRenderer {
  static renderPlayerShell(StepType, config) {
    var canvasConfig = normalizeCreativeCanvasConfig(config);
    var html = "";

    html += '<style>' + buildCreativeCanvasCss() + '</style>';
    html += '<article class="creative-canvas-step">';
    html += '<div class="creative-canvas-root" data-creative-canvas-root>';
    html += '<header class="creative-canvas-header">';
    html += '<div>';
    html += '<span>' + escapeHtml(canvasConfig.subjectPresetName) + '</span>';
    html += '<h2>' + escapeHtml(canvasConfig.title) + '</h2>';
    html += '<p><strong>' + escapeHtml(canvasConfig.prompt) + '</strong></p>';
    html += '<p>' + escapeHtml(canvasConfig.instructions) + '</p>';
    html += '</div>';
    html += '<div class="creative-canvas-template">' + escapeHtml(readTemplateLabel(canvasConfig.activityTemplate)) + '</div>';
    html += '</header>';
    html += '<div class="creative-canvas-layout">';
    html += '<aside class="creative-canvas-side">';
    html += renderCanvasToolbar(canvasConfig, escapeHtml);
    html += renderCanvasPalette(escapeHtml);
    html += renderStampPicker(canvasConfig, escapeHtml);
    html += '</aside>';
    html += '<main class="creative-canvas-main">';
    html += renderCanvasWorkspace(canvasConfig, escapeHtml);
    html += renderCanvasSubmitPanel(canvasConfig, escapeHtml);
    html += '</main>';
    html += '</div>';
    html += '</div>';
    html += '</article>';

    return html;
  }

  static attachPlayerHandlers(container, config, complete) {
    var canvasConfig = normalizeCreativeCanvasConfig(config);
    var root = container.querySelector("[data-creative-canvas-root]");
    var canvas = container.querySelector("[data-creative-canvas]");
    var context = canvas ? canvas.getContext("2d") : null;
    var state = createCanvasState(canvasConfig);

    if (!root || !canvas || !context) {
      return;
    }

    initializeCanvas(canvas, context, canvasConfig);
    saveHistory(canvas, state);
    bindToolControls(root, state);
    bindCanvasPointerEvents(root, canvas, context, canvasConfig, state);
    bindCanvasActions(root, canvas, context, canvasConfig, state);
    bindCanvasSubmit(root, canvas, canvasConfig, state, complete);
  }
}

function createCanvasState(config) {
  return {
    tool: config.requiredTools[0] || "brush",
    color: "#0f172a",
    size: 8,
    stampGlyph: config.stamps[0] ? config.stamps[0].glyph : "ST",
    drawing: false,
    lastPoint: null,
    history: [],
    redo: [],
    toolsUsed: new Set(),
    labelCount: 0,
    submitted: false,
    startedAt: Date.now()
  };
}

function bindToolControls(root, state) {
  root.addEventListener("click", function (event) {
    var toolButton = event.target && event.target.closest ? event.target.closest("[data-canvas-tool]") : null;
    var colorButton = event.target && event.target.closest ? event.target.closest("[data-canvas-color]") : null;
    var stampButton = event.target && event.target.closest ? event.target.closest("[data-canvas-stamp]") : null;

    if (toolButton) {
      setActiveButton(root, "[data-canvas-tool]", toolButton);
      state.tool = toolButton.getAttribute("data-canvas-tool") || "brush";
    }

    if (colorButton) {
      setActiveButton(root, "[data-canvas-color]", colorButton);
      state.color = colorButton.getAttribute("data-canvas-color") || "#0f172a";
    }

    if (stampButton) {
      setActiveButton(root, "[data-canvas-stamp]", stampButton);
      state.stampGlyph = stampButton.getAttribute("data-canvas-glyph") || "ST";
    }
  });

  root.addEventListener("input", function (event) {
    if (event.target && event.target.matches("[data-canvas-size]")) {
      state.size = Math.max(2, Math.min(36, Number(event.target.value) || 8));
    }
  });
}

function bindCanvasPointerEvents(root, canvas, context, config, state) {
  canvas.addEventListener("pointerdown", function (event) {
    var point = readCanvasPoint(canvas, event);

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    saveHistory(canvas, state);
    state.toolsUsed.add(state.tool);

    if (state.tool === "fill") {
      fillCanvas(canvas, context, state.color);
      return;
    }

    if (state.tool === "stamp") {
      drawStamp(context, point, state);
      return;
    }

    if (state.tool === "label") {
      drawLabel(root, context, point, state);
      return;
    }

    state.drawing = true;
    state.lastPoint = point;
    drawPoint(context, point, state);
  });

  canvas.addEventListener("pointermove", function (event) {
    var point = null;

    if (!state.drawing) {
      return;
    }

    event.preventDefault();
    point = readCanvasPoint(canvas, event);
    drawLine(context, state.lastPoint, point, state);
    state.lastPoint = point;
  });

  canvas.addEventListener("pointerup", function (event) {
    event.preventDefault();
    state.drawing = false;
    state.lastPoint = null;
  });

  canvas.addEventListener("pointercancel", function () {
    state.drawing = false;
    state.lastPoint = null;
  });
}

function bindCanvasActions(root, canvas, context, config, state) {
  root.addEventListener("click", function (event) {
    var actionButton = event.target && event.target.closest ? event.target.closest("[data-canvas-action]") : null;
    var action = actionButton ? actionButton.getAttribute("data-canvas-action") : "";

    if (action === "undo") {
      restoreHistory(canvas, context, state, "undo");
    } else if (action === "redo") {
      restoreHistory(canvas, context, state, "redo");
    } else if (action === "clear") {
      saveHistory(canvas, state);
      initializeCanvas(canvas, context, config);
      state.toolsUsed.add("clear");
    }
  });
}

function bindCanvasSubmit(root, canvas, config, state, complete) {
  var feedback = root.querySelector("[data-canvas-feedback]");
  var submitButton = root.querySelector("[data-canvas-submit]");

  if (!submitButton) {
    return;
  }

  submitButton.addEventListener("click", function () {
    var validation = validateSubmission(config, state);
    var submission = null;
    var summary = null;

    if (!validation.valid) {
      if (feedback) {
        feedback.textContent = validation.message;
        feedback.classList.add("is-warning");
      }
      return;
    }

    state.submitted = true;
    submission = createCanvasSubmission(canvas, config, state);
    summary = createGamificationSummary({
      correctAnswers: 0,
      totalAnswers: 0,
      completed: true,
      completionTimeSeconds: submission.metadata.timeSpentSeconds
    }, {
      activityName: config.title,
      message: config.completionRule === "teacher-review" ? "Submitted for teacher review." : "Canvas submitted. Nice creative work."
    });
    summary.stars = 0;
    summary.perfect = false;

    root.innerHTML = '<div class="creative-canvas-confirmation">' + renderActivityResults(summary) + '</div>';
    complete({
      success: true,
      score: 100,
      data: {
        canvasSubmission: submission,
        imageDataUrl: submission.imageDataUrl,
        submittedAt: submission.submittedAt,
        prompt: submission.prompt,
        template: submission.template,
        metadata: submission.metadata,
        gamification: summary
      }
    });
  });
}

function validateSubmission(config, state) {
  var spent = calculateTimeSpentSeconds(state.startedAt);

  if (config.activityTemplate === "label-and-draw" && state.labelCount < 1) {
    return {
      valid: false,
      message: "Add at least one label before submitting."
    };
  }

  if (config.completionRule === "minimum-time" && spent < config.minimumTimeSeconds) {
    return {
      valid: false,
      message: "Spend at least " + config.minimumTimeSeconds + " seconds on your canvas before submitting."
    };
  }

  return {
    valid: true,
    message: ""
  };
}

function initializeCanvas(canvas, context, config) {
  context.save();
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (config.canvasBackground === "blank-dark") {
    context.fillStyle = "#111827";
  } else if (config.canvasBackground === "paper") {
    context.fillStyle = "#fffbeb";
  } else {
    context.fillStyle = "#f8fafc";
  }
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (config.canvasBackground === "grid-light" || config.activityTemplate === "diagram-builder") {
    drawGrid(context, canvas);
  }

  context.restore();
}

function drawGrid(context, canvas) {
  var step = 32;
  var position = 0;

  context.save();
  context.strokeStyle = "rgba(148,163,184,.34)";
  context.lineWidth = 1;

  while (position <= canvas.width) {
    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, canvas.height);
    context.stroke();
    position = position + step;
  }

  position = 0;
  while (position <= canvas.height) {
    context.beginPath();
    context.moveTo(0, position);
    context.lineTo(canvas.width, position);
    context.stroke();
    position = position + step;
  }

  context.restore();
}

function drawPoint(context, point, state) {
  if (state.tool === "square-brush") {
    context.fillStyle = state.color;
    context.fillRect(point.x - state.size / 2, point.y - state.size / 2, state.size, state.size);
    return;
  }

  if (state.tool === "spray") {
    drawSpray(context, point, state);
    return;
  }

  context.save();
  context.globalCompositeOperation = state.tool === "eraser" ? "destination-out" : "source-over";
  context.fillStyle = state.color;
  context.beginPath();
  context.arc(point.x, point.y, state.size / 2, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawLine(context, fromPoint, toPoint, state) {
  if (!fromPoint || state.tool === "spray" || state.tool === "square-brush") {
    drawPoint(context, toPoint, state);
    return;
  }

  context.save();
  context.globalCompositeOperation = state.tool === "eraser" ? "destination-out" : "source-over";
  context.strokeStyle = state.color;
  context.lineWidth = state.size;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(fromPoint.x, fromPoint.y);
  context.lineTo(toPoint.x, toPoint.y);
  context.stroke();
  context.restore();
}

function drawSpray(context, point, state) {
  var index = 0;
  var dots = Math.max(8, state.size * 2);

  context.save();
  context.fillStyle = state.color;
  while (index < dots) {
    var angle = Math.random() * Math.PI * 2;
    var radius = Math.random() * state.size * 1.4;
    context.fillRect(point.x + Math.cos(angle) * radius, point.y + Math.sin(angle) * radius, 1.8, 1.8);
    index = index + 1;
  }
  context.restore();
}

function drawStamp(context, point, state) {
  context.save();
  context.fillStyle = "#ffffff";
  context.strokeStyle = state.color;
  context.lineWidth = 4;
  roundRect(context, point.x - 28, point.y - 24, 56, 48, 12);
  context.fill();
  context.stroke();
  context.fillStyle = state.color;
  context.font = "900 18px Inter, system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(state.stampGlyph, point.x, point.y);
  context.restore();
}

function drawLabel(root, context, point, state) {
  var input = root.querySelector("[data-canvas-label-text]");
  var text = input && input.value ? input.value.trim() : "Label";

  context.save();
  context.fillStyle = "rgba(255,255,255,.92)";
  context.strokeStyle = state.color;
  context.lineWidth = 2;
  roundRect(context, point.x - 44, point.y - 17, 88, 34, 10);
  context.fill();
  context.stroke();
  context.fillStyle = state.color;
  context.font = "800 15px Inter, system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text.slice(0, 18), point.x, point.y);
  context.restore();
  state.labelCount = state.labelCount + 1;
}

function fillCanvas(canvas, context, color) {
  context.save();
  context.globalAlpha = 0.92;
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

function saveHistory(canvas, state) {
  if (!canvas || typeof canvas.toDataURL !== "function") {
    return;
  }

  state.history.push(canvas.toDataURL("image/png"));
  if (state.history.length > 25) {
    state.history.shift();
  }
  state.redo = [];
}

function restoreHistory(canvas, context, state, direction) {
  var source = direction === "undo" ? state.history : state.redo;
  var target = direction === "undo" ? state.redo : state.history;
  var dataUrl = source.pop();
  var image = null;

  if (!dataUrl) {
    return;
  }

  target.push(canvas.toDataURL("image/png"));
  image = new Image();
  image.onload = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
  };
  image.src = dataUrl;
}

function readCanvasPoint(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function setActiveButton(root, selector, activeButton) {
  var buttons = root.querySelectorAll(selector);
  buttons.forEach(function (button) {
    button.classList.toggle("is-active", button === activeButton);
  });
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function readTemplateLabel(templateId) {
  if (templateId === "label-and-draw") {
    return "Label and Draw";
  }
  if (templateId === "diagram-builder") {
    return "Diagram Builder";
  }
  return "Free Draw Canvas";
}

function buildCreativeCanvasCss() {
  return ".creative-canvas-step{box-sizing:border-box;width:100%;max-width:980px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;}"
    + ".creative-canvas-step *{box-sizing:border-box;}"
    + ".creative-canvas-step button,.creative-canvas-step input{font:inherit;}"
    + ".creative-canvas-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px;}"
    + ".creative-canvas-header span{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".creative-canvas-header h2{margin:0 0 8px;color:#0f172a;font-size:26px;line-height:1.15;font-weight:950;}"
    + ".creative-canvas-header p{margin:0 0 5px;color:#475569;font-size:14px;line-height:1.45;font-weight:700;}"
    + ".creative-canvas-template{flex:0 0 auto;border:1px solid #bbf7d0;border-radius:14px;background:#ecfdf5;color:#047857;padding:10px 12px;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.06em;}"
    + ".creative-canvas-layout{display:grid;grid-template-columns:230px minmax(0,1fr);gap:14px;align-items:start;}"
    + ".creative-canvas-side{display:grid;gap:10px;min-width:0;}"
    + ".creative-canvas-toolbar,.creative-canvas-palette,.creative-canvas-stamps,.creative-canvas-submit-panel{border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:12px;box-shadow:0 10px 22px rgba(15,23,42,.06);}"
    + ".creative-canvas-panel-title{margin-bottom:8px;color:#0f172a;font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".creative-canvas-tool-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}"
    + ".creative-canvas-tool,.creative-canvas-history button,.creative-canvas-clear,.creative-canvas-submit{min-height:34px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color:#0f172a;font-size:11px;font-weight:900;cursor:pointer;}"
    + ".creative-canvas-tool:hover,.creative-canvas-history button:hover,.creative-canvas-clear:hover{background:#eff6ff;border-color:#60a5fa;}"
    + ".creative-canvas-tool.is-active{background:#111827;border-color:#111827;color:#fff;}"
    + ".creative-canvas-history{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px;}"
    + ".creative-canvas-clear{width:100%;margin-top:8px;background:#fff7ed;border-color:#fed7aa;color:#9a3412;}"
    + ".creative-canvas-label-field,.creative-canvas-size{display:grid;gap:5px;margin-top:9px;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}"
    + ".creative-canvas-label-field input{width:100%;border:1px solid #cbd5e1;border-radius:10px;padding:7px 8px;color:#0f172a;font-size:12px;font-weight:750;text-transform:none;letter-spacing:0;}"
    + ".creative-canvas-colors{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}"
    + ".creative-canvas-color{width:100%;aspect-ratio:1;border:2px solid #cbd5e1;border-radius:999px;cursor:pointer;}"
    + ".creative-canvas-color.is-active{border-color:#111827;box-shadow:0 0 0 3px rgba(15,23,42,.12);}"
    + ".creative-canvas-size input{width:100%;}"
    + ".creative-canvas-stamp-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}"
    + ".creative-canvas-stamp{min-height:58px;display:grid;justify-items:center;align-content:center;gap:4px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;color:#0f172a;cursor:pointer;}"
    + ".creative-canvas-stamp.is-active{border-color:#2563eb;background:#eff6ff;box-shadow:0 0 0 3px rgba(37,99,235,.1);}"
    + ".creative-canvas-stamp strong{font-size:15px;font-weight:950;}.creative-canvas-stamp span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;font-weight:850;color:#64748b;}"
    + ".creative-canvas-main{display:grid;gap:12px;min-width:0;}"
    + ".creative-canvas-workspace{position:relative;width:100%;border:1px solid #cbd5e1;border-radius:18px;background:#f8fafc;padding:10px;overflow:hidden;touch-action:none;box-shadow:0 10px 22px rgba(15,23,42,.06);}"
    + ".creative-canvas-board{display:block;width:100%;height:auto;aspect-ratio:16/10;border-radius:12px;background:#fff;touch-action:none;cursor:crosshair;}"
    + ".creative-canvas-submit-panel{display:flex;align-items:center;justify-content:space-between;gap:12px;}"
    + ".creative-canvas-submit-panel div{display:grid;gap:3px;min-width:0;}.creative-canvas-submit-panel strong{font-size:13px;font-weight:950;}.creative-canvas-submit-panel span{color:#64748b;font-size:12px;font-weight:750;line-height:1.35;}"
    + ".creative-canvas-submit{background:#111827;border-color:#111827;color:#fff;padding:0 14px;}"
    + ".creative-canvas-feedback{min-height:30px;border:1px solid #dbeafe;border-radius:12px;background:#f8fafc;padding:8px 10px;color:#475569;font-size:12px;font-weight:800;line-height:1.35;}"
    + ".creative-canvas-feedback:empty{display:none;}.creative-canvas-feedback.is-warning{display:block;background:#fff7ed;border-color:#fed7aa;color:#9a3412;}"
    + ".creative-canvas-confirmation .activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}"
    + ".creative-canvas-confirmation .activity-celebration{display:inline-flex;align-items:center;justify-content:center;min-height:26px;border-radius:999px;border:1px solid #bbf7d0;background:#ecfdf5;color:#047857;padding:4px 10px;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.06em;}"
    + ".creative-canvas-confirmation .activity-results-heading{display:grid;gap:4px;}.creative-canvas-confirmation .activity-results-heading strong{font-size:18px;font-weight:950;}.creative-canvas-confirmation .activity-results-heading span{color:#047857;font-size:13px;font-weight:850;}"
    + ".creative-canvas-confirmation .activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;}.creative-canvas-confirmation .activity-results-stars{display:flex;gap:3px;font-size:22px;}.creative-canvas-confirmation .is-empty{color:#cbd5e1;}"
    + ".creative-canvas-confirmation .activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.creative-canvas-confirmation .activity-results-grid div{border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;}.creative-canvas-confirmation .activity-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}.creative-canvas-confirmation .activity-results-grid strong{display:block;margin-top:3px;color:#0f172a;font-size:14px;font-weight:950;}"
    + "@media(max-width:760px){.creative-canvas-step{padding:16px;border-radius:12px;}.creative-canvas-header,.creative-canvas-submit-panel{display:grid;}.creative-canvas-template{width:100%;}.creative-canvas-layout{grid-template-columns:1fr;}.creative-canvas-side{order:2;}.creative-canvas-main{order:1;}.creative-canvas-tool-grid,.creative-canvas-stamp-grid{grid-template-columns:repeat(3,minmax(0,1fr));}.creative-canvas-confirmation .activity-results-grid{grid-template-columns:1fr;}}";
}

function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
