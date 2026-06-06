// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.93-student-class-alias";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.93-student-class-alias";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.93-student-class-alias";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.93-student-class-alias";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.93-student-class-alias";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.93-student-class-alias";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.93-student-class-alias";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.93-student-class-alias";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.93-student-class-alias";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.93-student-class-alias";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.93-student-class-alias";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.93-student-class-alias";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.93-student-class-alias";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.93-student-class-alias";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.93-student-class-alias";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.93-student-class-alias";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.93-student-class-alias";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.93-student-class-alias";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.93-student-class-alias";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.93-student-class-alias";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.93-student-class-alias";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.93-student-class-alias";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.93-student-class-alias";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.93-student-class-alias";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.93-student-class-alias";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.93-student-class-alias";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.93-student-class-alias";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.93-student-class-alias";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.93-student-class-alias";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.93-student-class-alias";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.93-student-class-alias";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.93-student-class-alias";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.93-student-class-alias";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.93-student-class-alias";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.93-student-class-alias";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.93-student-class-alias";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.93-student-class-alias";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.93-student-class-alias";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.93-student-class-alias";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.93-student-class-alias";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.93-student-class-alias";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.93-student-class-alias";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.93-student-class-alias";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.93-student-class-alias";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.93-student-class-alias";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.93-student-class-alias";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.93-student-class-alias";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.93-student-class-alias";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.93-student-class-alias";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.93-student-class-alias";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.93-student-class-alias";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.93-student-class-alias";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.93-student-class-alias";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.93-student-class-alias";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.93-student-class-alias";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.93-student-class-alias";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.93-student-class-alias";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.93-student-class-alias";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.93-student-class-alias";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.93-student-class-alias";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.93-student-class-alias";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.93-student-class-alias";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.93-student-class-alias";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.93-student-class-alias";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.93-student-class-alias";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.93-student-class-alias";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.93-student-class-alias";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.93-student-class-alias";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.93-student-class-alias";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.93-student-class-alias";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.93-student-class-alias";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.93-student-class-alias";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.93-student-class-alias";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.93-student-class-alias";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.93-student-class-alias";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.93-student-class-alias";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.93-student-class-alias";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.93-student-class-alias";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.93-student-class-alias";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.93-student-class-alias";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.93-student-class-alias";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.93-student-class-alias";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.93-student-class-alias";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.93-student-class-alias";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.93-student-class-alias";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.93-student-class-alias";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.93-student-class-alias";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.93-student-class-alias";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.93-student-class-alias";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.93-student-class-alias";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.93-student-class-alias";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.93-student-class-alias";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.93-student-class-alias";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.93-student-class-alias";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.93-student-class-alias";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.93-student-class-alias";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.93-student-class-alias";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.93-student-class-alias";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.93-student-class-alias";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.93-student-class-alias";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.93-student-class-alias";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.93-student-class-alias";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.93-student-class-alias";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.93-student-class-alias";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.93-student-class-alias";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.93-student-class-alias";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.93-student-class-alias";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.93-student-class-alias";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.93-student-class-alias";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.93-student-class-alias";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.93-student-class-alias";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.93-student-class-alias";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.93-student-class-alias";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.93-student-class-alias";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.93-student-class-alias";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.93-student-class-alias";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.93-student-class-alias";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.93-student-class-alias";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.93-student-class-alias";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.93-student-class-alias";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.93-student-class-alias";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.93-student-class-alias";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.93-student-class-alias";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.93-student-class-alias";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.93-student-class-alias";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.93-student-class-alias";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.93-student-class-alias";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.93-student-class-alias";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.93-student-class-alias";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.93-student-class-alias";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.93-student-class-alias";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.93-student-class-alias";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.93-student-class-alias";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.93-student-class-alias";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.93-student-class-alias";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.93-student-class-alias";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.93-student-class-alias";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.93-student-class-alias";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.93-student-class-alias";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.93-student-class-alias";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.93-student-class-alias";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.93-student-class-alias";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.93-student-class-alias";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.93-student-class-alias";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.93-student-class-alias";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.93-student-class-alias";


