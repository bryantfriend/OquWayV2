import { renderDefenseHpBar } from "./DefenseHpBar.js?v=1.1.192-timed-sequence";
import { renderDefensePlayArea } from "./DefensePlayArea.js?v=1.1.192-timed-sequence";
import { renderDefenseResults } from "./DefenseResults.js?v=1.1.192-timed-sequence";
import { normalizeDefenseChallengeConfig } from "./defenseChallengeConfig.js?v=1.1.192-timed-sequence";
import {
  calculateHpPercent,
  calculateScoreProgress,
  createDefenseChallengeResults,
  createDefenseChallengeState,
  hitDefenseObject,
  registerMissedDefenseClick,
  tickDefenseChallenge
} from "./defenseChallengeEngine.js?v=1.1.192-timed-sequence";

export class DefenseChallengeRenderer {
  static renderPlayerShell(StepType, config) {
    var defenseConfig = normalizeDefenseChallengeConfig(config);

    return '<style>' + buildDefenseChallengeCss() + '</style>'
      + '<article class="defense-challenge-step">'
      + '<div class="defense-root" data-defense-root>'
      + renderDefenseGame(defenseConfig, createDefenseChallengeState(defenseConfig))
      + '</div>'
      + '</article>';
  }

  static attachPlayerHandlers(container, config, complete) {
    var defenseConfig = normalizeDefenseChallengeConfig(config);
    var root = container.querySelector("[data-defense-root]");
    var state = createDefenseChallengeState(defenseConfig);
    var completeCalled = false;
    var timerId = null;

    if (!root) {
      return;
    }

    function render() {
      root.innerHTML = renderDefenseGame(defenseConfig, state);

      if (state.completed && !completeCalled) {
        completeCalled = true;
        stopTimer();
        window.setTimeout(function () {
          var results = createDefenseChallengeResults(defenseConfig, state);

          if (!root.isConnected) {
            return;
          }

          complete({
            success: state.completionReason !== "target-destroyed",
            score: results.summary.accuracy,
            data: {
              completed: true,
              template: "defense-challenge",
              subjectTheme: defenseConfig.subjectTheme,
              gameMode: defenseConfig.gameMode,
              finalScore: results.stats.score,
              targetScore: results.stats.targetScore,
              hpRemaining: results.stats.hp,
              targetHp: results.stats.targetHp,
              completionTimeSeconds: results.stats.completionTimeSeconds,
              defeatedThreats: results.stats.defeatedThreats,
              defeatedBosses: results.stats.defeatedBosses,
              missedThreats: results.stats.missedThreats,
              missedClicks: results.stats.missedClicks,
              healthPacksUsed: results.stats.healthPacksUsed,
              starsEarned: results.summary.stars,
              xpEarned: results.summary.xpEarned,
              gamification: results.summary
            }
          });
        }, 900);
      }
    }

    function stopTimer() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    root.addEventListener("click", function (event) {
      var objectButton = event.target && event.target.closest ? event.target.closest("[data-defense-object]") : null;
      var stage = event.target && event.target.closest ? event.target.closest("[data-defense-stage]") : null;

      if (objectButton) {
        event.preventDefault();
        state = hitDefenseObject(defenseConfig, state, objectButton.getAttribute("data-defense-object"));
        render();
        return;
      }

      if (stage && event.target === stage) {
        state = registerMissedDefenseClick(defenseConfig, state);
        render();
      }
    });

    timerId = window.setInterval(function () {
      if (!root.isConnected) {
        stopTimer();
        return;
      }

      state = tickDefenseChallenge(defenseConfig, state);
      render();
    }, 1000);
  }
}

