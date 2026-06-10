// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.162-modal-stack";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.162-modal-stack";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.162-modal-stack";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.162-modal-stack";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.162-modal-stack";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.162-modal-stack";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.162-modal-stack";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.162-modal-stack";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.162-modal-stack";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.162-modal-stack";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.162-modal-stack";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.162-modal-stack";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.162-modal-stack";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.162-modal-stack";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.162-modal-stack";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.162-modal-stack";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.162-modal-stack";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.162-modal-stack";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.162-modal-stack";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.162-modal-stack";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.162-modal-stack";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.162-modal-stack";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.162-modal-stack";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.162-modal-stack";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.162-modal-stack";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.162-modal-stack";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.162-modal-stack";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.162-modal-stack";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.162-modal-stack";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.162-modal-stack";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.162-modal-stack";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.162-modal-stack";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.162-modal-stack";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.162-modal-stack";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.162-modal-stack";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.162-modal-stack";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.162-modal-stack";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.162-modal-stack";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.162-modal-stack";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.162-modal-stack";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.162-modal-stack";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.162-modal-stack";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.162-modal-stack";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.162-modal-stack";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Emotional Check-Ins
// ----------------------
export { RecordEmotionalCheckInIntent } from "./emotionalCheckIn/RecordEmotionalCheckInIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.162-modal-stack";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.162-modal-stack";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.162-modal-stack";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.162-modal-stack";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.162-modal-stack";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.162-modal-stack";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.162-modal-stack";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.162-modal-stack";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.162-modal-stack";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.162-modal-stack";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.162-modal-stack";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.162-modal-stack";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.162-modal-stack";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.162-modal-stack";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.162-modal-stack";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.162-modal-stack";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.162-modal-stack";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.162-modal-stack";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.162-modal-stack";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.162-modal-stack";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.162-modal-stack";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.162-modal-stack";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.162-modal-stack";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.162-modal-stack";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.162-modal-stack";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.162-modal-stack";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.162-modal-stack";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.162-modal-stack";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.162-modal-stack";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.162-modal-stack";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.162-modal-stack";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.162-modal-stack";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.162-modal-stack";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.162-modal-stack";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.162-modal-stack";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.162-modal-stack";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.162-modal-stack";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.162-modal-stack";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.162-modal-stack";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.162-modal-stack";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.162-modal-stack";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.162-modal-stack";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.162-modal-stack";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.162-modal-stack";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.162-modal-stack";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.162-modal-stack";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.162-modal-stack";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.162-modal-stack";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.162-modal-stack";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.162-modal-stack";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.162-modal-stack";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.162-modal-stack";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.162-modal-stack";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.162-modal-stack";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.162-modal-stack";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.162-modal-stack";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.162-modal-stack";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.162-modal-stack";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.162-modal-stack";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.162-modal-stack";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.162-modal-stack";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.162-modal-stack";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.162-modal-stack";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.162-modal-stack";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.162-modal-stack";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.162-modal-stack";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.162-modal-stack";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.162-modal-stack";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.162-modal-stack";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.162-modal-stack";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.162-modal-stack";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.162-modal-stack";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.162-modal-stack";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.162-modal-stack";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.162-modal-stack";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.162-modal-stack";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.162-modal-stack";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.162-modal-stack";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.162-modal-stack";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.162-modal-stack";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.162-modal-stack";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.162-modal-stack";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.162-modal-stack";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.162-modal-stack";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.162-modal-stack";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.162-modal-stack";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.162-modal-stack";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.162-modal-stack";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.162-modal-stack";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.162-modal-stack";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.162-modal-stack";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.162-modal-stack";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.162-modal-stack";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.162-modal-stack";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.162-modal-stack";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.162-modal-stack";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.162-modal-stack";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.162-modal-stack";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.162-modal-stack";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.162-modal-stack";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.162-modal-stack";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.162-modal-stack";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.162-modal-stack";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.162-modal-stack";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.162-modal-stack";
