import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  countCanonicalModuleSteps,
  countCourseSteps,
  countModuleSteps
} from "../packages/domain/progress/index.js";
import { validateCoursePublishReady } from "../packages/core/src/icf/stages/validate/domain/courseEditor/validateCoursePublishReady.js";
import { processPreviewStep } from "../packages/core/src/icf/stages/process/domain/moduleEditor/processPreviewStep.js";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
var repoRoot = path.resolve(__dirname, "..");
var failures = [];
var warnings = [];
var notes = [];

await runTest("canonical course and activity counts", verifyCanonicalCounts);
await runTest("publish readiness and publish processor safeguards", verifyPublishReadiness);
await runTest("storage rules and UploadStepMediaIntent path contract", verifyStepMediaStorage);
await runTest("preview no-write contract", verifyPreviewNoWrite);
await runTest("student dashboard and progress contract", verifyStudentDashboardAndProgress);
await runTest("emotional check-in save contract", verifyEmotionalCheckInSaveContract);
await runTest("teacher dashboard monitoring boundaries", verifyTeacherDashboardMonitoring);
await runTest("governance source scan", verifyGovernanceScan);

printResults();

async function runTest(name, testFunction) {
  try {
    await testFunction();
    console.log("PASS " + name);
  } catch (error) {
    failures.push(name + ": " + readErrorMessage(error));
    console.error("FAIL " + name + ": " + readErrorMessage(error));
  }
}

async function verifyCanonicalCounts() {
  var catalogOnly = {
    modules: [
      createCatalogModule("module-1", {
        primary: [{ id: "a" }, { id: "b" }],
        assessment: [{ id: "c" }]
      }),
      createCatalogModule("module-2", {
        primary: [{ id: "d" }]
      })
    ]
  };
  var legacyOnly = {
    modules: [
      {
        id: "legacy-1",
        steps: [{ id: "a" }, { id: "b" }, { id: "a" }],
        stepCount: 99
      }
    ]
  };
  var bothCatalogAndLegacy = {
    modules: [
      Object.assign(createCatalogModule("mixed-1", {
        primary: [{ id: "a" }, { id: "b" }],
        support: [{ id: "b" }, { id: "c" }]
      }), {
        steps: [{ id: "legacy-a" }, { id: "legacy-b" }],
        sessions: [createSession(["legacy-c", "legacy-d"])],
        stepCount: 13
      })
    ]
  };
  var orderedModes = {
    modules: [
      {
        id: "ordered-1",
        learningModes: {
          primary: { stepOrder: ["a", "b", "b", "c"] },
          support: { stepOrder: ["c", "d"] }
        },
        moduleOrder: ["ignored-for-step-count"],
        activityCount: 13,
        stepCount: 13
      }
    ]
  };
  var fallbackRendered = {
    modules: [
      {
        id: "rendered-1",
        sessions: [createSession(["a", "b"]), createSession(["c"])]
      }
    ]
  };
  var storedFallbackOnly = { id: "stored-only", stepCount: 8 };
  var staleStoredWithRealActivities = Object.assign(createCatalogModule("stale-1", {
    primary: [{ id: "a" }, { id: "b" }]
  }), {
    stepCount: 13,
    activityCount: 11
  });

  assert.equal(countCourseSteps(catalogOnly), 4, "catalog learning modes should count each activity once");
  assert.equal(countCourseSteps(legacyOnly), 2, "legacy embedded steps should de-dupe by id");
  assert.equal(countCourseSteps(bothCatalogAndLegacy), 3, "canonical learning modes should win over legacy and stored counts");
  assert.equal(countCourseSteps(orderedModes), 4, "stepOrder should count unique ordered activities and ignore stale stored counts");
  assert.equal(countCourseSteps(fallbackRendered), 3, "rendered sessions should be fallback source");
  assert.equal(countModuleSteps(storedFallbackOnly), 8, "stored stepCount should be fallback only");
  assert.equal(countModuleSteps(staleStoredWithRealActivities), 2, "real activities should override stale stored counts");
  assert.equal(countCanonicalModuleSteps(bothCatalogAndLegacy.modules[0]), 3, "canonical helper should de-dupe across modes");

  var duplicateSources = {
    modules: [
      Object.assign(createCatalogModule("dupe-1", {
        primary: [
          { id: "one" },
          { id: "two" },
          { id: "three" },
          { id: "four" },
          { id: "five" },
          { id: "six" },
          { id: "seven" },
          { id: "eight" },
          { id: "nine" },
          { id: "ten" }
        ],
        review: [{ id: "one" }]
      }), {
        sessions: [createSession(["one", "two", "three"])],
        stepCount: 13
      })
    ]
  };

  assert.equal(countCourseSteps(duplicateSources), 10, "duplicated canonical, session, and stored sources must not create 11/13 mismatches");
}

