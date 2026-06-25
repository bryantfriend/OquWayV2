// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.213-emotional-checkin-owner";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.213-emotional-checkin-owner";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.213-emotional-checkin-owner";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.213-emotional-checkin-owner";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.213-emotional-checkin-owner";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.213-emotional-checkin-owner";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.213-emotional-checkin-owner";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.213-emotional-checkin-owner";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.213-emotional-checkin-owner";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.213-emotional-checkin-owner";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.213-emotional-checkin-owner";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.213-emotional-checkin-owner";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.213-emotional-checkin-owner";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.213-emotional-checkin-owner";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.213-emotional-checkin-owner";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.213-emotional-checkin-owner";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.213-emotional-checkin-owner";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.213-emotional-checkin-owner";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.213-emotional-checkin-owner";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.213-emotional-checkin-owner";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.213-emotional-checkin-owner";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.213-emotional-checkin-owner";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.213-emotional-checkin-owner";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Emotional Check-Ins
// ----------------------
export { RecordEmotionalCheckInIntent } from "./emotionalCheckIn/RecordEmotionalCheckInIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.194-lesson-monitor";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.213-emotional-checkin-owner";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.213-emotional-checkin-owner";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.213-emotional-checkin-owner";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.213-emotional-checkin-owner";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.213-emotional-checkin-owner";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.213-emotional-checkin-owner";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.213-emotional-checkin-owner";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.213-emotional-checkin-owner";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.213-emotional-checkin-owner";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.213-emotional-checkin-owner";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.213-emotional-checkin-owner";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.213-emotional-checkin-owner";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.213-emotional-checkin-owner";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.213-emotional-checkin-owner";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.213-emotional-checkin-owner";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.213-emotional-checkin-owner";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.213-emotional-checkin-owner";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.213-emotional-checkin-owner";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.213-emotional-checkin-owner";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.213-emotional-checkin-owner";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.213-emotional-checkin-owner";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.213-emotional-checkin-owner";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.213-emotional-checkin-owner";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.213-emotional-checkin-owner";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.213-emotional-checkin-owner";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.213-emotional-checkin-owner";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.213-emotional-checkin-owner";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.213-emotional-checkin-owner";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.213-emotional-checkin-owner";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.213-emotional-checkin-owner";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.213-emotional-checkin-owner";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.213-emotional-checkin-owner";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.213-emotional-checkin-owner";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.213-emotional-checkin-owner";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.213-emotional-checkin-owner";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.213-emotional-checkin-owner";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.203-step-media-upload";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.213-emotional-checkin-owner";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.213-emotional-checkin-owner";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.213-emotional-checkin-owner";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.213-emotional-checkin-owner";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.213-emotional-checkin-owner";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.213-emotional-checkin-owner";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.213-emotional-checkin-owner";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.213-emotional-checkin-owner";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.213-emotional-checkin-owner";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.213-emotional-checkin-owner";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.213-emotional-checkin-owner";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.213-emotional-checkin-owner";
