import { renderFallingPlayArea } from "./FallingPlayArea.js?v=1.1.192-timed-sequence";
import { renderFallingTargetResults } from "./FallingTargetResults.js?v=1.1.192-timed-sequence";
import { renderLivesDisplay } from "./LivesDisplay.js?v=1.1.192-timed-sequence";
import { renderPowerUpBanner } from "./PowerUpBanner.js?v=1.1.192-timed-sequence";
import { normalizeFallingTargetConfig } from "./fallingTargetConfig.js?v=1.1.192-timed-sequence";
import {
  activateRapidFire,
  createFallingTargetResults,
  createFallingTargetState,
  hitFallingTarget,
  tickFallingTarget
} from "./fallingTargetEngine.js?v=1.1.192-timed-sequence";

export class FallingTargetChallengeRenderer {
  static renderPlayerShell(StepType, config) {
    var fallingConfig = normalizeFallingTargetConfig(config);

    return '<style>' + buildFallingCss() + '</style><article class="falling-target-step"><div class="falling-root" data-falling-root>' + renderFallingGame(fallingConfig, createFallingTargetState(fallingConfig)) + '</div></article>';
  }

  static attachPlayerHandlers(container, config, complete) {
    var fallingConfig = normalizeFallingTargetConfig(config);
    var root = container.querySelector("[data-falling-root]");
    var state = createFallingTargetState(fallingConfig);
    var timerId = null;
    var completeCalled = false;

    if (!root) { return; }

    function render() {
      root.innerHTML = renderFallingGame(fallingConfig, state);
      if (state.completed && !completeCalled) {
        completeCalled = true;
        stopTimer();
        window.setTimeout(function () {
          var results = createFallingTargetResults(fallingConfig, state);
          if (!root.isConnected) { return; }
          complete({ success: state.lives > 0, score: results.summary.accuracy, data: { completed: true, template: "falling-target-challenge", subjectTheme: fallingConfig.subjectTheme, gameMode: fallingConfig.gameMode, finalScore: results.stats.score, livesRemaining: results.stats.lives, destroyedTargets: results.stats.destroyedTargets, missedTargets: results.stats.missedTargets, completionTimeSeconds: results.stats.completionTimeSeconds, starsEarned: results.summary.stars, xpEarned: results.summary.xpEarned, gamification: results.summary } });
        }, 700);
      }
    }

    function stopTimer() {
      if (timerId) { window.clearInterval(timerId); timerId = null; }
    }

    root.addEventListener("click", function (event) {
      var target = event.target && event.target.closest ? event.target.closest("[data-falling-target]") : null;
      var stage = event.target && event.target.closest ? event.target.closest("[data-falling-stage]") : null;
      if (target) {
        state = hitFallingTarget(fallingConfig, state, target.getAttribute("data-falling-target"));
        render();
        return;
      }
      if (stage && state.activePowerUp === "rapid-fire") {
        state = activateRapidFire(fallingConfig, state);
        render();
      }
    });

    timerId = window.setInterval(function () {
      if (!root.isConnected) { stopTimer(); return; }
      state = tickFallingTarget(fallingConfig, state);
      render();
    }, 1000);
  }
}

function renderFallingGame(config, state) {
  if (state.completed) {
    return renderFallingTargetResults(config, state, escapeHtml);
  }

  return '<div class="falling-shell"><header class="falling-header"><div><span>' + escapeHtml(config.subjectThemeName) + '</span><h2>' + escapeHtml(config.title) + '</h2><p>' + escapeHtml(config.instructions) + '</p></div><div class="falling-score"><strong>' + escapeHtml(String(state.score)) + '</strong><span>Score</span></div></header>'
    + '<section class="falling-stats"><div><span>Timer</span><strong>' + formatTime(state.timeLeft) + '</strong></div>' + renderLivesDisplay(state, escapeHtml) + '<div><span>Cleared</span><strong>' + escapeHtml(String(state.destroyedTargets)) + '</strong></div></section>'
    + renderPowerUpBanner(state, escapeHtml)
    + '<div class="falling-feedback" aria-live="polite">' + escapeHtml(state.feedback) + '</div>'
    + renderFallingPlayArea(config, state, escapeHtml)
    + '</div>';
}

function formatTime(seconds) {
  var safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  return Math.floor(safeSeconds / 60) + ":" + (safeSeconds % 60 < 10 ? "0" : "") + (safeSeconds % 60);
}

function buildFallingCss() {
  return ".falling-target-step{box-sizing:border-box;width:100%;max-width:860px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;overflow:hidden;}.falling-target-step *{box-sizing:border-box;}.falling-target-step button{font:inherit;cursor:pointer;}.falling-shell{display:grid;gap:13px;}.falling-header{display:flex;justify-content:space-between;gap:14px;}.falling-header span{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.falling-header h2{margin:0 0 7px;font-size:25px;line-height:1.15;font-weight:950;}.falling-header p{margin:0;color:#475569;font-size:14px;line-height:1.45;font-weight:750;}.falling-score{min-width:104px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:12px;text-align:center;color:#047857;}.falling-score strong{display:block;font-size:28px;font-weight:950;line-height:1;}.falling-score span{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.falling-stats,.falling-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}.falling-stats div,.falling-results-grid div{border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px;text-align:center;}.falling-stats span,.falling-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}.falling-stats strong,.falling-results-grid strong{display:block;margin-top:4px;font-size:15px;font-weight:950;}.falling-feedback,.falling-power-banner{border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;}.falling-power-banner{display:flex;justify-content:space-between;background:#fff7ed;border-color:#fed7aa;color:#9a3412;}.falling-play-area{position:relative;min-height:390px;border:1px solid #cbd5e1;border-radius:18px;background:linear-gradient(180deg,#eff6ff,#f8fafc);overflow:hidden;touch-action:manipulation;}.falling-target{position:absolute;z-index:2;display:grid;place-items:center;gap:4px;min-width:86px;min-height:70px;border:1px solid #bfdbfe;border-radius:16px;background:#fff;color:#0f172a;transform:translate(-50%,-50%);box-shadow:0 12px 24px rgba(15,23,42,.1);}.falling-target:hover{background:#eff6ff;border-color:#2563eb;}.falling-target span{display:grid;place-items:center;min-width:34px;height:34px;border-radius:999px;background:#2563eb;color:#fff;padding:0 7px;font-size:11px;font-weight:950;}.falling-target strong{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:950;}.falling-target.is-powerup{border-color:#bbf7d0;background:#f0fdf4;}.falling-target.is-powerup span{background:#16a34a;}.falling-danger-zone{position:absolute;left:0;right:0;bottom:0;min-height:44px;display:grid;place-items:center;background:#fee2e2;color:#991b1b;border-top:2px solid #fca5a5;font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.falling-results{display:grid;gap:12px;}.activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}.activity-celebration{display:inline-flex;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;text-transform:uppercase;}.activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;}.activity-results-stars{display:flex;gap:3px;font-size:22px;}.activity-results-stars .is-earned{color:#f59e0b;}.activity-results-stars .is-empty{color:#cbd5e1;}.activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.activity-results-grid div{border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}.activity-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;}.activity-results-grid strong{display:block;margin-top:3px;font-size:14px;font-weight:950;}@media(max-width:720px){.falling-target-step{padding:16px;border-radius:12px;}.falling-header{display:grid;}.falling-score{width:100%;}.falling-stats,.falling-results-grid,.activity-results-grid{grid-template-columns:1fr;}.falling-play-area{min-height:440px;}}";
}

function escapeHtml(value) {
  return typeof value === "string" ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "";
}
