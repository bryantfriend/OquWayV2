// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.70-external-task-feedback";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.70-external-task-feedback";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.70-external-task-feedback";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.70-external-task-feedback";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.70-external-task-feedback";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.70-external-task-feedback";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.70-external-task-feedback";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.70-external-task-feedback";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.70-external-task-feedback";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.70-external-task-feedback";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.70-external-task-feedback";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.70-external-task-feedback";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.70-external-task-feedback";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.70-external-task-feedback";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.70-external-task-feedback";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.70-external-task-feedback";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.70-external-task-feedback";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.70-external-task-feedback";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.70-external-task-feedback";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.70-external-task-feedback";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.70-external-task-feedback";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.70-external-task-feedback";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.70-external-task-feedback";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.70-external-task-feedback";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.70-external-task-feedback";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.70-external-task-feedback";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.70-external-task-feedback";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.70-external-task-feedback";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.70-external-task-feedback";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.70-external-task-feedback";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.70-external-task-feedback";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.70-external-task-feedback";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.70-external-task-feedback";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.70-external-task-feedback";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.70-external-task-feedback";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.70-external-task-feedback";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.70-external-task-feedback";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.70-external-task-feedback";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.70-external-task-feedback";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.70-external-task-feedback";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.70-external-task-feedback";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.70-external-task-feedback";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.70-external-task-feedback";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.70-external-task-feedback";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.70-external-task-feedback";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.70-external-task-feedback";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.70-external-task-feedback";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.70-external-task-feedback";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.70-external-task-feedback";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.70-external-task-feedback";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.70-external-task-feedback";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.70-external-task-feedback";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.70-external-task-feedback";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.70-external-task-feedback";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.70-external-task-feedback";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.70-external-task-feedback";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.70-external-task-feedback";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.70-external-task-feedback";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.70-external-task-feedback";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.70-external-task-feedback";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.70-external-task-feedback";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.70-external-task-feedback";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.70-external-task-feedback";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.70-external-task-feedback";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.70-external-task-feedback";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.70-external-task-feedback";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.70-external-task-feedback";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.70-external-task-feedback";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.70-external-task-feedback";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.70-external-task-feedback";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.70-external-task-feedback";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.70-external-task-feedback";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.70-external-task-feedback";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.70-external-task-feedback";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.70-external-task-feedback";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.70-external-task-feedback";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.70-external-task-feedback";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.70-external-task-feedback";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.70-external-task-feedback";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.70-external-task-feedback";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.70-external-task-feedback";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.70-external-task-feedback";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.70-external-task-feedback";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.70-external-task-feedback";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.70-external-task-feedback";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.70-external-task-feedback";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.70-external-task-feedback";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.70-external-task-feedback";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.70-external-task-feedback";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.70-external-task-feedback";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.70-external-task-feedback";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.70-external-task-feedback";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.70-external-task-feedback";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.70-external-task-feedback";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.70-external-task-feedback";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.70-external-task-feedback";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.70-external-task-feedback";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.70-external-task-feedback";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.70-external-task-feedback";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.70-external-task-feedback";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.70-external-task-feedback";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.70-external-task-feedback";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.70-external-task-feedback";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.70-external-task-feedback";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.70-external-task-feedback";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.70-external-task-feedback";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.70-external-task-feedback";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.70-external-task-feedback";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.70-external-task-feedback";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.70-external-task-feedback";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.70-external-task-feedback";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.70-external-task-feedback";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.70-external-task-feedback";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.70-external-task-feedback";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.70-external-task-feedback";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.70-external-task-feedback";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.70-external-task-feedback";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.70-external-task-feedback";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.70-external-task-feedback";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.70-external-task-feedback";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.70-external-task-feedback";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.70-external-task-feedback";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.70-external-task-feedback";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.70-external-task-feedback";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.70-external-task-feedback";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.70-external-task-feedback";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.70-external-task-feedback";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.70-external-task-feedback";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.70-external-task-feedback";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.70-external-task-feedback";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.70-external-task-feedback";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.70-external-task-feedback";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.70-external-task-feedback";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.70-external-task-feedback";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.70-external-task-feedback";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.70-external-task-feedback";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.70-external-task-feedback";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.70-external-task-feedback";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.70-external-task-feedback";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.70-external-task-feedback";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.70-external-task-feedback";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.70-external-task-feedback";


