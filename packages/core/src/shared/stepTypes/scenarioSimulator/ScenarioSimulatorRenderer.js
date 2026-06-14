import { renderScenarioDecisionScreen } from "./ScenarioDecisionScreen.js?v=1.1.192-timed-sequence";
import { renderScenarioResults } from "./ScenarioResults.js?v=1.1.192-timed-sequence";
import { normalizeScenarioSimulatorConfig } from "./scenarioSimulatorConfig.js?v=1.1.192-timed-sequence";
import {
  continueScenario,
  createScenarioSimulatorResults,
  createScenarioSimulatorState,
  enterDecisionPhase,
  expireScenario,
  readCurrentScenario,
  selectScenarioAction,
  startScenarioSimulator,
  updateScenarioTimer
} from "./scenarioSimulatorEngine.js?v=1.1.192-timed-sequence";
import { createManagedTimer } from "./scenarioTimerUtils.js?v=1.1.192-timed-sequence";
import { startTypewriter } from "./scenarioTypewriter.js?v=1.1.192-timed-sequence";

export class ScenarioSimulatorRenderer {
  static renderPlayerShell(StepType, config) {
    var scenarioConfig = normalizeScenarioSimulatorConfig(config);

    return '<style>' + buildScenarioSimulatorCss() + '</style>'
      + '<article class="scenario-simulator-step">'
      + '<div class="scenario-simulator-root" data-scenario-simulator-root>'
      + renderScenarioSimulatorGame(scenarioConfig, createScenarioSimulatorState(scenarioConfig))
      + '</div>'
      + '</article>';
  }

  static attachPlayerHandlers(container, config, complete) {
    var scenarioConfig = normalizeScenarioSimulatorConfig(config);
    var root = container.querySelector("[data-scenario-simulator-root]");
    var state = createScenarioSimulatorState(scenarioConfig);
    var cleanupTypewriter = null;
    var cleanupTimer = null;
    var completeCalled = false;

    if (!root) {
      return;
    }

    function cleanupTypewriterIfNeeded() {
      if (typeof cleanupTypewriter === "function") {
        cleanupTypewriter();
        cleanupTypewriter = null;
      }
    }

    function cleanupTimerIfNeeded() {
      if (typeof cleanupTimer === "function") {
        cleanupTimer();
        cleanupTimer = null;
      }
    }

    function cleanupAll() {
      cleanupTypewriterIfNeeded();
      cleanupTimerIfNeeded();
    }

    function render() {
      cleanupTypewriterIfNeeded();
      root.innerHTML = renderScenarioSimulatorGame(scenarioConfig, state);

      if (!root.isConnected) {
        cleanupAll();
        return;
      }

      if (state.phase === "intro") {
        startIntroTypewriter();
      }

      if (state.completed && !completeCalled) {
        completeCalled = true;
        cleanupAll();
        window.setTimeout(function () {
          var results = createScenarioSimulatorResults(scenarioConfig, state);

          if (!root.isConnected) {
            return;
          }

          complete({
            success: true,
            score: results.summary.accuracy,
            data: {
              completed: true,
              template: scenarioConfig.activityTemplate,
              renderedTemplate: "rapid-decision",
              subjectPreset: scenarioConfig.subjectPreset,
              finalScore: results.stats.score,
              correctDecisions: results.stats.correctDecisions,
              incorrectDecisions: results.stats.incorrectDecisions,
              expiredDecisions: results.stats.expiredDecisions,
              totalScenarios: results.stats.totalScenarios,
              accuracy: results.stats.accuracy,
              completionTimeSeconds: results.stats.completionTimeSeconds,
              starsEarned: results.summary.stars,
              xpEarned: results.summary.xpEarned,
              gamification: results.summary
            }
          });
        }, 700);
      }
    }

    function startIntroTypewriter() {
      var scenario = readCurrentScenario(scenarioConfig, state);
      var target = root.querySelector("[data-scenario-typewriter]");

      if (!scenario || !target) {
        state = enterDecisionPhase(scenarioConfig, state);
        startDecisionTimer();
        render();
        return;
      }

      cleanupTypewriter = startTypewriter(scenario.descriptionLines.join("\n"), target, {
        speed: 18,
        onComplete: function () {
          cleanupTypewriter = null;
          state = enterDecisionPhase(scenarioConfig, state);
          render();
          startDecisionTimer();
        }
      });
    }

    function startDecisionTimer() {
      cleanupTimerIfNeeded();
      cleanupTimer = createManagedTimer({
        durationSeconds: scenarioConfig.timerSeconds,
        intervalMs: 100,
        onTick: function (timerState) {
          if (!root.isConnected) {
            cleanupAll();
            return;
          }

          state = updateScenarioTimer(state, timerState);
          updateTimerDom(timerState);
        },
        onExpire: function () {
          cleanupTimer = null;
          state = expireScenario(scenarioConfig, state);
          render();
        }
      });
    }

    function updateTimerDom(timerState) {
      var timer = root.querySelector(".scenario-timer strong");
      var bar = root.querySelector(".scenario-timer-track span");

      if (timer) {
        timer.textContent = String(timerState.remainingSeconds) + "s";
      }

      if (bar) {
        bar.style.width = String(Math.round(timerState.progress * 100)) + "%";
      }
    }

    root.addEventListener("click", function (event) {
      var startButton = event.target && event.target.closest ? event.target.closest("[data-scenario-start]") : null;
      var actionButton = event.target && event.target.closest ? event.target.closest("[data-scenario-action]") : null;
      var continueButton = event.target && event.target.closest ? event.target.closest("[data-scenario-continue]") : null;

      if (startButton) {
        state = startScenarioSimulator(scenarioConfig, state);
        render();
        return;
      }

      if (actionButton) {
        cleanupTimerIfNeeded();
        state = selectScenarioAction(scenarioConfig, state, actionButton.getAttribute("data-scenario-action"));
        render();
        return;
      }

      if (continueButton) {
        cleanupTimerIfNeeded();
        state = continueScenario(scenarioConfig, state);
        render();
      }
    });

    render();
  }
}

