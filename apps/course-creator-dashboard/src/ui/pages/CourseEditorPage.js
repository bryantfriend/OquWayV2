import { moduleEditorStore } from "../state/moduleEditorState.js?v=1.1.134-archive-course-assignments";
import { moduleEditorService } from "../services/moduleEditorService.js?v=1.1.134-archive-course-assignments";
import {
  getStepTypeDefinition,
  listStepTypeDefinitions,
  validateStepConfig
} from "../../../../../packages/domain/steps/index.js?v=1.1.134-archive-course-assignments";
import { PracticeModePlayer } from "../../../../../packages/shared/player/index.js?v=1.1.134-archive-course-assignments";
import { createStatusBadge } from "../../../../../packages/ui/index.js?v=1.1.134-archive-course-assignments";

export class CourseEditorPage {
  constructor(courseId, moduleId) {
    this.courseId = courseId;
    this.moduleId = moduleId;
    this.unsubscribe = null;
    this.stepPickerOpen = false;
    this.studentPreviewMode = false;
    this.practiceModePlaytestMode = false;
    this.playtestStepIndex = 0;
    this.playtestCompleted = false;
    this.practiceModePlayer = null;
    this.practiceModePlayerSignature = "";
    this.practiceModePlayerSnapshot = null;
    this.activeEditorTab = "learningContent";
  }

