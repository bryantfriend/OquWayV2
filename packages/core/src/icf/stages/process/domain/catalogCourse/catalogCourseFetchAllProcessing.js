import { db, collection, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.119-student-dashboard-debug-safe";

const COURSE_COUNT_CONCURRENCY = 4;
const MODULE_COUNT_CONCURRENCY = 4;
const MODE_COUNT_CONCURRENCY = 6;

export async function catalogCourseFetchAllProcessing(executionState) {
  try {
    const courses = await readCatalogCoursesWithLegacyFallback();

    const countedCourses = await mapWithLimit(courses, COURSE_COUNT_CONCURRENCY, async function (course) {
      const counts = await readCourseCounts(course);
      return Object.assign({}, course, {
        moduleCount: counts.moduleCount,
        stepCount: counts.stepCount,
        countsVerifiedAt: counts.countsVerifiedAt,
        countsVerified: true,
        countSource: counts.source,
        moduleCountSource: counts.source
      });
    });

    executionState.result = countedCourses;
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

async function readCourseCounts(course) {
  const courseId = course.id;
  const storedModuleCount = readStoredCount(course.moduleCount);
  const storedStepCount = readStoredCount(course.stepCount);
  const catalogModules = await readModulesFromSource("catalogCourses", courseId);
  const legacyModules = catalogModules.length === 0
    ? await readModulesFromSource("courses", courseId)
    : [];
  const modules = catalogModules.length > 0 ? catalogModules : legacyModules;
  const source = catalogModules.length > 0 ? "catalogCourses" : (legacyModules.length > 0 ? "courses" : "catalogCourses");
  const stepCounts = await mapWithLimit(modules, MODULE_COUNT_CONCURRENCY, async function (module) {
    return await countModuleSteps(source, courseId, module);
  });
  const actualStepCount = stepCounts.reduce(function (total, count) {
    return total + count;
  }, 0);

  if (storedModuleCount !== modules.length || storedStepCount !== actualStepCount) {
    console.warn("[course-counts:mismatch]", {
      courseId: courseId,
      storedModuleCount: storedModuleCount,
      actualModuleCount: modules.length,
      storedStepCount: storedStepCount,
      actualStepCount: actualStepCount,
      source: source
    });
  }

  if (source === "courses" && modules.length > 0) {
    console.warn("[course-counts:legacy-source]", {
      courseId: courseId,
      moduleCount: modules.length,
      stepCount: actualStepCount,
      source: source
    });
  }

  return {
    moduleCount: modules.length,
    stepCount: actualStepCount,
    countsVerifiedAt: Date.now(),
    source: source
  };
}

async function readCatalogCoursesWithLegacyFallback() {
  const coursesById = {};
  const catalogCoursesSnapshot = await getDocs(query(collection(db, "catalogCourses"), where("isDeleted", "==", false)));
  const legacyCoursesSnapshot = await getDocs(collection(db, "courses"));

  legacyCoursesSnapshot.forEach(function (courseDoc) {
    const course = Object.assign({ id: courseDoc.id, courseRecordSource: "courses" }, courseDoc.data());

    if (course.isDeleted !== true) {
      coursesById[courseDoc.id] = course;
    }
  });

  catalogCoursesSnapshot.forEach(function (courseDoc) {
    coursesById[courseDoc.id] = Object.assign({ id: courseDoc.id, courseRecordSource: "catalogCourses" }, courseDoc.data());
  });

  return Object.keys(coursesById).map(function (courseId) {
    return coursesById[courseId];
  });
}

async function readModulesFromSource(source, courseId) {
  const modulesSnapshot = await getDocs(collection(db, source, courseId, "modules"));
  const modules = [];

  modulesSnapshot.forEach(function (moduleDoc) {
    modules.push(Object.assign({ id: moduleDoc.id }, moduleDoc.data()));
  });

  return modules;
}

async function countModuleSteps(source, courseId, module) {
  const moduleId = module.id || module.moduleId;
  if (!moduleId) {
    return 0;
  }

  const learningModeIds = await readLearningModeIds(source, courseId, moduleId, module.learningModes);

  if (learningModeIds.length > 0) {
    const modeStepCounts = await mapWithLimit(learningModeIds, MODE_COUNT_CONCURRENCY, async function (modeId) {
      return await countLearningModeSteps(source, courseId, moduleId, modeId, module.learningModes);
    });

    return modeStepCounts.reduce(function (total, count) {
      return total + count;
    }, 0);
  }

  return await countLegacySessionSteps(source, courseId, moduleId, module);
}

async function readLearningModeIds(source, courseId, moduleId, embeddedLearningModes) {
  const modeIds = [];
  const seen = {};
  const modesSnapshot = await getDocs(collection(db, source, courseId, "modules", moduleId, "learningModes"));

  modesSnapshot.forEach(function (modeDoc) {
    seen[modeDoc.id] = true;
    modeIds.push(modeDoc.id);
  });

  if (embeddedLearningModes && typeof embeddedLearningModes === "object" && !Array.isArray(embeddedLearningModes)) {
    Object.keys(embeddedLearningModes).forEach(function (modeId) {
      if (!seen[modeId]) {
        seen[modeId] = true;
        modeIds.push(modeId);
      }
    });
  }

  return modeIds;
}

async function countLearningModeSteps(source, courseId, moduleId, modeId, embeddedLearningModes) {
  const stepsSnapshot = await getDocs(collection(db, source, courseId, "modules", moduleId, "learningModes", modeId, "steps"));

  if (!stepsSnapshot.empty) {
    return stepsSnapshot.size;
  }

  const embeddedMode = embeddedLearningModes && embeddedLearningModes[modeId] ? embeddedLearningModes[modeId] : null;
  if (embeddedMode && Array.isArray(embeddedMode.steps)) {
    return embeddedMode.steps.length;
  }

  return 0;
}

async function countLegacySessionSteps(source, courseId, moduleId, module) {
  const sessionsSnapshot = await getDocs(collection(db, source, courseId, "modules", moduleId, "sessions"));
  let stepCount = 0;

  sessionsSnapshot.forEach(function (sessionDoc) {
    stepCount = stepCount + countPracticeModeSteps(sessionDoc.data().practiceModes);
  });

  if (stepCount > 0) {
    return stepCount;
  }

  if (Array.isArray(module.sessions)) {
    module.sessions.forEach(function (session) {
      stepCount = stepCount + countPracticeModeSteps(session.practiceModes);
    });
  }

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

function readStoredCount(value) {
  return typeof value === "number" ? value : 0;
}

async function mapWithLimit(items, limit, iterator) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex = nextIndex + 1;
      results[currentIndex] = await iterator(items[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.min(limit, items.length);
  const workers = [];
  let workerIndex = 0;

  while (workerIndex < workerCount) {
    workers.push(worker());
    workerIndex = workerIndex + 1;
  }

  await Promise.all(workers);
  return results;
}
