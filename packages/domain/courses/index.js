import { readSafeString } from "../../shared/utils/index.js";

export function normalizeCourse(course) {
  var safeCourse = course || {};

  return Object.assign({}, safeCourse, {
    id: readSafeString(safeCourse.id || safeCourse.courseId),
    title: readCourseTitle(safeCourse),
    status: readSafeString(safeCourse.status || "draft") || "draft"
  });
}

export function readCourseTitle(course) {
  var title = course && course.title;

  if (typeof title === "string") {
    return title.trim() || "Untitled Course";
  }

  if (title && typeof title.en === "string") {
    return title.en.trim() || "Untitled Course";
  }

  return readSafeString(course && (course.name || course.displayName)).trim() || "Untitled Course";
}

export * from "./courseQueries.js?v=1.1.91-student-auth-persistence";
export * from "./courseRepository.js";
