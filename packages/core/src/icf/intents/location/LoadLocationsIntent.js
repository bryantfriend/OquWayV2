import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.111-student-assignment-debug-panel";
import { processListLocations } from "../../stages/process/processors.js?v=1.1.111-student-assignment-debug-panel";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.111-student-assignment-debug-panel";

export function LoadLocationsIntent() {
  return {
    type: "LoadLocationsIntent",
    validate: [],
    normalize: [],
    addContext: [],
    authorize: [
      allowPublicLocationRead
    ],
    process: [
      processListLocations
    ],
    emit: [
      emitIntentResult
    ]
  };
}
