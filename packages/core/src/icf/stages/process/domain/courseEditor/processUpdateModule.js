import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.81-class-command-center";

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
  return {
    title: payload.title,
    description: payload.description,
    status: payload.status,
    updatedAt: serverTimestamp()
  };
}

function readCourseCollectionName() {
  return "catalogCourses";
}
