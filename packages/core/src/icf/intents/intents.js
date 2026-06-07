// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.121-student-dashboard-open-clean";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.121-student-dashboard-open-clean";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.121-student-dashboard-open-clean";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.121-student-dashboard-open-clean";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.121-student-dashboard-open-clean";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.121-student-dashboard-open-clean";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.121-student-dashboard-open-clean";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.121-student-dashboard-open-clean";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.121-student-dashboard-open-clean";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.121-student-dashboard-open-clean";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.121-student-dashboard-open-clean";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.121-student-dashboard-open-clean";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.121-student-dashboard-open-clean";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.121-student-dashboard-open-clean";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.121-student-dashboard-open-clean";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.121-student-dashboard-open-clean";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.121-student-dashboard-open-clean";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.121-student-dashboard-open-clean";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.121-student-dashboard-open-clean";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.121-student-dashboard-open-clean";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.121-student-dashboard-open-clean";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.121-student-dashboard-open-clean";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.121-student-dashboard-open-clean";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.121-student-dashboard-open-clean";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.121-student-dashboard-open-clean";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.121-student-dashboard-open-clean";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.121-student-dashboard-open-clean";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.121-student-dashboard-open-clean";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.121-student-dashboard-open-clean";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.121-student-dashboard-open-clean";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.121-student-dashboard-open-clean";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.121-student-dashboard-open-clean";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.121-student-dashboard-open-clean";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.121-student-dashboard-open-clean";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.121-student-dashboard-open-clean";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.121-student-dashboard-open-clean";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.121-student-dashboard-open-clean";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.121-student-dashboard-open-clean";


