// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.91-student-auth-persistence";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.91-student-auth-persistence";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.91-student-auth-persistence";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.91-student-auth-persistence";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.91-student-auth-persistence";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.91-student-auth-persistence";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.91-student-auth-persistence";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.91-student-auth-persistence";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.91-student-auth-persistence";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.91-student-auth-persistence";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.91-student-auth-persistence";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.91-student-auth-persistence";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.91-student-auth-persistence";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.91-student-auth-persistence";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.91-student-auth-persistence";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.91-student-auth-persistence";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.91-student-auth-persistence";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.91-student-auth-persistence";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.91-student-auth-persistence";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.91-student-auth-persistence";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.91-student-auth-persistence";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.91-student-auth-persistence";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.91-student-auth-persistence";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.91-student-auth-persistence";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.91-student-auth-persistence";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.91-student-auth-persistence";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.91-student-auth-persistence";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.91-student-auth-persistence";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.91-student-auth-persistence";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.91-student-auth-persistence";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.91-student-auth-persistence";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.91-student-auth-persistence";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.91-student-auth-persistence";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.91-student-auth-persistence";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.91-student-auth-persistence";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.91-student-auth-persistence";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.91-student-auth-persistence";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.91-student-auth-persistence";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.91-student-auth-persistence";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.91-student-auth-persistence";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.91-student-auth-persistence";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.91-student-auth-persistence";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.91-student-auth-persistence";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.91-student-auth-persistence";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.91-student-auth-persistence";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.91-student-auth-persistence";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.91-student-auth-persistence";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.91-student-auth-persistence";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.91-student-auth-persistence";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.91-student-auth-persistence";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.91-student-auth-persistence";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.91-student-auth-persistence";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.91-student-auth-persistence";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.91-student-auth-persistence";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.91-student-auth-persistence";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.91-student-auth-persistence";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.91-student-auth-persistence";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.91-student-auth-persistence";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.91-student-auth-persistence";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.91-student-auth-persistence";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.91-student-auth-persistence";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.91-student-auth-persistence";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.91-student-auth-persistence";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.91-student-auth-persistence";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.91-student-auth-persistence";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.91-student-auth-persistence";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.91-student-auth-persistence";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.91-student-auth-persistence";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.91-student-auth-persistence";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.91-student-auth-persistence";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.91-student-auth-persistence";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.91-student-auth-persistence";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.91-student-auth-persistence";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.91-student-auth-persistence";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.91-student-auth-persistence";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.91-student-auth-persistence";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.91-student-auth-persistence";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.91-student-auth-persistence";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.91-student-auth-persistence";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.91-student-auth-persistence";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.91-student-auth-persistence";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.91-student-auth-persistence";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.91-student-auth-persistence";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.91-student-auth-persistence";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.91-student-auth-persistence";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.91-student-auth-persistence";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.91-student-auth-persistence";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.91-student-auth-persistence";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.91-student-auth-persistence";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.91-student-auth-persistence";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.91-student-auth-persistence";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.91-student-auth-persistence";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.91-student-auth-persistence";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.91-student-auth-persistence";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.91-student-auth-persistence";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.91-student-auth-persistence";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.91-student-auth-persistence";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.91-student-auth-persistence";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.91-student-auth-persistence";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.91-student-auth-persistence";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.91-student-auth-persistence";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.91-student-auth-persistence";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.91-student-auth-persistence";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.91-student-auth-persistence";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.91-student-auth-persistence";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.91-student-auth-persistence";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.91-student-auth-persistence";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.91-student-auth-persistence";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.91-student-auth-persistence";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.91-student-auth-persistence";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.91-student-auth-persistence";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.91-student-auth-persistence";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.91-student-auth-persistence";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.91-student-auth-persistence";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.91-student-auth-persistence";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.91-student-auth-persistence";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.91-student-auth-persistence";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.91-student-auth-persistence";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.91-student-auth-persistence";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.91-student-auth-persistence";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.91-student-auth-persistence";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.91-student-auth-persistence";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.91-student-auth-persistence";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.91-student-auth-persistence";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.91-student-auth-persistence";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.91-student-auth-persistence";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.91-student-auth-persistence";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.91-student-auth-persistence";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.91-student-auth-persistence";


