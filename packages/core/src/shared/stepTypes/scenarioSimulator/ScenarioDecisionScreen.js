import { readCurrentScenario } from "./scenarioSimulatorEngine.js?v=1.1.192-timed-sequence";

export function renderScenarioDecisionScreen(config, state, escapeHtml) {
  var scenario = readCurrentScenario(config, state);
  var html = "";

  if (!scenario) {
    return '<div class="scenario-simulator-empty"><strong>Scenario Simulator needs scenario data.</strong><span>Add scenarios in the editor or choose a preset.</span></div>';
  }

  html += '<section class="scenario-decision-card">';
  html += '<div class="scenario-decision-meta"><span>Scenario ' + escapeHtml(String(state.currentIndex + 1)) + ' of ' + escapeHtml(String(config.scenarios.length)) + '</span><strong>' + escapeHtml(scenario.title) + '</strong></div>';
  html += '<div class="scenario-terminal">';
  html += '<div class="scenario-terminal-lines" data-scenario-typewriter>';
  if (state.phase !== "intro") {
    html += escapeHtml(scenario.descriptionLines.join("\n"));
  }
  html += '</div>';
  html += '</div>';

  if (state.phase === "decision") {
    html += '<div class="scenario-timer" aria-label="Timer ' + escapeHtml(String(state.timerRemainingSeconds)) + ' seconds remaining">';
    html += '<div><span>Timer</span><strong>' + escapeHtml(String(state.timerRemainingSeconds)) + 's</strong></div>';
    html += '<div class="scenario-timer-track"><span style="width:' + Math.round(state.timerProgress * 100) + '%"></span></div>';
    html += '</div>';
  }

  html += '<p class="scenario-prompt">' + escapeHtml(scenario.prompt) + '</p>';

  if (state.phase === "intro") {
    html += '<div class="scenario-intro-wait">Reading scenario...</div>';
  } else if (state.phase === "decision") {
    html += renderScenarioActions(state, escapeHtml);
  } else if (state.phase === "feedback") {
    html += '<div class="scenario-feedback is-' + escapeHtml(state.feedbackState) + '" aria-live="polite">' + escapeHtml(state.feedback) + '</div>';
    html += '<button type="button" class="scenario-continue" data-scenario-continue>' + (state.currentIndex + 1 >= config.scenarios.length ? "View Results" : "Continue") + '</button>';
  }

  html += '</section>';

  return html;
}

function renderScenarioActions(state, escapeHtml) {
  var html = '<div class="scenario-actions" data-scenario-actions>';

  state.currentOptions.forEach(function (action, index) {
    html += '<button type="button" class="scenario-action" data-scenario-action="' + escapeHtml(action) + '">';
    html += '<span>' + String.fromCharCode(65 + index) + '</span><strong>' + escapeHtml(action) + '</strong>';
    html += '</button>';
  });

  html += '</div>';

  return html;
}
