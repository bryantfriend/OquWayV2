import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.80-course-module-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.80-course-module-command-center";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.80-course-module-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.80-course-module-command-center";
import { db, doc, getDoc } from "../../../infrastructure/firebase/firestore.js?v=1.1.80-course-module-command-center";

export function OpenUserCommandCenterIntent() {
  return {
    type: "OpenUserCommandCenterIntent",
    validate: [validateAuthenticated, validateUserCommandCenterPayload],
    normalize: [normalizeUserCommandCenterPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachUserCommandCenterContext],
    authorize: [requireSuperAdminAccess],
    process: [processOpenUserCommandCenter],
    emit: [emitIntentResult]
  };
}

async function attachUserCommandCenterContext(executionState) {
  try {
    var userRef = doc(db, "users", executionState.payload.userId);
    var userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      return {
        valid: false,
        errors: [{
          code: "USER_PROFILE_NOT_FOUND",
          field: "userId",
          message: "The selected user profile was not found."
        }]
      };
    }

    executionState.context.selectedUserProfile = Object.assign({
      id: userSnapshot.id
    }, userSnapshot.data() || {});

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{
        code: "USER_COMMAND_CONTEXT_FAILED",
        message: error && error.message ? error.message : "Could not load selected user context."
      }]
    };
  }
}

function validateUserCommandCenterPayload(executionState) {
  var userId = executionState && executionState.payload ? executionState.payload.userId : "";

  if (typeof userId !== "string" || userId.trim() === "") {
    return {
      valid: false,
      errors: [{
        code: "USER_ID_REQUIRED",
        field: "userId",
        message: "userId is required to open User Command Center."
      }]
    };
  }

  return { valid: true };
}

function normalizeUserCommandCenterPayload(executionState) {
  executionState.payload = Object.assign({}, executionState.payload, {
    userId: String(executionState.payload.userId || "").trim()
  });

  return { valid: true };
}

function processOpenUserCommandCenter(executionState) {
  var userProfile = executionState.context.selectedUserProfile || {};

  executionState.result = {
    userId: executionState.payload.userId,
    user: {
      id: userProfile.id || executionState.payload.userId,
      displayName: userProfile.displayName || userProfile.name || "",
      email: userProfile.email || "",
      role: userProfile.role || "",
      roles: Array.isArray(userProfile.roles) ? userProfile.roles : []
    },
    openedAt: Date.now()
  };

  return { valid: true };
}
