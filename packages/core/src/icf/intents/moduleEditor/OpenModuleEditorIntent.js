import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js";
import { processOpenModuleEditor } from "../../stages/process/processors.js";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function OpenModuleEditorIntent() {
  return {
    type: "OpenModuleEditorIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId
    ],
    normalize: [],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachSessionsCollection
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processOpenModuleEditor
    ],
    emit: [
      emitIntentResult
    ]
  };
}
