import { validateAuthenticated, validateCourseId, validateModuleExists, validateFieldExistsInSchema, validateFieldValueType } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeCourseId, normalizeStringTrim, normalizeBoolean, normalizeNumber } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachCourseDocument, attachModulesCollection, attachModule } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processUpdateModuleField } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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

