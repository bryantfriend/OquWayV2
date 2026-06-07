import { db, collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.113-student-rules-read";
import { createDefaultPracticeModes } from "../moduleEditor/practiceModeShells.js?v=1.1.113-student-rules-read";
import {
  createDefaultLearningContent,
  createLearningModesForTemplate,
  createStarterStepsForMode,
  normalizeLearningContentPayload
} from "../moduleEditor/learningArchitecture.js?v=1.1.113-student-rules-read";

export async function processCreateModule(executionState) {
  const payload = executionState.payload;
  const context = executionState.context;
  const moduleId = generateId("module");
  const moduleRecord = createModuleRecord(moduleId, payload, context);
  const learningModes = moduleRecord.learningModes;
  const learningContent = moduleRecord.learningContent;
  const generatedAt = Date.now();
  const generationResult = createModeSessionsAndSteps(learningModes, learningContent, payload, context, generatedAt);
  const collectionName = readCourseCollectionName();

  try {
    moduleRecord.learningModes = generationResult.learningModes;
    moduleRecord.generatedStarterStepCount = generationResult.generatedStepCount;
    moduleRecord.sessionsGenerated = generationResult.sessions.length;
    console.info("[module-wizard:generate]", {
      courseId: payload.courseId,
      moduleId: moduleId,
      template: payload.templateKey || "custom",
      willGenerateStarterSteps: payload.generateStarterSteps !== false
    });
    await setDoc(doc(db, collectionName, payload.courseId, "modules", moduleId), moduleRecord);
    console.info("[module:create:proof]", {
      courseId: payload.courseId,
      moduleId: moduleId,
      writePath: "catalogCourses/" + payload.courseId + "/modules/" + moduleId,
      moduleTitle: readModuleTitleForLog(moduleRecord.title),
      writeCompleted: true
    });

    const moduleSnapshot = await getDoc(doc(db, collectionName, payload.courseId, "modules", moduleId));
    console.info("[module:create:verify-readback]", {
      courseId: payload.courseId,
      moduleId: moduleId,
      exists: moduleSnapshot.exists(),
      data: moduleSnapshot.exists() ? {
        title: moduleSnapshot.data().title,
        status: moduleSnapshot.data().status,
        createdAt: Boolean(moduleSnapshot.data().createdAt)
      } : null
    });

    if (!moduleSnapshot.exists()) {
      return {
        valid: false,
        errors: [
          {
            code: "MODULE_CREATE_READBACK_FAILED",
            message: "Module write could not be verified after creation."
          }
        ]
      };
    }

    console.info("[module:create] wrote module", {
      courseId: payload.courseId,
      moduleId: moduleId,
      path: "catalogCourses/" + payload.courseId + "/modules/" + moduleId,
      moduleTitle: readModuleTitleForLog(moduleRecord.title)
    });
    await mirrorLearningContent(collectionName, payload.courseId, moduleId, learningContent);
    await mirrorLearningModes(collectionName, payload.courseId, moduleId, generationResult.learningModes);
    await writeGeneratedSessionsAndSteps(collectionName, payload.courseId, moduleId, generationResult.sessions, generationResult.stepsByMode);
    await updateCourseModuleSummary(collectionName, payload.courseId, readCanonicalContextModules(context), moduleId, generationResult.generatedStepCount);
    executionState.result = moduleRecord;
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "MODULE_CREATE_WRITE_FAILED",
          message: "Failed to create module: " + error.message
        }
      ]
    };
  }
}

