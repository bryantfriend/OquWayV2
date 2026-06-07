import { validateAuthenticated, validateCourseId, validateOrderBounds } from "../../stages/validate/validators.js?v=1.1.116-student-token-ready";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.116-student-token-ready";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.116-student-token-ready";
import { processReorderModules } from "../../stages/process/processors.js?v=1.1.116-student-token-ready";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.116-student-token-ready";

export function ReorderModulesIntent() {
    return {
        type: "ReorderModulesIntent",
        validate: [
            validateAuthenticated,
            validateCourseId,
            validateOrderBounds
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
            processReorderModules
        ],
        emit: [
            emitIntentResult
        ]
    };
}

