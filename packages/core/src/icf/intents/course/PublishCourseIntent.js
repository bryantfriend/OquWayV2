import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function PublishCourseIntent() {
  return {
    type: "PublishCourseIntent",
    validate: [],
    normalize: [],
    addContext: [],
    authorize: [],
    process: [],
    emit: [
      emitIntentResult
    ]
  };
}
