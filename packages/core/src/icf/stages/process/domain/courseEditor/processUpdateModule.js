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
    moduleId: payload.moduleId,
    courseId: payload.courseId,
    title: payload.title,
    description: payload.description,
    status: payload.status,
    templateKey: payload.templateKey,
    updatedAt: serverTimestamp()
  };

  appendOptionalModuleVisualFields(moduleUpdate, payload);
  return moduleUpdate;
}

function appendOptionalModuleVisualFields(moduleUpdate, payload) {
  appendOptionalString(moduleUpdate, payload, "iconUrl");
  appendOptionalString(moduleUpdate, payload, "displayTemplate");
  appendOptionalString(moduleUpdate, payload, "pathType");
  appendOptionalString(moduleUpdate, payload, "pathGroup");
  appendOptionalString(moduleUpdate, payload, "parentModuleId");
  appendOptionalString(moduleUpdate, payload, "unlockRuleType");
  appendOptionalString(moduleUpdate, payload, "prerequisiteModuleId");

  if (typeof payload.pathOrder === "number") {
    moduleUpdate.pathOrder = payload.pathOrder;
  }

  if (typeof payload.unlockThresholdPercent === "number") {
    moduleUpdate.unlockThresholdPercent = Math.max(0, Math.min(100, payload.unlockThresholdPercent));
  }

  if (Object.prototype.hasOwnProperty.call(payload, "estimatedMinutes")) {
    moduleUpdate.estimatedMinutes = readOptionalPositiveWholeNumber(payload.estimatedMinutes);
  }
}

function appendOptionalString(target, source, fieldName) {
  if (typeof source[fieldName] === "string") {
    target[fieldName] = source[fieldName];
  }
}

function readOptionalPositiveWholeNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue) && numberValue > 0) {
    return numberValue;
  }

  return null;
}

function readCourseCollectionName() {
  return "catalogCourses";
}
