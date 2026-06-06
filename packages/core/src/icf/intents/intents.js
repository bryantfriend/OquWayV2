// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.102-student-profile-payload";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.102-student-profile-payload";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.102-student-profile-payload";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.102-student-profile-payload";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.102-student-profile-payload";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.102-student-profile-payload";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.102-student-profile-payload";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.102-student-profile-payload";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.102-student-profile-payload";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.102-student-profile-payload";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.102-student-profile-payload";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.102-student-profile-payload";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.102-student-profile-payload";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.102-student-profile-payload";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.102-student-profile-payload";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.102-student-profile-payload";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.102-student-profile-payload";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.102-student-profile-payload";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.102-student-profile-payload";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.102-student-profile-payload";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.102-student-profile-payload";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.102-student-profile-payload";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.102-student-profile-payload";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.102-student-profile-payload";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.102-student-profile-payload";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.102-student-profile-payload";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.102-student-profile-payload";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.102-student-profile-payload";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.102-student-profile-payload";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.102-student-profile-payload";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.102-student-profile-payload";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.102-student-profile-payload";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.102-student-profile-payload";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.102-student-profile-payload";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.102-student-profile-payload";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.102-student-profile-payload";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.102-student-profile-payload";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.102-student-profile-payload";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.102-student-profile-payload";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.102-student-profile-payload";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.102-student-profile-payload";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.102-student-profile-payload";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.102-student-profile-payload";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.102-student-profile-payload";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.102-student-profile-payload";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.102-student-profile-payload";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.102-student-profile-payload";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.102-student-profile-payload";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.102-student-profile-payload";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.102-student-profile-payload";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.102-student-profile-payload";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.102-student-profile-payload";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.102-student-profile-payload";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.102-student-profile-payload";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.102-student-profile-payload";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.102-student-profile-payload";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.102-student-profile-payload";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.102-student-profile-payload";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.102-student-profile-payload";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.102-student-profile-payload";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.102-student-profile-payload";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.102-student-profile-payload";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.102-student-profile-payload";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.102-student-profile-payload";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.102-student-profile-payload";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.102-student-profile-payload";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.102-student-profile-payload";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.102-student-profile-payload";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.102-student-profile-payload";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.102-student-profile-payload";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.102-student-profile-payload";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.102-student-profile-payload";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.102-student-profile-payload";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.102-student-profile-payload";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.102-student-profile-payload";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.102-student-profile-payload";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.102-student-profile-payload";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.102-student-profile-payload";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.102-student-profile-payload";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.102-student-profile-payload";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.102-student-profile-payload";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.102-student-profile-payload";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.102-student-profile-payload";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.102-student-profile-payload";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.102-student-profile-payload";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.102-student-profile-payload";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.102-student-profile-payload";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.102-student-profile-payload";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.102-student-profile-payload";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.102-student-profile-payload";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.102-student-profile-payload";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.102-student-profile-payload";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.102-student-profile-payload";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.102-student-profile-payload";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.102-student-profile-payload";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.102-student-profile-payload";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.102-student-profile-payload";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.102-student-profile-payload";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.102-student-profile-payload";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.102-student-profile-payload";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.102-student-profile-payload";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.102-student-profile-payload";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.102-student-profile-payload";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.102-student-profile-payload";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.102-student-profile-payload";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.102-student-profile-payload";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.102-student-profile-payload";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.102-student-profile-payload";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.102-student-profile-payload";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.102-student-profile-payload";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.102-student-profile-payload";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.102-student-profile-payload";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.102-student-profile-payload";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.102-student-profile-payload";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.102-student-profile-payload";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.102-student-profile-payload";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.102-student-profile-payload";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.102-student-profile-payload";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.102-student-profile-payload";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.102-student-profile-payload";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.102-student-profile-payload";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.102-student-profile-payload";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.102-student-profile-payload";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.102-student-profile-payload";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.102-student-profile-payload";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.102-student-profile-payload";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.102-student-profile-payload";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.102-student-profile-payload";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.102-student-profile-payload";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.102-student-profile-payload";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.102-student-profile-payload";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.102-student-profile-payload";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.102-student-profile-payload";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.102-student-profile-payload";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.102-student-profile-payload";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.102-student-profile-payload";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.102-student-profile-payload";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.102-student-profile-payload";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.102-student-profile-payload";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.102-student-profile-payload";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.102-student-profile-payload";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.102-student-profile-payload";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.102-student-profile-payload";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.102-student-profile-payload";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.102-student-profile-payload";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.102-student-profile-payload";


