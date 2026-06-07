import { saveStudentPracticeModeProgress } from "./studentProgressHelpers.js?v=1.1.119-student-dashboard-debug-safe";

export async function processSaveStudentProgress(executionState) {
  var payload = executionState.payload;
  var actor = executionState.actor;

  try {
    await saveStudentPracticeModeProgress(actor, payload, payload.completedStepIds, payload.completed);

    executionState.result = {
      courseId: payload.courseId,
      moduleId: payload.moduleId,
      sessionId: payload.sessionId,
      practiceModeKey: payload.practiceModeKey,
      completedStepIds: payload.completedStepIds,
      completionResults: {},
      completed: payload.completed === true
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "SAVE_STUDENT_PROGRESS_FAILED",
          message: "Failed to save student progress: " + error.message
        }
      ]
    };
  }
}
