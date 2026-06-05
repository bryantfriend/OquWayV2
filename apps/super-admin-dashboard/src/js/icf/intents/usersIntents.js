// Deprecated Phase 1 shim: admin intent definitions live in packages/icf/admin/intents.
import { createUsersIntentRegistrar } from "../../../../../../packages/icf/admin/intents/usersIntents.js";
import { createUser, deleteUser, disableUser, getUser, getUsers, sendPasswordReset, updateUser } from "../../users/usersService.js";
import { resetFruitPassword } from "../../users/fruitPasswordService.js";

export var registerUsersIntents = createUsersIntentRegistrar({
  createUser: createUser,
  deleteUser: deleteUser,
  disableUser: disableUser,
  getUser: getUser,
  getUsers: getUsers,
  resetFruitPassword: resetFruitPassword,
  sendPasswordReset: sendPasswordReset,
  updateUser: updateUser
});
