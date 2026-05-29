import { catalogCourseRequireTitleValidation, catalogCourseRequireLanguagesValidation } from "../../stages/validate/validators.js";
import { normalizeCourseMetadata } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachTenantContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachCreatedByContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function CreateCatalogCourseIntent() {
    return {
        type: "CreateCatalogCourseIntent",
        validate: [
            catalogCourseRequireTitleValidation,
            catalogCourseRequireLanguagesValidation
        ],
        normalize: [
            normalizeCourseMetadata
        ],
        addContext: [
            attachActorContext,
            attachActorRoleContext,
            attachTenantContext,
            attachTimestampContext,
            attachCreatedByContext,
            attachUpdatedByContext
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            catalogCourseCreateRecordProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

