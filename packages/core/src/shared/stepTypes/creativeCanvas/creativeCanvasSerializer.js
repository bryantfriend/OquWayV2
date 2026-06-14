export function createCanvasSubmission(canvas, config, state) {
  var imageDataUrl = "";

  if (canvas && typeof canvas.toDataURL === "function") {
    imageDataUrl = canvas.toDataURL("image/png");
  }

  return {
    imageDataUrl: imageDataUrl,
    submittedAt: new Date().toISOString(),
    prompt: config.prompt,
    template: config.activityTemplate,
    metadata: {
      toolsUsed: Array.from(state.toolsUsed),
      timeSpentSeconds: calculateTimeSpentSeconds(state.startedAt),
      labelCount: state.labelCount,
      stampPack: config.stampPack
      // TODO: Store large canvas images in object storage when the student progress pipeline supports upload-backed artifacts.
    }
  };
}

export function calculateTimeSpentSeconds(startedAt) {
  if (!startedAt || !Number.isFinite(startedAt)) {
    return 0;
  }

  return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
}
