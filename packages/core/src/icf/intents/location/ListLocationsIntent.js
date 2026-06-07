import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processListLocations } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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
