import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.109-student-assignment-status-fallback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.109-student-assignment-status-fallback";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.109-student-assignment-status-fallback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.109-student-assignment-status-fallback";
import { db, doc, getDoc } from "../../../infrastructure/firebase/firestore.js?v=1.1.109-student-assignment-status-fallback";

export function OpenModuleCommandCenterIntent() {
  return {
    type: "OpenModuleCommandCenterIntent",
    validate: [validateAuthenticated, validateModuleCommandCenterPayload],
    normalize: [normalizeModuleCommandCenterPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachModuleCommandCenterContext],
    authorize: [requireSuperAdminAccess],
    process: [processOpenModuleCommandCenter],
    emit: [emitIntentResult]
  };
}

async function attachModuleCommandCenterContext(executionState) {
  try {
    var courseId = executionState.payload.courseId;
    var moduleId = executionState.payload.moduleId;
    var catalogRef = doc(db, "catalogCourses", courseId, "modules", moduleId);
    var catalogSnapshot = await getDoc(catalogRef);
    var moduleSnapshot = catalogSnapshot;
    var source = "catalogCourses";

    if (!catalogSnapshot.exists()) {
      var legacyRef = doc(db, "courses", courseId, "modules", moduleId);
      moduleSnapshot = await getDoc(legacyRef);
      source = "courses";
    }

    if (!moduleSnapshot.exists()) {
      return {
        valid: false,
        errors: [{
          code: "MODULE_NOT_FOUND",
          field: "moduleId",
          message: "The selected module was not found."
        }]
      };
    }

    executionState.context.selectedModule = Object.assign({
      id: moduleSnapshot.id,
      source: source
    }, moduleSnapshot.data() || {});

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{
        code: "MODULE_COMMAND_CONTEXT_FAILED",
        message: error && error.message ? error.message : "Could not load selected module context."
      }]
    };
  }
}

function validateModuleCommandCenterPayload(executionState) {
  var courseId = executionState && executionState.payload ? executionState.payload.courseId : "";
  var moduleId = executionState && executionState.payload ? executionState.payload.moduleId : "";

  if (typeof courseId !== "string" || courseId.trim() === "") {
    return {
      valid: false,
      errors: [{
        code: "COURSE_ID_REQUIRED",
        field: "courseId",
        message: "courseId is required to open Module Command Center."
      }]
    };
  }

  if (typeof moduleId !== "string" || moduleId.trim() === "") {
    return {
      valid: false,
      errors: [{
        code: "MODULE_ID_REQUIRED",
        field: "moduleId",
        message: "moduleId is required to open Module Command Center."
      }]
    };
  }

  return { valid: true };
}

function normalizeModuleCommandCenterPayload(executionState) {
  executionState.payload = Object.assign({}, executionState.payload, {
    courseId: String(executionState.payload.courseId || "").trim(),
    moduleId: String(executionState.payload.moduleId || "").trim()
  });

  return { valid: true };
}

function processOpenModuleCommandCenter(executionState) {
  var moduleRecord = executionState.context.selectedModule || {};

  executionState.result = {
    courseId: executionState.payload.courseId,
    moduleId: executionState.payload.moduleId,
    module: {
      id: moduleRecord.id || executionState.payload.moduleId,
      title: moduleRecord.title || moduleRecord.name || "",
      status: moduleRecord.status || moduleRecord.lifecycleStatus || "draft",
      source: moduleRecord.source || "catalogCourses"
    },
    openedAt: Date.now()
  };

  return { valid: true };
}
