import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.107-student-firebase-auth-chain";

export async function processValidateCourseStructure(executionState) {
    const { context, payload } = executionState;
    const errors = [];

    if (!hasCourseTitle(context.course || payload.course)) {
        errors.push({ field: "course.title", message: "Course title is required." });
    }

    if (!context.modules || context.modules.length === 0) {
        errors.push({ field: "modules", message: "Course must have at least one module." });
    }

    if (context.modules) {
        for (let i = 0; i < context.modules.length; i++) {
            const m = context.modules[i];
            if (!hasModuleTitle(m)) {
                errors.push({ field: "module[" + i + "].title", message: "Module title is required." });
            }

            if (!await moduleHasSteps(executionState, payload.courseId, m)) {
                errors.push({ field: "module[" + i + "].steps", message: "Module must have at least one student step." });
            }
        }
    }

    if (errors.length > 0) {
        executionState.result = { isValid: false, errors: errors };
    } else {
        executionState.result = { isValid: true, errors: [] };
    }

    return { valid: true };
}

function hasCourseTitle(course) {
    if (!course) {
        return false;
    }

    return hasLocalizedText(course.title);
}

function hasModuleTitle(module) {
    if (!module) {
        return false;
    }

    return hasLocalizedText(module.title)
        || Boolean(module.config && hasLocalizedText(module.config.title));
}

async function moduleHasSteps(executionState, courseId, module) {
    if (countModuleInlineSteps(module) > 0) {
        return true;
    }

    const sessionStepCount = await countModuleSessionSteps(executionState, courseId, module.id || module.moduleId);
    return sessionStepCount > 0;
}

function countModuleInlineSteps(module) {
    if (Array.isArray(module.steps)) {
        return module.steps.length;
    }

    if (Array.isArray(module.stepOrder)) {
        return module.stepOrder.length;
    }

    return 0;
}

async function countModuleSessionSteps(executionState, courseId, moduleId) {
    if (!courseId || !moduleId) {
        return 0;
    }

    const sessionsRef = collection(db, readCourseCollectionName(executionState), courseId, "modules", moduleId, "sessions");
    const sessionSnap = await getDocs(sessionsRef);
    let stepCount = 0;

    sessionSnap.forEach(function (sessionDoc) {
        stepCount = stepCount + countPracticeModeSteps(sessionDoc.data().practiceModes);
    });

    return stepCount;
}

function countPracticeModeSteps(practiceModes) {
    let count = 0;

    if (!practiceModes || typeof practiceModes !== "object") {
        return count;
    }

    Object.keys(practiceModes).forEach(function (key) {
        if (practiceModes[key] && Array.isArray(practiceModes[key].steps)) {
            count = count + practiceModes[key].steps.length;
        }
    });

    return count;
}

function hasLocalizedText(value) {
    if (typeof value === "string") {
        return value.trim().length > 0;
    }

    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }

    return Boolean(value.en || value.ru || value.ky);
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}

