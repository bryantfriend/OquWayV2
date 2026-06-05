// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.63-external-task-student-feedback";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.63-external-task-student-feedback";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.63-external-task-student-feedback";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.63-external-task-student-feedback";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.63-external-task-student-feedback";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.63-external-task-student-feedback";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.63-external-task-student-feedback";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.63-external-task-student-feedback";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.63-external-task-student-feedback";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.63-external-task-student-feedback";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.63-external-task-student-feedback";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.63-external-task-student-feedback";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.63-external-task-student-feedback";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.63-external-task-student-feedback";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.63-external-task-student-feedback";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.63-external-task-student-feedback";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.63-external-task-student-feedback";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.63-external-task-student-feedback";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.63-external-task-student-feedback";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.63-external-task-student-feedback";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.63-external-task-student-feedback";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.63-external-task-student-feedback";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.63-external-task-student-feedback";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.63-external-task-student-feedback";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.63-external-task-student-feedback";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.63-external-task-student-feedback";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.63-external-task-student-feedback";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.63-external-task-student-feedback";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.63-external-task-student-feedback";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.63-external-task-student-feedback";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.63-external-task-student-feedback";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.63-external-task-student-feedback";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.63-external-task-student-feedback";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.63-external-task-student-feedback";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.63-external-task-student-feedback";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.63-external-task-student-feedback";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.63-external-task-student-feedback";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.63-external-task-student-feedback";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.63-external-task-student-feedback";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.63-external-task-student-feedback";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.63-external-task-student-feedback";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.63-external-task-student-feedback";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.63-external-task-student-feedback";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.63-external-task-student-feedback";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.63-external-task-student-feedback";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.63-external-task-student-feedback";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.63-external-task-student-feedback";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.63-external-task-student-feedback";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.63-external-task-student-feedback";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.63-external-task-student-feedback";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.63-external-task-student-feedback";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.63-external-task-student-feedback";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.63-external-task-student-feedback";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.63-external-task-student-feedback";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.63-external-task-student-feedback";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.63-external-task-student-feedback";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.63-external-task-student-feedback";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.63-external-task-student-feedback";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.63-external-task-student-feedback";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.63-external-task-student-feedback";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.63-external-task-student-feedback";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.63-external-task-student-feedback";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.63-external-task-student-feedback";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.63-external-task-student-feedback";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.63-external-task-student-feedback";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.63-external-task-student-feedback";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.63-external-task-student-feedback";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.63-external-task-student-feedback";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.63-external-task-student-feedback";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.63-external-task-student-feedback";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.63-external-task-student-feedback";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.63-external-task-student-feedback";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.63-external-task-student-feedback";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.63-external-task-student-feedback";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.63-external-task-student-feedback";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.63-external-task-student-feedback";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.63-external-task-student-feedback";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.63-external-task-student-feedback";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.63-external-task-student-feedback";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.63-external-task-student-feedback";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.63-external-task-student-feedback";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.63-external-task-student-feedback";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.63-external-task-student-feedback";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.63-external-task-student-feedback";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.63-external-task-student-feedback";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.63-external-task-student-feedback";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.63-external-task-student-feedback";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.63-external-task-student-feedback";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.63-external-task-student-feedback";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.63-external-task-student-feedback";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.63-external-task-student-feedback";


