// intents.js
// Aggregation of all defined intents across domains.

// ----------------------
// Demo Verification
// ----------------------
export { DemoIntent } from "./demo/DemoIntent.js";

// ----------------------
// Catalog Course (Full Production Specs)
// ----------------------
export { CreateCatalogCourseIntent } from "./catalogCourse/CreateCatalogCourseIntent.js";
export { UpdateCatalogCourseMetadataIntent } from "./catalogCourse/UpdateCatalogCourseMetadataIntent.js";
export { ArchiveCatalogCourseIntent } from "./catalogCourse/ArchiveCatalogCourseIntent.js";
export { RestoreCatalogCourseIntent } from "./catalogCourse/RestoreCatalogCourseIntent.js";
export { DeleteCatalogCourseIntent } from "./catalogCourse/DeleteCatalogCourseIntent.js";

export { CreateCatalogCourseVersionIntent } from "./catalogCourse/CreateCatalogCourseVersionIntent.js";
export { PublishCatalogCourseVersionIntent } from "./catalogCourse/PublishCatalogCourseVersionIntent.js";
export { RevertCatalogCourseVersionIntent } from "./catalogCourse/RevertCatalogCourseVersionIntent.js";

export { CreateCatalogModuleIntent } from "./catalogCourse/CreateCatalogModuleIntent.js";
export { UpdateCatalogModuleIntent } from "./catalogCourse/UpdateCatalogModuleIntent.js";
export { ReorderCatalogModulesIntent } from "./catalogCourse/ReorderCatalogModulesIntent.js";
export { DeleteCatalogModuleIntent } from "./catalogCourse/DeleteCatalogModuleIntent.js";

export { CreateCatalogStepIntent } from "./catalogCourse/CreateCatalogStepIntent.js";
export { UpdateCatalogStepIntent } from "./catalogCourse/UpdateCatalogStepIntent.js";
export { DeleteCatalogStepIntent } from "./catalogCourse/DeleteCatalogStepIntent.js";
export { ReorderCatalogStepsIntent } from "./catalogCourse/ReorderCatalogStepsIntent.js";

export { AddTagToCatalogCourseIntent } from "./catalogCourse/AddTagToCatalogCourseIntent.js";
export { RemoveTagFromCatalogCourseIntent } from "./catalogCourse/RemoveTagFromCatalogCourseIntent.js";

export { FetchAllCatalogCoursesIntent } from "./catalogCourse/FetchAllCatalogCoursesIntent.js";
export { FetchCatalogCourseByIdIntent } from "./catalogCourse/FetchCatalogCourseByIdIntent.js";
export { FetchCatalogCourseVersionsIntent } from "./catalogCourse/FetchCatalogCourseVersionsIntent.js";

// ----------------------
// Course Sandbox
// ----------------------
export { CreateCourseIntent } from "./course/CreateCourseIntent.js";
export { ListCoursesIntent } from "./course/ListCoursesIntent.js";
export { UpdateCourseMetadataIntent } from "./course/UpdateCourseMetadataIntent.js";

// ----------------------
// Course Assignments
// ----------------------
export { CreateCourseAssignmentIntent } from "./courseAssignment/CreateCourseAssignmentIntent.js";
export { ListCourseAssignmentsIntent } from "./courseAssignment/ListCourseAssignmentsIntent.js";
export { LoadCourseAssignmentsIntent } from "./courseAssignment/LoadCourseAssignmentsIntent.js";
export { UpdateCourseAssignmentIntent } from "./courseAssignment/UpdateCourseAssignmentIntent.js";
export { ArchiveCourseAssignmentIntent } from "./courseAssignment/ArchiveCourseAssignmentIntent.js";
export { DisableCourseAssignmentIntent } from "./courseAssignment/DisableCourseAssignmentIntent.js";
export { DeleteCourseAssignmentIntent } from "./courseAssignment/DeleteCourseAssignmentIntent.js";

// ----------------------
// Locations / Login Settings
// ----------------------
export { ListLocationsIntent } from "./location/ListLocationsIntent.js";
export { LoadLocationsIntent } from "./location/LoadLocationsIntent.js";
export { ResolveLocationBySlugIntent } from "./location/ResolveLocationBySlugIntent.js";
export { UpdateLocationLoginModeIntent } from "./location/UpdateLocationLoginModeIntent.js";
export { UpdateLocationLoginSlugIntent } from "./location/UpdateLocationLoginSlugIntent.js";

