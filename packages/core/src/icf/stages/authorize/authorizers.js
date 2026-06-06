export { authorizeDemoActor } from "./core/authorizeDemoActor.js?v=1.1.91-student-auth-persistence";
export { catalogRequireCourseCreatorAuthorization } from "./domain/catalog/catalogRequireCourseCreatorAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireCourseCreatorOwnershipAuthorization } from "./domain/catalogCourse/ownershipAuthorizers.js?v=1.1.91-student-auth-persistence";
export { preventModificationIfPublishedAuthorization } from "./domain/catalogCourse/preventDeleteIfInUseAuthorization.js?v=1.1.91-student-auth-persistence";
export { preventDeleteIfInUseAuthorization } from "./domain/catalogCourse/preventDeleteIfInUseAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireCourseAssignmentAdminAuthorization } from "./domain/courseAssignment/requireCourseAssignmentAdminAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireCourseAssignmentOwnershipAuthorization } from "./domain/courseAssignment/requireCourseAssignmentOwnershipAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireCourseAssignmentOwnershipReadAuthorization } from "./domain/courseAssignment/requireCourseAssignmentOwnershipReadAuthorization.js?v=1.1.91-student-auth-persistence";
export {
  requireExternalTaskReviewerAuthorization,
  requireExternalTaskStudentAuthorization
} from "./domain/externalTask/requireExternalTaskAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireCourseCreatorAuthorization } from "./domain/catalogCourse/requireCourseCreatorAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireLocationAdminAuthorization, allowPublicLocationRead } from "./domain/location/requireLocationAdminAuthorization.js?v=1.1.91-student-auth-persistence";
export { requirePlatformAdminAuthorization } from "./domain/catalogCourse/requirePlatformAdminAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireSuperAdminAuthorization } from "./domain/catalogCourse/requireSuperAdminAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireStudentAuthorization } from "./domain/student/requireStudentAuthorization.js?v=1.1.91-student-auth-persistence";
export { allowStudentLoginAuthorization } from "./domain/studentLogin/allowStudentLoginAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireClassOwnershipAdminAuthorization } from "./domain/superAdmin/requireClassOwnershipAdminAuthorization.js?v=1.1.91-student-auth-persistence";
export { requireSuperAdminAccess } from "./domain/superAdmin/requireSuperAdminAccess.js?v=1.1.91-student-auth-persistence";
export {
  allowTeacherLoginAuthorization,
  requireTeacherDashboardAuthorization,
  requireTeacherReviewScopeAuthorization
} from "./domain/teacher/requireTeacherAuthorization.js?v=1.1.91-student-auth-persistence";


