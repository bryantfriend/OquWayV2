import { renderCareHabitat } from "./CareHabitat.js?v=1.1.192-timed-sequence";
import { renderCareResourceCards } from "./CareResourceCard.js?v=1.1.192-timed-sequence";
import { renderCareResults } from "./CareResults.js?v=1.1.192-timed-sequence";
import { renderCareStatusBar } from "./CareStatusBar.js?v=1.1.192-timed-sequence";
import { normalizeCareSimulatorConfig } from "./careSimulatorConfig.js?v=1.1.192-timed-sequence";
import {
  applyCareResource,
  createCareSimulatorResults,
  createCareSimulatorState,
  selectCareResource,
  tickCareSimulator
} from "./careSimulatorEngine.js?v=1.1.192-timed-sequence";

export class CareSimulatorRenderer {
  static renderPlayerShell(StepType, config) {
    var careConfig = normalizeCareSimulatorConfig(config);
    return '<style>' + buildCareCss() + '</style><article class="care-simulator-step"><div class="care-root" data-care-root>' + renderCareGame(careConfig, createCareSimulatorState(careConfig)) + '</div></article>';
  }

  static attachPlayerHandlers(container, config, complete) {
    var careConfig = normalizeCareSimulatorConfig(config);
    var root = container.querySelector("[data-care-root]");
    var state = createCareSimulatorState(careConfig);
    var draggedResourceId = "";
    var timerId = null;
    var completeCalled = false;

    if (!root) { return; }

    function render() {
      root.innerHTML = renderCareGame(careConfig, state);
      if (state.completed && !completeCalled) {
        completeCalled = true;
        stopTimer();
        window.setTimeout(function () {
          var results = createCareSimulatorResults(careConfig, state);
          if (!root.isConnected) { return; }
          complete({ success: state.status > 0, score: results.summary.accuracy, data: { completed: true, template: "care-simulator", subjectTheme: careConfig.subjectTheme, gameMode: careConfig.gameMode, finalStatus: results.stats.status, correctResources: results.stats.correctResources, wrongResources: results.stats.wrongResources, completionTimeSeconds: results.stats.completionTimeSeconds, starsEarned: results.summary.stars, xpEarned: results.summary.xpEarned, gamification: results.summary } });
        }, 700);
      }
    }

    function stopTimer() {
      if (timerId) { window.clearInterval(timerId); timerId = null; }
    }

    root.addEventListener("click", function (event) {
      var resourceButton = event.target && event.target.closest ? event.target.closest("[data-care-resource]") : null;
      var habitat = event.target && event.target.closest ? event.target.closest("[data-care-habitat]") : null;
      if (resourceButton) {
        state = selectCareResource(state, resourceButton.getAttribute("data-care-resource"));
        render();
      } else if (habitat && state.selectedResourceId) {
        state = applyCareResource(careConfig, state, state.selectedResourceId);
        render();
      }
    });
    root.addEventListener("dragstart", function (event) {
      var resourceButton = event.target && event.target.closest ? event.target.closest("[data-care-resource]") : null;
      draggedResourceId = resourceButton ? resourceButton.getAttribute("data-care-resource") : "";
    });
    root.addEventListener("dragover", function (event) {
      if (event.target && event.target.closest && event.target.closest("[data-care-habitat]")) {
        event.preventDefault();
      }
    });
    root.addEventListener("drop", function (event) {
      if (event.target && event.target.closest && event.target.closest("[data-care-habitat]")) {
        event.preventDefault();
        state = applyCareResource(careConfig, state, draggedResourceId);
        draggedResourceId = "";
        render();
      }
    });

    timerId = window.setInterval(function () {
      if (!root.isConnected) { stopTimer(); return; }
      state = tickCareSimulator(careConfig, state);
      render();
    }, 1000);
  }
}

function renderCareGame(config, state) {
  if (state.completed) { return renderCareResults(config, state, escapeHtml); }
  return '<div class="care-shell"><header class="care-header"><div><span>' + escapeHtml(config.subjectThemeName) + '</span><h2>' + escapeHtml(config.title) + '</h2><p>' + escapeHtml(config.instructions) + '</p></div><div class="care-time"><strong>' + formatTime(state.timeLeft) + '</strong><span>Timer</span></div></header>'
    + renderCareStatusBar(config, state, escapeHtml)
    + '<div class="care-layout"><main>' + renderCareHabitat(config, state, escapeHtml) + '</main><aside>' + renderCareResourceCards(config, state, escapeHtml) + '</aside></div>'
    + '<div class="care-feedback" aria-live="polite">' + escapeHtml(state.feedback) + '</div></div>';
}

