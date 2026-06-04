import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processListLocations } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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
