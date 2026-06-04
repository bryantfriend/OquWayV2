// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.54-multi-role-assistant";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.54-multi-role-assistant";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.54-multi-role-assistant";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.54-multi-role-assistant";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.54-multi-role-assistant";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.54-multi-role-assistant";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.54-multi-role-assistant";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.54-multi-role-assistant";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.54-multi-role-assistant";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.54-multi-role-assistant";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.54-multi-role-assistant";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.54-multi-role-assistant";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.54-multi-role-assistant";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.54-multi-role-assistant";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.54-multi-role-assistant";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.54-multi-role-assistant";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.54-multi-role-assistant";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.54-multi-role-assistant";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.54-multi-role-assistant";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.54-multi-role-assistant";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.33-course-counts";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.54-multi-role-assistant";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.54-multi-role-assistant";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.54-multi-role-assistant";

// ----------------------
// Course Assignments
// ----------------------
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.54-multi-role-assistant";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.54-multi-role-assistant";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.54-multi-role-assistant";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.54-multi-role-assistant";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.54-multi-role-assistant";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.54-multi-role-assistant";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.34-external-task-mvp";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.34-external-task-mvp";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.34-external-task-mvp";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.34-external-task-mvp";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.54-multi-role-assistant";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.34-external-task-mvp";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.54-multi-role-assistant";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.54-multi-role-assistant";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.54-multi-role-assistant";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.54-multi-role-assistant";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.54-multi-role-assistant";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.54-multi-role-assistant";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.54-multi-role-assistant";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.54-multi-role-assistant";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.54-multi-role-assistant";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.54-multi-role-assistant";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.54-multi-role-assistant";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.54-multi-role-assistant";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.54-multi-role-assistant";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.54-multi-role-assistant";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.54-multi-role-assistant";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.55-class-ownership";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.55-class-ownership";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.55-class-ownership";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.54-multi-role-assistant";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.54-multi-role-assistant";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.55-class-ownership";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.54-multi-role-assistant";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.55-class-ownership";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.54-multi-role-assistant";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.54-multi-role-assistant";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.55-class-ownership";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.54-multi-role-assistant";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.54-multi-role-assistant";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.54-multi-role-assistant";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.54-multi-role-assistant";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.54-multi-role-assistant";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.54-multi-role-assistant";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.54-multi-role-assistant";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.54-multi-role-assistant";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.54-multi-role-assistant";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.54-multi-role-assistant";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.54-multi-role-assistant";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.54-multi-role-assistant";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.54-multi-role-assistant";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.54-multi-role-assistant";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.54-multi-role-assistant";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.54-multi-role-assistant";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.54-multi-role-assistant";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.54-multi-role-assistant";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.54-multi-role-assistant";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.54-multi-role-assistant";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.54-multi-role-assistant";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.54-multi-role-assistant";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.54-multi-role-assistant";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.54-multi-role-assistant";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.54-multi-role-assistant";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.54-multi-role-assistant";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.54-multi-role-assistant";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.54-multi-role-assistant";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.54-multi-role-assistant";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.54-multi-role-assistant";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.54-multi-role-assistant";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.54-multi-role-assistant";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.54-multi-role-assistant";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.54-multi-role-assistant";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.54-multi-role-assistant";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.54-multi-role-assistant";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.54-multi-role-assistant";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.54-multi-role-assistant";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.54-multi-role-assistant";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.54-multi-role-assistant";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.54-multi-role-assistant";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.54-multi-role-assistant";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.54-multi-role-assistant";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.54-multi-role-assistant";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.54-multi-role-assistant";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.54-multi-role-assistant";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.54-multi-role-assistant";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.54-multi-role-assistant";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.54-multi-role-assistant";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.54-multi-role-assistant";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.54-multi-role-assistant";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.54-multi-role-assistant";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.54-multi-role-assistant";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.54-multi-role-assistant";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.54-multi-role-assistant";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.54-multi-role-assistant";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.54-multi-role-assistant";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.54-multi-role-assistant";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.54-multi-role-assistant";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.31-student-open-context";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.54-multi-role-assistant";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.54-multi-role-assistant";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.54-multi-role-assistant";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.54-multi-role-assistant";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.54-multi-role-assistant";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.54-multi-role-assistant";


