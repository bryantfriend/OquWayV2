// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.154-emotional-check-in-prototype";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.134-archive-course-assignments";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.154-emotional-check-in-prototype";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.154-emotional-check-in-prototype";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.154-emotional-check-in-prototype";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.154-emotional-check-in-prototype";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.154-emotional-check-in-prototype";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.154-emotional-check-in-prototype";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.154-emotional-check-in-prototype";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.154-emotional-check-in-prototype";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.154-emotional-check-in-prototype";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { RestoreCourseIntent } from "./course/RestoreCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { PermanentlyDeleteCourseIntent } from "./course/PermanentlyDeleteCourseIntent.js?v=1.1.154-emotional-check-in-prototype";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.154-emotional-check-in-prototype";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.154-emotional-check-in-prototype";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.154-emotional-check-in-prototype";

// ----------------------
// Emotional Check-Ins
// ----------------------
export { RecordEmotionalCheckInIntent } from "./emotionalCheckIn/RecordEmotionalCheckInIntent.js?v=1.1.161-universal-check-in";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.129-teacher-query-noise";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.129-teacher-query-noise";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.129-teacher-query-noise";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.154-emotional-check-in-prototype";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.154-emotional-check-in-prototype";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.154-emotional-check-in-prototype";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.154-emotional-check-in-prototype";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.154-emotional-check-in-prototype";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.154-emotional-check-in-prototype";
export { OpenClassCommandCenterIntent } from "./superAdmin/OpenClassCommandCenterIntent.js?v=1.1.154-emotional-check-in-prototype";
export { OpenCourseCommandCenterIntent } from "./superAdmin/OpenCourseCommandCenterIntent.js?v=1.1.154-emotional-check-in-prototype";
export { OpenModuleCommandCenterIntent } from "./superAdmin/OpenModuleCommandCenterIntent.js?v=1.1.154-emotional-check-in-prototype";
export { OpenUserCommandCenterIntent } from "./superAdmin/OpenUserCommandCenterIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.154-emotional-check-in-prototype";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.154-emotional-check-in-prototype";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.154-emotional-check-in-prototype";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.154-emotional-check-in-prototype";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.154-emotional-check-in-prototype";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.154-emotional-check-in-prototype";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.154-emotional-check-in-prototype";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.154-emotional-check-in-prototype";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.154-emotional-check-in-prototype";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.154-emotional-check-in-prototype";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.154-emotional-check-in-prototype";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.154-emotional-check-in-prototype";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.154-emotional-check-in-prototype";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.154-emotional-check-in-prototype";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.154-emotional-check-in-prototype";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.154-emotional-check-in-prototype";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.154-emotional-check-in-prototype";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.154-emotional-check-in-prototype";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.154-emotional-check-in-prototype";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.151-student-loading-practice-context";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.151-student-loading-practice-context";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.151-student-loading-practice-context";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.151-student-loading-practice-context";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.151-student-loading-practice-context";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.154-emotional-check-in-prototype";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.154-emotional-check-in-prototype";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.154-emotional-check-in-prototype";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.151-student-loading-practice-context";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.151-student-loading-practice-context";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.151-student-loading-practice-context";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.151-student-loading-practice-context";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.151-student-loading-practice-context";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.151-student-loading-practice-context";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.151-student-loading-practice-context";
