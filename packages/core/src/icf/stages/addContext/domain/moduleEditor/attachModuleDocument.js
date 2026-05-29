import { db, doc, getDoc, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js";

export async function attachModuleDocument(executionState) {
    const { payload } = executionState;
    if (!payload.courseId || !payload.moduleId) return { valid: true };

    try {
        const docRef = doc(db, "courses", payload.courseId, "modules", payload.moduleId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return {
                valid: false,
                errors: [{ message: "Module not found: " + payload.moduleId }]
            };
        }

        return { valid: true, data: { module: { id: docSnap.id, ...docSnap.data() } } };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach module document: " + err.message }]
        };
    }
}

