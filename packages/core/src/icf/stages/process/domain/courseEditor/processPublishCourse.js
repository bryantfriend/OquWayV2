import { db, writeBatch, doc, serverTimestamp } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";
import { countModuleSteps as countSharedModuleSteps } from "../../../../../../../domain/progress/index.js";

export async function processPublishCourse(executionState) {
    const { payload, context } = executionState;
    const courseCollectionName = readCourseCollectionName(executionState);
    const course = createPublishCoursePayload(executionState);
    const courseId = course && (course.id || payload.courseId);
    const modules = Array.isArray(context.modules) ? context.modules : [];

    if (!course || !courseId) {
        return { valid: false, errors: [{ message: "Course payload missing" }] };
    }

    if (!hasCourseTitle(course)) {
        return { valid: false, errors: [{ code: "COURSE_TITLE_REQUIRED", message: "Course title is required." }] };
    }

    if (modules.length === 0) {
        return { valid: false, errors: [{ code: "COURSE_MODULES_REQUIRED", message: "Course must have at least one saved module before publishing." }] };
    }

    const batch = writeBatch(db);

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
            cleanMod.status = "published";
            cleanMod.courseId = courseId;
            cleanMod.moduleId = moduleId;
            cleanMod.publishedAt = serverTimestamp();
            cleanMod.updatedAt = serverTimestamp();

            batch.set(modRef, removeUndefinedValues(cleanMod), { merge: true });
        }
    }

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
    cleanCourse.moduleIds = cleanCourse.moduleOrder.slice();

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
    const course = context.course || payload.course || null;

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
        return total + countSharedModuleSteps(moduleRecord);
    }, 0);
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}

function hasCourseTitle(course) {
    return hasLocalizedText(course && (course.title || course.name || course.displayName));
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
