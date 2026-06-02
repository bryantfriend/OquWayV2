import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.27-module-repair";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.27-module-repair";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processMigrateLegacyModulesToCatalogCourse } from "../../stages/process/processors.js?v=1.1.27-module-repair";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
