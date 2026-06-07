import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { processSaveModuleDraft } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { validateCourseId, validateModuleId, validateModuleStepsPayload } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

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
