import { cleanupSequenceAudio, initSequenceAudio, playPadTone } from "./sequenceAudioUtils.js?v=1.1.192-timed-sequence";
import {
  beginSequencePlayback,
  continueSequenceMemory,
  createSequenceMemoryResults,
  createSequenceMemoryState,
  endSequencePlayback,
  selectSequencePad,
  startSequenceMemory
} from "./sequenceMemoryEngine.js?v=1.1.192-timed-sequence";
import { normalizeSequenceMemoryConfig } from "./sequenceMemoryConfig.js?v=1.1.192-timed-sequence";
import { renderSequencePadGrid } from "./SequencePadGrid.js?v=1.1.192-timed-sequence";
import { renderSequenceResults } from "./SequenceResults.js?v=1.1.192-timed-sequence";
import { renderSequenceStartOverlay } from "./SequenceStartOverlay.js?v=1.1.192-timed-sequence";
import { readPadById } from "./sequenceValidationUtils.js?v=1.1.192-timed-sequence";

export class SequenceMemoryRenderer {
  static renderPlayerShell(StepType, config) {
    var sequenceConfig = normalizeSequenceMemoryConfig(config);

    return '<style>' + buildSequenceMemoryCss() + '</style>'
      + '<article class="sequence-memory-step">'
      + '<div class="sequence-memory-root" data-sequence-memory-root>'
      + renderSequenceMemoryGame(sequenceConfig, createSequenceMemoryState(sequenceConfig))
      + '</div>'
      + '</article>';
  }

