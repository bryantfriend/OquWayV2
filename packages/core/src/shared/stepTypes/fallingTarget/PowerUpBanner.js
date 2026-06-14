export function renderPowerUpBanner(state, escapeHtml) {
  if (!state.activePowerUp) {
    return "";
  }

  return '<div class="falling-power-banner"><strong>' + escapeHtml(state.activePowerUp) + '</strong><span>' + escapeHtml(String(state.powerUpTimeLeft)) + 's</span></div>';
}
