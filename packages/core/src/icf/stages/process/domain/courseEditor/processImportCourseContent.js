import { db, doc, serverTimestamp, writeBatch } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.231-platform-performance-release";
import { createDefaultPracticeModes } from "../moduleEditor/practiceModeShells.js?v=1.1.231-platform-performance-release";

export async function processImportCourseContent(executionState) {
  var payload = executionState.payload || {};
  var importData = payload.importData || {};
  var modules = Array.isArray(importData.modules) ? importData.modules : [];
  var existingModules = readCanonicalContextModules(executionState.context);
  var batch = writeBatch(db);
  var generatedModules = [];
  var totalSteps = 0;
  var moduleIndex = 0;

  try {
    while (moduleIndex < modules.length) {
      var generatedModule = queueImportedModule(
        batch,
        payload.courseId,
        modules[moduleIndex],
        existingModules.length + moduleIndex + 1
      );
      generatedModules.push(generatedModule.result);
      totalSteps += generatedModule.stepCount;
      moduleIndex += 1;
    }

    queueCourseUpdate(
      batch,
      payload.courseId,
      existingModules,
      generatedModules,
      totalSteps,
      importData.course,
      payload.applyCourseMetadata !== false
    );

    await batch.commit();

    executionState.result = {
      modules: generatedModules,
      importedModuleCount: generatedModules.length,
      importedModeCount: generatedModules.reduce(function (count, module) {
        return count + module.modeCount;
      }, 0),
      importedStepCount: totalSteps,
      courseMetadataApplied: payload.applyCourseMetadata !== false && hasCourseMetadata(importData.course)
    };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_IMPORT_WRITE_FAILED",
          message: "Nothing was imported because the atomic write failed: " + error.message
        }
      ]
    };
  }
}

