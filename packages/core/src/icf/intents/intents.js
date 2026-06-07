// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.111-student-assignment-debug-panel";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.111-student-assignment-debug-panel";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.111-student-assignment-debug-panel";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.111-student-assignment-debug-panel";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.111-student-assignment-debug-panel";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.111-student-assignment-debug-panel";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.111-student-assignment-debug-panel";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.111-student-assignment-debug-panel";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.111-student-assignment-debug-panel";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.111-student-assignment-debug-panel";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.111-student-assignment-debug-panel";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.111-student-assignment-debug-panel";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.111-student-assignment-debug-panel";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.111-student-assignment-debug-panel";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.111-student-assignment-debug-panel";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.111-student-assignment-debug-panel";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.111-student-assignment-debug-panel";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.111-student-assignment-debug-panel";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.111-student-assignment-debug-panel";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.111-student-assignment-debug-panel";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.111-student-assignment-debug-panel";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.111-student-assignment-debug-panel";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.111-student-assignment-debug-panel";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.111-student-assignment-debug-panel";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.111-student-assignment-debug-panel";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.111-student-assignment-debug-panel";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.111-student-assignment-debug-panel";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.111-student-assignment-debug-panel";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.111-student-assignment-debug-panel";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.111-student-assignment-debug-panel";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.111-student-assignment-debug-panel";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.111-student-assignment-debug-panel";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.111-student-assignment-debug-panel";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.111-student-assignment-debug-panel";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.111-student-assignment-debug-panel";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.111-student-assignment-debug-panel";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.111-student-assignment-debug-panel";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.111-student-assignment-debug-panel";


