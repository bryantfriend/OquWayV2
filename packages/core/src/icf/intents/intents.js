// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.219-course-creator-all-courses";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.219-course-creator-all-courses";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.219-course-creator-all-courses";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.219-course-creator-all-courses";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.219-course-creator-all-courses";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.219-course-creator-all-courses";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.219-course-creator-all-courses";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.219-course-creator-all-courses";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.219-course-creator-all-courses";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.219-course-creator-all-courses";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.219-course-creator-all-courses";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.219-course-creator-all-courses";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.219-course-creator-all-courses";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.219-course-creator-all-courses";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.219-course-creator-all-courses";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.219-course-creator-all-courses";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.219-course-creator-all-courses";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.219-course-creator-all-courses";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.219-course-creator-all-courses";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.219-course-creator-all-courses";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.219-course-creator-all-courses";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.219-course-creator-all-courses";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.219-course-creator-all-courses";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.219-course-creator-all-courses";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.219-course-creator-all-courses";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.219-course-creator-all-courses";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.219-course-creator-all-courses";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.219-course-creator-all-courses";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.219-course-creator-all-courses";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.219-course-creator-all-courses";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.219-course-creator-all-courses";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.219-course-creator-all-courses";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.219-course-creator-all-courses";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.219-course-creator-all-courses";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.219-course-creator-all-courses";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.219-course-creator-all-courses";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.219-course-creator-all-courses";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.219-course-creator-all-courses";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.219-course-creator-all-courses";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.219-course-creator-all-courses";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.219-course-creator-all-courses";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.219-course-creator-all-courses";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.219-course-creator-all-courses";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.219-course-creator-all-courses";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.219-course-creator-all-courses";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.219-course-creator-all-courses";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.219-course-creator-all-courses";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.219-course-creator-all-courses";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.219-course-creator-all-courses";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.219-course-creator-all-courses";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.219-course-creator-all-courses";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.219-course-creator-all-courses";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.219-course-creator-all-courses";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.219-course-creator-all-courses";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.219-course-creator-all-courses";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.219-course-creator-all-courses";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.219-course-creator-all-courses";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.219-course-creator-all-courses";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.219-course-creator-all-courses";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.219-course-creator-all-courses";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.219-course-creator-all-courses";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.219-course-creator-all-courses";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.219-course-creator-all-courses";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.219-course-creator-all-courses";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.219-course-creator-all-courses";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.219-course-creator-all-courses";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.219-course-creator-all-courses";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.219-course-creator-all-courses";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.219-course-creator-all-courses";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.219-course-creator-all-courses";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.219-course-creator-all-courses";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.219-course-creator-all-courses";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.219-course-creator-all-courses";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.219-course-creator-all-courses";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.219-course-creator-all-courses";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.219-course-creator-all-courses";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.219-course-creator-all-courses";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.219-course-creator-all-courses";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.219-course-creator-all-courses";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.219-course-creator-all-courses";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.219-course-creator-all-courses";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.219-course-creator-all-courses";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.219-course-creator-all-courses";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.219-course-creator-all-courses";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.219-course-creator-all-courses";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.219-course-creator-all-courses";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.219-course-creator-all-courses";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.219-course-creator-all-courses";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.219-course-creator-all-courses";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.219-course-creator-all-courses";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.219-course-creator-all-courses";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.219-course-creator-all-courses";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.219-course-creator-all-courses";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.219-course-creator-all-courses";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.219-course-creator-all-courses";


