// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.210-student-course-hydration";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.210-student-course-hydration";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.210-student-course-hydration";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.210-student-course-hydration";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.210-student-course-hydration";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.210-student-course-hydration";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.210-student-course-hydration";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.210-student-course-hydration";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.210-student-course-hydration";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.210-student-course-hydration";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.210-student-course-hydration";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.210-student-course-hydration";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.210-student-course-hydration";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.210-student-course-hydration";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.210-student-course-hydration";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.210-student-course-hydration";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.210-student-course-hydration";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.210-student-course-hydration";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.210-student-course-hydration";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.210-student-course-hydration";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.210-student-course-hydration";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.210-student-course-hydration";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.210-student-course-hydration";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.210-student-course-hydration";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.210-student-course-hydration";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.210-student-course-hydration";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.210-student-course-hydration";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.210-student-course-hydration";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.210-student-course-hydration";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.210-student-course-hydration";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.210-student-course-hydration";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.210-student-course-hydration";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.210-student-course-hydration";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.210-student-course-hydration";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.210-student-course-hydration";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.210-student-course-hydration";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.210-student-course-hydration";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.210-student-course-hydration";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.210-student-course-hydration";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.210-student-course-hydration";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.210-student-course-hydration";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.210-student-course-hydration";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.210-student-course-hydration";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Emotional Check-Ins
// ----------------------
export { RecordEmotionalCheckInIntent } from "./emotionalCheckIn/RecordEmotionalCheckInIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.210-student-course-hydration";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.210-student-course-hydration";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.194-lesson-monitor";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.210-student-course-hydration";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.210-student-course-hydration";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.210-student-course-hydration";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.210-student-course-hydration";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.210-student-course-hydration";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.210-student-course-hydration";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.210-student-course-hydration";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.210-student-course-hydration";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.210-student-course-hydration";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.210-student-course-hydration";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.210-student-course-hydration";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.210-student-course-hydration";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.210-student-course-hydration";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.210-student-course-hydration";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.210-student-course-hydration";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.210-student-course-hydration";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.210-student-course-hydration";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.210-student-course-hydration";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.210-student-course-hydration";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.210-student-course-hydration";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.210-student-course-hydration";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.210-student-course-hydration";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.210-student-course-hydration";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.210-student-course-hydration";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.210-student-course-hydration";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.210-student-course-hydration";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.210-student-course-hydration";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.210-student-course-hydration";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.210-student-course-hydration";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.210-student-course-hydration";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.210-student-course-hydration";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.210-student-course-hydration";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.210-student-course-hydration";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.210-student-course-hydration";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.210-student-course-hydration";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.210-student-course-hydration";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.210-student-course-hydration";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.210-student-course-hydration";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.210-student-course-hydration";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.210-student-course-hydration";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.210-student-course-hydration";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.210-student-course-hydration";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.210-student-course-hydration";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.210-student-course-hydration";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.210-student-course-hydration";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.210-student-course-hydration";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.210-student-course-hydration";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.210-student-course-hydration";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.210-student-course-hydration";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.210-student-course-hydration";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.210-student-course-hydration";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.210-student-course-hydration";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.210-student-course-hydration";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.210-student-course-hydration";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.210-student-course-hydration";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.210-student-course-hydration";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.210-student-course-hydration";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.210-student-course-hydration";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.210-student-course-hydration";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.210-student-course-hydration";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.210-student-course-hydration";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.210-student-course-hydration";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.210-student-course-hydration";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.210-student-course-hydration";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.210-student-course-hydration";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.210-student-course-hydration";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.210-student-course-hydration";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.210-student-course-hydration";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.210-student-course-hydration";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.210-student-course-hydration";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.210-student-course-hydration";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.210-student-course-hydration";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.210-student-course-hydration";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.210-student-course-hydration";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.210-student-course-hydration";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.210-student-course-hydration";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.210-student-course-hydration";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.210-student-course-hydration";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.210-student-course-hydration";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.210-student-course-hydration";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.210-student-course-hydration";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.210-student-course-hydration";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.203-step-media-upload";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.210-student-course-hydration";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.210-student-course-hydration";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.210-student-course-hydration";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.210-student-course-hydration";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.210-student-course-hydration";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.210-student-course-hydration";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.210-student-course-hydration";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.210-student-course-hydration";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.210-student-course-hydration";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.210-student-course-hydration";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.210-student-course-hydration";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.210-student-course-hydration";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.210-student-course-hydration";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.210-student-course-hydration";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.210-student-course-hydration";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.210-student-course-hydration";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.210-student-course-hydration";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.210-student-course-hydration";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.210-student-course-hydration";
