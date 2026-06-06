import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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
