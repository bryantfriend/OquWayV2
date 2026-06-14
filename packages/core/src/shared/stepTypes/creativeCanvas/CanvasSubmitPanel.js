export function renderCanvasSubmitPanel(config, escapeHtml) {
  var requirement = "Submit your canvas when you are finished.";

  if (config.activityTemplate === "label-and-draw") {
    requirement = "Add at least one label, then submit.";
  } else if (config.completionRule === "minimum-time") {
    requirement = "Spend the required time on your canvas, then submit.";
  } else if (config.completionRule === "teacher-review") {
    requirement = "Submit your canvas for teacher review.";
  }

  return '<section class="creative-canvas-submit-panel">'
    + '<div><strong>Ready?</strong><span>' + escapeHtml(requirement) + '</span></div>'
    + '<button type="button" class="creative-canvas-submit" data-canvas-submit>Submit Canvas</button>'
    + '</section>'
    + '<div class="creative-canvas-feedback" data-canvas-feedback aria-live="polite"></div>';
}
