import { db, doc, getDoc, serverTimestamp, setDoc } from "../../firebase/index.js";
import { normalizeCourse } from "./index.js";
import { getModulesForCourse } from "../modules/index.js";

export async function getCourseById(courseId, options) {
  var sources = options && Array.isArray(options.sources) ? options.sources : ["courses", "catalogCourses"];
  var sourceIndex = 0;

  if (!courseId) {
    return null;
  }

  while (sourceIndex < sources.length) {
    var course = await readCourseFromSource(courseId, sources[sourceIndex]);

    if (course) {
      return course;
    }

    sourceIndex = sourceIndex + 1;
  }

  return null;
}

export async function getCourseModules(courseId, options) {
  return getModulesForCourse(courseId, options);
}

export async function createCourse(courseData) {
  var safeCourse = normalizeCourse(courseData || {});
  var courseId = safeCourse.id;

  if (!courseId) {
    throw new Error("Course id is required.");
  }

  await setDoc(doc(db, "catalogCourses", courseId), Object.assign({}, courseData || {}, {
    id: courseId,
    updatedAt: serverTimestamp(),
    createdAt: courseData && courseData.createdAt ? courseData.createdAt : serverTimestamp()
  }), { merge: true });

  return getCourseById(courseId, { sources: ["catalogCourses"] });
}

export async function updateCourse(courseId, updates) {
  if (!courseId) {
    throw new Error("Course id is required.");
  }

  await setDoc(doc(db, "catalogCourses", courseId), Object.assign({}, updates || {}, {
    updatedAt: serverTimestamp()
  }), { merge: true });

  return getCourseById(courseId, { sources: ["catalogCourses"] });
}

async function readCourseFromSource(courseId, source) {
  var courseSnap = await getDoc(doc(db, source, courseId));

  if (!courseSnap.exists()) {
    return null;
  }

  return Object.assign(normalizeCourse(Object.assign({ id: courseSnap.id }, courseSnap.data() || {})), {
    source: source
  });
}
