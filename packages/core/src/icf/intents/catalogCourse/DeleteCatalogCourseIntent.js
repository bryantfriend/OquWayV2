import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireSuperAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { preventDeleteIfInUseAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { catalogCourseDeleteProcessing } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

export function DeleteCatalogCourseIntent() {
    return {
        type: "DeleteCatalogCourseIntent",
        validate: [],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingCourseContext
        ],
        authorize: [
            requireSuperAdminAuthorization,
            preventDeleteIfInUseAuthorization
        ],
        process: [
            catalogCourseDeleteProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

