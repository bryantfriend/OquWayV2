// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.95-student-icf-root";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.95-student-icf-root";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.95-student-icf-root";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.95-student-icf-root";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.95-student-icf-root";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.95-student-icf-root";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.95-student-icf-root";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.95-student-icf-root";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.95-student-icf-root";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.95-student-icf-root";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.95-student-icf-root";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.95-student-icf-root";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.95-student-icf-root";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.95-student-icf-root";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.95-student-icf-root";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.95-student-icf-root";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.95-student-icf-root";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.95-student-icf-root";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.95-student-icf-root";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.95-student-icf-root";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.95-student-icf-root";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.95-student-icf-root";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.95-student-icf-root";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.95-student-icf-root";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.95-student-icf-root";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.95-student-icf-root";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.95-student-icf-root";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.95-student-icf-root";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.95-student-icf-root";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.95-student-icf-root";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.95-student-icf-root";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.95-student-icf-root";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.95-student-icf-root";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.95-student-icf-root";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.95-student-icf-root";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.95-student-icf-root";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.95-student-icf-root";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.95-student-icf-root";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.95-student-icf-root";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.95-student-icf-root";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.95-student-icf-root";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.95-student-icf-root";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.95-student-icf-root";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.95-student-icf-root";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.95-student-icf-root";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.95-student-icf-root";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.95-student-icf-root";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.95-student-icf-root";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.95-student-icf-root";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.95-student-icf-root";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.95-student-icf-root";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.95-student-icf-root";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.95-student-icf-root";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.95-student-icf-root";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.95-student-icf-root";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.95-student-icf-root";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.95-student-icf-root";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.95-student-icf-root";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.95-student-icf-root";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.95-student-icf-root";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.95-student-icf-root";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.95-student-icf-root";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.95-student-icf-root";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.95-student-icf-root";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.95-student-icf-root";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.95-student-icf-root";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.95-student-icf-root";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.95-student-icf-root";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.95-student-icf-root";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.95-student-icf-root";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.95-student-icf-root";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.95-student-icf-root";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.95-student-icf-root";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.95-student-icf-root";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.95-student-icf-root";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.95-student-icf-root";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.95-student-icf-root";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.95-student-icf-root";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.95-student-icf-root";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.95-student-icf-root";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.95-student-icf-root";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.95-student-icf-root";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.95-student-icf-root";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.95-student-icf-root";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.95-student-icf-root";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.95-student-icf-root";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.95-student-icf-root";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.95-student-icf-root";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.95-student-icf-root";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.95-student-icf-root";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.95-student-icf-root";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.95-student-icf-root";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.95-student-icf-root";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.95-student-icf-root";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.95-student-icf-root";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.95-student-icf-root";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.95-student-icf-root";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.95-student-icf-root";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.95-student-icf-root";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.95-student-icf-root";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.95-student-icf-root";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.95-student-icf-root";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.95-student-icf-root";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.95-student-icf-root";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.95-student-icf-root";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.95-student-icf-root";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.95-student-icf-root";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.95-student-icf-root";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.95-student-icf-root";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.95-student-icf-root";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.95-student-icf-root";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.95-student-icf-root";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.95-student-icf-root";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.95-student-icf-root";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.95-student-icf-root";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.95-student-icf-root";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.95-student-icf-root";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.95-student-icf-root";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.95-student-icf-root";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.95-student-icf-root";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.95-student-icf-root";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.95-student-icf-root";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.95-student-icf-root";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.95-student-icf-root";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.95-student-icf-root";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.95-student-icf-root";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.95-student-icf-root";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.95-student-icf-root";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.95-student-icf-root";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.95-student-icf-root";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.95-student-icf-root";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.95-student-icf-root";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.95-student-icf-root";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.95-student-icf-root";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.95-student-icf-root";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.95-student-icf-root";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.95-student-icf-root";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.95-student-icf-root";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.95-student-icf-root";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.95-student-icf-root";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.95-student-icf-root";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.95-student-icf-root";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.95-student-icf-root";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.95-student-icf-root";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.95-student-icf-root";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.95-student-icf-root";


