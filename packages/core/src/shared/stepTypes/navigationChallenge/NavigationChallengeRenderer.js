import { renderNavigationControls } from "./NavigationControls.js?v=1.1.192-timed-sequence";
import { renderNavigationPlayArea } from "./NavigationPlayArea.js?v=1.1.192-timed-sequence";
import { renderNavigationResults } from "./NavigationResults.js?v=1.1.192-timed-sequence";
import { normalizeNavigationChallengeConfig } from "./navigationChallengeConfig.js?v=1.1.192-timed-sequence";
import {
  createNavigationResults,
  createNavigationState,
  fireNavigationAction,
  setNavigationInput,
  tickNavigation
} from "./navigationChallengeEngine.js?v=1.1.192-timed-sequence";

export class NavigationChallengeRenderer {
  static renderPlayerShell(StepType, config) {
    var navConfig = normalizeNavigationChallengeConfig(config);
    return '<style>' + buildNavigationCss() + '</style><article class="navigation-challenge-step"><div class="navigation-root" data-navigation-root>' + renderNavigationGame(navConfig, createNavigationState(navConfig)) + '</div></article>';
  }

  static attachPlayerHandlers(container, config, complete) {
    var navConfig = normalizeNavigationChallengeConfig(config);
    var root = container.querySelector("[data-navigation-root]");
    var state = createNavigationState(navConfig);
    var timerId = null;
    var completeCalled = false;

    if (!root) { return; }

    function render() {
      root.innerHTML = renderNavigationGame(navConfig, state);
      if (state.completed && !completeCalled) {
        completeCalled = true;
        stopAll();
        window.setTimeout(function () {
          var results = createNavigationResults(navConfig, state);
          if (!root.isConnected) { return; }
          complete({ success: !state.crashed, score: results.summary.accuracy, data: { completed: true, template: "navigation-challenge", subjectTheme: navConfig.subjectTheme, gameMode: navConfig.gameMode, finalScore: results.stats.score, collected: results.stats.collected, destroyed: results.stats.destroyed, crashed: results.stats.crashed, completionTimeSeconds: results.stats.completionTimeSeconds, starsEarned: results.summary.stars, xpEarned: results.summary.xpEarned, gamification: results.summary } });
        }, 700);
      }
    }

    function keyToInput(event, active) {
      var input = {};
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") { input.left = active; }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") { input.right = active; }
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") { input.up = active; }
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") { input.down = active; }
      if (event.key === " " && active) { state = fireNavigationAction(navConfig, state); render(); }
      return input;
    }

    function onKeyDown(event) {
      var input = keyToInput(event, true);
      if (Object.keys(input).length > 0) { event.preventDefault(); state = setNavigationInput(state, input); }
    }
    function onKeyUp(event) {
      var input = keyToInput(event, false);
      if (Object.keys(input).length > 0) { event.preventDefault(); state = setNavigationInput(state, input); }
    }
    function stopAll() {
      if (timerId) { window.clearInterval(timerId); timerId = null; }
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    }

