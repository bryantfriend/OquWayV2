import { validateAuthenticated, validateCourseId, validateModuleExists } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachCourseDocument, attachModulesCollection, attachModule } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processDeleteModule } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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

