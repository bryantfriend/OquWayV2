import { renderTimedSequenceButtons } from "./TimedSequenceButtons.js?v=1.1.192-timed-sequence";
import { renderTimedSequenceGuide } from "./TimedSequenceGuide.js?v=1.1.192-timed-sequence";
import { renderTimedSequenceResults } from "./TimedSequenceResults.js?v=1.1.192-timed-sequence";
import { renderTimedSequenceTimer } from "./TimedSequenceTimer.js?v=1.1.192-timed-sequence";
import {
  continueTimedSequence,
  createTimedSequenceResults,
  createTimedSequenceState,
  dismissTimedSequenceGlitch,
  expireTimedSequence,
  retryTimedSequence,
  selectTimedSequenceItem,
  startTimedSequence,
  updateTimedSequenceTimer
} from "./timedSequenceEngine.js?v=1.1.192-timed-sequence";
import { normalizeTimedSequenceConfig } from "./timedSequenceConfig.js?v=1.1.192-timed-sequence";
import { createTimedSequenceTimer } from "./timedSequenceTimerUtils.js?v=1.1.192-timed-sequence";

export class TimedSequenceRenderer {
  static renderPlayerShell(StepType, config) {
    var timedConfig = normalizeTimedSequenceConfig(config);

    return '<style>' + buildTimedSequenceCss() + '</style>'
      + '<article class="timed-sequence-step">'
      + '<div class="timed-sequence-root" data-timed-sequence-root>'
      + renderTimedSequenceGame(timedConfig, createTimedSequenceState(timedConfig))
      + '</div>'
      + '</article>';
  }

  static attachPlayerHandlers(container, config, complete) {
    var timedConfig = normalizeTimedSequenceConfig(config);
    var root = container.querySelector("[data-timed-sequence-root]");
    var state = createTimedSequenceState(timedConfig);
    var cleanupTimer = null;
    var completeCalled = false;

    if (!root) {
      return;
    }

    function cleanupTimerIfNeeded() {
      if (typeof cleanupTimer === "function") {
        cleanupTimer();
        cleanupTimer = null;
      }
    }

    function render() {
      root.innerHTML = renderTimedSequenceGame(timedConfig, state);

      if (!root.isConnected) {
        cleanupTimerIfNeeded();
        return;
      }

      if (state.completed && !completeCalled) {
        completeCalled = true;
        cleanupTimerIfNeeded();
        window.setTimeout(function () {
          var results = createTimedSequenceResults(timedConfig, state);

          if (!root.isConnected) {
            return;
          }

          complete({
            success: true,
            score: results.summary.accuracy,
            data: {
              completed: true,
              template: timedConfig.activityTemplate,
              renderedTemplate: timedConfig.effectiveTemplate,
              subjectTheme: timedConfig.subjectTheme,
              finalScore: results.stats.score,
              levelsCompleted: results.stats.levelsCompleted,
              requiredLevels: results.stats.requiredLevels,
              mistakes: results.stats.mistakes,
              glitchesDismissed: results.stats.glitchesDismissed,
              accuracy: results.stats.accuracy,
              completionTimeSeconds: results.stats.completionTimeSeconds,
              starsEarned: results.summary.stars,
              xpEarned: results.summary.xpEarned,
              gamification: results.summary
            }
          });
        }, 650);
      }
    }

    function startTimer() {
      cleanupTimerIfNeeded();

      if (state.phase !== "playing" || state.completed || state.gameOver) {
        return;
      }

      cleanupTimer = createTimedSequenceTimer({
        durationSeconds: state.timeRemaining,
        intervalMs: 100,
        onTick: function (timerState) {
          if (!root.isConnected) {
            cleanupTimerIfNeeded();
            return;
          }

          state = updateTimedSequenceTimer(state, timerState);
          updateTimerDom(timerState);
        },
        onExpire: function () {
          cleanupTimer = null;
          state = expireTimedSequence(timedConfig, state);
          render();
        }
      });
    }

    function updateTimerDom(timerState) {
      var text = root.querySelector("[data-timed-sequence-timer-text]");
      var bar = root.querySelector("[data-timed-sequence-timer-bar]");

      if (text) {
        text.textContent = String(timerState.remainingSeconds) + "s";
      }

      if (bar) {
        bar.style.width = String(Math.round(timerState.progress * 100)) + "%";
      }
    }

    root.addEventListener("click", function (event) {
      var startButton = event.target && event.target.closest ? event.target.closest("[data-timed-sequence-start]") : null;
      var itemButton = event.target && event.target.closest ? event.target.closest("[data-timed-sequence-item]") : null;
      var retryButton = event.target && event.target.closest ? event.target.closest("[data-timed-sequence-retry]") : null;
      var nextButton = event.target && event.target.closest ? event.target.closest("[data-timed-sequence-next]") : null;
      var glitchButton = event.target && event.target.closest ? event.target.closest("[data-timed-sequence-dismiss-glitch]") : null;

      if (startButton) {
        state = startTimedSequence(timedConfig, state);
        render();
        startTimer();
        return;
      }

      if (glitchButton) {
        state = dismissTimedSequenceGlitch(state);
        render();
        return;
      }

      if (itemButton) {
        state = selectTimedSequenceItem(timedConfig, state, itemButton.getAttribute("data-timed-sequence-item-id"));
        if (state.phase === "failure" || state.phase === "level-complete" || state.phase === "results") {
          cleanupTimerIfNeeded();
        }
        render();
        return;
      }

      if (retryButton) {
        state = retryTimedSequence(timedConfig, state);
        render();
        startTimer();
        return;
      }

      if (nextButton) {
        state = continueTimedSequence(timedConfig, state);
        render();
        startTimer();
      }
    });

    render();
  }
}

