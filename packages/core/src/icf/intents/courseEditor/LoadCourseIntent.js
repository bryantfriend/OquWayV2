import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.117-student-identity-binding";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { processLoadCourse } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

export function LoadCourseIntent() {
    return {
        type: "LoadCourseIntent",
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
            processLoadCourse
        ],
        emit: [
            emitIntentResult
        ]
    };
}

