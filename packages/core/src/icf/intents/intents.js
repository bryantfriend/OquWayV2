// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.96-student-session-profile";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.96-student-session-profile";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.96-student-session-profile";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.96-student-session-profile";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.96-student-session-profile";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.96-student-session-profile";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.96-student-session-profile";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.96-student-session-profile";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.96-student-session-profile";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.96-student-session-profile";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.96-student-session-profile";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.96-student-session-profile";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.96-student-session-profile";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.96-student-session-profile";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.96-student-session-profile";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.96-student-session-profile";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.96-student-session-profile";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.96-student-session-profile";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.96-student-session-profile";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.96-student-session-profile";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.96-student-session-profile";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.96-student-session-profile";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.96-student-session-profile";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.96-student-session-profile";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.96-student-session-profile";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.96-student-session-profile";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.96-student-session-profile";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.96-student-session-profile";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.96-student-session-profile";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.96-student-session-profile";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.96-student-session-profile";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.96-student-session-profile";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.96-student-session-profile";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.96-student-session-profile";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.96-student-session-profile";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.96-student-session-profile";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.96-student-session-profile";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.96-student-session-profile";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.96-student-session-profile";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.96-student-session-profile";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.96-student-session-profile";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.96-student-session-profile";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.96-student-session-profile";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.96-student-session-profile";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.96-student-session-profile";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.96-student-session-profile";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.96-student-session-profile";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.96-student-session-profile";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.96-student-session-profile";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.96-student-session-profile";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.96-student-session-profile";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.96-student-session-profile";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.96-student-session-profile";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.96-student-session-profile";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.96-student-session-profile";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.96-student-session-profile";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.96-student-session-profile";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.96-student-session-profile";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.96-student-session-profile";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.96-student-session-profile";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.96-student-session-profile";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.96-student-session-profile";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.96-student-session-profile";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.96-student-session-profile";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.96-student-session-profile";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.96-student-session-profile";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.96-student-session-profile";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.96-student-session-profile";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.96-student-session-profile";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.96-student-session-profile";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.96-student-session-profile";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.96-student-session-profile";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.96-student-session-profile";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.96-student-session-profile";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.96-student-session-profile";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.96-student-session-profile";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.96-student-session-profile";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.96-student-session-profile";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.96-student-session-profile";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.96-student-session-profile";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.96-student-session-profile";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.96-student-session-profile";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.96-student-session-profile";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.96-student-session-profile";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.96-student-session-profile";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.96-student-session-profile";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.96-student-session-profile";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.96-student-session-profile";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.96-student-session-profile";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.96-student-session-profile";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.96-student-session-profile";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.96-student-session-profile";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.96-student-session-profile";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.96-student-session-profile";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.96-student-session-profile";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.96-student-session-profile";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.96-student-session-profile";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.96-student-session-profile";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.96-student-session-profile";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.96-student-session-profile";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.96-student-session-profile";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.96-student-session-profile";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.96-student-session-profile";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.96-student-session-profile";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.96-student-session-profile";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.96-student-session-profile";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.96-student-session-profile";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.96-student-session-profile";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.96-student-session-profile";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.96-student-session-profile";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.96-student-session-profile";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.96-student-session-profile";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.96-student-session-profile";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.96-student-session-profile";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.96-student-session-profile";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.96-student-session-profile";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.96-student-session-profile";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.96-student-session-profile";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.96-student-session-profile";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.96-student-session-profile";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.96-student-session-profile";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.96-student-session-profile";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.96-student-session-profile";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.96-student-session-profile";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.96-student-session-profile";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.96-student-session-profile";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.96-student-session-profile";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.96-student-session-profile";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.96-student-session-profile";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.96-student-session-profile";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.96-student-session-profile";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.96-student-session-profile";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.96-student-session-profile";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.96-student-session-profile";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.96-student-session-profile";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.96-student-session-profile";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.96-student-session-profile";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.96-student-session-profile";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.96-student-session-profile";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.96-student-session-profile";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.96-student-session-profile";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.96-student-session-profile";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.96-student-session-profile";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.96-student-session-profile";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.96-student-session-profile";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.96-student-session-profile";


