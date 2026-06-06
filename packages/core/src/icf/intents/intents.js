// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.100-student-profile-actor";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.100-student-profile-actor";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.100-student-profile-actor";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.100-student-profile-actor";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.100-student-profile-actor";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.100-student-profile-actor";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.100-student-profile-actor";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.100-student-profile-actor";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.100-student-profile-actor";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.100-student-profile-actor";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.100-student-profile-actor";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.100-student-profile-actor";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.100-student-profile-actor";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.100-student-profile-actor";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.100-student-profile-actor";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.100-student-profile-actor";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.100-student-profile-actor";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.100-student-profile-actor";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.100-student-profile-actor";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.100-student-profile-actor";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.100-student-profile-actor";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.100-student-profile-actor";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.100-student-profile-actor";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.100-student-profile-actor";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.100-student-profile-actor";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.100-student-profile-actor";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.100-student-profile-actor";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.100-student-profile-actor";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.100-student-profile-actor";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.100-student-profile-actor";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.100-student-profile-actor";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.100-student-profile-actor";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.100-student-profile-actor";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.100-student-profile-actor";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.100-student-profile-actor";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.100-student-profile-actor";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.100-student-profile-actor";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.100-student-profile-actor";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.100-student-profile-actor";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.100-student-profile-actor";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.100-student-profile-actor";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.100-student-profile-actor";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.100-student-profile-actor";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.100-student-profile-actor";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.100-student-profile-actor";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.100-student-profile-actor";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.100-student-profile-actor";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.100-student-profile-actor";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.100-student-profile-actor";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.100-student-profile-actor";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.100-student-profile-actor";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.100-student-profile-actor";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.100-student-profile-actor";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.100-student-profile-actor";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.100-student-profile-actor";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.100-student-profile-actor";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.100-student-profile-actor";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.100-student-profile-actor";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.100-student-profile-actor";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.100-student-profile-actor";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.100-student-profile-actor";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.100-student-profile-actor";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.100-student-profile-actor";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.100-student-profile-actor";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.100-student-profile-actor";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.100-student-profile-actor";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.100-student-profile-actor";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.100-student-profile-actor";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.100-student-profile-actor";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.100-student-profile-actor";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.100-student-profile-actor";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.100-student-profile-actor";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.100-student-profile-actor";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.100-student-profile-actor";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.100-student-profile-actor";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.100-student-profile-actor";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.100-student-profile-actor";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.100-student-profile-actor";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.100-student-profile-actor";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.100-student-profile-actor";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.100-student-profile-actor";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.100-student-profile-actor";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.100-student-profile-actor";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.100-student-profile-actor";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.100-student-profile-actor";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.100-student-profile-actor";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.100-student-profile-actor";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.100-student-profile-actor";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.100-student-profile-actor";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.100-student-profile-actor";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.100-student-profile-actor";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.100-student-profile-actor";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.100-student-profile-actor";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.100-student-profile-actor";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.100-student-profile-actor";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.100-student-profile-actor";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.100-student-profile-actor";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.100-student-profile-actor";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.100-student-profile-actor";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.100-student-profile-actor";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.100-student-profile-actor";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.100-student-profile-actor";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.100-student-profile-actor";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.100-student-profile-actor";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.100-student-profile-actor";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.100-student-profile-actor";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.100-student-profile-actor";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.100-student-profile-actor";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.100-student-profile-actor";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.100-student-profile-actor";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.100-student-profile-actor";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.100-student-profile-actor";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.100-student-profile-actor";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.100-student-profile-actor";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.100-student-profile-actor";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.100-student-profile-actor";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.100-student-profile-actor";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.100-student-profile-actor";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.100-student-profile-actor";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.100-student-profile-actor";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.100-student-profile-actor";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.100-student-profile-actor";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.100-student-profile-actor";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.100-student-profile-actor";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.100-student-profile-actor";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.100-student-profile-actor";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.100-student-profile-actor";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.100-student-profile-actor";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.100-student-profile-actor";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.100-student-profile-actor";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.100-student-profile-actor";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.100-student-profile-actor";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.100-student-profile-actor";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.100-student-profile-actor";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.100-student-profile-actor";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.100-student-profile-actor";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.100-student-profile-actor";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.100-student-profile-actor";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.100-student-profile-actor";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.100-student-profile-actor";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.100-student-profile-actor";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.100-student-profile-actor";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.100-student-profile-actor";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.100-student-profile-actor";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.100-student-profile-actor";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.100-student-profile-actor";


