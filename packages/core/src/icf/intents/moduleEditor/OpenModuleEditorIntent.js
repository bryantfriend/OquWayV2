import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.108-student-class-alias-merge";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { processOpenModuleEditor } from "../../stages/process/processors.js?v=1.1.108-student-class-alias-merge";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.108-student-class-alias-merge";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.108-student-class-alias-merge";

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
