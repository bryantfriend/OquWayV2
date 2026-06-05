import { catalogCourseRequireTitleValidation, catalogCourseRequireLanguagesValidation } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachTenantContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachTimestampContext, attachCreatedByContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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

