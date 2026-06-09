import { db, doc, getDoc, serverTimestamp, setDoc } from "../../firebase/index.js";
import { normalizeCourse } from "./index.js";
import { getModulesForCourse } from "../modules/index.js";

export async function getCourseById(courseId, options) {
  var sources = options && Array.isArray(options.sources) ? options.sources : ["courses", "catalogCourses"];
  var sourceIndex = 0;
  var coursesBySource = {};
  var preferredCourse = null;

  if (!courseId) {
    return null;
  }

  while (sourceIndex < sources.length) {
    var course = await readCourseFromSource(courseId, sources[sourceIndex]);

    if (course) {
      coursesBySource[sources[sourceIndex]] = course;

      if (!preferredCourse) {
        preferredCourse = course;
      }
    }

    sourceIndex = sourceIndex + 1;
  }

  return enrichCourseFromFallbacks(preferredCourse, coursesBySource, sources);
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

function enrichCourseFromFallbacks(preferredCourse, coursesBySource, sources) {
  var enrichedCourse = preferredCourse ? Object.assign({}, preferredCourse) : null;
  var sourceIndex = 0;

  if (!enrichedCourse) {
    return null;
  }

  while (sourceIndex < sources.length) {
    var fallbackCourse = coursesBySource[sources[sourceIndex]];

    if (fallbackCourse && fallbackCourse !== preferredCourse) {
      enrichedCourse = mergeCourseDisplayFields(enrichedCourse, fallbackCourse);
    }

    sourceIndex = sourceIndex + 1;
  }

  return enrichedCourse;
}

function mergeCourseDisplayFields(course, fallbackCourse) {
  var mergedCourse = Object.assign({}, course);

  if (isGenericCourseTitle(mergedCourse.title) && !isGenericCourseTitle(fallbackCourse.title)) {
    mergedCourse.title = fallbackCourse.title;
    mergedCourse.name = fallbackCourse.name || mergedCourse.name;
    mergedCourse.displayName = fallbackCourse.displayName || mergedCourse.displayName;
    mergedCourse.displaySource = fallbackCourse.source || mergedCourse.displaySource;
  }

  if (isEmptyText(mergedCourse.description) && !isEmptyText(fallbackCourse.description)) {
    mergedCourse.description = fallbackCourse.description;
  }

  if (isEmptyText(mergedCourse.subject) && !isEmptyText(fallbackCourse.subject)) {
    mergedCourse.subject = fallbackCourse.subject;
  }

  if (isEmptyText(mergedCourse.level) && !isEmptyText(fallbackCourse.level)) {
    mergedCourse.level = fallbackCourse.level;
  }

  return mergedCourse;
}

function isGenericCourseTitle(value) {
  var title = readTextValue(value).trim().toLowerCase();

  return !title || title === "untitled course" || title === "new course";
}

function isEmptyText(value) {
  return readTextValue(value).trim().length === 0;
}

function readTextValue(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return value.en || value.ru || value.ky || "";
  }

  return "";
}
