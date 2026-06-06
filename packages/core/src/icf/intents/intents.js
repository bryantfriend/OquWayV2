// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.97-student-session-uid";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.97-student-session-uid";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.97-student-session-uid";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.97-student-session-uid";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.97-student-session-uid";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.97-student-session-uid";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.97-student-session-uid";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.97-student-session-uid";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.97-student-session-uid";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.97-student-session-uid";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.97-student-session-uid";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.97-student-session-uid";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.97-student-session-uid";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.97-student-session-uid";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.97-student-session-uid";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.97-student-session-uid";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.97-student-session-uid";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.97-student-session-uid";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.97-student-session-uid";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.97-student-session-uid";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.97-student-session-uid";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.97-student-session-uid";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.97-student-session-uid";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.97-student-session-uid";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.97-student-session-uid";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.97-student-session-uid";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.97-student-session-uid";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.97-student-session-uid";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.97-student-session-uid";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.97-student-session-uid";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.97-student-session-uid";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.97-student-session-uid";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.97-student-session-uid";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.97-student-session-uid";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.97-student-session-uid";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.97-student-session-uid";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.97-student-session-uid";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.97-student-session-uid";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.97-student-session-uid";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.97-student-session-uid";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.97-student-session-uid";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.97-student-session-uid";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.97-student-session-uid";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.97-student-session-uid";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.97-student-session-uid";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.97-student-session-uid";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.97-student-session-uid";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.97-student-session-uid";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.97-student-session-uid";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.97-student-session-uid";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.97-student-session-uid";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.97-student-session-uid";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.97-student-session-uid";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.97-student-session-uid";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.97-student-session-uid";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.97-student-session-uid";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.97-student-session-uid";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.97-student-session-uid";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.97-student-session-uid";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.97-student-session-uid";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.97-student-session-uid";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.97-student-session-uid";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.97-student-session-uid";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.97-student-session-uid";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.97-student-session-uid";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.97-student-session-uid";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.97-student-session-uid";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.97-student-session-uid";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.97-student-session-uid";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.97-student-session-uid";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.97-student-session-uid";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.97-student-session-uid";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.97-student-session-uid";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.97-student-session-uid";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.97-student-session-uid";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.97-student-session-uid";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.97-student-session-uid";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.97-student-session-uid";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.97-student-session-uid";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.97-student-session-uid";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.97-student-session-uid";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.97-student-session-uid";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.97-student-session-uid";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.97-student-session-uid";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.97-student-session-uid";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.97-student-session-uid";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.97-student-session-uid";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.97-student-session-uid";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.97-student-session-uid";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.97-student-session-uid";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.97-student-session-uid";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.97-student-session-uid";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.97-student-session-uid";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.97-student-session-uid";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.97-student-session-uid";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.97-student-session-uid";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.97-student-session-uid";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.97-student-session-uid";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.97-student-session-uid";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.97-student-session-uid";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.97-student-session-uid";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.97-student-session-uid";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.97-student-session-uid";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.97-student-session-uid";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.97-student-session-uid";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.97-student-session-uid";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.97-student-session-uid";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.97-student-session-uid";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.97-student-session-uid";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.97-student-session-uid";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.97-student-session-uid";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.97-student-session-uid";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.97-student-session-uid";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.97-student-session-uid";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.97-student-session-uid";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.97-student-session-uid";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.97-student-session-uid";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.97-student-session-uid";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.97-student-session-uid";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.97-student-session-uid";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.97-student-session-uid";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.97-student-session-uid";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.97-student-session-uid";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.97-student-session-uid";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.97-student-session-uid";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.97-student-session-uid";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.97-student-session-uid";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.97-student-session-uid";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.97-student-session-uid";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.97-student-session-uid";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.97-student-session-uid";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.97-student-session-uid";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.97-student-session-uid";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.97-student-session-uid";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.97-student-session-uid";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.97-student-session-uid";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.97-student-session-uid";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.97-student-session-uid";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.97-student-session-uid";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.97-student-session-uid";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.97-student-session-uid";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.97-student-session-uid";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.97-student-session-uid";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.97-student-session-uid";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.97-student-session-uid";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.97-student-session-uid";


