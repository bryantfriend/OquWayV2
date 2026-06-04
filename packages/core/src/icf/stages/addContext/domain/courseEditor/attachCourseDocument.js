import { db, doc, getDoc, collection, getDocs, query, orderBy } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.54-multi-role-assistant";

export async function attachCourseDocument(executionState) {
    const { payload } = executionState;
    if (!payload.courseId) return { valid: true };

    try {
        const courseSnapResult = await readCourseSnap(payload.courseId);
        const docSnap = courseSnapResult.snap;

        if (!docSnap.exists()) {
            return {
                valid: false,
                errors: [{ message: "Course not found: " + payload.courseId }]
            };
        }

        return {
            valid: true,
            data: {
                course: { id: docSnap.id, ...docSnap.data() },
                courseCollectionName: courseSnapResult.collectionName
            }
        };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach course document: " + err.message }]
        };
    }
}

async function readCourseSnap(courseId) {
    const collectionNames = ["catalogCourses", "courses"];
    let index = 0;

    while (index < collectionNames.length) {
        const docSnap = await getDoc(doc(db, collectionNames[index], courseId));

        if (docSnap.exists()) {
            return {
                collectionName: collectionNames[index],
                snap: docSnap
            };
        }

        index = index + 1;
    }

    return {
        collectionName: "catalogCourses",
        snap: {
            exists: function () {
                return false;
            }
        }
    };
}
