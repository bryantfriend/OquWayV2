import { addAdminContext } from "../stages/addContext.js";
import { requireUserManagementAccess } from "../stages/authorize.js";
import { emitResult } from "../stages/emit.js";
import { normalizeUserId, normalizeUserPayload } from "../stages/normalize.js";
import { callService } from "../stages/process.js";
import { allowAnyPayload, requireEmail, requireUserCreatePayload, requireUserId } from "../stages/validate.js";

export function createUsersIntentRegistrar(services) {
  var safeServices = services || {};

  return function registerUsersIntents(registerIntent) {
    registerIntent({
      type: "LoadUsersIntent",
      validate: [allowAnyPayload],
      normalize: [],
      addContext: [addAdminContext],
      authorize: [requireUserManagementAccess],
      process: [callService(safeServices.getUsers)],
      emit: [emitResult]
    });

    registerIntent({
      type: "FilterUsersIntent",
      validate: [allowAnyPayload],
      normalize: [],
      addContext: [addAdminContext],
      authorize: [requireUserManagementAccess],
      process: [callService(function (payload) { return payload; })],
      emit: [emitResult]
    });

    registerIntent({
      type: "GetUserIntent",
      validate: [requireUserId],
      normalize: [normalizeUserId],
      addContext: [addAdminContext],
      authorize: [requireUserManagementAccess],
      process: [callService(safeServices.getUser)],
      emit: [emitResult]
    });

    registerIntent({
      type: "CreateUserIntent",
      validate: [requireUserCreatePayload],
      normalize: [normalizeUserPayload],
      addContext: [addAdminContext],
      authorize: [requireUserManagementAccess],
      process: [callService(safeServices.createUser)],
      emit: [emitResult]
    });

    registerIntent({
      type: "EditUserIntent",
      validate: [requireUserId],
      normalize: [normalizeUserPayload],
      addContext: [addAdminContext],
      authorize: [requireUserManagementAccess],
      process: [callService(safeServices.updateUser)],
      emit: [emitResult]
    });

    registerIntent({
      type: "DisableUserIntent",
      validate: [requireUserId],
      normalize: [normalizeUserId],
      addContext: [addAdminContext],
      authorize: [requireUserManagementAccess],
      process: [callService(safeServices.disableUser)],
      emit: [emitResult]
    });

    registerIntent({
      type: "DeleteUserIntent",
      validate: [requireUserId],
      normalize: [normalizeUserId],
      addContext: [addAdminContext],
      authorize: [requireUserManagementAccess],
      process: [callService(safeServices.deleteUser)],
      emit: [emitResult]
    });

    registerIntent({
      type: "ResetFruitPasswordIntent",
      validate: [requireUserId],
      normalize: [normalizeUserId],
      addContext: [addAdminContext],
      authorize: [requireUserManagementAccess],
      process: [callService(safeServices.resetFruitPassword)],
      emit: [emitResult]
    });

    registerIntent({
      type: "SendPasswordResetIntent",
      validate: [requireEmail],
      normalize: [],
      addContext: [addAdminContext],
      authorize: [requireUserManagementAccess],
      process: [callService(safeServices.sendPasswordReset)],
      emit: [emitResult]
    });
  };
}
