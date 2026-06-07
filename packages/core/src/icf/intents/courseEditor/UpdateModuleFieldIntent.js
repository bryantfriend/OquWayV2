import { validateAuthenticated, validateCourseId, validateModuleExists, validateFieldExistsInSchema, validateFieldValueType } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeCourseId, normalizeStringTrim, normalizeBoolean, normalizeNumber } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachCourseDocument, attachModulesCollection, attachModule } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processUpdateModuleField } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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