async function verifyPublishReadiness() {
  var validCourse = createPublishState({
    course: { id: "course-1", title: { en: "ICT Grade 6" } },
    modules: [createCatalogModule("module-1", { primary: [{ id: "step-1" }] })]
  });
  var missingOptional = createPublishState({
    course: { id: "course-2", title: "Optional fields omitted" },
    modules: [createCatalogModule("module-1", { primary: [{ id: "step-1" }] })]
  });
  var contextCourse = createPublishState({
    payload: { courseId: "course-3" },
    context: {
      course: { id: "course-3", title: "Context Course" },
      modules: [createCatalogModule("module-1", { primary: [{ id: "step-1" }] })]
    }
  });
  var missingRequired = createPublishState({
    course: { id: "course-4", title: "" },
    modules: [createCatalogModule("module-1", { primary: [{ id: "step-1" }] })]
  });
  var noModules = createPublishState({
    course: { id: "course-5", title: "No modules" },
    modules: []
  });
  var moduleWithoutActivities = createPublishState({
    course: { id: "course-6", title: "Empty module" },
    modules: [{ id: "module-1", title: "Module", stepCount: 0 }]
  });
  var undefinedOptional = createPublishState({
    course: { id: "course-7", title: "Undefined optional", description: undefined },
    modules: [Object.assign(createCatalogModule("module-1", { primary: [{ id: "step-1" }] }), { summary: undefined })]
  });

  assert.equal(validateCoursePublishReady(validCourse).valid, true, "valid course should be publish-ready");
  assert.equal(validateCoursePublishReady(missingOptional).valid, true, "missing optional fields should not block readiness");
  assert.equal(validateCoursePublishReady(contextCourse).valid, true, "context course should avoid false Course payload missing failure");
  assert.equal(validateCoursePublishReady(undefinedOptional).valid, true, "undefined optional fields should not block readiness");
  assertInvalidMessage(validateCoursePublishReady(missingRequired), "Course title is required");
  assertInvalidMessage(validateCoursePublishReady(noModules), "at least one module");
  assertInvalidMessage(validateCoursePublishReady(moduleWithoutActivities), "at least one student step");

  var intentSource = await readSource("packages/core/src/icf/intents/courseEditor/PublishCourseIntent.js");
  var processSource = await readSource("packages/core/src/icf/stages/process/domain/courseEditor/processPublishCourse.js");
  assertSourceOrder(intentSource, "validate:", "process:", "PublishCourseIntent must validate before process");
  assertSourceOrder(processSource, "if (!course || !courseId)", "const batch = writeBatch(db)", "publish missing-course check must happen before batch writes");
  assertSourceOrder(processSource, "if (modules.length === 0)", "const batch = writeBatch(db)", "publish no-module check must happen before batch writes");
  assertSourceIncludes(processSource, "removeUndefinedValues(cleanCourse)", "publish should strip undefined course fields");
  assertSourceIncludes(processSource, "removeUndefinedValues(cleanMod)", "publish should strip undefined module fields");
  assertSourceIncludes(processSource, "countSharedModuleSteps(moduleRecord)", "publish stepCount should use shared count helper");
}

