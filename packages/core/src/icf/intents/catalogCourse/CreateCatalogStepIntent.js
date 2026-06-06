import { catalogCourseRequireModuleIdValidation, catalogCourseValidateStepConfigValidation } from "../../stages/validate/validators.js?v=1.1.108-student-class-alias-merge";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.108-student-class-alias-merge";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.108-student-class-alias-merge";
import { catalogStepCreateProcessing } from "../../stages/process/processors.js?v=1.1.108-student-class-alias-merge";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.108-student-class-alias-merge";

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

