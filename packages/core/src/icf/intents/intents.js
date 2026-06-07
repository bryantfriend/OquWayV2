// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.118-fruit-login-student-identity";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.118-fruit-login-student-identity";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.118-fruit-login-student-identity";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.118-fruit-login-student-identity";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.118-fruit-login-student-identity";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.118-fruit-login-student-identity";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.118-fruit-login-student-identity";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.118-fruit-login-student-identity";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.118-fruit-login-student-identity";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.118-fruit-login-student-identity";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.118-fruit-login-student-identity";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.118-fruit-login-student-identity";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.118-fruit-login-student-identity";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.118-fruit-login-student-identity";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.118-fruit-login-student-identity";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.118-fruit-login-student-identity";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.118-fruit-login-student-identity";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.118-fruit-login-student-identity";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.118-fruit-login-student-identity";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.118-fruit-login-student-identity";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.118-fruit-login-student-identity";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.118-fruit-login-student-identity";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.118-fruit-login-student-identity";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.118-fruit-login-student-identity";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.118-fruit-login-student-identity";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.118-fruit-login-student-identity";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.118-fruit-login-student-identity";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.118-fruit-login-student-identity";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.118-fruit-login-student-identity";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.118-fruit-login-student-identity";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.118-fruit-login-student-identity";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.118-fruit-login-student-identity";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.118-fruit-login-student-identity";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.118-fruit-login-student-identity";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.118-fruit-login-student-identity";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.118-fruit-login-student-identity";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.118-fruit-login-student-identity";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.118-fruit-login-student-identity";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.118-fruit-login-student-identity";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.118-fruit-login-student-identity";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.118-fruit-login-student-identity";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.118-fruit-login-student-identity";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.118-fruit-login-student-identity";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.118-fruit-login-student-identity";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.118-fruit-login-student-identity";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.118-fruit-login-student-identity";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.118-fruit-login-student-identity";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.118-fruit-login-student-identity";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.118-fruit-login-student-identity";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.118-fruit-login-student-identity";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.118-fruit-login-student-identity";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.118-fruit-login-student-identity";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.118-fruit-login-student-identity";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.118-fruit-login-student-identity";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.118-fruit-login-student-identity";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.118-fruit-login-student-identity";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.118-fruit-login-student-identity";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.118-fruit-login-student-identity";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.118-fruit-login-student-identity";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.118-fruit-login-student-identity";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.118-fruit-login-student-identity";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.118-fruit-login-student-identity";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.118-fruit-login-student-identity";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.118-fruit-login-student-identity";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.118-fruit-login-student-identity";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.118-fruit-login-student-identity";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.118-fruit-login-student-identity";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.118-fruit-login-student-identity";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.118-fruit-login-student-identity";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.118-fruit-login-student-identity";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.118-fruit-login-student-identity";


