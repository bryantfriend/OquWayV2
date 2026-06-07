import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";
import { db, doc, getDoc } from "../../../infrastructure/firebase/firestore.js?v=1.1.112-student-assignment-error-debug";

export function OpenClassCommandCenterIntent() {
  return {
    type: "OpenClassCommandCenterIntent",
    validate: [validateAuthenticated, validateClassCommandCenterPayload],
    normalize: [normalizeClassCommandCenterPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachClassCommandCenterContext],
    authorize: [requireSuperAdminAccess],
    process: [processOpenClassCommandCenter],
    emit: [emitIntentResult]
  };
}

async function attachClassCommandCenterContext(executionState) {
  try {
    var classRef = doc(db, "classes", executionState.payload.classId);
    var classSnapshot = await getDoc(classRef);

    if (!classSnapshot.exists()) {
      return {
        valid: false,
        errors: [{
          code: "CLASS_NOT_FOUND",
          field: "classId",
          message: "The selected class was not found."
        }]
      };
    }

    executionState.context.selectedClass = Object.assign({
      id: classSnapshot.id
    }, classSnapshot.data() || {});

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{
        code: "CLASS_COMMAND_CONTEXT_FAILED",
        message: error && error.message ? error.message : "Could not load selected class context."
      }]
    };
  }
}

function validateClassCommandCenterPayload(executionState) {
  var classId = executionState && executionState.payload ? executionState.payload.classId : "";

  if (typeof classId !== "string" || classId.trim() === "") {
    return {
      valid: false,
      errors: [{
        code: "CLASS_ID_REQUIRED",
        field: "classId",
        message: "classId is required to open Class Command Center."
      }]
    };
  }

  return { valid: true };
}

function normalizeClassCommandCenterPayload(executionState) {
  executionState.payload = Object.assign({}, executionState.payload, {
    classId: String(executionState.payload.classId || "").trim()
  });

  return { valid: true };
}

function processOpenClassCommandCenter(executionState) {
  var classRecord = executionState.context.selectedClass || {};

  executionState.result = {
    classId: executionState.payload.classId,
    classRecord: {
      id: classRecord.id || executionState.payload.classId,
      name: classRecord.name || classRecord.title || "",
      status: classRecord.status || "active",
      locationId: classRecord.locationId || classRecord.primaryLocationId || classRecord.schoolId || ""
    },
    openedAt: Date.now()
  };

  return { valid: true };
}
