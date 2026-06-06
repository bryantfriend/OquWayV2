import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { catalogCourseFetchAllProcessing } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

export function ListCoursesIntent() {
  return {
    type: "ListCoursesIntent",

    validate: [
      validateAuthenticated
    ],

    normalize: [],

    addContext: [
      attachActorContext,
      attachActorRoleContext
    ],

    authorize: [
      requireCourseCreatorAuthorization
    ],

    process: [
      catalogCourseFetchAllProcessing
    ],

    emit: [
      emitIntentResult
    ]
  };
}