async function verifyStepMediaStorage() {
  var uploadIntent = await readSource("packages/core/src/icf/intents/moduleEditor/UploadStepMediaIntent.js");
  var uploadProcess = await readSource("packages/core/src/icf/stages/process/domain/moduleEditor/processUploadStepMedia.js");
  var storageRules = await readSource("storage.rules");

  assertSourceOrder(uploadIntent, "validate:", "process:", "UploadStepMediaIntent must validate before process");
  assertSourceOrder(uploadIntent, "addContext:", "authorize:", "UploadStepMediaIntent must add context before authorize");
  assertSourceOrder(uploadIntent, "authorize:", "process:", "UploadStepMediaIntent must authorize before upload/process");
  assertSourceIncludes(uploadProcess, '"step-media/" + createSafePathSegment(payload.courseId)', "upload path should start with step-media/courseId");
  assertSourceIncludes(uploadProcess, 'createSafePathSegment(payload.moduleId)', "upload path should include moduleId");
  assertSourceIncludes(uploadProcess, 'createSafePathSegment(payload.modeId)', "upload path should include modeId/path segment");
  assertSourceIncludes(uploadProcess, 'createSafePathSegment(payload.stepId)', "upload path should include stepId");
  assertSourceIncludes(uploadProcess, "createSafeFileName(payload.file.name)", "upload path should include sanitized fileName");
  assertSourceOrder(uploadProcess, "await uploadBytes(storageRef, payload.file, metadata)", "var downloadUrl = await getDownloadURL(storageRef)", "download URL should be fetched after upload");
  assertSourceIncludes(storageRules, "match /step-media/{courseId}/{moduleId}/{modeId}/{stepId}/{fileName}", "storage rules should match actual step-media depth");
  assertSourceIncludes(storageRules, "isAllowedStepMediaFile()", "storage rules should enforce media file types");
  assertSourceIncludes(storageRules, "isCourseCreator() || isAssistant() || isSchoolAdmin() || isPlatformAdmin() || isSuperAdmin()", "storage write rules should allow editor/admin roles");
  assertSourceIncludes(storageRules, "canReadPublishedCourseMedia(courseId)", "storage rules should allow student published-media read path");
  assertSourceIncludes(storageRules, "allow read, write: if false", "storage rules should deny unmatched paths");
  assert.equal(/isTeacher\(\)\s*\|\|\s*canReadPublishedCourseMedia/.test(storageRules), true, "teachers should read step media without write permission");
  var stepMediaBlock = readBlock(storageRules, "match /step-media");
  var writeFunctionBlock = readBlock(storageRules, "function canWriteStepMedia");
  assertNoSourceIncludes(stepMediaBlock, "isStudent()", "step-media write block should not grant student create/update");
  assertNoSourceIncludes(writeFunctionBlock, "isStudent()", "step-media write helper should not grant student create/update");

  notes.push("Storage emulator rules-unit tests were not run because no Firebase/rules testing dependencies are installed in this repo.");
  notes.push("The step-media third path variable is named modeId in code/rules; the requested pathId role is the same path segment.");
}

async function verifyPreviewNoWrite() {
  var previewResult = await processPreviewStep({
    payload: {
      courseId: "course-1",
      moduleId: "module-1",
      modeId: "primary",
      stepId: "step-1"
    },
    context: {
      course: { id: "course-1" },
      module: { id: "module-1" },
      learningMode: { id: "primary" },
      step: { id: "step-1" },
      previewPaths: { root: "preview" }
    }
  });

  assert.equal(previewResult.valid, true, "step preview process should pass");

  var previewStepSource = await readSource("packages/core/src/icf/stages/process/domain/moduleEditor/processPreviewStep.js");
  var previewCourseSource = await readSource("packages/core/src/icf/stages/process/domain/courseEditor/processPreviewCourse.js");
  var courseOverviewSource = await readSource("apps/course-creator-dashboard/src/ui/pages/CourseOverviewPage.js");
  var courseEditorSource = await readSource("apps/course-creator-dashboard/src/ui/pages/CourseEditorPage.js");
  var playerSource = await readSource("packages/core/src/shared/player/PracticeModePlayer.js");

  assertSourceIncludes(previewStepSource, 'mode: "preview"', "step preview should mark preview mode");
  assertSourceIncludes(previewStepSource, "savesProgress: false", "step preview should mark savesProgress false");
  assertSourceIncludes(previewCourseSource, "previewMode: true", "course preview should mark previewMode true");
  assertSourceIncludes(previewCourseSource, "writesProgress: false", "course preview should mark writesProgress false");
  assertNoSourceIncludes(previewStepSource, "setDoc(", "step preview processor should not write Firestore");
  assertNoSourceIncludes(previewStepSource, "uploadBytes(", "step preview processor should not upload files");
  assertNoSourceIncludes(previewCourseSource, "setDoc(", "course preview processor should not write Firestore");
  assertNoSourceIncludes(courseOverviewSource, "CompleteStudentStepIntent", "course overview preview should not call student completion intent");
  assertNoSourceIncludes(courseOverviewSource, "SaveStudentProgressIntent", "course overview preview should not call student progress intent");
  assertSourceIncludes(courseOverviewSource, "No student progress, diagnostics, scores, or analytics are written", "preview UI should disclose no-write governance");
  assertSourceIncludes(courseEditorSource, 'mode: "playtest"', "course editor playtest should use player playtest mode");
  assertSourceIncludes(playerSource, 'this.mode = safeOptions.mode === "student" ? "student" : "playtest"', "shared player should separate student and playtest modes");
}

