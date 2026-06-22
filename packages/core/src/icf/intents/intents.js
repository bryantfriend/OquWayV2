// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.207-emotional-check-in-save";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.207-emotional-check-in-save";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.207-emotional-check-in-save";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.207-emotional-check-in-save";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.207-emotional-check-in-save";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.207-emotional-check-in-save";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.207-emotional-check-in-save";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.207-emotional-check-in-save";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.207-emotional-check-in-save";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.207-emotional-check-in-save";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.207-emotional-check-in-save";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.207-emotional-check-in-save";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.207-emotional-check-in-save";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.207-emotional-check-in-save";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.207-emotional-check-in-save";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.207-emotional-check-in-save";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.207-emotional-check-in-save";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.207-emotional-check-in-save";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.207-emotional-check-in-save";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.207-emotional-check-in-save";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.207-emotional-check-in-save";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.207-emotional-check-in-save";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.207-emotional-check-in-save";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.207-emotional-check-in-save";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.207-emotional-check-in-save";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.207-emotional-check-in-save";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Emotional Check-Ins
// ----------------------
export { RecordEmotionalCheckInIntent } from "./emotionalCheckIn/RecordEmotionalCheckInIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.194-lesson-monitor";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.207-emotional-check-in-save";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.207-emotional-check-in-save";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.207-emotional-check-in-save";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.207-emotional-check-in-save";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.207-emotional-check-in-save";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.207-emotional-check-in-save";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.207-emotional-check-in-save";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.207-emotional-check-in-save";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.207-emotional-check-in-save";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.207-emotional-check-in-save";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.207-emotional-check-in-save";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.207-emotional-check-in-save";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.207-emotional-check-in-save";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.207-emotional-check-in-save";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.207-emotional-check-in-save";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.207-emotional-check-in-save";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.207-emotional-check-in-save";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.207-emotional-check-in-save";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.207-emotional-check-in-save";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.207-emotional-check-in-save";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.207-emotional-check-in-save";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.207-emotional-check-in-save";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.207-emotional-check-in-save";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.207-emotional-check-in-save";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.207-emotional-check-in-save";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.207-emotional-check-in-save";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.207-emotional-check-in-save";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.207-emotional-check-in-save";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.207-emotional-check-in-save";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.207-emotional-check-in-save";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.207-emotional-check-in-save";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.207-emotional-check-in-save";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.207-emotional-check-in-save";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.207-emotional-check-in-save";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.207-emotional-check-in-save";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.207-emotional-check-in-save";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.207-emotional-check-in-save";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.207-emotional-check-in-save";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.207-emotional-check-in-save";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.207-emotional-check-in-save";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.207-emotional-check-in-save";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.207-emotional-check-in-save";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.207-emotional-check-in-save";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.207-emotional-check-in-save";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.207-emotional-check-in-save";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.207-emotional-check-in-save";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.207-emotional-check-in-save";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.207-emotional-check-in-save";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.207-emotional-check-in-save";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.207-emotional-check-in-save";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.207-emotional-check-in-save";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.207-emotional-check-in-save";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.207-emotional-check-in-save";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.207-emotional-check-in-save";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.203-step-media-upload";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.207-emotional-check-in-save";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.207-emotional-check-in-save";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.207-emotional-check-in-save";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.207-emotional-check-in-save";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.209-open-integrations";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.209-open-integrations";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.209-open-integrations";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.207-emotional-check-in-save";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.207-emotional-check-in-save";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.207-emotional-check-in-save";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.207-emotional-check-in-save";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.207-emotional-check-in-save";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.209-open-integrations";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.207-emotional-check-in-save";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.207-emotional-check-in-save";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.207-emotional-check-in-save";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.207-emotional-check-in-save";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.207-emotional-check-in-save";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.207-emotional-check-in-save";
