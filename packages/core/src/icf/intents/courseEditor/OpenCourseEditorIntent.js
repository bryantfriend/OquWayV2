import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.152-course-builder-loading-timeout";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.152-course-builder-loading-timeout";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.152-course-builder-loading-timeout";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.152-course-builder-loading-timeout";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.152-course-builder-loading-timeout";
import { processOpenCourseEditor } from "../../stages/process/processors.js?v=1.1.152-course-builder-loading-timeout";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.152-course-builder-loading-timeout";

export function OpenCourseEditorIntent() {
    return {
        type: "OpenCourseEditorIntent",
        validate: [
            validateAuthenticated,
            validateCourseId
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
            processOpenCourseEditor
        ],
        emit: [
            emitIntentResult
        ]
    };
}
