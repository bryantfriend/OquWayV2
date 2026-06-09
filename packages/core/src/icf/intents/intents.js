// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.139-user-command-context";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.139-user-command-context";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.139-user-command-context";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.134-archive-course-assignments";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.139-user-command-context";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.139-user-command-context";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.139-user-command-context";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.139-user-command-context";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.139-user-command-context";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.139-user-command-context";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.139-user-command-context";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.139-user-command-context";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.139-user-command-context";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.139-user-command-context";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.139-user-command-context";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.139-user-command-context";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.139-user-command-context";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.139-user-command-context";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.139-user-command-context";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.139-user-command-context";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.139-user-command-context";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.139-user-command-context";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.139-user-command-context";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.139-user-command-context";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.139-user-command-context";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.139-user-command-context";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.139-user-command-context";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.139-user-command-context";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.139-user-command-context";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.139-user-command-context";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.139-user-command-context";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.139-user-command-context";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.139-user-command-context";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.139-user-command-context";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.139-user-command-context";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.139-user-command-context";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.139-user-command-context";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.139-user-command-context";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.139-user-command-context";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.139-user-command-context";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.139-user-command-context";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.139-user-command-context";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.139-user-command-context";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.139-user-command-context";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.139-user-command-context";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.139-user-command-context";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.139-user-command-context";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.139-user-command-context";

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
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.139-user-command-context";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.139-user-command-context";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.139-user-command-context";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.139-user-command-context";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.139-user-command-context";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.139-user-command-context";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.139-user-command-context";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.139-user-command-context";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.139-user-command-context";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.139-user-command-context";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.139-user-command-context";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.139-user-command-context";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.139-user-command-context";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.139-user-command-context";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.139-user-command-context";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.139-user-command-context";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.139-user-command-context";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.139-user-command-context";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.139-user-command-context";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.139-user-command-context";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.139-user-command-context";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.139-user-command-context";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.139-user-command-context";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.139-user-command-context";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.139-user-command-context";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.139-user-command-context";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.139-user-command-context";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.139-user-command-context";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.139-user-command-context";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.139-user-command-context";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.139-user-command-context";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.139-user-command-context";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.139-user-command-context";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.139-user-command-context";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.139-user-command-context";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.139-user-command-context";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.139-user-command-context";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.139-user-command-context";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.139-user-command-context";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.139-user-command-context";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.139-user-command-context";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.139-user-command-context";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.139-user-command-context";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.139-user-command-context";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.139-user-command-context";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.139-user-command-context";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.139-user-command-context";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.139-user-command-context";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.139-user-command-context";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.139-user-command-context";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.139-user-command-context";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.139-user-command-context";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.139-user-command-context";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.139-user-command-context";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.139-user-command-context";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.139-user-command-context";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.139-user-command-context";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.139-user-command-context";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.139-user-command-context";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.139-user-command-context";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.139-user-command-context";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.139-user-command-context";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.139-user-command-context";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.139-user-command-context";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.139-user-command-context";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.139-user-command-context";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.139-user-command-context";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.139-user-command-context";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.139-user-command-context";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.139-user-command-context";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.139-user-command-context";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.139-user-command-context";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.139-user-command-context";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.139-user-command-context";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.139-user-command-context";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.139-user-command-context";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.139-user-command-context";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.139-user-command-context";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.139-user-command-context";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.139-user-command-context";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.139-user-command-context";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.139-user-command-context";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.139-user-command-context";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.139-user-command-context";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.139-user-command-context";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.134-archive-course-assignments";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.134-archive-course-assignments";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.139-user-command-context";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.139-user-command-context";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.139-user-command-context";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.139-user-command-context";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.139-user-command-context";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.139-user-command-context";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.134-archive-course-assignments";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.139-user-command-context";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.139-user-command-context";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.139-user-command-context";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.139-user-command-context";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.139-user-command-context";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.139-user-command-context";
