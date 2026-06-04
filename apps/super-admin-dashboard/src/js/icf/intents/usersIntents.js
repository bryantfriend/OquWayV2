import { addAdminContext } from "../../../../../../packages/icf/admin/stages/addContext.js";
import { allowAuthorizedLegacyFlow, requireAdminAccess } from "../../../../../../packages/icf/admin/stages/authorize.js";
import { emitResult } from "../../../../../../packages/icf/admin/stages/emit.js";
import { normalizeUserId, normalizeUserPayload } from "../../../../../../packages/icf/admin/stages/normalize.js";
import { callService } from "../../../../../../packages/icf/admin/stages/process.js";
import { allowAnyPayload, requireEmail, requireUserId } from "../../../../../../packages/icf/admin/stages/validate.js";
import { createUser, deleteUser, disableUser, getUser, getUsers, sendPasswordReset, updateUser } from "../../users/usersService.js";
import { resetFruitPassword } from "../../users/fruitPasswordService.js";

export function registerUsersIntents(registerIntent) {
  registerIntent({
    type: "LoadUsersIntent",
    validate: [allowAnyPayload],
    normalize: [],
    addContext: [addAdminContext],
    authorize: [allowAuthorizedLegacyFlow],
    process: [callService(getUsers)],
    emit: [emitResult]
  });

  registerIntent({
    type: "FilterUsersIntent",
    validate: [allowAnyPayload],
    normalize: [],
    addContext: [addAdminContext],
    authorize: [allowAuthorizedLegacyFlow],
    process: [callService(function (payload) { return payload; })],
    emit: [emitResult]
  });

  registerIntent({
    type: "GetUserIntent",
    validate: [requireUserId],
    normalize: [normalizeUserId],
    addContext: [addAdminContext],
    authorize: [requireAdminAccess],
    process: [callService(getUser)],
    emit: [emitResult]
  });

  registerIntent({
    type: "CreateUserIntent",
    validate: [allowAnyPayload],
    normalize: [normalizeUserPayload],
    addContext: [addAdminContext],
    authorize: [requireAdminAccess],
    process: [callService(createUser)],
    emit: [emitResult]
  });

  registerIntent({
    type: "EditUserIntent",
    validate: [requireUserId],
    normalize: [normalizeUserPayload],
    addContext: [addAdminContext],
    authorize: [requireAdminAccess],
    process: [callService(updateUser)],
    emit: [emitResult]
  });

  registerIntent({
    type: "DisableUserIntent",
    validate: [requireUserId],
    normalize: [normalizeUserId],
    addContext: [addAdminContext],
    authorize: [requireAdminAccess],
    process: [callService(disableUser)],
    emit: [emitResult]
  });

  registerIntent({
    type: "DeleteUserIntent",
    validate: [requireUserId],
    normalize: [normalizeUserId],
    addContext: [addAdminContext],
    authorize: [requireAdminAccess],
    process: [callService(deleteUser)],
    emit: [emitResult]
  });

  registerIntent({
    type: "ResetFruitPasswordIntent",
    validate: [requireUserId],
    normalize: [normalizeUserId],
    addContext: [addAdminContext],
    authorize: [requireAdminAccess],
    process: [callService(resetFruitPassword)],
    emit: [emitResult]
  });

  registerIntent({
    type: "SendPasswordResetIntent",
    validate: [requireEmail],
    normalize: [],
    addContext: [addAdminContext],
    authorize: [requireAdminAccess],
    process: [callService(sendPasswordReset)],
    emit: [emitResult]
  });
}
