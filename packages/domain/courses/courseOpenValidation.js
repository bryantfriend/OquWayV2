var PLAYABLE_TYPES = [
  "game",
  "question",
  "externaltask",
  "audio",
  "video",
  "text",
  "image",
  "choice",
  "multiplechoice",
  "multiselect",
  "scenariochoice",
  "reflection",
  "dragmatchisland",
  "matchinggame",
  "externaltaskstep",
  "externalstep",
  "external",
  "textblock",
  "imageblock",
  "audioblock",
  "videoblock",
  "questionblock",
  "choiceblock"
];

export function validateStudentCourseOpen(course, options) {
  var safeOptions = options || {};
  var modules = Array.isArray(course && course.modules) ? course.modules : [];
  var assignmentId = readText(safeOptions.assignmentId || (course && (course.assignmentId || course.courseAssignmentId)));
  var missingModuleIds = readMissingModuleIds(course, modules);
  var playableTarget = findFirstPlayableTarget(course);

  if (!course || !readText(course.id || course.courseId)) {
    return createValidationResult("courseMissing", false, "This course is not available right now.", "Course was not found.");
  }

  if (!assignmentId && safeOptions.requireAssignment !== false) {
    return createValidationResult("assignmentMissing", false, "This course is not available right now.", "Course assignment was not found.");
  }

  if (!isOpenableCourseStatus(course.status)) {
    return createValidationResult("courseUnavailable", false, "This course is not available right now.", "Course status does not allow opening.");
  }

  if (missingModuleIds.length > 0) {
    return Object.assign(createValidationResult(
      "moduleMissing",
      false,
      "Some course content could not be loaded.",
      "Some assigned course modules could not be loaded."
    ), {
      missingModuleIds: missingModuleIds
    });
  }

  if (modules.length === 0) {
    return createValidationResult(
      "noModules",
      false,
      "This course is not ready yet.",
      "Your teacher has assigned this course, but it does not contain any modules yet."
    );
  }

  if (!playableTarget && hasEmptyModuleOnly(modules)) {
    return createValidationResult("emptyModule", false, "This module is not ready yet.", "This module does not contain playable content yet.");
  }

  if (!playableTarget) {
    return createValidationResult(
      "noPlayableActivities",
      false,
      "This course has not been fully built yet.",
      "No playable activities were found in this course."
    );
  }

  return Object.assign(createValidationResult("playable", true, "", ""), {
    openTarget: playableTarget,
    playableModuleCount: countPlayableModules(modules)
  });
}

export function findFirstPlayableTarget(course) {
  var modules = Array.isArray(course && course.modules) ? course.modules : [];
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    var target = findFirstPlayableTargetInModule(course, modules[moduleIndex]);

    if (target) {
      return target;
    }

    moduleIndex = moduleIndex + 1;
  }

  return null;
}

export function countPlayableModules(modules) {
  var safeModules = Array.isArray(modules) ? modules : [];
  var count = 0;
  var moduleIndex = 0;

  while (moduleIndex < safeModules.length) {
    if (findFirstPlayableTargetInModule(null, safeModules[moduleIndex])) {
      count = count + 1;
    }

    moduleIndex = moduleIndex + 1;
  }

  return count;
}

export function isOpenableCourseStatus(status) {
  var normalized = readText(status).toLowerCase();

  return !normalized
    || normalized === "active"
    || normalized === "assigned"
    || normalized === "published"
    || normalized === "ready";
}

function findFirstPlayableTargetInModule(course, module) {
  var sessionTarget = findFirstPlayableSessionTarget(course, module);

  if (sessionTarget) {
    return sessionTarget;
  }

  return findFirstPlayableTrackTarget(course, module);
}

function findFirstPlayableSessionTarget(course, module) {
  var sessions = Array.isArray(module && module.sessions) ? module.sessions : [];
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    var session = sessions[sessionIndex];
    var practiceModes = session && session.practiceModes && typeof session.practiceModes === "object" ? session.practiceModes : {};
    var keys = Object.keys(practiceModes);
    var keyIndex = 0;

    while (keyIndex < keys.length) {
      if (hasPlayableItems(practiceModes[keys[keyIndex]].steps)) {
        return {
          courseId: readText(course && course.id),
          moduleId: readText(module && (module.id || module.moduleId)),
          sessionId: readText(session && (session.id || session.sessionId)),
          practiceModeKey: keys[keyIndex],
          learningModeId: readText(session && session.learningModeId),
          recommendationReason: "playablePracticeMode"
        };
      }

      keyIndex = keyIndex + 1;
    }

    if (hasPlayableItems(session.pages) || hasPlayableItems(session.blocks) || hasPlayableItems(session.steps)) {
      return {
        courseId: readText(course && course.id),
        moduleId: readText(module && (module.id || module.moduleId)),
        sessionId: readText(session && (session.id || session.sessionId)),
        practiceModeKey: "beforeClass",
        learningModeId: readText(session && session.learningModeId),
        recommendationReason: "playableSessionContent"
      };
    }

    sessionIndex = sessionIndex + 1;
  }

  return null;
}

