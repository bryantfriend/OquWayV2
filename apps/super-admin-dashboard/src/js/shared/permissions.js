// Deprecated Phase 1 shim: shared role helpers live in packages/domain/users.
export {
  hasUserRole,
  isStudentUser,
  isSuperAdminRole,
  isTeacherUser,
  normalizeRoles,
  normalizeUserRole,
  resolveUserPhoto,
  userHasAnyRole
} from "../../../../../packages/domain/users/index.js";
