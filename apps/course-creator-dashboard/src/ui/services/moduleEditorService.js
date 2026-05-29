import { runIntentPipeline } from "../../../../../packages/core/src/icf/engine/runIntentPipeline.js";
import { getIntentDefinition } from "../../../../../packages/core/src/icf/engine/intentRegistry.js";
import { moduleEditorStore } from "../state/moduleEditorState.js";
import { auth } from "../../../../../packages/core/src/infrastructure/firebase/auth.js";

function getActor() {
  return auth.currentUser ? { id: auth.currentUser.uid, role: "ROLE_COURSE_CREATOR" } : null;
}

export const moduleEditorService = {
  openModuleEditor: async function (courseId, moduleId) {
    moduleEditorStore.setState({ isFetching: true, error: null });

    try {
      const result = await runIntentPipeline(getIntentDefinition("OpenModuleEditorIntent"), {
        payload: {
          courseId: courseId,
          moduleId: moduleId
        },
        actor: getActor()
      });

      if (result && result.emitted && result.emitted.success) {
        moduleEditorStore.setState({
          course: result.emitted.data.course,
          module: result.emitted.data.module,
          sessions: result.emitted.data.sessions || [],
          selectedSessionId: result.emitted.data.selectedSessionId,
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

  addStepToPracticeMode: async function (courseId, moduleId, sessionId, practiceModeKey, stepType) {
    var result = await runIntentPipeline(getIntentDefinition("AddStepToPracticeModeIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId,
        practiceModeKey: practiceModeKey,
        stepType: stepType
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      replaceSessionInState(result.emitted.data);
      return result;
    }

    throw new Error(readIntentErrorMessage(result));
  },

  updatePracticeModeStep: async function (courseId, moduleId, sessionId, practiceModeKey, step) {
    var result = await runIntentPipeline(getIntentDefinition("UpdatePracticeModeStepIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId,
        practiceModeKey: practiceModeKey,
        stepId: step.id,
        stepType: step.type,
        title: step.title,
        instructions: step.instructions,
        config: step.config,
        status: step.status
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      replaceSessionInState(result.emitted.data);
      return result;
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
    var result = await runIntentPipeline(getIntentDefinition("UploadStepMediaIntent"), {
      payload: {
        courseId: courseId,
        moduleId: moduleId,
        sessionId: sessionId,
        practiceModeKey: practiceModeKey,
        stepId: stepId,
        mediaField: mediaField,
        file: file
      },
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      replaceSessionInState(result.emitted.data.session, stepId);
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
