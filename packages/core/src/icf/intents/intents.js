// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.106-student-assignment-error-trace";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.106-student-assignment-error-trace";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.106-student-assignment-error-trace";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.106-student-assignment-error-trace";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.106-student-assignment-error-trace";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.106-student-assignment-error-trace";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.106-student-assignment-error-trace";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.106-student-assignment-error-trace";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.106-student-assignment-error-trace";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.106-student-assignment-error-trace";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.106-student-assignment-error-trace";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.106-student-assignment-error-trace";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.106-student-assignment-error-trace";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.106-student-assignment-error-trace";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.106-student-assignment-error-trace";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.106-student-assignment-error-trace";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.106-student-assignment-error-trace";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.106-student-assignment-error-trace";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.106-student-assignment-error-trace";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.106-student-assignment-error-trace";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.106-student-assignment-error-trace";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.106-student-assignment-error-trace";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.106-student-assignment-error-trace";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.106-student-assignment-error-trace";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.106-student-assignment-error-trace";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.106-student-assignment-error-trace";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.106-student-assignment-error-trace";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.106-student-assignment-error-trace";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.106-student-assignment-error-trace";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.106-student-assignment-error-trace";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.106-student-assignment-error-trace";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.106-student-assignment-error-trace";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.106-student-assignment-error-trace";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.106-student-assignment-error-trace";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.106-student-assignment-error-trace";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.106-student-assignment-error-trace";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.106-student-assignment-error-trace";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.106-student-assignment-error-trace";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.106-student-assignment-error-trace";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.106-student-assignment-error-trace";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.106-student-assignment-error-trace";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.106-student-assignment-error-trace";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.106-student-assignment-error-trace";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.106-student-assignment-error-trace";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.106-student-assignment-error-trace";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.106-student-assignment-error-trace";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.106-student-assignment-error-trace";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.106-student-assignment-error-trace";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.106-student-assignment-error-trace";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.106-student-assignment-error-trace";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.106-student-assignment-error-trace";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.106-student-assignment-error-trace";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.106-student-assignment-error-trace";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.106-student-assignment-error-trace";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.106-student-assignment-error-trace";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.106-student-assignment-error-trace";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.106-student-assignment-error-trace";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.106-student-assignment-error-trace";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.106-student-assignment-error-trace";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.106-student-assignment-error-trace";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.106-student-assignment-error-trace";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.106-student-assignment-error-trace";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.106-student-assignment-error-trace";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.106-student-assignment-error-trace";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.106-student-assignment-error-trace";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.106-student-assignment-error-trace";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.106-student-assignment-error-trace";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.106-student-assignment-error-trace";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.106-student-assignment-error-trace";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.106-student-assignment-error-trace";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.106-student-assignment-error-trace";


