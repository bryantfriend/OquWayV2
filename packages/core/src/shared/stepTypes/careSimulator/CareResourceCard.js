export function renderCareResourceCards(config, state, escapeHtml) {
  var html = '<section class="care-resources" aria-label="Resources">';
  config.resources.forEach(function (resource) {
    var selected = state.selectedResourceId === resource.id ? " is-selected" : "";
    html += '<button type="button" draggable="true" class="care-resource' + selected + '" data-care-resource="' + escapeHtml(resource.id) + '">'
      + '<span>' + escapeHtml(resource.icon) + '</span><strong>' + escapeHtml(resource.label) + '</strong>'
      + '</button>';
  });
  html += '</section>';
  return html;
}
