import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processSaveModuleDraft } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { validateCourseId, validateModuleId, validateModuleStepsPayload } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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