function renderDefenseGame(config, state) {
  var hpPercent = calculateHpPercent(config, state);
  var scoreProgress = calculateScoreProgress(config, state);
  var html = "";

  if (!config.valid) {
    return '<div class="defense-empty"><strong>Defense Challenge needs threats.</strong><span>Choose a subject theme preset or add threats in the editor.</span></div>';
  }

  if (state.completed) {
    return renderDefenseResults(config, state, escapeHtml);
  }

  html += '<div class="defense-shell defense-mode-' + escapeHtml(config.gameMode) + '">';
  html += '<header class="defense-header">';
  html += '<div>';
  html += '<span class="defense-kicker">' + escapeHtml(config.subjectThemeName) + '</span>';
  html += '<h2>' + escapeHtml(config.title) + '</h2>';
  html += '<p>' + escapeHtml(config.instructions) + '</p>';
  html += '</div>';
  html += '<div class="defense-score-card"><strong>' + escapeHtml(String(Math.round(state.score))) + '</strong><span>Score</span></div>';
  html += '</header>';

  if (state.modeNotice) {
    html += '<div class="defense-mode-notice">' + escapeHtml(state.modeNotice) + '</div>';
  }

  html += '<section class="defense-stats" aria-label="Defense stats">';
  html += '<div><span>Timer</span><strong>' + formatTime(state.timeLeft) + '</strong></div>';
  html += '<div><span>Target</span><strong>' + escapeHtml(String(config.targetScore)) + '</strong></div>';
  html += '<div><span>Cleared</span><strong>' + escapeHtml(String(state.defeatedThreats)) + '</strong></div>';
  html += '</section>';
  html += renderDefenseHpBar(config, state, hpPercent, escapeHtml);
  html += '<div class="defense-progress"><span style="width:' + scoreProgress + '%"></span></div>';
  html += '<div class="defense-feedback" aria-live="polite">' + escapeHtml(state.feedback) + '</div>';
  html += renderDefensePlayArea(config, state, escapeHtml);
  html += '<div class="defense-help-row">';
  html += '<span>Tap threats before they expire.</span>';
  html += config.settings.allowHealthPacks ? '<span>Health packs restore HP.</span>' : '';
  html += config.settings.allowBossThreats ? '<span>Bosses need multiple hits.</span>' : '';
  html += '</div>';
  html += '</div>';

  return html;
}

function formatTime(seconds) {
  var safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  var minutes = Math.floor(safeSeconds / 60);
  var remainder = safeSeconds % 60;

  return String(minutes) + ":" + (remainder < 10 ? "0" : "") + remainder;
}