function findFirstPlayableTrackTarget(course, module) {
  var modes = module && module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var modeKeys = Object.keys(modes);
  var modeIndex = 0;

  while (modeIndex < modeKeys.length) {
    var mode = modes[modeKeys[modeIndex]];
    var trackTarget = findPlayableTargetInMode(course, module, mode, modeKeys[modeIndex]);

    if (trackTarget) {
      return trackTarget;
    }

    modeIndex = modeIndex + 1;
  }

  if (hasPlayableItems(module.pages) || hasPlayableItems(module.blocks) || hasPlayableItems(module.steps)) {
    return {
      courseId: readText(course && course.id),
      moduleId: readText(module && (module.id || module.moduleId)),
      sessionId: "",
      practiceModeKey: "beforeClass",
      learningModeId: "",
      recommendationReason: "playableModuleContent"
    };
  }

  return null;
}

function findPlayableTargetInMode(course, module, mode, modeId) {
  var tracks = Array.isArray(mode && mode.tracks) ? mode.tracks : [];
  var trackIndex = 0;

  if (!mode || mode.status === "deleted") {
    return null;
  }

  if (hasPlayableItems(mode.steps) || hasPlayableItems(mode.pages) || hasPlayableItems(mode.blocks)) {
    return createModeTarget(course, module, mode, modeId, "playableLearningMode");
  }

  while (trackIndex < tracks.length) {
    if (hasPlayableItems(tracks[trackIndex] && tracks[trackIndex].pages)) {
      return createModeTarget(course, module, mode, modeId, "playableTrack");
    }

    trackIndex = trackIndex + 1;
  }

  return null;
}

function createModeTarget(course, module, mode, modeId, reason) {
  return {
    courseId: readText(course && course.id),
    moduleId: readText(module && (module.id || module.moduleId)),
    sessionId: readText(mode && (mode.legacySessionId || mode.id || modeId)),
    practiceModeKey: readPracticeModeKey(mode),
    learningModeId: readText(mode && (mode.id || modeId)),
    recommendationReason: reason
  };
}

function hasEmptyModuleOnly(modules) {
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    if (!moduleHasAnyContent(modules[moduleIndex])) {
      return true;
    }

    moduleIndex = moduleIndex + 1;
  }

  return false;
}

function moduleHasAnyContent(module) {
  var sessions = Array.isArray(module && module.sessions) ? module.sessions : [];
  var modes = module && module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};

  return sessions.length > 0
    || Object.keys(modes).length > 0
    || hasItems(module && module.pages)
    || hasItems(module && module.tracks)
    || hasItems(module && module.blocks)
    || hasItems(module && module.steps);
}

function hasPlayableItems(items) {
  var source = Array.isArray(items) ? items : [];
  var itemIndex = 0;

  while (itemIndex < source.length) {
    if (isPlayableItem(source[itemIndex])) {
      return true;
    }

    if (source[itemIndex] && typeof source[itemIndex] === "object") {
      if (hasPlayableItems(source[itemIndex].blocks)
        || hasPlayableItems(source[itemIndex].steps)
        || hasPlayableItems(source[itemIndex].pages)
        || hasPlayableItems(source[itemIndex].items)
        || hasPlayableItems(source[itemIndex].children)) {
        return true;
      }
    }

    itemIndex = itemIndex + 1;
  }

  return false;
}

function isPlayableItem(item) {
  var type = normalizeType(item && (item.type || item.blockType || item.stepType || item.kind));

  if (!item || typeof item !== "object") {
    return false;
  }

  if (!type && hasDisplayContent(item)) {
    return true;
  }

  return PLAYABLE_TYPES.indexOf(type) !== -1;
}

function hasDisplayContent(item) {
  return Boolean(
    readText(item.text)
      || readText(item.prompt)
      || readText(item.question)
      || readText(item.imageUrl || item.imageURL || item.src)
      || readText(item.audioUrl || item.audioURL)
      || readText(item.videoUrl || item.videoURL)
  );
}

function readMissingModuleIds(course, modules) {
  var expected = readExpectedModuleIds(course);
  var loaded = modules.map(function (module) {
    return readText(module && (module.id || module.moduleId));
  }).filter(Boolean);

  return expected.filter(function (moduleId) {
    return loaded.indexOf(moduleId) === -1;
  });
}

function readExpectedModuleIds(course) {
  var ids = [];

  addIds(ids, course && course.moduleOrder);
  addIds(ids, course && course.moduleIds);
  addRecordIds(ids, course && course.modules);

  return ids;
}

function addIds(ids, values) {
  var source = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < source.length) {
    addUniqueText(ids, source[index]);
    index = index + 1;
  }
}

function addRecordIds(ids, values) {
  var source = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < source.length) {
    if (source[index] && typeof source[index] === "object") {
      addUniqueText(ids, source[index].id || source[index].moduleId || source[index].refId);
    } else {
      addUniqueText(ids, source[index]);
    }
    index = index + 1;
  }
}

function addUniqueText(values, value) {
  var text = readText(value);

  if (text && values.indexOf(text) === -1) {
    values.push(text);
  }
}

function hasItems(items) {
  return Array.isArray(items) && items.length > 0;
}

function readPracticeModeKey(mode) {
  if (mode && mode.practiceModeKey) {
    return readText(mode.practiceModeKey);
  }

  if (mode && mode.modeType === "review") {
    return "afterClass";
  }

  if (mode && mode.modeType === "practice") {
    return "dailyPractice";
  }

  if (mode && mode.modeType === "assessment") {
    return "classroomLesson";
  }

  return "beforeClass";
}

function createValidationResult(code, playable, title, message) {
  return {
    code: code,
    playable: playable === true,
    title: title,
    message: message,
    validationResult: code
  };
}

function normalizeType(value) {
  return readText(value).replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}
