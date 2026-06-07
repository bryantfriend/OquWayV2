import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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
