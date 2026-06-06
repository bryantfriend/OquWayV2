// intentRegistry.js

import * as IntentExports from "../intents/intents.js?v=1.1.109-student-assignment-status-fallback";

const registry = {
  // Demo Verification
  DemoIntent: IntentExports.DemoIntent,

  // Course Sandbox
  CreateCourseIntent: IntentExports.CreateCourseIntent,
  LoadCoursesIntent: IntentExports.LoadCoursesIntent,
  ListCoursesIntent: IntentExports.ListCoursesIntent,
  UpdateCourseIntent: IntentExports.UpdateCourseIntent,
  UpdateCourseMetadataIntent: IntentExports.UpdateCourseMetadataIntent,
  DeleteCourseIntent: IntentExports.DeleteCourseIntent,
  ArchiveCourseIntent: IntentExports.ArchiveCourseIntent,

  // Course Assignments
  AssignCourseAssistantsIntent: IntentExports.AssignCourseAssistantsIntent,
  AssignCourseTeacherIntent: IntentExports.AssignCourseTeacherIntent,
  CreateCourseAssignmentIntent: IntentExports.CreateCourseAssignmentIntent,
  ListCourseAssignmentsIntent: IntentExports.ListCourseAssignmentsIntent,
  LoadCourseAssignmentOwnershipIntent: IntentExports.LoadCourseAssignmentOwnershipIntent,
  LoadCourseAssignmentsIntent: IntentExports.LoadCourseAssignmentsIntent,
  UpdateCourseAssignmentIntent: IntentExports.UpdateCourseAssignmentIntent,
  ArchiveCourseAssignmentIntent: IntentExports.ArchiveCourseAssignmentIntent,
  DisableCourseAssignmentIntent: IntentExports.DisableCourseAssignmentIntent,
  DeleteCourseAssignmentIntent: IntentExports.DeleteCourseAssignmentIntent,

  // External Tasks
  LoadExternalTaskStepIntent: IntentExports.LoadExternalTaskStepIntent,
  LoadStudentExternalTaskSubmissionIntent: IntentExports.LoadStudentExternalTaskSubmissionIntent,
  SubmitExternalTaskIntent: IntentExports.SubmitExternalTaskIntent,
  UploadExternalTaskFileIntent: IntentExports.UploadExternalTaskFileIntent,
  LoadExternalTaskSubmissionsIntent: IntentExports.LoadExternalTaskSubmissionsIntent,
  ReviewExternalTaskSubmissionIntent: IntentExports.ReviewExternalTaskSubmissionIntent,
  ResubmitExternalTaskIntent: IntentExports.ResubmitExternalTaskIntent,

  // Teacher Dashboard
  TeacherLoginIntent: IntentExports.TeacherLoginIntent,
  LoadTeacherClassDetailIntent: IntentExports.LoadTeacherClassDetailIntent,
  LoadTeacherCourseDetailIntent: IntentExports.LoadTeacherCourseDetailIntent,
  LoadTeacherCoursesIntent: IntentExports.LoadTeacherCoursesIntent,
  LoadTeacherDashboardIntent: IntentExports.LoadTeacherDashboardIntent,
  LoadTeacherClassesIntent: IntentExports.LoadTeacherClassesIntent,
  LoadTeacherStudentsIntent: IntentExports.LoadTeacherStudentsIntent,
  LoadTeacherReviewQueueIntent: IntentExports.LoadTeacherReviewQueueIntent,
  SendTeacherPasswordResetIntent: IntentExports.SendTeacherPasswordResetIntent,

  // Locations / Login Settings
  ListLocationsIntent: IntentExports.ListLocationsIntent,
  LoadLocationsIntent: IntentExports.LoadLocationsIntent,
  ResolveLocationBySlugIntent: IntentExports.ResolveLocationBySlugIntent,
  UpdateLocationLoginModeIntent: IntentExports.UpdateLocationLoginModeIntent,
  UpdateLocationLoginSlugIntent: IntentExports.UpdateLocationLoginSlugIntent,

  // Super Admin
  AssignClassAssistantsIntent: IntentExports.AssignClassAssistantsIntent,
  AssignClassTeacherIntent: IntentExports.AssignClassTeacherIntent,
  CreateClassIntent: IntentExports.CreateClassIntent,
  CreateLocationIntent: IntentExports.CreateLocationIntent,
  CreateStudentIntent: IntentExports.CreateStudentIntent,
  ListClassesIntent: IntentExports.ListClassesIntent,
  ListStudentsIntent: IntentExports.ListStudentsIntent,
  LoadClassOwnershipIntent: IntentExports.LoadClassOwnershipIntent,
  LoadAdminProfileIntent: IntentExports.LoadAdminProfileIntent,
  OpenClassCommandCenterIntent: IntentExports.OpenClassCommandCenterIntent,
  OpenCourseCommandCenterIntent: IntentExports.OpenCourseCommandCenterIntent,
  OpenModuleCommandCenterIntent: IntentExports.OpenModuleCommandCenterIntent,
  OpenUserCommandCenterIntent: IntentExports.OpenUserCommandCenterIntent,
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
  LoadModulesIntent: IntentExports.LoadModulesIntent,
  LoadCourseModulesIntent: IntentExports.LoadCourseModulesIntent,
  PreviewCourseIntent: IntentExports.PreviewCourseIntent,
  CreateModuleIntent: IntentExports.CreateModuleIntent,
  OpenCreateModuleWizardIntent: IntentExports.OpenCreateModuleWizardIntent,
  ParseLearningContentIntent: IntentExports.ParseLearningContentIntent,
  CreateModuleFromWizardIntent: IntentExports.CreateModuleFromWizardIntent,
  GenerateModuleSkeletonIntent: IntentExports.GenerateModuleSkeletonIntent,
  GenerateStarterStepsIntent: IntentExports.GenerateStarterStepsIntent,
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
  MigrateLegacyModulesToCatalogCourseIntent: IntentExports.MigrateLegacyModulesToCatalogCourseIntent,

  // Module Editor
  OpenModuleEditorIntent: IntentExports.OpenModuleEditorIntent,
  LoadLearningContentIntent: IntentExports.LoadLearningContentIntent,
  SaveLearningContentIntent: IntentExports.SaveLearningContentIntent,
  LoadLearningModesIntent: IntentExports.LoadLearningModesIntent,
  CreateLearningModeIntent: IntentExports.CreateLearningModeIntent,
  RenameLearningModeIntent: IntentExports.RenameLearningModeIntent,
  DeleteLearningModeIntent: IntentExports.DeleteLearningModeIntent,
  DuplicateLearningModeIntent: IntentExports.DuplicateLearningModeIntent,
  GenerateModeFromPrimaryIntent: IntentExports.GenerateModeFromPrimaryIntent,
  PullLearningContentIntent: IntentExports.PullLearningContentIntent,
  PreviewStepIntent: IntentExports.PreviewStepIntent,
  AddStepToLearningModeIntent: IntentExports.AddStepToLearningModeIntent,
  UpdateLearningModeStepIntent: IntentExports.UpdateLearningModeStepIntent,
  AddStepToPracticeModeIntent: IntentExports.AddStepToPracticeModeIntent,
  CreatePracticeModeShellsIntent: IntentExports.CreatePracticeModeShellsIntent,
  CreateSessionIntent: IntentExports.CreateSessionIntent,
  LoadStepsIntent: IntentExports.LoadStepsIntent,
  CreateStepIntent: IntentExports.CreateStepIntent,
  UpdateStepIntent: IntentExports.UpdateStepIntent,
  DeleteStepIntent: IntentExports.DeleteStepIntent,
  ReorderStepsIntent: IntentExports.ReorderStepsIntent,
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
  LoadStudentDashboardIntent: IntentExports.LoadStudentDashboardIntent,
  LoadStudentCoursesIntent: IntentExports.LoadStudentCoursesIntent,
  LoadStudentCourseStructureIntent: IntentExports.LoadStudentCourseStructureIntent,
  LoadStudentProgressIntent: IntentExports.LoadStudentProgressIntent,
  ClaimDailyBonusIntent: IntentExports.ClaimDailyBonusIntent,
  ContinueLearningIntent: IntentExports.ContinueLearningIntent,
  SelectContinueLearningIntent: IntentExports.SelectContinueLearningIntent,
  StudentOpenCourseIntent: IntentExports.StudentOpenCourseIntent,
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


