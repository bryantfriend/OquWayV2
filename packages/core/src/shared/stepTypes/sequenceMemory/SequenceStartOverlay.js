export function renderSequenceStartOverlay(config, escapeHtml) {
  return '<section class="sequence-start-card">'
    + '<strong>Ready to repeat the pattern?</strong>'
    + '<span>' + escapeHtml(config.soundEnabled ? "Sound starts only after you press Start." : "This version uses visual pattern flashes.") + '</span>'
    + '<button type="button" data-sequence-start>Start Sequence</button>'
    + '</section>';
}