function queueImportedModule(batch, courseId, importedModule, order) {
  var moduleId = generateId("module");
  var learningModes = {};
  var stepCount = 0;
  var modeIndex = 0;
  var modeResults = [];

  while (modeIndex < importedModule.learningModes.length) {
    var queuedMode = queueLearningMode(
      batch,
      courseId,
      moduleId,
      importedModule.learningModes[modeIndex],
      modeIndex + 1
    );
    learningModes[queuedMode.mode.id] = queuedMode.mode;
    stepCount += queuedMode.stepCount;
    modeResults.push({
      id: queuedMode.mode.id,
      title: queuedMode.mode.title,
      stepCount: queuedMode.stepCount
    });
    modeIndex += 1;
  }

  var moduleRecord = {
    id: moduleId,
    title: importedModule.title,
    description: importedModule.description,
    subject: importedModule.subject,
    topic: importedModule.topic,
    level: importedModule.level,
    grade: importedModule.level,
    estimatedMinutes: importedModule.estimatedMinutes,
    language: importedModule.language,
    templateKey: "imported",
    order: order,
    status: "draft",
    learningContent: importedModule.learningContent,
    learningModes: learningModes,
    learningArchitectureVersion: 2,
    createdFromImport: true,
    importSchemaVersion: 1,
    stepCount: stepCount,
    generatedStarterStepCount: 0,
    sessionsGenerated: importedModule.learningModes.length,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  batch.set(doc(db, "catalogCourses", courseId, "modules", moduleId), moduleRecord);
  queueLearningContent(batch, courseId, moduleId, importedModule.learningContent);

  return {
    result: {
      id: moduleId,
      title: importedModule.title,
      description: importedModule.description,
      status: "draft",
      order: order,
      stepCount: stepCount,
      modeCount: modeResults.length,
      learningModes: modeResults
    },
    stepCount: stepCount
  };
}

function queueLearningMode(batch, courseId, moduleId, importedMode, order) {
  var sessionId = generateId("mode-" + importedMode.id);
  var steps = [];
  var stepIndex = 0;
  var practiceModeKey = importedMode.practiceModeKey || readPracticeModeKey(importedMode.modeType);

  while (stepIndex < importedMode.steps.length) {
    var importedStep = importedMode.steps[stepIndex];
    var step = {
      id: generateId("step"),
      type: importedStep.type,
      stepTypeId: importedStep.type,
      title: importedStep.title,
      instructions: importedStep.instructions,
      config: importedStep.config,
      order: stepIndex + 1,
      status: "draft",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    steps.push(step);
    batch.set(
      doc(db, "catalogCourses", courseId, "modules", moduleId, "learningModes", importedMode.id, "steps", step.id),
      step
    );
    stepIndex += 1;
  }

  var modeRecord = {
    id: importedMode.id,
    key: importedMode.id,
    title: importedMode.title,
    purpose: importedMode.purpose,
    modeType: importedMode.modeType,
    status: "draft",
    order: order,
    required: importedMode.id === "primary",
    canDelete: importedMode.id !== "primary",
    legacySessionId: sessionId,
    stepCount: steps.length,
    stepOrder: steps.map(function (step) { return step.id; }),
    imported: true,
    createdAt: Date.now(),
    updatedAt: serverTimestamp()
  };
  var practiceModes = createDefaultPracticeModes();
  practiceModes[practiceModeKey] = Object.assign({}, practiceModes[practiceModeKey], {
    status: steps.length > 0 ? "draft" : "shell",
    steps: steps
  });
  var sessionRecord = {
    id: sessionId,
    title: {
      en: importedMode.title,
      ru: "",
      ky: ""
    },
    description: importedMode.purpose,
    sessionNumber: order,
    order: order,
    status: "draft",
    learningModeId: importedMode.id,
    learningModeType: importedMode.modeType,
    isLearningModeShell: true,
    practiceModes: practiceModes,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  batch.set(
    doc(db, "catalogCourses", courseId, "modules", moduleId, "learningModes", importedMode.id),
    modeRecord
  );
  batch.set(
    doc(db, "catalogCourses", courseId, "modules", moduleId, "sessions", sessionId),
    sessionRecord
  );

  return {
    mode: modeRecord,
    stepCount: steps.length
  };
}

function queueLearningContent(batch, courseId, moduleId, learningContent) {
  Object.keys(learningContent || {}).forEach(function (section) {
    batch.set(
      doc(db, "catalogCourses", courseId, "modules", moduleId, "learningContent", section),
      {
        id: section,
        type: section,
        value: learningContent[section],
        updatedAt: serverTimestamp()
      }
    );
  });
}

function queueCourseUpdate(batch, courseId, existingModules, importedModules, importedStepCount, metadata, applyMetadata) {
  var moduleOrder = [];
  var update = {};

  existingModules.forEach(function (module) {
    var moduleId = module && (module.id || module.moduleId);
    if (moduleId && moduleOrder.indexOf(moduleId) === -1) {
      moduleOrder.push(moduleId);
    }
  });
  importedModules.forEach(function (module) {
    moduleOrder.push(module.id);
  });

  update.moduleOrder = moduleOrder;
  update.moduleCount = moduleOrder.length;
  update.stepCount = countExistingSteps(existingModules) + importedStepCount;
  update.updatedAt = serverTimestamp();

  if (applyMetadata && hasCourseMetadata(metadata)) {
    if (metadata.title) {
      update.title = metadata.title;
    }
    if (metadata.description) {
      update.description = metadata.description;
    }
    if (metadata.subject) {
      update.subject = metadata.subject;
    }
    if (metadata.level) {
      update.level = metadata.level;
    }
    if (metadata.language) {
      update.language = metadata.language;
      update.defaultLanguage = metadata.language;
    }
    if (Array.isArray(metadata.tags) && metadata.tags.length > 0) {
      update.tags = metadata.tags;
    }
  }

  batch.set(doc(db, "catalogCourses", courseId), update, { merge: true });
}

function readPracticeModeKey(modeType) {
  if (modeType === "review") {
    return "afterClass";
  }
  if (modeType === "practice") {
    return "dailyPractice";
  }
  if (modeType === "assessment") {
    return "classroomLesson";
  }
  return "beforeClass";
}

function countExistingSteps(modules) {
  return modules.reduce(function (count, module) {
    return count + readNumber(module && (module.stepCount || module.generatedStarterStepCount), 0);
  }, 0);
}

function readNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function hasCourseMetadata(metadata) {
  return Boolean(metadata && (
    metadata.title ||
    metadata.description ||
    metadata.subject ||
    metadata.level ||
    metadata.language ||
    (Array.isArray(metadata.tags) && metadata.tags.length > 0)
  ));
}

function readCanonicalContextModules(context) {
  var sourceCheck = context && context.moduleSourceCheck ? context.moduleSourceCheck : null;

  if (sourceCheck && sourceCheck.moduleSource === "courses") {
    return [];
  }

  return context && Array.isArray(context.modules) ? context.modules : [];
}

function generateId(prefix) {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
