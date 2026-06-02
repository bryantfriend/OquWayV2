import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.27-module-repair";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.27-module-repair";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processOpenCourseEditor } from "../../stages/process/processors.js?v=1.1.27-module-repair";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function OpenCourseEditorIntent() {
    return {
        type: "OpenCourseEditorIntent",
        validate: [
            validateAuthenticated,
            validateCourseId
        ],
        normalize: [
            normalizeCourseId
        ],
        addContext: [
            attachActorContext,
            attachActorRoleContext,
            attachCourseDocument,
            attachModulesCollection
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            processOpenCourseEditor
        ],
        emit: [
            emitIntentResult
        ]
    };
}

