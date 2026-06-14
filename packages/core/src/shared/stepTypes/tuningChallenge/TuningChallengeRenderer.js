import { renderSyncMeter } from "./SyncMeter.js?v=1.1.192-timed-sequence";
import { renderTuningCanvas } from "./TuningCanvas.js?v=1.1.192-timed-sequence";
import { renderTuningControls } from "./TuningControls.js?v=1.1.192-timed-sequence";
import { renderTuningResults } from "./TuningResults.js?v=1.1.192-timed-sequence";
import { normalizeTuningChallengeConfig } from "./tuningChallengeConfig.js?v=1.1.192-timed-sequence";
import {
  createTuningChallengeResults,
  createTuningChallengeState,
  tickTuningChallenge,
  updateTuningControl
} from "./tuningChallengeEngine.js?v=1.1.192-timed-sequence";

export class TuningChallengeRenderer {
  static renderPlayerShell(StepType, config) {
    var tuningConfig = normalizeTuningChallengeConfig(config);

    return '<style>' + buildTuningCss() + '</style>'
      + '<article class="tuning-challenge-step">'
      + '<div class="tuning-root" data-tuning-root>'
      + renderTuningGame(tuningConfig, createTuningChallengeState(tuningConfig))
      + '</div>'
      + '</article>';
  }

  static attachPlayerHandlers(container, config, complete) {
    var tuningConfig = normalizeTuningChallengeConfig(config);
    var root = container.querySelector("[data-tuning-root]");
    var state = createTuningChallengeState(tuningConfig);
    var timerId = null;
    var completeCalled = false;

    if (!root) {
      return;
    }

    function render() {
      root.innerHTML = renderTuningGame(tuningConfig, state);

      if (state.completed && !completeCalled) {
        completeCalled = true;
        stopTimer();
        window.setTimeout(function () {
          var results = createTuningChallengeResults(tuningConfig, state);

          if (!root.isConnected) {
            return;
          }

          complete({
            success: true,
            score: results.summary.accuracy,
            data: {
              completed: true,
              template: "tuning-challenge",
              subjectTheme: tuningConfig.subjectTheme,
              targetType: tuningConfig.targetType,
              finalSync: results.stats.finalSync,
              bestSync: results.stats.bestSync,
              finalScore: results.stats.score,
              completionTimeSeconds: results.stats.completionTimeSeconds,
              starsEarned: results.summary.stars,
              xpEarned: results.summary.xpEarned,
              gamification: results.summary
            }
          });
        }, 700);
      }
    }

    function stopTimer() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    root.addEventListener("input", function (event) {
      var input = event.target && event.target.closest ? event.target.closest("[data-tuning-control]") : null;

      if (!input) {
        return;
      }

      state = updateTuningControl(tuningConfig, state, input.getAttribute("data-tuning-control"), input.value);
      render();
    });

    timerId = window.setInterval(function () {
      if (!root.isConnected) {
        stopTimer();
        return;
      }

      state = tickTuningChallenge(tuningConfig, state);
      render();
    }, 1000);
  }
}

function renderTuningGame(config, state) {
  var html = "";

  if (!config.valid) {
    return '<div class="tuning-empty"><strong>Tuning Challenge needs controls.</strong><span>Choose a preset or add control labels.</span></div>';
  }

  if (state.completed) {
    return renderTuningResults(config, state, escapeHtml);
  }

  html += '<div class="tuning-shell">';
  html += '<header class="tuning-header"><div><span>' + escapeHtml(config.subjectThemeName) + '</span><h2>' + escapeHtml(config.title) + '</h2><p>' + escapeHtml(config.instructions) + '</p></div><div class="tuning-score"><strong>' + escapeHtml(String(state.score)) + '</strong><span>Score</span></div></header>';
  html += '<section class="tuning-stats"><div><span>Timer</span><strong>' + formatTime(state.timeLeft) + '</strong></div><div><span>Best Sync</span><strong>' + escapeHtml(String(Math.round(state.bestSync))) + '%</strong></div><div><span>Type</span><strong>' + escapeHtml(config.targetType) + '</strong></div></section>';
  html += '<div class="tuning-layout">';
  html += '<main>' + renderTuningCanvas(config, state, escapeHtml) + '</main>';
  html += '<aside>' + renderSyncMeter(config, state, escapeHtml) + renderTuningControls(config, state, escapeHtml) + '</aside>';
  html += '</div>';
  html += '<div class="tuning-feedback" aria-live="polite">' + escapeHtml(state.feedback) + '</div>';
  html += '</div>';

  return html;
}

function formatTime(seconds) {
  var safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  var minutes = Math.floor(safeSeconds / 60);
  var remainder = safeSeconds % 60;

  return String(minutes) + ":" + (remainder < 10 ? "0" : "") + remainder;
}

