import { db, doc, getDoc, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js";

export async function attachStepsCollection(executionState) {
    const { payload } = executionState;
    if (!payload.courseId || !payload.moduleId) return { valid: true };

    try {
        const stepsRef = collection(db, "courses", payload.courseId, "modules", payload.moduleId, "steps");
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

