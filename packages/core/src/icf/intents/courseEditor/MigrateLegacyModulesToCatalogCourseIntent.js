import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processMigrateLegacyModulesToCatalogCourse } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function MigrateLegacyModulesToCatalogCourseIntent() {
    return {
        type: "MigrateLegacyModulesToCatalogCourseIntent",
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
            processMigrateLegacyModulesToCatalogCourse
        ],
        emit: [
            emitIntentResult
        ]
    };
}
