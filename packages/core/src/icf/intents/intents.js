// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.138-course-overview-title";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.138-course-overview-title";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.138-course-overview-title";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.134-archive-course-assignments";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.138-course-overview-title";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.138-course-overview-title";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.138-course-overview-title";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.138-course-overview-title";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.138-course-overview-title";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.138-course-overview-title";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.138-course-overview-title";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.138-course-overview-title";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.138-course-overview-title";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.138-course-overview-title";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.138-course-overview-title";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.138-course-overview-title";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.138-course-overview-title";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.138-course-overview-title";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.138-course-overview-title";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.138-course-overview-title";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.138-course-overview-title";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.138-course-overview-title";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.138-course-overview-title";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.138-course-overview-title";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.138-course-overview-title";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.138-course-overview-title";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.138-course-overview-title";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.138-course-overview-title";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.138-course-overview-title";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.138-course-overview-title";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.138-course-overview-title";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.138-course-overview-title";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.138-course-overview-title";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.138-course-overview-title";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.138-course-overview-title";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.138-course-overview-title";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.138-course-overview-title";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.138-course-overview-title";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.138-course-overview-title";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.138-course-overview-title";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.138-course-overview-title";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.138-course-overview-title";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.138-course-overview-title";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.138-course-overview-title";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.138-course-overview-title";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.138-course-overview-title";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.138-course-overview-title";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.138-course-overview-title";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.129-teacher-query-noise";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.129-teacher-query-noise";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.138-course-overview-title";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.138-course-overview-title";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.138-course-overview-title";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.138-course-overview-title";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.138-course-overview-title";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.138-course-overview-title";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.138-course-overview-title";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.138-course-overview-title";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.138-course-overview-title";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.138-course-overview-title";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.138-course-overview-title";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.138-course-overview-title";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.138-course-overview-title";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.138-course-overview-title";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.138-course-overview-title";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.138-course-overview-title";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.138-course-overview-title";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.138-course-overview-title";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.138-course-overview-title";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.138-course-overview-title";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.138-course-overview-title";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.138-course-overview-title";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.138-course-overview-title";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.138-course-overview-title";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.138-course-overview-title";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.138-course-overview-title";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.138-course-overview-title";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.138-course-overview-title";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.138-course-overview-title";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.138-course-overview-title";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.138-course-overview-title";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.138-course-overview-title";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.138-course-overview-title";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.138-course-overview-title";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.138-course-overview-title";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.138-course-overview-title";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.138-course-overview-title";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.138-course-overview-title";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.138-course-overview-title";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.138-course-overview-title";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.138-course-overview-title";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.138-course-overview-title";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.138-course-overview-title";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.138-course-overview-title";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.138-course-overview-title";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.138-course-overview-title";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.138-course-overview-title";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.138-course-overview-title";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.138-course-overview-title";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.138-course-overview-title";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.138-course-overview-title";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.138-course-overview-title";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.138-course-overview-title";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.138-course-overview-title";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.138-course-overview-title";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.138-course-overview-title";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.138-course-overview-title";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.138-course-overview-title";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.138-course-overview-title";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.138-course-overview-title";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.138-course-overview-title";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.138-course-overview-title";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.138-course-overview-title";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.138-course-overview-title";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.138-course-overview-title";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.138-course-overview-title";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.138-course-overview-title";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.138-course-overview-title";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.138-course-overview-title";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.138-course-overview-title";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.138-course-overview-title";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.138-course-overview-title";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.138-course-overview-title";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.138-course-overview-title";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.138-course-overview-title";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.138-course-overview-title";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.138-course-overview-title";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.138-course-overview-title";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.138-course-overview-title";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.138-course-overview-title";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.138-course-overview-title";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.138-course-overview-title";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.138-course-overview-title";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.138-course-overview-title";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.138-course-overview-title";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.134-archive-course-assignments";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.134-archive-course-assignments";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.138-course-overview-title";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.138-course-overview-title";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.138-course-overview-title";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.138-course-overview-title";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.138-course-overview-title";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.138-course-overview-title";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.134-archive-course-assignments";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.138-course-overview-title";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.138-course-overview-title";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.138-course-overview-title";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.138-course-overview-title";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.138-course-overview-title";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.138-course-overview-title";
