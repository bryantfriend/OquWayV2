import { emitIntentResult } from "../../stages/emit/emitters.js";

export function UpdateCourseIntent() {
  return {
    type: "UpdateCourseIntent",
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
