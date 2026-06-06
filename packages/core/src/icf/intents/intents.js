// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.90-student-profile-handoff";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.90-student-profile-handoff";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.90-student-profile-handoff";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.90-student-profile-handoff";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.90-student-profile-handoff";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.90-student-profile-handoff";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.90-student-profile-handoff";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.90-student-profile-handoff";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.90-student-profile-handoff";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.90-student-profile-handoff";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.90-student-profile-handoff";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.90-student-profile-handoff";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.90-student-profile-handoff";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.90-student-profile-handoff";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.90-student-profile-handoff";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.90-student-profile-handoff";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.90-student-profile-handoff";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.90-student-profile-handoff";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.90-student-profile-handoff";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.90-student-profile-handoff";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.90-student-profile-handoff";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.90-student-profile-handoff";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.90-student-profile-handoff";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.90-student-profile-handoff";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.90-student-profile-handoff";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.90-student-profile-handoff";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.90-student-profile-handoff";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.90-student-profile-handoff";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.90-student-profile-handoff";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.90-student-profile-handoff";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.90-student-profile-handoff";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.90-student-profile-handoff";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.90-student-profile-handoff";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.90-student-profile-handoff";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.90-student-profile-handoff";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.90-student-profile-handoff";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.90-student-profile-handoff";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.90-student-profile-handoff";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.90-student-profile-handoff";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.90-student-profile-handoff";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.90-student-profile-handoff";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.90-student-profile-handoff";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.90-student-profile-handoff";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.90-student-profile-handoff";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.90-student-profile-handoff";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.90-student-profile-handoff";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.90-student-profile-handoff";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.90-student-profile-handoff";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.90-student-profile-handoff";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.90-student-profile-handoff";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.90-student-profile-handoff";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.90-student-profile-handoff";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.90-student-profile-handoff";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.90-student-profile-handoff";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.90-student-profile-handoff";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.90-student-profile-handoff";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.90-student-profile-handoff";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.90-student-profile-handoff";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.90-student-profile-handoff";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.90-student-profile-handoff";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.90-student-profile-handoff";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.90-student-profile-handoff";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.90-student-profile-handoff";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.90-student-profile-handoff";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.90-student-profile-handoff";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.90-student-profile-handoff";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.90-student-profile-handoff";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.90-student-profile-handoff";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.90-student-profile-handoff";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.90-student-profile-handoff";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.90-student-profile-handoff";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.90-student-profile-handoff";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.90-student-profile-handoff";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.90-student-profile-handoff";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.90-student-profile-handoff";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.90-student-profile-handoff";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.90-student-profile-handoff";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.90-student-profile-handoff";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.90-student-profile-handoff";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.90-student-profile-handoff";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.90-student-profile-handoff";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.90-student-profile-handoff";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.90-student-profile-handoff";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.90-student-profile-handoff";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.90-student-profile-handoff";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.90-student-profile-handoff";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.90-student-profile-handoff";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.90-student-profile-handoff";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.90-student-profile-handoff";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.90-student-profile-handoff";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.90-student-profile-handoff";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.90-student-profile-handoff";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.90-student-profile-handoff";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.90-student-profile-handoff";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.90-student-profile-handoff";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.90-student-profile-handoff";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.90-student-profile-handoff";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.90-student-profile-handoff";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.90-student-profile-handoff";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.90-student-profile-handoff";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.90-student-profile-handoff";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.90-student-profile-handoff";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.90-student-profile-handoff";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.90-student-profile-handoff";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.90-student-profile-handoff";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.90-student-profile-handoff";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.90-student-profile-handoff";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.90-student-profile-handoff";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.90-student-profile-handoff";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.90-student-profile-handoff";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.90-student-profile-handoff";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.90-student-profile-handoff";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.90-student-profile-handoff";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.90-student-profile-handoff";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.90-student-profile-handoff";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.90-student-profile-handoff";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.90-student-profile-handoff";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.90-student-profile-handoff";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.90-student-profile-handoff";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.90-student-profile-handoff";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.90-student-profile-handoff";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.90-student-profile-handoff";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.90-student-profile-handoff";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.90-student-profile-handoff";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.90-student-profile-handoff";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.90-student-profile-handoff";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.90-student-profile-handoff";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.90-student-profile-handoff";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.90-student-profile-handoff";


