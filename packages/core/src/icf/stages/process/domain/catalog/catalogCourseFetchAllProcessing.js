import { db, collection, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js";

export async function catalogCourseFetchAllProcessing(executionState) {

    const coursesRef = collection(db, "catalogCourses");
    const q = query(coursesRef, where("isDeleted", "==", false));

    const querySnapshot = await getDocs(q);
    const courses = [];

    querySnapshot.forEach(function (doc) {
        courses.push({ id: doc.id, ...doc.data() });
    });

    for (let index = 0; index < courses.length; index++) {
        const counts = await readCourseCounts(courses[index].id);
        courses[index].moduleCount = counts.moduleCount;
        courses[index].stepCount = counts.stepCount;
    }

    executionState.result = courses;

    return { valid: true };
}

async function readCourseCounts(courseId) {
    const modulesSnapshot = await getDocs(collection(db, "catalogCourses", courseId, "modules"));
    let moduleCount = 0;
    let stepCount = 0;
    const modules = [];

    modulesSnapshot.forEach(function (moduleDoc) {
        moduleCount = moduleCount + 1;
        modules.push(moduleDoc.id);
    });

    for (let index = 0; index < modules.length; index++) {
        stepCount = stepCount + await countModuleSteps(courseId, modules[index]);
    }

    return {
        moduleCount: moduleCount,
        stepCount: stepCount
    };
}

async function countModuleSteps(courseId, moduleId) {
    const sessionsSnapshot = await getDocs(collection(db, "catalogCourses", courseId, "modules", moduleId, "sessions"));
    let stepCount = 0;

    sessionsSnapshot.forEach(function (sessionDoc) {
        stepCount = stepCount + countPracticeModeSteps(sessionDoc.data().practiceModes);
    });

    return stepCount;
}

function countPracticeModeSteps(practiceModes) {
    let count = 0;

    if (!practiceModes || typeof practiceModes !== "object") {
        return count;
    }

    Object.keys(practiceModes).forEach(function (key) {
        if (practiceModes[key] && Array.isArray(practiceModes[key].steps)) {
            count = count + practiceModes[key].steps.length;
        }
    });

    return count;
}
