export function renderCanvasWorkspace(config, escapeHtml) {
  return '<section class="creative-canvas-workspace creative-canvas-bg-' + escapeHtml(config.canvasBackground) + '">'
    + '<canvas class="creative-canvas-board" data-creative-canvas width="960" height="600" aria-label="Creative canvas drawing area"></canvas>'
    + '</section>';
}
