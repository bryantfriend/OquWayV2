import { validateAuthenticated, validateCourseId, validateModuleExists } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachCourseDocument, attachModulesCollection, attachModule } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processDeleteModule } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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

