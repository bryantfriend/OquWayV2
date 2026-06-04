import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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