function buildDefenseChallengeCss() {
  return ".defense-challenge-step{box-sizing:border-box;width:100%;max-width:860px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;overflow:hidden;}"
    + ".defense-challenge-step *{box-sizing:border-box;}"
    + ".defense-challenge-step button{font:inherit;cursor:pointer;transition:transform .16s,border-color .16s,background .16s,box-shadow .16s,opacity .16s;}"
    + ".defense-shell{display:grid;gap:13px;min-width:0;}"
    + ".defense-header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;min-width:0;}"
    + ".defense-kicker{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".defense-header h2{margin:0 0 7px;color:#0f172a;font-size:25px;line-height:1.15;font-weight:950;}"
    + ".defense-header p{margin:0;color:#475569;font-size:14px;line-height:1.45;font-weight:750;}"
    + ".defense-score-card{flex:0 0 auto;min-width:104px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:12px;text-align:center;color:#047857;}"
    + ".defense-score-card strong{display:block;font-size:28px;font-weight:950;line-height:1;}"
    + ".defense-score-card span{display:block;margin-top:4px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".defense-mode-notice{border:1px solid #fed7aa;border-radius:12px;background:#fff7ed;color:#9a3412;padding:9px 11px;font-size:12px;font-weight:850;line-height:1.35;}"
    + ".defense-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}"
    + ".defense-stats div{min-width:0;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px;text-align:center;}"
    + ".defense-stats span,.defense-hp-header span,.defense-help-row span{display:block;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}"
    + ".defense-stats strong{display:block;margin-top:4px;color:#0f172a;font-size:15px;font-weight:950;}"
    + ".defense-hp{display:grid;gap:6px;}.defense-hp-header{display:flex;align-items:center;justify-content:space-between;gap:8px;}.defense-hp-header strong{font-size:12px;font-weight:950;color:#0f172a;}"
    + ".defense-hp-track,.defense-progress{height:11px;border-radius:999px;background:#e2e8f0;overflow:hidden;box-shadow:inset 0 1px 2px rgba(15,23,42,.08);}"
    + ".defense-hp-track span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22c55e,#16a34a);transition:width .25s ease;}"
    + ".defense-progress span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#2563eb,#22c55e);transition:width .25s ease;}"
    + ".defense-feedback{min-height:34px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.4;}"
    + ".defense-play-area{position:relative;min-height:360px;border:1px solid #cbd5e1;border-radius:18px;background:radial-gradient(circle at center,#f8fafc 0,#eef6ff 42%,#e0f2fe 100%);overflow:hidden;touch-action:manipulation;}"
    + ".defense-path-ring{position:absolute;left:50%;top:50%;border:1px dashed rgba(37,99,235,.22);border-radius:999px;transform:translate(-50%,-50%);pointer-events:none;}"
    + ".defense-ring-one{width:44%;height:44%;}.defense-ring-two{width:74%;height:74%;}"
    + ".defense-target{position:absolute;left:50%;top:50%;width:132px;min-height:96px;display:grid;place-items:center;gap:5px;border:2px solid #2563eb;border-radius:22px;background:#ffffff;color:#0f172a;text-align:center;transform:translate(-50%,-50%);box-shadow:0 18px 38px rgba(37,99,235,.15);z-index:2;padding:14px;}"
    + ".defense-target span{font-size:10px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;}.defense-target strong{max-width:100%;overflow:hidden;text-overflow:ellipsis;font-size:17px;font-weight:950;line-height:1.2;}"
    + ".defense-object{position:absolute;z-index:3;display:grid;place-items:center;gap:3px;min-width:88px;max-width:112px;min-height:78px;border:1px solid #bfdbfe;border-radius:16px;background:#fff;color:#0f172a;text-align:center;padding:9px;transform:translate(-50%,-50%);box-shadow:0 12px 24px rgba(15,23,42,.1);}"
    + ".defense-object:hover,.defense-object:focus-visible{transform:translate(-50%,-53%) scale(1.03);border-color:#2563eb;background:#eff6ff;outline:none;box-shadow:0 16px 30px rgba(37,99,235,.16);}"
    + ".defense-object-icon{display:grid;place-items:center;min-width:35px;height:35px;border-radius:999px;background:#2563eb;color:#fff;padding:0 8px;font-size:11px;font-weight:950;line-height:1;}"
    + ".defense-object strong{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:950;line-height:1.15;}.defense-object em{font-size:10px;font-style:normal;font-weight:900;color:#047857;}"
    + ".defense-threat.is-boss{border-color:#fecaca;background:#fff1f2;}.defense-threat.is-boss .defense-object-icon{background:#dc2626;}.defense-hit-count{border-radius:999px;background:#fee2e2;color:#991b1b;padding:3px 7px;font-size:10px;font-weight:950;}"
    + ".defense-power-up{border-color:#bbf7d0;background:#f0fdf4;}.defense-power-up .defense-object-icon{background:#16a34a;}"
    + ".defense-help-row{display:flex;align-items:center;flex-wrap:wrap;gap:8px;}.defense-help-row span{display:inline-flex;border:1px solid #e2e8f0;border-radius:999px;background:#fff;padding:5px 8px;color:#64748b;}"
    + ".defense-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}.defense-empty strong{color:#0f172a;font-size:15px;font-weight:950;}.defense-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + ".defense-results{display:grid;gap:12px;}.defense-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.defense-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}.defense-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}.defense-results-grid strong{display:block;margin-top:3px;color:#0f172a;font-size:14px;font-weight:950;}"
    + ".activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}.activity-celebration{display:inline-flex;align-items:center;justify-content:center;min-height:26px;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;line-height:1;text-transform:uppercase;letter-spacing:.06em;}.activity-celebration-perfect,.activity-celebration-complete{border-color:#bbf7d0;background:#ecfdf5;color:#047857;}.activity-results-heading{display:grid;gap:4px;}.activity-results-heading strong{color:#0f172a;font-size:18px;font-weight:950;line-height:1.2;}.activity-results-heading span{color:#047857;font-size:13px;font-weight:850;line-height:1.4;}.activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;box-shadow:0 16px 34px rgba(37,99,235,.2);}.activity-results-stars{display:flex;align-items:center;justify-content:center;gap:3px;font-size:22px;line-height:1;}.activity-results-stars .is-earned{color:#f59e0b;}.activity-results-stars .is-empty{color:#cbd5e1;}.activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.activity-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}.activity-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}.activity-results-grid strong{display:block;margin-top:3px;color:#0f172a;font-size:14px;font-weight:950;}"
    + "@media(max-width:720px){.defense-challenge-step{padding:16px;border-radius:12px;}.defense-header{display:grid;}.defense-score-card{width:100%;}.defense-stats,.defense-results-grid,.activity-results-grid{grid-template-columns:1fr;}.defense-play-area{min-height:420px;}.defense-target{width:116px;min-height:86px;}.defense-object{min-width:76px;max-width:92px;min-height:72px;padding:8px;}.defense-object strong{font-size:11px;}}";
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
