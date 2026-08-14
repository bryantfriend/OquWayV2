import { attachActorContext, attachActorRoleContext } from "../../../packages/core/src/icf/stages/addContext/domain/catalogCourse/attachActorRoleContext.js";
import { allowPublicLocationRead } from "../../../packages/core/src/icf/stages/authorize/domain/location/requireLocationAdminAuthorization.js";
import { requireStudentAuthorization } from "../../../packages/core/src/icf/stages/authorize/domain/student/requireStudentAuthorization.js";
import { allowStudentLoginAuthorization } from "../../../packages/core/src/icf/stages/authorize/domain/studentLogin/allowStudentLoginAuthorization.js";
import { emitIntentResult } from "../../../packages/core/src/icf/stages/emit/core/emitIntentResult.js";
import { normalizeResolveLocationSlugPayload } from "../../../packages/core/src/icf/stages/normalize/domain/location/normalizeLocationLoginModePayload.js";
import {
  normalizeClassLocationPayload,
  normalizeStudentFruitLoginPayload,
  normalizeStudentStandardLoginPayload,
  normalizeStudentsForClassPayload
} from "../../../packages/core/src/icf/stages/normalize/domain/studentLogin/normalizeStudentLoginPayloads.js";
import { processListLocations } from "../../../packages/core/src/icf/stages/process/domain/location/processListLocations.js";
import { processResolveLocationBySlug } from "../../../packages/core/src/icf/stages/process/domain/location/processResolveLocationBySlug.js";
import { processLoadClassesForLocation } from "../../../packages/core/src/icf/stages/process/domain/studentLogin/processLoadClassesForLocation.js";
import { processLoadStudentProfile } from "../../../packages/core/src/icf/stages/process/domain/studentLogin/processLoadStudentProfile.js";
import { processLoadStudentsForClass } from "../../../packages/core/src/icf/stages/process/domain/studentLogin/processLoadStudentsForClass.js";
import { processStartStudentSession } from "../../../packages/core/src/icf/stages/process/domain/studentLogin/processStartStudentSession.js";
import { processStudentFruitLogin } from "../../../packages/core/src/icf/stages/process/domain/studentLogin/processStudentFruitLogin.js";
import { processStudentStandardLogin } from "../../../packages/core/src/icf/stages/process/domain/studentLogin/processStudentStandardLogin.js";
import { validateAuthenticated } from "../../../packages/core/src/icf/stages/validate/domain/courseEditor/validateAuthenticated.js";
import { validateResolveLocationSlugPayload } from "../../../packages/core/src/icf/stages/validate/domain/location/validateLocationLoginModePayload.js";
import {
  validateClassLocationPayload,
  validateStudentFruitLoginPayload,
  validateStudentStandardLoginPayload,
  validateStudentsForClassPayload
} from "../../../packages/core/src/icf/stages/validate/domain/studentLogin/validateStudentLoginPayloads.js";

const intentDefinitions = {
  LoadLocationsIntent: createDefinition("LoadLocationsIntent", [], [], [], [allowPublicLocationRead], [processListLocations]),
  ResolveLocationBySlugIntent: createDefinition("ResolveLocationBySlugIntent", [validateResolveLocationSlugPayload], [normalizeResolveLocationSlugPayload], [], [allowPublicLocationRead], [processResolveLocationBySlug]),
  LoadClassesForLocationIntent: createDefinition("LoadClassesForLocationIntent", [validateClassLocationPayload], [normalizeClassLocationPayload], [], [allowStudentLoginAuthorization], [processLoadClassesForLocation]),
  LoadStudentsForClassIntent: createDefinition("LoadStudentsForClassIntent", [validateStudentsForClassPayload], [normalizeStudentsForClassPayload], [], [allowStudentLoginAuthorization], [processLoadStudentsForClass]),
  StudentFruitLoginIntent: createDefinition("StudentFruitLoginIntent", [validateStudentFruitLoginPayload], [normalizeStudentFruitLoginPayload], [], [allowStudentLoginAuthorization], [processStudentFruitLogin]),
  StudentStandardLoginIntent: createDefinition("StudentStandardLoginIntent", [validateStudentStandardLoginPayload], [normalizeStudentStandardLoginPayload], [], [allowStudentLoginAuthorization], [processStudentStandardLogin]),
  LoadStudentProfileIntent: createDefinition("LoadStudentProfileIntent", [validateAuthenticated], [], [attachActorContext, attachActorRoleContext], [requireStudentAuthorization], [processLoadStudentProfile]),
  StartStudentSessionIntent: createDefinition("StartStudentSessionIntent", [validateAuthenticated], [], [attachActorContext, attachActorRoleContext], [requireStudentAuthorization], [processStartStudentSession])
};

export function getStudentLoginIntentDefinition(intentType) {
  return intentDefinitions[intentType] || null;
}

function createDefinition(type, validate, normalize, addContext, authorize, process) {
  return {
    type: type,
    validate: validate,
    normalize: normalize,
    addContext: addContext,
    authorize: authorize,
    process: process,
    emit: [emitIntentResult]
  };
}
