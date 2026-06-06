import { catalogCourseRequireStepIdValidation } from "../../stages/validate/validators.js?v=1.1.108-student-class-alias-merge";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { attachExistingStepContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.108-student-class-alias-merge";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.108-student-class-alias-merge";
import { catalogStepDeleteProcessing } from "../../stages/process/processors.js?v=1.1.108-student-class-alias-merge";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.108-student-class-alias-merge";

export function DeleteCatalogStepIntent() {
    return {
        type: "DeleteCatalogStepIntent",
        validate: [
            catalogCourseRequireStepIdValidation
        ],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingStepContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization,
            preventModificationIfPublishedAuthorization
        ],
        process: [
            catalogStepDeleteProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

