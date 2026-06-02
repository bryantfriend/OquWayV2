export async function processPreviewStep(executionState) {
  var context = executionState.context || {};
  var payload = executionState.payload || {};

  executionState.result = {
    course: context.course,
    module: context.module,
    learningMode: context.learningMode,
    step: context.step,
    preview: {
      mode: "preview",
      savesProgress: false,
      intentType: "PreviewStepIntent",
      courseId: payload.courseId,
      moduleId: payload.moduleId,
      modeId: payload.modeId,
      stepId: payload.stepId,
      paths: context.previewPaths || {}
    }
  };

  return { valid: true };
}
