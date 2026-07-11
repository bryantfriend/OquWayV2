// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.220-student-dashboard-timeout-helper";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.220-student-dashboard-timeout-helper";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.220-student-dashboard-timeout-helper";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadTeacherAttendanceIntent } from "./teacher/LoadTeacherAttendanceIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadTeacherStudentDetailIntent } from "./teacher/LoadTeacherStudentDetailIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { SaveTeacherAttendanceIntent } from "./teacher/SaveTeacherAttendanceIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UploadCourseIconIntent } from "./courseEditor/UploadCourseIconIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.220-student-dashboard-timeout-helper";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.220-student-dashboard-timeout-helper";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.220-student-dashboard-timeout-helper";