function buildTuningCss() {
  return ".tuning-challenge-step{box-sizing:border-box;width:100%;max-width:860px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;overflow:hidden;}"
    + ".tuning-challenge-step *{box-sizing:border-box;}.tuning-shell{display:grid;gap:13px;min-width:0;}.tuning-header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;}.tuning-header span{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.tuning-header h2{margin:0 0 7px;font-size:25px;line-height:1.15;font-weight:950;}.tuning-header p{margin:0;color:#475569;font-size:14px;line-height:1.45;font-weight:750;}.tuning-score{min-width:104px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:12px;text-align:center;color:#047857;}.tuning-score strong{display:block;font-size:28px;font-weight:950;line-height:1;}.tuning-score span{display:block;margin-top:4px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".tuning-stats,.tuning-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}.tuning-stats div,.tuning-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px;text-align:center;}.tuning-stats span,.tuning-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}.tuning-stats strong,.tuning-results-grid strong{display:block;margin-top:4px;color:#0f172a;font-size:15px;font-weight:950;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
    + ".tuning-layout{display:grid;grid-template-columns:minmax(0,1fr) 240px;gap:14px;align-items:start;}.tuning-canvas-panel,.tuning-meter,.tuning-controls{border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:12px;box-shadow:0 10px 22px rgba(15,23,42,.06);}.tuning-wave{display:block;width:100%;height:auto;min-height:220px;border-radius:14px;background:#f8fafc;}.tuning-grid-line{stroke:#dbeafe;stroke-width:1;}.tuning-target-wave{fill:none;stroke:#2563eb;stroke-width:5;stroke-linecap:round;opacity:.72;}.tuning-user-wave{fill:none;stroke:#22c55e;stroke-width:4;stroke-linecap:round;}.tuning-wave-legend{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;color:#64748b;font-size:11px;font-weight:900;}.tuning-wave-legend span{display:inline-flex;align-items:center;gap:5px;}.tuning-wave-legend b{width:18px;height:4px;border-radius:99px;display:inline-block;}.tuning-wave-legend .target{background:#2563eb;}.tuning-wave-legend .current{background:#22c55e;}.tuning-variation-note{margin-bottom:8px;border:1px solid #fed7aa;border-radius:12px;background:#fff7ed;color:#9a3412;padding:8px 10px;font-size:12px;font-weight:850;}"
    + ".tuning-meter{display:grid;gap:8px;}.tuning-meter-header{display:flex;justify-content:space-between;align-items:center;gap:8px;}.tuning-meter-header span,.tuning-meter small{color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}.tuning-meter-header strong{font-size:22px;font-weight:950;color:#0f172a;}.tuning-meter-track,.tuning-hold-track{height:11px;border-radius:999px;background:#e2e8f0;overflow:hidden;}.tuning-meter-track span{display:block;height:100%;background:linear-gradient(90deg,#2563eb,#22c55e);}.tuning-hold-track{height:8px;}.tuning-hold-track span{display:block;height:100%;background:#f59e0b;}.tuning-controls{display:grid;gap:10px;}.tuning-control{display:grid;gap:7px;}.tuning-control span{display:flex;align-items:center;justify-content:space-between;gap:8px;}.tuning-control strong{font-size:12px;font-weight:950;}.tuning-control em{font-size:12px;font-style:normal;font-weight:950;color:#2563eb;}.tuning-control input{width:100%;}.tuning-feedback{min-height:34px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.4;}.tuning-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + ".activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}.activity-celebration{display:inline-flex;align-items:center;justify-content:center;min-height:26px;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;line-height:1;text-transform:uppercase;letter-spacing:.06em;}.activity-results-heading{display:grid;gap:4px;}.activity-results-heading strong{color:#0f172a;font-size:18px;font-weight:950;line-height:1.2;}.activity-results-heading span{color:#047857;font-size:13px;font-weight:850;line-height:1.4;}.activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;}.activity-results-stars{display:flex;gap:3px;font-size:22px;}.activity-results-stars .is-earned{color:#f59e0b;}.activity-results-stars .is-empty{color:#cbd5e1;}.activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.activity-results-grid div{border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}.activity-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}.activity-results-grid strong{display:block;margin-top:3px;color:#0f172a;font-size:14px;font-weight:950;}"
    + "@media(max-width:720px){.tuning-challenge-step{padding:16px;border-radius:12px;}.tuning-header{display:grid;}.tuning-score{width:100%;}.tuning-layout,.tuning-stats,.tuning-results-grid,.activity-results-grid{grid-template-columns:1fr;}.tuning-wave{min-height:180px;}}";
}

function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
