// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.114-student-profile-rules";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.114-student-profile-rules";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.114-student-profile-rules";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.114-student-profile-rules";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.114-student-profile-rules";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.114-student-profile-rules";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.114-student-profile-rules";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.114-student-profile-rules";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.114-student-profile-rules";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.114-student-profile-rules";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.114-student-profile-rules";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.114-student-profile-rules";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.114-student-profile-rules";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.114-student-profile-rules";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.114-student-profile-rules";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.114-student-profile-rules";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.114-student-profile-rules";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.114-student-profile-rules";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.114-student-profile-rules";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.114-student-profile-rules";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.114-student-profile-rules";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.114-student-profile-rules";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.114-student-profile-rules";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.114-student-profile-rules";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.114-student-profile-rules";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.114-student-profile-rules";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.114-student-profile-rules";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.114-student-profile-rules";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.114-student-profile-rules";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.114-student-profile-rules";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.114-student-profile-rules";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.114-student-profile-rules";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.114-student-profile-rules";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.114-student-profile-rules";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.114-student-profile-rules";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.114-student-profile-rules";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.114-student-profile-rules";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.114-student-profile-rules";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.114-student-profile-rules";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.114-student-profile-rules";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.114-student-profile-rules";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.114-student-profile-rules";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.114-student-profile-rules";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.114-student-profile-rules";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.114-student-profile-rules";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.114-student-profile-rules";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.114-student-profile-rules";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.114-student-profile-rules";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.114-student-profile-rules";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.114-student-profile-rules";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.114-student-profile-rules";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.114-student-profile-rules";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.114-student-profile-rules";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.114-student-profile-rules";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.114-student-profile-rules";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.114-student-profile-rules";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.114-student-profile-rules";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.114-student-profile-rules";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.114-student-profile-rules";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.114-student-profile-rules";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.114-student-profile-rules";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.114-student-profile-rules";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.114-student-profile-rules";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.114-student-profile-rules";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.114-student-profile-rules";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.114-student-profile-rules";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.114-student-profile-rules";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.114-student-profile-rules";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.114-student-profile-rules";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.114-student-profile-rules";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.114-student-profile-rules";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.114-student-profile-rules";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.114-student-profile-rules";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.114-student-profile-rules";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.114-student-profile-rules";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.114-student-profile-rules";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.114-student-profile-rules";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.114-student-profile-rules";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.114-student-profile-rules";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.114-student-profile-rules";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.114-student-profile-rules";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.114-student-profile-rules";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.114-student-profile-rules";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.114-student-profile-rules";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.114-student-profile-rules";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.114-student-profile-rules";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.114-student-profile-rules";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.114-student-profile-rules";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.114-student-profile-rules";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.114-student-profile-rules";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.114-student-profile-rules";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.114-student-profile-rules";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.114-student-profile-rules";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.114-student-profile-rules";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.114-student-profile-rules";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.114-student-profile-rules";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.114-student-profile-rules";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.114-student-profile-rules";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.114-student-profile-rules";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.114-student-profile-rules";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.114-student-profile-rules";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.114-student-profile-rules";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.114-student-profile-rules";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.114-student-profile-rules";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.114-student-profile-rules";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.114-student-profile-rules";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.114-student-profile-rules";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.114-student-profile-rules";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.114-student-profile-rules";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.114-student-profile-rules";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.114-student-profile-rules";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.114-student-profile-rules";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.114-student-profile-rules";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.114-student-profile-rules";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.114-student-profile-rules";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.114-student-profile-rules";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.114-student-profile-rules";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.114-student-profile-rules";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.114-student-profile-rules";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.114-student-profile-rules";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.114-student-profile-rules";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.114-student-profile-rules";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.114-student-profile-rules";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.114-student-profile-rules";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.114-student-profile-rules";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.114-student-profile-rules";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.114-student-profile-rules";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.114-student-profile-rules";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.114-student-profile-rules";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.114-student-profile-rules";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.114-student-profile-rules";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.114-student-profile-rules";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.114-student-profile-rules";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.114-student-profile-rules";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.114-student-profile-rules";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.114-student-profile-rules";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.114-student-profile-rules";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.114-student-profile-rules";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.114-student-profile-rules";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.114-student-profile-rules";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.114-student-profile-rules";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.114-student-profile-rules";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.114-student-profile-rules";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.114-student-profile-rules";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.114-student-profile-rules";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.114-student-profile-rules";


