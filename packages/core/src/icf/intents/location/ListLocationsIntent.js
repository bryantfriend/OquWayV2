import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processListLocations } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

export function ListLocationsIntent() {
  return {
    type: "ListLocationsIntent",
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
