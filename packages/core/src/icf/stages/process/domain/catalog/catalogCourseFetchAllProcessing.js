import { db, collection, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.119-student-dashboard-debug-safe";

export async function catalogCourseFetchAllProcessing(executionState) {

    const coursesRef = collection(db, "catalogCourses");
    const q = query(coursesRef, where("isDeleted", "==", false));

    const querySnapshot = await getDocs(q);
    const courses = [];

    querySnapshot.forEach(function (doc) {
        courses.push({ id: doc.id, ...doc.data() });
    });

    for (let index = 0; index < courses.length; index++) {
        const counts = await readCourseCounts(courses[index]);
        courses[index].moduleCount = counts.moduleCount;
        courses[index].stepCount = counts.stepCount;
    }

    executionState.result = courses;

    return { valid: true };
}

async function readCourseCounts(course) {
    const courseId = course.id;
    const modulesSnapshot = await getDocs(collection(db, "catalogCourses", courseId, "modules"));
    let moduleCount = 0;
    let stepCount = 0;
    const modules = [];

    modulesSnapshot.forEach(function (moduleDoc) {
        moduleCount = moduleCount + 1;
        modules.push(moduleDoc.id);
    });

    if (moduleCount === 0) {
        logCatalogModuleMismatch(course);
    }

    for (let index = 0; index < modules.length; index++) {
        stepCount = stepCount + await countModuleSteps(courseId, modules[index]);
    }

    return {
        moduleCount: moduleCount,
        stepCount: stepCount
    };
}

function logCatalogModuleMismatch(course) {
    const summaryModuleCount = typeof course.moduleCount === "number" ? course.moduleCount : 0;
    const moduleOrder = Array.isArray(course.moduleOrder) ? course.moduleOrder : [];

    if (summaryModuleCount > 0 || moduleOrder.length > 0) {
        console.warn("[course-modules:mismatch]", {
            courseId: course.id,
            moduleCount: summaryModuleCount,
            loadedModuleDocCount: 0,
            moduleOrder: moduleOrder
        });
        console.warn("moduleCount mismatch: course says modules exist but no module docs were found");
    }
}

async function countModuleSteps(courseId, moduleId) {
    const sessionsSnapshot = await getDocs(collection(db, "catalogCourses", courseId, "modules", moduleId, "sessions"));
    const modesSnapshot = await getDocs(collection(db, "catalogCourses", courseId, "modules", moduleId, "learningModes"));
    let stepCount = 0;
    const modeIds = [];

    modesSnapshot.forEach(function (modeDoc) {
        modeIds.push(modeDoc.id);
    });

    if (modeIds.length > 0) {
        for (let index = 0; index < modeIds.length; index++) {
            stepCount = stepCount + await countLearningModeSteps(courseId, moduleId, modeIds[index]);
        }
        return stepCount;
    }

    sessionsSnapshot.forEach(function (sessionDoc) {
        stepCount = stepCount + countPracticeModeSteps(sessionDoc.data().practiceModes);
    });

    return stepCount;
}

async function countLearningModeSteps(courseId, moduleId, modeId) {
    const stepsSnapshot = await getDocs(collection(db, "catalogCourses", courseId, "modules", moduleId, "learningModes", modeId, "steps"));
    let count = 0;

    stepsSnapshot.forEach(function () {
        count = count + 1;
    });

    return count;
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
