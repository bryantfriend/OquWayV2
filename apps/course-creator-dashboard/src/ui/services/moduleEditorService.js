import { runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.114-student-profile-rules";
import { getIntentDefinition } from "../../../../../packages/icf/index.js?v=1.1.114-student-profile-rules";
import { moduleEditorStore } from "../state/moduleEditorState.js?v=1.1.114-student-profile-rules";
import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.114-student-profile-rules";

function getActor() {
  return auth.currentUser ? { id: auth.currentUser.uid, role: "ROLE_COURSE_CREATOR" } : null;
}

export const moduleEditorService = {
  openModuleEditor: async function (courseId, moduleId) {
    moduleEditorStore.setState({ isFetching: true, error: null });
    logModuleEditorOpen(courseId, moduleId);

    if (!courseId) {
      moduleEditorStore.setState({
        error: "Cannot open module editor because courseId is missing.",
        isFetching: false
      });
      return;
    }

    if (!moduleId) {
      moduleEditorStore.setState({
        error: "Cannot open module editor because moduleId is missing.",
        isFetching: false
      });
      return;
    }

    try {
      const result = await runIntentPipeline(getIntentDefinition("OpenModuleEditorIntent"), {
        payload: {
          courseId: courseId,
          moduleId: moduleId
        },
        actor: getActor()
      });

      if (result && result.emitted && result.emitted.success) {
        var learningModes = result.emitted.data.learningModes || {};
        var selectedModeId = resolveSelectedModeId(learningModes, result.emitted.data.selectedModeId || result.emitted.data.selectedLearningModeId);
        var sessions = result.emitted.data.sessions || [];
        var selectedSessionId = resolveSelectedSessionId(sessions, learningModes, selectedModeId, result.emitted.data.selectedSessionId);

        moduleEditorStore.setState({
          course: result.emitted.data.course,
          courseContext: createCourseContext(courseId, moduleId, selectedModeId, result.emitted.data.courseCollectionName),
          module: result.emitted.data.module,
          learningContent: result.emitted.data.learningContent || {},
          learningModes: learningModes,
          selectedModeId: selectedModeId,
          selectedLearningModeId: selectedModeId,
          sessions: sessions,
          selectedSessionId: selectedSessionId,
          steps: result.emitted.data.steps || [],
          selectedStepId: result.emitted.data.selectedStepId,
          permissions: result.emitted.data.permissions,
          isFetching: false
        });
        return;
      }

      logIntentFailure("OpenModuleEditorIntent", result);
      moduleEditorStore.setState({
        error: readIntentErrorMessage(result),
        isFetching: false
      });
    } catch (error) {
      console.error("[ICF] OpenModuleEditorIntent threw:", error);
      moduleEditorStore.setState({
        error: error.message,
        isFetching: false
      });
    }
  },

  saveLearningContent: async function (courseId, moduleId, learningContent) {
    moduleEditorStore.setState({ isDraftSaving: true });

    var result = await runIntentPipeline(getIntentDefinition("SaveLearningContentIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        learningContent: learningContent
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      moduleEditorStore.setState({
        learningContent: result.emitted.data.learningContent,
        isDraftSaving: false,
        lastSaved: Date.now()
      });
      return result;
    }

    moduleEditorStore.setState({ isDraftSaving: false });
    throw new Error(readIntentErrorMessage(result));
  },

  selectLearningMode: function (modeId) {
    var state = moduleEditorStore.getState();
    var selectedModeId = resolveSelectedModeId(state.learningModes, modeId);
    var sessionId = resolveSelectedSessionId(state.sessions, state.learningModes, selectedModeId, state.selectedSessionId);
    var mode = readModeById(state.learningModes, selectedModeId);
    var currentContext = state.courseContext || {};

    moduleEditorStore.setState({
      selectedModeId: selectedModeId,
      selectedLearningModeId: selectedModeId,
      courseContext: createCourseContext(currentContext.courseId, currentContext.moduleId, selectedModeId, currentContext.courseCollectionName),
      selectedSessionId: sessionId,
      selectedPracticeModeKey: "beforeClass",
      selectedStepId: null
    });

    logModeSelection(selectedModeId, mode, state.learningModes, "steps");
  },

  createLearningMode: async function (courseId, moduleId, modeOptions) {
    var result = await runIntentPipeline(getIntentDefinition("CreateLearningModeIntent"), {
      payload: Object.assign({
        courseId: courseId,
        moduleId: moduleId
      }, modeOptions || {}),
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      mergeLearningModeResult(result.emitted.data);
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  deleteLearningMode: async function (courseId, moduleId, modeId) {
    var result = await runIntentPipeline(getIntentDefinition("DeleteLearningModeIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        modeId: modeId
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      var state = moduleEditorStore.getState();
      var currentContext = state.courseContext || {};
      moduleEditorStore.setState({
        learningModes: result.emitted.data.learningModes,
        selectedModeId: "primary",
        selectedLearningModeId: "primary",
        courseContext: createCourseContext(currentContext.courseId, currentContext.moduleId, "primary", currentContext.courseCollectionName),
        lastSaved: Date.now()
      });
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  renameLearningMode: async function (courseId, moduleId, modeId, title, purpose) {
    var result = await runIntentPipeline(getIntentDefinition("RenameLearningModeIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        modeId: modeId,
        title: title,
        purpose: purpose
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      moduleEditorStore.setState({
        learningModes: result.emitted.data.learningModes,
        selectedModeId: modeId,
        selectedLearningModeId: modeId,
        lastSaved: Date.now()
      });
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  duplicateLearningMode: async function (courseId, moduleId, modeId) {
    var result = await runIntentPipeline(getIntentDefinition("DuplicateLearningModeIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        modeId: modeId
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      mergeLearningModeResult(result.emitted.data);
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  generateModeFromPrimary: async function (courseId, moduleId) {
    var result = await runIntentPipeline(getIntentDefinition("GenerateModeFromPrimaryIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        title: "Generated Review Mode"
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      mergeLearningModeResult(result.emitted.data);
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  pullLearningContent: async function (courseId, moduleId, stepType, source) {
    var result = await runIntentPipeline(getIntentDefinition("PullLearningContentIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        stepType: stepType,
        source: source
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      return result.emitted.data.stepDraft;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  addSession: async function (courseId, moduleId) {
    try {
      var result = await runIntentPipeline(getIntentDefinition("CreateSessionIntent"), {
        payload: {
          courseId: courseId,
          moduleId: moduleId
        },
        actor: getActor()
      });

      if (result && result.emitted && result.emitted.success) {
        var state = moduleEditorStore.getState();
        var sessions = state.sessions.slice();

        sessions.push(result.emitted.data);
        moduleEditorStore.setState({
          sessions: sessions,
          selectedSessionId: result.emitted.data.id
        });
        return;
      }

      throw new Error(readIntentErrorMessage(result));
    } catch (error) {
      throw error;
    }
  },

  selectSession: function (sessionId) {
    moduleEditorStore.setState({
      selectedSessionId: sessionId,
      selectedPracticeModeKey: "beforeClass"
    });
  },

  selectPracticeMode: function (practiceModeKey) {
    moduleEditorStore.setState({ selectedPracticeModeKey: practiceModeKey });
  },

  addStepToLearningMode: async function (courseId, moduleId, modeId, stepTypeId, options) {
    var safeOptions = options || {};
    var courseContext = safeOptions.courseContext || createCourseContext(courseId, moduleId, modeId, safeOptions.courseCollectionName);
    var payload = {
      courseId: courseContext.courseId,
      moduleId: courseContext.moduleId,
      modeId: courseContext.modeId,
      sessionId: safeOptions.sessionId || null,
      practiceModeKey: safeOptions.practiceModeKey || "beforeClass",
      stepType: stepTypeId,
      stepTypeId: stepTypeId,
      courseContext: courseContext
    };

    if (!payload.courseId || !payload.moduleId || !payload.modeId || !payload.stepTypeId) {
      throw new Error("Cannot add step because course, module, or learning mode is missing.");
    }

    logStepAddPayload(payload);

    var result = await runIntentPipeline(getIntentDefinition("AddStepToLearningModeIntent"), {
      payload: payload,
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      var data = result.emitted.data || {};
      if (data.learningMode) {
        mergeLearningMode(data.learningMode);
      }

      if (data.session) {
        replaceSessionInState(data.session, data.stepId);
      }
      return result;
    }

    logStepAddContextFailure(payload, result);
    throw new Error(readIntentErrorMessage(result));
  },

  addStepToPracticeMode: async function (courseId, moduleId, modeId, sessionId, practiceModeKey, stepType) {
    return this.addStepToLearningMode(courseId, moduleId, modeId, stepType, {
      sessionId: sessionId,
      practiceModeKey: practiceModeKey
    });
  },

  updateLearningModeStep: async function (courseId, moduleId, modeId, stepId, updates) {
    var safeUpdates = updates || {};
    var result = await runIntentPipeline(getIntentDefinition("UpdateLearningModeStepIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        modeId: modeId,
        stepId: stepId,
        updates: safeUpdates
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      if (result.emitted.data && result.emitted.data.learningMode) {
        mergeLearningMode(result.emitted.data.learningMode);
      }
      moduleEditorStore.setState({
        selectedStepId: stepId,
        lastSaved: Date.now()
      });
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  updatePracticeModeStep: async function (courseId, moduleId, sessionId, practiceModeKey, step) {
    var state = moduleEditorStore.getState();
    var modeId = resolveSelectedModeId(state.learningModes, state.selectedModeId || state.selectedLearningModeId);
    return this.updateLearningModeStep(courseId, moduleId, modeId, step.id, {
      type: step.type,
      stepTypeId: step.stepTypeId || step.type,
      title: step.title,
      instructions: step.instructions,
      config: step.config,
      status: step.status
    });
  },

  previewStep: async function (courseId, moduleId, modeId, stepId) {
    console.info("[step-preview]", {
      courseId: courseId,
      moduleId: moduleId,
      modeId: modeId,
      stepId: stepId
    });

    var result = await runIntentPipeline(getIntentDefinition("PreviewStepIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        modeId: modeId,
        stepId: stepId
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      return result.emitted.data;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  deletePracticeModeStep: async function (courseId, moduleId, sessionId, practiceModeKey, stepId) {
    var result = await runIntentPipeline(getIntentDefinition("DeletePracticeModeStepIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId,
        practiceModeKey: practiceModeKey,
        stepId: stepId
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      replaceSessionInState(result.emitted.data);
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  reorderPracticeModeSteps: async function (courseId, moduleId, sessionId, practiceModeKey, orderedStepIds, selectedStepId) {
    var result = await runIntentPipeline(getIntentDefinition("ReorderPracticeModeStepsIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId,
        practiceModeKey: practiceModeKey,
        orderedStepIds: orderedStepIds
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      replaceSessionInState(result.emitted.data, selectedStepId);
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  uploadStepMedia: async function (courseId, moduleId, sessionId, practiceModeKey, stepId, mediaField, file) {
    var state = moduleEditorStore.getState();
    var modeId = resolveSelectedModeId(state.learningModes, state.selectedModeId || state.selectedLearningModeId);
    var result = await runIntentPipeline(getIntentDefinition("UploadStepMediaIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        modeId: modeId,
        stepId: stepId,
        mediaField: mediaField,
        file: file
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      if (result.emitted.data && result.emitted.data.learningMode) {
        mergeLearningMode(result.emitted.data.learningMode);
      }
      moduleEditorStore.setState({
        selectedStepId: stepId,
        lastSaved: Date.now()
      });
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  updatePracticeMode: async function (courseId, moduleId, sessionId, practiceMode) {
    var result = await runIntentPipeline(getIntentDefinition("UpdatePracticeModeIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId,
        practiceModeKey: practiceMode.key,
        title: practiceMode.title,
        purpose: practiceMode.purpose,
        enabled: practiceMode.enabled,
        status: practiceMode.status
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      replaceSessionInState(result.emitted.data);
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  repairSessionPracticeModes: async function (courseId, moduleId, sessionId) {
    var result = await runIntentPipeline(getIntentDefinition("CreatePracticeModeShellsIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      replaceSessionInState(result.emitted.data);
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  addStep: async function (courseId, moduleId, stepType) {
    alert("Step content is coming later. Create sessions first.");
  },

  updateStepField: async function (courseId, moduleId, stepId, fieldKey, value) {
    console.info("Step field updates are not enabled in the session shell phase.");
  },

  selectStep: function (stepId) {
    moduleEditorStore.setState({ selectedStepId: stepId });
  },

  saveDraft: async function (courseId, moduleId) {
    moduleEditorStore.setState({ isDraftSaving: false });
    console.info("Session shells save immediately through ICF create/update intents.");
  }
};

function replaceSessionInState(updatedSession, selectedStepId) {
  var state = moduleEditorStore.getState();
  var sessions = state.sessions.slice();
  var sessionIndex = 0;
  var nextSelectedStepId = state.selectedStepId;

  if (typeof selectedStepId === "string" && selectedStepId.length > 0) {
    nextSelectedStepId = selectedStepId;
  }

  while (sessionIndex < sessions.length) {
    if (sessions[sessionIndex].id === updatedSession.id) {
      sessions[sessionIndex] = updatedSession;
      moduleEditorStore.setState({
        sessions: sessions,
        selectedSessionId: updatedSession.id,
        selectedStepId: nextSelectedStepId,
        lastSaved: Date.now()
      });
      return;
    }

    sessionIndex = sessionIndex + 1;
  }

  sessions.push(updatedSession);
  moduleEditorStore.setState({
    sessions: sessions,
    selectedSessionId: updatedSession.id,
    selectedStepId: nextSelectedStepId,
    lastSaved: Date.now()
  });
}

function mergeLearningModeResult(data) {
  var state = moduleEditorStore.getState();
  var sessions = state.sessions.slice();
  var selectedModeId = data.learningMode && data.learningMode.id ? data.learningMode.id : (state.selectedModeId || state.selectedLearningModeId);
  var currentContext = state.courseContext || {};

  if (data.session) {
    var found = false;
    sessions = sessions.map(function (session) {
      if (session.id === data.session.id) {
        found = true;
        return data.session;
      }
      return session;
    });
    if (!found) {
      sessions.push(data.session);
    }
  }

  moduleEditorStore.setState({
    learningModes: data.learningModes || state.learningModes,
    selectedModeId: selectedModeId,
    selectedLearningModeId: selectedModeId,
    courseContext: createCourseContext(currentContext.courseId, currentContext.moduleId, selectedModeId, currentContext.courseCollectionName),
    selectedSessionId: data.session && data.session.id ? data.session.id : state.selectedSessionId,
    sessions: sessions,
    lastSaved: Date.now()
  });
}

function mergeLearningMode(learningMode) {
  var state = moduleEditorStore.getState();
  var modeId = learningMode && learningMode.id ? learningMode.id : null;

  if (!modeId) {
    return;
  }

  moduleEditorStore.setState({
    learningModes: Object.assign({}, state.learningModes, {
      [modeId]: learningMode
    }),
    selectedModeId: modeId,
    selectedLearningModeId: modeId,
    courseContext: createCourseContext(state.courseContext && state.courseContext.courseId, state.courseContext && state.courseContext.moduleId, modeId, state.courseContext && state.courseContext.courseCollectionName)
  });
}

function readIntentErrorMessage(result) {
  if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
    if (result.emitted.errors[0].message) {
      return result.emitted.errors[0].message;
    }

    if (result.emitted.errors[0].code) {
      return result.emitted.errors[0].code;
    }
  }

  if (result && result.errors && result.errors.length > 0) {
    if (result.errors[0].message) {
      return result.errors[0].message;
    }

    if (result.errors[0].code) {
      return result.errors[0].code;
    }
  }

  return "Unknown ICF error";
}

function logIntentFailure(intentName, result) {
  if (!result) {
    console.warn("[ICF] " + intentName + " failed without a result object.");
    return;
  }

  if (result.emitted && result.emitted.errors) {
    console.warn("[ICF] " + intentName + " errors:", result.emitted.errors);
    return;
  }

  if (result.errors) {
    console.warn("[ICF] " + intentName + " errors:", result.errors);
  }
}

function resolveSelectedModeId(learningModes, requestedModeId) {
  var modes = learningModes && typeof learningModes === "object" && !Array.isArray(learningModes) ? learningModes : {};
  var requested = typeof requestedModeId === "string" && requestedModeId.length > 0 ? requestedModeId : "";

  if (requested && modes[requested] && modes[requested].status !== "deleted") {
    return requested;
  }

  if (modes.primary && modes.primary.status !== "deleted") {
    return "primary";
  }

  var modeIds = Object.keys(modes).filter(function (modeId) {
    return modes[modeId] && modes[modeId].status !== "deleted";
  }).sort(function (firstModeId, secondModeId) {
    return (modes[firstModeId].order || 99) - (modes[secondModeId].order || 99);
  });

  return modeIds.length > 0 ? modeIds[0] : "primary";
}

function resolveSelectedSessionId(sessions, learningModes, selectedModeId, fallbackSessionId) {
  var safeSessions = Array.isArray(sessions) ? sessions : [];
  var mode = readModeById(learningModes, selectedModeId);
  var session = null;

  if (mode && mode.legacySessionId) {
    session = findSessionById(safeSessions, mode.legacySessionId);
    if (session) {
      return session.id;
    }
  }

  session = findSessionByLearningModeId(safeSessions, selectedModeId);
  if (session) {
    return session.id;
  }

  session = findSessionById(safeSessions, fallbackSessionId);
  if (session) {
    return session.id;
  }

  if (selectedModeId === "primary" && safeSessions.length > 0) {
    return safeSessions[0].id;
  }

  return null;
}

function readModeById(learningModes, modeId) {
  if (learningModes && modeId && learningModes[modeId]) {
    return learningModes[modeId];
  }

  return null;
}

function findSessionById(sessions, sessionId) {
  if (!sessionId) {
    return null;
  }

  var index = 0;
  while (index < sessions.length) {
    if (sessions[index].id === sessionId) {
      return sessions[index];
    }
    index = index + 1;
  }

  return null;
}

function findSessionByLearningModeId(sessions, modeId) {
  var index = 0;
  while (index < sessions.length) {
    if (sessions[index].learningModeId === modeId) {
      return sessions[index];
    }
    index = index + 1;
  }

  return null;
}

function logModeSelection(selectedModeId, selectedMode, learningModes, tab) {
  if (!isDevelopmentLoggingEnabled()) {
    return;
  }

  var modeIds = Object.keys(learningModes || {});

  if (!selectedMode) {
    console.warn("[module-editor:mode-select] selected mode missing", {
      selectedModeId: selectedModeId,
      availableModeIds: modeIds
    });
    return;
  }

  console.info("[module-editor:mode-select]", {
    selectedModeId: selectedModeId,
    selectedModeTitle: readModeTitle(selectedMode, selectedModeId),
    tab: tab || "steps",
    modeCount: modeIds.length
  });
}

function logStepAddPayload(payload) {
  if (!isDevelopmentLoggingEnabled()) {
    return;
  }

  console.info("[step:add] payload", {
    courseId: payload.courseId,
    moduleId: payload.moduleId,
    modeId: payload.modeId,
    stepTypeId: payload.stepTypeId,
    currentCourseContext: payload.courseContext || null
  });
}

function logStepAddContextFailure(payload, result) {
  if (!isDevelopmentLoggingEnabled()) {
    return;
  }

  var errorInfo = readFirstIntentError(result);

  console.warn("[step:add] addContext failed", {
    courseId: payload.courseId,
    moduleId: payload.moduleId,
    modeId: payload.modeId,
    stepTypeId: payload.stepTypeId,
    attemptedPaths: errorInfo.attemptedPaths,
    errorMessage: errorInfo.message,
    currentRoute: readCurrentRoute(),
    currentCourseContext: payload.courseContext || null
  });
}

function createCourseContext(courseId, moduleId, modeId, courseCollectionName) {
  var collectionName = courseCollectionName || "catalogCourses";
  var safeCourseId = courseId || "";
  var safeModuleId = moduleId || "";
  var safeModeId = modeId || "";
  var coursePath = collectionName + "/" + safeCourseId;
  var modulePath = coursePath + "/modules/" + safeModuleId;
  var modePath = modulePath + "/learningModes/" + safeModeId;

  return {
    courseId: safeCourseId,
    coursePath: coursePath,
    moduleId: safeModuleId,
    modulePath: modulePath,
    modeId: safeModeId,
    modePath: modePath,
    courseCollectionName: collectionName
  };
}

function readFirstIntentError(result) {
  var error = null;

  if (result && result.emitted && Array.isArray(result.emitted.errors) && result.emitted.errors.length > 0) {
    error = result.emitted.errors[0];
  } else if (result && Array.isArray(result.errors) && result.errors.length > 0) {
    error = result.errors[0];
  }

  if (!error) {
    return {
      message: "Unknown ICF error",
      attemptedPaths: []
    };
  }

  return {
    message: error.message || error.code || "Unknown ICF error",
    attemptedPaths: error.attemptedPaths || []
  };
}

function readModeTitle(mode, fallbackTitle) {
  if (!mode) {
    return fallbackTitle;
  }

  if (typeof mode.title === "string" && mode.title.length > 0) {
    return mode.title;
  }

  if (mode.title && typeof mode.title === "object") {
    return mode.title.en || mode.title.ru || mode.title.ky || fallbackTitle;
  }

  return fallbackTitle;
}

function logModuleEditorOpen(courseId, moduleId) {
  if (!isDevelopmentLoggingEnabled()) {
    return;
  }

  console.info("[module-editor:open]", {
    courseId: courseId || "",
    moduleId: moduleId || "",
    canonicalPath: "catalogCourses/" + (courseId || "") + "/modules/" + (moduleId || ""),
    hasCourseId: Boolean(courseId),
    hasModuleId: Boolean(moduleId)
  });
}

function readCurrentRoute() {
  if (typeof window === "undefined" || !window.location) {
    return "";
  }

  return window.location.href;
}

function isDevelopmentLoggingEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.search.indexOf("debug") !== -1;
}