function renderScenarioSimulatorGame(config, state) {
  var html = "";

  if (!config.valid) {
    return '<div class="scenario-simulator-empty"><strong>Scenario Simulator needs scenarios.</strong><span>Add scenario data in the editor or choose a preset.</span></div>';
  }

  if (state.phase === "results" || state.completed) {
    return renderScenarioResults(config, state, escapeHtml);
  }

  html += '<div class="scenario-simulator-shell">';
  html += '<header class="scenario-simulator-header">';
  html += '<div><span>' + escapeHtml(config.subjectPresetName) + '</span><h2>' + escapeHtml(config.title) + '</h2><p>' + escapeHtml(config.instructions) + '</p></div>';
  html += '<div class="scenario-simulator-score"><strong>' + escapeHtml(String(state.score)) + '</strong><span>Score</span></div>';
  html += '</header>';

  if (config.comingSoonTemplate) {
    html += '<div class="scenario-template-notice">' + escapeHtml(readTemplateLabel(config.comingSoonTemplate)) + ' is coming soon. This step is safely running Rapid Decision for now.</div>';
  }

  html += '<section class="scenario-simulator-stats">';
  html += '<div><span>Difficulty</span><strong>' + escapeHtml(config.difficulty) + '</strong></div>';
  html += '<div><span>Timer</span><strong>' + escapeHtml(String(config.timerSeconds)) + 's</strong></div>';
  html += '<div><span>Progress</span><strong>' + escapeHtml(String(state.currentIndex + 1)) + ' / ' + escapeHtml(String(config.scenarios.length)) + '</strong></div>';
  html += '</section>';

  if (state.phase === "start") {
    html += '<section class="scenario-start-card">';
    html += '<strong>Ready for a decision simulation?</strong>';
    html += '<span>Read each scenario, then choose the best action before time runs out.</span>';
    html += '<button type="button" data-scenario-start>Start Simulation</button>';
    html += '</section>';
  } else {
    html += renderScenarioDecisionScreen(config, state, escapeHtml);
  }

  html += '</div>';

  return html;
}

function readTemplateLabel(templateId) {
  if (templateId === "branching-story") {
    return "Branching Story";
  }

  if (templateId === "crisis-command") {
    return "Crisis Command";
  }

  if (templateId === "ethical-dilemma") {
    return "Ethical Dilemma";
  }

  return "Rapid Decision";
}

