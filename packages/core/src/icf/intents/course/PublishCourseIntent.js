import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
