export { authorizeDemoActor } from "./core/authorizeDemoActor.js?v=1.1.54-multi-role-assistant";
export { catalogRequireCourseCreatorAuthorization } from "./domain/catalog/catalogRequireCourseCreatorAuthorization.js?v=1.1.54-multi-role-assistant";
export { requireCourseCreatorOwnershipAuthorization } from "./domain/catalogCourse/ownershipAuthorizers.js?v=1.1.54-multi-role-assistant";
export { preventModificationIfPublishedAuthorization } from "./domain/catalogCourse/preventDeleteIfInUseAuthorization.js?v=1.1.54-multi-role-assistant";
export { preventDeleteIfInUseAuthorization } from "./domain/catalogCourse/preventDeleteIfInUseAuthorization.js?v=1.1.54-multi-role-assistant";
export { requireCourseAssignmentAdminAuthorization } from "./domain/courseAssignment/requireCourseAssignmentAdminAuthorization.js?v=1.1.54-multi-role-assistant";
export {
  requireExternalTaskReviewerAuthorization,
  requireExternalTaskStudentAuthorization
} from "./domain/externalTask/requireExternalTaskAuthorization.js?v=1.1.54-multi-role-assistant";
export { requireCourseCreatorAuthorization } from "./domain/catalogCourse/requireCourseCreatorAuthorization.js?v=1.1.54-multi-role-assistant";
export { requireLocationAdminAuthorization, allowPublicLocationRead } from "./domain/location/requireLocationAdminAuthorization.js?v=1.1.54-multi-role-assistant";
export { requirePlatformAdminAuthorization } from "./domain/catalogCourse/requirePlatformAdminAuthorization.js?v=1.1.54-multi-role-assistant";
export { requireSuperAdminAuthorization } from "./domain/catalogCourse/requireSuperAdminAuthorization.js?v=1.1.54-multi-role-assistant";
export { requireStudentAuthorization } from "./domain/student/requireStudentAuthorization.js?v=1.1.54-multi-role-assistant";
export { allowStudentLoginAuthorization } from "./domain/studentLogin/allowStudentLoginAuthorization.js?v=1.1.54-multi-role-assistant";
export { requireClassOwnershipAdminAuthorization } from "./domain/superAdmin/requireClassOwnershipAdminAuthorization.js?v=1.1.55-class-ownership";
export { requireSuperAdminAccess } from "./domain/superAdmin/requireSuperAdminAccess.js?v=1.1.54-multi-role-assistant";
export {
  allowTeacherLoginAuthorization,
  requireTeacherDashboardAuthorization,
  requireTeacherReviewScopeAuthorization
} from "./domain/teacher/requireTeacherAuthorization.js?v=1.1.54-multi-role-assistant";


