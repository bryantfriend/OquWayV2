export function renderDefenseHpBar(config, state, hpPercent, escapeHtml) {
  return '<div class="defense-hp" aria-label="' + escapeHtml(config.protectedTargetName) + ' HP ' + hpPercent + '%">'
    + '<div class="defense-hp-header"><span>HP</span><strong>' + escapeHtml(String(state.hp)) + ' / ' + escapeHtml(String(config.targetHp)) + '</strong></div>'
    + '<div class="defense-hp-track"><span style="width:' + hpPercent + '%"></span></div>'
    + '</div>';
}
