// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.61-assignment-ownership-read";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.61-assignment-ownership-read";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.61-assignment-ownership-read";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.61-assignment-ownership-read";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.61-assignment-ownership-read";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.61-assignment-ownership-read";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.61-assignment-ownership-read";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.61-assignment-ownership-read";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.61-assignment-ownership-read";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.61-assignment-ownership-read";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.61-assignment-ownership-read";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.61-assignment-ownership-read";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.61-assignment-ownership-read";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.61-assignment-ownership-read";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.61-assignment-ownership-read";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.61-assignment-ownership-read";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.33-course-counts";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.61-assignment-ownership-read";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.61-assignment-ownership-read";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.61-assignment-ownership-read";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.61-assignment-ownership-read";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.61-assignment-ownership-read";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.61-assignment-ownership-read";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.61-assignment-ownership-read";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.61-assignment-ownership-read";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.61-assignment-ownership-read";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.34-external-task-mvp";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.34-external-task-mvp";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.34-external-task-mvp";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.34-external-task-mvp";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.61-assignment-ownership-read";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.34-external-task-mvp";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.61-assignment-ownership-read";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.61-assignment-ownership-read";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.61-assignment-ownership-read";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.61-assignment-ownership-read";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.61-assignment-ownership-read";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.61-assignment-ownership-read";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.61-assignment-ownership-read";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.61-assignment-ownership-read";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.55-class-ownership";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.55-class-ownership";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.55-class-ownership";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.61-assignment-ownership-read";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.61-assignment-ownership-read";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.55-class-ownership";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.55-class-ownership";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.61-assignment-ownership-read";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.61-assignment-ownership-read";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.55-class-ownership";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.61-assignment-ownership-read";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.61-assignment-ownership-read";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.61-assignment-ownership-read";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.61-assignment-ownership-read";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.61-assignment-ownership-read";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.61-assignment-ownership-read";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.61-assignment-ownership-read";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.61-assignment-ownership-read";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.61-assignment-ownership-read";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.61-assignment-ownership-read";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.61-assignment-ownership-read";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.61-assignment-ownership-read";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.61-assignment-ownership-read";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.61-assignment-ownership-read";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.61-assignment-ownership-read";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.61-assignment-ownership-read";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.61-assignment-ownership-read";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.61-assignment-ownership-read";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.61-assignment-ownership-read";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.61-assignment-ownership-read";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.61-assignment-ownership-read";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.61-assignment-ownership-read";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.61-assignment-ownership-read";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.61-assignment-ownership-read";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.61-assignment-ownership-read";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.61-assignment-ownership-read";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.61-assignment-ownership-read";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.61-assignment-ownership-read";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.61-assignment-ownership-read";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.61-assignment-ownership-read";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.61-assignment-ownership-read";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.61-assignment-ownership-read";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.61-assignment-ownership-read";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.61-assignment-ownership-read";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.61-assignment-ownership-read";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.61-assignment-ownership-read";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.61-assignment-ownership-read";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.61-assignment-ownership-read";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.61-assignment-ownership-read";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.61-assignment-ownership-read";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.61-assignment-ownership-read";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.61-assignment-ownership-read";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.61-assignment-ownership-read";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.61-assignment-ownership-read";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.61-assignment-ownership-read";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.61-assignment-ownership-read";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.31-student-open-context";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.61-assignment-ownership-read";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.61-assignment-ownership-read";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.61-assignment-ownership-read";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.61-assignment-ownership-read";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.61-assignment-ownership-read";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.61-assignment-ownership-read";