// ----------------------
// Student Login
// ----------------------
export { LoadClassesForLocationIntent } from "./studentLogin/LoadClassesForLocationIntent.js";
export { LoadStudentsForClassIntent } from "./studentLogin/LoadStudentsForClassIntent.js";
export { StudentFruitLoginIntent } from "./studentLogin/StudentFruitLoginIntent.js";
export { StudentStandardLoginIntent } from "./studentLogin/StudentStandardLoginIntent.js";
export { LoadStudentProfileIntent } from "./studentLogin/LoadStudentProfileIntent.js";
export { StartStudentSessionIntent } from "./studentLogin/StartStudentSessionIntent.js";
export { CreateClassIntent } from "./superAdmin/CreateClassIntent.js";
export { CreateLocationIntent } from "./superAdmin/CreateLocationIntent.js";
export { CreateStudentIntent } from "./superAdmin/CreateStudentIntent.js";
export { ListClassesIntent } from "./superAdmin/ListClassesIntent.js";
export { ListStudentsIntent } from "./superAdmin/ListStudentsIntent.js";
export { LoadAdminProfileIntent } from "./superAdmin/LoadAdminProfileIntent.js";
export { ResetStudentFruitPasswordIntent } from "./superAdmin/ResetStudentFruitPasswordIntent.js";
export { SetStudentStatusIntent } from "./superAdmin/SetStudentStatusIntent.js";
export { UpdateClassIntent } from "./superAdmin/UpdateClassIntent.js";
export { UpdateLocationIntent } from "./superAdmin/UpdateLocationIntent.js";
export { UpdateStudentIntent } from "./superAdmin/UpdateStudentIntent.js";
export { VerifySuperAdminAccessIntent } from "./superAdmin/VerifySuperAdminAccessIntent.js";

// ----------------------
// Course Editor (Phase 2 UI Intents)
// ----------------------
export { OpenCourseEditorIntent } from "./courseEditor/OpenCourseEditorIntent.js";
export { LoadCourseIntent } from "./courseEditor/LoadCourseIntent.js";
export { LoadCourseModulesIntent } from "./courseEditor/LoadCourseModulesIntent.js";
export { CreateModuleIntent } from "./courseEditor/CreateModuleIntent.js";
export { ListModulesIntent } from "./courseEditor/ListModulesIntent.js";
export { UpdateModuleIntent } from "./courseEditor/UpdateModuleIntent.js";
export { AddModuleIntent } from "./courseEditor/AddModuleIntent.js";
export { UpdateModuleFieldIntent } from "./courseEditor/UpdateModuleFieldIntent.js";
export { ReorderModulesIntent } from "./courseEditor/ReorderModulesIntent.js";
export { DeleteModuleIntent } from "./courseEditor/DeleteModuleIntent.js";
export { DuplicateModuleIntent } from "./courseEditor/DuplicateModuleIntent.js";
export { SaveCourseDraftIntent } from "./courseEditor/SaveCourseDraftIntent.js";
export { PublishCourseIntent } from "./courseEditor/PublishCourseIntent.js";
export { ValidateCourseStructureIntent } from "./courseEditor/ValidateCourseStructureIntent.js";
export { UpdateCourseFieldIntent } from "./courseEditor/UpdateCourseFieldIntent.js";

// ----------------------
// Module Editor
// ----------------------
export { OpenModuleEditorIntent } from "./moduleEditor/OpenModuleEditorIntent.js";
export { AddStepToPracticeModeIntent } from "./moduleEditor/AddStepToPracticeModeIntent.js";
export { CreatePracticeModeShellsIntent } from "./moduleEditor/CreatePracticeModeShellsIntent.js";
export { CreateSessionIntent } from "./moduleEditor/CreateSessionIntent.js";
export { DeletePracticeModeStepIntent } from "./moduleEditor/DeletePracticeModeStepIntent.js";
export { ListPracticeModeStepsIntent } from "./moduleEditor/ListPracticeModeStepsIntent.js";
export { ListSessionsIntent } from "./moduleEditor/ListSessionsIntent.js";
export { ReorderPracticeModeStepsIntent } from "./moduleEditor/ReorderPracticeModeStepsIntent.js";
export { UpdatePracticeModeIntent } from "./moduleEditor/UpdatePracticeModeIntent.js";
export { UpdatePracticeModeStepIntent } from "./moduleEditor/UpdatePracticeModeStepIntent.js";
export { UploadStepMediaIntent } from "./moduleEditor/UploadStepMediaIntent.js";
export { UpdateSessionIntent } from "./moduleEditor/UpdateSessionIntent.js";
export { AddStepIntent } from "./moduleEditor/AddStepIntent.js";
export { UpdateStepFieldIntent } from "./moduleEditor/UpdateStepFieldIntent.js";
export { SaveModuleDraftIntent } from "./moduleEditor/SaveModuleDraftIntent.js";

// ----------------------
// Student Dashboard / Player
// ----------------------
export { LoadStudentCourseIntent } from "./student/LoadStudentCourseIntent.js";
export { LoadStudentCoursesIntent } from "./student/LoadStudentCoursesIntent.js";
export { LoadStudentCourseStructureIntent } from "./student/LoadStudentCourseStructureIntent.js";
export { LoadStudentProgressIntent } from "./student/LoadStudentProgressIntent.js";
export { StartPracticeModeIntent } from "./student/StartPracticeModeIntent.js";
export { CompleteStepIntent } from "./student/CompleteStepIntent.js";
export { CompleteStudentStepIntent } from "./student/CompleteStudentStepIntent.js";
export { CompletePracticeModeIntent } from "./student/CompletePracticeModeIntent.js";
export { CompleteStudentPracticeModeIntent } from "./student/CompleteStudentPracticeModeIntent.js";
export { SaveStudentProgressIntent } from "./student/SaveStudentProgressIntent.js";
