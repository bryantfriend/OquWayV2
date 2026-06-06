// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.108-student-class-alias-merge";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.108-student-class-alias-merge";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.108-student-class-alias-merge";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.108-student-class-alias-merge";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.108-student-class-alias-merge";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.108-student-class-alias-merge";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.108-student-class-alias-merge";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.108-student-class-alias-merge";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.108-student-class-alias-merge";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.108-student-class-alias-merge";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.108-student-class-alias-merge";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.108-student-class-alias-merge";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.108-student-class-alias-merge";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.108-student-class-alias-merge";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.108-student-class-alias-merge";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.108-student-class-alias-merge";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.108-student-class-alias-merge";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.108-student-class-alias-merge";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.108-student-class-alias-merge";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.108-student-class-alias-merge";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.108-student-class-alias-merge";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.108-student-class-alias-merge";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.108-student-class-alias-merge";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.108-student-class-alias-merge";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.108-student-class-alias-merge";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.108-student-class-alias-merge";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.108-student-class-alias-merge";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.108-student-class-alias-merge";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.108-student-class-alias-merge";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.108-student-class-alias-merge";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.108-student-class-alias-merge";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.108-student-class-alias-merge";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.108-student-class-alias-merge";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.108-student-class-alias-merge";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.108-student-class-alias-merge";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.108-student-class-alias-merge";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.108-student-class-alias-merge";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.108-student-class-alias-merge";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.108-student-class-alias-merge";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.108-student-class-alias-merge";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.108-student-class-alias-merge";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.108-student-class-alias-merge";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.108-student-class-alias-merge";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.108-student-class-alias-merge";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.108-student-class-alias-merge";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.108-student-class-alias-merge";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.108-student-class-alias-merge";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.108-student-class-alias-merge";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.108-student-class-alias-merge";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.108-student-class-alias-merge";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.108-student-class-alias-merge";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.108-student-class-alias-merge";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.108-student-class-alias-merge";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.108-student-class-alias-merge";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.108-student-class-alias-merge";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.108-student-class-alias-merge";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.108-student-class-alias-merge";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.108-student-class-alias-merge";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.108-student-class-alias-merge";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.108-student-class-alias-merge";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.108-student-class-alias-merge";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.108-student-class-alias-merge";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.108-student-class-alias-merge";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.108-student-class-alias-merge";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.108-student-class-alias-merge";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.108-student-class-alias-merge";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.108-student-class-alias-merge";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.108-student-class-alias-merge";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.108-student-class-alias-merge";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.108-student-class-alias-merge";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.108-student-class-alias-merge";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.108-student-class-alias-merge";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.108-student-class-alias-merge";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.108-student-class-alias-merge";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.108-student-class-alias-merge";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.108-student-class-alias-merge";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.108-student-class-alias-merge";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.108-student-class-alias-merge";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.108-student-class-alias-merge";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.108-student-class-alias-merge";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.108-student-class-alias-merge";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.108-student-class-alias-merge";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.108-student-class-alias-merge";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.108-student-class-alias-merge";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.108-student-class-alias-merge";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.108-student-class-alias-merge";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.108-student-class-alias-merge";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.108-student-class-alias-merge";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.108-student-class-alias-merge";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.108-student-class-alias-merge";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.108-student-class-alias-merge";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.108-student-class-alias-merge";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.108-student-class-alias-merge";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.108-student-class-alias-merge";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.108-student-class-alias-merge";


