// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.119-student-dashboard-debug-safe";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.119-student-dashboard-debug-safe";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.119-student-dashboard-debug-safe";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.119-student-dashboard-debug-safe";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.119-student-dashboard-debug-safe";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.119-student-dashboard-debug-safe";