async function verifyStudentDashboardAndProgress() {
  var studentMainSource = await readSource("apps/student-dashboard/src/main.js");
  var studentServiceSource = await readSource("apps/student-dashboard/src/ui/services/studentDashboardService.js");
  var loadDashboardSource = await readSource("packages/core/src/icf/stages/process/domain/student/processLoadStudentDashboard.js");
  var openCourseSource = await readSource("packages/core/src/icf/stages/process/domain/student/processLoadStudentCourse.js");
  var studentOpenCourseSource = await readSource("packages/core/src/icf/stages/process/domain/student/processStudentOpenCourse.js");
  var studentOpenCourseContextSource = await readSource("packages/core/src/icf/stages/addContext/domain/student/attachStudentOpenCourseContext.js");
  var courseQueriesSource = await readSource("packages/domain/courses/courseQueries.js");
  var progressHelperSource = await readSource("packages/core/src/icf/stages/process/domain/student/studentProgressHelpers.js");
  var completeIntentSource = await readSource("packages/core/src/icf/intents/student/CompleteStudentStepIntent.js");

  assertSourceIncludes(studentMainSource, "countCourseSteps as countSharedCourseSteps", "student dashboard should import shared course count helper");
  assertSourceIncludes(studentMainSource, "countModuleSteps as countSharedModuleSteps", "student dashboard should import shared module count helper");
  assertSourceIncludes(studentServiceSource, 'runStudentIntent("LoadStudentDashboardIntent"', "student dashboard should load through ICF intent");
  assertSourceIncludes(studentServiceSource, 'runStudentIntent("StudentOpenCourseIntent"', "student course launch should use ICF intent");
  assertSourceIncludes(studentServiceSource, 'runStudentIntent("CompleteStudentStepIntent"', "student progress completion should use ICF intent");
  assertSourceIncludes(studentServiceSource, "waitForStudentDashboardLoad", "student dashboard service should prevent permanent loading");
  assertSourceIncludes(studentMainSource, "buildStudentDashboardErrorState", "student dashboard should render a visible retryable error state");
  assertSourceIncludes(studentMainSource, "student-error-retry-btn", "student dashboard error state should expose retry");
  assert.equal(readStudentStoreImportVersion(studentMainSource), readStudentStoreImportVersion(studentServiceSource), "student dashboard main and service should share one store module URL");
  assertSourceIncludes(loadDashboardSource, "getAssignedCourseIds", "student dashboard should derive visible courses from assignments/profile context");
  assertSourceIncludes(loadDashboardSource, "normalizeCourseSummary", "student dashboard should whitelist lightweight course summary fields");
  assertSourceIncludes(loadDashboardSource, "loadPublishedCourseSummaryCounts", "student dashboard should hydrate safe published course counts");
  assertSourceIncludes(loadDashboardSource, "resolveCourseSummaryContext", "student dashboard should resolve canonical course/module summary context");
  assertSourceIncludes(loadDashboardSource, "moduleCourseId", "student dashboard should expose the resolved module course id");
  assertSourceIncludes(loadDashboardSource, "moduleSource", "student dashboard should expose the resolved module source");
  assertSourceIncludes(loadDashboardSource, "countCourseSteps", "student dashboard should reuse shared course activity counting");
  assertSourceIncludes(loadDashboardSource, "countSource: \"canonicalModules\"", "student dashboard should prefer canonical module counts over stored counts");
  assertSourceIncludes(studentMainSource, "readCourseActivityCount", "student dashboard cards should render learning activity counts");
  assertSourceIncludes(studentMainSource, "typeof (course && course.moduleCount) === \"number\"", "student dashboard cards should support lightweight module counts");
  assertSourceIncludes(loadDashboardSource, "waitForStudentDashboardRead", "student dashboard ICF process should bound Firestore reads");
  assertSourceIncludes(loadDashboardSource, "ASSIGNED_COURSE_NOT_READY", "student dashboard should skip assigned courses that are not ready");
  assertSourceIncludes(openCourseSource, "loadAssignedCourseIds", "course launch should be scoped to assigned course ids");
  assertSourceIncludes(openCourseSource, "loadAssignedCourseSnaps", "course launch should load only assigned course documents");
  assertSourceIncludes(openCourseSource, "allowPreviewCourseFallback === true", "legacy full-course fallback should be explicit preview-only behavior");
  assertNoSourceIncludes(readBlock(openCourseSource, "function isStudentVisibleCourse"), 'courseData.status === "draft"', "student fallback course visibility should not expose draft courses");
  assertSourceIncludes(courseQueriesSource, "hasAuthoritativeAssignmentLookup", "student assignment lookup should not mix legacy profile courses into real assignment results");
  assertSourceIncludes(studentMainSource, "courseMatchesOpenedCourse", "student course open should replace matching dashboard courses by identity");
  assertSourceIncludes(studentMainSource, "if (!replaced && isPreviewMode())", "student course open should not append unknown courses for authenticated students");
  assertSourceIncludes(studentServiceSource, "if (!courseSummary)", "student course open should block courses missing from the current dashboard");
  assertSourceIncludes(studentOpenCourseSource, "waitForStudentCourseOpenRead", "student course open process should prevent permanent opening");
  assertSourceIncludes(studentServiceSource, "courseRecordSource: readCourseRecordSource(courseSummary)", "student course open should pass the selected course source into ICF");
  assertSourceIncludes(studentServiceSource, "moduleCourseId: readCourseModuleCourseId(courseSummary)", "student course open should pass resolved module course id into ICF");
  assertSourceIncludes(studentServiceSource, "moduleSource: readCourseModuleSource(courseSummary)", "student course open should pass resolved module source into ICF");
  assertSourceIncludes(studentOpenCourseContextSource, "buildCourseSourceOrder", "student course open context should honor selected course source order");
  assertSourceIncludes(studentOpenCourseContextSource, "buildCourseIdentityCandidates", "student course open context should try canonical module course ids");
  assertSourceIncludes(studentOpenCourseContextSource, "loadProgress(actor, progressCourseId", "student course open context should keep progress scoped to the assigned course id");
  assertSourceIncludes(studentOpenCourseContextSource, "Promise.all(modules.map", "student course open context should hydrate modules in parallel");
  assertSourceIncludes(studentOpenCourseContextSource, "sessions = await Promise.all", "student course open context should hydrate progress in parallel");
  assertSourceIncludes(progressHelperSource, 'doc(db, "studentProgress", resolveActorStudentId(actor), "courses", payload.courseId, "sessions", payload.sessionId)', "progress writes should be scoped by student/course/session");
  assertSourceIncludes(progressHelperSource, "saveData.courseId = payload.courseId", "progress write should include courseId");
  assertSourceIncludes(progressHelperSource, "saveData.moduleId = payload.moduleId", "progress write should include moduleId");
  assertSourceIncludes(progressHelperSource, "saveData.sessionId = payload.sessionId", "progress write should include sessionId");
  assertSourceOrder(completeIntentSource, "validate:", "normalize:", "CompleteStudentStepIntent should validate before normalize");
  assertSourceOrder(completeIntentSource, "normalize:", "addContext:", "CompleteStudentStepIntent should normalize before addContext");
  assertSourceOrder(completeIntentSource, "addContext:", "authorize:", "CompleteStudentStepIntent should add context before authorize");
  assertSourceOrder(completeIntentSource, "authorize:", "process:", "CompleteStudentStepIntent should authorize before process");

  if (loadDashboardSource.indexOf("icon") === -1 && loadDashboardSource.indexOf("image") === -1) {
    warnings.push("Student lightweight dashboard course summaries do not expose course icon fields; browser/manual QA should confirm fallback icon behavior on full cards.");
  }

}

