import { validateAuthenticated, validateCourseId, validateStepTypeRegistered } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { normalizeCourseId, normalizeStepType } from "../../stages/normalize/normalizers.js?v=1.1.162-modal-stack";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { attachCourseDocument, attachModulesCollection, attachStepRegistryDefinition } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { processAddModule } from "../../stages/process/processors.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

export function AddModuleIntent() {
    return {
        type: "AddModuleIntent",
        validate: [
            validateAuthenticated,
            validateCourseId,
            validateStepTypeRegistered
        ],
        normalize: [
            normalizeCourseId,
            normalizeStepType
        ],
        addContext: [
            attachActorContext,
            attachActorRoleContext,
            attachCourseDocument,
            attachModulesCollection,
            attachStepRegistryDefinition
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            processAddModule
        ],
        emit: [
            emitIntentResult
        ]
    };
}

