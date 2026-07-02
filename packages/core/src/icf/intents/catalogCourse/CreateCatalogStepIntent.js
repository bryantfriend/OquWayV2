import { catalogCourseRequireModuleIdValidation, catalogCourseValidateStepConfigValidation } from "../../stages/validate/validators.js?v=1.1.219-course-creator-all-courses";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { catalogStepCreateProcessing } from "../../stages/process/processors.js?v=1.1.219-course-creator-all-courses";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.219-course-creator-all-courses";

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

