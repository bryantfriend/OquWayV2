// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.107-student-firebase-auth-chain";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.107-student-firebase-auth-chain";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.107-student-firebase-auth-chain";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.107-student-firebase-auth-chain";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.107-student-firebase-auth-chain";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.107-student-firebase-auth-chain";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.107-student-firebase-auth-chain";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.107-student-firebase-auth-chain";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.107-student-firebase-auth-chain";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.107-student-firebase-auth-chain";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.107-student-firebase-auth-chain";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.107-student-firebase-auth-chain";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.107-student-firebase-auth-chain";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.107-student-firebase-auth-chain";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.107-student-firebase-auth-chain";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.107-student-firebase-auth-chain";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.107-student-firebase-auth-chain";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.107-student-firebase-auth-chain";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.107-student-firebase-auth-chain";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.107-student-firebase-auth-chain";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.107-student-firebase-auth-chain";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.107-student-firebase-auth-chain";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.107-student-firebase-auth-chain";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.107-student-firebase-auth-chain";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.107-student-firebase-auth-chain";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.107-student-firebase-auth-chain";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.107-student-firebase-auth-chain";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.107-student-firebase-auth-chain";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.107-student-firebase-auth-chain";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.107-student-firebase-auth-chain";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.107-student-firebase-auth-chain";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.107-student-firebase-auth-chain";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.107-student-firebase-auth-chain";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.107-student-firebase-auth-chain";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.107-student-firebase-auth-chain";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.107-student-firebase-auth-chain";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.107-student-firebase-auth-chain";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.107-student-firebase-auth-chain";


