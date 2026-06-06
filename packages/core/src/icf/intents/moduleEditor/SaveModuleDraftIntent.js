import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.80-course-module-command-center";
import { processSaveModuleDraft } from "../../stages/process/processors.js?v=1.1.80-course-module-command-center";
import { validateCourseId, validateModuleId, validateModuleStepsPayload } from "../../stages/validate/validators.js?v=1.1.80-course-module-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.80-course-module-command-center";

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
