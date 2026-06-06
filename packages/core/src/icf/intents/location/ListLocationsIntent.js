import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processListLocations } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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
