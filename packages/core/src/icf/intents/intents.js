// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.78-location-command-center";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.78-location-command-center";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.78-location-command-center";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.78-location-command-center";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.78-location-command-center";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.78-location-command-center";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.78-location-command-center";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.78-location-command-center";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.78-location-command-center";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.78-location-command-center";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.78-location-command-center";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.78-location-command-center";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.78-location-command-center";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.78-location-command-center";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.78-location-command-center";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.78-location-command-center";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.78-location-command-center";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.78-location-command-center";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.78-location-command-center";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.78-location-command-center";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.78-location-command-center";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.78-location-command-center";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.78-location-command-center";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.78-location-command-center";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.78-location-command-center";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.78-location-command-center";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.78-location-command-center";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.78-location-command-center";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.78-location-command-center";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.78-location-command-center";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.78-location-command-center";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.78-location-command-center";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.78-location-command-center";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.78-location-command-center";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.78-location-command-center";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.78-location-command-center";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.78-location-command-center";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.78-location-command-center";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.78-location-command-center";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.78-location-command-center";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.78-location-command-center";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.78-location-command-center";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.78-location-command-center";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.78-location-command-center";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.78-location-command-center";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.78-location-command-center";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.78-location-command-center";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.78-location-command-center";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.78-location-command-center";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.78-location-command-center";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.78-location-command-center";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.78-location-command-center";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.78-location-command-center";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.78-location-command-center";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.78-location-command-center";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.78-location-command-center";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.78-location-command-center";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.78-location-command-center";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.78-location-command-center";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.78-location-command-center";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.78-location-command-center";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.78-location-command-center";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.78-location-command-center";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.78-location-command-center";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.78-location-command-center";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.78-location-command-center";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.78-location-command-center";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.78-location-command-center";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.78-location-command-center";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.78-location-command-center";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.78-location-command-center";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.78-location-command-center";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.78-location-command-center";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.78-location-command-center";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.78-location-command-center";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.78-location-command-center";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.78-location-command-center";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.78-location-command-center";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.78-location-command-center";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.78-location-command-center";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.78-location-command-center";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.78-location-command-center";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.78-location-command-center";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.78-location-command-center";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.78-location-command-center";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.78-location-command-center";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.78-location-command-center";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.78-location-command-center";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.78-location-command-center";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.78-location-command-center";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.78-location-command-center";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.78-location-command-center";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.78-location-command-center";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.78-location-command-center";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.78-location-command-center";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.78-location-command-center";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.78-location-command-center";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.78-location-command-center";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.78-location-command-center";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.78-location-command-center";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.78-location-command-center";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.78-location-command-center";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.78-location-command-center";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.78-location-command-center";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.78-location-command-center";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.78-location-command-center";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.78-location-command-center";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.78-location-command-center";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.78-location-command-center";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.78-location-command-center";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.78-location-command-center";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.78-location-command-center";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.78-location-command-center";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.78-location-command-center";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.78-location-command-center";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.78-location-command-center";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.78-location-command-center";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.78-location-command-center";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.78-location-command-center";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.78-location-command-center";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.78-location-command-center";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.78-location-command-center";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.78-location-command-center";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.78-location-command-center";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.78-location-command-center";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.78-location-command-center";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.78-location-command-center";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.78-location-command-center";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.78-location-command-center";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.78-location-command-center";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.78-location-command-center";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.78-location-command-center";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.78-location-command-center";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.78-location-command-center";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.78-location-command-center";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.78-location-command-center";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.78-location-command-center";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.78-location-command-center";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.78-location-command-center";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.78-location-command-center";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.78-location-command-center";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.78-location-command-center";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.78-location-command-center";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.78-location-command-center";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.78-location-command-center";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.78-location-command-center";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.78-location-command-center";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.78-location-command-center";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.78-location-command-center";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.78-location-command-center";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.78-location-command-center";


