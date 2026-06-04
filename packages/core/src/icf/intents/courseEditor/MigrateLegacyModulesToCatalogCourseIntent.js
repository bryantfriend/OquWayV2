import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processMigrateLegacyModulesToCatalogCourse } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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
