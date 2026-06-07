import { catalogCourseRequireModuleIdValidation, catalogCourseValidateStepConfigValidation } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { catalogStepCreateProcessing } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

export function CreateCatalogStepIntent() {
    return {
        type: "CreateCatalogStepIntent",
        validate: [
            catalogCourseRequireModuleIdValidation,
            catalogCourseValidateStepConfigValidation
        ],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachCreatedByContext,
            attachExistingModuleContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization,
            preventModificationIfPublishedAuthorization
        ],
        process: [
            catalogStepCreateProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

