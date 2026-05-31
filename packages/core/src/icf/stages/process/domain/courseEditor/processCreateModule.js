import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { createDefaultLearningContent, createLearningModesForTemplate } from "../moduleEditor/learningArchitecture.js";

export async function processCreateModule(executionState) {
  const payload = executionState.payload;
  const context = executionState.context;
  const moduleId = generateId("module");
  const moduleRecord = createModuleRecord(moduleId, payload, context);
  const learningModes = moduleRecord.learningModes;
  const learningContent = moduleRecord.learningContent;

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", moduleId), moduleRecord);
    await mirrorLearningContent(readCourseCollectionName(executionState), payload.courseId, moduleId, learningContent);
    await mirrorLearningModes(readCourseCollectionName(executionState), payload.courseId, moduleId, learningModes);
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

function createModuleRecord(moduleId, payload, context) {
  const order = readNextOrder(context.modules);

  return {
    id: moduleId,
    title: payload.title,
    description: payload.description,
    order: order,
    status: payload.status,
    learningContent: createDefaultLearningContent(),
    learningModes: createLearningModesForTemplate(payload.templateKey || "custom", []),
    learningArchitectureVersion: 2,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
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

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
