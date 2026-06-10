import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { catalogCourseFetchAllProcessing } from "../../stages/process/processors.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

export function LoadCoursesIntent() {
  return {
    type: "LoadCoursesIntent",
    validate: [validateAuthenticated],
    normalize: [],
    addContext: [
      attachActorContext,
      attachActorRoleContext
    ],
    authorize: [requireCourseCreatorAuthorization],
    process: [catalogCourseFetchAllProcessing],
    emit: [emitIntentResult]
  };
}
