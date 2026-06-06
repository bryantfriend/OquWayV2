import { processContinueLearning } from "./processContinueLearning.js?v=1.1.101-student-profile-fallback";
import { getAssignedCourseIds } from "../../../../../../../domain/courses/index.js?v=1.1.101-student-profile-fallback";

export async function processStudentOpenCourse(executionState) {
  var payload = executionState.payload || {};
  var courseId = readText(payload.courseId);
  var studentId = readText(payload.studentId || (executionState.actor ? executionState.actor.id : ""));
  var courses = Array.isArray(executionState.context.studentOpenCourses) ? executionState.context.studentOpenCourses : [];
  var assignmentResult = await getAssignedCourseIds(studentId, executionState.context.studentProfile);
  var assignmentId = assignmentResult.assignmentIdByCourseId[courseId] || "";
  var isAssignedCourse = assignmentResult.courseIds.indexOf(courseId) !== -1;
  var course = executionState.context.studentOpenCourse || findCourseById(courses, courseId);

  if (!course || (!isAssignedCourse && !isPreviewActor(executionState.actor))) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_COURSE_NOT_ASSIGNED",
          message: "This course is not assigned to this student."
        }
      ]
    };
  }

  course = attachAssignmentId(course, assignmentId);
  courses = [course];

  if (!assignmentId && !isPreviewActor(executionState.actor)) {
    executionState.warnings.push({
      code: "STUDENT_COURSE_ASSIGNMENT_ID_MISSING",
      message: "Course is visible from a legacy profile course field, but no courseAssignments document was found for progress context."
    });
  }

  var modules = Array.isArray(course.modules) ? course.modules : [];
  var openTarget = await selectCourseOpenTarget(executionState, course);
  var hasActivity = hasOpenableActivity(course, openTarget);

  if (modules.length === 0) {
    openTarget = createEmptyCourseTarget(course);
  } else if (!openTarget.moduleId) {
    openTarget = createModuleOnlyTarget(course, modules[0]);
  }

  console.info("[student-course:open]", {
    studentId: studentId,
    courseId: courseId,
    assignmentId: course.assignmentId || "",
    assignmentSource: assignmentId ? assignmentResult.source : "legacy-profile-course",
    moduleCount: modules.length,
    selectedModuleId: openTarget.moduleId,
    selectedSessionId: openTarget.sessionId,
    selectedPracticeModeKey: openTarget.practiceModeKey,
    hasActivity: hasActivity
  });

  executionState.result = {
    student: executionState.context.studentProfile,
    course: course,
    courses: courses,
    modules: modules,
    openTarget: openTarget,
    hasModules: modules.length > 0,
    hasActivity: hasActivity,
    emptyCourseState: modules.length === 0 ? {
      type: "noModules",
      message: "Your course is assigned, but no modules are ready yet."
    } : null
  };

  return {
    valid: true,
    data: executionState.result
  };
}

function attachAssignmentId(course, assignmentId) {
  if (!course) {
    return course;
  }

  return Object.assign({}, course, {
    assignmentId: assignmentId || course.assignmentId || "",
    courseAssignmentId: assignmentId || course.courseAssignmentId || course.assignmentId || ""
  });
}

function isPreviewActor(actor) {
  return actor && actor.id === "preview-student";
}

async function selectCourseOpenTarget(executionState, course) {
  var continueState = Object.assign({}, executionState, {
    payload: {
      courses: [course]
    },
    result: null
  });
  var continueResult = await processContinueLearning(continueState);
  var recommendation = continueState.result && continueState.result.continueLearning
    ? continueState.result.continueLearning
    : null;

  if (!continueResult || continueResult.valid === false || !recommendation) {
    return createEmptyCourseTarget(course);
  }

  return {
    courseId: readText(recommendation.courseId || course.id),
    moduleId: readText(recommendation.moduleId),
    sessionId: readText(recommendation.sessionId),
    practiceModeKey: readText(recommendation.practiceModeKey) || "beforeClass",
    learningModeId: readText(recommendation.learningModeId),
    actionLabel: readText(recommendation.actionLabel) || "Start Learning",
    recommendationReason: readText(recommendation.recommendationReason)
  };
}

function hasOpenableActivity(course, openTarget) {
  var module = findModuleById(course, openTarget ? openTarget.moduleId : "");
  var session = findSessionById(module, openTarget ? openTarget.sessionId : "");
  var practiceModeKey = openTarget && openTarget.practiceModeKey ? openTarget.practiceModeKey : "beforeClass";
  var practiceMode = session && session.practiceModes ? session.practiceModes[practiceModeKey] : null;

  return Boolean(practiceMode && Array.isArray(practiceMode.steps) && practiceMode.steps.length > 0);
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

function findModuleById(course, moduleId) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    if (modules[moduleIndex] && modules[moduleIndex].id === moduleId) {
      return modules[moduleIndex];
    }

    moduleIndex = moduleIndex + 1;
  }

  return null;
}

function findSessionById(module, sessionId) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    if (sessions[sessionIndex] && sessions[sessionIndex].id === sessionId) {
      return sessions[sessionIndex];
    }

    sessionIndex = sessionIndex + 1;
  }

  return null;
}

function createEmptyCourseTarget(course) {
  return {
    courseId: readText(course ? course.id : ""),
    moduleId: "",
    sessionId: "",
    practiceModeKey: "beforeClass",
    learningModeId: "",
    actionLabel: "Start Learning",
    recommendationReason: "emptyCourse"
  };
}

function createModuleOnlyTarget(course, module) {
  return {
    courseId: readText(course ? course.id : ""),
    moduleId: readText(module ? module.id : ""),
    sessionId: "",
    practiceModeKey: "beforeClass",
    learningModeId: "",
    actionLabel: "Start Learning",
    recommendationReason: "firstModule"
  };
}

function readText(value) {
  return typeof value === "string" ? value : "";
}
