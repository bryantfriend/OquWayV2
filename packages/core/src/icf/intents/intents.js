// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.99-student-profile-gate";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.99-student-profile-gate";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.99-student-profile-gate";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.99-student-profile-gate";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.99-student-profile-gate";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.99-student-profile-gate";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.99-student-profile-gate";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.99-student-profile-gate";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.99-student-profile-gate";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.99-student-profile-gate";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.99-student-profile-gate";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.99-student-profile-gate";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.99-student-profile-gate";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.99-student-profile-gate";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.99-student-profile-gate";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.99-student-profile-gate";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.99-student-profile-gate";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.99-student-profile-gate";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.99-student-profile-gate";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.99-student-profile-gate";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.99-student-profile-gate";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.99-student-profile-gate";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.99-student-profile-gate";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.99-student-profile-gate";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.99-student-profile-gate";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.99-student-profile-gate";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.99-student-profile-gate";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.99-student-profile-gate";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.99-student-profile-gate";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.99-student-profile-gate";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.99-student-profile-gate";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.99-student-profile-gate";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.99-student-profile-gate";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.99-student-profile-gate";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.99-student-profile-gate";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.99-student-profile-gate";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.99-student-profile-gate";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.99-student-profile-gate";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.99-student-profile-gate";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.99-student-profile-gate";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.99-student-profile-gate";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.99-student-profile-gate";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.99-student-profile-gate";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.99-student-profile-gate";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.99-student-profile-gate";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.99-student-profile-gate";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.99-student-profile-gate";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.99-student-profile-gate";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.99-student-profile-gate";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.99-student-profile-gate";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.99-student-profile-gate";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.99-student-profile-gate";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.99-student-profile-gate";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.99-student-profile-gate";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.99-student-profile-gate";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.99-student-profile-gate";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.99-student-profile-gate";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.99-student-profile-gate";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.99-student-profile-gate";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.99-student-profile-gate";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.99-student-profile-gate";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.99-student-profile-gate";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.99-student-profile-gate";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.99-student-profile-gate";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.99-student-profile-gate";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.99-student-profile-gate";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.99-student-profile-gate";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.99-student-profile-gate";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.99-student-profile-gate";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.99-student-profile-gate";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.99-student-profile-gate";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.99-student-profile-gate";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.99-student-profile-gate";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.99-student-profile-gate";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.99-student-profile-gate";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.99-student-profile-gate";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.99-student-profile-gate";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.99-student-profile-gate";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.99-student-profile-gate";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.99-student-profile-gate";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.99-student-profile-gate";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.99-student-profile-gate";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.99-student-profile-gate";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.99-student-profile-gate";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.99-student-profile-gate";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.99-student-profile-gate";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.99-student-profile-gate";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.99-student-profile-gate";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.99-student-profile-gate";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.99-student-profile-gate";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.99-student-profile-gate";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.99-student-profile-gate";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.99-student-profile-gate";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.99-student-profile-gate";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.99-student-profile-gate";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.99-student-profile-gate";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.99-student-profile-gate";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.99-student-profile-gate";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.99-student-profile-gate";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.99-student-profile-gate";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.99-student-profile-gate";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.99-student-profile-gate";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.99-student-profile-gate";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.99-student-profile-gate";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.99-student-profile-gate";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.99-student-profile-gate";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.99-student-profile-gate";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.99-student-profile-gate";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.99-student-profile-gate";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.99-student-profile-gate";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.99-student-profile-gate";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.99-student-profile-gate";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.99-student-profile-gate";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.99-student-profile-gate";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.99-student-profile-gate";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.99-student-profile-gate";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.99-student-profile-gate";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.99-student-profile-gate";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.99-student-profile-gate";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.99-student-profile-gate";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.99-student-profile-gate";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.99-student-profile-gate";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.99-student-profile-gate";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.99-student-profile-gate";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.99-student-profile-gate";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.99-student-profile-gate";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.99-student-profile-gate";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.99-student-profile-gate";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.99-student-profile-gate";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.99-student-profile-gate";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.99-student-profile-gate";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.99-student-profile-gate";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.99-student-profile-gate";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.99-student-profile-gate";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.99-student-profile-gate";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.99-student-profile-gate";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.99-student-profile-gate";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.99-student-profile-gate";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.99-student-profile-gate";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.99-student-profile-gate";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.99-student-profile-gate";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.99-student-profile-gate";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.99-student-profile-gate";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.99-student-profile-gate";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.99-student-profile-gate";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.99-student-profile-gate";


