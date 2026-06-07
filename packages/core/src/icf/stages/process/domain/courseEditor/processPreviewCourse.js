import { db, collection, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.111-student-assignment-debug-panel";
import { normalizePracticeModes } from "../moduleEditor/practiceModeShells.js?v=1.1.111-student-assignment-debug-panel";

export async function processPreviewCourse(executionState) {
  var payload = executionState.payload || {};
  var courseResult = await readCourse(payload.courseId);

  if (!courseResult.course) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_PREVIEW_NOT_FOUND",
          message: "Course not found for preview."
        }
      ]
    };
  }

  courseResult.course.modules = await readModules(courseResult.collectionName, payload.courseId);
  executionState.result = {
    course: courseResult.course,
    previewMode: true,
    writesProgress: false
  };

  return { valid: true };
}

async function readCourse(courseId) {
  var collectionNames = ["catalogCourses", "courses"];
  var index = 0;

  while (index < collectionNames.length) {
    var snap = await getDoc(doc(db, collectionNames[index], courseId));

    if (snap.exists()) {
      return {
        collectionName: collectionNames[index],
        course: Object.assign({ id: snap.id }, snap.data())
      };
    }

    index = index + 1;
  }

  return {
    collectionName: "catalogCourses",
    course: null
  };
}

async function readModules(collectionName, courseId) {
  var modulesSnap = await getDocs(collection(db, collectionName, courseId, "modules"));
  var modules = [];

  modulesSnap.forEach(function (moduleSnap) {
    modules.push(Object.assign({ id: moduleSnap.id }, moduleSnap.data()));
  });

  modules.sort(compareByOrder);

  for (var moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
    modules[moduleIndex].sessions = await readSessions(collectionName, courseId, modules[moduleIndex].id);
  }

  return modules;
}

async function readSessions(collectionName, courseId, moduleId) {
  var sessionsSnap = await getDocs(collection(db, collectionName, courseId, "modules", moduleId, "sessions"));
  var sessions = [];

  sessionsSnap.forEach(function (sessionSnap) {
    var session = Object.assign({ id: sessionSnap.id }, sessionSnap.data());
    session.practiceModes = normalizePracticeModes(session.practiceModes);
    sessions.push(session);
  });

  sessions.sort(compareByOrder);
  return sessions;
}

function compareByOrder(first, second) {
  return readOrder(first) - readOrder(second);
}

function readOrder(value) {
  if (value && typeof value.order === "number") {
    return value.order;
  }

  return 0;
}