  render() {
    return `
      <div id="course-editor-root" class="h-screen flex flex-col bg-gray-100 overflow-hidden">

        <!-- ── TOP NAV ────────────────────────────────────────────── -->
        <nav class="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shrink-0 z-20 shadow-sm">
          <div class="flex items-center gap-4">
            <span class="text-blue-600 font-bold text-xl tracking-tight">OquWay</span>
            <div class="h-5 w-px bg-gray-200"></div>
            <span class="text-gray-500 font-medium text-sm" id="headerCourseTitle">
              <span class="oqu-skeleton-line" style="display:inline-block;height:13px;width:220px;vertical-align:middle"></span>
            </span>
          </div>
          <div class="flex items-center gap-2.5">
            <span id="saveStatusIndicator" class="font-medium flex items-center gap-1.5 hidden text-xs text-green-600">
              <i class="fa-regular fa-circle-check"></i> Saved
            </span>
            <span class="border border-emerald-100 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold text-xs cursor-default select-none">Learning System 2.0</span>
            <a href="#overview?courseId=${this.courseId}" class="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg font-semibold transition text-xs flex items-center gap-1.5">
              <i class="fa-solid fa-chevron-left text-[9px]"></i> Overview
            </a>
          </div>
        </nav>

        <div id="editorTabBar" class="bg-white border-b border-gray-100 px-6 py-2 flex items-center gap-2 shrink-0">
          <button type="button" class="editor-tab-btn oqu-editor-tab-active" data-tab="learningContent"><i class="fa-solid fa-layer-group"></i> Learning Content</button>
          <button type="button" class="editor-tab-btn" data-tab="learningModes"><i class="fa-solid fa-route"></i> Learning Modes</button>
          <button type="button" class="editor-tab-btn" data-tab="steps"><i class="fa-solid fa-shapes"></i> Steps</button>
        </div>

        <!-- ── THREE-PANEL BODY ───────────────────────────────────── -->
        <div class="flex-1 overflow-hidden flex gap-4 p-4 min-h-0">

          <!-- LEFT: Learning Modes -->
          <div class="flex-col shrink-0 min-h-0 flex" style="width:256px">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              <div class="px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
                <div class="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3 flex items-center gap-1.5">
                  <i class="fa-solid fa-route text-gray-300"></i>
                  Learning Modes
                </div>
                <div id="sessionCreateStatusBanner" style="display:none" class="oqu-status-banner mb-2"></div>
                <button id="addSessionBtn" class="w-full border border-dashed border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-600 hover:text-blue-700 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-xs">
                  <i class="fa-solid fa-plus text-xs"></i> Add Mode
                </button>
              </div>
              <div id="sessionList" class="flex-1 overflow-y-auto p-2.5 space-y-1 min-h-0">
                ${buildSessionSkeletonCards(3)}
              </div>
              <div class="px-4 py-2.5 bg-gray-50 border-t border-gray-100 rounded-b-xl shrink-0">
                <div id="sessionCountText" class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">0 Modes</div>
              </div>
            </div>
          </div>

          <!-- CENTER: Live Preview Workspace -->
          <div class="flex-1 min-w-0 flex flex-col min-h-0">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              <div id="workspaceContent" class="flex-1 overflow-y-auto min-h-0">
                <div class="flex items-center justify-center min-h-full p-12">
                  ${buildEmptyNoSessionHtml()}
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Property Inspector -->
          <div class="flex-col shrink-0 min-h-0 flex" style="width:296px">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 shrink-0">
                <div class="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em] flex items-center gap-1.5">
                  <i class="fa-solid fa-sliders text-gray-300"></i>
                  Inspector
                </div>
              </div>
              <div id="configEditorPane" class="flex-1 overflow-y-auto p-5 min-h-0">
                <div class="text-xs text-gray-400 text-center py-10">Select a mode or content section.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  attachEvents() {
    var self = this;
    moduleEditorStore.resetState();

    this.unsubscribe = moduleEditorStore.subscribe(function (newState) {
      self.updateUi(newState);
    });

    moduleEditorService.openModuleEditor(this.courseId, this.moduleId);

    document.getElementById("editorTabBar").addEventListener("click", function (e) {
      var tabBtn = e.target.closest(".editor-tab-btn");
      if (!tabBtn) {
        return;
      }
      self.activeEditorTab = tabBtn.getAttribute("data-tab") || "steps";
      self.studentPreviewMode = false;
      self.practiceModePlaytestMode = false;
      self.stepPickerOpen = false;
      self.resetPracticeModePlayer();
      self.updateUi(moduleEditorStore.getState());
    });

    // ── Add Learning Mode ───────────────────────────────────────────────
    document.getElementById("addSessionBtn").addEventListener("click", function () {
      var btn = document.getElementById("addSessionBtn");
      var banner = document.getElementById("sessionCreateStatusBanner");
      showSessionBtnPending(btn, "Creating mode\u2026");
      showSessionBanner(banner, "creating", '<span class="oqu-spinner oqu-spinner-blue"></span> Creating learning mode\u2026');
      moduleEditorService.createLearningMode(self.courseId, self.moduleId, {
        title: "Custom Mode",
        purpose: "A custom learning experience for this module.",
        modeType: "custom"
      }).then(function () {
        self.activeEditorTab = "learningModes";
        showSessionBanner(banner, "success", '<span class="oqu-success-icon">&#10003;</span> Mode created!');
        restoreSessionBtn(btn, '<i class="fa-solid fa-plus text-xs"></i> Add Mode');
        setTimeout(function () {
          banner.style.display = "none";
        }, 2000);
      }).catch(function (err) {
        showSessionBanner(banner, "error", "&#9888; Failed: " + err.message);
        restoreSessionBtn(btn, '<i class="fa-solid fa-plus text-xs"></i> Add Mode');
      });
    });

    // ── Session list delegation (attached once) ────────────────────────
    document.getElementById("sessionList").addEventListener("click", function (e) {
      var item = e.target.closest(".session-item");
      if (!item) {
        return;
      }
      self.studentPreviewMode = false;
      self.practiceModePlaytestMode = false;
      self.stepPickerOpen = false;
      self.playtestStepIndex = 0;
      self.playtestCompleted = false;
      self.resetPracticeModePlayer();
      var modeId = item.getAttribute("data-mode-id");
      if (modeId) {
        self.activeEditorTab = "steps";
        moduleEditorService.selectLearningMode(modeId);
      } else {
        moduleEditorService.selectSession(item.getAttribute("data-id"));
      }
    });

    // ── Workspace delegation (attached once) ───────────────────────────
    document.getElementById("workspaceContent").addEventListener("click", function (e) {
      self.handleWorkspaceClick(e);
    });

    document.getElementById("workspaceContent").addEventListener("input", function (e) {
      var search = e.target.closest(".step-picker-search");
      if (search) {
        filterStepPicker(search.value);
      }
    });

    // ── Inspector delegation (attached once) ───────────────────────────
    document.getElementById("configEditorPane").addEventListener("click", function (e) {
      self.handleInspectorClick(e);
    });

    document.getElementById("configEditorPane").addEventListener("input", function (e) {
      self.handleInspectorInput(e);
    });

    document.getElementById("configEditorPane").addEventListener("change", function (e) {
      self.handleInspectorChange(e);
    });
  }

  // ── Workspace click dispatcher ─────────────────────────────────────────

  handleWorkspaceClick(event) {
    var self = this;
    var state = moduleEditorStore.getState();
    var session = self.findSelectedSession(state);

    var saveLearningContentBtn = event.target.closest(".save-learning-content-btn");
    if (saveLearningContentBtn) {
      var learningContent = readLearningContentFromWorkspace();
      saveLearningContentBtn.disabled = true;
      saveLearningContentBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving';
      self.showEditorSaveStatus("saving", "Saving...");
      moduleEditorService.saveLearningContent(this.courseId, this.moduleId, learningContent).then(function () {
        self.showEditorSaveStatus("success", "Saved");
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        self.showEditorSaveStatus("error", "Could not save changes");
        alert("Learning content save failed: " + error.message);
      }).finally(function () {
        saveLearningContentBtn.disabled = false;
        saveLearningContentBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Learning Content';
      });
      return;
    }

    var modeCard = event.target.closest(".learning-mode-card");
    if (modeCard && !event.target.closest("button")) {
      self.activeEditorTab = "steps";
      moduleEditorService.selectLearningMode(modeCard.getAttribute("data-mode-id"));
      return;
    }

    var duplicateModeBtn = event.target.closest(".duplicate-learning-mode-btn");
    if (duplicateModeBtn) {
      moduleEditorService.duplicateLearningMode(this.courseId, this.moduleId, duplicateModeBtn.getAttribute("data-mode-id")).then(function () {
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        alert("Duplicate mode failed: " + error.message);
      });
      return;
    }

    var renameModeBtn = event.target.closest(".rename-learning-mode-btn");
    if (renameModeBtn) {
      var renameModeId = renameModeBtn.getAttribute("data-mode-id");
      var currentMode = moduleEditorStore.getState().learningModes[renameModeId] || {};
      var nextTitle = prompt("Rename learning mode", currentMode.title || "Learning Mode");
      if (!nextTitle) {
        return;
      }
      moduleEditorService.renameLearningMode(this.courseId, this.moduleId, renameModeId, nextTitle, currentMode.purpose || "").then(function () {
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        alert("Rename mode failed: " + error.message);
      });
      return;
    }

    var deleteModeBtn = event.target.closest(".delete-learning-mode-btn");
    if (deleteModeBtn) {
      if (!confirm("Delete this learning mode? Existing legacy step data will be kept for migration safety.")) {
        return;
      }
      moduleEditorService.deleteLearningMode(this.courseId, this.moduleId, deleteModeBtn.getAttribute("data-mode-id")).then(function () {
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        alert("Delete mode failed: " + error.message);
      });
      return;
    }

    var generateModeBtn = event.target.closest(".generate-mode-from-primary-btn");
    if (generateModeBtn) {
      moduleEditorService.generateModeFromPrimary(this.courseId, this.moduleId).then(function () {
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        alert("Generate mode failed: " + error.message);
      });
      return;
    }

    var pullContentBtn = event.target.closest(".pull-learning-content-btn");
    if (pullContentBtn) {
      moduleEditorService.pullLearningContent(this.courseId, this.moduleId, pullContentBtn.getAttribute("data-step-type"), pullContentBtn.getAttribute("data-source")).then(function (stepDraft) {
        var currentState = moduleEditorStore.getState();
        var currentSession = self.findSelectedSession(currentState);
        var currentStepId = currentState.selectedStepId;
        var currentModeKey = currentState.selectedPracticeModeKey || "beforeClass";

        if (currentSession && currentStepId) {
          var currentStep = findPracticeModeStep(currentSession, currentModeKey, currentStepId);
          var updatedStep = Object.assign({}, currentStep, {
            title: { en: stepDraft.title || readLocalizedText(currentStep.title, "Generated Activity"), ru: "", ky: "" },
            config: Object.assign({}, readStepConfig(currentStep), stepDraft.config || {})
          });
          return moduleEditorService.updateLearningModeStep(self.courseId, self.moduleId, readSelectedModeId(currentState), currentStepId, createLearningModeStepUpdates(updatedStep));
        }

        alert("Draft ready from Learning Content: " + stepDraft.title + ". Add a step, then use Pull From Learning Content in the inspector.");
        console.info("[LearningContent] Pulled step draft:", stepDraft);
      }).catch(function (error) {
        alert("Pull from Learning Content failed: " + error.message);
      });
      return;
    }

    // Close picker overlay
    var closePickerBtn = event.target.closest(".close-step-picker-btn");
    if (closePickerBtn) {
      this.stepPickerOpen = false;
      this.updateUi(moduleEditorStore.getState());
      return;
    }

    if (event.target.classList && event.target.classList.contains("oqu-step-picker-backdrop")) {
      this.stepPickerOpen = false;
      this.updateUi(moduleEditorStore.getState());
      return;
    }

    // Back from student preview
    var backToEditorBtn = event.target.closest(".back-to-editor-btn");
    if (backToEditorBtn) {
      this.studentPreviewMode = false;
      this.practiceModePlaytestMode = false;
      this.playtestCompleted = false;
      this.resetPracticeModePlayer();
      this.updateUi(moduleEditorStore.getState());
      return;
    }

    // Open full practice-mode playtest
    var playPracticeModeBtn = event.target.closest(".play-practice-mode-btn");
    if (playPracticeModeBtn) {
      this.practiceModePlaytestMode = true;
      this.studentPreviewMode = false;
      this.stepPickerOpen = false;
      this.playtestStepIndex = 0;
      this.playtestCompleted = false;
      this.resetPracticeModePlayer();
      this.updateUi(moduleEditorStore.getState());
      return;
    }

    // Practice-mode playtest navigation
    var playtestPrevBtn = event.target.closest(".playtest-prev-btn");
    if (playtestPrevBtn) {
      this.movePlaytestStep(-1);
      return;
    }

    var playtestNextBtn = event.target.closest(".playtest-next-btn");
    if (playtestNextBtn) {
      this.movePlaytestStep(1);
      return;
    }

    var playtestCompleteBtn = event.target.closest(".playtest-complete-step-btn");
    if (playtestCompleteBtn) {
      this.completePlaytestStep();
      return;
    }

    var playerCompleteBtn = event.target.closest(".oqu-player-complete-btn");
    if (playerCompleteBtn && this.practiceModePlaytestMode) {
      this.completePlaytestStep();
      return;
    }

    var previewStepBtn = event.target.closest(".preview-step-btn");
    if (previewStepBtn) {
      var previewStepId = previewStepBtn.getAttribute("data-step-id") || state.selectedStepId;
      var previewModeId = readSelectedModeId(state);

      if (!previewModeId || !previewStepId) {
        alert("Select a saved step before opening preview.");
        return;
      }

      console.info("[step-preview]", {
        courseId: this.courseId,
        moduleId: this.moduleId,
        modeId: previewModeId,
        stepId: previewStepId
      });

      window.location.hash = "#step-preview?courseId=" + encodeURIComponent(this.courseId)
        + "&moduleId=" + encodeURIComponent(this.moduleId)
        + "&modeId=" + encodeURIComponent(previewModeId)
        + "&stepId=" + encodeURIComponent(previewStepId);
      return;
    }

    var playtestRestartBtn = event.target.closest(".playtest-restart-btn");
    if (playtestRestartBtn) {
      this.playtestStepIndex = 0;
      this.playtestCompleted = false;
      this.resetPracticeModePlayer();
      this.updateUi(moduleEditorStore.getState());
      return;
    }

    // Open student preview for selected step
    var studentViewBtn = event.target.closest(".student-view-btn");
    if (studentViewBtn) {
      this.studentPreviewMode = true;
      this.practiceModePlaytestMode = false;
      this.stepPickerOpen = false;
      this.updateUi(moduleEditorStore.getState());
      return;
    }

    // Practice mode card navigation
    var pmCard = event.target.closest(".pm-nav-card");
    if (pmCard) {
      var key = pmCard.getAttribute("data-key");
      this.studentPreviewMode = false;
      this.practiceModePlaytestMode = false;
      this.stepPickerOpen = false;
      this.playtestStepIndex = 0;
      this.playtestCompleted = false;
      this.resetPracticeModePlayer();
      moduleEditorService.selectPracticeMode(key);
      return;
    }

    // Step reorder controls use the ICF reorder intent
    var reorderBtn = event.target.closest(".step-reorder-btn");
    if (reorderBtn && session) {
      var reorderStepId = reorderBtn.getAttribute("data-step-id");
      var direction = reorderBtn.getAttribute("data-direction");
      var practiceModeKey = state.selectedPracticeModeKey || "beforeClass";
      var orderedStepIds = createReorderedStepIds(session, practiceModeKey, reorderStepId, direction);

      if (orderedStepIds.length === 0) {
        return;
      }

      reorderBtn.textContent = "Saving...";
      reorderBtn.disabled = true;

      moduleEditorService.reorderPracticeModeSteps(
        self.courseId, self.moduleId, session.id, practiceModeKey, orderedStepIds, reorderStepId
      ).catch(function (error) {
        reorderBtn.disabled = false;
        alert("Failed to reorder steps: " + error.message);
      });
      return;
    }

    // Delete from a step tile
    var tileDeleteBtn = event.target.closest(".step-tile-delete-btn");
    if (tileDeleteBtn && session) {
      var deleteStepId = tileDeleteBtn.getAttribute("data-step-id");
      var deleteModeKey = state.selectedPracticeModeKey || "beforeClass";
      if (!confirm("Delete this step from the practice mode?")) {
        return;
      }
      tileDeleteBtn.textContent = "Deleting...";
      tileDeleteBtn.disabled = true;
      moduleEditorService.deletePracticeModeStep(
        self.courseId, self.moduleId, session.id, deleteModeKey, deleteStepId
      ).catch(function (error) {
        tileDeleteBtn.textContent = "Delete";
        tileDeleteBtn.disabled = false;
        alert("Failed to delete step: " + error.message);
      });
      return;
    }

    // Step tile click — selects a step
    var stepTile = event.target.closest(".step-tile");
    if (stepTile) {
      var stepId = stepTile.getAttribute("data-step-id");
      this.studentPreviewMode = false;
      this.practiceModePlaytestMode = false;
      this.resetPracticeModePlayer();
      moduleEditorService.selectStep(stepId);
      return;
    }

    // Add Step trigger — opens the step type picker
    var addStepTrigger = event.target.closest(".add-step-trigger-btn");
    if (addStepTrigger) {
      this.stepPickerOpen = true;
      this.studentPreviewMode = false;
      this.practiceModePlaytestMode = false;
      this.resetPracticeModePlayer();
      this.updateUi(moduleEditorStore.getState());
      return;
    }

    var createModeShellBtn = event.target.closest(".create-mode-shell-btn");
    if (createModeShellBtn) {
      createModeShellBtn.disabled = true;
      createModeShellBtn.innerHTML = '<span class="oqu-spinner oqu-spinner-blue"></span> Preparing...';
      moduleEditorService.addSession(self.courseId, self.moduleId).then(function () {
        self.stepPickerOpen = true;
        self.activeEditorTab = "steps";
      }).catch(function (error) {
        alert("Failed to prepare mode shell: " + error.message);
      }).finally(function () {
        self.updateUi(moduleEditorStore.getState());
      });
      return;
    }

    // Step type option chosen — creates the step via ICF
    var stepOption = event.target.closest(".step-type-option");
    if (stepOption) {
      var stepType = stepOption.getAttribute("data-type");
      var practiceModeKey = state.selectedPracticeModeKey || "beforeClass";
      var selectedModeId = readSelectedModeId(state);
      var courseContext = readCourseContext(state, self.courseId, self.moduleId, selectedModeId);
      var originalStepOptionHtml = stepOption.innerHTML;

      if (!courseContext.courseId || !courseContext.moduleId || !courseContext.modeId || !stepType) {
        alert("Cannot add step because course, module, or learning mode is missing.");
        return;
      }

      this.stepPickerOpen = false;
      this.studentPreviewMode = false;
      this.practiceModePlaytestMode = false;
      this.resetPracticeModePlayer();
      stepOption.innerHTML = '<span class="oqu-spinner oqu-spinner-blue"></span> Adding...';
      stepOption.style.pointerEvents = "none";
      moduleEditorService.addStepToLearningMode(
        courseContext.courseId, courseContext.moduleId, courseContext.modeId, stepType, {
          courseContext: courseContext,
          sessionId: session ? session.id : null,
          practiceModeKey: practiceModeKey
        }
      ).then(function () {
        autoSelectNewestStep(practiceModeKey);
      }).catch(function (error) {
        alert("Failed to add step: " + error.message);
      }).finally(function () {
        stepOption.innerHTML = originalStepOptionHtml;
        stepOption.style.pointerEvents = "";
      });
      return;
    }

    // Delete step button (inside preview canvas)
    var deleteBtn = event.target.closest(".delete-step-btn");
    if (deleteBtn && session) {
      var stepId = deleteBtn.getAttribute("data-step-id");
      var practiceModeKey = state.selectedPracticeModeKey || "beforeClass";
      if (!confirm("Delete this step from the practice mode?")) {
        return;
      }
      deleteBtn.textContent = "Deleting\u2026";
      deleteBtn.disabled = true;
      moduleEditorService.deletePracticeModeStep(
        self.courseId, self.moduleId, session.id, practiceModeKey, stepId
      ).catch(function (error) {
        deleteBtn.textContent = "Delete";
        deleteBtn.disabled = false;
        alert("Failed to delete step: " + error.message);
      });
      return;
    }

    // Repair practice modes banner button
    var repairBtn = event.target.closest(".repair-practice-modes-btn");
    if (repairBtn && session) {
      repairBtn.textContent = "Repairing\u2026";
      repairBtn.disabled = true;
      moduleEditorService.repairSessionPracticeModes(
        self.courseId, self.moduleId, session.id
      ).catch(function (error) {
        repairBtn.textContent = "Repair Practice Modes";
        repairBtn.disabled = false;
        alert("Failed to repair: " + error.message);
      });
    }
  }

  // ── Inspector click dispatcher ─────────────────────────────────────────

  handleInspectorClick(event) {
    var self = this;
    var state = moduleEditorStore.getState();
    var session = self.findSelectedSession(state);
    var propsPane = document.getElementById("configEditorPane");

    // Save practice mode
    var saveModeBtn = event.target.closest(".save-practice-mode-btn");
    if (saveModeBtn && session) {
      var practiceModeKey = state.selectedPracticeModeKey || "beforeClass";
      var practiceMode = self.readPracticeModeFromInspector(propsPane, session, practiceModeKey);
      saveModeBtn.textContent = "Saving\u2026";
      saveModeBtn.disabled = true;
      self.showEditorSaveStatus("saving", "Saving...");
      moduleEditorService.updatePracticeMode(
        self.courseId, self.moduleId, session.id, practiceMode
      ).then(function () {
        self.showEditorSaveStatus("success", "Saved");
        saveModeBtn.textContent = "Saved \u2713";
        setTimeout(function () {
          saveModeBtn.textContent = "Save Practice Mode";
          saveModeBtn.disabled = false;
        }, 1400);
      }).catch(function (error) {
        self.showEditorSaveStatus("error", "Could not save changes");
        saveModeBtn.textContent = "Save Practice Mode";
        saveModeBtn.disabled = false;
        alert("Failed to save practice mode: " + error.message);
      });
      return;
    }

    // Save step
    var saveStepBtn = event.target.closest(".save-practice-step-btn");
    if (saveStepBtn && session) {
      var practiceModeKey = state.selectedPracticeModeKey || "beforeClass";
      var modeId = readSelectedModeId(state);
      var stepId = state.selectedStepId;
      var step = self.readStepFromInspector(propsPane, session, practiceModeKey, stepId);
      saveStepBtn.textContent = "Saving\u2026";
      saveStepBtn.disabled = true;
      self.showEditorSaveStatus("saving", "Saving...");
      moduleEditorService.updateLearningModeStep(
        self.courseId, self.moduleId, modeId, stepId, createLearningModeStepUpdates(step)
      ).then(function () {
        self.showEditorSaveStatus("success", "Saved");
        saveStepBtn.textContent = "Saved \u2713";
        setTimeout(function () {
          saveStepBtn.textContent = "Save Step";
          saveStepBtn.disabled = false;
        }, 1400);
      }).catch(function (error) {
        self.showEditorSaveStatus("error", "Could not save changes");
        alert("Failed to save step: " + error.message);
      }).finally(function () {
        if (saveStepBtn.textContent !== "Saved \u2713") {
          saveStepBtn.textContent = "Save Step";
          saveStepBtn.disabled = false;
        }
      });
    }
  }

  // ── Inspector input handler — updates preview live ─────────────────────

  handleInspectorInput(event) {
    var wrapper = event.target.closest("[data-inspector-mode]");
    if (!wrapper) {
      return;
    }
    if (wrapper.getAttribute("data-inspector-mode") === "step") {
      this.refreshPreviewFromInspector();
    }
  }

  handleInspectorChange(event) {
    var mediaInput = event.target.closest(".inspector-media-upload");
    if (!mediaInput) {
      this.handleInspectorInput(event);
      return;
    }

    this.uploadInspectorMedia(mediaInput);
  }

  uploadInspectorMedia(mediaInput) {
    var state = moduleEditorStore.getState();
    var session = this.findSelectedSession(state);
    var practiceModeKey = state.selectedPracticeModeKey || "beforeClass";
    var stepId = state.selectedStepId;
    var mediaField = mediaInput.getAttribute("data-config-key");
    var statusElement = findMediaStatusElement(mediaInput);
    var file = null;

    if (!session || !stepId || !mediaInput.files || mediaInput.files.length === 0) {
      return;
    }

    file = mediaInput.files[0];

    if (!fileMatchesMediaField(file, mediaField)) {
      showMediaStatus(statusElement, "error", "Unsupported file type.");
      mediaInput.value = "";
      return;
    }

    mediaInput.disabled = true;
    showActionStatus(statusElement, "uploading", "Uploading picture...", "media");

    moduleEditorService.uploadStepMedia(
      this.courseId,
      this.moduleId,
      session.id,
      practiceModeKey,
      stepId,
      mediaField,
      file
    ).then(function () {
      showActionStatus(statusElement, "success", "Image saved!", "media");
      mediaInput.value = "";
    }).catch(function (error) {
      showActionStatus(statusElement, "error", error.message, "media");
      mediaInput.value = "";
    }).finally(function () {
      mediaInput.disabled = false;
    });
  }

  // Rebuilds just the preview card from current inspector form values
  refreshPreviewFromInspector() {
    var propsPane = document.getElementById("configEditorPane");
    var previewCanvas = document.getElementById("step-preview-canvas");
    if (!previewCanvas || !propsPane) {
      return;
    }
    var titleInput = propsPane.querySelector(".inspector-step-title");
    var instrInput = propsPane.querySelector(".inspector-step-instructions");
    var stepTypeEl = propsPane.querySelector("[data-step-type]");
    if (!titleInput || !stepTypeEl) {
      return;
    }
    var mockStep = {
      id: "preview",
      type: stepTypeEl.getAttribute("data-step-type"),
      title: { en: titleInput.value, ru: "", ky: "" },
      instructions: { en: instrInput ? instrInput.value : "", ru: "", ky: "" },
      status: "draft",
      config: readStepConfigFromInspector(propsPane, stepTypeEl.getAttribute("data-step-type"), {})
    };
    if (readStepPreviewMode(mockStep.type) === "full") {
      previewCanvas.className = "oqu-preview-canvas oqu-preview-canvas-full";
    } else {
      previewCanvas.className = "oqu-preview-canvas";
    }
    previewCanvas.innerHTML = '<div class="oqu-preview-toolbar">'
      + '<button type="button" class="student-view-btn oqu-student-view-btn">▶ Student View</button>'
      + '</div>'
      + this.buildStepPreviewCard(mockStep);
  }

  movePlaytestStep(direction) {
    var state = moduleEditorStore.getState();
    var session = this.findSelectedSession(state);
    var practiceModeKey = state.selectedPracticeModeKey || "beforeClass";
    var steps = readPracticeModeStepsForKey(session, practiceModeKey);

    if (steps.length === 0) {
      return;
    }

    this.playtestStepIndex = clampNumber(this.playtestStepIndex + direction, 0, steps.length - 1);
    this.playtestCompleted = false;
    this.updateUi(moduleEditorStore.getState());
  }

  completePlaytestStep() {
    var state = moduleEditorStore.getState();
    var session = this.findSelectedSession(state);
    var practiceModeKey = state.selectedPracticeModeKey || "beforeClass";
    var steps = readPracticeModeStepsForKey(session, practiceModeKey);

    if (steps.length === 0) {
      return;
    }

    this.playtestStepIndex = clampNumber(this.playtestStepIndex, 0, steps.length - 1);

    if (this.playtestStepIndex >= steps.length - 1) {
      this.playtestCompleted = true;
    } else {
      this.playtestStepIndex = this.playtestStepIndex + 1;
      this.playtestCompleted = false;
    }

    this.updateUi(moduleEditorStore.getState());
  }

  resetPracticeModePlayer() {
    if (this.practiceModePlayer) {
      this.practiceModePlayer.destroy();
    }

    this.practiceModePlayer = null;
    this.practiceModePlayerSignature = "";
    this.practiceModePlayerSnapshot = null;
  }

  // ── Store-driven UI update ─────────────────────────────────────────────

  updateUi(state) {
    if (state.error) {
      document.getElementById("headerCourseTitle").textContent = "Error Loading Module";
      document.getElementById("sessionList").innerHTML = buildSessionErrorCard(state.error);
      return;
    }

    if (!state.course && state.isFetching) {
      document.getElementById("headerCourseTitle").innerHTML =
        'Loading\u2026 <span class="text-gray-300 mx-1">/</span> Learning Modes';
      document.getElementById("sessionList").innerHTML = buildSessionSkeletonCards(3);
      return;
    }

    if (state.course) {
      document.getElementById("headerCourseTitle").innerHTML =
        escapeHtml(this.getCourseTitle(state.course)) +
        ' <span class="text-gray-300 mx-1.5 font-light">/</span> ' +
        escapeHtml(this.getModuleTitle(state.module));
    }

    this.renderEditorTabs();
    this.renderSaveIndicator(state);
    this.renderSessionList(state);
    this.renderSessionDetails(state);
  }

  renderEditorTabs() {
    var tabButtons = document.querySelectorAll(".editor-tab-btn");
    var i = 0;
    while (i < tabButtons.length) {
      if (tabButtons[i].getAttribute("data-tab") === this.activeEditorTab) {
        tabButtons[i].classList.add("oqu-editor-tab-active");
      } else {
        tabButtons[i].classList.remove("oqu-editor-tab-active");
      }
      i = i + 1;
    }
  }

  renderSaveIndicator(state) {
    var el = document.getElementById("saveStatusIndicator");
    if (!el) {
      return;
    }
    if (state.isDraftSaving) {
      el.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-xs"></i> Saving...';
      el.classList.remove("hidden");
      el.className = "text-yellow-600 font-medium flex items-center gap-1.5 text-xs";
      return;
    }
    if (state.lastSaved) {
      el.innerHTML = '<i class="fa-regular fa-circle-check text-xs"></i> Saved';
      el.classList.remove("hidden");
      el.className = "text-green-600 font-medium flex items-center gap-1.5 text-xs";
    }
  }

  showEditorSaveStatus(type, message) {
    var el = document.getElementById("saveStatusIndicator");

    if (!el) {
      return;
    }

    if (type === "error") {
      el.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-xs"></i> ' + escapeHtml(message || "Could not save changes");
      el.classList.remove("hidden");
      el.className = "text-red-600 font-medium flex items-center gap-1.5 text-xs";
      return;
    }

    if (type === "saving") {
      el.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-xs"></i> ' + escapeHtml(message || "Saving...");
      el.classList.remove("hidden");
      el.className = "text-yellow-600 font-medium flex items-center gap-1.5 text-xs";
      return;
    }

    el.innerHTML = '<i class="fa-regular fa-circle-check text-xs"></i> ' + escapeHtml(message || "Saved");
    el.classList.remove("hidden");
    el.className = "text-green-600 font-medium flex items-center gap-1.5 text-xs";
  }

  renderSessionList(state) {
    var el = document.getElementById("sessionList");
    var sessions = state.sessions || [];
    var learningModes = createLearningModeList(state.learningModes, sessions);
    var selectedModeId = readSelectedModeId(state);
    var countEl = document.getElementById("sessionCountText");
    if (countEl) {
      countEl.textContent = learningModes.length + " Mode" + (learningModes.length === 1 ? "" : "s");
    }
    if (learningModes.length === 0) {
      el.innerHTML = buildListEmptyState();
      return;
    }
    var html = "";
    var i = 0;
    while (i < learningModes.length) {
      var mode = learningModes[i];
      var isSelected = selectedModeId === mode.id;
      var title = readLocalizedText(mode.title, "Learning Mode");
      var status = readString(mode.status, "draft");
      var wrapperClass = isSelected
        ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300 shadow-sm"
        : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50";
      html += '<div class="relative p-2.5 rounded-xl border cursor-pointer transition ' + wrapperClass + ' session-item flex items-center gap-2.5" data-id="' + (mode.legacySessionId || "") + '" data-mode-id="' + mode.id + '">';
      html += '<div class="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center shrink-0 text-[11px] font-black text-emerald-700">' + readLearningModeIcon(mode) + '</div>';
      html += '<div class="flex-1 min-w-0">';
      html += '<div class="text-xs font-bold text-gray-900 truncate leading-tight">' + escapeHtml(title) + '</div>';
      html += '<div class="mt-1 flex items-center gap-1.5">' + buildStatusPill(status) + (mode.required ? '<span class="text-[9px] font-black text-emerald-600 uppercase">Required</span>' : '') + '</div>';
      html += '</div>';
      html += '</div>';
      i = i + 1;
    }
    el.innerHTML = html;
  }

  renderSessionDetails(state) {
    var workspace = document.getElementById("workspaceContent");
    var propsPane = document.getElementById("configEditorPane");
    var session = this.findSelectedSession(state);
    var selectedLearningMode = this.findSelectedLearningMode(state);

    logModeSelection(state, this.activeEditorTab, selectedLearningMode);

    if (this.activeEditorTab === "learningContent") {
      workspace.innerHTML = buildLearningContentWorkspace(state.learningContent);
      propsPane.innerHTML = buildLearningContentInspector(state.learningContent);
      return;
    }

    if (this.activeEditorTab === "learningModes") {
      workspace.innerHTML = buildLearningModesWorkspace(state.learningModes, state.sessions, readSelectedModeId(state));
      propsPane.innerHTML = selectedLearningMode
        ? buildSelectedLearningModeInspector(selectedLearningMode, this.activeEditorTab)
        : buildLearningModesInspector();
      return;
    }

    if (!session) {
      workspace.innerHTML = '<div class="flex items-center justify-center min-h-full p-12">' + buildModeReadyEmptyHtml(selectedLearningMode) + '</div>';
      propsPane.innerHTML = selectedLearningMode
        ? buildSelectedLearningModeInspector(selectedLearningMode, this.activeEditorTab)
        : '<div class="text-xs text-gray-400 text-center py-10">Select a learning mode to inspect properties.</div>';
      return;
    }

    var selectedPracticeModeKey = state.selectedPracticeModeKey || "beforeClass";
    var practiceModes = readPracticeModes(session);
    var selectedMode = practiceModes[selectedPracticeModeKey];
    var effectiveStepId = getEffectiveStepId(selectedMode, state.selectedStepId);

    if (!effectiveStepId && !this.practiceModePlaytestMode) {
      this.studentPreviewMode = false;
    }

    workspace.innerHTML = this.buildWorkspaceHtml(session, state, selectedPracticeModeKey, selectedMode, effectiveStepId);
    if (this.practiceModePlaytestMode) {
      propsPane.innerHTML = this.buildPracticeModePlaytestInspector(session, selectedPracticeModeKey);
    } else if (this.studentPreviewMode && effectiveStepId) {
      propsPane.innerHTML = this.buildStudentPreviewInspector(session, selectedPracticeModeKey, effectiveStepId);
    } else {
      propsPane.innerHTML = this.buildInspectorHtml(session, state, selectedPracticeModeKey, selectedMode, effectiveStepId);
    }

    if (this.practiceModePlaytestMode) {
      this.renderPracticeModePlaytest(session, selectedPracticeModeKey);
    } else if (this.studentPreviewMode && effectiveStepId) {
      this.renderStudentPreview(session, selectedPracticeModeKey, effectiveStepId);
    }

    // Sync step selection to store asynchronously to avoid recursive re-renders
    if (effectiveStepId !== state.selectedStepId) {
      var syncStepId = effectiveStepId;
      setTimeout(function () {
        moduleEditorService.selectStep(syncStepId);
      }, 0);
    }
  }

  // ── Center workspace HTML ──────────────────────────────────────────────

  buildWorkspaceHtml(session, state, selectedPracticeModeKey, selectedMode, effectiveStepId) {
    var title = readLocalizedText(session.title, "New Session");
    var status = readString(session.status, "draft");
    var sessions = state.sessions || [];
    var sessionIndex = 0;
    var i = 0;
    while (i < sessions.length) {
      if (sessions[i].id === session.id) {
        sessionIndex = i;
        break;
      }
      i = i + 1;
    }

    var practiceModes = readPracticeModes(session);
    var hasPracticeModes = session.practiceModes && typeof session.practiceModes === "object";
    var html = "";

    if (this.practiceModePlaytestMode) {
      return this.buildPracticeModePlaytestShell(session, selectedPracticeModeKey);
    }

    if (this.studentPreviewMode && effectiveStepId) {
      return this.buildStudentPreviewShell(session, selectedPracticeModeKey, effectiveStepId);
    }

    // ── Sticky session header ────────────────────────────────────────
    html += '<div class="oqu-workspace-sticky px-5 py-3.5 flex items-center gap-3">';
    html += '<div class="flex-1 min-w-0">';
    html += '<div class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Learning Mode ' + (sessionIndex + 1) + '</div>';
    html += '<div class="text-sm font-bold text-gray-900 truncate">' + escapeHtml(title) + '</div>';
    html += '</div>';
    html += buildStatusPill(status);
    html += '</div>';

    // ── Practice mode navigation cards (single source of truth) ─────
    html += '<div class="px-5 pt-4 pb-3">';
    html += '<div class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Step Tracks</div>';
    html += '<div class="grid grid-cols-2 gap-2">';

    var keys = createPracticeModeKeys();
    var ki = 0;
    while (ki < keys.length) {
      var mode = practiceModes[keys[ki]];
      var modeTitle = readLocalizedText(mode.title, "Practice Mode");
      var stepCount = readStepCount(mode);
      var modeStatus = readString(mode.status, "shell");
      var progress = calculateProgress(mode);
      var progressDone = progress >= 100 ? " oqu-progress-done" : "";
      var isActive = selectedPracticeModeKey === mode.key;
      var cardClass = "pm-nav-card" + (isActive ? " pm-preview-box-active" : "");

      html += '<div class="pm-preview-box ' + cardClass + '" data-key="' + mode.key + '">';
      html += '<div class="text-[10px] font-black text-gray-900 truncate mb-1.5">' + escapeHtml(modeTitle) + '</div>';
      html += '<div class="flex items-center gap-1.5 flex-wrap mb-1.5">';
      html += buildStatusPill(modeStatus);
      html += '<span class="text-[10px] text-gray-400 font-semibold">' + stepCount + ' step' + (stepCount === 1 ? '' : 's') + '</span>';
      html += '</div>';
      html += '<div class="oqu-progress-track" title="' + progress + '% complete"><div class="oqu-progress-fill' + progressDone + '" style="width:' + progress + '%"></div></div>';
      html += '</div>';

      ki = ki + 1;
    }

    html += '</div>';
    html += '</div>';

    // ── Repair banner ────────────────────────────────────────────────
    if (!hasPracticeModes) {
      html += '<div class="mx-5 mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 flex items-start gap-3">';
      html += '<i class="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5 shrink-0 text-sm"></i>';
      html += '<div class="flex-1">';
      html += '<div class="text-xs font-bold text-amber-900 mb-1">Step tracks not initialized</div>';
      html += '<div class="text-[11px] text-amber-700 mb-2">This legacy mode predates step track shells.</div>';
      html += '<button class="repair-practice-modes-btn text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-lg transition">Repair Step Tracks</button>';
      html += '</div>';
      html += '</div>';
    }

    // ── Separator ────────────────────────────────────────────────────
    html += '<div class="mx-5 mb-3 border-t border-gray-100"></div>';

    // ── Step navigation list ─────────────────────────────────────────
    html += this.buildStepNavigationArea(selectedMode, effectiveStepId, selectedPracticeModeKey);

    // ── Preview canvas ───────────────────────────────────────────────
    html += this.buildPreviewCanvasHtml(selectedMode, effectiveStepId);

    if (this.stepPickerOpen) {
      html += buildStepPickerModal(selectedPracticeModeKey);
    }

    return html;
  }

  buildStepNavigationArea(mode, effectiveStepId, practiceModeKey) {
    var steps = readSortedSteps(mode.steps);
    var modeTitle = readLocalizedText(mode.title, "Practice Mode");
    var html = "";

    html += '<div class="px-5 pb-2">';
    html += '<div class="flex items-center justify-between mb-2">';
    html += '<div class="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">';
    html += '<i class="fa-solid fa-list-check text-gray-300"></i>';
    html += escapeHtml(modeTitle) + ' — Steps';
    html += '</div>';

    html += '<div class="flex items-center gap-1.5">';
    html += '<button type="button" class="play-practice-mode-btn border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-[10px] transition flex items-center gap-1" data-key="' + practiceModeKey + '">';
    html += '▶ Preview Mode';
    html += '</button>';
    html += '<button type="button" class="add-step-trigger-btn border border-dashed border-blue-300 bg-white hover:bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-lg text-[10px] transition flex items-center gap-1" data-key="' + practiceModeKey + '">';
    html += '<i class="fa-solid fa-plus text-[9px]"></i> Add Step';
    html += '</button>';
    html += '</div>';
    html += '</div>';

    if (steps.length === 0) {
      html += '</div>';
      return html;
    }

    // Step tiles
    html += '<div class="space-y-1">';
    var i = 0;
    while (i < steps.length) {
      var step = steps[i];
      var stepId = readStepId(step, "");
      var stepTitle = readLocalizedText(step.title, "New Step");
      var stepType = readStepType(step);
      var stepStatus = readString(step.status, "draft");
      var validation = readStepValidation(step);
      var completionRule = readStepCompletionRule(step);
      var isActive = effectiveStepId === stepId;
      var tileClass = "oqu-step-tile step-tile" + (isActive ? " oqu-step-tile-active" : "");
      var upDisabled = i === 0 ? " disabled" : "";
      var downDisabled = i === steps.length - 1 ? " disabled" : "";

      html += '<div class="' + tileClass + '" data-step-id="' + stepId + '">';
      html += '<span class="oqu-step-order-number">' + (i + 1) + '</span>';
      html += '<span class="text-sm shrink-0">' + readStepTypeIcon(stepType) + '</span>';
      html += '<div class="flex-1 min-w-0">';
      html += '<div class="text-xs font-bold text-gray-800 truncate">' + escapeHtml(stepTitle) + '</div>';
      html += '<div class="text-[9px] font-semibold text-gray-400">' + readStepTypeLabel(stepType) + ' · ' + escapeHtml(completionRule) + '</div>';
      if (!validation.valid) {
        html += '<div class="mt-1 text-[10px] font-bold text-amber-700 flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation"></i> ' + escapeHtml(validation.message) + '</div>';
      }
      html += '</div>';
      html += buildStepStatusBadge(stepStatus);
      html += '<div class="oqu-step-tile-actions">';
      html += '<button type="button" class="step-reorder-btn oqu-step-icon-btn" data-step-id="' + stepId + '" data-direction="up"' + upDisabled + ' title="Move up">↑</button>';
      html += '<button type="button" class="step-reorder-btn oqu-step-icon-btn" data-step-id="' + stepId + '" data-direction="down"' + downDisabled + ' title="Move down">↓</button>';
      html += '<button type="button" class="preview-step-btn oqu-step-preview-btn" data-step-id="' + stepId + '" title="Preview step"><i class="fa-solid fa-play"></i> Preview</button>';
      html += '<button type="button" class="step-tile-delete-btn oqu-step-delete-btn" data-step-id="' + stepId + '" title="Delete step">Delete</button>';
      html += '</div>';
      html += '</div>';

      i = i + 1;
    }
    html += '</div>';
    html += '</div>';

    return html;
  }

  buildPreviewCanvasHtml(mode, effectiveStepId) {
    var steps = readSortedSteps(mode.steps);

    // No steps — polished empty state with inline add step prompt
    if (steps.length === 0) {
      var emptyHtml = '<div class="oqu-preview-canvas">';
      emptyHtml += '<div class="text-center max-w-[260px]">';
      emptyHtml += '<div class="text-4xl mb-4">📚</div>';
      emptyHtml += '<div class="text-sm font-bold text-gray-700 mb-1.5">No activities yet</div>';
      emptyHtml += '<div class="text-xs text-gray-400 leading-relaxed mb-5">Start designing this practice mode by adding your first step.</div>';
      emptyHtml += '<button type="button" class="add-step-trigger-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition" data-key="' + mode.key + '">+ Add Step</button>';
      emptyHtml += '</div>';
      emptyHtml += '</div>';
      return emptyHtml;
    }

    // Find the selected step
    var selectedStep = null;
    var i = 0;
    while (i < steps.length) {
      if (readStepId(steps[i], "") === effectiveStepId) {
        selectedStep = steps[i];
        break;
      }
      i = i + 1;
    }

    // Fallback to first step if not found
    if (!selectedStep && steps.length > 0) {
      selectedStep = steps[0];
    }

    var previewMode = readStepPreviewMode(readStepType(selectedStep));
    var canvasClass = previewMode === "full" ? "oqu-preview-canvas oqu-preview-canvas-full" : "oqu-preview-canvas";
    var html = '<div class="' + canvasClass + '" id="step-preview-canvas">';
    html += '<div class="oqu-preview-toolbar">';
    html += '<button type="button" class="preview-step-btn oqu-student-view-btn" data-step-id="' + readStepId(selectedStep, "") + '"><i class="fa-solid fa-play"></i> Preview</button>';
    html += '</div>';
    html += this.buildStepPreviewCard(selectedStep);
    html += '</div>';
    return html;
  }

  buildStepPreviewCard(step) {
    var stepType = readStepType(step);
    var title = readLocalizedText(step.title, "New Step");
    var instructions = readLocalizedText(step.instructions, "");
    var stepId = readStepId(step, "");
    var config = createSafeStepConfig(stepType, readStepConfig(step));
    var StepTypeDefinition = getStepTypeDefinition(stepType);

    var inner = "";

    if (readStepPreviewMode(stepType) === "full" && StepTypeDefinition && typeof StepTypeDefinition.renderPlayerShell === "function") {
      return this.buildFullStepPreviewCard(step, StepTypeDefinition, config);
    }

    if (stepType === "textBriefing") {
      var briefingHeading = readConfigText(config, "heading", title);
      var briefingBody = readConfigText(config, "bodyText", instructions);
      var calloutText = readConfigText(config, "calloutText", "");
      var briefingImageUrl = readConfigText(config, "imageUrl", "");
      inner += '<div class="oqu-preview-type-badge">📄 Text Briefing</div>';
      inner += buildPreviewMediaBox(briefingImageUrl, "📖");
      inner += '<div class="oqu-preview-title">' + escapeHtml(briefingHeading) + '</div>';
      if (briefingBody) {
        inner += '<div class="oqu-preview-instructions">' + escapeHtml(briefingBody) + '</div>';
      }
      if (calloutText) {
        inner += '<div class="rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-800 text-xs font-semibold leading-relaxed p-3 mb-4">' + escapeHtml(calloutText) + '</div>';
      }

    } else if (stepType === "vocabulary") {
      var word = readConfigText(config, "word", title);
      var translation = readConfigText(config, "translation", "");
      var exampleSentence = readConfigText(config, "exampleSentence", instructions);
      var imageUrl = readConfigText(config, "imageUrl", "");
      var audioUrl = readConfigText(config, "audioUrl", "");
      inner += '<div class="oqu-preview-type-badge">📖 Vocabulary</div>';
      inner += '<div class="oqu-preview-word">' + escapeHtml(word) + '</div>';
      if (translation) {
        inner += '<div class="text-sm font-bold text-blue-600 mb-3">' + escapeHtml(translation) + '</div>';
      }
      inner += buildPreviewMediaBox(imageUrl, "🖼️");
      inner += '<div><button class="oqu-preview-audio-btn">🔊 ' + (audioUrl ? "Audio Ready" : "Add Audio URL") + '</button></div>';
      if (exampleSentence) {
        inner += '<div class="oqu-preview-instructions">' + escapeHtml(exampleSentence) + '</div>';
      }

    } else if (stepType === "phrase") {
      var phrase = readConfigText(config, "phrase", title);
      var meaning = readConfigText(config, "meaning", "");
      var usageExample = readConfigText(config, "usageExample", instructions);
      var phraseAudioUrl = readConfigText(config, "audioUrl", "");
      inner += '<div class="oqu-preview-type-badge">💬 Phrase</div>';
      inner += '<div class="oqu-preview-word">' + escapeHtml(phrase) + '</div>';
      if (meaning) {
        inner += '<div class="text-sm font-bold text-blue-600 mb-3">' + escapeHtml(meaning) + '</div>';
      }
      if (usageExample) {
        inner += '<div class="oqu-preview-instructions">' + escapeHtml(usageExample) + '</div>';
      }
      inner += '<div><button class="oqu-preview-audio-btn">🔊 ' + (phraseAudioUrl ? "Audio Ready" : "Add Audio URL") + '</button></div>';
      inner += '<div class="oqu-preview-reveal-btn">Tap to reveal translation</div>';

    } else if (stepType === "listening") {
      var listeningAudioUrl = readConfigText(config, "audioUrl", "");
      var transcript = readConfigText(config, "transcript", "");
      var questionPrompt = readConfigText(config, "questionPrompt", instructions);
      inner += '<div class="oqu-preview-type-badge">🎧 Listening</div>';
      inner += '<div class="oqu-preview-title">' + escapeHtml(title) + '</div>';
      inner += '<div class="oqu-preview-audio-track"><div class="oqu-preview-audio-fill"></div></div>';
      inner += '<div><button class="oqu-preview-audio-btn">▶ ' + (listeningAudioUrl ? "Play" : "Add Audio URL") + '</button></div>';
      if (questionPrompt) {
        inner += '<div class="oqu-preview-instructions">' + escapeHtml(questionPrompt) + '</div>';
      }
      if (transcript) {
        inner += '<div class="rounded-xl border border-gray-100 bg-gray-50 text-gray-500 text-xs leading-relaxed p-3 mb-3">' + escapeHtml(transcript) + '</div>';
      }

    } else if (stepType === "speakingPrompt") {
      var prompt = readConfigText(config, "prompt", title);
      var preparationSeconds = readConfigNumber(config, "preparationSeconds", 30);
      var speakingSeconds = readConfigNumber(config, "speakingSeconds", 60);
      inner += '<div class="oqu-preview-type-badge">🎤 Speaking Prompt</div>';
      inner += '<div class="oqu-preview-title">' + escapeHtml(prompt) + '</div>';
      if (instructions) {
        inner += '<div class="oqu-preview-instructions">' + escapeHtml(instructions) + '</div>';
      }
      inner += '<div class="text-[11px] text-gray-500 font-semibold mb-3">Prepare: ' + preparationSeconds + 's · Speak: ' + speakingSeconds + 's</div>';
      inner += '<div style="text-align:center"><button class="oqu-preview-record-btn">🎤 Hold to Record</button></div>';

    } else if (stepType === "reflection") {
      var question = readConfigText(config, "question", title);
      var responseType = readConfigText(config, "responseType", "scale");
      var minWords = readConfigNumber(config, "minWords", 0);
      inner += '<div class="oqu-preview-type-badge">💡 Reflection</div>';
      inner += '<div class="oqu-preview-title">' + escapeHtml(question) + '</div>';
      if (instructions) {
        inner += '<div class="oqu-preview-instructions">' + escapeHtml(instructions) + '</div>';
      }
      inner += '<div class="text-[11px] text-gray-500 font-semibold mb-3">Response type: ' + escapeHtml(responseType) + (minWords > 0 ? ' · Minimum words: ' + minWords : '') + '</div>';
      inner += '<div class="oqu-preview-input-mock">💭 Your reflection here\u2026</div>';

    } else {
      // Unknown / unsupported step type
      var safeType = stepType ? escapeHtml(stepType) : "unknown";
      inner += '<div class="oqu-preview-type-badge">🔷 ' + safeType + '</div>';
      inner += '<div class="text-xs font-bold text-amber-700 mb-2">Unsupported step type</div>';
      inner += '<div class="text-xs text-gray-500 mb-2">This step cannot be previewed yet, but it is safely stored.</div>';
      inner += '<div class="oqu-preview-title">' + escapeHtml(title) + '</div>';
      if (instructions) {
        inner += '<div class="oqu-preview-instructions">' + escapeHtml(instructions) + '</div>';
      }
    }

    // Delete button footer
    if (stepId && stepId !== "preview") {
      inner += '<div class="border-t border-gray-100 mt-4 pt-3 flex justify-end">';
      inner += '<button type="button" class="delete-step-btn text-[10px] text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg font-bold transition" data-step-id="' + stepId + '">Delete Step</button>';
      inner += '</div>';
    }

    var cardClass = "oqu-preview-card";
    if (stepType && !isKnownStepType(stepType)) {
      cardClass += " oqu-preview-unsupported";
    }

    return '<div class="' + cardClass + '">' + inner + '</div>';
  }

  buildFullStepPreviewCard(step, StepTypeDefinition, config) {
    var stepId = readStepId(step, "");
    var html = "";

    html += '<div class="oqu-full-preview-wrap">';
    html += StepTypeDefinition.renderPlayerShell(config);

    if (stepId && stepId !== "preview") {
      html += '<div class="oqu-full-preview-actions">';
      html += '<button type="button" class="delete-step-btn text-[10px] text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg font-bold transition" data-step-id="' + stepId + '">Delete Step</button>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  buildStudentPreviewShell(session, practiceModeKey, stepId) {
    var step = findPracticeModeStep(session, practiceModeKey, stepId);
    var title = readLocalizedText(step.title, "Student Preview");
    var previewMode = readStepPreviewMode(readStepType(step));
    var cardClass = previewMode === "full" ? "oqu-student-preview-card oqu-student-preview-card-full" : "oqu-student-preview-card";
    var html = "";

    html += '<div class="oqu-student-preview-shell">';
    html += '<div class="oqu-student-preview-topbar">';
    html += '<button type="button" class="back-to-editor-btn oqu-back-editor-btn">Back to Editor</button>';
    html += '<div class="min-w-0">';
    html += '<div class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Student View</div>';
    html += '<div class="text-sm font-bold text-gray-900 truncate">' + escapeHtml(title) + '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="oqu-student-preview-canvas">';
    html += '<div id="student-preview-render-target" class="' + cardClass + '"></div>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  renderStudentPreview(session, practiceModeKey, stepId) {
    var target = document.getElementById("student-preview-render-target");
    var step = findPracticeModeStep(session, practiceModeKey, stepId);
    var StepTypeDefinition = getStepTypeDefinition(readStepType(step));
    var playerBodyId = "student-player-body";
    var playerBody = null;

    if (!target) {
      return;
    }

    target.innerHTML = buildStudentPlayerShell(step, playerBodyId);
    playerBody = document.getElementById(playerBodyId);

    if (!playerBody) {
      return;
    }

    if (StepTypeDefinition && typeof StepTypeDefinition.renderPlayer === "function") {
      try {
        StepTypeDefinition.renderPlayer(playerBody, readStepConfig(step), {
          onComplete: function (completionResult) {
            console.info("[OquWay] Student preview step completed:", completionResult);
          }
        });
      } catch (error) {
        playerBody.innerHTML = buildUnsupportedStudentPreview(step);
      }
      return;
    }

    playerBody.innerHTML = buildUnsupportedStudentPreview(step);
  }

  buildStudentPreviewInspector(session, practiceModeKey, stepId) {
    var practiceModes = readPracticeModes(session);
    var mode = practiceModes[practiceModeKey];
    var step = findPracticeModeStep(session, practiceModeKey, stepId);
    var modeTitle = readLocalizedText(mode.title, "Practice Mode");
    var stepTitle = readLocalizedText(step.title, "Selected Step");
    var stepType = readStepTypeLabel(readStepType(step));
    var html = "";

    html += '<div class="oqu-inspector-section">Student View</div>';
    html += '<div class="rounded-xl border border-blue-100 bg-blue-50 p-3 mb-4">';
    html += '<div class="text-xs font-bold text-blue-900 mb-1">Previewing one selected step</div>';
    html += '<div class="text-[11px] text-blue-700 leading-relaxed">Editor controls are hidden in the center canvas. Use Back to Editor to return to editing.</div>';
    html += '</div>';
    html += '<div class="oqu-inspector-readonly-label">Practice Mode</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(modeTitle) + '</div>';
    html += '<div class="oqu-inspector-readonly-label">Step</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(stepTitle) + '</div>';
    html += '<div class="oqu-inspector-readonly-label">Type</div>';
    html += '<div class="oqu-inspector-readonly-value">' + escapeHtml(stepType) + '</div>';

    return html;
  }

  buildPracticeModePlaytestShell(session, practiceModeKey) {
    var html = "";

    html += '<div id="course-player-root" class="course-player-root"></div>';

    return html;
  }

  buildEmptyPracticeModePlaytestShell(modeTitle) {
    var html = "";

    html += '<div class="oqu-student-preview-shell oqu-playtest-shell">';
    html += '<div class="oqu-student-preview-topbar oqu-playtest-topbar">';
    html += '<button type="button" class="back-to-editor-btn oqu-back-editor-btn">Back to Editor</button>';
    html += '<div class="min-w-0">';
    html += '<div class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Practice Mode Playtest</div>';
    html += '<div class="text-sm font-bold text-gray-900 truncate">' + escapeHtml(modeTitle) + '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="oqu-student-preview-canvas oqu-playtest-canvas">';
    html += '<div class="oqu-playtest-empty">';
    html += '<div class="text-4xl mb-4">📚</div>';
    html += '<div class="text-lg font-black text-gray-900 mb-2">No activities to play yet</div>';
    html += '<div class="text-sm text-gray-500 leading-relaxed mb-5">Add steps to this practice mode, then come back here to test the learner flow from start to finish.</div>';
    html += '<button type="button" class="back-to-editor-btn oqu-back-editor-btn">Back to Editor</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  buildCompletedPracticeModePlaytestShell(modeTitle, stepCount) {
    var html = "";

    html += '<div class="oqu-student-preview-shell oqu-playtest-shell">';
    html += '<div class="oqu-student-preview-topbar oqu-playtest-topbar">';
    html += '<button type="button" class="back-to-editor-btn oqu-back-editor-btn">Back to Editor</button>';
    html += '<div class="min-w-0 flex-1">';
    html += '<div class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Practice Mode Playtest</div>';
    html += '<div class="text-sm font-bold text-gray-900 truncate">' + escapeHtml(modeTitle) + '</div>';
    html += '</div>';
    html += '<div class="oqu-playtest-progress-label">' + stepCount + ' step' + (stepCount === 1 ? "" : "s") + ' tested</div>';
    html += '</div>';
    html += '<div class="oqu-playtest-progress-track">';
    html += '<div class="oqu-playtest-progress-fill" style="width:100%"></div>';
    html += '</div>';
    html += '<div class="oqu-student-preview-canvas oqu-playtest-canvas">';
    html += '<div class="oqu-playtest-finished">';
    html += '<div class="text-5xl mb-4">✓</div>';
    html += '<div class="text-xl font-black text-gray-950 mb-2">Practice mode complete</div>';
    html += '<div class="text-sm text-gray-500 leading-relaxed mb-6">The full learner preview ran through every step in this practice mode.</div>';
    html += '<button type="button" class="playtest-restart-btn oqu-playtest-complete-btn">Play Again</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  renderPracticeModePlaytest(session, practiceModeKey) {
    var target = document.getElementById("course-player-root");
    var practiceModes = readPracticeModes(session);
    var practiceMode = practiceModes[practiceModeKey];
    var steps = [];
    var signature = "";
    var self = this;

    if (!target) {
      return;
    }

    if (!practiceMode) {
      practiceMode = practiceModes.beforeClass;
    }

    steps = readSortedSteps(practiceMode.steps);
    signature = createPracticeModePlayerSignature(
      this.courseId,
      this.moduleId,
      session.id,
      practiceModeKey,
      steps
    );

    if (!this.practiceModePlayer || this.practiceModePlayerSignature !== signature) {
      if (this.practiceModePlayer) {
        this.practiceModePlayer.destroy();
      }

      this.practiceModePlayer = new PracticeModePlayer({
        courseId: this.courseId,
        moduleId: this.moduleId,
        sessionId: session.id,
        practiceModeKey: practiceModeKey,
        practiceMode: practiceMode,
        steps: steps,
        actor: {
          id: "course-editor",
          role: "admin"
        },
        mode: "playtest",
        onBack: function () {
          self.practiceModePlaytestMode = false;
          self.resetPracticeModePlayer();
          self.updateUi(moduleEditorStore.getState());
        },
        onStateChange: function (snapshot) {
          self.practiceModePlayerSnapshot = snapshot;
        }
      });
      this.practiceModePlayerSignature = signature;
    }

    this.practiceModePlayer.mount(target);
  }

  buildPracticeModePlaytestInspector(session, practiceModeKey) {
    var practiceModes = readPracticeModes(session);
    var mode = practiceModes[practiceModeKey];
    if (!mode) {
      mode = practiceModes.beforeClass;
    }
    var steps = readSortedSteps(mode.steps);
    var modeTitle = readLocalizedText(mode.title, "Practice Mode");
    var snapshot = this.practiceModePlayerSnapshot;
    var currentStepIndex = snapshot && typeof snapshot.currentStepIndex === "number" ? snapshot.currentStepIndex : 0;
    var currentStepTitle = "No step selected";
    var currentStepType = "None";
    var completedCount = snapshot && Array.isArray(snapshot.completedStepIds) ? snapshot.completedStepIds.length : 0;
    var html = "";

    if (steps.length > 0) {
      var safeIndex = clampNumber(currentStepIndex, 0, steps.length - 1);
      var currentStep = steps[safeIndex];
      currentStepTitle = readLocalizedText(currentStep.title, "Selected Step");
      currentStepType = readStepTypeLabel(readStepType(currentStep));
    }

    html += '<div class="oqu-inspector-section">Playtest</div>';
    html += '<div class="rounded-xl border border-emerald-100 bg-emerald-50 p-3 mb-4">';
    html += '<div class="text-xs font-bold text-emerald-900 mb-1">Previewing the full practice mode</div>';
    html += '<div class="text-[11px] text-emerald-700 leading-relaxed">This is editor-only. It does not save student progress.</div>';
    html += '</div>';
    html += '<div class="oqu-inspector-readonly-label">Practice Mode</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(modeTitle) + '</div>';
    html += '<div class="oqu-inspector-readonly-label">Steps</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">' + steps.length + '</div>';
    html += '<div class="oqu-inspector-readonly-label">Completed</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">' + completedCount + '</div>';
    html += '<div class="oqu-inspector-readonly-label">Current Step</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(currentStepTitle) + '</div>';
    html += '<div class="oqu-inspector-readonly-label">Type</div>';
    html += '<div class="oqu-inspector-readonly-value">' + escapeHtml(currentStepType) + '</div>';

    return html;
  }

  // ── Right panel inspector HTML ─────────────────────────────────────────

  buildInspectorHtml(session, state, selectedPracticeModeKey, selectedMode, effectiveStepId) {
    var html = "";

    // Context breadcrumb
    var sessionTitle = readLocalizedText(session.title, "Learning Mode");
    var modeTitle = readLocalizedText(selectedMode.title, "Step Track");
    html += '<div class="mb-4">';
    html += '<div class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">' + escapeHtml(sessionTitle) + '</div>';
    html += '<div class="text-[10px] font-bold text-blue-600">' + escapeHtml(modeTitle) + '</div>';
    html += '</div>';

    html += '<div class="oqu-inspector-divider"></div>';

    if (effectiveStepId) {
      // Step inspector
      html += this.buildStepInspector(session, selectedPracticeModeKey, effectiveStepId);
    } else {
      // Practice mode inspector (no step selected / mode empty)
      html += this.buildPracticeModeInspector(selectedMode, session, selectedPracticeModeKey);
    }

    return html;
  }

  buildStepInspector(session, practiceModeKey, stepId) {
    var step = findPracticeModeStep(session, practiceModeKey, stepId);
    var stepType = readStepType(step);
    var title = readLocalizedText(step.title, "");
    var instructions = readLocalizedText(step.instructions, "");
    var status = readString(step.status, "draft");
    var label = readStepTypeLabel(stepType);
    var icon = readStepTypeIcon(stepType);

    var html = '<div data-inspector-mode="step" data-step-type="' + stepType + '">';
    html += '<div class="oqu-inspector-section">Step</div>';

    // Type (read-only)
    html += '<div class="mb-3 flex items-center gap-2">';
    html += '<span class="text-lg">' + icon + '</span>';
    html += '<div>';
    html += '<div class="oqu-inspector-readonly-label">Type</div>';
    html += '<div class="oqu-inspector-readonly-value">' + escapeHtml(label) + '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="oqu-inspector-divider"></div>';

    // Title
    html += '<div class="oqu-inspector-field">';
    html += '<label class="oqu-inspector-label">Title</label>';
    html += '<input type="text" class="oqu-inspector-input inspector-step-title" value="' + escapeHtml(title) + '" placeholder="Step title">';
    html += '</div>';

    // Instructions
    html += '<div class="oqu-inspector-field">';
    html += '<label class="oqu-inspector-label">Instructions</label>';
    html += '<textarea class="oqu-inspector-textarea inspector-step-instructions" placeholder="Describe what the learner should do...">' + escapeHtml(instructions) + '</textarea>';
    html += '</div>';

    // Status
    html += '<div class="oqu-inspector-field">';
    html += '<label class="oqu-inspector-label">Status</label>';
    html += '<select class="oqu-inspector-select inspector-step-status">';
    html += buildStatusOption("draft", status);
    html += buildStatusOption("ready", status);
    html += buildStatusOption("disabled", status);
    html += '</select>';
    html += '</div>';

    html += this.buildStepConfigInspector(step);

    if (supportsLearningContentPull(stepType)) {
      html += '<button type="button" class="pull-learning-content-btn w-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 rounded-lg text-xs transition mb-2" data-step-type="' + stepType + '" data-source="vocabulary">';
      html += '<i class="fa-solid fa-wand-magic-sparkles"></i> Pull From Learning Content';
      html += '</button>';
    }

    html += '<button type="button" class="save-practice-step-btn w-full bg-gray-900 hover:bg-black text-white font-bold py-2 rounded-lg text-xs transition mt-1">Save Step</button>';

    html += '</div>';
    return html;
  }

  buildStepConfigInspector(step) {
    var stepType = readStepType(step);
    var schema = readStepEditorSchema(stepType);
    var config = createSafeStepConfig(stepType, readStepConfig(step));
    var html = "";
    var fieldIndex = 0;

    html += '<div class="oqu-inspector-divider"></div>';
    html += '<div class="oqu-inspector-section">Config</div>';

    if (!schema.valid) {
      html += '<div class="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs leading-relaxed p-3 mb-3">';
      html += '<div class="font-bold mb-1">Config editor unavailable</div>';
      html += 'This step has an empty or broken editor schema, so config is safely preserved without custom fields.';
      html += '</div>';
      return html;
    }

    while (fieldIndex < schema.fields.length) {
      html += buildStepConfigField(schema.fields[fieldIndex], config);
      fieldIndex = fieldIndex + 1;
    }

    return html;
  }

  buildPracticeModeInspector(mode, session, practiceModeKey) {
    var title = readLocalizedText(mode.title, "Practice Mode");
    var status = readString(mode.status, "shell");
    var html = "";

    html += '<div class="oqu-inspector-section">Practice Mode</div>';

    // Title
    html += '<div class="oqu-inspector-field">';
    html += '<label class="oqu-inspector-label">Title</label>';
    html += '<input type="text" class="oqu-inspector-input inspector-mode-title" value="' + escapeHtml(title) + '">';
    html += '</div>';

    // Purpose
    html += '<div class="oqu-inspector-field">';
    html += '<label class="oqu-inspector-label">Purpose</label>';
    html += '<textarea class="oqu-inspector-textarea inspector-mode-purpose" placeholder="Describe this mode\'s learning goal...">' + escapeHtml(mode.purpose) + '</textarea>';
    html += '</div>';

    // Status
    html += '<div class="oqu-inspector-field">';
    html += '<label class="oqu-inspector-label">Status</label>';
    html += '<select class="oqu-inspector-select inspector-mode-status">';
    html += buildStatusOption("shell", status);
    html += buildStatusOption("draft", status);
    html += buildStatusOption("ready", status);
    html += buildStatusOption("disabled", status);
    html += '</select>';
    html += '</div>';

    // Enabled
    html += '<div class="oqu-inspector-field">';
    html += '<label class="oqu-inspector-label">Enabled</label>';
    html += '<label class="flex items-center gap-2 cursor-pointer mt-1">';
    html += '<input type="checkbox" class="inspector-mode-enabled rounded" ' + (mode.enabled ? "checked" : "") + '>';
    html += '<span class="text-xs font-semibold text-gray-700">Active for learners</span>';
    html += '</label>';
    html += '</div>';

    html += '<button type="button" class="save-practice-mode-btn w-full bg-gray-900 hover:bg-black text-white font-bold py-2 rounded-lg text-xs transition mt-1">Save Step Track</button>';

    // Legacy shell context remains visible during migration.
    html += '<div class="oqu-inspector-divider" style="margin-top:20px"></div>';
    html += '<div class="oqu-inspector-section">Mode Shell</div>';

    var sessionTitle = readLocalizedText(session.title, "Learning Mode");
    var sessionStatus = readString(session.status, "draft");
    html += '<div class="flex items-center justify-between">';
    html += '<div class="oqu-inspector-readonly-value">' + escapeHtml(sessionTitle) + '</div>';
    html += buildStatusPill(sessionStatus);
    html += '</div>';

    return html;
  }

  // ── Read form values back for ICF save ────────────────────────────────

  readPracticeModeFromInspector(propsPane, session, practiceModeKey) {
    var currentMode = readPracticeModes(session)[practiceModeKey];
    var titleInput = propsPane.querySelector(".inspector-mode-title");
    var purposeInput = propsPane.querySelector(".inspector-mode-purpose");
    var enabledInput = propsPane.querySelector(".inspector-mode-enabled");
    var statusInput = propsPane.querySelector(".inspector-mode-status");

    return {
      key: practiceModeKey,
      title: createLocalizedTitle(currentMode.title, titleInput ? titleInput.value : ""),
      purpose: purposeInput ? purposeInput.value : currentMode.purpose,
      enabled: enabledInput ? enabledInput.checked : currentMode.enabled,
      status: statusInput ? statusInput.value : currentMode.status
    };
  }

  readStepFromInspector(propsPane, session, practiceModeKey, stepId) {
    var currentStep = findPracticeModeStep(session, practiceModeKey, stepId);
    var titleInput = propsPane.querySelector(".inspector-step-title");
    var instrInput = propsPane.querySelector(".inspector-step-instructions");
    var statusInput = propsPane.querySelector(".inspector-step-status");

    return {
      id: stepId,
      type: readStepType(currentStep),
      title: createLocalizedTitle(currentStep.title, titleInput ? titleInput.value : ""),
      instructions: createLocalizedTitle(currentStep.instructions, instrInput ? instrInput.value : ""),
      config: readStepConfigFromInspector(propsPane, readStepType(currentStep), readStepConfig(currentStep)),
      status: statusInput ? statusInput.value : "draft"
    };
  }

  // ── Utilities ──────────────────────────────────────────────────────────

  findSelectedSession(state) {
    var sessions = state.sessions || [];
    var selectedModeId = readSelectedModeId(state);
    var selectedMode = this.findSelectedLearningMode(state);
    var i = 0;

    if (selectedMode && selectedMode.legacySessionId) {
      while (i < sessions.length) {
        if (sessions[i].id === selectedMode.legacySessionId) {
          return sessions[i];
        }
        i = i + 1;
      }
    }

    i = 0;
    while (i < sessions.length) {
      if (sessions[i].learningModeId === selectedModeId) {
        return sessions[i];
      }
      i = i + 1;
    }

    i = 0;
    while (i < sessions.length) {
      if (sessions[i].id === state.selectedSessionId) {
        return sessions[i];
      }
      i = i + 1;
    }

    if (selectedModeId === "primary" && sessions.length > 0) {
      return sessions[0];
    }

    return null;
  }

  findSelectedLearningMode(state) {
    var modeId = readSelectedModeId(state);
    var modes = state.learningModes && typeof state.learningModes === "object" ? state.learningModes : {};

    if (modeId && modes[modeId] && modes[modeId].status !== "deleted") {
      return Object.assign({ id: modeId }, modes[modeId]);
    }

    if (modes.primary && modes.primary.status !== "deleted") {
      return Object.assign({ id: "primary" }, modes.primary);
    }

    var modeIds = Object.keys(modes).filter(function (candidateModeId) {
      return modes[candidateModeId] && modes[candidateModeId].status !== "deleted";
    });

    if (modeIds.length > 0) {
      return Object.assign({ id: modeIds[0] }, modes[modeIds[0]]);
    }

    return null;
  }

  destroy() {
    this.resetPracticeModePlayer();

    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  getCourseTitle(course) {
    if (!course) {
      return "Untitled Course";
    }
    return readLocalizedText(course.title, "Untitled Course");
  }

  getModuleTitle(module) {
    if (!module) {
      return "Untitled Module";
    }
    return readLocalizedText(module.title, "Untitled Module");
  }
}

// ── Module-level helper: auto-select newest step after add ──────────────────

function autoSelectNewestStep(practiceModeKey) {
  var state = moduleEditorStore.getState();
  var sessions = state.sessions || [];
  var selectedSessionId = state.selectedSessionId;
  var foundSession = null;
  var i = 0;
  while (i < sessions.length) {
    if (sessions[i].id === selectedSessionId) {
      foundSession = sessions[i];
      break;
    }
    i = i + 1;
  }
  if (!foundSession) {
    return;
  }
  var modes = readPracticeModes(foundSession);
  var mode = modes[practiceModeKey];
  if (!mode) {
    return;
  }
  var sortedSteps = readSortedSteps(mode.steps);
  if (sortedSteps.length === 0) {
    return;
  }
  var newestStep = sortedSteps[sortedSteps.length - 1];
  var newestId = readStepId(newestStep, null);
  if (newestId) {
    moduleEditorService.selectStep(newestId);
  }
}

// ── Module-level helper: determine effective step for selected mode ──────────

function getEffectiveStepId(mode, currentStepId) {
  var steps = readSortedSteps(mode.steps);
  if (steps.length === 0) {
    return null;
  }
  // Check if current step ID belongs to this mode
  var i = 0;
  while (i < steps.length) {
    if (readStepId(steps[i], "") === currentStepId) {
      return currentStepId;
    }
    i = i + 1;
  }
  // Step is from another mode — auto-select first step in this mode
  return readStepId(steps[0], null);
}

function createReorderedStepIds(session, practiceModeKey, stepId, direction) {
  var practiceModes = readPracticeModes(session);
  var practiceMode = practiceModes[practiceModeKey];
  var steps = readSortedSteps(practiceMode.steps);
  var orderedStepIds = [];
  var currentIndex = -1;
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    var currentStepId = readStepId(steps[stepIndex], "");
    orderedStepIds.push(currentStepId);
    if (currentStepId === stepId) {
      currentIndex = stepIndex;
    }
    stepIndex = stepIndex + 1;
  }

  if (currentIndex === -1) {
    return [];
  }

  if (direction === "up" && currentIndex > 0) {
    swapOrderedStepIds(orderedStepIds, currentIndex, currentIndex - 1);
    return orderedStepIds;
  }

  if (direction === "down" && currentIndex < orderedStepIds.length - 1) {
    swapOrderedStepIds(orderedStepIds, currentIndex, currentIndex + 1);
    return orderedStepIds;
  }

  return [];
}

function readPracticeModeStepsForKey(session, practiceModeKey) {
  var practiceModes = readPracticeModes(session);
  var practiceMode = practiceModes[practiceModeKey];

  if (!practiceMode) {
    return [];
  }

  return readSortedSteps(practiceMode.steps);
}

function createPracticeModePlayerSignature(courseId, moduleId, sessionId, practiceModeKey, steps) {
  var signature = courseId + "|" + moduleId + "|" + sessionId + "|" + practiceModeKey;
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    signature += "|" + readStepId(steps[stepIndex], "") + ":" + readNumber(steps[stepIndex].order, 0);
    stepIndex = stepIndex + 1;
  }

  return signature;
}

function clampNumber(value, minimumValue, maximumValue) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return minimumValue;
  }

  if (value < minimumValue) {
    return minimumValue;
  }

  if (value > maximumValue) {
    return maximumValue;
  }

  return value;
}

function calculatePlaytestProgress(stepIndex, stepCount) {
  if (stepCount <= 0) {
    return 0;
  }

  return Math.round(((stepIndex + 1) / stepCount) * 100);
}

function swapOrderedStepIds(orderedStepIds, firstIndex, secondIndex) {
  var firstValue = orderedStepIds[firstIndex];
  orderedStepIds[firstIndex] = orderedStepIds[secondIndex];
  orderedStepIds[secondIndex] = firstValue;
}

// ── Status pill ─────────────────────────────────────────────────────────────

function buildStatusPill(status) {
  var safeStatus = typeof status === "string" ? status.toLowerCase() : "draft";
  var pillClass = "oqu-pill oqu-pill-draft";
  var dot = "🟡";

  if (safeStatus === "shell") {
    pillClass = "oqu-pill oqu-pill-shell";
    dot = "⚪";
  } else if (safeStatus === "draft") {
    pillClass = "oqu-pill oqu-pill-draft";
    dot = "🟡";
  } else if (safeStatus === "ready") {
    pillClass = "oqu-pill oqu-pill-ready";
    dot = "🔵";
  } else if (safeStatus === "active" || safeStatus === "published") {
    pillClass = "oqu-pill oqu-pill-active";
    dot = "🟢";
  } else if (safeStatus === "disabled") {
    pillClass = "oqu-pill oqu-pill-disabled";
    dot = "⚫";
  } else if (safeStatus === "archived") {
    pillClass = "oqu-pill oqu-pill-archived";
    dot = "⚫";
  }

  return '<span class="' + pillClass + '">' + dot + ' ' + safeStatus + '</span>';
}

function buildStepStatusBadge(status) {
  return createStatusBadge(status || "draft", {
    className: "oqu-pill oqu-pill-" + escapeHtml(String(status || "draft").toLowerCase()),
    statusClassPrefix: ""
  });
}

function readStepValidation(step) {
  var stepType = readStepType(step);
  var title = readLocalizedText(step && step.title, "");

  if (!stepType) {
    return {
      valid: false,
      message: "Missing step type"
    };
  }

  if (!title || title === "New Step") {
    return {
      valid: false,
      message: "Add a step title"
    };
  }

  try {
    var result = validateStepConfig(step || {});

    if (!result || result.valid !== true) {
      return {
        valid: false,
        message: "Unsupported step type"
      };
    }
  } catch (error) {
    return {
      valid: false,
      message: "Step config needs review"
    };
  }

  return {
    valid: true,
    message: ""
  };
}

function readStepCompletionRule(step) {
  var config = readStepConfig(step);
  var rule = step && (step.completionRule || step.completeWhen || step.requiredCompletion);

  if (!rule && config) {
    rule = config.completionRule || config.completeWhen || config.requiredCompletion;
  }

  if (typeof rule === "string" && rule.trim()) {
    return "Completion: " + rule.trim();
  }

  if (rule && typeof rule === "object") {
    if (typeof rule.type === "string" && rule.type.trim()) {
      return "Completion: " + rule.type.trim();
    }

    if (typeof rule.label === "string" && rule.label.trim()) {
      return "Completion: " + rule.label.trim();
    }
  }

  return "Completion: default";
}

// ── Progress calculation ─────────────────────────────────────────────────────

function calculateProgress(mode) {
  if (!mode) {
    return 0;
  }
  var stepCount = readStepCount(mode);
  var status = readString(mode.status, "shell");
  var enabled = mode.enabled !== false;

  if (!enabled) {
    return 0;
  }

  var progress = 0;
  if (stepCount >= 1) { progress = progress + 20; }
  if (stepCount >= 3) { progress = progress + 20; }
  if (stepCount >= 5) { progress = progress + 10; }
  if (status === "draft") { progress = progress + 20; }
  if (status === "ready") { progress = progress + 50; }

  if (progress > 100) {
    progress = 100;
  }
  return progress;
}

// ── Empty state builders ─────────────────────────────────────────────────────

function buildEmptyNoSessionHtml() {
  return '<div class="text-center max-w-[220px]">'
    + '<div class="text-4xl mb-3">📚</div>'
    + '<div class="text-sm font-bold text-gray-700 mb-1">No learning mode selected</div>'
    + '<div class="text-xs text-gray-400 leading-relaxed">Click a mode on the left to start designing its activities.</div>'
    + '</div>';
}

function buildModeReadyEmptyHtml(mode) {
  if (!mode) {
    return buildEmptyNoSessionHtml();
  }

  var title = readLocalizedText(mode.title, "Learning Mode");
  var isPrimary = mode.id === "primary" || mode.modeType === "primary";
  var headline = isPrimary ? "Primary Mode is ready. Add your first step." : title + " is ready. Add your first step.";

  return '<div class="text-center max-w-[280px]">'
    + '<div class="text-4xl mb-3">📚</div>'
    + '<div class="text-sm font-bold text-gray-700 mb-1">' + escapeHtml(headline) + '</div>'
    + '<div class="text-xs text-gray-400 leading-relaxed mb-5">This mode has no step shell yet. Preparing it will keep the selected mode active and open the step picker.</div>'
    + '<button type="button" class="create-mode-shell-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition">Add Step</button>'
    + '</div>';
}

function buildListEmptyState() {
  return '<div class="text-center p-5">'
    + '<div class="text-2xl mb-2">✨</div>'
    + '<div class="text-xs font-bold text-gray-600 mb-1">No modes yet</div>'
    + '<div class="text-[11px] text-gray-400">Create one to start building this module.</div>'
    + '</div>';
}

// ── Step picker options ──────────────────────────────────────────────────────

function buildStepPickerModal(practiceModeKey) {
  var html = "";

  html += '<div class="oqu-step-picker-backdrop">';
  html += '<div class="oqu-step-picker-modal" role="dialog" aria-label="Choose a step type">';
  html += '<div class="oqu-step-picker-header">';
  html += '<div>';
  html += '<div class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Add Step</div>';
  html += '<div class="text-lg font-black text-gray-950">Choose an activity type</div>';
  html += '<div class="text-xs text-gray-500 mt-1">Search activities, games, reflection, vocabulary, and assessment-ready steps.</div>';
  html += '</div>';
  html += '<button type="button" class="close-step-picker-btn oqu-step-picker-close" aria-label="Close step picker">×</button>';
  html += '</div>';
  html += '<div class="px-6 pb-4"><input type="search" class="step-picker-search w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" placeholder="Search step activities..."></div>';
  html += '<div class="px-6 pb-4 flex flex-wrap gap-2">';
  html += '<span class="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">Popular: Matching Game</span>';
  html += '<span class="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-sky-700">Suggested: Flashcards</span>';
  html += '<span class="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-violet-700">Assessment-ready</span>';
  html += '</div>';
  html += '<div class="oqu-step-picker-category-list" data-key="' + practiceModeKey + '">';
  html += buildStepPickerOptions();
  html += '</div>';
  html += '</div>';
  html += '</div>';

  return html;
}

function buildStepPickerOptions() {
  var types = createStepTypeCards();
  var categories = createStepCategoryOrder();
  var html = "";
  var categoryIndex = 0;

  while (categoryIndex < categories.length) {
    html += buildStepPickerCategory(categories[categoryIndex], types);
    categoryIndex = categoryIndex + 1;
  }

  return html;
}

function buildStepPickerCategory(category, types) {
  var html = "";
  var typeIndex = 0;
  var categoryCards = "";

  while (typeIndex < types.length) {
    if (types[typeIndex].category === category) {
      categoryCards += buildStepPickerCard(types[typeIndex]);
    }

    typeIndex = typeIndex + 1;
  }

  if (categoryCards.length === 0) {
    return "";
  }

  html += '<section class="oqu-step-picker-category">';
  html += '<div class="oqu-step-picker-category-title">' + escapeHtml(category) + '</div>';
  html += '<div class="oqu-step-picker-grid">';
  html += categoryCards;
  html += '</div>';
  html += '</section>';

  return html;
}

function buildStepPickerCard(type) {
  var html = "";

  html += '<button type="button" class="step-type-option oqu-step-picker-card" data-type="' + type.type + '" data-search-text="' + escapeHtml((type.label + " " + type.description + " " + type.category + " " + type.complexity).toLowerCase()) + '">';
  html += '<span class="oqu-step-picker-card-icon"><i class="' + type.icon + '"></i></span>';
  html += '<span class="oqu-step-picker-card-body">';
  html += '<span class="oqu-step-picker-card-title">' + escapeHtml(type.label) + '</span>';
  html += '<span class="oqu-step-picker-card-description">' + escapeHtml(type.description) + '</span>';
  html += '<span class="oqu-step-picker-card-meta">';
  html += '<span class="oqu-step-picker-card-category">' + escapeHtml(type.category) + '</span>';
  html += '<span class="oqu-step-picker-card-complexity">' + escapeHtml(type.complexity) + '</span>';
  html += '</span>';
  html += '</span>';
  html += '</button>';

  return html;
}

function filterStepPicker(value) {
  var query = typeof value === "string" ? value.trim().toLowerCase() : "";
  var cards = document.querySelectorAll(".oqu-step-picker-card");
  var index = 0;

  while (index < cards.length) {
    var searchText = cards[index].getAttribute("data-search-text") || "";
    cards[index].style.display = !query || searchText.indexOf(query) !== -1 ? "" : "none";
    index = index + 1;
  }
}

function createStepTypeCards() {
  var definitions = listStepTypeDefinitions();
  var cards = [createPrimerStepTypeCard()];
  var definitionIndex = 0;

  while (definitionIndex < definitions.length) {
    cards.push(createStepTypeCard(definitions[definitionIndex]));
    definitionIndex = definitionIndex + 1;
  }

  return cards;
}

function createPrimerStepTypeCard() {
  return {
    type: "textBriefing",
    label: "Primer",
    icon: "fa-solid fa-seedling",
    description: "A short starter step that introduces the key idea before practice.",
    category: "Basic",
    complexity: "Easy"
  };
}

function createStepTypeCard(StepTypeDefinition) {
  return {
    type: readStepDefinitionText(StepTypeDefinition, "type", "unknown"),
    label: readStepDefinitionText(StepTypeDefinition, "label", "Unknown Step"),
    icon: readStepDefinitionIcon(readStepDefinitionText(StepTypeDefinition, "type", "")),
    description: readStepDefinitionText(StepTypeDefinition, "description", "Reusable learning activity."),
    category: readStepDefinitionText(StepTypeDefinition, "category", "Custom"),
    complexity: readStepDefinitionText(StepTypeDefinition, "complexity", "Easy")
  };
}

function createStepCategoryOrder() {
  return ["Basic", "Media", "Games", "Coding", "Speaking", "Assessment", "Custom"];
}

function buildUnsupportedStudentPreview(step) {
  var stepType = readStepType(step);
  var title = readLocalizedText(step.title, "Unsupported Step");
  var safeType = stepType ? stepType : "unknown";
  var html = "";

  html += '<div class="oqu-preview-card oqu-preview-unsupported">';
  html += '<div class="oqu-preview-type-badge">🔷 ' + escapeHtml(safeType) + '</div>';
  html += '<div class="text-xs font-bold text-amber-700 mb-2">Unsupported step type</div>';
  html += '<div class="text-xs text-gray-500 mb-4">This step cannot be previewed yet, but it is safely stored.</div>';
  html += '<div class="oqu-preview-title">' + escapeHtml(title) + '</div>';
  html += '</div>';

  return html;
}

function buildStudentPlayerShell(step, playerBodyId) {
  var title = readLocalizedText(step.title, "Step Preview");
  var instructions = readLocalizedText(step.instructions, "");
  var html = "";

  html += '<div class="oqu-student-player-shell">';
  html += '<div class="oqu-student-player-header">';
  html += '<div class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Learner Preview</div>';
  html += '<h1>' + escapeHtml(title) + '</h1>';
  if (instructions) {
    html += '<p>' + escapeHtml(instructions) + '</p>';
  }
  html += '</div>';
  html += '<div id="' + playerBodyId + '" class="oqu-student-player-body"></div>';
  html += '</div>';

  return html;
}

function fileMatchesMediaField(file, mediaField) {
  if (!file || typeof file.type !== "string") {
    return false;
  }

  if (mediaField === "imageUrl") {
    return file.type.indexOf("image/") === 0;
  }

  if (mediaField === "audioUrl") {
    return file.type.indexOf("audio/") === 0;
  }

  return false;
}

function findMediaStatusElement(mediaInput) {
  var row = mediaInput.closest(".oqu-media-upload-row");

  if (!row) {
    return null;
  }

  return row.querySelector(".oqu-media-upload-status");
}

function showMediaStatus(statusElement, statusType, message) {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.className = "oqu-media-upload-status oqu-media-upload-" + statusType;
}

function showActionStatus(statusElement, statusType, message, theme) {
  if (!statusElement) {
    return;
  }

  statusElement.className = "oqu-media-upload-status oqu-media-upload-" + statusType;
  statusElement.innerHTML = buildActionStatusHtml(statusType, message, theme);
}

function buildActionStatusHtml(statusType, message, theme) {
  var safeMessage = escapeHtml(message);
  var iconHtml = '<span class="oqu-action-status-icon"><i class="fa-solid fa-circle-notch fa-spin"></i></span>';

  if (theme === "media") {
    iconHtml = '<span class="oqu-action-status-media"><i class="fa-regular fa-image"></i><i class="fa-solid fa-cloud-arrow-up"></i></span>';
  }

  if (statusType === "success") {
    iconHtml = '<span class="oqu-action-status-icon oqu-action-status-success"><i class="fa-solid fa-check"></i></span>';
  }

  if (statusType === "error") {
    iconHtml = '<span class="oqu-action-status-icon oqu-action-status-error"><i class="fa-solid fa-triangle-exclamation"></i></span>';
  }

  return '<span class="oqu-action-status oqu-action-status-' + statusType + '">' + iconHtml + '<span>' + safeMessage + '</span></span>';
}

function readStepEditorSchema(stepType) {
  var StepTypeDefinition = getStepTypeDefinition(stepType);
  var schemaResult = {
    valid: false,
    fields: []
  };

  if (!StepTypeDefinition || !StepTypeDefinition.editorSchema) {
    return schemaResult;
  }

  if (!Array.isArray(StepTypeDefinition.editorSchema.fields)) {
    return schemaResult;
  }

  if (!schemaMatchesDefaultConfig(StepTypeDefinition.editorSchema.fields, StepTypeDefinition.defaultConfig)) {
    return schemaResult;
  }

  schemaResult.valid = StepTypeDefinition.editorSchema.fields.length > 0;
  schemaResult.fields = StepTypeDefinition.editorSchema.fields;
  return schemaResult;
}

function schemaMatchesDefaultConfig(fields, defaultConfig) {
  var configKeys = [];
  var fieldKeys = [];
  var fieldIndex = 0;

  if (!defaultConfig || typeof defaultConfig !== "object" || Array.isArray(defaultConfig)) {
    return fields.length === 0;
  }

  configKeys = Object.keys(defaultConfig);

  while (fieldIndex < fields.length) {
    if (!fields[fieldIndex] || typeof fields[fieldIndex].key !== "string") {
      return false;
    }
    fieldKeys.push(fields[fieldIndex].key);
    fieldIndex = fieldIndex + 1;
  }

  if (fieldKeys.length !== configKeys.length) {
    return false;
  }

  fieldIndex = 0;
  while (fieldIndex < configKeys.length) {
    if (fieldKeys.indexOf(configKeys[fieldIndex]) === -1) {
      return false;
    }
    fieldIndex = fieldIndex + 1;
  }

  return true;
}

function buildStepConfigField(field, config) {
  var key = field.key;
  var label = readString(field.label, key);
  var type = readString(field.type, "text");
  var value = readConfigValue(config, key);
  var html = "";
  var mediaKind = readMediaKind(key);

  html += '<div class="oqu-inspector-field">';
  html += '<label class="oqu-inspector-label">' + escapeHtml(label) + '</label>';

  if (type === "textarea") {
    html += '<textarea class="oqu-inspector-textarea inspector-config-field" data-config-key="' + escapeHtml(key) + '" data-config-type="textarea">' + escapeHtml(String(value)) + '</textarea>';
  } else if (type === "number") {
    html += '<input type="number" class="oqu-inspector-input inspector-config-field" data-config-key="' + escapeHtml(key) + '" data-config-type="number" value="' + escapeHtml(String(value)) + '">';
  } else if (type === "select") {
    html += '<select class="oqu-inspector-select inspector-config-field" data-config-key="' + escapeHtml(key) + '" data-config-type="select">';
    html += buildConfigSelectOptions(field.options, String(value));
    html += '</select>';
  } else {
    html += '<input type="text" class="oqu-inspector-input inspector-config-field" data-config-key="' + escapeHtml(key) + '" data-config-type="text" value="' + escapeHtml(String(value)) + '">';
  }

  if (mediaKind) {
    html += buildMediaFieldControls(key, mediaKind, String(value));
  }

  html += '</div>';
  return html;
}

function buildMediaFieldControls(key, mediaKind, value) {
  var accept = mediaKind === "image" ? "image/*" : "audio/*";
  var html = "";

  html += '<div class="oqu-media-upload-row">';
  html += '<label class="oqu-media-upload-btn">';
  html += '<input type="file" class="inspector-media-upload" data-config-key="' + escapeHtml(key) + '" accept="' + accept + '">';
  html += 'Upload ' + mediaKind;
  html += '</label>';
  html += '<span class="oqu-media-upload-status"></span>';
  html += '</div>';
  html += buildMediaPreview(mediaKind, value);

  return html;
}

function buildMediaPreview(mediaKind, value) {
  if (!value) {
    return '<div class="oqu-media-preview-empty">No media uploaded yet.</div>';
  }

  if (mediaKind === "image") {
    return '<img class="oqu-media-preview-image" src="' + escapeHtml(value) + '" alt="Step image preview">';
  }

  return '<audio class="oqu-media-preview-audio" controls src="' + escapeHtml(value) + '"></audio>';
}

function readMediaKind(key) {
  if (key === "imageUrl") {
    return "image";
  }

  if (key === "audioUrl") {
    return "audio";
  }

  return "";
}

function buildConfigSelectOptions(options, selectedValue) {
  var html = "";
  var optionIndex = 0;

  if (!Array.isArray(options) || options.length === 0) {
    return '<option value="' + escapeHtml(selectedValue) + '">' + escapeHtml(selectedValue || "Select") + '</option>';
  }

  while (optionIndex < options.length) {
    var option = options[optionIndex];
    var value = "";
    var label = "";
    var selected = "";

    if (option && typeof option.value === "string") {
      value = option.value;
    }

    if (option && typeof option.label === "string") {
      label = option.label;
    } else {
      label = value;
    }

    if (value === selectedValue) {
      selected = " selected";
    }

    html += '<option value="' + escapeHtml(value) + '"' + selected + '>' + escapeHtml(label) + '</option>';
    optionIndex = optionIndex + 1;
  }

  return html;
}

function readStepConfigFromInspector(propsPane, stepType, fallbackConfig) {
  var schema = readStepEditorSchema(stepType);
  var config = createSafeStepConfig(stepType, fallbackConfig);
  var inputs = propsPane.querySelectorAll(".inspector-config-field");
  var inputIndex = 0;

  if (!schema.valid) {
    return config;
  }

  while (inputIndex < inputs.length) {
    var input = inputs[inputIndex];
    var key = input.getAttribute("data-config-key");
    var type = input.getAttribute("data-config-type");

    if (key && Object.prototype.hasOwnProperty.call(config, key)) {
      config[key] = readConfigInputValue(input, type);
    }

    inputIndex = inputIndex + 1;
  }

  return config;
}

function readConfigInputValue(input, type) {
  if (type === "number") {
    var numberValue = Number(input.value);
    if (Number.isFinite(numberValue)) {
      return numberValue;
    }
    return 0;
  }

  return input.value;
}

function createSafeStepConfig(stepType, config) {
  var StepTypeDefinition = getStepTypeDefinition(stepType);

  if (StepTypeDefinition && typeof StepTypeDefinition.createConfig === "function") {
    return StepTypeDefinition.createConfig(config);
  }

  if (config && typeof config === "object" && !Array.isArray(config)) {
    return Object.assign({}, config);
  }

  return {};
}

function readConfigValue(config, key) {
  if (!config || typeof config !== "object") {
    return "";
  }

  if (!Object.prototype.hasOwnProperty.call(config, key)) {
    return "";
  }

  if (config[key] === null || typeof config[key] === "undefined") {
    return "";
  }

  return config[key];
}

function readConfigText(config, key, fallbackText) {
  var value = readConfigValue(config, key);

  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  return fallbackText;
}

function readConfigNumber(config, key, fallbackNumber) {
  var value = readConfigValue(config, key);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.length > 0) {
    var parsedValue = Number(value);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return fallbackNumber;
}

function buildPreviewMediaBox(imageUrl, fallbackIcon) {
  if (imageUrl) {
    return '<div class="oqu-preview-image-ph" style="background-image:url(' + escapeHtml(imageUrl) + ');background-size:cover;background-position:center"></div>';
  }

  return '<div class="oqu-preview-image-ph">' + fallbackIcon + '</div>';
}

// ── HTML escaping ────────────────────────────────────────────────────────────

function escapeHtml(str) {
  if (typeof str !== "string") {
    return "";
  }
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Localized text reader ─────────────────────────────────────────────────────

function readLocalizedText(value, fallbackText) {
  if (typeof value === "string") {
    return value || fallbackText;
  }
  if (!value || typeof value !== "object") {
    return fallbackText;
  }
  if (typeof value.en === "string" && value.en.length > 0) {
    return value.en;
  }
  if (typeof value.ru === "string" && value.ru.length > 0) {
    return value.ru;
  }
  if (typeof value.ky === "string" && value.ky.length > 0) {
    return value.ky;
  }
  return fallbackText;
}

// ── Practice mode structure ───────────────────────────────────────────────────

function createPracticeModeKeys() {
  return ["beforeClass", "classroomLesson", "afterClass", "dailyPractice"];
}

function readPracticeModes(session) {
  if (!session || !session.practiceModes) {
    return createDefaultPracticeModes();
  }
  return normalizePracticeModes(session.practiceModes);
}

function normalizePracticeModes(practiceModes) {
  var defaultModes = createDefaultPracticeModes();
  return {
    beforeClass:     normalizePracticeMode(defaultModes.beforeClass,     practiceModes.beforeClass),
    classroomLesson: normalizePracticeMode(defaultModes.classroomLesson, practiceModes.classroomLesson),
    afterClass:      normalizePracticeMode(defaultModes.afterClass,      practiceModes.afterClass),
    dailyPractice:   normalizePracticeMode(defaultModes.dailyPractice,   practiceModes.dailyPractice)
  };
}

function normalizePracticeMode(defaultMode, existingMode) {
  if (!existingMode || typeof existingMode !== "object") {
    return defaultMode;
  }
  return {
    key:     defaultMode.key,
    title:   normalizePracticeModeTitle(defaultMode.title, existingMode.title),
    purpose: readString(existingMode.purpose, defaultMode.purpose),
    status:  readString(existingMode.status, defaultMode.status),
    enabled: readPracticeModeEnabled(existingMode.enabled, defaultMode.enabled),
    steps:   readPracticeModeSteps(existingMode.steps),
    order:   defaultMode.order
  };
}

function createDefaultPracticeModes() {
  return {
    beforeClass:     createPracticeMode("beforeClass",     "Before Class",               "Prepare students before the live lesson.", 1),
    classroomLesson: createPracticeMode("classroomLesson", "Classroom Lesson",            "Reserve space for teacher-led lesson notes.", 2),
    afterClass:      createPracticeMode("afterClass",      "After Class",                 "Reinforce what students practiced during class.", 3),
    dailyPractice:   createPracticeMode("dailyPractice",   "Five Minute Daily Practice",  "Give students short daily review practice.", 4)
  };
}

function createPracticeMode(key, englishTitle, purpose, order) {
  return {
    key:     key,
    title:   { en: englishTitle, ru: "", ky: "" },
    purpose: purpose,
    status:  "shell",
    enabled: true,
    steps:   [],
    order:   order
  };
}

function normalizePracticeModeTitle(defaultTitle, title) {
  if (typeof title === "string") {
    return createLocalizedTitle(defaultTitle, title);
  }
  if (!title || typeof title !== "object") {
    return defaultTitle;
  }
  return {
    en: readString(title.en, defaultTitle.en),
    ru: readString(title.ru, defaultTitle.ru),
    ky: readString(title.ky, defaultTitle.ky)
  };
}

function createLocalizedTitle(existingTitle, englishTitle) {
  var localizedTitle = { en: "", ru: "", ky: "" };
  if (existingTitle && typeof existingTitle === "object") {
    localizedTitle.en = readString(existingTitle.en, "");
    localizedTitle.ru = readString(existingTitle.ru, "");
    localizedTitle.ky = readString(existingTitle.ky, "");
  }
  localizedTitle.en = englishTitle.trim();
  return localizedTitle;
}

// ── Primitive readers ─────────────────────────────────────────────────────────

function readString(value, fallbackValue) {
  if (typeof value !== "string" || value.length === 0) {
    return fallbackValue;
  }
  return value;
}

function readPracticeModeEnabled(value, fallbackValue) {
  if (typeof value === "boolean") {
    return value;
  }
  return fallbackValue;
}

function readPracticeModeSteps(steps) {
  if (!Array.isArray(steps)) {
    return [];
  }
  return steps;
}

function readSortedSteps(steps) {
  var safeSteps = readPracticeModeSteps(steps).slice();
  safeSteps.sort(function (a, b) {
    return readStepOrder(a) - readStepOrder(b);
  });
  return safeSteps;
}

function readStepOrder(step) {
  if (!step || typeof step.order !== "number") {
    return 0;
  }
  return step.order;
}

function readStepId(step, fallbackValue) {
  if (!step || typeof step.id !== "string" || step.id.length === 0) {
    return fallbackValue;
  }
  return step.id;
}

function readStepType(step) {
  if (!step || typeof step.type !== "string") {
    return "";
  }
  return step.type;
}

function readStepConfig(step) {
  if (!step || !step.config || typeof step.config !== "object" || Array.isArray(step.config)) {
    return {};
  }
  return step.config;
}

function createLearningModeStepUpdates(step) {
  return {
    type: step && step.type ? step.type : "",
    stepTypeId: step && (step.stepTypeId || step.type) ? step.stepTypeId || step.type : "",
    title: step ? step.title : { en: "", ru: "", ky: "" },
    instructions: step ? step.instructions : { en: "", ru: "", ky: "" },
    config: readStepConfig(step),
    status: step && step.status ? step.status : "draft"
  };
}

function readStepCount(mode) {
  if (!mode || !Array.isArray(mode.steps)) {
    return 0;
  }
  return mode.steps.length;
}

function findPracticeModeStep(session, practiceModeKey, stepId) {
  var practiceModes = readPracticeModes(session);
  var practiceMode = practiceModes[practiceModeKey];
  var steps = readPracticeModeSteps(practiceMode.steps);
  var i = 0;
  while (i < steps.length) {
    if (readStepId(steps[i], "") === stepId) {
      return steps[i];
    }
    i = i + 1;
  }
  return {
    id: stepId,
    type: "",
    title: { en: "", ru: "", ky: "" },
    instructions: { en: "", ru: "", ky: "" },
    config: {},
    status: "draft"
  };
}

// ── Step type metadata ────────────────────────────────────────────────────────

function isKnownStepType(stepType) {
  return getStepTypeDefinition(stepType) !== null;
}

function readStepTypeLabel(stepType) {
  var StepTypeDefinition = getStepTypeDefinition(stepType);

  if (StepTypeDefinition) {
    return readStepDefinitionText(StepTypeDefinition, "label", "Unknown Step");
  }

  if (stepType && stepType.length > 0) { return "Unsupported: " + stepType; }
  return "Unknown Step";
}

function readStepTypeIcon(stepType) {
  if (stepType === "textBriefing") { return "📄"; }
  if (stepType === "vocabulary") { return "📖"; }
  if (stepType === "phrase") { return "💬"; }
  if (stepType === "listening") { return "🎧"; }
  if (stepType === "speakingPrompt") { return "🎤"; }
  if (stepType === "reflection") { return "💡"; }
  if (stepType === "customExperience") { return "✦"; }
  if (stepType === "cyberCodeMission") { return "⌨"; }
  if (stepType === "dragMatchIsland") { return "🏝"; }
  return "🔷";
}

function readStepPreviewMode(stepType) {
  var StepTypeDefinition = getStepTypeDefinition(stepType);
  var previewMode = readStepDefinitionText(StepTypeDefinition, "previewMode", "card");

  if (previewMode === "full" || previewMode === "split") {
    return previewMode;
  }

  return "card";
}

function readStepDefinitionText(StepTypeDefinition, propertyName, fallbackText) {
  if (!StepTypeDefinition) {
    return fallbackText;
  }

  if (typeof StepTypeDefinition[propertyName] === "string" && StepTypeDefinition[propertyName].length > 0) {
    return StepTypeDefinition[propertyName];
  }

  return fallbackText;
}

function readStepDefinitionIcon(stepType) {
  if (stepType === "textBriefing") { return "fa-solid fa-file-lines"; }
  if (stepType === "vocabulary") { return "fa-solid fa-book"; }
  if (stepType === "phrase") { return "fa-solid fa-comment-dots"; }
  if (stepType === "listening") { return "fa-solid fa-headphones"; }
  if (stepType === "speakingPrompt") { return "fa-solid fa-microphone"; }
  if (stepType === "reflection") { return "fa-solid fa-lightbulb"; }
  if (stepType === "customExperience") { return "fa-solid fa-shapes"; }
  if (stepType === "cyberCodeMission") { return "fa-solid fa-code"; }
  if (stepType === "dragMatchIsland") { return "fa-solid fa-gamepad"; }
  if (stepType === "externalTask") { return "fa-solid fa-clipboard-check"; }
  return "fa-solid fa-puzzle-piece";
}

function supportsLearningContentPull(stepType) {
  return stepType === "dragMatchIsland"
    || stepType === "vocabulary"
    || stepType === "reflection"
    || stepType === "customExperience";
}

// ── Status option builder ─────────────────────────────────────────────────────

function buildStatusOption(status, currentStatus) {
  var selected = status === currentStatus ? " selected" : "";
  return '<option value="' + status + '"' + selected + '>' + status + '</option>';
}

// ── Session UI feedback helpers ───────────────────────────────────────────────

function showSessionBtnPending(btn, label) {
  btn.innerHTML = '<span class="oqu-spinner oqu-spinner-blue"></span> ' + label;
  btn.disabled = true;
  btn.classList.add("oqu-btn-pending");
}

function restoreSessionBtn(btn, html) {
  btn.innerHTML = html;
  btn.disabled = false;
  btn.classList.remove("oqu-btn-pending");
}

function showSessionBanner(banner, type, html) {
  var typeClass = "oqu-status-creating";
  if (type === "error")   { typeClass = "oqu-status-error"; }
  if (type === "success") { typeClass = "oqu-status-success"; }
  banner.className = "oqu-status-banner " + typeClass;
  banner.innerHTML = html;
  banner.style.display = "flex";
}

// ── Skeleton loaders ─────────────────────────────────────────────────────────

function buildSessionSkeletonCards(count) {
  var html = "";
  var i = 0;
  var widths = ["70%", "55%", "65%"];
  while (i < count) {
    var w = widths[i % widths.length];
    html += '<div class="p-2.5 rounded-lg border border-gray-100 flex items-center gap-2.5">';
    html += '<div class="oqu-skeleton-card" style="width:20px;height:20px;border-radius:50%;flex-shrink:0"></div>';
    html += '<div class="flex-1">';
    html += '<div class="oqu-skeleton-line" style="height:11px;width:' + w + ';margin-bottom:5px"></div>';
    html += '<div class="oqu-skeleton-line" style="height:9px;width:35%"></div>';
    html += '</div>';
    html += '</div>';
    i = i + 1;
  }
  return html;
}

function buildSessionErrorCard(errorMessage) {
  return '<div class="oqu-status-banner oqu-status-error">'
    + '<i class="fa-solid fa-triangle-exclamation"></i>'
    + '<span>' + escapeHtml(errorMessage) + '</span>'
    + '</div>';
}

function buildLearningContentWorkspace(learningContent) {
  var content = normalizeLearningContentForUi(learningContent);
  var html = "";

  html += '<div class="p-6 space-y-5">';
  html += '<div class="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-sky-50 to-white p-5 shadow-sm">';
  html += '<div class="flex items-start justify-between gap-4">';
  html += '<div>';
  html += '<div class="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">Authoring Source</div>';
  html += '<h2 class="mt-2 text-2xl font-black text-slate-950">Learning Content</h2>';
  html += '<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Hidden from students. Use this as the reusable source material for activities, review, assessment, and future AI-assisted creation.</p>';
  html += '</div>';
  html += '<img src="./src/assets/learning-content.svg" alt="" class="hidden md:block h-28 w-40 object-contain">';
  html += '<button type="button" class="save-learning-content-btn rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-slate-800"><i class="fa-solid fa-floppy-disk"></i> Save Learning Content</button>';
  html += '</div>';
  html += '</div>';

  html += '<div class="grid grid-cols-2 gap-4">';
  html += buildLearningContentTextarea("Vocabulary", "vocabulary", content.vocabulary, "One word or phrase per line");
  html += buildLearningContentTextarea("Definitions", "definitions", content.definitions, "Match definitions by line order");
  html += buildLearningContentTextarea("Concepts", "concepts", content.concepts, "Concepts students should understand");
  html += buildLearningContentTextarea("Rules", "rules", content.rules, "Grammar, usage, or behavior rules");
  html += buildLearningContentTextarea("Examples", "examples", content.examples, "Sample sentences or worked examples");
  html += buildLearningContentTextarea("Custom Content", "customContent", content.customContent, "Any extra authoring notes or source items");
  html += '</div>';

  html += '<div class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">';
  html += '<label class="text-xs font-black uppercase tracking-widest text-slate-400">Creator Notes</label>';
  html += '<textarea data-learning-content-field="notes" class="mt-3 min-h-[120px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" placeholder="Private module notes, assessment ideas, or migration notes.">' + escapeHtml(content.notes) + '</textarea>';
  html += '</div>';

  html += '<div class="rounded-3xl border border-dashed border-sky-200 bg-sky-50/70 p-5">';
  html += '<div class="flex items-center justify-between gap-4">';
  html += '<div><div class="text-sm font-black text-slate-900">Pull From Learning Content</div><div class="mt-1 text-xs leading-5 text-slate-500">Creates a draft config in the console today. Later this same intent can feed AI generation without changing the authoring model.</div></div>';
  html += '<div class="flex flex-wrap gap-2 justify-end">';
  html += '<button type="button" class="pull-learning-content-btn rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-black text-sky-700 hover:bg-sky-100" data-step-type="dragMatchIsland" data-source="vocabulary">Matching Draft</button>';
  html += '<button type="button" class="pull-learning-content-btn rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-black text-sky-700 hover:bg-sky-100" data-step-type="vocabulary" data-source="vocabulary">Flashcard Draft</button>';
  html += '<button type="button" class="pull-learning-content-btn rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-black text-sky-700 hover:bg-sky-100" data-step-type="reflection" data-source="concepts">Reflection Draft</button>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  html += '</div>';
  return html;
}

function buildLearningContentTextarea(label, field, items, placeholder) {
  return '<div class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">'
    + '<label class="text-xs font-black uppercase tracking-widest text-slate-400">' + escapeHtml(label) + '</label>'
    + '<textarea data-learning-content-field="' + field + '" class="mt-3 min-h-[150px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" placeholder="' + escapeHtml(placeholder) + '">' + escapeHtml(items.join("\n")) + '</textarea>'
    + '</div>';
}

function buildLearningContentInspector(learningContent) {
  var content = normalizeLearningContentForUi(learningContent);
  var total = content.vocabulary.length + content.definitions.length + content.concepts.length + content.rules.length + content.examples.length + content.customContent.length;
  var html = "";

  html += '<div class="space-y-4">';
  html += '<div class="rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 p-4 border border-emerald-100">';
  html += '<div class="text-[10px] font-black uppercase tracking-widest text-emerald-600">Content Health</div>';
  html += '<div class="mt-2 text-3xl font-black text-slate-950">' + total + '</div>';
  html += '<div class="text-xs font-semibold text-slate-500">source items ready for activities</div>';
  html += '</div>';
  html += '<div class="rounded-2xl border border-slate-100 p-4 text-xs leading-5 text-slate-500">Students never see this tab. Student screens should continue to say only <strong class="text-slate-700">Continue Learning</strong>.</div>';
  html += '<div class="space-y-2 text-xs text-slate-500">';
  html += '<div class="font-black uppercase tracking-widest text-slate-400">Migration Notes</div>';
  html += '<div>Existing session/practice-mode data remains in place.</div>';
  html += '<div>New activity generators should read this content first, then allow manual edits.</div>';
  html += '</div>';
  html += '</div>';
  return html;
}

function buildLearningModesWorkspace(learningModes, sessions, selectedModeId) {
  var modes = createLearningModeList(learningModes, sessions);
  var html = "";

  html += '<div class="p-6 space-y-5">';
  html += '<div class="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-sky-50 to-white p-5 shadow-sm">';
  html += '<div class="flex items-start justify-between gap-4">';
  html += '<div>';
  html += '<div class="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">Module Experiences</div>';
  html += '<h2 class="mt-2 text-2xl font-black text-slate-950">Learning Modes</h2>';
  html += '<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Modes replace the old session terminology for authoring. Primary Mode is required; review, practice, assessment, and custom modes can be layered in safely.</p>';
  html += '</div>';
  html += '<button type="button" class="generate-mode-from-primary-btn rounded-2xl border border-violet-200 bg-white px-4 py-2 text-xs font-black text-violet-700 shadow-sm hover:bg-violet-50"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate From Primary</button>';
  html += '</div>';
  html += '</div>';

  html += '<div class="grid grid-cols-2 gap-4">';
  modes.forEach(function (mode) {
    var selected = selectedModeId === mode.id ? " ring-2 ring-emerald-300 border-emerald-200" : " border-slate-100";
    html += '<div class="learning-mode-card rounded-3xl bg-white p-5 shadow-sm border cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition' + selected + '" data-mode-id="' + mode.id + '">';
  html += '<div class="flex items-start gap-4">';
    html += '<img src="' + readLearningModeAsset(mode) + '" alt="" class="h-16 w-20 rounded-2xl object-cover bg-slate-50">';
    html += '<div class="min-w-0 flex-1">';
    html += '<div class="flex items-center gap-2 flex-wrap">' + buildStatusPill(mode.status) + (mode.required ? '<span class="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">Required</span>' : '') + '</div>';
    html += '<h3 class="mt-3 text-lg font-black text-slate-950 truncate">' + escapeHtml(mode.title) + '</h3>';
    html += '<p class="mt-1 text-xs leading-5 text-slate-500">' + escapeHtml(mode.purpose || "Custom learning experience.") + '</p>';
    html += '</div>';
    html += '</div>';
    html += '<div class="mt-4 flex items-center justify-between gap-2">';
    html += '<span class="text-[10px] font-black uppercase tracking-widest text-slate-400">' + escapeHtml(mode.modeType || "custom") + '</span>';
    html += '<div class="flex gap-2">';
    html += '<button type="button" class="rename-learning-mode-btn rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black text-slate-600 hover:bg-slate-50" data-mode-id="' + mode.id + '">Rename</button>';
    html += '<button type="button" class="duplicate-learning-mode-btn rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black text-slate-600 hover:bg-slate-50" data-mode-id="' + mode.id + '">Duplicate</button>';
    if (!mode.required) {
      html += '<button type="button" class="delete-learning-mode-btn rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-600 hover:bg-rose-100" data-mode-id="' + mode.id + '">Delete</button>';
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';

  html += '<div class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">';
  html += '<div class="text-sm font-black text-slate-900">Compatibility Layer</div>';
  html += '<p class="mt-2 text-xs leading-5 text-slate-500">Each learning mode can point at a legacy session shell while migration is in progress. The existing Step System continues to run from those shells.</p>';
  html += '</div>';
  html += '</div>';

  return html;
}

function buildLearningModesInspector() {
  var html = "";
  html += '<div class="space-y-4">';
  html += '<div class="rounded-2xl border border-slate-100 p-4">';
  html += '<div class="text-xs font-black text-slate-900">Templates</div>';
  html += '<div class="mt-2 text-xs leading-5 text-slate-500">School: Primary + Review. Education Center: Primary only. Intensive: Primary + Review + Practice + Assessment. Custom: Primary only.</div>';
  html += '</div>';
  html += '<div class="rounded-2xl border border-slate-100 p-4">';
  html += '<div class="text-xs font-black text-slate-900">Student Language</div>';
  html += '<div class="mt-2 text-xs leading-5 text-slate-500">Do not expose mode names to students. They only see Continue Learning.</div>';
  html += '</div>';
  html += '</div>';
  return html;
}

function buildSelectedLearningModeInspector(mode, tab) {
  if (!mode) {
    return buildLearningModesInspector();
  }

  var html = "";
  html += '<div class="space-y-4">';
  html += '<div class="rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 p-4 border border-emerald-100">';
  html += '<div class="text-[10px] font-black uppercase tracking-widest text-emerald-600">Selected Mode</div>';
  html += '<div class="mt-2 text-lg font-black text-slate-950">' + escapeHtml(readLocalizedText(mode.title, "Learning Mode")) + '</div>';
  html += '<div class="mt-1 text-xs font-semibold text-slate-500">' + escapeHtml(readString(mode.purpose, "Learning experience.")) + '</div>';
  html += '</div>';
  html += '<div class="rounded-2xl border border-slate-100 p-4">';
  html += '<div class="oqu-inspector-readonly-label">Mode ID</div>';
  html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(readString(mode.id, "primary")) + '</div>';
  html += '<div class="oqu-inspector-readonly-label">Type</div>';
  html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(readString(mode.modeType, "primary")) + '</div>';
  html += '<div class="oqu-inspector-readonly-label">Status</div>';
  html += '<div class="mt-1">' + buildStatusPill(readString(mode.status, "draft")) + '</div>';
  html += '</div>';
  html += '<div class="rounded-2xl border border-slate-100 p-4 text-xs leading-5 text-slate-500">';
  html += tab === "learningModes" ? 'Click the Steps tab to edit activities for this mode.' : 'The main panel and inspector are synced to this selected mode.';
  html += '</div>';
  html += '</div>';
  return html;
}

function readLearningContentFromWorkspace() {
  var content = {};
  var fields = document.querySelectorAll("[data-learning-content-field]");
  var index = 0;

  while (index < fields.length) {
    var field = fields[index].getAttribute("data-learning-content-field");
    if (field === "notes") {
      content[field] = fields[index].value.trim();
    } else {
      content[field] = parseLines(fields[index].value);
    }
    index = index + 1;
  }

  return content;
}

function normalizeLearningContentForUi(learningContent) {
  var content = learningContent && typeof learningContent === "object" ? learningContent : {};
  return {
    vocabulary: readArrayForUi(content.vocabulary),
    definitions: readArrayForUi(content.definitions),
    concepts: readArrayForUi(content.concepts),
    rules: readArrayForUi(content.rules),
    examples: readArrayForUi(content.examples),
    images: readArrayForUi(content.images),
    audio: readArrayForUi(content.audio),
    video: readArrayForUi(content.video),
    attachments: readArrayForUi(content.attachments),
    customContent: readArrayForUi(content.customContent),
    notes: readString(content.notes, "")
  };
}

function createLearningModeList(learningModes, sessions) {
  var modes = learningModes && typeof learningModes === "object" && !Array.isArray(learningModes) ? learningModes : {};
  var list = [];

  Object.keys(modes).forEach(function (modeId) {
    if (modes[modeId] && modes[modeId].status !== "deleted") {
      list.push(Object.assign({ id: modeId }, modes[modeId]));
    }
  });

  if (list.length === 0 && Array.isArray(sessions)) {
    sessions.forEach(function (session, index) {
      list.push({
        id: index === 0 ? "primary" : "legacy-" + session.id,
        title: index === 0 ? "Primary Mode" : readLocalizedText(session.title, "Legacy Mode"),
        purpose: "Migrated from legacy session data.",
        modeType: index === 0 ? "primary" : "legacy",
        status: session.status || "draft",
        required: index === 0,
        legacySessionId: session.id,
        order: index + 1
      });
    });
  }

  list.sort(function (a, b) {
    return (a.order || 99) - (b.order || 99);
  });
  return list;
}

function readSelectedModeId(state) {
  if (state && typeof state.selectedModeId === "string" && state.selectedModeId.length > 0) {
    return state.selectedModeId;
  }

  if (state && typeof state.selectedLearningModeId === "string" && state.selectedLearningModeId.length > 0) {
    return state.selectedLearningModeId;
  }

  return "primary";
}

function readCourseContext(state, courseId, moduleId, modeId) {
  var existingContext = state && state.courseContext ? state.courseContext : {};
  var collectionName = existingContext.courseCollectionName || "catalogCourses";
  var safeCourseId = existingContext.courseId || courseId || "";
  var safeModuleId = existingContext.moduleId || moduleId || "";
  var safeModeId = modeId || existingContext.modeId || readSelectedModeId(state);
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

function logModeSelection(state, tab, selectedMode) {
  if (!isDevelopmentLoggingEnabled()) {
    return;
  }

  var modes = state && state.learningModes && typeof state.learningModes === "object" ? state.learningModes : {};
  var selectedModeId = readSelectedModeId(state);
  var availableModeIds = Object.keys(modes).filter(function (modeId) {
    return modes[modeId] && modes[modeId].status !== "deleted";
  });

  if (!selectedMode) {
    console.warn("[module-editor:mode-select] selected mode missing", {
      selectedModeId: selectedModeId,
      availableModeIds: availableModeIds
    });
    return;
  }

  console.info("[module-editor:mode-select]", {
    selectedModeId: selectedModeId,
    selectedModeTitle: readLocalizedText(selectedMode.title, selectedModeId),
    tab: tab || "steps",
    modeCount: availableModeIds.length
  });
}

function isDevelopmentLoggingEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.search.indexOf("debug") !== -1;
}

function readLearningModeIcon(mode) {
  if (mode && mode.modeType === "primary") return '<i class="fa-solid fa-star"></i>';
  if (mode && mode.modeType === "review") return '<i class="fa-solid fa-rotate"></i>';
  if (mode && mode.modeType === "practice") return '<i class="fa-solid fa-dumbbell"></i>';
  if (mode && mode.modeType === "assessment") return '<i class="fa-solid fa-clipboard-check"></i>';
  return '<i class="fa-solid fa-route"></i>';
}

function readLearningModeAsset(mode) {
  if (mode && mode.modeType === "primary") return "./src/assets/primary-mode.svg";
  if (mode && mode.modeType === "review") return "./src/assets/review-mode.svg";
  if (mode && mode.modeType === "practice") return "./src/assets/practice-mode.svg";
  if (mode && mode.modeType === "assessment") return "./src/assets/assessment-mode.svg";
  return "./src/assets/primary-mode.svg";
}

function parseLines(value) {
  if (typeof value !== "string") {
    return [];
  }

  return value.split(/\r?\n/).map(function (line) {
    return line.trim();
  }).filter(function (line) {
    return line.length > 0;
  });
}

function readArrayForUi(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(function (item) {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") return item.term || item.word || item.title || item.text || "";
    return "";
  }).filter(function (item) {
    return item.length > 0;
  });
}