function renderTimedSequenceGame(config, state) {
  var html = "";

  if (!config.valid) {
    return '<div class="timed-sequence-empty"><strong>Timed Sequence needs at least two items.</strong><span>Add sequence items in the editor or choose a preset.</span></div>';
  }

  if (state.phase === "results" || state.completed) {
    return renderTimedSequenceResults(config, state, escapeHtml);
  }

  html += '<div class="timed-sequence-shell ' + escapeHtml(config.effectiveTemplate) + '">';
  html += '<header class="timed-sequence-header">';
  html += '<div><span>' + escapeHtml(config.subjectThemeName) + '</span><h2>' + escapeHtml(config.title) + '</h2><p>' + escapeHtml(config.instructions) + '</p></div>';
  html += '<div class="timed-sequence-score"><strong>' + escapeHtml(String(state.score)) + '</strong><span>Score</span></div>';
  html += '</header>';

  if (config.comingSoonTemplate) {
    html += '<div class="timed-sequence-template-notice">' + escapeHtml(readTemplateLabel(config.comingSoonTemplate)) + ' is coming soon. This step is safely running ' + escapeHtml(readTemplateLabel(config.effectiveTemplate)) + ' for now.</div>';
  }

  html += '<section class="timed-sequence-stats">';
  html += '<div><span>Level</span><strong>' + escapeHtml(String(state.level)) + '</strong></div>';
  html += '<div><span>Completed</span><strong>' + escapeHtml(String(state.levelsCompleted)) + ' / ' + escapeHtml(String(config.requiredLevels)) + '</strong></div>';
  html += '<div><span>Mistakes</span><strong>' + escapeHtml(String(state.mistakes)) + '</strong></div>';
  html += '</section>';

  if (state.phase === "start") {
    html += '<section class="timed-sequence-start-card">';
    html += '<strong>Ready for the sequence?</strong>';
    html += '<span>Follow the guide exactly. Wrong clicks or timeouts fail the attempt.</span>';
    html += '<button type="button" data-timed-sequence-start>Start Challenge</button>';
    html += '</section>';
  } else {
    html += '<section class="timed-sequence-play-card">';
    html += renderTimedSequenceTimer(state, escapeHtml);
    html += renderTimedSequenceGuide(config, state, escapeHtml);
    html += '<div class="timed-sequence-feedback is-' + escapeHtml(state.feedbackState || "idle") + '" aria-live="polite">' + escapeHtml(state.feedback || "Follow the required order.") + '</div>';
    html += renderTimedSequenceButtons(config, state, escapeHtml);
    if (state.phase === "failure") {
      html += '<button type="button" class="timed-sequence-action" data-timed-sequence-retry>Retry Level</button>';
    }
    if (state.phase === "level-complete") {
      html += '<button type="button" class="timed-sequence-action" data-timed-sequence-next>Next Level</button>';
    }
    if (state.glitchActive) {
      html += '<div class="timed-sequence-glitch" role="dialog" aria-modal="true" aria-label="Glitch detected">';
      html += '<div><strong>Glitch Detected</strong><span>Clear the interference before continuing.</span><button type="button" data-timed-sequence-dismiss-glitch>Dismiss Glitch</button></div>';
      html += '</div>';
    }
    html += '</section>';
  }

  html += '</div>';
  return html;
}

