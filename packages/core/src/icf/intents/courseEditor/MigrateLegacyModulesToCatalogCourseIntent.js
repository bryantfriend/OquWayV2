import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.113-student-rules-read";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processMigrateLegacyModulesToCatalogCourse } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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
