import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { catalogCoursePublishVersionProcessing } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function PublishCatalogCourseVersionIntent() {
    return {
        type: "PublishCatalogCourseVersionIntent",
        validate: [],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingVersionContext
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            catalogCoursePublishVersionProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

