import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.124-location-icon-upload";
import { normalizePracticeModes } from "../../../process/domain/moduleEditor/practiceModeShells.js?v=1.1.124-location-icon-upload";
import { createDefaultProgressDocument } from "../../../process/domain/student/studentProgressHelpers.js?v=1.1.124-location-icon-upload";
import { resolveActorStudentId } from "../../../../../../../domain/users/index.js?v=1.1.124-location-icon-upload";

export async function attachStudentSessionContext(executionState) {
  var payload = executionState.payload;
  var actor = executionState.actor;
  var contextResult = null;

  if (!payload.courseId || !payload.moduleId || !payload.sessionId) {
    return { valid: true };
  }

  try {
    contextResult = await readStudentSessionFromSources(payload);

    if (!contextResult.valid) {
      return contextResult;
    }

    return {
      valid: true,
      data: {
        course: contextResult.course,
        module: contextResult.module,
        session: normalizeSession(contextResult.session.id, contextResult.session),
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

async function readStudentSessionFromSources(payload) {
  var sources = createCourseSources(payload);
  var sourceIndex = 0;
  var sawCourse = false;
  var sawModule = false;

  while (sourceIndex < sources.length) {
    var source = sources[sourceIndex];
    var courseSnap = await getDoc(doc(db, source, payload.courseId));

    if (!courseSnap.exists()) {
      sourceIndex = sourceIndex + 1;
      continue;
    }

    sawCourse = true;

    var moduleSnap = await getDoc(doc(db, source, payload.courseId, "modules", payload.moduleId));
    if (!moduleSnap.exists()) {
      sourceIndex = sourceIndex + 1;
      continue;
    }

    sawModule = true;

    var sessionSnap = await getDoc(doc(db, source, payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId));
    if (!sessionSnap.exists()) {
      sourceIndex = sourceIndex + 1;
      continue;
    }

    return {
      valid: true,
      source: source,
      course: Object.assign({ id: courseSnap.id, courseRecordSource: source }, courseSnap.data()),
      module: Object.assign({ id: moduleSnap.id, courseRecordSource: source }, moduleSnap.data()),
      session: Object.assign({ id: sessionSnap.id, courseRecordSource: source }, sessionSnap.data())
    };
  }

  if (!sawCourse) {
    return createMissingContextError("STUDENT_COURSE_NOT_FOUND", "Course not found: " + payload.courseId);
  }

  if (!sawModule) {
    return createMissingContextError("STUDENT_MODULE_NOT_FOUND", "Module not found: " + payload.moduleId);
  }

  return createMissingContextError("STUDENT_SESSION_NOT_FOUND", "Session not found: " + payload.sessionId);
}

function createCourseSources(payload) {
  var sources = [];

  appendSource(sources, payload.courseCollectionName);
  appendSource(sources, payload.courseRecordSource);
  appendSource(sources, "catalogCourses");
  appendSource(sources, "courses");

  return sources;
}

function appendSource(sources, value) {
  var source = typeof value === "string" ? value.trim() : "";

  if ((source === "catalogCourses" || source === "courses") && sources.indexOf(source) === -1) {
    sources.push(source);
  }
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
    var progressRef = doc(db, "studentProgress", resolveActorStudentId(actor), "courses", payload.courseId, "sessions", payload.sessionId);
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
