// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.184-scenario-choice";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.184-scenario-choice";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.184-scenario-choice";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.184-scenario-choice";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.184-scenario-choice";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.184-scenario-choice";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.184-scenario-choice";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.184-scenario-choice";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.184-scenario-choice";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.184-scenario-choice";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.184-scenario-choice";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.184-scenario-choice";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.184-scenario-choice";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.184-scenario-choice";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.184-scenario-choice";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.184-scenario-choice";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.184-scenario-choice";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.184-scenario-choice";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.184-scenario-choice";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.184-scenario-choice";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.184-scenario-choice";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.184-scenario-choice";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.184-scenario-choice";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.184-scenario-choice";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.184-scenario-choice";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.184-scenario-choice";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.184-scenario-choice";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.184-scenario-choice";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.184-scenario-choice";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.184-scenario-choice";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.184-scenario-choice";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.184-scenario-choice";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.184-scenario-choice";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.184-scenario-choice";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.184-scenario-choice";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.184-scenario-choice";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.184-scenario-choice";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.184-scenario-choice";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.184-scenario-choice";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.184-scenario-choice";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.184-scenario-choice";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.184-scenario-choice";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.184-scenario-choice";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Emotional Check-Ins
// ----------------------
export { RecordEmotionalCheckInIntent } from "./emotionalCheckIn/RecordEmotionalCheckInIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.184-scenario-choice";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.184-scenario-choice";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.184-scenario-choice";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.184-scenario-choice";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.184-scenario-choice";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.184-scenario-choice";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.184-scenario-choice";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.184-scenario-choice";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.184-scenario-choice";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.184-scenario-choice";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.184-scenario-choice";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.184-scenario-choice";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.184-scenario-choice";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.184-scenario-choice";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.184-scenario-choice";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.184-scenario-choice";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.184-scenario-choice";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.184-scenario-choice";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.184-scenario-choice";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.184-scenario-choice";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.184-scenario-choice";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.184-scenario-choice";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.184-scenario-choice";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.184-scenario-choice";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.184-scenario-choice";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.184-scenario-choice";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.184-scenario-choice";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.184-scenario-choice";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.184-scenario-choice";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.184-scenario-choice";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.184-scenario-choice";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.184-scenario-choice";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.184-scenario-choice";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.184-scenario-choice";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.184-scenario-choice";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.184-scenario-choice";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.184-scenario-choice";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.184-scenario-choice";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.184-scenario-choice";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.184-scenario-choice";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.184-scenario-choice";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.184-scenario-choice";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.184-scenario-choice";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.184-scenario-choice";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.184-scenario-choice";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.184-scenario-choice";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.184-scenario-choice";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.184-scenario-choice";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.184-scenario-choice";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.184-scenario-choice";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.184-scenario-choice";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.184-scenario-choice";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.184-scenario-choice";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.184-scenario-choice";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.184-scenario-choice";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.184-scenario-choice";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.184-scenario-choice";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.184-scenario-choice";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.184-scenario-choice";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.184-scenario-choice";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.184-scenario-choice";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.184-scenario-choice";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.184-scenario-choice";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.184-scenario-choice";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.184-scenario-choice";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.184-scenario-choice";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.184-scenario-choice";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.184-scenario-choice";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.184-scenario-choice";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.184-scenario-choice";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.184-scenario-choice";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.184-scenario-choice";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.184-scenario-choice";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.184-scenario-choice";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.184-scenario-choice";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.184-scenario-choice";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.184-scenario-choice";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.184-scenario-choice";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.184-scenario-choice";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.184-scenario-choice";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.184-scenario-choice";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.184-scenario-choice";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.184-scenario-choice";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.184-scenario-choice";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.184-scenario-choice";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.184-scenario-choice";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.184-scenario-choice";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.184-scenario-choice";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.184-scenario-choice";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.184-scenario-choice";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.184-scenario-choice";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.184-scenario-choice";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.184-scenario-choice";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.184-scenario-choice";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.184-scenario-choice";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.184-scenario-choice";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.184-scenario-choice";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.184-scenario-choice";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.184-scenario-choice";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.184-scenario-choice";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.184-scenario-choice";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.184-scenario-choice";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.184-scenario-choice";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.184-scenario-choice";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.184-scenario-choice";
