import { runIntentPipeline } from "../../../../../packages/core/src/icf/engine/runIntentPipeline.js";
import { getIntentDefinition } from "../../../../../packages/core/src/icf/engine/intentRegistry.js";
import { courseEditorStore } from "../state/courseEditorState.js";
import { auth } from "../../../../../packages/core/src/infrastructure/firebase/auth.js";

function getActor() {
  return auth.currentUser ? { id: auth.currentUser.uid, role: "ROLE_COURSE_CREATOR" } : null;
}

export const courseEditorService = {
  openCourseEditor: async function (courseId) {
    courseEditorStore.setState({ isFetching: true, error: null });
    try {
      var result = await runIntentPipeline(getIntentDefinition("OpenCourseEditorIntent"), { payload: { courseId: courseId }, actor: getActor() });

      if (result && result.emitted && result.emitted.success) {
        var openData = result.emitted.data || {};
        var openCourse = openData.course || null;
        var openModules = Array.isArray(openData.modules) ? openData.modules : [];

        console.info("[course-editor:open-result]", {
          courseId: courseId,
          hasCourse: Boolean(openCourse),
          moduleCount: openCourse ? openCourse.moduleCount : undefined,
          moduleOrderLength: openCourse && Array.isArray(openCourse.moduleOrder) ? openCourse.moduleOrder.length : undefined,
          returnedModulesLength: openModules.length,
          moduleIds: openModules.map(readModuleId)
        });

        courseEditorStore.setState({
          course: openCourse,
          modules: openModules,
          selectedModuleId: openData.selectedModuleId,
          permissions: openData.permissions,
          isFetching: false
        });

        var stateAfterOpen = courseEditorStore.getState();
        console.info("[course:state:modules-assigned]", {
          resultModuleCount: openModules.length,
          stateModuleCount: Array.isArray(stateAfterOpen.modules) ? stateAfterOpen.modules.length : 0,
          stateKeys: Object.keys(stateAfterOpen)
        });

        console.info("[course-editor:state-modules]", {
          courseId: courseId,
          stateCourseId: stateAfterOpen.course ? stateAfterOpen.course.id : "",
          storedModulesLength: Array.isArray(stateAfterOpen.modules) ? stateAfterOpen.modules.length : 0,
          moduleIds: Array.isArray(stateAfterOpen.modules) ? stateAfterOpen.modules.map(readModuleId) : []
        });
      } else {
        var errMsg = (result && result.emitted && result.emitted.errors && result.emitted.errors[0]) ? result.emitted.errors[0].message : "Unknown error";
        courseEditorStore.setState({ error: errMsg, isFetching: false });
      }
    } catch (error) {
      courseEditorStore.setState({ error: error.message, isFetching: false });
    }
  },

  addModule: async function (courseId, options) {
    try {
      var payload = Object.assign({ courseId: courseId }, options || {});
      var result = await runIntentPipeline(getIntentDefinition("CreateModuleIntent"), { payload: payload, actor: getActor() });
      if (result && result.emitted && result.emitted.success) {
        var state = courseEditorStore.getState();
        var newModules = state.modules.slice();
        newModules.push(result.emitted.data);
        courseEditorStore.setState({
          modules: newModules,
          selectedModuleId: result.emitted.data.id
        });
        return;
      }
      var errMsg = (result && result.emitted && result.emitted.errors && result.emitted.errors[0]) ? result.emitted.errors[0].message : "Unknown error";
      throw new Error(errMsg);
    } catch (error) {
      throw error;
    }
  },

  openCreateModuleWizard: async function (courseId) {
    return await runIntentPipeline(getIntentDefinition("OpenCreateModuleWizardIntent"), {
      payload: { courseId: courseId },
      actor: getActor()
    });
  },

  parseLearningContent: async function (courseId, rawText) {
    return await runIntentPipeline(getIntentDefinition("ParseLearningContentIntent"), {
      payload: {
        courseId: courseId,
        rawText: rawText
      },
      actor: getActor()
    });
  },

  generateModuleSkeleton: async function (courseId, wizardPayload) {
    return await runIntentPipeline(getIntentDefinition("GenerateModuleSkeletonIntent"), {
      payload: Object.assign({ courseId: courseId }, wizardPayload || {}),
      actor: getActor()
    });
  },

  generateStarterSteps: async function (courseId, wizardPayload) {
    return await runIntentPipeline(getIntentDefinition("GenerateStarterStepsIntent"), {
      payload: Object.assign({ courseId: courseId }, wizardPayload || {}),
      actor: getActor()
    });
  },

  createModuleFromWizard: async function (courseId, wizardPayload) {
    var result = await runIntentPipeline(getIntentDefinition("CreateModuleFromWizardIntent"), {
      payload: Object.assign({ courseId: courseId }, wizardPayload || {}),
      actor: getActor()
    });

    if (result && result.emitted && result.emitted.success) {
      var state = courseEditorStore.getState();
      var newModules = state.modules.slice();
      newModules.push(result.emitted.data);
      courseEditorStore.setState({
        modules: newModules,
        selectedModuleId: result.emitted.data.id
      });
    }

    return result;
  },

  updateCourseField: async function (courseId, fieldKey, value) {
    try {
      var state = courseEditorStore.getState();
      if (state.course) {
        var updatedCourse = Object.assign({}, state.course);
        updatedCourse[fieldKey] = value;
        updatedCourse.isDirty = true;
        courseEditorStore.setState({ course: updatedCourse });

        var result = await runIntentPipeline(getIntentDefinition("UpdateCourseFieldIntent"), { payload: { courseId: courseId, fieldKey: fieldKey, value: value }, actor: getActor() });

        if (!result || !result.emitted || !result.emitted.success) {
          console.error("Validation failed during course update", result ? result.emitted.errors : result);
        }
      }
    } catch (error) {
      console.error("Course update failed", error);
    }
  },

  updateCourseMetadata: async function (courseId, metadata) {
    courseEditorStore.setState({ isDraftSaving: true, error: null });

    try {
      var result = await runIntentPipeline(getIntentDefinition("UpdateCourseMetadataIntent"), {
        payload: Object.assign({ courseId: courseId }, metadata),
        actor: getActor()
      });

      if (result && result.emitted && result.emitted.success) {
        courseEditorStore.setState({
          course: result.emitted.data,
          isDraftSaving: false,
          lastSaved: Date.now(),
          error: null
        });
        return result;
      }

      courseEditorStore.setState({
        isDraftSaving: false,
        error: readIntentErrorMessage(result)
      });
      return result;
    } catch (error) {
      courseEditorStore.setState({
        isDraftSaving: false,
        error: error.message
      });
      return {
        emitted: {
          success: false,
          errors: [
            {
              code: "COURSE_METADATA_UPDATE_FAILED",
              message: error.message
            }
          ]
        }
      };
    }
  },

  updateModuleField: async function (courseId, moduleId, fieldKey, value) {
    try {
      var state = courseEditorStore.getState();
      var newModules = state.modules.map(function (m) {
        if (m.id === moduleId) {
          var updated = Object.assign({}, m);
          if (!updated.config) {
            updated.config = {};
          }
          updated.config[fieldKey] = value;
          updated.isDirty = true;
          return updated;
        }
        return m;
      });
      courseEditorStore.setState({ modules: newModules });

      var result = await runIntentPipeline(getIntentDefinition("UpdateModuleFieldIntent"), { payload: { courseId: courseId, moduleId: moduleId, fieldKey: fieldKey, value: value }, actor: getActor() });

      if (!result || !result.emitted || !result.emitted.success) {
        console.error("Validation failed during background update", result ? result.emitted.errors : result);
      }
    } catch (error) {
      console.error("Update intent failed", error);
    }
  },

  updateModule: async function (courseId, moduleId, moduleMetadata) {
    try {
      var result = await runIntentPipeline(getIntentDefinition("UpdateModuleIntent"), {
        payload: Object.assign({
          courseId: courseId,
          moduleId: moduleId
        }, moduleMetadata),
        actor: getActor()
      });

      if (result && result.emitted && result.emitted.success) {
        var state = courseEditorStore.getState();
        var modules = state.modules.map(function (moduleItem) {
          if (moduleItem.id === moduleId || moduleItem.moduleId === moduleId) {
            return result.emitted.data;
          }

          return moduleItem;
        });

        courseEditorStore.setState({ modules: modules });
        return result;
      }

      alert("Failed to update module: " + readIntentErrorMessage(result));
      return result;
    } catch (error) {
      alert("Error updating module: " + error.message);
      return {
        emitted: {
          success: false,
          errors: [
            {
              code: "MODULE_UPDATE_FAILED",
              message: error.message
            }
          ]
        }
      };
    }
  },

  selectModule: function (moduleId) {
    courseEditorStore.setState({ selectedModuleId: moduleId });
  },

  reorderModules: async function (courseId, fromIndex, toIndex) {
    try {
      var result = await runIntentPipeline(getIntentDefinition("ReorderModulesIntent"), { payload: { courseId: courseId, fromIndex: fromIndex, toIndex: toIndex }, actor: getActor() });
      if (result && result.emitted && result.emitted.success) {
        courseEditorStore.setState({ modules: result.emitted.data });
      }
    } catch (error) {
      console.error("Reorder failed", error);
    }
  },

  deleteModule: async function (courseId, moduleId) {
    try {
      var result = await runIntentPipeline(getIntentDefinition("DeleteModuleIntent"), { payload: { courseId: courseId, moduleId: moduleId }, actor: getActor() });
      if (result && result.emitted && result.emitted.success) {
        var state = courseEditorStore.getState();
        var nextSelectedId = state.selectedModuleId;
        if (nextSelectedId === moduleId) {
          nextSelectedId = result.emitted.data.length > 0 ? result.emitted.data[0].id : null;
        }
        courseEditorStore.setState({ modules: result.emitted.data, selectedModuleId: nextSelectedId });
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  },

  duplicateModule: async function (courseId, moduleId) {
    try {
      var result = await runIntentPipeline(getIntentDefinition("DuplicateModuleIntent"), { payload: { courseId: courseId, moduleId: moduleId }, actor: getActor() });
      if (result && result.emitted && result.emitted.success) {
        courseEditorStore.setState({ modules: result.emitted.data });
      }
    } catch (error) {
      console.error("Duplicate failed", error);
    }
  },

  saveDraft: async function (courseId) {
    courseEditorStore.setState({ isDraftSaving: true });
    try {
      var state = courseEditorStore.getState();
      var result = await runIntentPipeline(getIntentDefinition("SaveCourseDraftIntent"), {
        payload: {
          courseId: courseId,
          course: state.course,
          modules: state.modules
        },
        actor: getActor()
      });
      if (result && result.emitted && result.emitted.success) {
        var cleanModules = state.modules.map(function (m) {
          var cm = Object.assign({}, m);
          cm.isDirty = false;
          return cm;
        });
        var cleanCourse = Object.assign({}, state.course, { isDirty: false });
        courseEditorStore.setState({
          course: cleanCourse,
          modules: cleanModules,
          lastSaved: result.emitted.data.timestamp,
          isDraftSaving: false
        });
      } else {
        var errMsg = (result && result.emitted && result.emitted.errors && result.emitted.errors[0]) ? result.emitted.errors[0].message : "Unknown error";
        alert("Failed to save draft: " + errMsg);
        courseEditorStore.setState({ isDraftSaving: false });
      }
    } catch (error) {
      console.error("Error saving draft: ", error);
      courseEditorStore.setState({ isDraftSaving: false });
    }
  },

  publishCourse: async function (courseId) {
    courseEditorStore.setState({ isPublishing: true });
    try {
      var state = courseEditorStore.getState();
      var valResult = await runIntentPipeline(getIntentDefinition("ValidateCourseStructureIntent"), {
        payload: {
          courseId: courseId,
          course: state.course,
          modules: state.modules
        },
        actor: getActor()
      });

      if (valResult && valResult.emitted && valResult.emitted.success && !valResult.emitted.data.isValid) {
        alert("Cannot publish. Fix errors first:\n" + valResult.emitted.data.errors.map(function (e) { return e.message; }).join("\n"));
        courseEditorStore.setState({ isPublishing: false });
        return;
      }

      var result = await runIntentPipeline(getIntentDefinition("PublishCourseIntent"), {
        payload: {
          courseId: courseId,
          course: state.course,
          modules: state.modules
        },
        actor: getActor()
      });

      if (result && result.emitted && result.emitted.success) {
        var cleanModules = state.modules.map(function (m) {
          var cm = Object.assign({}, m);
          cm.isDirty = false;
          cm.isDraft = false;
          return cm;
        });
        var updatedCourse = Object.assign({}, state.course, {
          status: "published",
          version: result.emitted.data.newVersion,
          isDirty: false
        });

        courseEditorStore.setState({
          course: updatedCourse,
          modules: cleanModules,
          lastSaved: result.emitted.data.timestamp,
          isPublishing: false
        });
        alert("Course successfully published!");
      } else {
        var errMsg = (result && result.emitted && result.emitted.errors && result.emitted.errors[0]) ? result.emitted.errors[0].message : "Unknown error";
        alert("Failed to publish: " + errMsg);
        courseEditorStore.setState({ isPublishing: false });
      }
    } catch (error) {
      alert("Error publishing course: " + error.message);
      courseEditorStore.setState({ isPublishing: false });
    }
  }
};

courseEditorService.previewCourse = async function (courseId) {
  try {
    var result = await runIntentPipeline(getIntentDefinition("PreviewCourseIntent"), {
      payload: {
        courseId: courseId
      },
      actor: getActor()
    });

    return result;
  } catch (error) {
    return {
      emitted: {
        success: false,
        errors: [
          {
            code: "COURSE_PREVIEW_FAILED",
            message: error.message
          }
        ]
      }
    };
  }
};

courseEditorService.archiveCourse = async function (courseId) {
  return await runIntentPipeline(getIntentDefinition("ArchiveCourseIntent"), {
    payload: {
      courseId: courseId
    },
    actor: getActor()
  });
};

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

  return "Unknown course metadata error";
}

function readModuleId(module) {
  if (!module) {
    return "";
  }

  return module.id || module.moduleId || "";
}
