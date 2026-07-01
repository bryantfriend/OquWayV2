// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.82-shared-command-center-shell";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.82-shared-command-center-shell";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.82-shared-command-center-shell";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.82-shared-command-center-shell";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.82-shared-command-center-shell";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.82-shared-command-center-shell";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.82-shared-command-center-shell";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.82-shared-command-center-shell";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.82-shared-command-center-shell";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.82-shared-command-center-shell";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.82-shared-command-center-shell";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.82-shared-command-center-shell";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.82-shared-command-center-shell";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.82-shared-command-center-shell";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.82-shared-command-center-shell";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.82-shared-command-center-shell";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.82-shared-command-center-shell";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.82-shared-command-center-shell";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.82-shared-command-center-shell";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.82-shared-command-center-shell";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.82-shared-command-center-shell";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.82-shared-command-center-shell";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.82-shared-command-center-shell";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.82-shared-command-center-shell";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.82-shared-command-center-shell";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.82-shared-command-center-shell";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.82-shared-command-center-shell";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.82-shared-command-center-shell";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.82-shared-command-center-shell";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.82-shared-command-center-shell";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.82-shared-command-center-shell";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.82-shared-command-center-shell";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.82-shared-command-center-shell";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.82-shared-command-center-shell";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.82-shared-command-center-shell";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.82-shared-command-center-shell";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.82-shared-command-center-shell";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.82-shared-command-center-shell";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.82-shared-command-center-shell";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.82-shared-command-center-shell";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.82-shared-command-center-shell";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.82-shared-command-center-shell";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.82-shared-command-center-shell";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.82-shared-command-center-shell";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.82-shared-command-center-shell";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.82-shared-command-center-shell";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.82-shared-command-center-shell";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.82-shared-command-center-shell";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.82-shared-command-center-shell";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.82-shared-command-center-shell";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.82-shared-command-center-shell";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.82-shared-command-center-shell";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.82-shared-command-center-shell";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.82-shared-command-center-shell";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.82-shared-command-center-shell";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.82-shared-command-center-shell";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.82-shared-command-center-shell";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.82-shared-command-center-shell";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.82-shared-command-center-shell";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.82-shared-command-center-shell";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.82-shared-command-center-shell";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.82-shared-command-center-shell";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.82-shared-command-center-shell";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.82-shared-command-center-shell";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.82-shared-command-center-shell";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.82-shared-command-center-shell";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.82-shared-command-center-shell";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.82-shared-command-center-shell";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.82-shared-command-center-shell";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.82-shared-command-center-shell";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.82-shared-command-center-shell";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.82-shared-command-center-shell";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.82-shared-command-center-shell";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.82-shared-command-center-shell";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.82-shared-command-center-shell";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.82-shared-command-center-shell";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.82-shared-command-center-shell";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.82-shared-command-center-shell";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.82-shared-command-center-shell";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.82-shared-command-center-shell";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.82-shared-command-center-shell";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.82-shared-command-center-shell";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.82-shared-command-center-shell";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.82-shared-command-center-shell";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.83-student-assignment-load";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.83-student-assignment-load";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.83-student-assignment-load";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.82-shared-command-center-shell";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.82-shared-command-center-shell";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.82-shared-command-center-shell";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.82-shared-command-center-shell";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.82-shared-command-center-shell";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.83-student-assignment-load";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.82-shared-command-center-shell";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.82-shared-command-center-shell";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.82-shared-command-center-shell";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.82-shared-command-center-shell";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.82-shared-command-center-shell";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.82-shared-command-center-shell";