async function verifyTeacherDashboardMonitoring() {
  var teacherClassIntent = await readSource("packages/core/src/icf/intents/teacher/LoadTeacherClassDetailIntent.js");
  var teacherCourseIntent = await readSource("packages/core/src/icf/intents/teacher/LoadTeacherCourseDetailIntent.js");
  var teacherProcessors = await readSource("packages/core/src/icf/stages/process/domain/teacher/teacherDashboardProcessors.js");
  var teacherMain = await readSource("apps/teacher-dashboard/src/main.js");

  assertSourceOrder(teacherClassIntent, "validate:", "authorize:", "teacher class detail should validate before authorize");
  assertSourceOrder(teacherClassIntent, "authorize:", "process:", "teacher class detail should authorize before process");
  assertSourceOrder(teacherCourseIntent, "validate:", "authorize:", "teacher course detail should validate before authorize");
  assertSourceOrder(teacherCourseIntent, "authorize:", "process:", "teacher course detail should authorize before process");
  assertSourceIncludes(teacherProcessors, "loadTeacherOwnershipScope", "teacher monitoring should build ownership scope");
  assertSourceIncludes(teacherProcessors, "teacherOwnershipIds", "teacher course assignments should be scoped by teacher ownership");
  assertSourceIncludes(teacherProcessors, "resolveRequestedClassIds", "teacher requested classes should be bounded by owned classes");
  assertSourceIncludes(teacherProcessors, "normalizeCourseMonitorStudent", "teacher course monitor should normalize student status rows");
  assertSourceIncludes(teacherMain, '"notStarted"', "teacher UI should expose not-started status");
  assertSourceIncludes(teacherMain, '"inProgress"', "teacher UI should expose in-progress status");
  assertSourceIncludes(teacherMain, '"completed"', "teacher UI should expose completed status");
  assertSourceIncludes(teacherMain, '"active"', "teacher UI should expose active/recent engagement status");
  assertNoSourceIncludes(teacherMain, "raw diagnostic confidence", "teacher dashboard should not label raw diagnostic confidence");
  assertNoSourceIncludes(teacherMain, "editDiagnostic", "teacher dashboard should not expose direct diagnostic edit actions");
}