function buildScenarioSimulatorCss() {
  return ".scenario-simulator-step{box-sizing:border-box;width:100%;max-width:860px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;overflow:hidden;}"
    + ".scenario-simulator-step *{box-sizing:border-box;}.scenario-simulator-step button{font:inherit;cursor:pointer;transition:transform .16s,border-color .16s,background .16s,box-shadow .16s;}"
    + ".scenario-simulator-shell{display:grid;gap:13px;min-width:0;}.scenario-simulator-header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;min-width:0;}.scenario-simulator-header span{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.scenario-simulator-header h2{margin:0 0 7px;color:#0f172a;font-size:25px;line-height:1.15;font-weight:950;}.scenario-simulator-header p{margin:0;color:#475569;font-size:14px;line-height:1.45;font-weight:750;}.scenario-simulator-score{flex:0 0 auto;min-width:104px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:12px;text-align:center;color:#047857;}.scenario-simulator-score strong{display:block;font-size:28px;font-weight:950;line-height:1;}.scenario-simulator-score span{display:block;margin-top:4px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".scenario-template-notice{border:1px solid #fed7aa;border-radius:12px;background:#fff7ed;color:#9a3412;padding:9px 11px;font-size:12px;font-weight:850;line-height:1.35;}.scenario-simulator-stats,.scenario-simulator-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}.scenario-simulator-stats div,.scenario-simulator-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px;text-align:center;}.scenario-simulator-stats span,.scenario-simulator-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}.scenario-simulator-stats strong,.scenario-simulator-results-grid strong{display:block;margin-top:4px;color:#0f172a;font-size:15px;font-weight:950;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
    + ".scenario-start-card,.scenario-decision-card{display:grid;gap:12px;border:1px solid #dbeafe;border-radius:18px;background:linear-gradient(135deg,#ffffff,#f8fafc);padding:16px;box-shadow:0 12px 28px rgba(15,23,42,.07);}.scenario-start-card strong{font-size:18px;font-weight:950;}.scenario-start-card span{color:#475569;font-size:14px;font-weight:750;line-height:1.45;}.scenario-start-card button,.scenario-continue{justify-self:start;min-height:42px;border:1px solid #111827;border-radius:12px;background:#111827;color:#fff;padding:0 16px;font-size:13px;font-weight:950;}.scenario-decision-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;}.scenario-decision-meta span{border-radius:999px;background:#e0f2fe;color:#0369a1;padding:5px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}.scenario-decision-meta strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:18px;font-weight:950;}.scenario-terminal{min-height:138px;border:1px solid #cbd5e1;border-radius:16px;background:#0f172a;color:#dbeafe;padding:14px;overflow:hidden;}.scenario-terminal-lines{white-space:pre-line;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px;font-weight:800;line-height:1.55;}.scenario-prompt{margin:0;color:#0f172a;font-size:17px;font-weight:950;line-height:1.35;}.scenario-intro-wait{border:1px solid #dbeafe;border-radius:12px;background:#f8fafc;padding:9px 11px;color:#64748b;font-size:12px;font-weight:900;}"
    + ".scenario-timer{display:grid;gap:7px;}.scenario-timer div:first-child{display:flex;align-items:center;justify-content:space-between;gap:8px;}.scenario-timer span{color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}.scenario-timer strong{font-size:16px;font-weight:950;color:#0f172a;}.scenario-timer-track{height:11px;border-radius:999px;background:#e2e8f0;overflow:hidden;}.scenario-timer-track span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22c55e,#f59e0b,#ef4444);transition:width .1s linear;}.scenario-actions{display:grid;grid-template-columns:repeat(auto-fit,minmax(138px,1fr));gap:10px;}.scenario-action{min-width:0;min-height:58px;display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:11px;border:1px solid #dbeafe;border-radius:15px;background:#ffffff;padding:12px;text-align:left;color:#0f172a;box-shadow:0 8px 18px rgba(15,23,42,.05);}.scenario-action:hover,.scenario-action:focus-visible{border-color:#60a5fa;background:#eff6ff;transform:translateY(-1px);outline:none;}.scenario-action span{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:12px;font-weight:950;}.scenario-action strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:950;}.scenario-feedback{min-height:38px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.45;}.scenario-feedback.is-correct{background:#ecfdf5;color:#047857;border-color:#bbf7d0;}.scenario-feedback.is-incorrect,.scenario-feedback.is-timeout{background:#fff7ed;color:#c2410c;border-color:#fed7aa;}.scenario-simulator-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}.scenario-simulator-empty strong{color:#0f172a;font-size:15px;font-weight:950;}.scenario-simulator-empty span{font-size:13px;font-weight:750;line-height:1.45;}.scenario-simulator-results{display:grid;gap:12px;}"
    + ".activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}.activity-celebration{display:inline-flex;align-items:center;justify-content:center;min-height:26px;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;line-height:1;text-transform:uppercase;letter-spacing:.06em;}.activity-results-heading{display:grid;gap:4px;}.activity-results-heading strong{color:#0f172a;font-size:18px;font-weight:950;line-height:1.2;}.activity-results-heading span{color:#047857;font-size:13px;font-weight:850;line-height:1.4;}.activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;box-shadow:0 16px 34px rgba(37,99,235,.2);}.activity-results-stars{display:flex;align-items:center;justify-content:center;gap:3px;font-size:22px;line-height:1;}.activity-results-stars .is-earned{color:#f59e0b;}.activity-results-stars .is-empty{color:#cbd5e1;}.activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}.activity-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}.activity-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}.activity-results-grid strong{display:block;margin-top:3px;color:#0f172a;font-size:14px;font-weight:950;}"
    + "@media(max-width:720px){.scenario-simulator-step{padding:16px;border-radius:12px;}.scenario-simulator-header{display:grid;}.scenario-simulator-score{width:100%;}.scenario-simulator-stats,.scenario-simulator-results-grid,.activity-results-grid{grid-template-columns:1fr;}.scenario-decision-meta{display:grid;}.scenario-actions{grid-template-columns:1fr;}.scenario-start-card button,.scenario-continue{width:100%;}.scenario-terminal{min-height:160px;}}";
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
