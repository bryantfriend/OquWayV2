import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js";
import { processListLocations } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