async function verifyEmotionalCheckInSaveContract() {
  var mainSource = await readSource("apps/student-dashboard/src/main.js");
  var gateSource = await readSource("packages/ui/emotionalCheckInGate.js");
  var serviceSource = await readSource("packages/shared/emotionalCheckIns/emotionalCheckInService.js");
  var repositorySource = await readSource("packages/domain/emotionalCheckIns/repository.js");
  var processSource = await readSource("packages/core/src/icf/stages/process/domain/emotionalCheckIn/processRecordEmotionalCheckIn.js");
  var rulesSource = await readSource("firestore.rules");

  assertSourceIncludes(mainSource, "emotionalCheckInService.shouldShowCheckIn(checkInContext)", "Student Dashboard should skip gate after existing daily check-in");
  assertSourceIncludes(mainSource, "emotionalCheckInService.recordCheckIn(checkInContext, emotionKey)", "Student Dashboard should save check-in through service");
  assertSourceIncludes(serviceSource, "RecordEmotionalCheckInIntent", "emotional check-in service should use existing ICF intent");
  assertSourceIncludes(repositorySource, "cleanEmotionalCheckInRecord", "emotional check-in writes should remove undefined values");
  assertSourceIncludes(repositorySource, "setDoc(doc(db, \"emotionalCheckIns\", documentId), writeRecord, { merge: true })", "same-day check-in should merge the existing document");
  assertSourceIncludes(processSource, "retryable: true", "process save failure should return retryable metadata");
  assertSourceIncludes(gateSource, "readSaveErrorMessage", "gate should show clear retryable save failure copy");
  assertSourceIncludes(rulesSource, '"1.1.0"', "Firestore rules should allow current check-in schema version");
  assertSourceIncludes(rulesSource, "allow update: if isValidEmotionalCheckInWrite(checkInId)", "Firestore rules should allow same-day owned updates");
  assertNoSourceIncludes(gateSource, "setDoc(", "emotional check-in gate should not write directly to Firestore");
  assertNoSourceIncludes(gateSource, "alert(", "emotional check-in gate should not use alerts");
}

