import { validateAuthenticated, validateCourseId, validateModuleExists, validateFieldExistsInSchema, validateFieldValueType } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { normalizeCourseId, normalizeStringTrim, normalizeBoolean, normalizeNumber } from "../../stages/normalize/normalizers.js?v=1.1.113-student-rules-read";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachCourseDocument, attachModulesCollection, attachModule } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processUpdateModuleField } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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

