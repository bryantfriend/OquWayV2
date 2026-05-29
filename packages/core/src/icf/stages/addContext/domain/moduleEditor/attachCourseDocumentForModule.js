import { db, doc, getDoc, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js";

export async function attachCourseDocumentForModule(executionState) {
    const { payload } = executionState;
    if (!payload.courseId) return { valid: true };

    try {
        const docRef = doc(db, "courses", payload.courseId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return {
                valid: false,
                errors: [{ message: "Course not found: " + payload.courseId }]
            };
        }

        return { valid: true, data: { course: { id: docSnap.id, ...docSnap.data() } } };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach course document: " + err.message }]
        };
    }
}