function readTemplateLabel(templateId) {
  if (templateId === "workflow-sequence") {
    return "Workflow Sequence";
  }

  if (templateId === "code-execution-order") {
    return "Code Execution Order";
  }

  if (templateId === "emergency-response") {
    return "Emergency Response";
  }

  return "Defusal Sequence";
}

function buildTimedSequenceCss() {
  return ".timed-sequence-step{box-sizing:border-box;width:100%;max-width:860px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;overflow:hidden;}"
    + ".timed-sequence-step *{box-sizing:border-box;}.timed-sequence-step button{font:inherit;cursor:pointer;transition:transform .16s,border-color .16s,background .16s,box-shadow .16s,opacity .16s;}.timed-sequence-step button:disabled{cursor:not-allowed;opacity:.66;}"
    + ".timed-sequence-shell{display:grid;gap:13px;min-width:0;}.timed-sequence-header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;min-width:0;}.timed-sequence-header span{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.timed-sequence-header h2{margin:0 0 7px;color:#0f172a;font-size:25px;line-height:1.15;font-weight:950;}.timed-sequence-header p{margin:0;color:#475569;font-size:14px;line-height:1.45;font-weight:750;}.timed-sequence-score{flex:0 0 auto;min-width:104px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:12px;text-align:center;color:#047857;}.timed-sequence-score strong{display:block;font-size:28px;font-weight:950;line-height:1;}.timed-sequence-score span{display:block;margin-top:4px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".timed-sequence-template-notice{border:1px solid #fed7aa;border-radius:12px;background:#fff7ed;color:#9a3412;padding:9px 11px;font-size:12px;font-weight:850;line-height:1.35;}.timed-sequence-stats,.timed-sequence-results-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;}.timed-sequence-stats div,.timed-sequence-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px;text-align:center;}.timed-sequence-stats span,.timed-sequence-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}.timed-sequence-stats strong,.timed-sequence-results-grid strong{display:block;margin-top:4px;color:#0f172a;font-size:15px;font-weight:950;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
    + ".timed-sequence-start-card,.timed-sequence-play-card{position:relative;display:grid;gap:12px;border:1px solid #dbeafe;border-radius:18px;background:linear-gradient(135deg,#ffffff,#f8fafc);padding:16px;box-shadow:0 12px 28px rgba(15,23,42,.07);overflow:hidden;}.defusal-sequence .timed-sequence-play-card{border-color:#fecaca;background:linear-gradient(135deg,#fff,#fff7ed);}.timed-sequence-start-card strong{font-size:18px;font-weight:950;}.timed-sequence-start-card span{color:#475569;font-size:14px;font-weight:750;line-height:1.45;}.timed-sequence-start-card button,.timed-sequence-action{justify-self:start;min-height:42px;border:1px solid #111827;border-radius:12px;background:#111827;color:#fff;padding:0 16px;font-size:13px;font-weight:950;}.timed-sequence-timer{display:grid;gap:7px;}.timed-sequence-timer div:first-child{display:flex;align-items:center;justify-content:space-between;gap:8px;}.timed-sequence-timer span{color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}.timed-sequence-timer strong{font-size:18px;font-weight:950;color:#991b1b;}.timed-sequence-timer-track{height:12px;border-radius:999px;background:#e2e8f0;overflow:hidden;}.timed-sequence-timer-track span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22c55e,#f59e0b,#ef4444);transition:width .1s linear;}"
    + ".timed-sequence-guide{display:flex;flex-wrap:wrap;gap:8px;}.timed-guide-item{min-width:0;display:inline-grid;grid-template-columns:24px minmax(0,1fr);align-items:center;gap:7px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;padding:7px 10px;color:#334155;}.timed-guide-item span{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:999px;background:#e2e8f0;color:#334155;font-size:11px;font-weight:950;}.timed-guide-item strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:950;}.timed-guide-item.is-complete{border-color:#bbf7d0;background:#ecfdf5;color:#047857;}.timed-guide-item.is-current{border-color:#60a5fa;background:#eff6ff;color:#1d4ed8;box-shadow:0 0 0 3px rgba(96,165,250,.15);}.timed-sequence-feedback{min-height:40px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.45;}.timed-sequence-feedback.is-correct,.timed-sequence-feedback.is-complete{background:#ecfdf5;color:#047857;border-color:#bbf7d0;}.timed-sequence-feedback.is-failure{background:#fff7ed;color:#c2410c;border-color:#fed7aa;}.timed-sequence-feedback.is-glitch{background:#fef2f2;color:#b91c1c;border-color:#fecaca;}"
    + ".timed-sequence-buttons{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:10px;}.timed-sequence-button{min-width:0;min-height:58px;display:grid;grid-template-columns:24px minmax(0,1fr);align-items:center;gap:10px;border:1px solid #cbd5e1;border-radius:15px;background:#fff;padding:12px;text-align:left;color:#0f172a;box-shadow:0 8px 18px rgba(15,23,42,.05);}.timed-sequence-button:hover:not(:disabled),.timed-sequence-button:focus-visible{border-color:#60a5fa;background:#eff6ff;transform:translateY(-1px);outline:none;}.timed-sequence-button span{width:20px;height:20px;border-radius:999px;background:#64748b;box-shadow:inset 0 0 0 3px rgba(255,255,255,.45);}.timed-sequence-button strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:950;}.timed-color-red span{background:#ef4444;}.timed-color-blue span{background:#3b82f6;}.timed-color-green span{background:#22c55e;}.timed-color-yellow span,.timed-color-amber span{background:#f59e0b;}.timed-color-purple span{background:#8b5cf6;}.timed-color-slate span{background:#64748b;}"
    + ".timed-sequence-glitch{position:absolute;inset:0;display:grid;place-items:center;background:rgba(15,23,42,.72);padding:18px;z-index:4;}.timed-sequence-glitch div{display:grid;gap:9px;width:min(320px,100%);border:1px solid #fecaca;border-radius:18px;background:#fff;padding:18px;text-align:center;box-shadow:0 18px 40px rgba(15,23,42,.25);}.timed-sequence-glitch strong{color:#991b1b;font-size:18px;font-weight:950;}.timed-sequence-glitch span{color:#475569;font-size:13px;font-weight:800;}.timed-sequence-glitch button{min-height:40px;border:1px solid #991b1b;border-radius:12px;background:#991b1b;color:#fff;font-size:13px;font-weight:950;}.timed-sequence-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}.timed-sequence-empty strong{color:#0f172a;font-size:15px;font-weight:950;}.timed-sequence-empty span{font-size:13px;font-weight:750;line-height:1.45;}.timed-sequence-results{display:grid;gap:12px;}"
    + ".activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}.activity-celebration,.activity-results-celebration span{display:inline-flex;align-items:center;justify-content:center;min-height:26px;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;line-height:1;text-transform:uppercase;letter-spacing:.06em;}.activity-results-heading{display:grid;gap:4px;}.activity-results-heading strong{color:#0f172a;font-size:18px;font-weight:950;line-height:1.2;}.activity-results-heading span{color:#047857;font-size:13px;font-weight:850;line-height:1.4;}.activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;box-shadow:0 16px 34px rgba(37,99,235,.2);}.activity-results-stars{display:flex;align-items:center;justify-content:center;gap:3px;font-size:22px;line-height:1;}.activity-results-stars .is-earned{color:#f59e0b;}.activity-results-stars .is-empty{color:#cbd5e1;}.activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.activity-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}.activity-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}.activity-results-grid strong{display:block;margin-top:3px;color:#0f172a;font-size:14px;font-weight:950;}"
    + "@media(prefers-reduced-motion:reduce){.timed-sequence-step button,.timed-sequence-timer-track span{transition:none;}}"
    + "@media(max-width:720px){.timed-sequence-step{padding:16px;border-radius:12px;}.timed-sequence-header{display:grid;}.timed-sequence-score{width:100%;}.activity-results-grid{grid-template-columns:1fr;}.timed-sequence-buttons{grid-template-columns:1fr;}.timed-sequence-start-card button,.timed-sequence-action{width:100%;}.timed-guide-item{width:100%;}}";
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
