import { db, writeBatch, doc, serverTimestamp } from "../../../../../infrastructure/firebase/firestore.js";

export async function processPublishCourse(executionState) {
    const { payload, context } = executionState;
    if (!payload.course) {
        return { valid: false, errors: [{ message: "Course payload missing" }] };
    }

    const batch = writeBatch(db);

    // Update modules
    if (payload.modules) {
        for (let i = 0; i < payload.modules.length; i++) {
            const m = payload.modules[i];
            const modRef = doc(db, "courses", payload.course.id, "modules", m.id || m.moduleId);

            const cleanMod = Object.assign({}, m);
            delete cleanMod.isDirty;
            delete cleanMod.id;
            cleanMod.isDraft = false;

            batch.set(modRef, cleanMod);
        }
    }

    // Update course metadata
    const courseRef = doc(db, "courses", payload.course.id);
    const newVersion = (payload.course.version || 1) + 1;

    const cleanCourse = Object.assign({}, payload.course);
    delete cleanCourse.isDirty;
    cleanCourse.updatedAt = serverTimestamp();
    cleanCourse.updatedBy = context.actorId || "SYSTEM";
    cleanCourse.status = "published";
    cleanCourse.version = newVersion;

    batch.update(courseRef, cleanCourse);

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

