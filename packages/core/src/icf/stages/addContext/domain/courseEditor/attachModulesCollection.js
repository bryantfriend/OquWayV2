import { db, doc, getDoc, collection, getDocs, query, orderBy } from "../../../../../infrastructure/firebase/firestore.js";

export async function attachModulesCollection(executionState) {
    const { payload } = executionState;
    if (!payload.courseId) return { valid: true };

    try {
        const modulesRef = collection(db, readCourseCollectionName(executionState), payload.courseId, "modules");
        const snapshot = await getDocs(modulesRef);

        const modules = [];
        snapshot.forEach(function (doc) {
            modules.push({ id: doc.id, ...doc.data() });
        });

        // Sort locally to prevent Firestore omitting documents lacking the 'order' field
        modules.sort(function (a, b) {
            return (a.order || 0) - (b.order || 0);
        });

        return { valid: true, data: { modules: modules } };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach modules collection: " + err.message }]
        };
    }
}

function readCourseCollectionName(executionState) {
    if (executionState.context && executionState.context.courseCollectionName) {
        return executionState.context.courseCollectionName;
    }

    return "catalogCourses";
}
