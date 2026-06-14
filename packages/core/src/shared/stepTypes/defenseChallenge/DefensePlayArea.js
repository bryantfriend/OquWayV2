import { renderDefensePowerUp } from "./DefensePowerUp.js?v=1.1.192-timed-sequence";
import { renderDefenseThreat } from "./DefenseThreat.js?v=1.1.192-timed-sequence";

export function renderDefensePlayArea(config, state, escapeHtml) {
  var html = "";

  html += '<section class="defense-play-area" data-defense-stage aria-label="Defense play area">';
  html += '<div class="defense-path-ring defense-ring-one"></div>';
  html += '<div class="defense-path-ring defense-ring-two"></div>';
  html += '<div class="defense-target">';
  html += '<span>PROTECT</span>';
  html += '<strong>' + escapeHtml(config.protectedTargetName) + '</strong>';
  html += '</div>';

  state.activeObjects.forEach(function (object) {
    if (object.kind === "power-up") {
      html += renderDefensePowerUp(object, escapeHtml);
      return;
    }

    html += renderDefenseThreat(object, escapeHtml);
  });

  html += '</section>';

  return html;
}
