import { catalogCourseRequireCourseIdValidation } from "../../stages/validate/validators.js?v=1.1.107-student-firebase-auth-chain";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.107-student-firebase-auth-chain";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.107-student-firebase-auth-chain";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.107-student-firebase-auth-chain";
import { catalogCourseFetchByIdProcessing } from "../../stages/process/processors.js?v=1.1.107-student-firebase-auth-chain";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.107-student-firebase-auth-chain";

export function FetchCatalogCourseByIdIntent() {
    return {
        type: "FetchCatalogCourseByIdIntent",
        validate: [
            catalogCourseRequireCourseIdValidation
        ],
        normalize: [],
        addContext: [
            attachActorContext,
            attachActorRoleContext,
            attachExistingCourseContext
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            catalogCourseFetchByIdProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

