// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.94-student-profile-context";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.94-student-profile-context";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.94-student-profile-context";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.94-student-profile-context";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.94-student-profile-context";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.94-student-profile-context";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.94-student-profile-context";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.94-student-profile-context";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.94-student-profile-context";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.94-student-profile-context";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.94-student-profile-context";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.94-student-profile-context";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.94-student-profile-context";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.94-student-profile-context";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.94-student-profile-context";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.94-student-profile-context";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.94-student-profile-context";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.94-student-profile-context";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.94-student-profile-context";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.94-student-profile-context";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.94-student-profile-context";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.94-student-profile-context";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.94-student-profile-context";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.94-student-profile-context";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.94-student-profile-context";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.94-student-profile-context";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.94-student-profile-context";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.94-student-profile-context";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.94-student-profile-context";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.94-student-profile-context";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.94-student-profile-context";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.94-student-profile-context";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.94-student-profile-context";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.94-student-profile-context";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.94-student-profile-context";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.94-student-profile-context";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.94-student-profile-context";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.94-student-profile-context";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.94-student-profile-context";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.94-student-profile-context";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.94-student-profile-context";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.94-student-profile-context";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.94-student-profile-context";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.94-student-profile-context";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.94-student-profile-context";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.94-student-profile-context";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.94-student-profile-context";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.94-student-profile-context";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.94-student-profile-context";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.94-student-profile-context";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.94-student-profile-context";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.94-student-profile-context";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.94-student-profile-context";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.94-student-profile-context";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.94-student-profile-context";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.94-student-profile-context";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.94-student-profile-context";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.94-student-profile-context";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.94-student-profile-context";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.94-student-profile-context";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.94-student-profile-context";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.94-student-profile-context";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.94-student-profile-context";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.94-student-profile-context";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.94-student-profile-context";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.94-student-profile-context";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.94-student-profile-context";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.94-student-profile-context";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.94-student-profile-context";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.94-student-profile-context";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.94-student-profile-context";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.94-student-profile-context";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.94-student-profile-context";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.94-student-profile-context";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.94-student-profile-context";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.94-student-profile-context";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.94-student-profile-context";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.94-student-profile-context";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.94-student-profile-context";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.94-student-profile-context";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.94-student-profile-context";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.94-student-profile-context";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.94-student-profile-context";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.94-student-profile-context";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.94-student-profile-context";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.94-student-profile-context";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.94-student-profile-context";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.94-student-profile-context";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.94-student-profile-context";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.94-student-profile-context";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.94-student-profile-context";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.94-student-profile-context";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.94-student-profile-context";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.94-student-profile-context";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.94-student-profile-context";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.94-student-profile-context";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.94-student-profile-context";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.94-student-profile-context";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.94-student-profile-context";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.94-student-profile-context";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.94-student-profile-context";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.94-student-profile-context";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.94-student-profile-context";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.94-student-profile-context";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.94-student-profile-context";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.94-student-profile-context";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.94-student-profile-context";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.94-student-profile-context";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.94-student-profile-context";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.94-student-profile-context";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.94-student-profile-context";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.94-student-profile-context";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.94-student-profile-context";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.94-student-profile-context";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.94-student-profile-context";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.94-student-profile-context";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.94-student-profile-context";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.94-student-profile-context";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.94-student-profile-context";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.94-student-profile-context";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.94-student-profile-context";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.94-student-profile-context";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.94-student-profile-context";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.94-student-profile-context";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.94-student-profile-context";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.94-student-profile-context";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.94-student-profile-context";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.94-student-profile-context";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.94-student-profile-context";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.94-student-profile-context";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.94-student-profile-context";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.94-student-profile-context";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.94-student-profile-context";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.94-student-profile-context";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.94-student-profile-context";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.94-student-profile-context";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.94-student-profile-context";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.94-student-profile-context";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.94-student-profile-context";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.94-student-profile-context";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.94-student-profile-context";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.94-student-profile-context";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.94-student-profile-context";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.94-student-profile-context";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.94-student-profile-context";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.94-student-profile-context";


