import { validateAuthenticated, validateCourseId, validateStepTypeRegistered } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeStepType } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocument, attachModulesCollection, attachStepRegistryDefinition } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processAddModule } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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