  static attachPlayerHandlers(container, config, complete) {
    var sequenceConfig = normalizeSequenceMemoryConfig(config);
    var root = container.querySelector("[data-sequence-memory-root]");
    var state = createSequenceMemoryState(sequenceConfig);
    var audioContext = null;
    var timeouts = [];
    var elapsedInterval = null;
    var completeCalled = false;

    if (!root) {
      return;
    }

    function schedule(callback, delay) {
      var timeoutId = window.setTimeout(function () {
        timeouts = timeouts.filter(function (id) {
          return id !== timeoutId;
        });

        if (!root.isConnected) {
          cleanupAll();
          return;
        }

        callback();
      }, delay);

      timeouts.push(timeoutId);
      return timeoutId;
    }

    function cleanupTimers() {
      timeouts.forEach(function (timeoutId) {
        window.clearTimeout(timeoutId);
      });
      timeouts = [];
    }

    function cleanupElapsedTimer() {
      if (elapsedInterval !== null) {
        window.clearInterval(elapsedInterval);
        elapsedInterval = null;
      }
    }

    function cleanupAll() {
      cleanupTimers();
      cleanupElapsedTimer();
      cleanupSequenceAudio(audioContext);
      audioContext = null;
    }

    function render() {
      root.innerHTML = renderSequenceMemoryGame(sequenceConfig, state);

      if (!root.isConnected) {
        cleanupAll();
        return;
      }

      if (state.completed && !completeCalled) {
        completeCalled = true;
        cleanupAll();
        schedule(function () {
          var results = createSequenceMemoryResults(sequenceConfig, state);

          if (!root.isConnected) {
            return;
          }

          complete({
            success: true,
            score: results.summary.accuracy,
            data: {
              completed: true,
              template: sequenceConfig.activityTemplate,
              renderedTemplate: sequenceConfig.effectiveTemplate,
              subjectTheme: sequenceConfig.subjectTheme,
              finalScore: results.stats.score,
              completedLevels: results.stats.completedLevels,
              totalLevels: results.stats.totalLevels,
              mistakes: results.stats.mistakes,
              longestSequence: results.stats.longestSequence,
              maximumSequenceLength: results.stats.maximumSequenceLength,
              completionTimeSeconds: results.stats.completionTimeSeconds,
              starsEarned: results.summary.stars,
              xpEarned: results.summary.xpEarned,
              gamification: results.summary
            }
          });
        }, 650);
      }
    }

    function startPlayback() {
      var stepDelay = 560;
      var flashMs = 310;

      cleanupTimers();
      state = beginSequencePlayback(state);
      render();

      state.sequence.forEach(function (padId, index) {
        schedule(function () {
          var pad = readPadById(sequenceConfig.pads, padId);

          flashPad(padId, flashMs);
          if (sequenceConfig.soundEnabled && pad) {
            playPadTone(audioContext, pad.frequency, { durationSeconds: 0.2 });
          }
        }, index * stepDelay + 180);
      });

      schedule(function () {
        state = endSequencePlayback(state);
        render();
      }, state.sequence.length * stepDelay + 260);
    }

    function startElapsedTimer() {
      if (!sequenceConfig.timerEnabled || elapsedInterval !== null) {
        return;
      }

      elapsedInterval = window.setInterval(function () {
        var target = root.querySelector("[data-sequence-elapsed]");

        if (!root.isConnected || state.completed) {
          cleanupElapsedTimer();
          return;
        }

        state.elapsedSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
        if (target) {
          target.textContent = String(state.elapsedSeconds) + "s";
        }
      }, 1000);
    }

    function flashPad(padId, duration) {
      var padButton = root.querySelector('[data-sequence-pad-id="' + cssEscape(padId) + '"]');

      if (!padButton) {
        return;
      }

      padButton.classList.add("is-active");
      schedule(function () {
        if (padButton.isConnected) {
          padButton.classList.remove("is-active");
        }
      }, duration);
    }

    function handlePadClick(padId) {
      var pad = readPadById(sequenceConfig.pads, padId);

      if (!pad || state.phase !== "input") {
        return;
      }

      flashPad(padId, 180);
      if (sequenceConfig.soundEnabled) {
        playPadTone(audioContext, pad.frequency, { durationSeconds: 0.14 });
      }

      state = selectSequencePad(sequenceConfig, state, padId);
      render();
    }

    root.addEventListener("click", function (event) {
      var startButton = event.target && event.target.closest ? event.target.closest("[data-sequence-start]") : null;
      var padButton = event.target && event.target.closest ? event.target.closest("[data-sequence-pad]") : null;
      var continueButton = event.target && event.target.closest ? event.target.closest("[data-sequence-continue]") : null;

      if (startButton) {
        cleanupTimers();
        if (sequenceConfig.soundEnabled && !audioContext) {
          audioContext = initSequenceAudio();
        }
        state = startSequenceMemory(sequenceConfig, state);
        startElapsedTimer();
        startPlayback();
        return;
      }

      if (padButton) {
        handlePadClick(padButton.getAttribute("data-sequence-pad-id"));
        return;
      }

      if (continueButton) {
        state = continueSequenceMemory(sequenceConfig, state);
        startPlayback();
      }
    });

    root.addEventListener("keydown", function (event) {
      var padButton = event.target && event.target.closest ? event.target.closest("[data-sequence-pad]") : null;

      if (!padButton || (event.key !== "Enter" && event.key !== " ")) {
        return;
      }

      event.preventDefault();
      handlePadClick(padButton.getAttribute("data-sequence-pad-id"));
    });

    render();
  }
}

