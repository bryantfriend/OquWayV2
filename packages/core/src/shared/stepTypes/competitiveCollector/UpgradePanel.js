import { calculateUpgradeCost } from "./competitiveCollectorEngine.js?v=1.1.192-timed-sequence";

export function renderUpgradePanel(config, state, escapeHtml) {
  var html = "";

  html += '<section class="collector-panel collector-upgrades" aria-label="Upgrades">';
  html += '<div class="collector-panel-header"><strong>Upgrades</strong><span>Auto collect</span></div>';

  if (!config.settings.allowUpgrades || config.upgrades.length === 0) {
    html += '<div class="collector-muted">Upgrades are disabled for this mode.</div>';
  } else {
    config.upgrades.forEach(function (upgrade) {
      var count = Number(state.upgradeCounts[upgrade.id] || 0);
      var cost = calculateUpgradeCost(upgrade, count);
      var disabled = state.score < cost ? " disabled" : "";

      html += '<button type="button" class="collector-upgrade" data-collector-upgrade="' + escapeHtml(upgrade.id) + '"' + disabled + '>';
      html += '<span><strong>' + escapeHtml(upgrade.name) + '</strong><em>Owned: ' + count + ' · +' + escapeHtml(String(upgrade.pointsPerSecond)) + '/sec</em></span>';
      html += '<b>' + cost + '</b>';
      html += '</button>';
    });
  }

  html += '</section>';
  return html;
}