async function verifyGovernanceScan() {
  var scanTargets = [
    "apps",
    "packages",
    "firestore.rules",
    "storage.rules"
  ];
  var sourceByPath = await readAllScanSources(scanTargets);
  var riskyPatterns = [
    { name: "bad student", regex: /\bbad student\b/i },
    { name: "low ability", regex: /\blow ability\b/i },
    { name: "cheating", regex: /\bcheating\b/i },
    { name: "worst", regex: /\bworst\b/i },
    { name: "rank", regex: /\brank(?:ing)?\b/i },
    { name: "raw diagnostic confidence", regex: /raw diagnostic confidence/i },
    { name: "direct diagnostic edits", regex: /editDiagnostic|diagnosticEdit|updateDiagnostic/i },
    { name: "preview progress writes", regex: /previewMode[\s\S]{0,240}(CompleteStudentStepIntent|SaveStudentProgressIntent|studentProgress|setDoc\()/i }
  ];
  var findings = [];

  Object.keys(sourceByPath).forEach(function (filePath) {
    riskyPatterns.forEach(function (pattern) {
      if (pattern.regex.test(sourceByPath[filePath])) {
        findings.push(pattern.name + " in " + filePath);
      }
    });
  });

  findings.forEach(function (finding) {
    if (finding.indexOf("rank in apps\\dashboards.README.md") !== -1 || finding.indexOf("rank in apps/dashboards.README.md") !== -1) {
      warnings.push("Governance scan found documentation reference: " + finding);
      return;
    }

    if (finding.indexOf("rank in apps\\super-admin-dashboard") !== -1 || finding.indexOf("rank in apps/super-admin-dashboard") !== -1) {
      warnings.push("Governance scan found super-admin wording to review manually: " + finding);
      return;
    }

    failures.push("Governance risky pattern: " + finding);
  });

  var courseOverviewSource = sourceByPath[normalizeScanPath("apps/course-creator-dashboard/src/ui/pages/CourseOverviewPage.js")] || "";
  assertSourceIncludes(courseOverviewSource, "Local preview only. No student progress, diagnostics, scores, or analytics are written.", "preview no-write language should remain present");
}

function createCatalogModule(moduleId, modeStepsById) {
  var learningModes = {};

  Object.keys(modeStepsById).forEach(function (modeId) {
    learningModes[modeId] = {
      id: modeId,
      title: modeId,
      steps: modeStepsById[modeId].map(function (step, index) {
        return Object.assign({ order: index + 1 }, step);
      })
    };
  });

  return {
    id: moduleId,
    title: "Module " + moduleId,
    learningModes: learningModes
  };
}

function createSession(stepIds) {
  return {
    id: "session-" + stepIds.join("-"),
    practiceModes: {
      primary: {
        steps: stepIds.map(function (stepId, index) {
          return {
            id: stepId,
            order: index + 1
          };
        })
      }
    }
  };
}

function createPublishState(options) {
  var safeOptions = options || {};

  if (safeOptions.payload || safeOptions.context) {
    return {
      payload: safeOptions.payload || {},
      context: safeOptions.context || {}
    };
  }

  return {
    payload: {
      courseId: safeOptions.course ? safeOptions.course.id : "",
      course: safeOptions.course,
      modules: safeOptions.modules
    },
    context: {}
  };
}

function assertInvalidMessage(result, expectedText) {
  var errors = result && Array.isArray(result.errors) ? result.errors : [];
  var messages = errors.map(function (error) {
    return error.message || "";
  }).join("\n");

  assert.equal(result.valid, false, "expected invalid result");
  assert.equal(messages.indexOf(expectedText) !== -1, true, "expected error containing " + expectedText + ", found " + messages);
}

async function readSource(relativePath) {
  return await readFile(path.join(repoRoot, relativePath), "utf8");
}

function assertSourceIncludes(source, text, message) {
  assert.equal(source.indexOf(text) !== -1, true, message);
}

function assertNoSourceIncludes(source, text, message) {
  assert.equal(source.indexOf(text) === -1, true, message);
}

function assertSourceOrder(source, firstText, secondText, message) {
  var firstIndex = source.indexOf(firstText);
  var secondIndex = source.indexOf(secondText);

  assert.equal(firstIndex !== -1, true, message + " (missing " + firstText + ")");
  assert.equal(secondIndex !== -1, true, message + " (missing " + secondText + ")");
  assert.equal(firstIndex < secondIndex, true, message);
}

function readBlock(source, marker) {
  var startIndex = source.indexOf(marker);
  var braceIndex = startIndex === -1 ? -1 : source.indexOf("{", startIndex);
  var depth = 0;
  var index = braceIndex;

  assert.equal(startIndex !== -1, true, "missing source marker " + marker);
  assert.equal(braceIndex !== -1, true, "missing block brace for " + marker);

  while (index < source.length) {
    if (source[index] === "{") {
      depth = depth + 1;
    } else if (source[index] === "}") {
      depth = depth - 1;
      if (depth === 0) {
        return source.slice(startIndex, index + 1);
      }
    }

    index = index + 1;
  }

  return source.slice(startIndex);
}

function readStudentStoreImportVersion(source) {
  var match = source.match(/studentDashboardState\.js\?v=([^"']+)/);
  return match ? match[1] : "";
}

async function readAllScanSources(targets) {
  var result = {};
  var targetIndex = 0;

  while (targetIndex < targets.length) {
    await appendScanTarget(result, targets[targetIndex]);
    targetIndex = targetIndex + 1;
  }

  return result;
}

async function appendScanTarget(result, target) {
  var { readdir, stat } = await import("node:fs/promises");
  var targetPath = path.join(repoRoot, target);
  var targetStat = await stat(targetPath);

  if (targetStat.isFile()) {
    if (targetPath.endsWith(".js") || targetPath.endsWith(".mjs") || targetPath.endsWith(".html") || targetPath.endsWith(".md") || targetPath.endsWith(".rules")) {
      result[normalizeScanPath(path.relative(repoRoot, targetPath))] = await readFile(targetPath, "utf8");
    }
    return;
  }

  if (!targetStat.isDirectory()) {
    return;
  }

  var entries = await readdir(targetPath, { withFileTypes: true });
  var entryIndex = 0;

  while (entryIndex < entries.length) {
    var entry = entries[entryIndex];
    var childRelative = path.join(target, entry.name);

    if (entry.isDirectory()) {
      await appendScanTarget(result, childRelative);
    } else if (/\.(js|mjs|html|md|rules)$/.test(entry.name)) {
      result[normalizeScanPath(childRelative)] = await readSource(childRelative);
    }

    entryIndex = entryIndex + 1;
  }
}

function normalizeScanPath(filePath) {
  return filePath.replace(/\//g, path.sep).replace(/\\/g, path.sep);
}

function readErrorMessage(error) {
  return error && error.stack ? error.stack.split("\n")[0] : (error && error.message ? error.message : String(error));
}

function printResults() {
  if (notes.length > 0) {
    console.log("\nNotes:");
    notes.forEach(function (note) {
      console.log("- " + note);
    });
  }

  if (warnings.length > 0) {
    console.log("\nWarnings:");
    warnings.forEach(function (warning) {
      console.log("- " + warning);
    });
  }

  if (failures.length > 0) {
    console.error("\nFailures:");
    failures.forEach(function (failure) {
      console.error("- " + failure);
    });
    process.exit(1);
  }

  console.log("\nOquWay targeted QA verification passed.");
}
