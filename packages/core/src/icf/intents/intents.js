// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.62-external-task-review-loop";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.62-external-task-review-loop";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.62-external-task-review-loop";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.62-external-task-review-loop";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.62-external-task-review-loop";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.62-external-task-review-loop";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.62-external-task-review-loop";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.62-external-task-review-loop";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.62-external-task-review-loop";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.62-external-task-review-loop";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.62-external-task-review-loop";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.62-external-task-review-loop";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.62-external-task-review-loop";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.62-external-task-review-loop";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.62-external-task-review-loop";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.62-external-task-review-loop";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.62-external-task-review-loop";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.62-external-task-review-loop";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.62-external-task-review-loop";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.62-external-task-review-loop";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.62-external-task-review-loop";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.62-external-task-review-loop";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.62-external-task-review-loop";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.62-external-task-review-loop";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.62-external-task-review-loop";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.62-external-task-review-loop";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.62-external-task-review-loop";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.62-external-task-review-loop";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.62-external-task-review-loop";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.62-external-task-review-loop";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.62-external-task-review-loop";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.62-external-task-review-loop";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.62-external-task-review-loop";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.62-external-task-review-loop";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.62-external-task-review-loop";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.62-external-task-review-loop";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.62-external-task-review-loop";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.62-external-task-review-loop";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.62-external-task-review-loop";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.62-external-task-review-loop";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.62-external-task-review-loop";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.62-external-task-review-loop";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.62-external-task-review-loop";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.62-external-task-review-loop";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.62-external-task-review-loop";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.62-external-task-review-loop";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.62-external-task-review-loop";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.62-external-task-review-loop";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.62-external-task-review-loop";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.62-external-task-review-loop";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.62-external-task-review-loop";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.62-external-task-review-loop";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.62-external-task-review-loop";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.62-external-task-review-loop";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.62-external-task-review-loop";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.62-external-task-review-loop";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.62-external-task-review-loop";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.62-external-task-review-loop";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.62-external-task-review-loop";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.62-external-task-review-loop";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.62-external-task-review-loop";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.62-external-task-review-loop";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.62-external-task-review-loop";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.62-external-task-review-loop";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.62-external-task-review-loop";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.62-external-task-review-loop";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.62-external-task-review-loop";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.62-external-task-review-loop";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.62-external-task-review-loop";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.62-external-task-review-loop";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.62-external-task-review-loop";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.62-external-task-review-loop";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.62-external-task-review-loop";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.62-external-task-review-loop";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.62-external-task-review-loop";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.62-external-task-review-loop";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.62-external-task-review-loop";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.62-external-task-review-loop";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.62-external-task-review-loop";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.62-external-task-review-loop";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.62-external-task-review-loop";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.62-external-task-review-loop";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.62-external-task-review-loop";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.62-external-task-review-loop";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.62-external-task-review-loop";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.62-external-task-review-loop";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.62-external-task-review-loop";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.62-external-task-review-loop";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.62-external-task-review-loop";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.62-external-task-review-loop";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.62-external-task-review-loop";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.62-external-task-review-loop";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.62-external-task-review-loop";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.62-external-task-review-loop";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.62-external-task-review-loop";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.62-external-task-review-loop";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.62-external-task-review-loop";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.62-external-task-review-loop";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.62-external-task-review-loop";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.62-external-task-review-loop";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.62-external-task-review-loop";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.62-external-task-review-loop";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.62-external-task-review-loop";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.62-external-task-review-loop";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.62-external-task-review-loop";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.62-external-task-review-loop";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.62-external-task-review-loop";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.62-external-task-review-loop";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.62-external-task-review-loop";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.62-external-task-review-loop";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.62-external-task-review-loop";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.62-external-task-review-loop";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.62-external-task-review-loop";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.62-external-task-review-loop";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.62-external-task-review-loop";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.62-external-task-review-loop";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.62-external-task-review-loop";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.62-external-task-review-loop";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.62-external-task-review-loop";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.62-external-task-review-loop";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.62-external-task-review-loop";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.62-external-task-review-loop";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.62-external-task-review-loop";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.62-external-task-review-loop";


