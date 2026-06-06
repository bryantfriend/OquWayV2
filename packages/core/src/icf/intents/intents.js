// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.88-student-course-assignment-trace";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.88-student-course-assignment-trace";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.88-student-course-assignment-trace";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.88-student-course-assignment-trace";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.88-student-course-assignment-trace";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.88-student-course-assignment-trace";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.88-student-course-assignment-trace";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.88-student-course-assignment-trace";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.88-student-course-assignment-trace";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.88-student-course-assignment-trace";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.88-student-course-assignment-trace";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.88-student-course-assignment-trace";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.88-student-course-assignment-trace";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.88-student-course-assignment-trace";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.88-student-course-assignment-trace";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.88-student-course-assignment-trace";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.88-student-course-assignment-trace";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.88-student-course-assignment-trace";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.88-student-course-assignment-trace";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.88-student-course-assignment-trace";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.88-student-course-assignment-trace";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.88-student-course-assignment-trace";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.88-student-course-assignment-trace";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.88-student-course-assignment-trace";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.88-student-course-assignment-trace";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.88-student-course-assignment-trace";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.88-student-course-assignment-trace";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.88-student-course-assignment-trace";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.88-student-course-assignment-trace";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.88-student-course-assignment-trace";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.88-student-course-assignment-trace";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.88-student-course-assignment-trace";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.88-student-course-assignment-trace";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.88-student-course-assignment-trace";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.88-student-course-assignment-trace";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.88-student-course-assignment-trace";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.88-student-course-assignment-trace";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.88-student-course-assignment-trace";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.88-student-course-assignment-trace";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.88-student-course-assignment-trace";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.88-student-course-assignment-trace";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.88-student-course-assignment-trace";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.88-student-course-assignment-trace";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.88-student-course-assignment-trace";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.88-student-course-assignment-trace";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.88-student-course-assignment-trace";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.88-student-course-assignment-trace";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.88-student-course-assignment-trace";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.88-student-course-assignment-trace";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.88-student-course-assignment-trace";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.88-student-course-assignment-trace";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.88-student-course-assignment-trace";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.88-student-course-assignment-trace";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.88-student-course-assignment-trace";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.88-student-course-assignment-trace";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.88-student-course-assignment-trace";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.88-student-course-assignment-trace";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.88-student-course-assignment-trace";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.88-student-course-assignment-trace";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.88-student-course-assignment-trace";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.88-student-course-assignment-trace";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.88-student-course-assignment-trace";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.88-student-course-assignment-trace";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.88-student-course-assignment-trace";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.88-student-course-assignment-trace";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.88-student-course-assignment-trace";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.88-student-course-assignment-trace";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.88-student-course-assignment-trace";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.88-student-course-assignment-trace";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.88-student-course-assignment-trace";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.88-student-course-assignment-trace";


