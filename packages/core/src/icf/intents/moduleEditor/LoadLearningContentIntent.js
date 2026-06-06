import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.107-student-firebase-auth-chain";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.107-student-firebase-auth-chain";
import { processLoadLearningContent } from "../../stages/process/processors.js?v=1.1.107-student-firebase-auth-chain";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.107-student-firebase-auth-chain";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.107-student-firebase-auth-chain";

export function LoadLearningContentIntent() {
  return {
    type: "LoadLearningContentIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleId],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processLoadLearningContent],
    emit: [emitIntentResult]
  };
}
