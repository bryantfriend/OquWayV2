import { validateAuthenticated, validateCourseId, validateCoursePublishReady } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.124-location-icon-upload";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { processPublishCourse } from "../../stages/process/processors.js?v=1.1.124-location-icon-upload";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

export function PublishCourseIntent() {
    return {
        type: "PublishCourseIntent",
        validate: [
            validateAuthenticated,
            validateCourseId,
            validateCoursePublishReady
        ],
        normalize: [
            normalizeCourseId
        ],
        addContext: [
            attachActorContext,
            attachActorRoleContext,
            attachCourseDocument,
            attachModulesCollection
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            processPublishCourse
        ],
        emit: [
            emitIntentResult
        ]
    };
}

