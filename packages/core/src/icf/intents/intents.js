// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.117-student-identity-binding";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.117-student-identity-binding";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.117-student-identity-binding";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.117-student-identity-binding";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.117-student-identity-binding";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.117-student-identity-binding";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.117-student-identity-binding";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.117-student-identity-binding";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.117-student-identity-binding";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.117-student-identity-binding";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.117-student-identity-binding";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.117-student-identity-binding";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.117-student-identity-binding";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.117-student-identity-binding";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.117-student-identity-binding";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.117-student-identity-binding";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.117-student-identity-binding";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.117-student-identity-binding";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.117-student-identity-binding";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.117-student-identity-binding";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.117-student-identity-binding";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.117-student-identity-binding";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.117-student-identity-binding";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.117-student-identity-binding";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.117-student-identity-binding";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.117-student-identity-binding";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.117-student-identity-binding";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.117-student-identity-binding";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.117-student-identity-binding";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.117-student-identity-binding";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.117-student-identity-binding";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.117-student-identity-binding";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.117-student-identity-binding";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.117-student-identity-binding";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.117-student-identity-binding";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.117-student-identity-binding";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.117-student-identity-binding";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.117-student-identity-binding";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.117-student-identity-binding";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.117-student-identity-binding";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.117-student-identity-binding";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.117-student-identity-binding";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.117-student-identity-binding";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.117-student-identity-binding";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.117-student-identity-binding";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.117-student-identity-binding";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.117-student-identity-binding";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.117-student-identity-binding";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.117-student-identity-binding";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.117-student-identity-binding";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.117-student-identity-binding";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.117-student-identity-binding";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.117-student-identity-binding";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.117-student-identity-binding";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.117-student-identity-binding";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.117-student-identity-binding";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.117-student-identity-binding";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.117-student-identity-binding";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.117-student-identity-binding";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.117-student-identity-binding";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.117-student-identity-binding";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.117-student-identity-binding";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.117-student-identity-binding";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.117-student-identity-binding";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.117-student-identity-binding";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.117-student-identity-binding";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.117-student-identity-binding";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.117-student-identity-binding";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.117-student-identity-binding";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.117-student-identity-binding";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.117-student-identity-binding";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.117-student-identity-binding";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.117-student-identity-binding";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.117-student-identity-binding";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.117-student-identity-binding";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.117-student-identity-binding";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.117-student-identity-binding";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.117-student-identity-binding";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.117-student-identity-binding";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.117-student-identity-binding";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.117-student-identity-binding";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.117-student-identity-binding";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.117-student-identity-binding";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.117-student-identity-binding";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.117-student-identity-binding";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.117-student-identity-binding";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.117-student-identity-binding";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.117-student-identity-binding";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.117-student-identity-binding";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.117-student-identity-binding";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.117-student-identity-binding";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.117-student-identity-binding";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.117-student-identity-binding";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.117-student-identity-binding";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.117-student-identity-binding";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.117-student-identity-binding";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.117-student-identity-binding";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.117-student-identity-binding";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.117-student-identity-binding";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.117-student-identity-binding";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.117-student-identity-binding";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.117-student-identity-binding";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.117-student-identity-binding";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.117-student-identity-binding";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.117-student-identity-binding";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.117-student-identity-binding";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.117-student-identity-binding";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.117-student-identity-binding";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.117-student-identity-binding";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.117-student-identity-binding";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.117-student-identity-binding";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.117-student-identity-binding";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.117-student-identity-binding";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.117-student-identity-binding";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.117-student-identity-binding";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.117-student-identity-binding";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.117-student-identity-binding";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.117-student-identity-binding";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.117-student-identity-binding";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.117-student-identity-binding";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.117-student-identity-binding";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.117-student-identity-binding";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.117-student-identity-binding";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.117-student-identity-binding";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.117-student-identity-binding";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.117-student-identity-binding";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.117-student-identity-binding";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.117-student-identity-binding";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.117-student-identity-binding";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.117-student-identity-binding";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.117-student-identity-binding";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.117-student-identity-binding";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.117-student-identity-binding";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.117-student-identity-binding";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.117-student-identity-binding";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.117-student-identity-binding";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.117-student-identity-binding";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.117-student-identity-binding";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.117-student-identity-binding";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.117-student-identity-binding";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.117-student-identity-binding";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.117-student-identity-binding";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.117-student-identity-binding";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.117-student-identity-binding";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.117-student-identity-binding";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.117-student-identity-binding";