    root.addEventListener("pointerdown", function (event) {
      var button = event.target && event.target.closest ? event.target.closest("[data-nav-input]") : null;
      var action = event.target && event.target.closest ? event.target.closest("[data-nav-action]") : null;
      var input = {};
      if (button) {
        input[button.getAttribute("data-nav-input")] = true;
        state = setNavigationInput(state, input);
        render();
      } else if (action) {
        state = fireNavigationAction(navConfig, state);
        render();
      }
    });
    root.addEventListener("pointerup", function () {
      state = setNavigationInput(state, { left: false, right: false, up: false, down: false });
      render();
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    timerId = window.setInterval(function () {
      if (!root.isConnected) { stopAll(); return; }
      state = tickNavigation(navConfig, state);
      render();
    }, 120);
  }
}

function renderNavigationGame(config, state) {
  if (state.completed) { return renderNavigationResults(config, state, escapeHtml); }
  return '<div class="navigation-shell"><header class="navigation-header"><div><span>' + escapeHtml(config.subjectThemeName) + '</span><h2>' + escapeHtml(config.title) + '</h2><p>' + escapeHtml(config.instructions) + '</p></div><div class="navigation-score"><strong>' + escapeHtml(String(state.score)) + '</strong><span>Score</span></div></header>'
    + '<section class="navigation-stats"><div><span>Timer</span><strong>' + formatTime(state.timeLeft) + '</strong></div><div><span>Collected</span><strong>' + escapeHtml(String(state.collected)) + '</strong></div><div><span>Cleared</span><strong>' + escapeHtml(String(state.destroyed)) + '</strong></div></section>'
    + '<div class="navigation-feedback">' + escapeHtml(state.feedback) + '</div>' + renderNavigationPlayArea(config, state, escapeHtml) + renderNavigationControls(config, escapeHtml) + '</div>';
}

function formatTime(seconds) {
  var safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  return Math.floor(safeSeconds / 60) + ":" + (safeSeconds % 60 < 10 ? "0" : "") + (safeSeconds % 60);
}

function buildNavigationCss() {
  return ".navigation-challenge-step{box-sizing:border-box;width:100%;max-width:860px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;overflow:hidden;}.navigation-challenge-step *{box-sizing:border-box;}.navigation-challenge-step button{font:inherit;cursor:pointer;}.navigation-shell{display:grid;gap:13px;}.navigation-header{display:flex;justify-content:space-between;gap:14px;}.navigation-header span{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.navigation-header h2{margin:0 0 7px;font-size:25px;line-height:1.15;font-weight:950;}.navigation-header p{margin:0;color:#475569;font-size:14px;line-height:1.45;font-weight:750;}.navigation-score{min-width:104px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:12px;text-align:center;color:#047857;}.navigation-score strong{display:block;font-size:28px;font-weight:950;line-height:1;}.navigation-score span{font-size:10px;font-weight:950;text-transform:uppercase;}.navigation-stats,.navigation-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}.navigation-stats div,.navigation-results-grid div{border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px;text-align:center;}.navigation-stats span,.navigation-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;}.navigation-stats strong,.navigation-results-grid strong{display:block;margin-top:4px;font-size:15px;font-weight:950;}.navigation-feedback{border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;}.navigation-play-area{position:relative;min-height:390px;border:1px solid #cbd5e1;border-radius:18px;background:radial-gradient(circle at 20% 50%,#eef6ff,#f8fafc);overflow:hidden;touch-action:none;}.navigation-avatar{position:absolute;z-index:3;width:62px;height:62px;display:grid;place-items:center;border:2px solid #2563eb;border-radius:999px;background:#fff;color:#1d4ed8;font-size:12px;font-weight:950;transform:translate(-50%,-50%);box-shadow:0 14px 30px rgba(37,99,235,.16);}.navigation-entity{position:absolute;z-index:2;min-width:82px;min-height:58px;display:grid;place-items:center;gap:3px;border:1px solid #cbd5e1;border-radius:14px;background:#fff;transform:translate(-50%,-50%);box-shadow:0 10px 22px rgba(15,23,42,.1);}.navigation-entity span{display:grid;place-items:center;min-width:34px;height:26px;border-radius:999px;background:#64748b;color:#fff;padding:0 7px;font-size:10px;font-weight:950;}.navigation-entity strong{max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:950;}.navigation-entity.is-collectible{border-color:#bbf7d0;background:#f0fdf4;}.navigation-entity.is-collectible span{background:#16a34a;}.navigation-controls{display:grid;justify-items:center;gap:8px;}.navigation-controls div{display:flex;gap:8px;}.navigation-controls button{min-width:74px;min-height:40px;border:1px solid #cbd5e1;border-radius:12px;background:#fff;color:#0f172a;font-size:12px;font-weight:950;}.navigation-controls button:hover{background:#eff6ff;border-color:#2563eb;}.navigation-results{display:grid;gap:12px;}.activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}.activity-celebration{display:inline-flex;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;text-transform:uppercase;}.activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;}.activity-results-stars{display:flex;gap:3px;font-size:22px;}.activity-results-stars .is-earned{color:#f59e0b;}.activity-results-stars .is-empty{color:#cbd5e1;}.activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.activity-results-grid div{border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}@media(max-width:720px){.navigation-challenge-step{padding:16px;border-radius:12px;}.navigation-header{display:grid;}.navigation-score{width:100%;}.navigation-stats,.navigation-results-grid,.activity-results-grid{grid-template-columns:1fr;}.navigation-play-area{min-height:430px;}}";
}

function escapeHtml(value) { return typeof value === "string" ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : ""; }
