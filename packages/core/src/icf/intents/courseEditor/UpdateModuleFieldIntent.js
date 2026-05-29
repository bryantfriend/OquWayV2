import { validateAuthenticated, validateCourseId, validateModuleExists, validateFieldExistsInSchema, validateFieldValueType } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeStringTrim, normalizeBoolean, normalizeNumber } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocument, attachModulesCollection, attachModule } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processUpdateModuleField } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function UpdateModuleFieldIntent() {
    return {
        type: "UpdateModuleFieldIntent",
        validate: [
            validateAuthenticated,
            validateCourseId,
            validateModuleExists,
            validateFieldExistsInSchema,
            validateFieldValueType
        ],
        normalize: [
            normalizeCourseId,
            normalizeStringTrim,
            normalizeBoolean,
            normalizeNumber
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
            processUpdateModuleField
        ],
        emit: [
            emitIntentResult
        ]
    };
}

