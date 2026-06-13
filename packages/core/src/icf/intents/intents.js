// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.185-ready-templates";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.185-ready-templates";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.185-ready-templates";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.185-ready-templates";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.185-ready-templates";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.185-ready-templates";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.185-ready-templates";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.185-ready-templates";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.185-ready-templates";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.185-ready-templates";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.185-ready-templates";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.185-ready-templates";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.185-ready-templates";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.185-ready-templates";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.185-ready-templates";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.185-ready-templates";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.185-ready-templates";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.185-ready-templates";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.185-ready-templates";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.185-ready-templates";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.185-ready-templates";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.185-ready-templates";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.185-ready-templates";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.185-ready-templates";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.185-ready-templates";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.185-ready-templates";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.185-ready-templates";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.185-ready-templates";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.185-ready-templates";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.185-ready-templates";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.185-ready-templates";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.185-ready-templates";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.185-ready-templates";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.185-ready-templates";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.185-ready-templates";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.185-ready-templates";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.185-ready-templates";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.185-ready-templates";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.185-ready-templates";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.185-ready-templates";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.185-ready-templates";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.185-ready-templates";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.185-ready-templates";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.185-ready-templates";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Emotional Check-Ins
// ----------------------
export { RecordEmotionalCheckInIntent } from "./emotionalCheckIn/RecordEmotionalCheckInIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.185-ready-templates";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.185-ready-templates";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.185-ready-templates";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.185-ready-templates";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.185-ready-templates";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.185-ready-templates";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.185-ready-templates";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.185-ready-templates";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.185-ready-templates";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.185-ready-templates";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.185-ready-templates";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.185-ready-templates";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.185-ready-templates";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.185-ready-templates";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.185-ready-templates";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.185-ready-templates";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.185-ready-templates";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.185-ready-templates";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.185-ready-templates";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.185-ready-templates";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.185-ready-templates";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.185-ready-templates";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.185-ready-templates";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.185-ready-templates";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.185-ready-templates";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.185-ready-templates";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.185-ready-templates";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.185-ready-templates";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.185-ready-templates";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.185-ready-templates";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.185-ready-templates";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.185-ready-templates";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.185-ready-templates";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.185-ready-templates";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.185-ready-templates";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.185-ready-templates";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.185-ready-templates";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.185-ready-templates";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.185-ready-templates";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.185-ready-templates";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.185-ready-templates";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.185-ready-templates";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.185-ready-templates";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.185-ready-templates";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.185-ready-templates";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.185-ready-templates";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.185-ready-templates";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.185-ready-templates";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.185-ready-templates";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.185-ready-templates";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.185-ready-templates";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.185-ready-templates";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.185-ready-templates";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.185-ready-templates";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.185-ready-templates";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.185-ready-templates";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.185-ready-templates";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.185-ready-templates";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.185-ready-templates";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.185-ready-templates";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.185-ready-templates";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.185-ready-templates";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.185-ready-templates";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.185-ready-templates";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.185-ready-templates";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.185-ready-templates";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.185-ready-templates";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.185-ready-templates";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.185-ready-templates";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.185-ready-templates";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.185-ready-templates";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.185-ready-templates";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.185-ready-templates";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.185-ready-templates";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.185-ready-templates";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.185-ready-templates";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.185-ready-templates";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.185-ready-templates";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.185-ready-templates";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.185-ready-templates";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.185-ready-templates";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.185-ready-templates";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.185-ready-templates";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.185-ready-templates";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.185-ready-templates";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.185-ready-templates";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.185-ready-templates";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.185-ready-templates";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.185-ready-templates";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.185-ready-templates";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.185-ready-templates";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.185-ready-templates";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.185-ready-templates";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.185-ready-templates";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.185-ready-templates";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.185-ready-templates";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.185-ready-templates";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.185-ready-templates";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.185-ready-templates";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.185-ready-templates";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.185-ready-templates";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.185-ready-templates";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.185-ready-templates";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.185-ready-templates";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.185-ready-templates";
