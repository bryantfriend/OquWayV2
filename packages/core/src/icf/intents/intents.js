// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.141-user-command-context-data";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.141-user-command-context-data";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.141-user-command-context-data";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.134-archive-course-assignments";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.141-user-command-context-data";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.141-user-command-context-data";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.141-user-command-context-data";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.141-user-command-context-data";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.141-user-command-context-data";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.141-user-command-context-data";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.141-user-command-context-data";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.141-user-command-context-data";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.141-user-command-context-data";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.141-user-command-context-data";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.141-user-command-context-data";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.141-user-command-context-data";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.141-user-command-context-data";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.141-user-command-context-data";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.141-user-command-context-data";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.141-user-command-context-data";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.141-user-command-context-data";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.141-user-command-context-data";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.141-user-command-context-data";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.141-user-command-context-data";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.141-user-command-context-data";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.141-user-command-context-data";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.141-user-command-context-data";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.141-user-command-context-data";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.141-user-command-context-data";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.141-user-command-context-data";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.141-user-command-context-data";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.141-user-command-context-data";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.141-user-command-context-data";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.141-user-command-context-data";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.141-user-command-context-data";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.141-user-command-context-data";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.141-user-command-context-data";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.141-user-command-context-data";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.141-user-command-context-data";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.141-user-command-context-data";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.141-user-command-context-data";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.141-user-command-context-data";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.141-user-command-context-data";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.141-user-command-context-data";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.141-user-command-context-data";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.141-user-command-context-data";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.141-user-command-context-data";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.141-user-command-context-data";

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
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.141-user-command-context-data";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.141-user-command-context-data";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.141-user-command-context-data";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.141-user-command-context-data";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.141-user-command-context-data";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.141-user-command-context-data";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.141-user-command-context-data";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.141-user-command-context-data";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.141-user-command-context-data";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.141-user-command-context-data";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.141-user-command-context-data";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.141-user-command-context-data";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.141-user-command-context-data";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.141-user-command-context-data";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.141-user-command-context-data";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.141-user-command-context-data";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.141-user-command-context-data";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.141-user-command-context-data";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.141-user-command-context-data";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.141-user-command-context-data";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.141-user-command-context-data";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.141-user-command-context-data";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.141-user-command-context-data";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.141-user-command-context-data";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.141-user-command-context-data";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.141-user-command-context-data";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.141-user-command-context-data";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.141-user-command-context-data";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.141-user-command-context-data";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.141-user-command-context-data";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.141-user-command-context-data";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.141-user-command-context-data";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.141-user-command-context-data";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.141-user-command-context-data";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.141-user-command-context-data";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.141-user-command-context-data";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.141-user-command-context-data";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.141-user-command-context-data";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.141-user-command-context-data";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.141-user-command-context-data";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.141-user-command-context-data";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.141-user-command-context-data";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.141-user-command-context-data";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.141-user-command-context-data";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.141-user-command-context-data";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.141-user-command-context-data";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.141-user-command-context-data";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.141-user-command-context-data";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.141-user-command-context-data";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.141-user-command-context-data";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.141-user-command-context-data";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.141-user-command-context-data";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.141-user-command-context-data";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.141-user-command-context-data";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.141-user-command-context-data";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.141-user-command-context-data";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.141-user-command-context-data";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.141-user-command-context-data";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.141-user-command-context-data";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.141-user-command-context-data";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.141-user-command-context-data";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.141-user-command-context-data";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.141-user-command-context-data";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.141-user-command-context-data";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.141-user-command-context-data";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.141-user-command-context-data";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.141-user-command-context-data";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.141-user-command-context-data";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.141-user-command-context-data";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.141-user-command-context-data";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.141-user-command-context-data";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.141-user-command-context-data";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.141-user-command-context-data";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.141-user-command-context-data";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.141-user-command-context-data";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.141-user-command-context-data";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.141-user-command-context-data";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.141-user-command-context-data";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.141-user-command-context-data";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.141-user-command-context-data";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.141-user-command-context-data";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.141-user-command-context-data";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.141-user-command-context-data";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.141-user-command-context-data";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.141-user-command-context-data";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.134-archive-course-assignments";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.134-archive-course-assignments";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.141-user-command-context-data";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.141-user-command-context-data";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.141-user-command-context-data";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.141-user-command-context-data";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.141-user-command-context-data";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.141-user-command-context-data";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.134-archive-course-assignments";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.141-user-command-context-data";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.141-user-command-context-data";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.141-user-command-context-data";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.141-user-command-context-data";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.141-user-command-context-data";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.141-user-command-context-data";
