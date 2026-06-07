// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.116-student-token-ready";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.116-student-token-ready";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.116-student-token-ready";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.116-student-token-ready";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.116-student-token-ready";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.116-student-token-ready";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.116-student-token-ready";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.116-student-token-ready";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.116-student-token-ready";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.116-student-token-ready";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.116-student-token-ready";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.116-student-token-ready";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.116-student-token-ready";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.116-student-token-ready";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.116-student-token-ready";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.116-student-token-ready";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.116-student-token-ready";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.116-student-token-ready";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.116-student-token-ready";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.116-student-token-ready";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.116-student-token-ready";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.116-student-token-ready";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.116-student-token-ready";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.116-student-token-ready";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.116-student-token-ready";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.116-student-token-ready";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.116-student-token-ready";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.116-student-token-ready";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.116-student-token-ready";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.116-student-token-ready";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.116-student-token-ready";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.116-student-token-ready";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.116-student-token-ready";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.116-student-token-ready";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.116-student-token-ready";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.116-student-token-ready";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.116-student-token-ready";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.116-student-token-ready";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.116-student-token-ready";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.116-student-token-ready";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.116-student-token-ready";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.116-student-token-ready";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.116-student-token-ready";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.116-student-token-ready";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.116-student-token-ready";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.116-student-token-ready";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.116-student-token-ready";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.116-student-token-ready";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.116-student-token-ready";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.116-student-token-ready";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.116-student-token-ready";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.116-student-token-ready";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.116-student-token-ready";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.116-student-token-ready";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.116-student-token-ready";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.116-student-token-ready";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.116-student-token-ready";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.116-student-token-ready";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.116-student-token-ready";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.116-student-token-ready";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.116-student-token-ready";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.116-student-token-ready";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.116-student-token-ready";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.116-student-token-ready";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.116-student-token-ready";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.116-student-token-ready";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.116-student-token-ready";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.116-student-token-ready";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.116-student-token-ready";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.116-student-token-ready";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.116-student-token-ready";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.116-student-token-ready";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.116-student-token-ready";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.116-student-token-ready";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.116-student-token-ready";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.116-student-token-ready";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.116-student-token-ready";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.116-student-token-ready";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.116-student-token-ready";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.116-student-token-ready";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.116-student-token-ready";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.116-student-token-ready";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.116-student-token-ready";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.116-student-token-ready";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.116-student-token-ready";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.116-student-token-ready";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.116-student-token-ready";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.116-student-token-ready";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.116-student-token-ready";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.116-student-token-ready";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.116-student-token-ready";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.116-student-token-ready";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.116-student-token-ready";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.116-student-token-ready";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.116-student-token-ready";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.116-student-token-ready";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.116-student-token-ready";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.116-student-token-ready";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.116-student-token-ready";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.116-student-token-ready";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.116-student-token-ready";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.116-student-token-ready";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.116-student-token-ready";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.116-student-token-ready";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.116-student-token-ready";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.116-student-token-ready";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.116-student-token-ready";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.116-student-token-ready";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.116-student-token-ready";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.116-student-token-ready";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.116-student-token-ready";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.116-student-token-ready";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.116-student-token-ready";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.116-student-token-ready";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.116-student-token-ready";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.116-student-token-ready";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.116-student-token-ready";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.116-student-token-ready";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.116-student-token-ready";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.116-student-token-ready";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.116-student-token-ready";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.116-student-token-ready";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.116-student-token-ready";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.116-student-token-ready";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.116-student-token-ready";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.116-student-token-ready";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.116-student-token-ready";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.116-student-token-ready";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.116-student-token-ready";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.116-student-token-ready";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.116-student-token-ready";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.116-student-token-ready";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.116-student-token-ready";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.116-student-token-ready";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.116-student-token-ready";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.116-student-token-ready";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.116-student-token-ready";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.116-student-token-ready";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.116-student-token-ready";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.116-student-token-ready";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.116-student-token-ready";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.116-student-token-ready";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.116-student-token-ready";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.116-student-token-ready";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.116-student-token-ready";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.116-student-token-ready";