function renderSequenceMemoryGame(config, state) {
  var html = "";

  if (!config.valid) {
    return '<div class="sequence-empty"><strong>Sequence Memory needs at least two pads.</strong><span>Add pad labels in the editor or choose a preset.</span></div>';
  }

  if (state.phase === "results" || state.completed) {
    return renderSequenceResults(config, state, escapeHtml);
  }

  html += '<div class="sequence-shell">';
  html += '<header class="sequence-header">';
  html += '<div><span>' + escapeHtml(config.subjectThemeName) + '</span><h2>' + escapeHtml(config.title) + '</h2><p>' + escapeHtml(config.instructions) + '</p></div>';
  html += '<div class="sequence-score"><strong>' + escapeHtml(String(state.score)) + '</strong><span>Score</span></div>';
  html += '</header>';

  if (config.comingSoonTemplate) {
    html += '<div class="sequence-template-notice">' + escapeHtml(readTemplateLabel(config.comingSoonTemplate)) + ' is coming soon. This step is safely running ' + escapeHtml(readTemplateLabel(config.effectiveTemplate)) + ' for now.</div>';
  }

  html += '<section class="sequence-stats">';
  html += '<div><span>Level</span><strong>' + escapeHtml(String(state.completedLevels + 1)) + '</strong></div>';
  html += '<div><span>Length</span><strong>' + escapeHtml(String(state.currentLength)) + ' / ' + escapeHtml(String(config.maximumSequenceLength)) + '</strong></div>';
  html += '<div><span>Mistakes</span><strong>' + escapeHtml(String(state.mistakes)) + '</strong></div>';
  if (config.timerEnabled) {
    html += '<div><span>Time</span><strong data-sequence-elapsed>' + escapeHtml(String(state.elapsedSeconds)) + 's</strong></div>';
  }
  html += '</section>';

  if (state.phase === "start") {
    html += renderSequenceStartOverlay(config, escapeHtml);
  } else {
    html += '<section class="sequence-play-card">';
    html += '<div class="sequence-feedback is-' + escapeHtml(state.feedbackState || "idle") + '" aria-live="polite">' + escapeHtml(state.feedback || "Get ready.") + '</div>';
    html += renderSequencePadGrid(config, state, escapeHtml);
    if (state.phase === "feedback") {
      html += '<button type="button" class="sequence-continue" data-sequence-continue>' + escapeHtml(state.feedbackState === "correct" ? "Next Pattern" : "Retry Pattern") + '</button>';
    }
    html += '</section>';
  }

  html += '</div>';

  return html;
}

function readTemplateLabel(templateId) {
  if (templateId === "pattern-repeat") {
    return "Pattern Repeat";
  }

  if (templateId === "rhythm-builder") {
    return "Rhythm Builder";
  }

  if (templateId === "algorithm-trace") {
    return "Algorithm Trace";
  }

  return "Synth Sequence";
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }

  return String(value || "").replace(/"/g, '\\"');
}

