// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.98-student-session-proof";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.98-student-session-proof";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.98-student-session-proof";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.98-student-session-proof";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.98-student-session-proof";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.98-student-session-proof";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.98-student-session-proof";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.98-student-session-proof";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.98-student-session-proof";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.98-student-session-proof";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.98-student-session-proof";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.98-student-session-proof";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.98-student-session-proof";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.98-student-session-proof";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.98-student-session-proof";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.98-student-session-proof";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.98-student-session-proof";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.98-student-session-proof";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.98-student-session-proof";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.98-student-session-proof";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.98-student-session-proof";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.98-student-session-proof";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.98-student-session-proof";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.98-student-session-proof";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.98-student-session-proof";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.98-student-session-proof";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.98-student-session-proof";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.98-student-session-proof";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.98-student-session-proof";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.98-student-session-proof";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.98-student-session-proof";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.98-student-session-proof";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.98-student-session-proof";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.98-student-session-proof";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.98-student-session-proof";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.98-student-session-proof";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.98-student-session-proof";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.98-student-session-proof";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.98-student-session-proof";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.98-student-session-proof";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.98-student-session-proof";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.98-student-session-proof";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.98-student-session-proof";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.98-student-session-proof";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.98-student-session-proof";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.98-student-session-proof";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.98-student-session-proof";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.98-student-session-proof";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.98-student-session-proof";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.98-student-session-proof";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.98-student-session-proof";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.98-student-session-proof";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.98-student-session-proof";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.98-student-session-proof";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.98-student-session-proof";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.98-student-session-proof";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.98-student-session-proof";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.98-student-session-proof";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.98-student-session-proof";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.98-student-session-proof";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.98-student-session-proof";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.98-student-session-proof";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.98-student-session-proof";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.98-student-session-proof";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.98-student-session-proof";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.98-student-session-proof";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.98-student-session-proof";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.98-student-session-proof";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.98-student-session-proof";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.98-student-session-proof";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.98-student-session-proof";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.98-student-session-proof";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.98-student-session-proof";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.98-student-session-proof";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.98-student-session-proof";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.98-student-session-proof";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.98-student-session-proof";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.98-student-session-proof";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.98-student-session-proof";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.98-student-session-proof";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.98-student-session-proof";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.98-student-session-proof";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.98-student-session-proof";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.98-student-session-proof";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.98-student-session-proof";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.98-student-session-proof";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.98-student-session-proof";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.98-student-session-proof";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.98-student-session-proof";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.98-student-session-proof";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.98-student-session-proof";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.98-student-session-proof";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.98-student-session-proof";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.98-student-session-proof";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.98-student-session-proof";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.98-student-session-proof";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.98-student-session-proof";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.98-student-session-proof";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.98-student-session-proof";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.98-student-session-proof";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.98-student-session-proof";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.98-student-session-proof";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.98-student-session-proof";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.98-student-session-proof";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.98-student-session-proof";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.98-student-session-proof";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.98-student-session-proof";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.98-student-session-proof";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.98-student-session-proof";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.98-student-session-proof";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.98-student-session-proof";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.98-student-session-proof";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.98-student-session-proof";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.98-student-session-proof";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.98-student-session-proof";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.98-student-session-proof";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.98-student-session-proof";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.98-student-session-proof";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.98-student-session-proof";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.98-student-session-proof";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.98-student-session-proof";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.98-student-session-proof";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.98-student-session-proof";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.98-student-session-proof";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.98-student-session-proof";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.98-student-session-proof";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.98-student-session-proof";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.98-student-session-proof";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.98-student-session-proof";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.98-student-session-proof";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.98-student-session-proof";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.98-student-session-proof";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.98-student-session-proof";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.98-student-session-proof";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.98-student-session-proof";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.98-student-session-proof";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.98-student-session-proof";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.98-student-session-proof";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.98-student-session-proof";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.98-student-session-proof";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.98-student-session-proof";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.98-student-session-proof";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.98-student-session-proof";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.98-student-session-proof";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.98-student-session-proof";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.98-student-session-proof";


