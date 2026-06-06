import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.108-student-class-alias-merge";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.108-student-class-alias-merge";
import { catalogCourseFetchAllProcessing } from "../../stages/process/processors.js?v=1.1.108-student-class-alias-merge";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.108-student-class-alias-merge";

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
