import { validateAuthenticated, validateCourseId, validateModuleExists } from "../../stages/validate/validators.js";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocument, attachModulesCollection, attachModule } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processDeleteModule } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function DeleteModuleIntent() {
    return {
        type: "DeleteModuleIntent",
        validate: [
            validateAuthenticated,
            validateCourseId,
            validateModuleExists
        ],
        normalize: [
            normalizeCourseId
        ],
        addContext: [
            attachActorContext,
            attachActorRoleContext,
            attachCourseDocument,
            attachModulesCollection,
            attachModule
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            processDeleteModule
        ],
        emit: [
            emitIntentResult
        ]
    };
}

