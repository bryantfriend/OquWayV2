import { db, writeBatch, doc, serverTimestamp } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.107-student-firebase-auth-chain";

export async function processSaveCourseDraft(executionState) {
    const { payload, context } = executionState;
    const courseCollectionName = readCourseCollectionName(executionState);
    if (!payload.course) {
        return { valid: false, errors: [{ message: "Course payload missing" }] };
    }

    const batch = writeBatch(db);

    // Update modules
    if (payload.modules) {
        for (let i = 0; i < payload.modules.length; i++) {
            const m = payload.modules[i];
            const modRef = doc(db, courseCollectionName, payload.course.id, "modules", m.id || m.moduleId);

            const cleanMod = Object.assign({}, m);
            delete cleanMod.isDirty;
            delete cleanMod.id; // Not needed in document body typically
            cleanMod.isDraft = true;

            batch.set(modRef, cleanMod);
        }
    }

    // Update course metadata (including tags, languages, title, etc from UI state)
    const courseRef = doc(db, courseCollectionName, payload.course.id);
    const cleanCourse = createCleanCourseDraft(payload.course, context);
    delete cleanCourse.isDirty;

    batch.update(courseRef, cleanCourse);

    try {
        await batch.commit();
        executionState.result = { success: true, timestamp: Date.now() };
        return { valid: true };
    } catch (e) {
        return {
            valid: false,
            errors: [
                {
                    code: "COURSE_DRAFT_WRITE_FAILED",
                    message: "Failed to save draft: " + e.message
                }
            ]
        };
    }
}

function createCleanCourseDraft(course, context) {
    const cleanCourse = Object.assign({}, course);

    cleanCourse.title = readLocalizedText(course.title);
    cleanCourse.description = readLocalizedText(course.description);
    cleanCourse.defaultLanguage = readDefaultLanguage(course.defaultLanguage);
    cleanCourse.status = readStatus(course.status);
    cleanCourse.updatedAt = serverTimestamp();
    cleanCourse.updatedBy = readActorId(context);

    return cleanCourse;
}

function readLocalizedText(value) {
    const localizedText = {
        en: "",
        ru: "",
        ky: ""
    };

    if (typeof value === "string") {
        localizedText.en = value;
        return localizedText;
    }

    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return localizedText;
    }

    localizedText.en = readText(value.en);
    localizedText.ru = readText(value.ru);
    localizedText.ky = readText(value.ky);

    return localizedText;
}

function readText(value) {
    if (typeof value !== "string") {
        return "";
    }

    return value;
}

function readDefaultLanguage(defaultLanguage) {
    if (defaultLanguage === "ru" || defaultLanguage === "ky") {
        return defaultLanguage;
    }

    return "en";
}

function readStatus(status) {
    if (status === "published" || status === "archived") {
        return status;
    }

    return "draft";
}

function readActorId(context) {
    if (context && context.actorId) {
        return context.actorId;
    }

    return "SYSTEM";
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}

