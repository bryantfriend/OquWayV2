import { catalogCourseRequireStepIdValidation } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachExistingStepContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { catalogStepDeleteProcessing } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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

