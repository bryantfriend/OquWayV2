import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireSuperAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { preventDeleteIfInUseAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { catalogCourseDeleteProcessing } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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