function buildSequenceMemoryCss() {
  return ".sequence-memory-step{box-sizing:border-box;width:100%;max-width:860px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;overflow:hidden;}"
    + ".sequence-memory-step *{box-sizing:border-box;}.sequence-memory-step button{font:inherit;cursor:pointer;transition:transform .16s,border-color .16s,background .16s,box-shadow .16s,opacity .16s;}.sequence-memory-step button:disabled{cursor:not-allowed;opacity:.82;}"
    + ".sequence-shell{display:grid;gap:13px;min-width:0;}.sequence-header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;min-width:0;}.sequence-header span{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.sequence-header h2{margin:0 0 7px;color:#0f172a;font-size:25px;line-height:1.15;font-weight:950;}.sequence-header p{margin:0;color:#475569;font-size:14px;line-height:1.45;font-weight:750;}.sequence-score{flex:0 0 auto;min-width:104px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:12px;text-align:center;color:#047857;}.sequence-score strong{display:block;font-size:28px;font-weight:950;line-height:1;}.sequence-score span{display:block;margin-top:4px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".sequence-template-notice{border:1px solid #fed7aa;border-radius:12px;background:#fff7ed;color:#9a3412;padding:9px 11px;font-size:12px;font-weight:850;line-height:1.35;}.sequence-stats,.sequence-results-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;}.sequence-stats div,.sequence-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px;text-align:center;}.sequence-stats span,.sequence-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}.sequence-stats strong,.sequence-results-grid strong{display:block;margin-top:4px;color:#0f172a;font-size:15px;font-weight:950;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
    + ".sequence-start-card,.sequence-play-card{display:grid;gap:12px;border:1px solid #dbeafe;border-radius:18px;background:linear-gradient(135deg,#ffffff,#f8fafc);padding:16px;box-shadow:0 12px 28px rgba(15,23,42,.07);}.sequence-start-card strong{font-size:18px;font-weight:950;}.sequence-start-card span{color:#475569;font-size:14px;font-weight:750;line-height:1.45;}.sequence-start-card button,.sequence-continue{justify-self:start;min-height:42px;border:1px solid #111827;border-radius:12px;background:#111827;color:#fff;padding:0 16px;font-size:13px;font-weight:950;}.sequence-feedback{min-height:40px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.45;}.sequence-feedback.is-watching{background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe;}.sequence-feedback.is-input{background:#f8fafc;color:#334155;}.sequence-feedback.is-correct,.sequence-feedback.is-complete{background:#ecfdf5;color:#047857;border-color:#bbf7d0;}.sequence-feedback.is-incorrect{background:#fff7ed;color:#c2410c;border-color:#fed7aa;}"
    + ".sequence-pad-grid{display:grid;grid-template-columns:repeat(var(--sequence-grid-columns),minmax(0,1fr));gap:10px;}.sequence-pad{min-width:0;aspect-ratio:1/1;display:grid;place-items:center;gap:4px;border:1px solid #cbd5e1;border-radius:16px;background:#fff;color:#0f172a;padding:10px;box-shadow:0 8px 18px rgba(15,23,42,.06);}.sequence-pad span{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:24px;border-radius:999px;background:#e0f2fe;color:#0369a1;padding:0 8px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.04em;}.sequence-pad strong{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px;font-weight:950;line-height:1.15;}.sequence-pad:hover:not(:disabled),.sequence-pad:focus-visible{border-color:#60a5fa;background:#eff6ff;transform:translateY(-1px);outline:none;}.sequence-pad.is-active{border-color:#22c55e;background:#dcfce7;box-shadow:0 0 0 4px rgba(34,197,94,.16),0 14px 30px rgba(34,197,94,.18);transform:translateY(-2px) scale(1.02);}.sequence-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}.sequence-empty strong{color:#0f172a;font-size:15px;font-weight:950;}.sequence-empty span{font-size:13px;font-weight:750;line-height:1.45;}.sequence-results{display:grid;gap:12px;}"
    + ".activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}.activity-celebration,.activity-results-celebration span{display:inline-flex;align-items:center;justify-content:center;min-height:26px;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;line-height:1;text-transform:uppercase;letter-spacing:.06em;}.activity-results-heading{display:grid;gap:4px;}.activity-results-heading strong{color:#0f172a;font-size:18px;font-weight:950;line-height:1.2;}.activity-results-heading span{color:#047857;font-size:13px;font-weight:850;line-height:1.4;}.activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;box-shadow:0 16px 34px rgba(37,99,235,.2);}.activity-results-stars{display:flex;align-items:center;justify-content:center;gap:3px;font-size:22px;line-height:1;}.activity-results-stars .is-earned{color:#f59e0b;}.activity-results-stars .is-empty{color:#cbd5e1;}.activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.activity-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}.activity-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}.activity-results-grid strong{display:block;margin-top:3px;color:#0f172a;font-size:14px;font-weight:950;}"
    + "@media(prefers-reduced-motion:reduce){.sequence-memory-step button{transition:none;}.sequence-pad.is-active{transform:none;}}"
    + "@media(max-width:720px){.sequence-memory-step{padding:16px;border-radius:12px;}.sequence-header{display:grid;}.sequence-score{width:100%;}.sequence-stats,.sequence-results-grid,.activity-results-grid{grid-template-columns:1fr;}.sequence-pad-grid{gap:8px;}.sequence-pad{border-radius:13px;padding:8px;}.sequence-pad strong{font-size:12px;}.sequence-start-card button,.sequence-continue{width:100%;}}";
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
