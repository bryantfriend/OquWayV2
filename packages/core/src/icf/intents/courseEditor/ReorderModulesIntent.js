import { validateAuthenticated, validateCourseId, validateOrderBounds } from "../../stages/validate/validators.js";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processReorderModules } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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

