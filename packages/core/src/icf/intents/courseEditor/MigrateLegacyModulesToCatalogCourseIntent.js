import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.112-student-assignment-error-debug";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { processMigrateLegacyModulesToCatalogCourse } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

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
