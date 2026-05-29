import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processSaveModuleDraft } from "../../stages/process/processors.js";
import { validateCourseId, validateModuleId, validateModuleStepsPayload } from "../../stages/validate/validators.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function SaveModuleDraftIntent() {
    return {
        type: "SaveModuleDraftIntent",
        validate: [
            validateCourseId,
            validateModuleId,
            validateModuleStepsPayload
        ],
        normalize: [],
        addContext: [],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            processSaveModuleDraft
        ],
        emit: [
            emitIntentResult
        ]
    };
}
