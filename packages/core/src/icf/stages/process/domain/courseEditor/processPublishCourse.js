import { db, writeBatch, doc, serverTimestamp } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";

export async function processPublishCourse(executionState) {
    const { payload, context } = executionState;
    const courseCollectionName = readCourseCollectionName(executionState);
    const course = createPublishCoursePayload(executionState);
    const courseId = course && (course.id || payload.courseId);
    const modules = Array.isArray(payload.modules) && payload.modules.length > 0
        ? payload.modules
        : (Array.isArray(context.modules) ? context.modules : []);

    if (!course || !courseId) {
        return { valid: false, errors: [{ message: "Course payload missing" }] };
    }

    if (modules.length === 0) {
        return { valid: false, errors: [{ message: "Course must have at least one module before publishing." }] };
    }

    const batch = writeBatch(db);

    // Update modules
    if (modules) {
        for (let i = 0; i < modules.length; i++) {
            const m = modules[i];
            const moduleId = m.id || m.moduleId;

            if (!moduleId) {
                return { valid: false, errors: [{ message: "Cannot publish a module without an id." }] };
            }

            const modRef = doc(db, courseCollectionName, courseId, "modules", moduleId);

            const cleanMod = Object.assign({}, m);
            delete cleanMod.isDirty;
            delete cleanMod.id;
            cleanMod.isDraft = false;

            batch.set(modRef, removeUndefinedValues(cleanMod));
        }
    }

    // Update course metadata
    const courseRef = doc(db, courseCollectionName, courseId);
    const newVersion = (course.version || 1) + 1;

    const cleanCourse = Object.assign({}, course);
    delete cleanCourse.isDirty;
    cleanCourse.updatedAt = serverTimestamp();
    cleanCourse.updatedBy = context.actorId || "SYSTEM";
    cleanCourse.status = "published";
    cleanCourse.version = newVersion;
    cleanCourse.moduleCount = modules.length;
    cleanCourse.stepCount = countCourseSteps(modules);
    cleanCourse.moduleOrder = modules.map(function (moduleRecord) {
        return moduleRecord.id || moduleRecord.moduleId;
    }).filter(Boolean);

    batch.update(courseRef, removeUndefinedValues(cleanCourse));

    try {
        await batch.commit();
        executionState.result = { success: true, timestamp: Date.now(), newVersion: newVersion };
        return { valid: true };
    } catch (e) {
        return {
            valid: false,
            errors: [
                {
                    code: "COURSE_PUBLISH_WRITE_FAILED",
                    message: "Failed to publish course: " + e.message
                }
            ]
        };
    }
}

function createPublishCoursePayload(executionState) {
    const payload = executionState.payload || {};
    const context = executionState.context || {};
    const course = payload.course || context.course || null;

    if (!course) {
        return null;
    }

    return Object.assign({}, course, {
        id: course.id || payload.courseId || course.courseId
    });
}

function removeUndefinedValues(value) {
    if (Array.isArray(value)) {
        return value.map(removeUndefinedValues).filter(function (item) {
            return typeof item !== "undefined";
        });
    }

    if (!value || typeof value !== "object" || isFirestoreSentinel(value)) {
        return value;
    }

    const result = {};
    Object.keys(value).forEach(function (key) {
        const cleanValue = removeUndefinedValues(value[key]);
        if (typeof cleanValue !== "undefined") {
            result[key] = cleanValue;
        }
    });

    return result;
}

function isFirestoreSentinel(value) {
    return value && typeof value === "object" && value._methodName;
}

function countCourseSteps(modules) {
    return modules.reduce(function (total, moduleRecord) {
        return total + countModuleSteps(moduleRecord);
    }, 0);
}

function countModuleSteps(moduleRecord) {
    const stepIds = {};
    let count = 0;

    collectModuleSteps(moduleRecord).forEach(function (step) {
        const stepId = step && step.id ? step.id : "";
        if (stepId && stepIds[stepId]) {
            return;
        }

        if (stepId) {
            stepIds[stepId] = true;
        }
        count = count + 1;
    });

    if (count === 0 && moduleRecord && typeof moduleRecord.stepCount === "number") {
        return moduleRecord.stepCount;
    }

    return count;
}

function collectModuleSteps(moduleRecord) {
    let steps = [];

    if (!moduleRecord || typeof moduleRecord !== "object") {
        return steps;
    }

    if (Array.isArray(moduleRecord.steps)) {
        steps = steps.concat(moduleRecord.steps);
    }

    if (moduleRecord.learningModes && typeof moduleRecord.learningModes === "object") {
        Object.keys(moduleRecord.learningModes).forEach(function (modeId) {
            const mode = moduleRecord.learningModes[modeId];
            if (mode && Array.isArray(mode.steps)) {
                steps = steps.concat(mode.steps);
            }
        });
    }

    if (Array.isArray(moduleRecord.sessions)) {
        moduleRecord.sessions.forEach(function (session) {
            const practiceModes = session && session.practiceModes && typeof session.practiceModes === "object" ? session.practiceModes : {};
            Object.keys(practiceModes).forEach(function (modeKey) {
                if (practiceModes[modeKey] && Array.isArray(practiceModes[modeKey].steps)) {
                    steps = steps.concat(practiceModes[modeKey].steps);
                }
            });
        });
    }

    return steps;
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}

