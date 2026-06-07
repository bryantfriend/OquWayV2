import { db, doc, getDoc, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.118-fruit-login-student-identity";

export async function attachStepsCollection(executionState) {
    const { payload } = executionState;
    if (!payload.courseId || !payload.moduleId) return { valid: true };

    try {
        const stepsRef = collection(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "steps");
        const snapshot = await getDocs(stepsRef);

        const steps = [];
        snapshot.forEach(function (doc) {
            steps.push({ id: doc.id, ...doc.data() });
        });

        // Sort locally
        steps.sort(function (a, b) {
            return (a.order || 0) - (b.order || 0);
        });

        return { valid: true, data: { steps: steps } };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach steps collection: " + err.message }]
        };
    }
}

function readCourseCollectionName(executionState) {
    if (executionState.context && executionState.context.courseCollectionName) {
        return executionState.context.courseCollectionName;
    }

    return "catalogCourses";
}
