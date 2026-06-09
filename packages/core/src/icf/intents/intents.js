// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.124-location-icon-upload";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.124-location-icon-upload";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.124-location-icon-upload";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.134-archive-course-assignments";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.124-location-icon-upload";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.124-location-icon-upload";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.124-location-icon-upload";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.124-location-icon-upload";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.124-location-icon-upload";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.124-location-icon-upload";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.124-location-icon-upload";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.124-location-icon-upload";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.124-location-icon-upload";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.124-location-icon-upload";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.124-location-icon-upload";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.124-location-icon-upload";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.124-location-icon-upload";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.124-location-icon-upload";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.124-location-icon-upload";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.124-location-icon-upload";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.124-location-icon-upload";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.124-location-icon-upload";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.124-location-icon-upload";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.124-location-icon-upload";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.124-location-icon-upload";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.124-location-icon-upload";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.124-location-icon-upload";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.124-location-icon-upload";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.124-location-icon-upload";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.124-location-icon-upload";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.124-location-icon-upload";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.124-location-icon-upload";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.124-location-icon-upload";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.124-location-icon-upload";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.124-location-icon-upload";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.124-location-icon-upload";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.124-location-icon-upload";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.124-location-icon-upload";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.124-location-icon-upload";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.124-location-icon-upload";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.124-location-icon-upload";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.124-location-icon-upload";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.124-location-icon-upload";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.124-location-icon-upload";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.124-location-icon-upload";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.124-location-icon-upload";

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
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.124-location-icon-upload";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.124-location-icon-upload";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.124-location-icon-upload";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.124-location-icon-upload";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.124-location-icon-upload";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.124-location-icon-upload";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.124-location-icon-upload";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.124-location-icon-upload";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.124-location-icon-upload";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.124-location-icon-upload";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.124-location-icon-upload";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.124-location-icon-upload";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.124-location-icon-upload";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.124-location-icon-upload";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.124-location-icon-upload";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.124-location-icon-upload";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.124-location-icon-upload";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.124-location-icon-upload";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.124-location-icon-upload";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.124-location-icon-upload";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.124-location-icon-upload";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.124-location-icon-upload";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.124-location-icon-upload";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.124-location-icon-upload";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.124-location-icon-upload";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.124-location-icon-upload";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.124-location-icon-upload";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.124-location-icon-upload";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.124-location-icon-upload";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.124-location-icon-upload";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.124-location-icon-upload";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.124-location-icon-upload";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.124-location-icon-upload";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.124-location-icon-upload";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.124-location-icon-upload";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.124-location-icon-upload";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.124-location-icon-upload";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.124-location-icon-upload";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.124-location-icon-upload";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.124-location-icon-upload";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.124-location-icon-upload";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.124-location-icon-upload";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.124-location-icon-upload";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.124-location-icon-upload";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.124-location-icon-upload";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.124-location-icon-upload";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.124-location-icon-upload";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.124-location-icon-upload";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.124-location-icon-upload";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.124-location-icon-upload";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.124-location-icon-upload";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.124-location-icon-upload";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.124-location-icon-upload";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.124-location-icon-upload";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.124-location-icon-upload";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.124-location-icon-upload";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.124-location-icon-upload";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.124-location-icon-upload";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.124-location-icon-upload";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.124-location-icon-upload";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.124-location-icon-upload";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.124-location-icon-upload";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.124-location-icon-upload";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.124-location-icon-upload";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.124-location-icon-upload";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.124-location-icon-upload";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.124-location-icon-upload";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.124-location-icon-upload";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.124-location-icon-upload";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.124-location-icon-upload";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.124-location-icon-upload";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.124-location-icon-upload";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.124-location-icon-upload";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.124-location-icon-upload";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.124-location-icon-upload";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.124-location-icon-upload";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.124-location-icon-upload";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.124-location-icon-upload";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.124-location-icon-upload";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.124-location-icon-upload";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.124-location-icon-upload";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.124-location-icon-upload";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.124-location-icon-upload";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.124-location-icon-upload";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.124-location-icon-upload";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.134-archive-course-assignments";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.134-archive-course-assignments";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.124-location-icon-upload";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.124-location-icon-upload";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.124-location-icon-upload";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.124-location-icon-upload";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.124-location-icon-upload";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.124-location-icon-upload";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.134-archive-course-assignments";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.124-location-icon-upload";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.124-location-icon-upload";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.124-location-icon-upload";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.124-location-icon-upload";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.124-location-icon-upload";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.124-location-icon-upload";
