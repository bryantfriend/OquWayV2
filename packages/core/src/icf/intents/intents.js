// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.89-student-fruit-session";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.89-student-fruit-session";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.89-student-fruit-session";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.89-student-fruit-session";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.89-student-fruit-session";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.89-student-fruit-session";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.89-student-fruit-session";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.89-student-fruit-session";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.89-student-fruit-session";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.89-student-fruit-session";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.89-student-fruit-session";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.89-student-fruit-session";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.89-student-fruit-session";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.89-student-fruit-session";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.89-student-fruit-session";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.89-student-fruit-session";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.89-student-fruit-session";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.89-student-fruit-session";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.89-student-fruit-session";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.89-student-fruit-session";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.89-student-fruit-session";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.89-student-fruit-session";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.89-student-fruit-session";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.89-student-fruit-session";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.89-student-fruit-session";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.89-student-fruit-session";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.89-student-fruit-session";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.89-student-fruit-session";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.89-student-fruit-session";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.89-student-fruit-session";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.89-student-fruit-session";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.89-student-fruit-session";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.89-student-fruit-session";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.89-student-fruit-session";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.89-student-fruit-session";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.89-student-fruit-session";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.89-student-fruit-session";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.89-student-fruit-session";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.89-student-fruit-session";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.89-student-fruit-session";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.89-student-fruit-session";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.89-student-fruit-session";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.89-student-fruit-session";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.89-student-fruit-session";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.89-student-fruit-session";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.89-student-fruit-session";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.89-student-fruit-session";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.89-student-fruit-session";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.89-student-fruit-session";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.89-student-fruit-session";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.89-student-fruit-session";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.89-student-fruit-session";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.89-student-fruit-session";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.89-student-fruit-session";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.89-student-fruit-session";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.89-student-fruit-session";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.89-student-fruit-session";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.89-student-fruit-session";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.89-student-fruit-session";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.89-student-fruit-session";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.89-student-fruit-session";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.89-student-fruit-session";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.89-student-fruit-session";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.89-student-fruit-session";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.89-student-fruit-session";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.89-student-fruit-session";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.89-student-fruit-session";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.89-student-fruit-session";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.89-student-fruit-session";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.89-student-fruit-session";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.89-student-fruit-session";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.89-student-fruit-session";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.89-student-fruit-session";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.89-student-fruit-session";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.89-student-fruit-session";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.89-student-fruit-session";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.89-student-fruit-session";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.89-student-fruit-session";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.89-student-fruit-session";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.89-student-fruit-session";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.89-student-fruit-session";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.89-student-fruit-session";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.89-student-fruit-session";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.89-student-fruit-session";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.89-student-fruit-session";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.89-student-fruit-session";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.89-student-fruit-session";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.89-student-fruit-session";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.89-student-fruit-session";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.89-student-fruit-session";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.89-student-fruit-session";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.89-student-fruit-session";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.89-student-fruit-session";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.89-student-fruit-session";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.89-student-fruit-session";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.89-student-fruit-session";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.89-student-fruit-session";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.89-student-fruit-session";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.89-student-fruit-session";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.89-student-fruit-session";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.89-student-fruit-session";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.89-student-fruit-session";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.89-student-fruit-session";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.89-student-fruit-session";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.89-student-fruit-session";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.89-student-fruit-session";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.89-student-fruit-session";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.89-student-fruit-session";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.89-student-fruit-session";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.89-student-fruit-session";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.89-student-fruit-session";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.89-student-fruit-session";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.89-student-fruit-session";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.89-student-fruit-session";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.89-student-fruit-session";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.89-student-fruit-session";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.89-student-fruit-session";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.89-student-fruit-session";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.89-student-fruit-session";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.89-student-fruit-session";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.89-student-fruit-session";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.89-student-fruit-session";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.89-student-fruit-session";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.89-student-fruit-session";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.89-student-fruit-session";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.89-student-fruit-session";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.89-student-fruit-session";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.89-student-fruit-session";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.89-student-fruit-session";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.89-student-fruit-session";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.89-student-fruit-session";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.89-student-fruit-session";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.89-student-fruit-session";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.89-student-fruit-session";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.89-student-fruit-session";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.89-student-fruit-session";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.89-student-fruit-session";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.89-student-fruit-session";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.89-student-fruit-session";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.89-student-fruit-session";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.89-student-fruit-session";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.89-student-fruit-session";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.89-student-fruit-session";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.89-student-fruit-session";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.89-student-fruit-session";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.89-student-fruit-session";


