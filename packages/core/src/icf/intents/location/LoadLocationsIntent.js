import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { processListLocations } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

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
