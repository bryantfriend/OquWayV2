// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.113-student-rules-read";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.113-student-rules-read";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.113-student-rules-read";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.113-student-rules-read";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.113-student-rules-read";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.113-student-rules-read";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.113-student-rules-read";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.113-student-rules-read";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.113-student-rules-read";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.113-student-rules-read";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.113-student-rules-read";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.113-student-rules-read";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.113-student-rules-read";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.113-student-rules-read";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.113-student-rules-read";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.113-student-rules-read";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.113-student-rules-read";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.113-student-rules-read";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.113-student-rules-read";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.113-student-rules-read";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.113-student-rules-read";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.113-student-rules-read";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.113-student-rules-read";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.113-student-rules-read";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.113-student-rules-read";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.113-student-rules-read";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.113-student-rules-read";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.113-student-rules-read";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.113-student-rules-read";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.113-student-rules-read";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.113-student-rules-read";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.113-student-rules-read";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.113-student-rules-read";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.113-student-rules-read";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.113-student-rules-read";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.113-student-rules-read";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.113-student-rules-read";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.113-student-rules-read";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.113-student-rules-read";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.113-student-rules-read";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.113-student-rules-read";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.113-student-rules-read";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.113-student-rules-read";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.113-student-rules-read";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.113-student-rules-read";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.113-student-rules-read";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.113-student-rules-read";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.113-student-rules-read";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.113-student-rules-read";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.113-student-rules-read";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.113-student-rules-read";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.113-student-rules-read";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.113-student-rules-read";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.113-student-rules-read";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.113-student-rules-read";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.113-student-rules-read";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.113-student-rules-read";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.113-student-rules-read";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.113-student-rules-read";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.113-student-rules-read";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.113-student-rules-read";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.113-student-rules-read";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.113-student-rules-read";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.113-student-rules-read";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.113-student-rules-read";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.113-student-rules-read";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.113-student-rules-read";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.113-student-rules-read";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.113-student-rules-read";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.113-student-rules-read";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.113-student-rules-read";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.113-student-rules-read";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.113-student-rules-read";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.113-student-rules-read";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.113-student-rules-read";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.113-student-rules-read";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.113-student-rules-read";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.113-student-rules-read";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.113-student-rules-read";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.113-student-rules-read";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.113-student-rules-read";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.113-student-rules-read";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.113-student-rules-read";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.113-student-rules-read";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.113-student-rules-read";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.113-student-rules-read";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.113-student-rules-read";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.113-student-rules-read";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.113-student-rules-read";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.113-student-rules-read";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.113-student-rules-read";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.113-student-rules-read";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.113-student-rules-read";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.113-student-rules-read";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.113-student-rules-read";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.113-student-rules-read";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.113-student-rules-read";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.113-student-rules-read";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.113-student-rules-read";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.113-student-rules-read";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.113-student-rules-read";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.113-student-rules-read";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.113-student-rules-read";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.113-student-rules-read";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.113-student-rules-read";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.113-student-rules-read";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.113-student-rules-read";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.113-student-rules-read";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.113-student-rules-read";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.113-student-rules-read";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.113-student-rules-read";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.113-student-rules-read";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.113-student-rules-read";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.113-student-rules-read";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.113-student-rules-read";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.113-student-rules-read";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.113-student-rules-read";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.113-student-rules-read";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.113-student-rules-read";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.113-student-rules-read";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.113-student-rules-read";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.113-student-rules-read";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.113-student-rules-read";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.113-student-rules-read";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.113-student-rules-read";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.113-student-rules-read";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.113-student-rules-read";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.113-student-rules-read";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.113-student-rules-read";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.113-student-rules-read";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.113-student-rules-read";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.113-student-rules-read";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.113-student-rules-read";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.113-student-rules-read";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.113-student-rules-read";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.113-student-rules-read";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.113-student-rules-read";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.113-student-rules-read";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.113-student-rules-read";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.113-student-rules-read";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.113-student-rules-read";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.113-student-rules-read";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.113-student-rules-read";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.113-student-rules-read";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.113-student-rules-read";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.113-student-rules-read";


