import { db, collection, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.219-course-creator-all-courses";

const COURSE_COUNT_CONCURRENCY = 8;

export async function catalogCourseFetchAllProcessing(executionState) {
  try {
    const courses = await readCatalogCoursesWithLegacyFallback();

    const countedCourses = await mapWithLimit(courses, COURSE_COUNT_CONCURRENCY, async function (course) {
      const counts = readLightweightCourseCounts(course);
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

async function readCatalogCoursesWithLegacyFallback() {
  const coursesById = {};
  const legacyCoursesSnapshot = await getDocs(collection(db, "courses"));
  const catalogCoursesSnapshot = await getDocs(query(collection(db, "catalogCourses"), where("isDeleted", "==", false)));

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

function readLightweightCourseCounts(course) {
  const storedModuleCount = readStoredCount(course.moduleCount);
  const storedStepCount = readStoredCount(course.stepCount);
  const embeddedModules = Array.isArray(course.modules) ? course.modules : [];

  if (storedModuleCount > 0 || storedStepCount > 0) {
    return {
      moduleCount: storedModuleCount,
      stepCount: storedStepCount,
      countsVerifiedAt: readCountTimestamp(course),
      source: course.countSource || course.moduleCountSource || course.courseRecordSource || "stored"
    };
  }

  if (embeddedModules.length > 0) {
    return {
      moduleCount: embeddedModules.length,
      stepCount: countEmbeddedCourseSteps(embeddedModules),
      countsVerifiedAt: Date.now(),
      source: "embedded"
    };
  }

  return {
    moduleCount: 0,
    stepCount: 0,
    countsVerifiedAt: Date.now(),
    source: course.courseRecordSource || "unavailable"
  };
}

function countEmbeddedCourseSteps(modules) {
  let count = 0;

  modules.forEach(function (module) {
    if (Array.isArray(module.steps)) {
      count = count + module.steps.length;
    }

    if (module.learningModes && typeof module.learningModes === "object") {
      Object.keys(module.learningModes).forEach(function (modeId) {
        const mode = module.learningModes[modeId];

        if (mode && Array.isArray(mode.steps)) {
          count = count + mode.steps.length;
        }
      });
    }

    if (Array.isArray(module.sessions)) {
      module.sessions.forEach(function (session) {
        count = count + countPracticeModeSteps(session.practiceModes);
      });
    }
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

function readStoredCount(value) {
  return typeof value === "number" ? value : 0;
}

function readCountTimestamp(course) {
  if (course && course.countsVerifiedAt) {
    return course.countsVerifiedAt;
  }

  return Date.now();
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
