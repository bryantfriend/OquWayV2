// intentRegistry.js

import * as IntentExports from "../intents/intents.js";

const registry = {
  // Demo Verification
  DemoIntent: IntentExports.DemoIntent,

  // Course Sandbox
  CreateCourseIntent: IntentExports.CreateCourseIntent,
  ListCoursesIntent: IntentExports.ListCoursesIntent,
  UpdateCourseMetadataIntent: IntentExports.UpdateCourseMetadataIntent,

  // Course Assignments
  CreateCourseAssignmentIntent: IntentExports.CreateCourseAssignmentIntent,
  ListCourseAssignmentsIntent: IntentExports.ListCourseAssignmentsIntent,
  UpdateCourseAssignmentIntent: IntentExports.UpdateCourseAssignmentIntent,
  ArchiveCourseAssignmentIntent: IntentExports.ArchiveCourseAssignmentIntent,

  // Locations / Login Settings
  ListLocationsIntent: IntentExports.ListLocationsIntent,
  LoadLocationsIntent: IntentExports.LoadLocationsIntent,
  ResolveLocationBySlugIntent: IntentExports.ResolveLocationBySlugIntent,
  UpdateLocationLoginModeIntent: IntentExports.UpdateLocationLoginModeIntent,
  UpdateLocationLoginSlugIntent: IntentExports.UpdateLocationLoginSlugIntent,

  // Super Admin
  CreateClassIntent: IntentExports.CreateClassIntent,
  CreateLocationIntent: IntentExports.CreateLocationIntent,
  CreateStudentIntent: IntentExports.CreateStudentIntent,
  ListClassesIntent: IntentExports.ListClassesIntent,
  ListStudentsIntent: IntentExports.ListStudentsIntent,
  LoadAdminProfileIntent: IntentExports.LoadAdminProfileIntent,
  ResetStudentFruitPasswordIntent: IntentExports.ResetStudentFruitPasswordIntent,
  SetStudentStatusIntent: IntentExports.SetStudentStatusIntent,
  UpdateClassIntent: IntentExports.UpdateClassIntent,
  UpdateLocationIntent: IntentExports.UpdateLocationIntent,
  UpdateStudentIntent: IntentExports.UpdateStudentIntent,
  VerifySuperAdminAccessIntent: IntentExports.VerifySuperAdminAccessIntent,

  // Student Login
  LoadClassesForLocationIntent: IntentExports.LoadClassesForLocationIntent,
  LoadStudentsForClassIntent: IntentExports.LoadStudentsForClassIntent,
  StudentFruitLoginIntent: IntentExports.StudentFruitLoginIntent,
  StudentStandardLoginIntent: IntentExports.StudentStandardLoginIntent,
  LoadStudentProfileIntent: IntentExports.LoadStudentProfileIntent,
  StartStudentSessionIntent: IntentExports.StartStudentSessionIntent,

  // Catalog Course
  CreateCatalogCourseIntent: IntentExports.CreateCatalogCourseIntent,
  UpdateCatalogCourseMetadataIntent: IntentExports.UpdateCatalogCourseMetadataIntent,
  ArchiveCatalogCourseIntent: IntentExports.ArchiveCatalogCourseIntent,
  RestoreCatalogCourseIntent: IntentExports.RestoreCatalogCourseIntent,
  DeleteCatalogCourseIntent: IntentExports.DeleteCatalogCourseIntent,

  CreateCatalogCourseVersionIntent: IntentExports.CreateCatalogCourseVersionIntent,
  PublishCatalogCourseVersionIntent: IntentExports.PublishCatalogCourseVersionIntent,
  RevertCatalogCourseVersionIntent: IntentExports.RevertCatalogCourseVersionIntent,

  CreateCatalogModuleIntent: IntentExports.CreateCatalogModuleIntent,
  UpdateCatalogModuleIntent: IntentExports.UpdateCatalogModuleIntent,
  ReorderCatalogModulesIntent: IntentExports.ReorderCatalogModulesIntent,
  DeleteCatalogModuleIntent: IntentExports.DeleteCatalogModuleIntent,

  CreateCatalogStepIntent: IntentExports.CreateCatalogStepIntent,
  UpdateCatalogStepIntent: IntentExports.UpdateCatalogStepIntent,
  DeleteCatalogStepIntent: IntentExports.DeleteCatalogStepIntent,
  ReorderCatalogStepsIntent: IntentExports.ReorderCatalogStepsIntent,

  AddTagToCatalogCourseIntent: IntentExports.AddTagToCatalogCourseIntent,
  RemoveTagFromCatalogCourseIntent: IntentExports.RemoveTagFromCatalogCourseIntent,

  FetchAllCatalogCoursesIntent: IntentExports.FetchAllCatalogCoursesIntent,
  FetchCatalogCourseByIdIntent: IntentExports.FetchCatalogCourseByIdIntent,
  FetchCatalogCourseVersionsIntent: IntentExports.FetchCatalogCourseVersionsIntent,

  // Course Editor
  OpenCourseEditorIntent: IntentExports.OpenCourseEditorIntent,
  LoadCourseIntent: IntentExports.LoadCourseIntent,
  LoadCourseModulesIntent: IntentExports.LoadCourseModulesIntent,
  CreateModuleIntent: IntentExports.CreateModuleIntent,
  ListModulesIntent: IntentExports.ListModulesIntent,
  UpdateModuleIntent: IntentExports.UpdateModuleIntent,
  AddModuleIntent: IntentExports.AddModuleIntent,
  UpdateModuleFieldIntent: IntentExports.UpdateModuleFieldIntent,
  ReorderModulesIntent: IntentExports.ReorderModulesIntent,
  DeleteModuleIntent: IntentExports.DeleteModuleIntent,
  DuplicateModuleIntent: IntentExports.DuplicateModuleIntent,
  SaveCourseDraftIntent: IntentExports.SaveCourseDraftIntent,
  PublishCourseIntent: IntentExports.PublishCourseIntent,
  ValidateCourseStructureIntent: IntentExports.ValidateCourseStructureIntent,
  UpdateCourseFieldIntent: IntentExports.UpdateCourseFieldIntent,

  // Module Editor
  OpenModuleEditorIntent: IntentExports.OpenModuleEditorIntent,
  AddStepToPracticeModeIntent: IntentExports.AddStepToPracticeModeIntent,
  CreatePracticeModeShellsIntent: IntentExports.CreatePracticeModeShellsIntent,
  CreateSessionIntent: IntentExports.CreateSessionIntent,
  DeletePracticeModeStepIntent: IntentExports.DeletePracticeModeStepIntent,
  ListPracticeModeStepsIntent: IntentExports.ListPracticeModeStepsIntent,
  ListSessionsIntent: IntentExports.ListSessionsIntent,
  ReorderPracticeModeStepsIntent: IntentExports.ReorderPracticeModeStepsIntent,
  UpdatePracticeModeIntent: IntentExports.UpdatePracticeModeIntent,
  UpdatePracticeModeStepIntent: IntentExports.UpdatePracticeModeStepIntent,
  UploadStepMediaIntent: IntentExports.UploadStepMediaIntent,
  UpdateSessionIntent: IntentExports.UpdateSessionIntent,
  AddStepIntent: IntentExports.AddStepIntent,
  UpdateStepFieldIntent: IntentExports.UpdateStepFieldIntent,
  SaveModuleDraftIntent: IntentExports.SaveModuleDraftIntent,

  // Student Dashboard / Player
  LoadStudentCourseIntent: IntentExports.LoadStudentCourseIntent,
  LoadStudentCoursesIntent: IntentExports.LoadStudentCoursesIntent,
  LoadStudentCourseStructureIntent: IntentExports.LoadStudentCourseStructureIntent,
  LoadStudentProgressIntent: IntentExports.LoadStudentProgressIntent,
  StartPracticeModeIntent: IntentExports.StartPracticeModeIntent,
  CompleteStepIntent: IntentExports.CompleteStepIntent,
  CompleteStudentStepIntent: IntentExports.CompleteStudentStepIntent,
  CompletePracticeModeIntent: IntentExports.CompletePracticeModeIntent,
  CompleteStudentPracticeModeIntent: IntentExports.CompleteStudentPracticeModeIntent,
  SaveStudentProgressIntent: IntentExports.SaveStudentProgressIntent
};


/* -------------------------------
   PUBLIC API
-------------------------------- */

export function getIntentDefinition(intentType) {
  const intentFactory = registry[intentType];

  if (!intentFactory) {
    throw new Error("Intent not registered: " + intentType);
  }

  if (typeof intentFactory !== "function") {
    throw new Error("Intent registration is not a factory function: " + intentType);
  }

  const intentDefinition = intentFactory();

  if (!intentDefinition || intentDefinition.type !== intentType) {
    throw new Error("Intent definition mismatch for type: " + intentType);
  }

  return intentDefinition;
}

export function registerIntent(intentType, intentFactory) {
  if (!intentType || typeof intentType !== "string") {
    console.error("[ICF] registerIntent failed: intentType must be a non-empty string.");
    return false;
  }

  if (typeof intentFactory !== "function") {
    console.error("[ICF] registerIntent failed: intentFactory must be a function for: " + intentType);
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(registry, intentType)) {
    console.error("[ICF] registerIntent failed: intent already registered: " + intentType);
    return false;
  }

  registry[intentType] = intentFactory;
  return true;
}

export function hasIntent(intentType) {
  if (!intentType || typeof intentType !== "string") {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(registry, intentType);
}

export function listIntents() {
  return Object.keys(registry);
}
