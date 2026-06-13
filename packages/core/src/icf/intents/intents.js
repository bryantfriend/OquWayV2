// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.179-teacher-analytics-dashboard";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.179-teacher-analytics-dashboard";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.179-teacher-analytics-dashboard";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Emotional Check-Ins
// ----------------------
export { RecordEmotionalCheckInIntent } from "./emotionalCheckIn/RecordEmotionalCheckInIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.179-teacher-analytics-dashboard";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.179-teacher-analytics-dashboard";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.179-teacher-analytics-dashboard";
