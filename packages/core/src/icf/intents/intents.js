// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.112-student-assignment-error-debug";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.112-student-assignment-error-debug";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.112-student-assignment-error-debug";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.112-student-assignment-error-debug";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.112-student-assignment-error-debug";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.112-student-assignment-error-debug";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.112-student-assignment-error-debug";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.112-student-assignment-error-debug";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.112-student-assignment-error-debug";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.112-student-assignment-error-debug";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.112-student-assignment-error-debug";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.112-student-assignment-error-debug";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.112-student-assignment-error-debug";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.112-student-assignment-error-debug";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.112-student-assignment-error-debug";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.112-student-assignment-error-debug";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.112-student-assignment-error-debug";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.112-student-assignment-error-debug";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.112-student-assignment-error-debug";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.112-student-assignment-error-debug";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.112-student-assignment-error-debug";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.112-student-assignment-error-debug";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.112-student-assignment-error-debug";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.112-student-assignment-error-debug";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.112-student-assignment-error-debug";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.112-student-assignment-error-debug";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.112-student-assignment-error-debug";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.112-student-assignment-error-debug";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.112-student-assignment-error-debug";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.112-student-assignment-error-debug";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.112-student-assignment-error-debug";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.112-student-assignment-error-debug";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.112-student-assignment-error-debug";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.112-student-assignment-error-debug";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.112-student-assignment-error-debug";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.112-student-assignment-error-debug";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.112-student-assignment-error-debug";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.112-student-assignment-error-debug";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.112-student-assignment-error-debug";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.112-student-assignment-error-debug";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.112-student-assignment-error-debug";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.112-student-assignment-error-debug";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.112-student-assignment-error-debug";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.112-student-assignment-error-debug";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.112-student-assignment-error-debug";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.112-student-assignment-error-debug";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.112-student-assignment-error-debug";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.112-student-assignment-error-debug";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.112-student-assignment-error-debug";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.112-student-assignment-error-debug";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.112-student-assignment-error-debug";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.112-student-assignment-error-debug";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.112-student-assignment-error-debug";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.112-student-assignment-error-debug";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.112-student-assignment-error-debug";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.112-student-assignment-error-debug";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.112-student-assignment-error-debug";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.112-student-assignment-error-debug";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.112-student-assignment-error-debug";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.112-student-assignment-error-debug";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.112-student-assignment-error-debug";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.112-student-assignment-error-debug";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.112-student-assignment-error-debug";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.112-student-assignment-error-debug";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.112-student-assignment-error-debug";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.112-student-assignment-error-debug";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.112-student-assignment-error-debug";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.112-student-assignment-error-debug";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.112-student-assignment-error-debug";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.112-student-assignment-error-debug";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.112-student-assignment-error-debug";


