export { authorizeDemoActor } from "./core/authorizeDemoActor.js?v=1.1.99-student-profile-gate";
export { catalogRequireCourseCreatorAuthorization } from "./domain/catalog/catalogRequireCourseCreatorAuthorization.js?v=1.1.99-student-profile-gate";
export { requireCourseCreatorOwnershipAuthorization } from "./domain/catalogCourse/ownershipAuthorizers.js?v=1.1.99-student-profile-gate";
export { preventModificationIfPublishedAuthorization } from "./domain/catalogCourse/preventDeleteIfInUseAuthorization.js?v=1.1.99-student-profile-gate";
export { preventDeleteIfInUseAuthorization } from "./domain/catalogCourse/preventDeleteIfInUseAuthorization.js?v=1.1.99-student-profile-gate";
export { requireCourseAssignmentAdminAuthorization } from "./domain/courseAssignment/requireCourseAssignmentAdminAuthorization.js?v=1.1.99-student-profile-gate";
export { requireCourseAssignmentOwnershipAuthorization } from "./domain/courseAssignment/requireCourseAssignmentOwnershipAuthorization.js?v=1.1.99-student-profile-gate";
export { requireCourseAssignmentOwnershipReadAuthorization } from "./domain/courseAssignment/requireCourseAssignmentOwnershipReadAuthorization.js?v=1.1.99-student-profile-gate";
export {
  requireExternalTaskReviewerAuthorization,
  requireExternalTaskStudentAuthorization
} from "./domain/externalTask/requireExternalTaskAuthorization.js?v=1.1.99-student-profile-gate";
export { requireCourseCreatorAuthorization } from "./domain/catalogCourse/requireCourseCreatorAuthorization.js?v=1.1.99-student-profile-gate";
export { requireLocationAdminAuthorization, allowPublicLocationRead } from "./domain/location/requireLocationAdminAuthorization.js?v=1.1.99-student-profile-gate";
export { requirePlatformAdminAuthorization } from "./domain/catalogCourse/requirePlatformAdminAuthorization.js?v=1.1.99-student-profile-gate";
export { requireSuperAdminAuthorization } from "./domain/catalogCourse/requireSuperAdminAuthorization.js?v=1.1.99-student-profile-gate";
export { requireStudentAuthorization } from "./domain/student/requireStudentAuthorization.js?v=1.1.99-student-profile-gate";
export { allowStudentLoginAuthorization } from "./domain/studentLogin/allowStudentLoginAuthorization.js?v=1.1.99-student-profile-gate";
export { requireClassOwnershipAdminAuthorization } from "./domain/superAdmin/requireClassOwnershipAdminAuthorization.js?v=1.1.99-student-profile-gate";
export { requireSuperAdminAccess } from "./domain/superAdmin/requireSuperAdminAccess.js?v=1.1.99-student-profile-gate";
export {
  allowTeacherLoginAuthorization,
  requireTeacherDashboardAuthorization,
  requireTeacherReviewScopeAuthorization
} from "./domain/teacher/requireTeacherAuthorization.js?v=1.1.99-student-profile-gate";