async function updateCourseModuleSummary(collectionName, courseId, existingModules, moduleId, generatedStepCount) {
  const moduleOrder = Array.isArray(existingModules)
    ? existingModules.map(function (module) {
      return module.id || module.moduleId;
    }).filter(Boolean)
    : [];

  if (moduleOrder.indexOf(moduleId) === -1) {
    moduleOrder.push(moduleId);
  }

  const persistedModuleIds = await readPersistedModuleIds(collectionName, courseId);
  persistedModuleIds.forEach(function (persistedModuleId) {
    if (moduleOrder.indexOf(persistedModuleId) === -1) {
      moduleOrder.push(persistedModuleId);
    }
  });

  await setDoc(doc(db, collectionName, courseId), {
    moduleCount: persistedModuleIds.length,
    moduleOrder: moduleOrder,
    stepCount: readExistingStepCount(existingModules) + readNumber(generatedStepCount, 0),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

async function readPersistedModuleIds(collectionName, courseId) {
  const snapshot = await getDocs(collection(db, collectionName, courseId, "modules"));
  const moduleIds = [];

  snapshot.forEach(function (moduleDoc) {
    moduleIds.push(moduleDoc.id);
  });

  return moduleIds;
}

async function mirrorLearningContent(collectionName, courseId, moduleId, learningContent) {
  const sections = Object.keys(learningContent || {});
  let sectionIndex = 0;

  while (sectionIndex < sections.length) {
    const section = sections[sectionIndex];
    await setDoc(doc(db, collectionName, courseId, "modules", moduleId, "learningContent", section), {
      id: section,
      type: section,
      value: learningContent[section],
      updatedAt: serverTimestamp()
    }, { merge: true });
    sectionIndex = sectionIndex + 1;
  }
}

async function mirrorLearningModes(collectionName, courseId, moduleId, learningModes) {
  const modeIds = Object.keys(learningModes || {});
  let modeIndex = 0;

  while (modeIndex < modeIds.length) {
    const modeId = modeIds[modeIndex];
    await setDoc(doc(db, collectionName, courseId, "modules", moduleId, "learningModes", modeId), learningModes[modeId], { merge: true });
    modeIndex = modeIndex + 1;
  }
}

async function writeGeneratedSessionsAndSteps(collectionName, courseId, moduleId, sessions, stepsByMode) {
  let sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    const session = sessions[sessionIndex];
    await setDoc(doc(db, collectionName, courseId, "modules", moduleId, "sessions", session.id), session, { merge: true });
    sessionIndex = sessionIndex + 1;
  }

  const modeIds = Object.keys(stepsByMode || {});
  let modeIndex = 0;

  while (modeIndex < modeIds.length) {
    const modeId = modeIds[modeIndex];
    const steps = stepsByMode[modeId] || [];
    let stepIndex = 0;

    while (stepIndex < steps.length) {
      const step = steps[stepIndex];
      await setDoc(doc(db, collectionName, courseId, "modules", moduleId, "learningModes", modeId, "steps", step.id), step, { merge: true });
      stepIndex = stepIndex + 1;
    }

    modeIndex = modeIndex + 1;
  }
}

function createModuleRecord(moduleId, payload, context) {
  const order = readNextOrder(context.modules);

  return {
    id: moduleId,
    title: payload.title,
    description: payload.description,
    subject: payload.subject || "",
    topic: payload.topic || "",
    level: payload.level || payload.grade || "",
    grade: payload.grade || payload.level || "",
    estimatedMinutes: readNumber(payload.estimatedMinutes, 15),
    language: payload.language || "en",
    templateKey: payload.templateKey || "custom",
    order: order,
    status: payload.status,
    learningContent: readPayloadLearningContent(payload),
    learningModes: createLearningModesForTemplate(payload.templateKey || "custom", []),
    learningArchitectureVersion: 2,
    createdFromWizard: Boolean(payload.createdFromWizard),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function readPayloadLearningContent(payload) {
  if (payload && payload.learningContent) {
    return normalizeLearningContentPayload(payload);
  }

  return createDefaultLearningContent();
}

function createModeSessionsAndSteps(learningModes, learningContent, payload, context, generatedAt) {
  const modeIds = Object.keys(learningModes || {});
  const modes = {};
  const sessions = [];
  const stepsByMode = {};
  let generatedStepCount = 0;
  let modeIndex = 0;

  while (modeIndex < modeIds.length) {
    const modeId = modeIds[modeIndex];
    const mode = Object.assign({}, learningModes[modeId]);
    const sessionId = "mode-" + mode.id + "-" + generatedAt.toString(36) + "-" + modeIndex;
    const steps = payload.generateStarterSteps === false
      ? []
      : createStarterStepsForMode(mode, learningContent, { generatedAt: generatedAt });

    mode.legacySessionId = sessionId;
    mode.updatedAt = generatedAt;
    modes[mode.id] = mode;
    sessions.push(createLegacySessionForMode(sessionId, mode, context.modules, steps));
    stepsByMode[mode.id] = steps;
    generatedStepCount = generatedStepCount + steps.length;
    modeIndex = modeIndex + 1;
  }

  return {
    learningModes: modes,
    sessions: sessions,
    stepsByMode: stepsByMode,
    generatedStepCount: generatedStepCount
  };
}

function createLegacySessionForMode(sessionId, mode, modules, starterSteps) {
  const practiceModes = createDefaultPracticeModes();
  const targetPracticeMode = readPracticeModeKeyForLearningMode(mode);
  practiceModes[targetPracticeMode].status = starterSteps.length > 0 ? "draft" : "shell";
  practiceModes[targetPracticeMode].steps = starterSteps.slice();

  return {
    id: sessionId,
    title: { en: mode.title, ru: "", ky: "" },
    description: mode.purpose,
    sessionNumber: readNextOrder(modules),
    order: mode.order,
    status: "draft",
    learningModeId: mode.id,
    learningModeType: mode.modeType,
    isLearningModeShell: true,
    practiceModes: practiceModes,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function readPracticeModeKeyForLearningMode(mode) {
  if (mode && mode.modeType === "review") {
    return "afterClass";
  }

  if (mode && mode.modeType === "practice") {
    return "dailyPractice";
  }

  if (mode && mode.modeType === "assessment") {
    return "classroomLesson";
  }

  return "beforeClass";
}

function readNextOrder(modules) {
  if (!Array.isArray(modules)) {
    return 1;
  }

  return modules.length + 1;
}

function generateId(prefix) {
  const randomText = Math.random().toString(36).slice(2, 10);
  return prefix + "-" + Date.now() + "-" + randomText;
}

function readNumber(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function readExistingStepCount(modules) {
  let count = 0;
  let index = 0;

  if (!Array.isArray(modules)) {
    return 0;
  }

  while (index < modules.length) {
    if (typeof modules[index].generatedStarterStepCount === "number") {
      count = count + modules[index].generatedStarterStepCount;
    } else if (typeof modules[index].stepCount === "number") {
      count = count + modules[index].stepCount;
    }

    index = index + 1;
  }

  return count;
}

function readModuleTitleForLog(title) {
  if (typeof title === "string") {
    return title;
  }

  if (title && typeof title === "object") {
    return title.en || title.ru || title.ky || "";
  }

  return "";
}

function readCourseCollectionName() {
  return "catalogCourses";
}

function readCanonicalContextModules(context) {
  const sourceCheck = context && context.moduleSourceCheck ? context.moduleSourceCheck : null;

  if (sourceCheck && sourceCheck.moduleSource === "courses") {
    return [];
  }

  return context && Array.isArray(context.modules) ? context.modules : [];
}
