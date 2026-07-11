import { createDefaultProgressDocument } from "./studentProgressHelpers.js?v=1.1.82-shared-command-center-shell";

export function buildPreviewStudentCourses(actor) {
  return [
    buildPreviewStudentCourse(actor)
  ];
}

export function findPreviewStudentCourse(courseId, actor) {
  var courses = buildPreviewStudentCourses(actor);
  var courseIndex = 0;

  while (courseIndex < courses.length) {
    if (courses[courseIndex].id === courseId) {
      return courses[courseIndex];
    }

    courseIndex = courseIndex + 1;
  }

  return null;
}

function buildPreviewStudentCourse(actor) {
  return {
    id: "preview-oquway-starter",
    title: {
      en: "OquWay Starter Quest",
      ru: "OquWay Starter Quest",
      ky: "OquWay Starter Quest"
    },
    description: "A short preview course used when the student dashboard is opened without live school data.",
    status: "active",
    order: 1,
    assignmentId: "preview-assignment",
    courseAssignmentId: "preview-assignment",
    modules: [
      buildPreviewModule(actor)
    ]
  };
}

function buildPreviewModule(actor) {
  return {
    id: "preview-module-1",
    title: {
      en: "Meet Your Learning Path",
      ru: "Meet Your Learning Path",
      ky: "Meet Your Learning Path"
    },
    description: "Try the dashboard, open activities, and complete a tiny learning flow.",
    order: 1,
    sessions: [
      buildPreviewSession(actor)
    ]
  };
}

function buildPreviewSession(actor) {
  var courseId = "preview-oquway-starter";
  var moduleId = "preview-module-1";
  var sessionId = "preview-session-1";

  return {
    id: sessionId,
    title: {
      en: "First Student Mission",
      ru: "First Student Mission",
      ky: "First Student Mission"
    },
    order: 1,
    practiceModes: {
      beforeClass: buildPracticeMode("Warm Up", "Get ready for class.", [
        buildTextBriefingStep("preview-step-1", 1)
      ]),
      classroomLesson: buildPracticeMode("Class Mission", "Practice the core idea.", [
        buildVocabularyStep("preview-step-2", 1)
      ]),
      afterClass: buildPracticeMode("Reflect", "Show what you noticed.", [
        buildReflectionStep("preview-step-3", 1)
      ]),
      dailyPractice: buildPracticeMode("Daily Spark", "Keep the habit alive.", [
        buildTextBriefingStep("preview-step-4", 1)
      ])
    },
    progress: createDefaultProgressDocument(courseId, moduleId, sessionId)

  };
}

function buildPracticeMode(title, purpose, steps) {
  return {
    title: {
      en: title,
      ru: title,
      ky: title
    },
    purpose: purpose,
    steps: steps
  };
}

function buildTextBriefingStep(id, order) {
  return {
    id: id,
    type: "textBriefing",
    order: order,
    config: {
      heading: "Welcome to OquWay",
      bodyText: "Your dashboard shows courses, modules, progress, rewards, and feedback from your teacher.",
      calloutText: "Complete this quick step to see progress update."
    }
  };
}

function buildVocabularyStep(id, order) {
  return {
    id: id,
    type: "vocabulary",
    order: order,
    config: {
      word: "Progress",
      translation: "A little more learning than yesterday.",
      exampleSentence: "I can track my progress after each activity."
    }
  };
}

function buildReflectionStep(id, order) {
  return {
    id: id,
    type: "reflection",
    order: order,
    config: {
      question: "How ready do you feel to start learning today?",
      responseType: "scale",
      minWords: 0
    }
  };
}
