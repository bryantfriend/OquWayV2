import { validateAuthenticated, validateCourseId, validateModuleExists } from "../../stages/validate/validators.js?v=1.1.80-course-module-command-center";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.80-course-module-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.80-course-module-command-center";
import { attachCourseDocument, attachModulesCollection, attachModule } from "../../stages/addContext/contexts.js?v=1.1.80-course-module-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.80-course-module-command-center";
import { processDuplicateModule } from "../../stages/process/processors.js?v=1.1.80-course-module-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.80-course-module-command-center";

export function DuplicateModuleIntent() {
    return {
        type: "DuplicateModuleIntent",
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
            processDuplicateModule
        ],
        emit: [
            emitIntentResult
        ]
    };
}