function formatTime(seconds) {
  var safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  return Math.floor(safeSeconds / 60) + ":" + (safeSeconds % 60 < 10 ? "0" : "") + (safeSeconds % 60);
}

function buildCareCss() {
  return ".care-simulator-step{box-sizing:border-box;width:100%;max-width:860px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;overflow:hidden;}.care-simulator-step *{box-sizing:border-box;}.care-simulator-step button{font:inherit;cursor:pointer;}.care-shell{display:grid;gap:13px;}.care-header{display:flex;justify-content:space-between;gap:14px;}.care-header span{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.care-header h2{margin:0 0 7px;font-size:25px;line-height:1.15;font-weight:950;}.care-header p{margin:0;color:#475569;font-size:14px;line-height:1.45;font-weight:750;}.care-time{min-width:104px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:12px;text-align:center;color:#047857;}.care-time strong{display:block;font-size:26px;font-weight:950;}.care-time span{font-size:10px;font-weight:950;text-transform:uppercase;}.care-status{display:grid;gap:7px;}.care-status div:first-child{display:flex;justify-content:space-between;align-items:center;}.care-status span{color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;}.care-status strong{font-size:18px;font-weight:950;}.care-status-track{height:12px;border-radius:999px;background:#e2e8f0;overflow:hidden;}.care-status-track span{display:block;height:100%;background:linear-gradient(90deg,#f59e0b,#22c55e);}.care-layout{display:grid;grid-template-columns:minmax(0,1fr) 240px;gap:14px;}.care-habitat{position:relative;min-height:360px;display:grid;place-items:center;border:1px solid #cbd5e1;border-radius:18px;background:radial-gradient(circle,#f0fdf4,#f8fafc);overflow:hidden;}.care-habitat-ring{position:absolute;width:70%;height:70%;border:1px dashed rgba(34,197,94,.35);border-radius:999px;}.care-character{z-index:2;display:grid;place-items:center;gap:5px;min-width:148px;min-height:130px;border:2px solid #22c55e;border-radius:24px;background:#fff;text-align:center;box-shadow:0 18px 36px rgba(34,197,94,.14);}.care-character span{display:grid;place-items:center;min-width:54px;height:42px;border-radius:999px;background:#16a34a;color:#fff;padding:0 10px;font-size:12px;font-weight:950;}.care-character strong{font-size:18px;font-weight:950;}.care-character em{font-size:11px;font-style:normal;font-weight:950;color:#64748b;text-transform:uppercase;}.care-character.mood-worried{border-color:#f59e0b;}.care-character.mood-critical,.care-character.mood-inactive{border-color:#fca5a5;}.care-character.mood-critical span,.care-character.mood-inactive span{background:#dc2626;}.care-drop-hint{position:absolute;bottom:16px;color:#64748b;font-size:11px;font-weight:900;text-transform:uppercase;}.care-resources{display:grid;gap:9px;}.care-resource{min-height:58px;display:flex;align-items:center;gap:8px;border:1px solid #cbd5e1;border-radius:14px;background:#fff;padding:9px;text-align:left;}.care-resource:hover,.care-resource.is-selected{background:#eff6ff;border-color:#2563eb;}.care-resource span{display:grid;place-items:center;min-width:38px;height:38px;border-radius:999px;background:#2563eb;color:#fff;padding:0 7px;font-size:11px;font-weight:950;}.care-resource strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:950;}.care-feedback{border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;}.care-results{display:grid;gap:12px;}.care-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}.care-results-grid div{border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px;text-align:center;}.care-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;}.care-results-grid strong{display:block;margin-top:4px;font-size:15px;font-weight:950;}.activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}.activity-celebration{display:inline-flex;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;text-transform:uppercase;}.activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;}.activity-results-stars{display:flex;gap:3px;font-size:22px;}.activity-results-stars .is-earned{color:#f59e0b;}.activity-results-stars .is-empty{color:#cbd5e1;}.activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.activity-results-grid div{border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}@media(max-width:720px){.care-simulator-step{padding:16px;border-radius:12px;}.care-header{display:grid;}.care-time{width:100%;}.care-layout,.care-results-grid,.activity-results-grid{grid-template-columns:1fr;}.care-resources{grid-template-columns:1fr 1fr;}.care-habitat{min-height:330px;}}";
}

function escapeHtml(value) { return typeof value === "string" ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : ""; }
