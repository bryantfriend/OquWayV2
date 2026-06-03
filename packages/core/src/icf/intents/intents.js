// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.29-module-render-fix";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.29-module-render-fix";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.29-module-render-fix";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.29-module-render-fix";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.29-module-render-fix";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.29-module-render-fix";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.29-module-render-fix";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.29-module-render-fix";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.29-module-render-fix";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.29-module-render-fix";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.29-module-render-fix";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.29-module-render-fix";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.29-module-render-fix";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.29-module-render-fix";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.29-module-render-fix";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.29-module-render-fix";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.29-module-render-fix";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.29-module-render-fix";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.29-module-render-fix";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.29-module-render-fix";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.29-module-render-fix";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.29-module-render-fix";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.29-module-render-fix";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.33-course-counts";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.29-module-render-fix";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.29-module-render-fix";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.29-module-render-fix";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.29-module-render-fix";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.29-module-render-fix";

// ----------------------
// Course Assignments
// ----------------------
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.29-module-render-fix";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.29-module-render-fix";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.29-module-render-fix";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.29-module-render-fix";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.29-module-render-fix";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.29-module-render-fix";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.29-module-render-fix";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.34-external-task-mvp";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.34-external-task-mvp";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.34-external-task-mvp";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.34-external-task-mvp";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.36-teacher-auth";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.34-external-task-mvp";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.36-teacher-auth";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.36-teacher-auth";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.36-teacher-auth";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.36-teacher-auth";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.36-teacher-auth";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.36-teacher-auth";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.29-module-render-fix";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.29-module-render-fix";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.29-module-render-fix";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.29-module-render-fix";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.29-module-render-fix";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.29-module-render-fix";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.29-module-render-fix";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.29-module-render-fix";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.29-module-render-fix";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.29-module-render-fix";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.29-module-render-fix";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.29-module-render-fix";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.29-module-render-fix";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.29-module-render-fix";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.29-module-render-fix";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.29-module-render-fix";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.29-module-render-fix";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.29-module-render-fix";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.29-module-render-fix";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.29-module-render-fix";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.29-module-render-fix";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.29-module-render-fix";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.29-module-render-fix";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.29-module-render-fix";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.29-module-render-fix";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.29-module-render-fix";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.29-module-render-fix";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.29-module-render-fix";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.29-module-render-fix";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.29-module-render-fix";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.29-module-render-fix";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.29-module-render-fix";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.29-module-render-fix";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.29-module-render-fix";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.29-module-render-fix";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.29-module-render-fix";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.29-module-render-fix";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.29-module-render-fix";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.29-module-render-fix";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.29-module-render-fix";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.29-module-render-fix";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.29-module-render-fix";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.29-module-render-fix";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.29-module-render-fix";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.29-module-render-fix";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.29-module-render-fix";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.29-module-render-fix";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.29-module-render-fix";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.29-module-render-fix";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.29-module-render-fix";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.29-module-render-fix";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.29-module-render-fix";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.29-module-render-fix";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.29-module-render-fix";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.29-module-render-fix";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.29-module-render-fix";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.29-module-render-fix";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.29-module-render-fix";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.29-module-render-fix";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.29-module-render-fix";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.29-module-render-fix";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.29-module-render-fix";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.29-module-render-fix";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.29-module-render-fix";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.29-module-render-fix";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.29-module-render-fix";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.29-module-render-fix";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.29-module-render-fix";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.29-module-render-fix";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.29-module-render-fix";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.29-module-render-fix";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.29-module-render-fix";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.29-module-render-fix";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.29-module-render-fix";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.29-module-render-fix";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.29-module-render-fix";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.29-module-render-fix";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.29-module-render-fix";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.29-module-render-fix";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.29-module-render-fix";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.29-module-render-fix";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.29-module-render-fix";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.29-module-render-fix";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.29-module-render-fix";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.29-module-render-fix";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.29-module-render-fix";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.31-student-open-context";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.29-module-render-fix";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.29-module-render-fix";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.29-module-render-fix";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.29-module-render-fix";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.29-module-render-fix";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.29-module-render-fix";
