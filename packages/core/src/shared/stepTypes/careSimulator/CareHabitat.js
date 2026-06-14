import { renderCareCharacter } from "./CareCharacter.js?v=1.1.192-timed-sequence";

export function renderCareHabitat(config, state, escapeHtml) {
  return '<section class="care-habitat" data-care-habitat aria-label="Habitat drop zone">'
    + '<div class="care-habitat-ring"></div>'
    + renderCareCharacter(config, state, escapeHtml)
    + '<span class="care-drop-hint">Drop or tap here</span>'
    + '</section>';
}
