import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";
import { collection, db, doc, getDoc, getDocs, query, where } from "../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";

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
    var userSnapshot = await resolveUserSnapshot(executionState.payload.userId);

    if (!userSnapshot) {
      var unresolvedProfile = {
        id: executionState.payload.userId,
        contextResolutionWarning: "Selected user profile was not resolved by addContext."
      };

      console.warn("[user-command-center:profile-not-resolved]", {
        userId: executionState.payload.userId
      });

      return {
        valid: true,
        data: {
          selectedUserProfile: unresolvedProfile
        }
      };
    }

    return {
      valid: true,
      data: {
        selectedUserProfile: Object.assign({
      id: userSnapshot.id
        }, userSnapshot.data() || {})
      }
    };
  } catch (error) {
    var fallbackProfile = {
      id: executionState.payload.userId,
      contextResolutionWarning: error && error.message ? error.message : "Could not load selected user context."
    };

    console.warn("[user-command-center:context-warning]", {
      userId: executionState.payload.userId,
      errorCode: error && error.code ? error.code : "",
      errorMessage: error && error.message ? error.message : String(error)
    });

    return {
      valid: true,
      data: {
        selectedUserProfile: fallbackProfile
      }
    };
  }
}

async function resolveUserSnapshot(userId) {
  var directSnapshot = await getDoc(doc(db, "users", userId));

  if (directSnapshot.exists()) {
    return directSnapshot;
  }

  return await findUserSnapshotByIdentifier(userId);
}

async function findUserSnapshotByIdentifier(userId) {
  var lookupFields = ["authUid", "uid", "userId", "studentId", "profileUserId"];
  var fieldIndex = 0;

  while (fieldIndex < lookupFields.length) {
    var snapshot = await safelyQueryUsersByField(lookupFields[fieldIndex], userId);
    var resolvedSnapshot = readFirstSnapshot(snapshot);

    if (resolvedSnapshot) {
      console.info("[user-command-center:resolved-user]", {
        requestedUserId: userId,
        matchedField: lookupFields[fieldIndex],
        resolvedUserId: resolvedSnapshot.id
      });
      return resolvedSnapshot;
    }

    fieldIndex = fieldIndex + 1;
  }

  return null;
}

async function safelyQueryUsersByField(fieldName, userId) {
  try {
    return await getDocs(query(collection(db, "users"), where(fieldName, "==", userId)));
  } catch (error) {
    console.warn("[user-command-center:lookup-skipped]", {
      fieldName: fieldName,
      userId: userId,
      errorCode: error && error.code ? error.code : "",
      errorMessage: error && error.message ? error.message : String(error)
    });

    return {
      forEach: function () {}
    };
  }
}

function readFirstSnapshot(snapshot) {
  var resolvedSnapshot = null;

  snapshot.forEach(function (candidateSnapshot) {
    if (!resolvedSnapshot) {
      resolvedSnapshot = candidateSnapshot;
    }
  });

  return resolvedSnapshot;
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
