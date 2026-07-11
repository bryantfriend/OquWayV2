import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.82-shared-command-center-shell";
import { normalizePracticeModes } from "../../../process/domain/moduleEditor/practiceModeShells.js?v=1.1.82-shared-command-center-shell";
import { createDefaultProgressDocument } from "../../../process/domain/student/studentProgressHelpers.js?v=1.1.82-shared-command-center-shell";
import { findPreviewStudentCourse } from "../../../process/domain/student/previewStudentCourseFixture.js?v=1.1.220-student-dashboard-timeout-helper";

export async function attachStudentSessionContext(executionState) {
  var payload = executionState.payload;
  var actor = executionState.actor;

  if (!payload.courseId || !payload.moduleId || !payload.sessionId) {
    return { valid: true };
  }

  if (isPreviewActor(actor)) {
    return loadPreviewStudentSessionContext(actor, payload);
  }

  try {
    var courseSnap = await getDoc(doc(db, "courses", payload.courseId));
    var moduleSnap = await getDoc(doc(db, "courses", payload.courseId, "modules", payload.moduleId));
    var sessionSnap = await getDoc(doc(db, "courses", payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId));

    if (!courseSnap.exists()) {
      return createMissingContextError("STUDENT_COURSE_NOT_FOUND", "Course not found: " + payload.courseId);
    }

    if (!moduleSnap.exists()) {
      return createMissingContextError("STUDENT_MODULE_NOT_FOUND", "Module not found: " + payload.moduleId);
    }

    if (!sessionSnap.exists()) {
      return createMissingContextError("STUDENT_SESSION_NOT_FOUND", "Session not found: " + payload.sessionId);
    }

    return {
      valid: true,
      data: {
        course: Object.assign({ id: courseSnap.id }, courseSnap.data()),
        module: Object.assign({ id: moduleSnap.id }, moduleSnap.data()),
        session: normalizeSession(sessionSnap.id, sessionSnap.data()),
        progress: await readStudentProgress(actor, payload)
      }
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_SESSION_CONTEXT_FAILED",
          message: "Failed to load student session context: " + error.message
        }
      ]
    };
  }
}

function loadPreviewStudentSessionContext(actor, payload) {
  var course = findPreviewStudentCourse(payload.courseId, actor);
  var module = findModuleById(course, payload.moduleId);
  var session = findSessionById(module, payload.sessionId);

  if (!course) {
    return createMissingContextError("STUDENT_COURSE_NOT_FOUND", "Course not found: " + payload.courseId);
  }

  if (!module) {
    return createMissingContextError("STUDENT_MODULE_NOT_FOUND", "Module not found: " + payload.moduleId);
  }

  if (!session) {
    return createMissingContextError("STUDENT_SESSION_NOT_FOUND", "Session not found: " + payload.sessionId);
  }

  return {
    valid: true,
    data: {
      course: course,
      module: module,
      session: normalizeSession(session.id, session),
      progress: createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId)
    }
  };
}

function findModuleById(course, moduleId) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var index = 0;

  while (index < modules.length) {
    if (modules[index] && modules[index].id === moduleId) {
      return modules[index];
    }
    index = index + 1;
  }

  return null;
}

function findSessionById(module, sessionId) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var index = 0;

  while (index < sessions.length) {
    if (sessions[index] && sessions[index].id === sessionId) {
      return sessions[index];
    }
    index = index + 1;
  }

  return null;
}

function isPreviewActor(actor) {
  return actor && actor.id === "preview-student";
}
function normalizeSession(sessionId, sessionData) {
  var session = Object.assign({ id: sessionId }, sessionData);
  session.practiceModes = normalizePracticeModes(session.practiceModes);
  return session;
}

async function readStudentProgress(actor, payload) {
  if (!actor || !actor.id) {
    return createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId);
  }

  try {
    var progressRef = doc(db, "studentProgress", actor.id, "courses", payload.courseId, "sessions", payload.sessionId);
    var progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      return createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId);
    }

    return Object.assign(
      createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId),
      progressSnap.data()
    );
  } catch (error) {
    return createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId);
  }
}

function createMissingContextError(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}
