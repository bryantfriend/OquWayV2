export function renderNavigationControls(config, escapeHtml) {
  return '<section class="navigation-controls" aria-label="Navigation controls">'
    + '<button type="button" data-nav-input="up">Up</button>'
    + '<div><button type="button" data-nav-input="left">Left</button><button type="button" data-nav-input="down">Down</button><button type="button" data-nav-input="right">Right</button></div>'
    + (config.settings.allowShooting ? '<button type="button" data-nav-action>' + escapeHtml(config.actionName) + '</button>' : '')
    + '</section>';
}
