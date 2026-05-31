import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { createDefaultLearningContent, createLearningModesForTemplate } from "../moduleEditor/learningArchitecture.js";

export async function processCreateModule(executionState) {
  const payload = executionState.payload;
  const context = executionState.context;
  const moduleId = generateId("module");
  const moduleRecord = createModuleRecord(moduleId, payload, context);

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", moduleId), moduleRecord);
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
