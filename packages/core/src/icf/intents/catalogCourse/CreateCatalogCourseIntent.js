import { catalogCourseRequireTitleValidation, catalogCourseRequireLanguagesValidation } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.162-modal-stack";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { attachTenantContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { attachTimestampContext, attachCreatedByContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

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

