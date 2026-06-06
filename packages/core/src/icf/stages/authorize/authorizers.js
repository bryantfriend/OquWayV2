export { authorizeDemoActor } from "./core/authorizeDemoActor.js?v=1.1.107-student-firebase-auth-chain";
export { catalogRequireCourseCreatorAuthorization } from "./domain/catalog/catalogRequireCourseCreatorAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireCourseCreatorOwnershipAuthorization } from "./domain/catalogCourse/ownershipAuthorizers.js?v=1.1.107-student-firebase-auth-chain";
export { preventModificationIfPublishedAuthorization } from "./domain/catalogCourse/preventDeleteIfInUseAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { preventDeleteIfInUseAuthorization } from "./domain/catalogCourse/preventDeleteIfInUseAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireCourseAssignmentAdminAuthorization } from "./domain/courseAssignment/requireCourseAssignmentAdminAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireCourseAssignmentOwnershipAuthorization } from "./domain/courseAssignment/requireCourseAssignmentOwnershipAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireCourseAssignmentOwnershipReadAuthorization } from "./domain/courseAssignment/requireCourseAssignmentOwnershipReadAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export {
  requireExternalTaskReviewerAuthorization,
  requireExternalTaskStudentAuthorization
} from "./domain/externalTask/requireExternalTaskAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireCourseCreatorAuthorization } from "./domain/catalogCourse/requireCourseCreatorAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireLocationAdminAuthorization, allowPublicLocationRead } from "./domain/location/requireLocationAdminAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requirePlatformAdminAuthorization } from "./domain/catalogCourse/requirePlatformAdminAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireSuperAdminAuthorization } from "./domain/catalogCourse/requireSuperAdminAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireStudentAuthorization } from "./domain/student/requireStudentAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { allowStudentLoginAuthorization } from "./domain/studentLogin/allowStudentLoginAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireClassOwnershipAdminAuthorization } from "./domain/superAdmin/requireClassOwnershipAdminAuthorization.js?v=1.1.107-student-firebase-auth-chain";
export { requireSuperAdminAccess } from "./domain/superAdmin/requireSuperAdminAccess.js?v=1.1.107-student-firebase-auth-chain";
export {
  allowTeacherLoginAuthorization,
  requireTeacherDashboardAuthorization,
  requireTeacherReviewScopeAuthorization
} from "./domain/teacher/requireTeacherAuthorization.js?v=1.1.107-student-firebase-auth-chain";


