// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.120-student-course-debug-summary";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.120-student-course-debug-summary";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.120-student-course-debug-summary";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.120-student-course-debug-summary";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.120-student-course-debug-summary";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.120-student-course-debug-summary";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.120-student-course-debug-summary";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.120-student-course-debug-summary";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.120-student-course-debug-summary";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.120-student-course-debug-summary";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.120-student-course-debug-summary";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.120-student-course-debug-summary";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.120-student-course-debug-summary";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.120-student-course-debug-summary";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.120-student-course-debug-summary";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.120-student-course-debug-summary";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.120-student-course-debug-summary";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.120-student-course-debug-summary";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.120-student-course-debug-summary";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.120-student-course-debug-summary";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.120-student-course-debug-summary";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.120-student-course-debug-summary";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.120-student-course-debug-summary";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.120-student-course-debug-summary";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.120-student-course-debug-summary";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.120-student-course-debug-summary";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.120-student-course-debug-summary";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.120-student-course-debug-summary";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.120-student-course-debug-summary";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.120-student-course-debug-summary";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.120-student-course-debug-summary";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.120-student-course-debug-summary";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.120-student-course-debug-summary";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.120-student-course-debug-summary";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.120-student-course-debug-summary";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.120-student-course-debug-summary";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.120-student-course-debug-summary";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.120-student-course-debug-summary";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.120-student-course-debug-summary";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.120-student-course-debug-summary";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.120-student-course-debug-summary";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.120-student-course-debug-summary";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.120-student-course-debug-summary";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.120-student-course-debug-summary";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.120-student-course-debug-summary";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.120-student-course-debug-summary";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.120-student-course-debug-summary";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.120-student-course-debug-summary";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.120-student-course-debug-summary";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.120-student-course-debug-summary";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.120-student-course-debug-summary";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.120-student-course-debug-summary";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.120-student-course-debug-summary";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.120-student-course-debug-summary";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.120-student-course-debug-summary";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.120-student-course-debug-summary";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.120-student-course-debug-summary";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.120-student-course-debug-summary";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.120-student-course-debug-summary";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.120-student-course-debug-summary";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.120-student-course-debug-summary";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.120-student-course-debug-summary";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.120-student-course-debug-summary";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.120-student-course-debug-summary";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.120-student-course-debug-summary";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.120-student-course-debug-summary";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.120-student-course-debug-summary";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.120-student-course-debug-summary";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.120-student-course-debug-summary";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.120-student-course-debug-summary";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.120-student-course-debug-summary";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.120-student-course-debug-summary";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.120-student-course-debug-summary";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.120-student-course-debug-summary";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.120-student-course-debug-summary";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.120-student-course-debug-summary";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.120-student-course-debug-summary";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.120-student-course-debug-summary";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.120-student-course-debug-summary";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.120-student-course-debug-summary";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.120-student-course-debug-summary";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.120-student-course-debug-summary";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.120-student-course-debug-summary";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.120-student-course-debug-summary";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.120-student-course-debug-summary";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.120-student-course-debug-summary";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.120-student-course-debug-summary";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.120-student-course-debug-summary";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.120-student-course-debug-summary";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.120-student-course-debug-summary";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.120-student-course-debug-summary";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.120-student-course-debug-summary";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.120-student-course-debug-summary";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.120-student-course-debug-summary";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.120-student-course-debug-summary";


