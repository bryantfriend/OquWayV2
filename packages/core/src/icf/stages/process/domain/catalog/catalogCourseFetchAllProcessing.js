import { db, collection, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js";

export async function catalogCourseFetchAllProcessing(executionState) {

    const coursesRef = collection(db, "catalogCourses");
    const q = query(coursesRef, where("isDeleted", "==", false));

    const querySnapshot = await getDocs(q);
    const courses = [];

    querySnapshot.forEach(function (doc) {
        courses.push({ id: doc.id, ...doc.data() });
    });

    executionState.result = courses;

    return { valid: true };
}

