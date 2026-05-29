import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processValidateCourseStructure } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function ValidateCourseStructureIntent() {
    return {
        type: "ValidateCourseStructureIntent",
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
            processValidateCourseStructure
        ],
        emit: [
            emitIntentResult
        ]
    };
}

