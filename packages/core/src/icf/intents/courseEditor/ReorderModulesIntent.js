import { validateAuthenticated, validateCourseId, validateOrderBounds } from "../../stages/validate/validators.js?v=1.1.78-location-command-center";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.78-location-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.78-location-command-center";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.78-location-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.78-location-command-center";
import { processReorderModules } from "../../stages/process/processors.js?v=1.1.78-location-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.78-location-command-center";

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

