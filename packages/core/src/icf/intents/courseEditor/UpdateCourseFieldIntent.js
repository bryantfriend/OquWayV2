import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.116-student-token-ready";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.116-student-token-ready";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.116-student-token-ready";
import { processUpdateCourseField } from "../../stages/process/processors.js?v=1.1.116-student-token-ready";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.116-student-token-ready";

export function UpdateCourseFieldIntent() {
    return {
        type: "UpdateCourseFieldIntent",
        validate: [
            validateAuthenticated,
            validateCourseId
        ],
        normalize: [
            normalizeCourseId
        ],
        addContext: [
            attachActorContext,
            attachActorRoleContext,
            attachCourseDocument
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            processUpdateCourseField
        ],
        emit: [
            emitIntentResult
        ]
    };
}

