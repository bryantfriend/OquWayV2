// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.92-student-login-race";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.92-student-login-race";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.92-student-login-race";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.92-student-login-race";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.92-student-login-race";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.92-student-login-race";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.92-student-login-race";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.92-student-login-race";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.92-student-login-race";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.92-student-login-race";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.92-student-login-race";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.92-student-login-race";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.92-student-login-race";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.92-student-login-race";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.92-student-login-race";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.92-student-login-race";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.92-student-login-race";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.92-student-login-race";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.92-student-login-race";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.92-student-login-race";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.92-student-login-race";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.92-student-login-race";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.92-student-login-race";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.92-student-login-race";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.92-student-login-race";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.92-student-login-race";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.92-student-login-race";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.92-student-login-race";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.92-student-login-race";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.92-student-login-race";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.92-student-login-race";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.92-student-login-race";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.92-student-login-race";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.92-student-login-race";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.92-student-login-race";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.92-student-login-race";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.92-student-login-race";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.92-student-login-race";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.92-student-login-race";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.92-student-login-race";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.92-student-login-race";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.92-student-login-race";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.92-student-login-race";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.92-student-login-race";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.92-student-login-race";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.92-student-login-race";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.92-student-login-race";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.92-student-login-race";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.92-student-login-race";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.92-student-login-race";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.92-student-login-race";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.92-student-login-race";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.92-student-login-race";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.92-student-login-race";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.92-student-login-race";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.92-student-login-race";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.92-student-login-race";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.92-student-login-race";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.92-student-login-race";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.92-student-login-race";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.92-student-login-race";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.92-student-login-race";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.92-student-login-race";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.92-student-login-race";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.92-student-login-race";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.92-student-login-race";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.92-student-login-race";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.92-student-login-race";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.92-student-login-race";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.92-student-login-race";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.92-student-login-race";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.92-student-login-race";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.92-student-login-race";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.92-student-login-race";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.92-student-login-race";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.92-student-login-race";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.92-student-login-race";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.92-student-login-race";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.92-student-login-race";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.92-student-login-race";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.92-student-login-race";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.92-student-login-race";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.92-student-login-race";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.92-student-login-race";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.92-student-login-race";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.92-student-login-race";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.92-student-login-race";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.92-student-login-race";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.92-student-login-race";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.92-student-login-race";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.92-student-login-race";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.92-student-login-race";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.92-student-login-race";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.92-student-login-race";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.92-student-login-race";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.92-student-login-race";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.92-student-login-race";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.92-student-login-race";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.92-student-login-race";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.92-student-login-race";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.92-student-login-race";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.92-student-login-race";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.92-student-login-race";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.92-student-login-race";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.92-student-login-race";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.92-student-login-race";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.92-student-login-race";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.92-student-login-race";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.92-student-login-race";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.92-student-login-race";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.92-student-login-race";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.92-student-login-race";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.92-student-login-race";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.92-student-login-race";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.92-student-login-race";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.92-student-login-race";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.92-student-login-race";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.92-student-login-race";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.92-student-login-race";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.92-student-login-race";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.92-student-login-race";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.92-student-login-race";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.92-student-login-race";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.92-student-login-race";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.92-student-login-race";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.92-student-login-race";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.92-student-login-race";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.92-student-login-race";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.92-student-login-race";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.92-student-login-race";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.92-student-login-race";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.92-student-login-race";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.92-student-login-race";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.92-student-login-race";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.92-student-login-race";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.92-student-login-race";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.92-student-login-race";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.92-student-login-race";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.92-student-login-race";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.92-student-login-race";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.92-student-login-race";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.92-student-login-race";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.92-student-login-race";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.92-student-login-race";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.92-student-login-race";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.92-student-login-race";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.92-student-login-race";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.92-student-login-race";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.92-student-login-race";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.92-student-login-race";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.92-student-login-race";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.92-student-login-race";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.92-student-login-race";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.92-student-login-race";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.92-student-login-race";


