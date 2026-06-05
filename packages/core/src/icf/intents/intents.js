// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js?v=1.1.73-student-course-polish";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js?v=1.1.73-student-course-polish";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js?v=1.1.73-student-course-polish";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js?v=1.1.73-student-course-polish";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js?v=1.1.73-student-course-polish";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js?v=1.1.73-student-course-polish";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js?v=1.1.73-student-course-polish";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js?v=1.1.73-student-course-polish";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js?v=1.1.73-student-course-polish";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js?v=1.1.73-student-course-polish";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js?v=1.1.73-student-course-polish";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js?v=1.1.73-student-course-polish";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js?v=1.1.73-student-course-polish";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js?v=1.1.73-student-course-polish";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js?v=1.1.73-student-course-polish";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js?v=1.1.73-student-course-polish";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js?v=1.1.73-student-course-polish";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js?v=1.1.73-student-course-polish";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js?v=1.1.73-student-course-polish";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js?v=1.1.73-student-course-polish";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js?v=1.1.73-student-course-polish";
export { LoadCoursesIntent } from "./course/LoadCoursesIntent.js?v=1.1.73-student-course-polish";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js?v=1.1.73-student-course-polish";
export { UpdateCourseIntent } from "./course/UpdateCourseIntent.js?v=1.1.73-student-course-polish";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js?v=1.1.73-student-course-polish";
export { DeleteCourseIntent } from "./course/DeleteCourseIntent.js?v=1.1.73-student-course-polish";
export { ArchiveCourseIntent } from "./course/ArchiveCourseIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// Course Assignments
// ----------------------
export { AssignCourseAssistantsIntent } from "./courseAssignment/AssignCourseAssistantsIntent.js?v=1.1.73-student-course-polish";
export { AssignCourseTeacherIntent } from "./courseAssignment/AssignCourseTeacherIntent.js?v=1.1.73-student-course-polish";
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js?v=1.1.73-student-course-polish";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js?v=1.1.73-student-course-polish";
export { LoadCourseAssignmentOwnershipIntent } from "./courseAssignment/LoadCourseAssignmentOwnershipIntent.js?v=1.1.73-student-course-polish";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js?v=1.1.73-student-course-polish";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js?v=1.1.73-student-course-polish";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js?v=1.1.73-student-course-polish";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js?v=1.1.73-student-course-polish";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// External Tasks
// ----------------------
export { LoadExternalTaskStepIntent } from "./externalTask/LoadExternalTaskStepIntent.js?v=1.1.73-student-course-polish";
export { LoadStudentExternalTaskSubmissionIntent } from "./externalTask/LoadStudentExternalTaskSubmissionIntent.js?v=1.1.73-student-course-polish";
export { SubmitExternalTaskIntent } from "./externalTask/SubmitExternalTaskIntent.js?v=1.1.73-student-course-polish";
export { UploadExternalTaskFileIntent } from "./externalTask/UploadExternalTaskFileIntent.js?v=1.1.73-student-course-polish";
export { LoadExternalTaskSubmissionsIntent } from "./externalTask/LoadExternalTaskSubmissionsIntent.js?v=1.1.73-student-course-polish";
export { ReviewExternalTaskSubmissionIntent } from "./externalTask/ReviewExternalTaskSubmissionIntent.js?v=1.1.73-student-course-polish";
export { ResubmitExternalTaskIntent } from "./externalTask/ResubmitExternalTaskIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// Teacher Dashboard
// ----------------------
export { TeacherLoginIntent } from "./teacher/TeacherLoginIntent.js?v=1.1.73-student-course-polish";
export { LoadTeacherClassDetailIntent } from "./teacher/LoadTeacherClassDetailIntent.js?v=1.1.73-student-course-polish";
export { LoadTeacherCourseDetailIntent } from "./teacher/LoadTeacherCourseDetailIntent.js?v=1.1.73-student-course-polish";
export { LoadTeacherCoursesIntent } from "./teacher/LoadTeacherCoursesIntent.js?v=1.1.73-student-course-polish";
export { LoadTeacherDashboardIntent } from "./teacher/LoadTeacherDashboardIntent.js?v=1.1.73-student-course-polish";
export { LoadTeacherClassesIntent } from "./teacher/LoadTeacherClassesIntent.js?v=1.1.73-student-course-polish";
export { LoadTeacherStudentsIntent } from "./teacher/LoadTeacherStudentsIntent.js?v=1.1.73-student-course-polish";
export { LoadTeacherReviewQueueIntent } from "./teacher/LoadTeacherReviewQueueIntent.js?v=1.1.73-student-course-polish";
export { SendTeacherPasswordResetIntent } from "./teacher/SendTeacherPasswordResetIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js?v=1.1.73-student-course-polish";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js?v=1.1.73-student-course-polish";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js?v=1.1.73-student-course-polish";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js?v=1.1.73-student-course-polish";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js?v=1.1.73-student-course-polish";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js?v=1.1.73-student-course-polish";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js?v=1.1.73-student-course-polish";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js?v=1.1.73-student-course-polish";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js?v=1.1.73-student-course-polish";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js?v=1.1.73-student-course-polish";
export { AssignClassAssistantsIntent } from "./superAdmin/AssignClassAssistantsIntent.js?v=1.1.73-student-course-polish";
export { AssignClassTeacherIntent } from "./superAdmin/AssignClassTeacherIntent.js?v=1.1.73-student-course-polish";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js?v=1.1.73-student-course-polish";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js?v=1.1.73-student-course-polish";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js?v=1.1.73-student-course-polish";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js?v=1.1.73-student-course-polish";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js?v=1.1.73-student-course-polish";
export { LoadClassOwnershipIntent } from "./superAdmin/LoadClassOwnershipIntent.js?v=1.1.73-student-course-polish";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js?v=1.1.73-student-course-polish";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js?v=1.1.73-student-course-polish";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js?v=1.1.73-student-course-polish";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js?v=1.1.73-student-course-polish";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js?v=1.1.73-student-course-polish";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js?v=1.1.73-student-course-polish";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js?v=1.1.73-student-course-polish";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js?v=1.1.73-student-course-polish";
export { LoadModulesIntent } from "./courseEditor/LoadModulesIntent.js?v=1.1.73-student-course-polish";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js?v=1.1.73-student-course-polish";
export { PreviewCourseIntent } from "./courseEditor/PreviewCourseIntent.js?v=1.1.73-student-course-polish";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js?v=1.1.73-student-course-polish";
export { OpenCreateModuleWizardIntent } from "./courseEditor/OpenCreateModuleWizardIntent.js?v=1.1.73-student-course-polish";
export { ParseLearningContentIntent } from "./courseEditor/ParseLearningContentIntent.js?v=1.1.73-student-course-polish";
export { CreateModuleFromWizardIntent } from "./courseEditor/CreateModuleFromWizardIntent.js?v=1.1.73-student-course-polish";
export { GenerateModuleSkeletonIntent } from "./courseEditor/GenerateModuleSkeletonIntent.js?v=1.1.73-student-course-polish";
export { GenerateStarterStepsIntent } from "./courseEditor/GenerateStarterStepsIntent.js?v=1.1.73-student-course-polish";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js?v=1.1.73-student-course-polish";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js?v=1.1.73-student-course-polish";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js?v=1.1.73-student-course-polish";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js?v=1.1.73-student-course-polish";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js?v=1.1.73-student-course-polish";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js?v=1.1.73-student-course-polish";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js?v=1.1.73-student-course-polish";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js?v=1.1.73-student-course-polish";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js?v=1.1.73-student-course-polish";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js?v=1.1.73-student-course-polish";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js?v=1.1.73-student-course-polish";
export { MigrateLegacyModulesToCatalogCourseIntent } from "./courseEditor/MigrateLegacyModulesToCatalogCourseIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js?v=1.1.73-student-course-polish";
export { LoadLearningContentIntent } from "./moduleEditor/LoadLearningContentIntent.js?v=1.1.73-student-course-polish";
export { SaveLearningContentIntent } from "./moduleEditor/SaveLearningContentIntent.js?v=1.1.73-student-course-polish";
export { LoadLearningModesIntent } from "./moduleEditor/LoadLearningModesIntent.js?v=1.1.73-student-course-polish";
export { CreateLearningModeIntent } from "./moduleEditor/CreateLearningModeIntent.js?v=1.1.73-student-course-polish";
export { RenameLearningModeIntent } from "./moduleEditor/RenameLearningModeIntent.js?v=1.1.73-student-course-polish";
export { DeleteLearningModeIntent } from "./moduleEditor/DeleteLearningModeIntent.js?v=1.1.73-student-course-polish";
export { DuplicateLearningModeIntent } from "./moduleEditor/DuplicateLearningModeIntent.js?v=1.1.73-student-course-polish";
export { GenerateModeFromPrimaryIntent } from "./moduleEditor/GenerateModeFromPrimaryIntent.js?v=1.1.73-student-course-polish";
export { PullLearningContentIntent } from "./moduleEditor/PullLearningContentIntent.js?v=1.1.73-student-course-polish";
export { PreviewStepIntent } from "./moduleEditor/PreviewStepIntent.js?v=1.1.73-student-course-polish";
export { AddStepToLearningModeIntent } from "./moduleEditor/AddStepToLearningModeIntent.js?v=1.1.73-student-course-polish";
export { UpdateLearningModeStepIntent } from "./moduleEditor/UpdateLearningModeStepIntent.js?v=1.1.73-student-course-polish";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js?v=1.1.73-student-course-polish";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js?v=1.1.73-student-course-polish";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js?v=1.1.73-student-course-polish";
export { LoadStepsIntent } from "./moduleEditor/LoadStepsIntent.js?v=1.1.73-student-course-polish";
export { CreateStepIntent } from "./moduleEditor/CreateStepIntent.js?v=1.1.73-student-course-polish";
export { UpdateStepIntent } from "./moduleEditor/UpdateStepIntent.js?v=1.1.73-student-course-polish";
export { DeleteStepIntent } from "./moduleEditor/DeleteStepIntent.js?v=1.1.73-student-course-polish";
export { ReorderStepsIntent } from "./moduleEditor/ReorderStepsIntent.js?v=1.1.73-student-course-polish";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js?v=1.1.73-student-course-polish";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js?v=1.1.73-student-course-polish";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js?v=1.1.73-student-course-polish";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js?v=1.1.73-student-course-polish";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js?v=1.1.73-student-course-polish";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js?v=1.1.73-student-course-polish";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js?v=1.1.73-student-course-polish";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js?v=1.1.73-student-course-polish";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js?v=1.1.73-student-course-polish";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js?v=1.1.73-student-course-polish";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js?v=1.1.73-student-course-polish";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js?v=1.1.73-student-course-polish";
export { LoadStudentDashboardIntent } from "./student/LoadStudentDashboardIntent.js?v=1.1.73-student-course-polish";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js?v=1.1.73-student-course-polish";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js?v=1.1.73-student-course-polish";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js?v=1.1.73-student-course-polish";
export { ClaimDailyBonusIntent } from "./student/ClaimDailyBonusIntent.js?v=1.1.73-student-course-polish";
export { ContinueLearningIntent } from "./student/ContinueLearningIntent.js?v=1.1.73-student-course-polish";
export { SelectContinueLearningIntent } from "./student/SelectContinueLearningIntent.js?v=1.1.73-student-course-polish";
export { StudentOpenCourseIntent } from "./student/StudentOpenCourseIntent.js?v=1.1.73-student-course-polish";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js?v=1.1.73-student-course-polish";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js?v=1.1.73-student-course-polish";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js?v=1.1.73-student-course-polish";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js?v=1.1.73-student-course-polish";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js?v=1.1.73-student-course-polish";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js?v=1.1.73-student-course-polish";


