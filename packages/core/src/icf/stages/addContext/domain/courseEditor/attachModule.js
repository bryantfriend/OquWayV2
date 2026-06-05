import { db, doc, getDoc, collection, getDocs, query, orderBy } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.62-external-task-review-loop";

export async function attachModule(executionState) {
    const { payload, context } = executionState;

    if (context.modules && payload.moduleId) {
        let found = null;
        for (let i = 0; i < context.modules.length; i++) {
            if (context.modules[i].id === payload.moduleId) {
                found = context.modules[i];
                break;
            }
        }
        if (found) {
            return { valid: true, data: { module: found } };
        }
    }

    if (!payload.courseId || !payload.moduleId) return { valid: true };

    try {
        const docRef = doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return {
                valid: false,
                errors: [{ message: "Module not found" }]
            };
        }

        return { valid: true, data: { module: { id: docSnap.id, ...docSnap.data() } } };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach module: " + err.message }]
        };
    }
}

function readCourseCollectionName() {
    return "catalogCourses";
}
