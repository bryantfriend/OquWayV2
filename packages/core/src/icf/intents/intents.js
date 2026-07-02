// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.218-dashboard-calm-teacher-functional";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.218-dashboard-calm-teacher-functional";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.218-dashboard-calm-teacher-functional";


