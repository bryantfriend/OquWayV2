// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.109-student-assignment-status-fallback";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.109-student-assignment-status-fallback";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.109-student-assignment-status-fallback";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.109-student-assignment-status-fallback";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.109-student-assignment-status-fallback";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.109-student-assignment-status-fallback";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.109-student-assignment-status-fallback";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.109-student-assignment-status-fallback";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.109-student-assignment-status-fallback";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.109-student-assignment-status-fallback";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.109-student-assignment-status-fallback";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.109-student-assignment-status-fallback";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.109-student-assignment-status-fallback";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.109-student-assignment-status-fallback";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.109-student-assignment-status-fallback";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.109-student-assignment-status-fallback";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.109-student-assignment-status-fallback";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.109-student-assignment-status-fallback";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.109-student-assignment-status-fallback";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.109-student-assignment-status-fallback";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.109-student-assignment-status-fallback";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.109-student-assignment-status-fallback";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.109-student-assignment-status-fallback";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.109-student-assignment-status-fallback";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.109-student-assignment-status-fallback";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.109-student-assignment-status-fallback";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.109-student-assignment-status-fallback";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.109-student-assignment-status-fallback";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.109-student-assignment-status-fallback";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.109-student-assignment-status-fallback";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.109-student-assignment-status-fallback";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.109-student-assignment-status-fallback";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.109-student-assignment-status-fallback";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.109-student-assignment-status-fallback";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.109-student-assignment-status-fallback";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.109-student-assignment-status-fallback";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.109-student-assignment-status-fallback";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.109-student-assignment-status-fallback";


