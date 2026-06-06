// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.101-student-profile-fallback";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.101-student-profile-fallback";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.101-student-profile-fallback";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.101-student-profile-fallback";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.101-student-profile-fallback";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.101-student-profile-fallback";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.101-student-profile-fallback";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.101-student-profile-fallback";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.101-student-profile-fallback";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.101-student-profile-fallback";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.101-student-profile-fallback";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.101-student-profile-fallback";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.101-student-profile-fallback";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.101-student-profile-fallback";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.101-student-profile-fallback";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.101-student-profile-fallback";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.101-student-profile-fallback";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.101-student-profile-fallback";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.101-student-profile-fallback";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.101-student-profile-fallback";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.101-student-profile-fallback";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.101-student-profile-fallback";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.101-student-profile-fallback";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.101-student-profile-fallback";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.101-student-profile-fallback";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.101-student-profile-fallback";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.101-student-profile-fallback";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.101-student-profile-fallback";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.101-student-profile-fallback";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.101-student-profile-fallback";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.101-student-profile-fallback";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.101-student-profile-fallback";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.101-student-profile-fallback";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.101-student-profile-fallback";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.101-student-profile-fallback";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.101-student-profile-fallback";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.101-student-profile-fallback";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.101-student-profile-fallback";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.101-student-profile-fallback";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.101-student-profile-fallback";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.101-student-profile-fallback";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.101-student-profile-fallback";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.101-student-profile-fallback";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.101-student-profile-fallback";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.101-student-profile-fallback";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.101-student-profile-fallback";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.101-student-profile-fallback";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.101-student-profile-fallback";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.101-student-profile-fallback";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.101-student-profile-fallback";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.101-student-profile-fallback";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.101-student-profile-fallback";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.101-student-profile-fallback";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.101-student-profile-fallback";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.101-student-profile-fallback";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.101-student-profile-fallback";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.101-student-profile-fallback";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.101-student-profile-fallback";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.101-student-profile-fallback";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.101-student-profile-fallback";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.101-student-profile-fallback";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.101-student-profile-fallback";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.101-student-profile-fallback";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.101-student-profile-fallback";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.101-student-profile-fallback";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.101-student-profile-fallback";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.101-student-profile-fallback";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.101-student-profile-fallback";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.101-student-profile-fallback";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.101-student-profile-fallback";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.101-student-profile-fallback";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.101-student-profile-fallback";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.101-student-profile-fallback";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.101-student-profile-fallback";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.101-student-profile-fallback";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.101-student-profile-fallback";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.101-student-profile-fallback";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.101-student-profile-fallback";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.101-student-profile-fallback";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.101-student-profile-fallback";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.101-student-profile-fallback";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.101-student-profile-fallback";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.101-student-profile-fallback";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.101-student-profile-fallback";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.101-student-profile-fallback";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.101-student-profile-fallback";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.101-student-profile-fallback";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.101-student-profile-fallback";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.101-student-profile-fallback";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.101-student-profile-fallback";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.101-student-profile-fallback";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.101-student-profile-fallback";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.101-student-profile-fallback";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.101-student-profile-fallback";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.101-student-profile-fallback";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.101-student-profile-fallback";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.101-student-profile-fallback";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.101-student-profile-fallback";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.101-student-profile-fallback";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.101-student-profile-fallback";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.101-student-profile-fallback";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.101-student-profile-fallback";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.101-student-profile-fallback";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.101-student-profile-fallback";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.101-student-profile-fallback";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.101-student-profile-fallback";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.101-student-profile-fallback";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.101-student-profile-fallback";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.101-student-profile-fallback";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.101-student-profile-fallback";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.101-student-profile-fallback";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.101-student-profile-fallback";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.101-student-profile-fallback";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.101-student-profile-fallback";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.101-student-profile-fallback";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.101-student-profile-fallback";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.101-student-profile-fallback";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.101-student-profile-fallback";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.101-student-profile-fallback";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.101-student-profile-fallback";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.101-student-profile-fallback";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.101-student-profile-fallback";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.101-student-profile-fallback";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.101-student-profile-fallback";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.101-student-profile-fallback";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.101-student-profile-fallback";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.101-student-profile-fallback";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.101-student-profile-fallback";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.101-student-profile-fallback";


