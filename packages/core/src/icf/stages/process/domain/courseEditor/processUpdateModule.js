import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";

export async function processUpdateModule(executionState) {
  const payload = executionState.payload;
  const context = executionState.context;
  const moduleUpdate = createModuleUpdate(payload);
  const updatedModule = Object.assign({}, context.module, moduleUpdate);

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId), moduleUpdate, { merge: true });
    executionState.result = updatedModule;
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "MODULE_UPDATE_WRITE_FAILED",
          message: "Failed to update module: " + error.message
        }
      ]
    };
  }
}

function createModuleUpdate(payload) {
  const moduleUpdate = {
    title: payload.title,
    description: payload.description,
    status: payload.status,
    updatedAt: serverTimestamp()
  };

  appendOptionalModuleVisualFields(moduleUpdate, payload);
  return moduleUpdate;
}

function appendOptionalModuleVisualFields(moduleUpdate, payload) {
  appendOptionalString(moduleUpdate, payload, "iconUrl");
  appendOptionalString(moduleUpdate, payload, "pathType");
  appendOptionalString(moduleUpdate, payload, "pathGroup");
  appendOptionalString(moduleUpdate, payload, "parentModuleId");

  if (typeof payload.pathOrder === "number") {
    moduleUpdate.pathOrder = payload.pathOrder;
  }
}

function appendOptionalString(target, source, fieldName) {
  if (typeof source[fieldName] === "string") {
    target[fieldName] = source[fieldName];
  }
}

function readCourseCollectionName() {
  return "catalogCourses";
}
