import { processLoadStudentCourse } from "../../../process/domain/student/processLoadStudentCourse.js?v=1.1.29-module-render-fix";

export async function attachStudentOpenCourseContext(executionState) {
  var payload = executionState.payload || {};
  var courseId = typeof payload.courseId === "string" ? payload.courseId : "";
  var loadState = Object.assign({}, executionState, {
    result: null
  });
  var loadResult = await processLoadStudentCourse(loadState);
  var courses = loadState.result && Array.isArray(loadState.result.courses) ? loadState.result.courses : [];
  var course = findCourseById(courses, courseId);
  var modules = course && Array.isArray(course.modules) ? course.modules : [];

  if (!loadResult || loadResult.valid === false) {
    return loadResult;
  }

  return {
    valid: true,
    data: {
      studentOpenCourses: courses,
      studentOpenCourse: course,
      studentOpenModules: modules,
      studentOpenProgressLoaded: true
    }
  };
}

function findCourseById(courses, courseId) {
  var courseIndex = 0;

  while (courseIndex < courses.length) {
    if (courses[courseIndex] && courses[courseIndex].id === courseId) {
      return courses[courseIndex];
    }

    courseIndex = courseIndex + 1;
  }

  return null;
}
