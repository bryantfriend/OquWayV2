import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.29-module-render-fix";

export async function catalogCourseFetchAllProcessing(executionState) {
    try {
        const coursesRef = collection(db, "courses");
        const querySnapshot = await getDocs(coursesRef);

        const courses = [];
        querySnapshot.forEach(function (doc) {
            courses.push(Object.assign({ id: doc.id }, doc.data()));
        });

        executionState.result = courses;
        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            errors: [
                {
                    code: "COURSE_LIST_READ_FAILED",
                    message: "Failed to fetch courses: " + error.message
                }
            ]
        };
    }
}

