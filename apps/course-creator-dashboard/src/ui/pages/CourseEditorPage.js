import { moduleEditorStore } from "../state/moduleEditorState.js?v=1.1.160-lesson-paths";
import { moduleEditorService } from "../services/moduleEditorService.js?v=1.1.203-step-media-upload";
import {
  getDefaultActivityTemplateId,
  getActivityTemplateOptions,
  getStepTypeDefinition,
  listStepTypeDefinitions,
  normalizeActivityTemplateId,
  validateStepConfig
} from "../../../../../packages/domain/steps/index.js?v=1.1.193-step-library";
import { PracticeModePlayer } from "../../../../../packages/shared/player/index.js?v=1.1.193-step-library";
import { createStatusBadge } from "../../../../../packages/ui/index.js?v=1.1.138-course-overview-title";

const MAIN_PATH_PRACTICE_MODE_KEY = "beforeClass";
const SUPPORTED_MAIN_PATH_STEP_TYPES = [
  "intro-card",
  "card-reveal",
  "vocabulary",
  "phrase",
  "listening",
  "speakingPrompt",
  "reflectionShell",
  "roadmap",
  "sorting",
  "matching",
  "ordering",
  "multiple-choice",
  "multi-select",
  "scenario-choice",
  "scenario-simulator",
  "sequence-memory",
  "timed-sequence",
  "practice-challenge",
  "creative-canvas",
  "reflection"
];

export class CourseEditorPage {
  constructor(courseId, moduleId) {
    this.courseId = courseId;
    this.moduleId = moduleId;
    this.unsubscribe = null;
    this.stepPickerOpen = false;
    this.studentPreviewMode = false;
    this.practiceModePlaytestMode = false;
    this.previewDockTemplate = "basic";
    this.previewDockDevice = "desktop";
    this.playtestStepIndex = 0;
    this.playtestCompleted = false;
    this.practiceModePlayer = null;
    this.practiceModePlayerSignature = "";
    this.practiceModePlayerSnapshot = null;
    this.activeEditorTab = "learningContent";
    this.stepDragState = null;
    this.boundStepDragMove = null;
    this.boundStepDragEnd = null;
    this.learningContentAutosaveTimer = null;
    this.learningContentAutosaveInFlight = false;
    this.learningContentAutosaveQueued = false;
    this.learningContentAutosaveDirty = false;
    this.learningContentLastSavedSignature = "";
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
          <button type="button" class="editor-tab-btn" data-tab="learningModes"><i class="fa-solid fa-route"></i> Lesson Paths</button>
          <button type="button" class="editor-tab-btn" data-tab="steps"><i class="fa-solid fa-shapes"></i> Learning Activities</button>
        </div>

        <!-- ── THREE-PANEL BODY ───────────────────────────────────── -->
        <div class="flex-1 overflow-hidden flex gap-4 p-4 min-h-0">

          <!-- LEFT: Module Structure -->
          <div class="flex-col shrink-0 min-h-0 flex" style="width:256px">
            <div class="course-structure-sidebar">
              <div class="course-structure-topbar">
                <div class="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em] flex items-center gap-1.5">
                  <i class="fa-solid fa-diagram-project text-gray-300"></i>
                  Module Structure
                </div>
              </div>
              <section class="course-structure-section course-structure-section-paths">
                <div class="course-structure-section-header">
                  <div class="course-structure-section-title">Lesson Paths</div>
                  <button id="addSessionBtn" class="course-structure-add-path-btn">
                    <i class="fa-solid fa-plus text-[10px]"></i> Add Path
                  </button>
                </div>
                <div id="sessionCreateStatusBanner" style="display:none" class="oqu-status-banner mb-2"></div>
                <div id="sessionList" class="course-structure-path-list">
                  ${buildSessionSkeletonCards(3)}
                </div>
              </section>
              <div id="moduleStructureDetails" class="course-structure-details">
                <div class="course-structure-idle">Select a path, then edit its learning activities.</div>
              </div>
              <div class="course-structure-footer">
                <div id="sessionCountText" class="course-structure-count">0 Paths</div>
              </div>
            </div>
          </div>

          <!-- CENTER: Student Preview -->
          <div class="flex-1 min-w-0 flex flex-col min-h-0">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 shrink-0 flex items-center justify-between gap-3">
                <div>
                  <div class="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em] flex items-center gap-1.5">
                    <i class="fa-solid fa-desktop text-gray-300"></i>
                    Student Preview
                  </div>
                  <div class="text-[11px] text-gray-400 font-semibold mt-1">Selected learning activity, desktop learner view</div>
                </div>
              </div>
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
                  Activity Settings
                </div>
              </div>
              <div id="configEditorPane" class="flex-1 overflow-y-auto p-5 min-h-0">
                <div class="text-xs text-gray-400 text-center py-10">Select a path or content section.</div>
              </div>
            </div>
          </div>

        </div>
        <div id="stepPreviewModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/70 p-6">
          <div class="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div class="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <div class="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Preview</div>
                <h2 id="stepPreviewModalTitle" class="mt-1 text-lg font-black text-slate-950">Student activity</h2>
              </div>
              <button type="button" class="close-step-preview-modal rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50">Close</button>
            </div>
            <div id="stepPreviewModalBody" class="max-h-[72vh] overflow-y-auto bg-slate-50 p-6"></div>
          </div>
        </div>
        ${buildAddPathModalHtml()}
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
      resetWorkspaceScroll();
    });

    // ── Add Lesson Path ───────────────────────────────────────────────
    document.getElementById("addSessionBtn").addEventListener("click", function () {
      openAddPathModal(moduleEditorStore.getState().learningModes);
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
        self.activeEditorTab = "learningModes";
        moduleEditorService.selectLearningMode(modeId);
      } else {
        moduleEditorService.selectSession(item.getAttribute("data-id"));
      }
    });

    // ── Workspace delegation (attached once) ───────────────────────────
    document.getElementById("workspaceContent").addEventListener("click", function (e) {
      self.handleWorkspaceClick(e);
    });

    document.getElementById("moduleStructureDetails").addEventListener("click", function (e) {
      self.handleWorkspaceClick(e);
    });

    document.getElementById("moduleStructureDetails").addEventListener("pointerdown", function (e) {
      self.handleStepDragPointerDown(e);
    });

    document.getElementById("workspaceContent").addEventListener("input", function (e) {
      var search = e.target.closest(".step-picker-search");
      if (search) {
        filterStepPicker(search.value);
      }

      if (e.target.closest("[data-learning-content-line-field]")) {
        updateLearningContentLineHidden(e.target.getAttribute("data-learning-content-line-field"));
      }

      if (isLearningContentInput(e.target)) {
        self.markLearningContentDirty("Unsaved changes");
        self.scheduleLearningContentAutosave();
      }
    });

    document.getElementById("workspaceContent").addEventListener("focusout", function (e) {
      if (isLearningContentInput(e.target)) {
        self.flushLearningContentAutosave();
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

    document.getElementById("stepPreviewModal").addEventListener("click", function (e) {
      if (e.target.id === "stepPreviewModal" || e.target.closest(".close-step-preview-modal")) {
        self.closeStepPreviewModal();
      }
    });

    document.getElementById("addPathModal").addEventListener("click", function (e) {
      var closeBtn = e.target.closest(".close-add-path-modal");
      var createBtn = e.target.closest(".create-learning-path-option-btn");

      if (closeBtn || e.target.id === "addPathModal") {
        closeAddPathModal();
        return;
      }

      if (createBtn) {
        self.createLearningPathFromButton(createBtn);
      }
    });
  }

  // ── Workspace click dispatcher ─────────────────────────────────────────

  createLearningPathFromButton(createPathOptionBtn) {
    var self = this;
    var pathType = createPathOptionBtn.getAttribute("data-path-type") || "custom";
    var pathMeta = readLearningPathOption(pathType);
    var originalPathOptionHtml = createPathOptionBtn.innerHTML;
    var banner = document.getElementById("sessionCreateStatusBanner");

    if (createPathOptionBtn.disabled || pathMeta.exists) {
      return;
    }

    createPathOptionBtn.disabled = true;
    createPathOptionBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating';
    showSessionBanner(banner, "creating", '<span class="oqu-spinner oqu-spinner-blue"></span> Creating lesson path...');
    moduleEditorService.createLearningMode(self.courseId, self.moduleId, {
      title: pathMeta.title,
      purpose: pathMeta.purpose,
      modeType: pathMeta.modeType
    }).then(function () {
      self.activeEditorTab = "learningModes";
      closeAddPathModal();
      showSessionBanner(banner, "success", '<span class="oqu-success-icon">&#10003;</span> Path created.');
      self.updateUi(moduleEditorStore.getState());
      setTimeout(function () {
        if (banner) {
          banner.style.display = "none";
        }
      }, 2000);
    }).catch(function (error) {
      showSessionBanner(banner, "error", "Create path failed: " + error.message);
    }).finally(function () {
      createPathOptionBtn.disabled = false;
      createPathOptionBtn.innerHTML = originalPathOptionHtml;
    });
  }

  handleWorkspaceClick(event) {
    var self = this;
    var state = moduleEditorStore.getState();
    var session = self.findSelectedSession(state);

    var addVocabularyPairBtn = event.target.closest(".add-vocabulary-pair-btn");
    if (addVocabularyPairBtn) {
      openVocabularyPairModal("");
      return;
    }

    var editVocabularyPairBtn = event.target.closest(".edit-vocabulary-pair-btn");
    if (editVocabularyPairBtn) {
      openVocabularyPairModal(editVocabularyPairBtn.getAttribute("data-index"));
      return;
    }

    var closeVocabularyPairBtn = event.target.closest(".close-vocabulary-pair-modal");
    if (closeVocabularyPairBtn || event.target.id === "vocabularyPairModal") {
      closeVocabularyPairModal();
      return;
    }

    var saveVocabularyPairBtn = event.target.closest(".save-vocabulary-pair-btn");
    if (saveVocabularyPairBtn) {
      saveVocabularyPairFromModal();
      self.markLearningContentDirty("Unsaved changes");
      self.scheduleLearningContentAutosave();
      return;
    }

    var removeVocabularyPairBtn = event.target.closest(".remove-vocabulary-pair-btn");
    if (removeVocabularyPairBtn) {
      removeVocabularyPair(removeVocabularyPairBtn.getAttribute("data-index"));
      self.markLearningContentDirty("Unsaved changes");
      self.scheduleLearningContentAutosave();
      return;
    }

    var addLearningContentLineBtn = event.target.closest(".add-learning-content-line-btn");
    if (addLearningContentLineBtn) {
      addLearningContentLine(addLearningContentLineBtn.getAttribute("data-field"));
      return;
    }

    var removeLearningContentLineBtn = event.target.closest(".remove-learning-content-line-btn");
    if (removeLearningContentLineBtn) {
      removeLearningContentLine(removeLearningContentLineBtn);
      self.markLearningContentDirty("Unsaved changes");
      self.scheduleLearningContentAutosave();
      return;
    }

    var saveLearningContentBtn = event.target.closest(".save-learning-content-btn");
    if (saveLearningContentBtn) {
      saveLearningContentBtn.disabled = true;
      saveLearningContentBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving';
      self.flushLearningContentAutosave().then(function () {
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        self.showLearningContentAutosaveStatus("error", "Error — Retry: " + error.message);
      }).finally(function () {
        saveLearningContentBtn.disabled = false;
        saveLearningContentBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Learning Content';
      });
      return;
    }

    var modeCard = event.target.closest(".learning-mode-card");
    if (modeCard && !event.target.closest("button")) {
      self.activeEditorTab = "learningModes";
      moduleEditorService.selectLearningMode(modeCard.getAttribute("data-mode-id"));
      return;
    }

    var editPathStepsBtn = event.target.closest(".edit-learning-path-steps-btn");
    if (editPathStepsBtn) {
      self.activeEditorTab = "steps";
      moduleEditorService.selectLearningMode(editPathStepsBtn.getAttribute("data-mode-id"));
      return;
    }

    var createPathOptionBtn = event.target.closest(".create-learning-path-option-btn");
    if (createPathOptionBtn) {
      self.createLearningPathFromButton(createPathOptionBtn);
      return;
    }

    var duplicateModeBtn = event.target.closest(".duplicate-learning-mode-btn");
    if (duplicateModeBtn) {
      moduleEditorService.duplicateLearningMode(this.courseId, this.moduleId, duplicateModeBtn.getAttribute("data-mode-id")).then(function () {
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        alert("Duplicate path failed: " + error.message);
      });
      return;
    }

    var renameModeBtn = event.target.closest(".rename-learning-mode-btn");
    if (renameModeBtn) {
      var renameModeId = renameModeBtn.getAttribute("data-mode-id");
      var currentMode = moduleEditorStore.getState().learningModes[renameModeId] || {};
      var nextTitle = prompt("Rename lesson path", readLearningPathTitle(currentMode, "Custom Path"));
      if (!nextTitle) {
        return;
      }
      moduleEditorService.renameLearningMode(this.courseId, this.moduleId, renameModeId, nextTitle, currentMode.purpose || "").then(function () {
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        alert("Rename path failed: " + error.message);
      });
      return;
    }

    var deleteModeBtn = event.target.closest(".delete-learning-mode-btn");
    if (deleteModeBtn) {
      if (!confirm("Delete this optional lesson path? Existing legacy step data will be kept for migration safety.")) {
        return;
      }
      moduleEditorService.deleteLearningMode(this.courseId, this.moduleId, deleteModeBtn.getAttribute("data-mode-id")).then(function () {
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        alert("Delete path failed: " + error.message);
      });
      return;
    }

    var generateModeBtn = event.target.closest(".generate-mode-from-primary-btn");
    if (generateModeBtn) {
      moduleEditorService.generateModeFromPrimary(this.courseId, this.moduleId).then(function () {
        self.updateUi(moduleEditorStore.getState());
      }).catch(function (error) {
        alert("Generate path failed: " + error.message);
      });
      return;
    }

    var pullContentBtn = event.target.closest(".pull-learning-content-btn");
    if (pullContentBtn) {
      moduleEditorService.pullLearningContent(this.courseId, this.moduleId, pullContentBtn.getAttribute("data-step-type"), pullContentBtn.getAttribute("data-source")).then(function (stepDraft) {
        var currentState = moduleEditorStore.getState();
        var currentSession = self.findSelectedSession(currentState);
        var currentStepId = currentState.selectedStepId;
        var currentModeKey = MAIN_PATH_PRACTICE_MODE_KEY;

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

    var stepLibraryBackBtn = event.target.closest(".step-library-back-btn");
    if (stepLibraryBackBtn) {
      renderStepPickerLibraryPanel(MAIN_PATH_PRACTICE_MODE_KEY);
      return;
    }

    var stepLibraryFilterChip = event.target.closest(".step-library-filter-chip");
    if (stepLibraryFilterChip) {
      toggleStepLibraryFilter(stepLibraryFilterChip);
      return;
    }

    var previewDockTemplateBtn = event.target.closest(".preview-dock-template-btn");
    if (previewDockTemplateBtn) {
      this.previewDockTemplate = normalizePreviewDockTemplate(previewDockTemplateBtn.getAttribute("data-template"));
      this.updateUi(moduleEditorStore.getState());
      return;
    }

    var previewDockDeviceBtn = event.target.closest(".preview-dock-device-btn");
    if (previewDockDeviceBtn) {
      this.previewDockDevice = normalizePreviewDockDevice(previewDockDeviceBtn.getAttribute("data-device"));
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

      this.openStepPreviewModal(previewStepId);
      return;
    }

    var closeStepPreviewBtn = event.target.closest(".close-step-preview-modal");
    if (closeStepPreviewBtn || event.target.id === "stepPreviewModal") {
      this.closeStepPreviewModal();
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
      if (state.isDraftSaving) {
        return;
      }

      var reorderStepId = reorderBtn.getAttribute("data-step-id");
      var direction = reorderBtn.getAttribute("data-direction");
      var practiceModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
      var orderedStepIds = createReorderedStepIds(session, practiceModeKey, reorderStepId, direction);

      if (orderedStepIds.length === 0) {
        return;
      }

      self.showEditorSaveStatus("saving", "Saving order...");
      moduleEditorService.reorderPracticeModeSteps(
        self.courseId, self.moduleId, session.id, practiceModeKey, orderedStepIds, reorderStepId, readSelectedModeId(state)
      ).then(function () {
        self.showEditorSaveStatus("success", "Saved");
      }).catch(function (error) {
        self.showEditorSaveStatus("error", "Could not save step order");
        self.updateUi(moduleEditorStore.getState());
      });
      return;
    }

    // Delete from a step tile
    var tileDeleteBtn = event.target.closest(".step-tile-delete-btn");
    if (tileDeleteBtn && session) {
      var deleteStepId = tileDeleteBtn.getAttribute("data-step-id");
      var deleteModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
      if (!confirm("Delete this step from the Main Path?")) {
        return;
      }
      var safeSelectedStepId = readSafeSelectedStepIdAfterDelete(session, deleteModeKey, deleteStepId, state.selectedStepId);
      tileDeleteBtn.textContent = "Deleting...";
      tileDeleteBtn.disabled = true;
      moduleEditorService.deletePracticeModeStep(
        self.courseId, self.moduleId, session.id, deleteModeKey, deleteStepId, readSelectedModeId(state), safeSelectedStepId
      ).catch(function (error) {
        tileDeleteBtn.textContent = "Delete";
        tileDeleteBtn.disabled = false;
        self.showEditorSaveStatus("error", "Could not delete step");
        self.updateUi(moduleEditorStore.getState());
      });
      return;
    }

    // Step tile click — selects a step
    var stepTile = event.target.closest(".step-tile");
    if (stepTile && !event.target.closest(".step-drag-handle") && !event.target.closest("button")) {
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

    var stepLibraryCard = event.target.closest(".step-library-step-card");
    if (stepLibraryCard) {
      renderStepPickerTemplatePanel(stepLibraryCard.getAttribute("data-type"));
      return;
    }

    // Step type option chosen — creates the step via ICF
    var stepOption = event.target.closest(".step-type-option");
    if (stepOption) {
      var stepType = stepOption.getAttribute("data-type");
      var activityTemplate = stepOption.getAttribute("data-activity-template") || "";
      var practiceModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
      var selectedModeId = readSelectedModeId(state);
      var courseContext = readCourseContext(state, self.courseId, self.moduleId, selectedModeId);
      var originalStepOptionHtml = stepOption.innerHTML;

      if (!courseContext.courseId || !courseContext.moduleId || !courseContext.modeId || !stepType) {
        alert("Cannot add step because course, module, or lesson path is missing.");
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
          practiceModeKey: practiceModeKey,
          activityTemplate: activityTemplate
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
      var practiceModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
      if (!confirm("Delete this step from the Main Path?")) {
        return;
      }
      var safeSelectedStepIdFromPreview = readSafeSelectedStepIdAfterDelete(session, practiceModeKey, stepId, state.selectedStepId);
      deleteBtn.textContent = "Deleting\u2026";
      deleteBtn.disabled = true;
      moduleEditorService.deletePracticeModeStep(
        self.courseId, self.moduleId, session.id, practiceModeKey, stepId, readSelectedModeId(state), safeSelectedStepIdFromPreview
      ).catch(function (error) {
        deleteBtn.textContent = "Delete";
        deleteBtn.disabled = false;
        self.showEditorSaveStatus("error", "Could not delete step");
        self.updateUi(moduleEditorStore.getState());
      });
      return;
    }

    // Repair Main Path backing shell
    var repairBtn = event.target.closest(".repair-practice-modes-btn");
    if (repairBtn && session) {
      repairBtn.textContent = "Repairing\u2026";
      repairBtn.disabled = true;
      moduleEditorService.repairSessionPracticeModes(
        self.courseId, self.moduleId, session.id
      ).catch(function (error) {
        repairBtn.textContent = "Repair Main Path";
        repairBtn.disabled = false;
        alert("Failed to repair: " + error.message);
      });
    }
  }

  handleStepDragPointerDown(event) {
    var handle = event.target.closest(".step-drag-handle");
    if (!handle) {
      return;
    }

    var tile = handle.closest(".step-tile");
    var list = handle.closest(".main-path-step-list");
    var state = moduleEditorStore.getState();
    var session = this.findSelectedSession(state);

    if (!tile || !list || !session || state.isDraftSaving) {
      return;
    }

    var stepId = tile.getAttribute("data-step-id");
    var originStepIds = readPracticeModeStepIds(session, MAIN_PATH_PRACTICE_MODE_KEY);

    if (originStepIds.indexOf(stepId) === -1) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.clearStepDropIndicator();

    this.stepDragState = {
      pointerId: event.pointerId,
      stepId: stepId,
      originStepIds: originStepIds,
      targetIndex: originStepIds.indexOf(stepId),
      listElement: list,
      tileElement: tile
    };

    tile.classList.add("is-dragging");
    list.classList.add("is-drop-active");

    this.boundStepDragMove = this.handleStepDragPointerMove.bind(this);
    this.boundStepDragEnd = this.handleStepDragPointerUp.bind(this);
    document.addEventListener("pointermove", this.boundStepDragMove);
    document.addEventListener("pointerup", this.boundStepDragEnd);
    document.addEventListener("pointercancel", this.boundStepDragEnd);
  }

  handleStepDragPointerMove(event) {
    if (!this.stepDragState || event.pointerId !== this.stepDragState.pointerId) {
      return;
    }

    event.preventDefault();
    var targetIndex = this.readStepDropIndex(event.clientY);
    this.stepDragState.targetIndex = targetIndex;
    this.renderStepDropIndicator(targetIndex);
  }

  handleStepDragPointerUp(event) {
    if (!this.stepDragState || event.pointerId !== this.stepDragState.pointerId) {
      return;
    }

    event.preventDefault();
    var dragState = this.stepDragState;
    var orderedStepIds = createDraggedStepOrder(dragState.originStepIds, dragState.stepId, dragState.targetIndex);
    var state = moduleEditorStore.getState();
    var session = this.findSelectedSession(state);

    this.cancelStepDrag();

    if (!session || orderedStepIds.length === 0) {
      return;
    }

    this.showEditorSaveStatus("saving", "Saving order...");
    moduleEditorService.reorderPracticeModeSteps(
      this.courseId,
      this.moduleId,
      session.id,
      MAIN_PATH_PRACTICE_MODE_KEY,
      orderedStepIds,
      dragState.stepId,
      readSelectedModeId(state)
    ).then(() => {
      this.showEditorSaveStatus("success", "Saved");
    }).catch(() => {
      this.showEditorSaveStatus("error", "Could not save step order");
      this.updateUi(moduleEditorStore.getState());
    });
  }

  cancelStepDrag() {
    if (this.stepDragState) {
      if (this.stepDragState.tileElement) {
        this.stepDragState.tileElement.classList.remove("is-dragging");
      }
      if (this.stepDragState.listElement) {
        this.stepDragState.listElement.classList.remove("is-drop-active");
      }
    }

    this.clearStepDropIndicator();

    if (this.boundStepDragMove) {
      document.removeEventListener("pointermove", this.boundStepDragMove);
    }

    if (this.boundStepDragEnd) {
      document.removeEventListener("pointerup", this.boundStepDragEnd);
      document.removeEventListener("pointercancel", this.boundStepDragEnd);
    }

    this.stepDragState = null;
    this.boundStepDragMove = null;
    this.boundStepDragEnd = null;
  }

  readStepDropIndex(clientY) {
    var dragState = this.stepDragState;
    var rows = dragState && dragState.listElement
      ? Array.prototype.slice.call(dragState.listElement.querySelectorAll(".step-tile[data-step-id]"))
      : [];
    var index = 0;

    while (index < rows.length) {
      var rect = rows[index].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        return index;
      }
      index = index + 1;
    }

    return rows.length;
  }

  renderStepDropIndicator(targetIndex) {
    var dragState = this.stepDragState;
    if (!dragState || !dragState.listElement) {
      return;
    }

    var indicator = dragState.listElement.querySelector(".step-drop-indicator");
    var rows = Array.prototype.slice.call(dragState.listElement.querySelectorAll(".step-tile[data-step-id]"));

    if (!indicator) {
      indicator = document.createElement("div");
      indicator.className = "step-drop-indicator";
    }

    if (targetIndex >= rows.length) {
      dragState.listElement.appendChild(indicator);
      return;
    }

    dragState.listElement.insertBefore(indicator, rows[targetIndex]);
  }

  clearStepDropIndicator() {
    var indicator = document.querySelector(".step-drop-indicator");
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }

  // ── Inspector click dispatcher ─────────────────────────────────────────

  handleInspectorClick(event) {
    var self = this;
    var state = moduleEditorStore.getState();
    var session = self.findSelectedSession(state);
    var propsPane = document.getElementById("configEditorPane");

    var appendCardBtn = event.target.closest(".append-card-line-btn");
    if (appendCardBtn && propsPane) {
      var cardsTextInput = propsPane.querySelector('.inspector-config-field[data-config-key="cardsText"]');
      if (cardsTextInput) {
        appendCardsTextLine(cardsTextInput);
      }
      return;
    }

    // Save lesson path details
    var savePathBtn = event.target.closest(".save-learning-path-btn");
    if (savePathBtn) {
      var selectedPathId = savePathBtn.getAttribute("data-mode-id") || readSelectedModeId(state);
      var titleInput = propsPane ? propsPane.querySelector(".inspector-path-title") : null;
      var purposeInput = propsPane ? propsPane.querySelector(".inspector-path-purpose") : null;
      var title = titleInput ? titleInput.value.trim() : "";
      var purpose = purposeInput ? purposeInput.value.trim() : "";

      if (!selectedPathId || !title) {
        alert("Add a path title before saving.");
        return;
      }

      savePathBtn.textContent = "Saving\u2026";
      savePathBtn.disabled = true;
      self.showEditorSaveStatus("saving", "Saving...");
      moduleEditorService.renameLearningMode(
        self.courseId, self.moduleId, selectedPathId, title, purpose
      ).then(function () {
        self.showEditorSaveStatus("success", "Saved");
        savePathBtn.textContent = "Saved \u2713";
        setTimeout(function () {
          savePathBtn.textContent = "Save Path Details";
          savePathBtn.disabled = false;
        }, 1400);
      }).catch(function (error) {
        self.showEditorSaveStatus("error", "Could not save changes");
        savePathBtn.textContent = "Save Path Details";
        savePathBtn.disabled = false;
        alert("Failed to save path: " + error.message);
      });
      return;
    }

    // Save Main Path backing shell
    var saveModeBtn = event.target.closest(".save-practice-mode-btn");
    if (saveModeBtn && session) {
      var practiceModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
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
          saveModeBtn.textContent = "Save Main Path";
          saveModeBtn.disabled = false;
        }, 1400);
      }).catch(function (error) {
        self.showEditorSaveStatus("error", "Could not save changes");
        saveModeBtn.textContent = "Save Main Path";
        saveModeBtn.disabled = false;
        alert("Failed to save Main Path: " + error.message);
      });
      return;
    }

    // Save step
    var saveStepBtn = event.target.closest(".save-practice-step-btn");
    if (saveStepBtn && session) {
      var practiceModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
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
    var activityTemplateInput = event.target.closest(".inspector-activity-template");
    if (activityTemplateInput) {
      syncActivityTemplateSelectedState(activityTemplateInput);
      this.handleInspectorInput(event);
      return;
    }

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
    var practiceModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
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
      activityTemplate: readActivityTemplateFromInspector(propsPane, stepTypeEl.getAttribute("data-step-type")),
      status: "draft",
      config: readStepConfigFromInspector(propsPane, stepTypeEl.getAttribute("data-step-type"), {})
    };
    if (readStepPreviewMode(mockStep.type) === "full") {
      previewCanvas.className = "oqu-preview-canvas oqu-preview-canvas-full";
    } else {
      previewCanvas.className = "oqu-preview-canvas";
    }
    previewCanvas.innerHTML = '<div class="oqu-preview-toolbar">'
      + '<button type="button" class="student-view-btn oqu-student-view-btn">▶ Preview</button>'
      + '</div>'
      + buildLiveStudentPreviewDock(mockStep, this.previewDockTemplate, this.previewDockDevice)
      + this.buildStepPreviewCard(mockStep);
    this.renderInlineStepPreviewFromStep(mockStep);
  }

  movePlaytestStep(direction) {
    var state = moduleEditorStore.getState();
    var session = this.findSelectedSession(state);
    var practiceModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
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
    var practiceModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
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
        'Loading\u2026 <span class="text-gray-300 mx-1">/</span> Lesson Paths';
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

  markLearningContentDirty(message) {
    this.learningContentAutosaveDirty = true;
    this.showLearningContentAutosaveStatus("dirty", message || "Unsaved changes");
  }

  scheduleLearningContentAutosave() {
    var self = this;

    if (this.activeEditorTab !== "learningContent") {
      return;
    }

    if (this.learningContentAutosaveTimer) {
      clearTimeout(this.learningContentAutosaveTimer);
    }

    this.learningContentAutosaveTimer = setTimeout(function () {
      self.flushLearningContentAutosave().catch(function () {});
    }, 1000);
  }

  flushLearningContentAutosave() {
    if (this.learningContentAutosaveTimer) {
      clearTimeout(this.learningContentAutosaveTimer);
      this.learningContentAutosaveTimer = null;
    }

    return this.runLearningContentAutosave();
  }

  runLearningContentAutosave() {
    var self = this;
    var learningContent = null;
    var validation = null;
    var signature = "";

    if (this.activeEditorTab !== "learningContent") {
      return Promise.resolve();
    }

    if (this.learningContentAutosaveInFlight) {
      this.learningContentAutosaveQueued = true;
      return Promise.resolve();
    }

    learningContent = readLearningContentFromWorkspace();
    validation = validateLearningContentForAutosave(learningContent);

    if (!validation.valid) {
      this.showLearningContentAutosaveStatus("error", validation.message);
      return Promise.resolve();
    }

    signature = JSON.stringify(learningContent);
    if (!this.learningContentAutosaveDirty && signature === this.learningContentLastSavedSignature) {
      this.showLearningContentAutosaveStatus("saved", "Saved");
      return Promise.resolve();
    }

    this.learningContentAutosaveInFlight = true;
    this.learningContentAutosaveDirty = false;
    this.showLearningContentAutosaveStatus("saving", "Saving...");
    this.showEditorSaveStatus("saving", "Saving...");

    return moduleEditorService.saveLearningContent(this.courseId, this.moduleId, learningContent).then(function () {
      self.learningContentLastSavedSignature = signature;
      self.showLearningContentAutosaveStatus("saved", "Saved");
      self.showEditorSaveStatus("success", "Saved");
    }).catch(function (error) {
      self.learningContentAutosaveDirty = true;
      self.showEditorSaveStatus("error", "Could not save changes");
      self.showLearningContentAutosaveStatus("error", "Error — Retry: " + error.message);
      throw error;
    }).finally(function () {
      self.learningContentAutosaveInFlight = false;
      if (self.learningContentAutosaveQueued) {
        self.learningContentAutosaveQueued = false;
        self.scheduleLearningContentAutosave();
      }
    });
  }

  showLearningContentAutosaveStatus(type, message) {
    var status = document.getElementById("learningContentAutosaveStatus");
    var safeType = type || "saved";

    if (!status) {
      return;
    }

    status.textContent = message || "Saved";
    status.setAttribute("data-status", safeType);
    status.className = "rounded-2xl border px-3 py-2 text-xs font-black";

    if (safeType === "error") {
      status.className += " border-red-100 bg-red-50 text-red-700";
    } else if (safeType === "saving") {
      status.className += " border-amber-100 bg-amber-50 text-amber-700";
    } else if (safeType === "dirty") {
      status.className += " border-sky-100 bg-sky-50 text-sky-700";
    } else {
      status.className += " border-emerald-100 bg-emerald-50 text-emerald-700";
    }
  }

  renderSessionList(state) {
    var el = document.getElementById("sessionList");
    var sessions = state.sessions || [];
    var learningModes = createLearningModeList(state.learningModes, sessions);
    var selectedModeId = readSelectedModeId(state);
    var countEl = document.getElementById("sessionCountText");
    if (countEl) {
      countEl.textContent = learningModes.length + " Path" + (learningModes.length === 1 ? "" : "s");
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
      var title = readLearningPathTitle(mode, "Lesson Path");
      var status = readString(mode.status, "draft");
      var meta = readLearningPathMeta(mode);
      var wrapperClass = "course-path-card session-item" + (isSelected ? " is-selected" : "");
      html += '<div class="' + wrapperClass + '" data-id="' + (mode.legacySessionId || "") + '" data-mode-id="' + mode.id + '">';
      html += '<div class="course-path-icon course-path-icon-' + readStructureClassSuffix(meta.pathType || "custom") + '">' + readLearningModeIcon(mode) + '</div>';
      html += '<div class="course-path-card-copy">';
      html += '<div class="course-path-card-title">' + escapeHtml(title) + '</div>';
      html += '<div class="course-path-card-meta">' + buildStructureStatusBadge(status) + (mode.required ? buildStructureMetaBadge("Required", "required") : '') + '</div>';
      html += '</div>';
      html += '</div>';
      i = i + 1;
    }
    el.innerHTML = html;
  }

  renderSessionDetails(state) {
    var workspace = document.getElementById("workspaceContent");
    var propsPane = document.getElementById("configEditorPane");
    var structurePane = document.getElementById("moduleStructureDetails");
    var session = this.findSelectedSession(state);
    var selectedLearningMode = this.findSelectedLearningMode(state);

    logModeSelection(state, this.activeEditorTab, selectedLearningMode);

    if (this.activeEditorTab === "learningContent") {
      if (structurePane) {
        structurePane.innerHTML = buildModuleStructureIdleHtml("Open Learning Activities to edit this module's path activities.");
      }
      workspace.innerHTML = buildLearningContentWorkspace(state.learningContent);
      this.learningContentLastSavedSignature = JSON.stringify(readLearningContentFromWorkspace());
      propsPane.innerHTML = buildLearningContentInspector(state.learningContent);
      return;
    }

    if (this.activeEditorTab === "learningModes") {
      if (structurePane) {
        structurePane.innerHTML = buildModuleStructureIdleHtml("Choose a lesson path, then edit its learning activities.");
      }
      workspace.innerHTML = buildLearningModesWorkspace(state.learningModes, state.sessions, readSelectedModeId(state));
      propsPane.innerHTML = selectedLearningMode
        ? buildSelectedLearningModeInspector(selectedLearningMode, this.activeEditorTab)
        : buildLearningModesInspector();
      return;
    }

    if (!session) {
      if (structurePane) {
        structurePane.innerHTML = buildModuleStructureIdleHtml("Create or select a lesson path to add learning activities.");
      }
      workspace.innerHTML = '<div class="flex items-center justify-center min-h-full p-12">' + buildModeReadyEmptyHtml(selectedLearningMode) + '</div>';
      propsPane.innerHTML = selectedLearningMode
        ? buildSelectedLearningModeInspector(selectedLearningMode, this.activeEditorTab)
        : '<div class="text-xs text-gray-400 text-center py-10">Select a lesson path to inspect properties.</div>';
      return;
    }

    var selectedPracticeModeKey = MAIN_PATH_PRACTICE_MODE_KEY;
    var renderSession = createRenderableSession(session, selectedLearningMode, selectedPracticeModeKey);
    var practiceModes = readPracticeModes(renderSession);
    var selectedMode = practiceModes[selectedPracticeModeKey];
    var effectiveStepId = getEffectiveStepId(selectedMode, state.selectedStepId);

    if (!effectiveStepId && !this.practiceModePlaytestMode) {
      this.studentPreviewMode = false;
    }

    if (structurePane) {
      structurePane.innerHTML = this.buildModuleStructureDetails(renderSession, state, selectedPracticeModeKey, selectedMode, effectiveStepId);
    }

    workspace.innerHTML = this.buildWorkspaceHtml(renderSession, state, selectedPracticeModeKey, selectedMode, effectiveStepId);
    if (this.practiceModePlaytestMode) {
      propsPane.innerHTML = this.buildPracticeModePlaytestInspector(renderSession, selectedPracticeModeKey);
    } else if (this.studentPreviewMode && effectiveStepId) {
      propsPane.innerHTML = this.buildStudentPreviewInspector(renderSession, selectedPracticeModeKey, effectiveStepId);
    } else {
      propsPane.innerHTML = this.buildInspectorHtml(renderSession, state, selectedPracticeModeKey, selectedMode, effectiveStepId);
    }

    if (this.practiceModePlaytestMode) {
      this.renderPracticeModePlaytest(renderSession, selectedPracticeModeKey);
    } else if (this.studentPreviewMode && effectiveStepId) {
      this.renderStudentPreview(renderSession, selectedPracticeModeKey, effectiveStepId);
    } else {
      this.renderInlineStepPreview(renderSession, selectedPracticeModeKey, effectiveStepId);
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
    html += '<div class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Module Structure</div>';
    html += '<div class="text-sm font-bold text-gray-900 truncate">' + escapeHtml(title) + '</div>';
    html += '</div>';
    html += buildStatusPill(status);
    html += '</div>';

    // ── Repair banner ────────────────────────────────────────────────
    if (!hasPracticeModes) {
      html += '<div class="mx-5 mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 flex items-start gap-3">';
      html += '<i class="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5 shrink-0 text-sm"></i>';
      html += '<div class="flex-1">';
      html += '<div class="text-xs font-bold text-amber-900 mb-1">Main Path not initialized</div>';
      html += '<div class="text-[11px] text-amber-700 mb-2">This legacy mode predates the stored step shell used by Main Path.</div>';
      html += '<button class="repair-practice-modes-btn text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-lg transition">Repair Main Path</button>';
      html += '</div>';
      html += '</div>';
    }

    // ── Preview canvas ───────────────────────────────────────────────
    html += this.buildPreviewCanvasHtml(selectedMode, effectiveStepId);

    if (this.stepPickerOpen) {
      html += buildStepPickerModal(selectedPracticeModeKey);
    }

    return html;
  }

  buildModuleStructureDetails(session, state, selectedPracticeModeKey, selectedMode, effectiveStepId) {
    var selectedLearningMode = this.findSelectedLearningMode(state);
    var pathTitle = readLearningPathTitle(selectedLearningMode, readLocalizedText(session.title, "Lesson Path"));
    var pathStatus = readString(selectedLearningMode && selectedLearningMode.status, readString(selectedMode && selectedMode.status, "draft"));
    var stepCount = readStepCount(selectedMode);
    var html = "";

    html += '<div class="course-structure-details-inner">';
    html += '<section class="course-structure-section">';
    html += '<div class="course-structure-section-header">';
    html += '<div class="course-structure-section-title">Current Path</div>';
    html += '</div>';
    html += '<div class="current-path-card">';
    html += '<div class="current-path-copy">';
    html += '<div class="current-path-title">' + escapeHtml(pathTitle) + '</div>';
    html += '<div class="current-path-meta">Ordered Step List · ' + stepCount + ' step' + (stepCount === 1 ? '' : 's') + '</div>';
    html += '</div>';
    html += '<div class="current-path-badges">' + buildStructureStatusBadge(pathStatus) + (selectedLearningMode && selectedLearningMode.required ? buildStructureMetaBadge("Required", "required") : '') + '</div>';
    html += '</div>';
    html += '</section>';
    html += this.buildStructureStepList(selectedMode, effectiveStepId, selectedPracticeModeKey);
    html += '</div>';

    return html;
  }

  buildStructureStepList(mode, effectiveStepId, practiceModeKey) {
    var safeMode = mode || {};
    var steps = readSortedSteps(safeMode.steps);
    var html = "";
    var stepIndex = 0;

    html += '<section class="course-structure-section course-structure-steps-section">';
    html += '<div class="course-structure-section-header">';
    html += '<div class="min-w-0">';
    html += '<div class="course-structure-section-title">Steps</div>';
    html += '<div class="course-structure-section-subtitle">' + steps.length + ' ordered item' + (steps.length === 1 ? '' : 's') + '</div>';
    html += '</div>';
    html += '<button type="button" class="add-step-trigger-btn course-structure-add-step-btn" data-key="' + practiceModeKey + '">';
    html += '<i class="fa-solid fa-plus text-[9px]"></i> Add Step';
    html += '</button>';
    html += '</div>';

    if (steps.length === 0) {
      html += '<div class="course-structure-empty-card">';
      html += '<div class="course-structure-empty-title">No steps yet</div>';
      html += '<div class="course-structure-empty-copy">Add the first student activity for this path.</div>';
      html += '</div>';
      html += '</section>';
      return html;
    }

    html += '<div class="main-path-step-list">';
    while (stepIndex < steps.length) {
      var step = steps[stepIndex];
      var stepId = readStepId(step, "");
      var stepTitle = readLocalizedText(step.title, "New Step");
      var stepType = readStepType(step);
      var stepStatus = readString(step.status, "draft");
      var isActive = effectiveStepId === stepId;
      var upDisabled = stepIndex === 0 ? " disabled" : "";
      var downDisabled = stepIndex === steps.length - 1 ? " disabled" : "";
      var tileClass = "step-tile main-path-step-tile" + (isActive ? " is-selected" : "");

      html += '<div class="' + tileClass + '" data-step-id="' + stepId + '">';
      html += '<button type="button" class="step-drag-handle" data-step-id="' + stepId + '" aria-label="Drag step to reorder" title="Drag to reorder">';
      html += '<span></span><span></span><span></span><span></span><span></span><span></span>';
      html += '</button>';
      html += '<span class="structure-step-number">' + (stepIndex + 1) + '</span>';
      html += '<div class="structure-step-copy">';
      html += '<div class="structure-step-title">' + escapeHtml(stepTitle) + '</div>';
      html += '<div class="structure-step-meta">' + escapeHtml(readStepTypeLabel(stepType)) + '</div>';
      html += '<div class="structure-step-badges">' + buildStructureStatusBadge(stepStatus) + '</div>';
      html += '</div>';
      html += '<div class="structure-step-actions">';
      html += '<button type="button" class="step-reorder-btn structure-step-icon-btn" data-step-id="' + stepId + '" data-direction="up"' + upDisabled + ' title="Move up" aria-label="Move step up"><i class="fa-solid fa-arrow-up"></i></button>';
      html += '<button type="button" class="step-reorder-btn structure-step-icon-btn" data-step-id="' + stepId + '" data-direction="down"' + downDisabled + ' title="Move down" aria-label="Move step down"><i class="fa-solid fa-arrow-down"></i></button>';
      html += '<button type="button" class="preview-step-btn structure-step-preview-btn" data-step-id="' + stepId + '" title="Preview step"><i class="fa-solid fa-play"></i></button>';
      html += '<button type="button" class="step-tile-delete-btn structure-step-delete-btn" data-step-id="' + stepId + '" title="Delete step"><i class="fa-solid fa-trash-can"></i></button>';
      html += '</div>';
      html += '</div>';

      stepIndex = stepIndex + 1;
    }
    html += '</div>';
    html += '</section>';

    return html;
  }

  buildStepNavigationArea(mode, effectiveStepId, practiceModeKey) {
    var steps = readSortedSteps(mode.steps);
    var html = "";

    html += '<div class="px-5 pb-2">';
    html += '<div class="flex items-center justify-between mb-2">';
    html += '<div class="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">';
    html += '<i class="fa-solid fa-list-check text-gray-300"></i>';
    html += 'Main Path — Ordered Step List';
    html += '</div>';

    html += '<div class="flex items-center gap-1.5">';
    html += '<button type="button" class="play-practice-mode-btn border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-[10px] transition flex items-center gap-1" data-key="' + practiceModeKey + '">';
    html += '▶ Student Preview';
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
      emptyHtml += '<div class="text-sm font-bold text-gray-700 mb-1.5">No steps yet</div>';
      emptyHtml += '<div class="text-xs text-gray-400 leading-relaxed mb-5">Start the Main Path by adding your first activity.</div>';
      emptyHtml += '<button type="button" class="add-step-trigger-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition" data-key="' + MAIN_PATH_PRACTICE_MODE_KEY + '">+ Add Step</button>';
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
    var dockClass = readPreviewDockFrameClass(this.previewDockDevice);
    var html = '<div class="' + canvasClass + '" id="step-preview-canvas">';
    html += '<div class="oqu-preview-toolbar">';
    html += '<button type="button" class="preview-step-btn oqu-student-view-btn" data-step-id="' + readStepId(selectedStep, "") + '"><i class="fa-solid fa-play"></i> Preview</button>';
    html += '</div>';
    html += buildLiveStudentPreviewDock(selectedStep, this.previewDockTemplate, this.previewDockDevice);
    html += '<div class="' + dockClass + '">';
    html += this.buildStepPreviewCard(selectedStep);
    html += '</div>';
    html += '</div>';
    return html;
  }

  buildStepPreviewCard(step) {
    var stepType = readStepType(step);
    var title = readLocalizedText(step.title, "New Step");
    var instructions = readLocalizedText(step.instructions, "");
    var stepId = readStepId(step, "");
    var config = createStepRenderConfig(step);
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

    } else if (StepTypeDefinition && typeof StepTypeDefinition.renderPlayer === "function") {
      return this.buildInlineRenderedStepPreviewCard(step);
    } else if (StepTypeDefinition && typeof StepTypeDefinition.renderShell === "function") {
      inner += StepTypeDefinition.renderShell(config);
    } else {
      // Unknown / unsupported step type
      var safeType = stepType ? escapeHtml(stepType) : "unknown";
      inner += '<div class="oqu-preview-type-badge">🔷 ' + safeType + '</div>';
      inner += '<div class="text-xs font-bold text-amber-700 mb-2">Step type ' + safeType + ' is not registered with the preview renderer.</div>';
      inner += '<div class="text-xs text-gray-500 mb-2">The saved step is preserved so a developer can register or repair it.</div>';
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

  buildInlineRenderedStepPreviewCard(step) {
    var stepId = readStepId(step, "");
    var html = "";

    html += '<div class="oqu-preview-card oqu-step-render-preview-card">';
    html += '<div id="inline-step-preview-render-target" class="oqu-inline-step-preview-target" data-step-id="' + escapeHtml(stepId) + '"></div>';

    if (stepId && stepId !== "preview") {
      html += '<div class="border-t border-gray-100 mt-4 pt-3 flex justify-end">';
      html += '<button type="button" class="delete-step-btn text-[10px] text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg font-bold transition" data-step-id="' + stepId + '">Delete Step</button>';
      html += '</div>';
    }

    html += '</div>';

    return html;
  }

  renderInlineStepPreview(session, practiceModeKey, stepId) {
    var step = findPracticeModeStep(session, practiceModeKey, stepId);

    this.renderInlineStepPreviewFromStep(step);
  }

  renderInlineStepPreviewFromStep(step) {
    var target = document.getElementById("inline-step-preview-render-target");
    var StepTypeDefinition = getStepTypeDefinition(readStepType(step));

    if (!target || !StepTypeDefinition || typeof StepTypeDefinition.renderPlayer !== "function") {
      return;
    }

    try {
      StepTypeDefinition.renderPlayer(target, createStepRenderConfig(step), {
        onComplete: function (completionResult) {
          console.info("[OquWay] Editor preview step completed:", completionResult);
        }
      });
    } catch (error) {
      target.innerHTML = buildUnsupportedStudentPreview(step);
      console.warn("[OquWay] Editor preview renderer failed.", {
        stepType: readStepType(step),
        error: error && error.message ? error.message : String(error)
      });
    }
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
    html += '<div class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Preview</div>';
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
        StepTypeDefinition.renderPlayer(playerBody, createStepRenderConfig(step), {
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
    var stepTitle = readLocalizedText(step.title, "Selected Step");
    var stepType = readStepTypeLabel(readStepType(step));
    var html = "";

    html += '<div class="oqu-inspector-section">Preview</div>';
    html += '<div class="rounded-xl border border-blue-100 bg-blue-50 p-3 mb-4">';
    html += '<div class="text-xs font-bold text-blue-900 mb-1">Previewing one selected step</div>';
    html += '<div class="text-[11px] text-blue-700 leading-relaxed">Editor controls are hidden in the center canvas. Use Back to Editor to return to editing.</div>';
    html += '</div>';
    html += '<div class="oqu-inspector-readonly-label">Path</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">Main Path</div>';
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
    html += '<div class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Main Path Playtest</div>';
    html += '<div class="text-sm font-bold text-gray-900 truncate">' + escapeHtml(modeTitle) + '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="oqu-student-preview-canvas oqu-playtest-canvas">';
    html += '<div class="oqu-playtest-empty">';
    html += '<div class="text-4xl mb-4">📚</div>';
    html += '<div class="text-lg font-black text-gray-900 mb-2">No activities to play yet</div>';
    html += '<div class="text-sm text-gray-500 leading-relaxed mb-5">Add steps to the Main Path, then come back here to test the learner flow from start to finish.</div>';
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
    html += '<div class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Main Path Playtest</div>';
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
    html += '<div class="text-xl font-black text-gray-950 mb-2">Main Path complete</div>';
    html += '<div class="text-sm text-gray-500 leading-relaxed mb-6">The full learner preview ran through every step in the Main Path.</div>';
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
    html += '<div class="text-xs font-bold text-emerald-900 mb-1">Previewing the full Main Path</div>';
    html += '<div class="text-[11px] text-emerald-700 leading-relaxed">This is editor-only. It does not save student progress.</div>';
    html += '</div>';
    html += '<div class="oqu-inspector-readonly-label">Path</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">Main Path</div>';
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
    html += '<div class="mb-4">';
    html += '<div class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">' + escapeHtml(sessionTitle) + '</div>';
    html += '<div class="text-[10px] font-bold text-blue-600">Main Path</div>';
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
    var activityTemplate = readStepActivityTemplate(step, stepType);

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

    html += buildActivityTemplateSelector(stepType, activityTemplate);

    html += this.buildStepConfigInspector(step);

    if (supportsLearningContentPull(stepType)) {
      html += '<button type="button" class="pull-learning-content-btn w-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 rounded-lg text-xs transition mb-2" data-step-type="' + stepType + '" data-source="vocabulary">';
      html += '<i class="fa-solid fa-wand-magic-sparkles"></i> Pull From Learning Content';
      html += '</button>';
    }

    html += buildStepQualityInspector(step);

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

    if (schemaHasSections(schema.fields)) {
      html += buildSectionedStepConfigFields(schema.fields, config);
    } else {
      while (fieldIndex < schema.fields.length) {
        html += buildStepConfigField(schema.fields[fieldIndex], config);
        fieldIndex = fieldIndex + 1;
      }
    }

    return html;
  }

  openStepPreviewModal(stepId) {
    var state = moduleEditorStore.getState();
    var selectedMode = this.findSelectedLearningMode(state);
    var steps = selectedMode && Array.isArray(selectedMode.steps) ? readSortedSteps(selectedMode.steps) : [];
    var step = findStepByIdInList(steps, stepId);
    var modal = document.getElementById("stepPreviewModal");
    var body = document.getElementById("stepPreviewModalBody");
    var title = document.getElementById("stepPreviewModalTitle");

    if (!modal || !body || !step) {
      alert("Select a saved step before opening preview.");
      return;
    }

    if (title) {
      title.textContent = readLocalizedText(step.title, "Student activity");
    }

    body.innerHTML = '<div class="mx-auto max-w-xl">' + this.buildStepPreviewCard(step) + '</div>';
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  closeStepPreviewModal() {
    var modal = document.getElementById("stepPreviewModal");

    if (!modal) {
      return;
    }

    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  buildPracticeModeInspector(mode, session, practiceModeKey) {
    var status = readString(mode.status, "shell");
    var steps = readSortedSteps(mode.steps);
    var sessionTitle = readLocalizedText(session.title, "Learning Mode");
    var html = "";

    html += '<div class="oqu-inspector-section">Main Path</div>';
    html += '<div class="oqu-inspector-readonly-label">Module</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(sessionTitle) + '</div>';
    html += '<div class="oqu-inspector-readonly-label">Structure</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">Ordered Step List</div>';
    html += '<div class="oqu-inspector-readonly-label">Status</div>';
    html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(status) + '</div>';
    html += '<div class="oqu-inspector-readonly-label">Steps</div>';
    html += '<div class="oqu-inspector-readonly-value mb-4">' + steps.length + '</div>';
    html += '<button type="button" class="add-step-trigger-btn w-full border border-dashed border-blue-300 bg-white hover:bg-blue-50 text-blue-600 font-bold py-2 rounded-lg text-xs transition" data-key="' + MAIN_PATH_PRACTICE_MODE_KEY + '">';
    html += '<i class="fa-solid fa-plus text-[10px]"></i> Add Step';
    html += '</button>';

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
    var stepType = readStepType(currentStep);

    return {
      id: stepId,
      type: stepType,
      title: createLocalizedTitle(currentStep.title, titleInput ? titleInput.value : ""),
      instructions: createLocalizedTitle(currentStep.instructions, instrInput ? instrInput.value : ""),
      config: readStepConfigFromInspector(propsPane, stepType, readStepConfig(currentStep)),
      activityTemplate: readActivityTemplateFromInspector(propsPane, stepType),
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

function createDraggedStepOrder(originStepIds, draggedStepId, targetIndex) {
  var originalOrder = Array.isArray(originStepIds) ? originStepIds.slice() : [];
  var currentIndex = originalOrder.indexOf(draggedStepId);
  var insertIndex = targetIndex;
  var nextOrder = [];

  if (currentIndex === -1) {
    return [];
  }

  if (insertIndex > currentIndex) {
    insertIndex = insertIndex - 1;
  }

  if (insertIndex < 0) {
    insertIndex = 0;
  }

  originalOrder.forEach(function (stepId) {
    if (stepId !== draggedStepId) {
      nextOrder.push(stepId);
    }
  });

  if (insertIndex > nextOrder.length) {
    insertIndex = nextOrder.length;
  }

  nextOrder.splice(insertIndex, 0, draggedStepId);

  if (areStepOrdersEqual(originalOrder, nextOrder)) {
    return [];
  }

  return nextOrder;
}

function areStepOrdersEqual(firstOrder, secondOrder) {
  if (firstOrder.length !== secondOrder.length) {
    return false;
  }

  var index = 0;
  while (index < firstOrder.length) {
    if (firstOrder[index] !== secondOrder[index]) {
      return false;
    }
    index = index + 1;
  }

  return true;
}

function readPracticeModeStepIds(session, practiceModeKey) {
  var practiceModes = readPracticeModes(session);
  var practiceMode = practiceModes[practiceModeKey];
  var steps = readSortedSteps(practiceMode.steps);

  return steps.map(function (step) {
    return readStepId(step, "");
  }).filter(function (stepId) {
    return stepId.length > 0;
  });
}

function readSafeSelectedStepIdAfterDelete(session, practiceModeKey, deletedStepId, currentSelectedStepId) {
  var orderedStepIds = readPracticeModeStepIds(session, practiceModeKey);
  var deletedIndex = orderedStepIds.indexOf(deletedStepId);
  var remainingStepIds = orderedStepIds.filter(function (stepId) {
    return stepId !== deletedStepId;
  });

  if (currentSelectedStepId && currentSelectedStepId !== deletedStepId && remainingStepIds.indexOf(currentSelectedStepId) !== -1) {
    return currentSelectedStepId;
  }

  if (remainingStepIds.length === 0) {
    return "";
  }

  if (deletedIndex >= 0 && deletedIndex < remainingStepIds.length) {
    return remainingStepIds[deletedIndex];
  }

  return remainingStepIds[remainingStepIds.length - 1];
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

function buildStructureStatusBadge(status) {
  var safeStatus = typeof status === "string" && status.trim() ? status.trim().toLowerCase() : "draft";
  return '<span class="structure-mini-badge structure-mini-badge-status structure-mini-badge-' + readStructureClassSuffix(safeStatus) + '">' + escapeHtml(safeStatus) + '</span>';
}

function buildStructureMetaBadge(label, type) {
  return '<span class="structure-mini-badge structure-mini-badge-' + readStructureClassSuffix(type || "meta") + '">' + escapeHtml(label) + '</span>';
}

function readStructureClassSuffix(value) {
  return String(value || "meta").toLowerCase().replace(/[^a-z0-9_-]/g, "-");
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
        message: "Step type " + stepType + " is not registered with the preview renderer."
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
    + '<div class="text-sm font-bold text-gray-700 mb-1">No lesson path selected</div>'
    + '<div class="text-xs text-gray-400 leading-relaxed">Click a mode on the left to start designing its activities.</div>'
    + '</div>';
}

function buildModeReadyEmptyHtml(mode) {
  if (!mode) {
    return buildEmptyNoSessionHtml();
  }

  var title = readLocalizedText(mode.title, "Learning Mode");
  var isPrimary = mode.id === "primary" || mode.modeType === "primary";
  var headline = isPrimary ? "Main Path is ready. Add your first step." : title + " is ready. Add your first step.";

  return '<div class="text-center max-w-[280px]">'
    + '<div class="text-4xl mb-3">📚</div>'
    + '<div class="text-sm font-bold text-gray-700 mb-1">' + escapeHtml(headline) + '</div>'
    + '<div class="text-xs text-gray-400 leading-relaxed mb-5">This mode has no step shell yet. Preparing it will keep the selected mode active and open the step picker.</div>'
    + '<button type="button" class="create-mode-shell-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition">Add Step</button>'
    + '</div>';
}

function buildListEmptyState() {
  return '<div class="course-structure-empty-card">'
    + '<div class="course-structure-empty-title">No paths yet</div>'
    + '<div class="course-structure-empty-copy">Add a lesson path to start building this module.</div>'
    + '</div>';
}

function buildLiveStudentPreviewDock(step, template, device) {
  var safeTemplate = normalizePreviewDockTemplate(template);
  var safeDevice = normalizePreviewDockDevice(device);
  var stepType = readStepType(step);
  var stepTitle = readLocalizedText(step && step.title, "Step Preview");
  var html = "";

  html += '<section class="mb-4 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">';
  html += '<div class="flex items-center justify-between gap-3">';
  html += '<div class="min-w-0"><div class="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Live Student Preview Dock</div><div class="mt-1 truncate text-sm font-black text-slate-950">' + escapeHtml(stepTitle) + '</div><div class="mt-0.5 text-[11px] font-semibold text-slate-500">' + escapeHtml(readStepTypeLabel(stepType)) + '</div></div>';
  html += '<div class="flex flex-wrap justify-end gap-2">';
  html += buildPreviewDockButton("template", "basic", "Basic", safeTemplate === "basic");
  html += buildPreviewDockButton("template", "adventurePath", "Path", safeTemplate === "adventurePath");
  html += buildPreviewDockButton("template", "compactGrid", "Grid", safeTemplate === "compactGrid");
  html += '<span class="mx-1 h-8 w-px bg-slate-100"></span>';
  html += buildPreviewDockButton("device", "desktop", "Desktop", safeDevice === "desktop");
  html += buildPreviewDockButton("device", "tablet", "Tablet", safeDevice === "tablet");
  html += buildPreviewDockButton("device", "mobile", "Mobile", safeDevice === "mobile");
  html += '</div>';
  html += '</div>';
  html += '<div class="mt-3 grid gap-2 sm:grid-cols-3">';
  html += '<div class="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600">Template: ' + escapeHtml(readPreviewDockTemplateLabel(safeTemplate)) + '</div>';
  html += '<div class="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600">Device: ' + escapeHtml(readPreviewDockDeviceLabel(safeDevice)) + '</div>';
  html += '<div class="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600">Renderer: current step</div>';
  html += '</div>';
  html += '</section>';
  return html;
}

function buildPreviewDockButton(kind, value, label, active) {
  var className = active
    ? "bg-blue-600 text-white border-blue-600"
    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
  var classPrefix = kind === "template" ? "preview-dock-template-btn" : "preview-dock-device-btn";
  var dataAttr = kind === "template" ? "data-template" : "data-device";

  return '<button type="button" class="' + classPrefix + ' rounded-xl border px-3 py-2 text-[10px] font-black transition ' + className + '" ' + dataAttr + '="' + escapeHtml(value) + '">' + escapeHtml(label) + '</button>';
}

function normalizePreviewDockTemplate(value) {
  if (value === "adventurePath" || value === "compactGrid") {
    return value;
  }

  return "basic";
}

function normalizePreviewDockDevice(value) {
  if (value === "mobile" || value === "tablet") {
    return value;
  }

  return "desktop";
}

function readPreviewDockFrameClass(device) {
  if (device === "mobile") {
    return "mx-auto max-w-[390px] rounded-[28px] border border-slate-200 bg-slate-50 p-3 shadow-inner";
  }

  if (device === "tablet") {
    return "mx-auto max-w-[720px] rounded-[28px] border border-slate-200 bg-slate-50 p-3 shadow-inner";
  }

  return "mx-auto max-w-none";
}

function readPreviewDockTemplateLabel(template) {
  if (template === "adventurePath") {
    return "Adventure Path";
  }

  if (template === "compactGrid") {
    return "Compact Grid";
  }

  return "Basic";
}

function readPreviewDockDeviceLabel(device) {
  if (device === "mobile") {
    return "Mobile";
  }

  if (device === "tablet") {
    return "Tablet";
  }

  return "Desktop";
}

function buildStepQualityInspector(step) {
  var checks = createStepQualityChecks(step);
  var passedCount = checks.filter(function (check) { return check.passed; }).length;
  var score = checks.length === 0 ? 0 : Math.round((passedCount / checks.length) * 100);
  var scoreClass = score >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-100" : (score >= 55 ? "text-amber-700 bg-amber-50 border-amber-100" : "text-rose-700 bg-rose-50 border-rose-100");
  var html = "";

  html += '<div class="oqu-inspector-divider"></div>';
  html += '<section class="rounded-2xl border border-slate-100 bg-white p-4">';
  html += '<div class="flex items-start justify-between gap-3"><div><div class="text-[10px] font-black uppercase tracking-widest text-slate-400">Step Quality Inspector</div><div class="mt-1 text-sm font-black text-slate-950">Content readiness</div></div><span class="rounded-full border px-3 py-1 text-[10px] font-black ' + scoreClass + '">' + score + '%</span></div>';
  html += '<div class="mt-3 grid gap-2">';
  checks.forEach(function (check) {
    var itemClass = check.passed ? "border-emerald-100 bg-emerald-50 text-emerald-800" : (check.required ? "border-rose-100 bg-rose-50 text-rose-800" : "border-amber-100 bg-amber-50 text-amber-800");
    var icon = check.passed ? "fa-solid fa-check" : (check.required ? "fa-solid fa-xmark" : "fa-solid fa-circle-info");
    html += '<div class="rounded-xl border px-3 py-2 text-[11px] font-bold ' + itemClass + '"><div class="flex items-center gap-2"><i class="' + icon + '"></i><span>' + escapeHtml(check.label) + '</span></div>' + (!check.passed ? '<p class="mt-1 font-semibold opacity-75">' + escapeHtml(check.message) + '</p>' : '') + '</div>';
  });
  html += '</div>';
  html += '</section>';
  return html;
}

function createStepQualityChecks(step) {
  var stepType = readStepType(step);
  var title = readLocalizedText(step && step.title, "");
  var instructions = readLocalizedText(step && step.instructions, "");
  var config = readStepConfig(step);
  var validation = readStepValidation(step);

  return [
    createStepQualityCheck("Registered step type", validation.valid || Boolean(stepType), "Choose a supported activity type.", true),
    createStepQualityCheck("Clear title", title.length >= 4 && title !== "New Step", "Add a learner-facing title.", true),
    createStepQualityCheck("Student instructions", instructions.length >= 12 || hasInstructionLikeConfig(config), "Explain what the learner should do.", false),
    createStepQualityCheck("Meaningful config", hasMeaningfulStepConfig(config), "Fill in the activity-specific fields.", true),
    createStepQualityCheck("Media or interaction", hasMediaOrInteraction(stepType, config), "Add media or use an interactive activity type.", false),
    createStepQualityCheck("Teacher review route", hasTeacherReviewRoute(stepType), "Use Speaking Recording, Creative Canvas, External Task, or reflection when teacher feedback is needed.", false)
  ];
}

function createStepQualityCheck(label, passed, message, required) {
  return {
    label: label,
    passed: Boolean(passed),
    message: message,
    required: Boolean(required)
  };
}

function hasInstructionLikeConfig(config) {
  return Boolean(readConfigText(config, "prompt", "") || readConfigText(config, "question", "") || readConfigText(config, "questionPrompt", "") || readConfigText(config, "bodyText", ""));
}

function hasMeaningfulStepConfig(config) {
  if (!config || typeof config !== "object") {
    return false;
  }

  return Object.keys(config).some(function (key) {
    var value = config[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return typeof value === "number" || typeof value === "boolean";
  });
}

function hasMediaOrInteraction(stepType, config) {
  if (readConfigText(config, "imageUrl", "") || readConfigText(config, "audioUrl", "") || readConfigText(config, "videoUrl", "")) {
    return true;
  }

  return ["sorting", "matching", "ordering", "multiple-choice", "multi-select", "scenario-choice", "scenario-simulator", "sequence-memory", "timed-sequence", "practice-challenge", "creative-canvas", "listening", "speakingPrompt"].indexOf(stepType) !== -1;
}

function hasTeacherReviewRoute(stepType) {
  return ["speakingPrompt", "creative-canvas", "externalTask", "reflection", "reflectionShell"].indexOf(stepType) !== -1;
}

// ── Step picker options ──────────────────────────────────────────────────────

function buildStepPickerModal(practiceModeKey) {
  var html = "";

  html += '<div class="oqu-step-picker-backdrop">';
  html += '<div class="oqu-step-picker-modal" role="dialog" aria-label="Add Learning Activity">';
  html += '<div class="oqu-step-picker-header">';
  html += '<div>';
  html += '<div class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Step Library</div>';
  html += '<div class="text-lg font-black text-gray-950">Add Learning Activity</div>';
  html += '<div class="text-xs text-gray-500 mt-1">Choose an activity for the current lesson path.</div>';
  html += '</div>';
  html += '<button type="button" class="close-step-picker-btn oqu-step-picker-close" aria-label="Close step picker">×</button>';
  html += '</div>';
  html += '<div class="oqu-step-picker-content">';
  html += buildStepLibraryPanel(practiceModeKey);
  html += '</div>';
  html += '</div>';
  html += '</div>';

  return html;
}

function renderStepPickerLibraryPanel(practiceModeKey) {
  var panel = document.querySelector(".oqu-step-picker-content");

  if (panel) {
    panel.innerHTML = buildStepLibraryPanel(practiceModeKey || MAIN_PATH_PRACTICE_MODE_KEY);
  }
}

function renderStepPickerTemplatePanel(stepType) {
  var panel = document.querySelector(".oqu-step-picker-content");

  if (panel) {
    panel.innerHTML = buildStepPickerTemplatePanel(stepType);
  }
}

function buildStepLibraryPanel(practiceModeKey) {
  var html = "";

  html += '<div class="step-library-tools">';
  html += '<div class="step-library-search-wrap">';
  html += '<i class="fa-solid fa-magnifying-glass"></i>';
  html += '<input type="search" class="step-picker-search step-library-search" placeholder="Search activities..." aria-label="Search activities">';
  html += '</div>';
  html += '<div class="step-library-filter-row" aria-label="Activity filters">';
  html += buildStepLibraryFilterChips();
  html += '</div>';
  html += '</div>';
  html += '<div class="oqu-step-picker-category-list" data-key="' + escapeHtml(practiceModeKey || "") + '">';
  html += buildStepPickerOptions();
  html += '<div class="step-library-empty-state" hidden>No activities match this search.</div>';
  html += '</div>';

  return html;
}

function buildStepLibraryFilterChips() {
  var filters = createStepLibraryFilterOptions();
  var html = "";
  var index = 0;

  while (index < filters.length) {
    html += '<button type="button" class="step-library-filter-chip" data-filter="' + escapeHtml(filters[index].filter) + '" aria-pressed="false">' + escapeHtml(filters[index].label) + '</button>';
    index = index + 1;
  }

  return html;
}

function buildStepPickerOptions() {
  var types = createStepTypeCards();
  var categories = createStepCategoryOrder();
  var html = "";
  var categoryIndex = 0;

  html += buildPilotStepTemplateSection(types);
  html += buildRecommendedStepPickerSection(types);

  while (categoryIndex < categories.length) {
    html += buildStepPickerCategory(categories[categoryIndex], types);
    categoryIndex = categoryIndex + 1;
  }

  return html;
}

function buildPilotStepTemplateSection(types) {
  var templates = createPilotStepTemplates();
  var html = "";
  var cards = "";
  var index = 0;

  while (index < templates.length) {
    cards += buildPilotStepTemplateCard(findStepTypeCard(types, templates[index].type), templates[index]);
    index = index + 1;
  }

  if (!cards) {
    return "";
  }

  html += '<section class="oqu-step-picker-category step-library-section step-library-recommended-section">';
  html += '<div class="oqu-step-picker-category-heading">';
  html += '<div>';
  html += '<div class="oqu-step-picker-category-title">Course Creator Templates</div>';
  html += '<div class="oqu-step-picker-category-subtitle">Reusable pilot activities mapped to existing step types.</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="oqu-step-picker-grid step-library-recommended-grid">';
  html += cards;
  html += '</div>';
  html += '</section>';

  return html;
}

function buildPilotStepTemplateCard(type, template) {
  if (!type || !template) {
    return "";
  }

  var card = Object.assign({}, type, {
    label: template.label,
    description: template.description,
    bestFor: template.bestFor,
    filterTags: type.filterTags.concat(["pilot", "template"])
  });

  return buildStepPickerCard(card, true);
}

function createPilotStepTemplates() {
  return [
    {
      type: "vocabulary",
      label: "Vocabulary Builder",
      description: "Introduce a term with meaning, example, media, and pronunciation.",
      bestFor: "New words and core concepts"
    },
    {
      type: "phrase",
      label: "Phrase Builder",
      description: "Practice a reusable phrase with meaning, audio, and example usage.",
      bestFor: "Language chunks and classroom phrases"
    },
    {
      type: "listening",
      label: "Listening Challenge",
      description: "Let students listen, answer, and review transcript support.",
      bestFor: "Audio comprehension"
    },
    {
      type: "reflection",
      label: "Discussion Prompt",
      description: "Ask students to respond to an open prompt for class discussion.",
      bestFor: "Opinions, reasoning, and check-ins"
    },
    {
      type: "speakingPrompt",
      label: "Speaking Recording",
      description: "Capture a student recording for teacher review and feedback.",
      bestFor: "Oral practice and teacher review"
    },
    {
      type: "reflectionShell",
      label: "Reflection Survey",
      description: "Collect a quick written or scaled reflection from students.",
      bestFor: "Exit tickets and self-assessment"
    }
  ];
}

function buildRecommendedStepPickerSection(types) {
  var recommendedTypes = createRecommendedStepTypeOrder();
  var html = "";
  var cards = "";
  var index = 0;

  while (index < recommendedTypes.length) {
    cards += buildStepPickerCard(findStepTypeCard(types, recommendedTypes[index]), true);
    index = index + 1;
  }

  if (!cards) {
    return "";
  }

  html += '<section class="oqu-step-picker-category step-library-section step-library-recommended-section">';
  html += '<div class="oqu-step-picker-category-heading">';
  html += '<div>';
  html += '<div class="oqu-step-picker-category-title">Recommended</div>';
  html += '<div class="oqu-step-picker-category-subtitle">Fast starters for most lessons.</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="oqu-step-picker-grid step-library-recommended-grid">';
  html += cards;
  html += '</div>';
  html += '</section>';

  return html;
}

function buildStepPickerCategory(category, types) {
  var html = "";
  var typeIndex = 0;
  var categoryCards = "";

  while (typeIndex < types.length) {
    if (types[typeIndex].category === category) {
      categoryCards += buildStepPickerCard(types[typeIndex], false);
    }

    typeIndex = typeIndex + 1;
  }

  if (categoryCards.length === 0) {
    return "";
  }

  html += '<section class="oqu-step-picker-category step-library-section" data-category="' + escapeHtml(category) + '">';
  html += '<div class="oqu-step-picker-category-heading">';
  html += '<div>';
  html += '<div class="oqu-step-picker-category-title">' + escapeHtml(category) + '</div>';
  html += '<div class="oqu-step-picker-category-subtitle">' + escapeHtml(readStepLibraryCategoryDescription(category)) + '</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="oqu-step-picker-grid">';
  html += categoryCards;
  html += '</div>';
  html += '</section>';

  return html;
}

function buildStepPickerCard(type, isRecommended) {
  var html = "";

  if (!type || !type.type) {
    return "";
  }

  var readyTemplateCount = countReadyTemplates(type.type);
  var templateLabel = readyTemplateCount === 1 ? "1 style" : readyTemplateCount + " styles";
  var recommendedClass = isRecommended ? " is-recommended" : "";

  html += '<button type="button" class="step-library-step-card oqu-step-picker-card' + recommendedClass + '" data-type="' + escapeHtml(type.type) + '" data-search-text="' + escapeHtml(createStepLibrarySearchText(type)) + '" data-filter-tags="' + escapeHtml(type.filterTags.join(" ")) + '">';
  html += '<span class="oqu-step-picker-card-icon"><i class="' + type.icon + '"></i></span>';
  html += '<span class="oqu-step-picker-card-body">';
  html += '<span class="oqu-step-picker-card-title">' + escapeHtml(type.label) + '</span>';
  html += '<span class="oqu-step-picker-card-description">' + escapeHtml(type.description) + '</span>';
  html += '<span class="oqu-step-picker-card-best-for">Best for: ' + escapeHtml(type.bestFor) + '</span>';
  html += '<span class="oqu-step-picker-card-meta">';
  html += '<span class="oqu-step-picker-card-category">' + escapeHtml(type.shortCategory) + '</span>';
  html += '<span class="oqu-step-picker-card-complexity">' + escapeHtml(type.difficulty) + '</span>';
  html += '<span class="oqu-step-picker-card-template-count">' + escapeHtml(templateLabel) + '</span>';
  html += '</span>';
  html += '</span>';
  html += '<span class="step-library-card-arrow"><i class="fa-solid fa-chevron-right"></i></span>';
  html += '</button>';

  return html;
}

function buildStepPickerTemplatePanel(stepType) {
  var type = findStepTypeCard(createStepTypeCards(), stepType);
  var templates = listReadyStepTemplates(stepType);
  var html = "";
  var index = 0;

  if (!type) {
    return buildStepLibraryPanel(MAIN_PATH_PRACTICE_MODE_KEY);
  }

  html += '<div class="step-library-template-panel">';
  html += '<button type="button" class="step-library-back-btn"><i class="fa-solid fa-arrow-left"></i> Back to activities</button>';
  html += '<div class="step-library-template-summary">';
  html += '<span class="oqu-step-picker-card-icon"><i class="' + type.icon + '"></i></span>';
  html += '<span class="step-library-template-summary-copy">';
  html += '<span class="step-library-template-kicker">Choose Activity Style</span>';
  html += '<span class="step-library-template-title">' + escapeHtml(type.label) + '</span>';
  html += '<span class="step-library-template-description">' + escapeHtml(type.description) + '</span>';
  html += '</span>';
  html += '</div>';
  html += '<div class="step-library-template-list">';

  if (templates.length === 0) {
    templates.push({
      id: getDefaultActivityTemplateId(stepType) || "default",
      name: "Default",
      description: "Use the standard renderer for this activity.",
      status: "ready"
    });
  }

  while (index < templates.length) {
    html += buildStepTemplateOption(type.type, templates[index]);
    index = index + 1;
  }

  html += '</div>';
  html += '<div class="step-library-template-note">Styles use the same step content. You can change the activity template later in the step editor.</div>';
  html += '</div>';

  return html;
}

function buildStepTemplateOption(stepType, template) {
  var isDefault = template.id === getDefaultActivityTemplateId(stepType);
  var html = "";

  html += '<button type="button" class="step-type-option step-library-template-option" data-type="' + escapeHtml(stepType) + '" data-activity-template="' + escapeHtml(template.id) + '">';
  html += '<span class="step-library-template-radio"><i class="fa-solid fa-check"></i></span>';
  html += '<span class="step-library-template-copy">';
  html += '<span class="step-library-template-option-title">' + escapeHtml(template.name) + '</span>';
  html += '<span class="step-library-template-option-description">' + escapeHtml(template.description) + '</span>';
  html += '</span>';
  html += '<span class="step-library-template-badges">';
  html += '<span class="step-library-template-badge">' + (isDefault ? "Default" : "Ready") + '</span>';
  html += '</span>';
  html += '</button>';

  return html;
}

function filterStepPicker(value) {
  var query = typeof value === "string" ? value.trim().toLowerCase() : "";
  var activeFilters = readActiveStepLibraryFilters();
  var cards = document.querySelectorAll(".step-library-step-card");
  var sections = document.querySelectorAll(".step-library-section");
  var emptyState = document.querySelector(".step-library-empty-state");
  var index = 0;
  var visibleCount = 0;

  while (index < cards.length) {
    var searchText = cards[index].getAttribute("data-search-text") || "";
    var filterTags = cards[index].getAttribute("data-filter-tags") || "";
    var visible = (!query || searchText.indexOf(query) !== -1) && matchesStepLibraryFilters(filterTags, activeFilters);

    cards[index].style.display = visible ? "" : "none";
    if (visible) {
      visibleCount = visibleCount + 1;
    }
    index = index + 1;
  }

  updateStepLibrarySectionVisibility(sections);

  if (emptyState) {
    emptyState.hidden = visibleCount !== 0;
  }
}

function toggleStepLibraryFilter(chip) {
  var searchInput = document.querySelector(".step-picker-search");
  var active = chip.classList.toggle("is-active");

  chip.setAttribute("aria-pressed", active ? "true" : "false");
  filterStepPicker(searchInput ? searchInput.value : "");
}

function readActiveStepLibraryFilters() {
  var chips = document.querySelectorAll(".step-library-filter-chip.is-active");
  var filters = [];
  var index = 0;

  while (index < chips.length) {
    filters.push(chips[index].getAttribute("data-filter") || "");
    index = index + 1;
  }

  return filters;
}

function matchesStepLibraryFilters(filterTags, activeFilters) {
  var index = 0;

  while (index < activeFilters.length) {
    if (filterTags.indexOf(activeFilters[index]) === -1) {
      return false;
    }
    index = index + 1;
  }

  return true;
}

function updateStepLibrarySectionVisibility(sections) {
  var index = 0;

  while (index < sections.length) {
    sections[index].style.display = hasVisibleStepLibraryCard(sections[index]) ? "" : "none";
    index = index + 1;
  }
}

function hasVisibleStepLibraryCard(section) {
  var cards = section.querySelectorAll(".step-library-step-card");
  var index = 0;

  while (index < cards.length) {
    if (cards[index].style.display !== "none") {
      return true;
    }
    index = index + 1;
  }

  return false;
}

function createStepTypeCards() {
  var definitions = listStepTypeDefinitions();
  var cards = [];
  var definitionIndex = 0;

  while (definitionIndex < definitions.length) {
    if (SUPPORTED_MAIN_PATH_STEP_TYPES.indexOf(readStepDefinitionText(definitions[definitionIndex], "type", "")) !== -1) {
      cards.push(createStepTypeCard(definitions[definitionIndex]));
    }
    definitionIndex = definitionIndex + 1;
  }

  return cards;
}

function createStepTypeCard(StepTypeDefinition) {
  var stepType = readStepDefinitionText(StepTypeDefinition, "type", "");
  var metadata = readStepLibraryMetadata(stepType);

  return {
    type: stepType || "unknown",
    label: readStepDefinitionText(StepTypeDefinition, "label", "Unknown Step"),
    icon: readStepDefinitionIcon(stepType),
    description: readStepDefinitionText(StepTypeDefinition, "description", "Reusable learning activity."),
    category: metadata.category,
    shortCategory: metadata.shortCategory,
    bestFor: metadata.bestFor,
    difficulty: metadata.difficulty || readStepDefinitionText(StepTypeDefinition, "complexity", "Easy"),
    filterTags: metadata.filterTags
  };
}

function createStepCategoryOrder() {
  return ["Pilot Templates", "Core Learning", "Knowledge Checks", "Sorting & Ordering", "Scenarios", "Creative", "Memory & Logic", "Game Challenges", "Simulations"];
}

function createRecommendedStepTypeOrder() {
  return ["vocabulary", "phrase", "listening", "intro-card", "multiple-choice", "reflection"];
}

function createStepLibraryFilterOptions() {
  return [
    { filter: "quick", label: "Quick" },
    { filter: "interactive", label: "Interactive" },
    { filter: "game", label: "Game" },
    { filter: "creative", label: "Creative" },
    { filter: "assessment", label: "Assessment" },
    { filter: "scenario", label: "Scenario" },
    { filter: "simulation", label: "Simulation" },
    { filter: "teacher-review", label: "Teacher Review" }
  ];
}

function findStepTypeCard(types, stepType) {
  var index = 0;

  while (index < types.length) {
    if (types[index].type === stepType) {
      return types[index];
    }
    index = index + 1;
  }

  return null;
}

function createStepLibrarySearchText(type) {
  return (type.label + " " + type.description + " " + type.category + " " + type.bestFor + " " + type.difficulty + " " + type.filterTags.join(" ") + " " + readStepTemplateSearchText(type.type)).toLowerCase();
}

function readStepTemplateSearchText(stepType) {
  var templates = getActivityTemplateOptions(stepType);

  return templates.map(function (template) {
    return template.name + " " + template.description;
  }).join(" ");
}

function countReadyTemplates(stepType) {
  return listReadyStepTemplates(stepType).length;
}

function listReadyStepTemplates(stepType) {
  var defaultTemplateId = getDefaultActivityTemplateId(stepType);
  var readyTemplates = getActivityTemplateOptions(stepType).filter(function (template) {
    return template.status === "ready";
  });

  readyTemplates.sort(function (first, second) {
    if (first.id === defaultTemplateId) { return -1; }
    if (second.id === defaultTemplateId) { return 1; }
    return first.name.localeCompare(second.name);
  });

  if (readyTemplates.length > 0) {
    return readyTemplates;
  }

  return getActivityTemplateOptions(stepType).slice(0, 1);
}

function readStepLibraryCategoryDescription(category) {
  var descriptions = {
    "Pilot Templates": "Ready-made course creator activity patterns.",
    "Core Learning": "Introduce, guide, reflect, and frame lesson flow.",
    "Knowledge Checks": "Check understanding with focused answer choices.",
    "Sorting & Ordering": "Classify, match, sequence, and organize ideas.",
    Scenarios: "Practice judgment in realistic classroom situations.",
    Creative: "Let students draw, label, diagram, and explain.",
    "Memory & Logic": "Build attention, patterns, and ordered thinking.",
    "Game Challenges": "Use lightweight games for review and practice.",
    Simulations: "Run applied decision-making activities."
  };

  return descriptions[category] || "Reusable learning activities.";
}

function readStepLibraryMetadata(stepType) {
  var metadata = createStepLibraryMetadataMap()[stepType];

  if (metadata) {
    return metadata;
  }

  return {
    category: "Core Learning",
    shortCategory: "Core",
    bestFor: "Reusable learning activities",
    difficulty: "Standard",
    filterTags: ["interactive"]
  };
}

function createStepLibraryMetadataMap() {
  return {
    "intro-card": createStepLibraryMetadata("Core Learning", "Core", "Lesson openings, goals, context", "Quick", ["quick"]),
    "card-reveal": createStepLibraryMetadata("Core Learning", "Core", "Vocabulary, concepts, guided discovery", "Quick", ["quick", "interactive"]),
    vocabulary: createStepLibraryMetadata("Pilot Templates", "Vocabulary", "New words, examples, media, pronunciation", "Quick", ["quick", "interactive"]),
    phrase: createStepLibraryMetadata("Pilot Templates", "Phrase", "Language chunks and reusable phrases", "Quick", ["quick", "interactive"]),
    listening: createStepLibraryMetadata("Pilot Templates", "Listen", "Audio comprehension and response", "Standard", ["interactive", "assessment"]),
    speakingPrompt: createStepLibraryMetadata("Pilot Templates", "Speak", "Recorded speaking practice", "Standard", ["teacher-review", "interactive"]),
    reflectionShell: createStepLibraryMetadata("Pilot Templates", "Survey", "Reflection survey and exit-ticket responses", "Quick", ["quick", "teacher-review"]),
    roadmap: createStepLibraryMetadata("Core Learning", "Core", "Module structure, progression, objectives", "Standard", ["interactive"]),
    reflection: createStepLibraryMetadata("Core Learning", "Reflect", "Exit tickets, check-ins, metacognition", "Quick", ["quick", "teacher-review"]),
    "multiple-choice": createStepLibraryMetadata("Knowledge Checks", "Check", "Quick checks, recall, understanding", "Quick", ["quick", "assessment"]),
    "multi-select": createStepLibraryMetadata("Knowledge Checks", "Check", "Selecting all correct examples", "Standard", ["interactive", "assessment"]),
    sorting: createStepLibraryMetadata("Sorting & Ordering", "Sort", "Categories, examples, compare and contrast", "Standard", ["interactive", "game"]),
    matching: createStepLibraryMetadata("Sorting & Ordering", "Match", "Terms, definitions, relationships", "Standard", ["interactive", "game"]),
    ordering: createStepLibraryMetadata("Sorting & Ordering", "Order", "Procedures, sequences, timelines", "Standard", ["interactive"]),
    "scenario-choice": createStepLibraryMetadata("Scenarios", "Scenario", "Judgment, behavior, real-world choices", "Standard", ["scenario", "assessment"]),
    "creative-canvas": createStepLibraryMetadata("Creative", "Create", "Drawing, labeling, diagrams, explanation", "Standard", ["creative", "teacher-review"]),
    "sequence-memory": createStepLibraryMetadata("Memory & Logic", "Memory", "Patterns, attention, working memory", "Game", ["interactive", "game"]),
    "timed-sequence": createStepLibraryMetadata("Memory & Logic", "Logic", "Focused procedure practice", "Game", ["interactive", "game"]),
    "practice-challenge": createStepLibraryMetadata("Game Challenges", "Game", "Skill practice, games, review", "Game", ["interactive", "game"]),
    "scenario-simulator": createStepLibraryMetadata("Simulations", "Sim", "Fast decisions and applied judgment", "Simulation", ["scenario", "simulation", "game"])
  };
}

function createStepLibraryMetadata(category, shortCategory, bestFor, difficulty, filterTags) {
  return {
    category: category,
    shortCategory: shortCategory,
    bestFor: bestFor,
    difficulty: difficulty,
    filterTags: filterTags
  };
}

function buildUnsupportedStudentPreview(step) {
  var stepType = readStepType(step);
  var title = readLocalizedText(step.title, "Unsupported Step");
  var safeType = stepType ? stepType : "unknown";
  var html = "";

  html += '<div class="oqu-preview-card oqu-preview-unsupported">';
  html += '<div class="oqu-preview-type-badge">🔷 ' + escapeHtml(safeType) + '</div>';
  html += '<div class="text-xs font-bold text-amber-700 mb-2">Preview renderer missing</div>';
  html += '<div class="text-xs text-gray-500 mb-4">Step type ' + escapeHtml(safeType) + ' is not registered with the preview renderer.</div>';
  html += '<div class="oqu-preview-title">' + escapeHtml(title) + '</div>';
  html += '</div>';

  return html;
}

function buildModuleStructureIdleHtml(message) {
  return '<div class="course-structure-idle-card">'
    + '<div class="course-structure-empty-title">Select a path</div>'
    + '<div class="course-structure-empty-copy">' + escapeHtml(message || "Select a lesson path, then edit its steps.") + '</div>'
    + '</div>';
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
  var displayValue = formatConfigEditorValue(value, type);
  var html = "";
  var mediaKind = readMediaKind(key);

  html += '<div class="oqu-inspector-field">';
  html += '<label class="oqu-inspector-label">' + escapeHtml(label) + '</label>';

  if (key === "cardsText") {
    html += buildCardsTextEditor(displayValue);
  } else if (type === "textarea") {
    html += '<textarea class="oqu-inspector-textarea inspector-config-field" data-config-key="' + escapeHtml(key) + '" data-config-type="textarea">' + escapeHtml(displayValue) + '</textarea>';
  } else if (type === "number") {
    html += '<input type="number" class="oqu-inspector-input inspector-config-field" data-config-key="' + escapeHtml(key) + '" data-config-type="number" value="' + escapeHtml(displayValue) + '">';
  } else if (type === "select") {
    html += '<select class="oqu-inspector-select inspector-config-field" data-config-key="' + escapeHtml(key) + '" data-config-type="select">';
    html += buildConfigSelectOptions(field.options, displayValue);
    html += '</select>';
  } else {
    html += '<input type="text" class="oqu-inspector-input inspector-config-field" data-config-key="' + escapeHtml(key) + '" data-config-type="text" value="' + escapeHtml(displayValue) + '">';
  }

  if (mediaKind) {
    html += buildMediaFieldControls(key, mediaKind, displayValue);
  }

  if (typeof field.help === "string" && field.help.length > 0) {
    html += '<div class="oqu-inspector-help">' + escapeHtml(field.help) + '</div>';
  }

  html += '</div>';
  return html;
}

function schemaHasSections(fields) {
  return Array.isArray(fields) && fields.some(function (field) {
    return field && typeof field.section === "string" && field.section.length > 0;
  });
}

function buildSectionedStepConfigFields(fields, config) {
  var sections = [];
  var html = "";

  fields.forEach(function (field) {
    var sectionName = field && typeof field.section === "string" && field.section.length > 0 ? field.section : "Settings";
    var section = findConfigSection(sections, sectionName);

    if (!section) {
      section = {
        name: sectionName,
        fields: []
      };
      sections.push(section);
    }

    section.fields.push(field);
  });

  sections.forEach(function (section, index) {
    html += '<details class="oqu-config-section" ' + (index < 2 ? "open" : "") + '>';
    html += '<summary>' + escapeHtml(section.name) + '</summary>';
    html += '<div class="oqu-config-section-body">';
    section.fields.forEach(function (field) {
      html += buildStepConfigField(field, config);
    });
    html += '</div>';
    html += '</details>';
  });

  return html;
}

function findConfigSection(sections, name) {
  var index = 0;

  while (index < sections.length) {
    if (sections[index].name === name) {
      return sections[index];
    }
    index = index + 1;
  }

  return null;
}

function buildActivityTemplateSelector(stepType, selectedTemplateId) {
  var options = getActivityTemplateOptions(stepType);
  var selectedId = normalizeActivityTemplateId(stepType, selectedTemplateId);
  var defaultTemplateId = getDefaultActivityTemplateId(stepType);
  var html = "";

  if (!options || options.length === 0 || !selectedId) {
    return "";
  }

  html += '<div class="activity-template-section">';
  html += '<div class="activity-template-header">';
  html += '<div class="oqu-inspector-section">Activity Template</div>';
  html += '<span class="activity-template-help">Renderer style</span>';
  html += '</div>';
  html += '<div class="activity-template-list">';

  options.forEach(function (option) {
    var checked = option.id === selectedId ? " checked" : "";
    var selectedClass = option.id === selectedId ? " is-selected" : "";
    var statusClass = option.status === "ready" ? "ready" : "soon";
    var statusLabel = readActivityTemplateStatusLabel(option, option.id === defaultTemplateId);

    html += '<label class="activity-template-option' + selectedClass + '">';
    html += '<input type="radio" class="inspector-activity-template" name="inspector-activity-template" value="' + escapeHtml(option.id) + '"' + checked + '>';
    html += '<span class="activity-template-copy">';
    html += '<span class="activity-template-name">' + escapeHtml(option.name) + '</span>';
    html += '<span class="activity-template-description">' + escapeHtml(option.description) + '</span>';
    html += '</span>';
    html += '<span class="activity-template-badge activity-template-badge-' + statusClass + '">' + statusLabel + '</span>';
    html += '</label>';
  });

  html += '</div>';
  html += '</div>';

  return html;
}

function readActivityTemplateStatusLabel(option, isDefault) {
  if (isDefault) {
    return "Default";
  }

  if (option && option.status === "ready") {
    return "Ready";
  }

  return "Fallback";
}

function syncActivityTemplateSelectedState(input) {
  var section = input ? input.closest(".activity-template-section") : null;
  var options = section ? section.querySelectorAll(".activity-template-option") : [];
  var index = 0;

  while (index < options.length) {
    var optionInput = options[index].querySelector(".inspector-activity-template");
    options[index].classList.toggle("is-selected", Boolean(optionInput && optionInput.checked));
    index = index + 1;
  }
}

function formatConfigEditorValue(value, type) {
  if (Array.isArray(value)) {
    return type === "textarea" ? value.join("\n") : value.join(", ");
  }

  if (value === null || typeof value === "undefined") {
    return "";
  }

  return String(value);
}

function buildCardsTextEditor(displayValue) {
  var placeholder = "🃏|Card title|What students see after the flip\\n⭐|Another card|A second reveal";
  var html = "";

  html += '<div class="cards-text-editor-shell">';
  html += '<div class="cards-text-editor-guide">';
  html += '<div><strong>One card per line</strong><span>icon | front title | reveal text</span></div>';
  html += '<button type="button" class="append-card-line-btn"><i class="fa-solid fa-plus"></i> Add card</button>';
  html += '</div>';
  html += '<textarea class="oqu-inspector-textarea inspector-config-field cards-text-editor-textarea" data-config-key="cardsText" data-config-type="textarea" spellcheck="true" placeholder="' + escapeHtml(placeholder) + '">' + escapeHtml(displayValue) + '</textarea>';
  html += '<div class="cards-text-editor-example"><span>Example</span> 💻|Computers|ICT includes using computers to process information.</div>';
  html += '</div>';

  return html;
}

function appendCardsTextLine(textarea) {
  var line = "🃏|New card|Write the reveal text here.";
  var currentValue = textarea.value || "";
  var separator = currentValue.trim() ? "\n" : "";
  textarea.value = currentValue.replace(/\s+$/g, "") + separator + line;
  textarea.focus();
  textarea.selectionStart = textarea.value.length;
  textarea.selectionEnd = textarea.value.length;
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

function createStepRenderConfig(step) {
  var stepType = readStepType(step);
  var config = createSafeStepConfig(stepType, readStepConfig(step));

  config._activityTemplate = readStepActivityTemplate(step, stepType);
  return config;
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

function createRenderableSession(session, learningMode, practiceModeKey) {
  if (!session || !learningMode || !Array.isArray(learningMode.steps)) {
    return session;
  }

  var practiceModes = readPracticeModes(session);
  var practiceMode = practiceModes[practiceModeKey];
  var shellSteps = practiceMode && Array.isArray(practiceMode.steps) ? practiceMode.steps : [];
  var canonicalSteps = readSortedSteps(learningMode.steps);
  var renderSteps = createRenderableStepList(shellSteps, canonicalSteps);

  if (!practiceMode || renderSteps.length === 0) {
    return session;
  }

  practiceModes[practiceModeKey] = Object.assign({}, practiceMode, {
    steps: renderSteps
  });

  return Object.assign({}, session, {
    practiceModes: practiceModes
  });
}

function createRenderableStepList(shellSteps, canonicalSteps) {
  var safeShellSteps = Array.isArray(shellSteps) ? readSortedSteps(shellSteps) : [];
  var safeCanonicalSteps = Array.isArray(canonicalSteps) ? readSortedSteps(canonicalSteps) : [];
  var canonicalById = {};
  var usedStepIds = {};
  var renderSteps = [];

  safeCanonicalSteps.forEach(function (step) {
    var stepId = readStepId(step, "");
    if (stepId) {
      canonicalById[stepId] = step;
    }
  });

  if (safeShellSteps.length === 0) {
    return safeCanonicalSteps;
  }

  safeShellSteps.forEach(function (step) {
    var stepId = readStepId(step, "");
    if (!stepId) {
      return;
    }

    usedStepIds[stepId] = true;
    renderSteps.push(createRenderableStep(step, canonicalById[stepId]));
  });

  safeCanonicalSteps.forEach(function (step) {
    var stepId = readStepId(step, "");
    if (stepId && !usedStepIds[stepId]) {
      renderSteps.push(step);
    }
  });

  return renderSteps.map(function (step, index) {
    return Object.assign({}, step, {
      order: index + 1
    });
  });
}

function createRenderableStep(shellStep, canonicalStep) {
  var safeShellStep = shellStep && typeof shellStep === "object" ? shellStep : {};
  var safeCanonicalStep = canonicalStep && typeof canonicalStep === "object" ? canonicalStep : {};
  var step = Object.assign({}, safeCanonicalStep, safeShellStep);

  if (shouldUseCanonicalStepTitle(safeShellStep.title, safeCanonicalStep.title)) {
    step.title = safeCanonicalStep.title;
  }

  if (!hasReadableLocalizedText(safeShellStep.instructions) && hasReadableLocalizedText(safeCanonicalStep.instructions)) {
    step.instructions = safeCanonicalStep.instructions;
  }

  if (!hasUsableObject(safeShellStep.config) && hasUsableObject(safeCanonicalStep.config)) {
    step.config = safeCanonicalStep.config;
  }

  if (!readStepType(safeShellStep) && readStepType(safeCanonicalStep)) {
    step.type = readStepType(safeCanonicalStep);
    step.stepTypeId = safeCanonicalStep.stepTypeId || safeCanonicalStep.type;
  }

  if (!safeShellStep.activityTemplate && safeCanonicalStep.activityTemplate) {
    step.activityTemplate = safeCanonicalStep.activityTemplate;
  }

  return step;
}

function hasReadableLocalizedText(value) {
  return readLocalizedText(value, "").trim().length > 0;
}

function shouldUseCanonicalStepTitle(shellTitle, canonicalTitle) {
  var shellText = readLocalizedText(shellTitle, "").trim();
  var canonicalText = readLocalizedText(canonicalTitle, "").trim();

  if (canonicalText.length === 0) {
    return false;
  }

  if (shellText.length === 0) {
    return true;
  }

  return shellText === "New Step" && canonicalText !== shellText;
}

function hasUsableObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0;
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
  if (!step) {
    return "";
  }

  if (typeof step.type === "string" && step.type.length > 0) {
    return step.type;
  }

  if (typeof step.stepTypeId === "string" && step.stepTypeId.length > 0) {
    return step.stepTypeId;
  }

  return "";
}

function readStepActivityTemplate(step, stepType) {
  if (!step || typeof step.activityTemplate !== "string") {
    return normalizeActivityTemplateId(stepType, "");
  }

  return normalizeActivityTemplateId(stepType, step.activityTemplate);
}

function readActivityTemplateFromInspector(propsPane, stepType) {
  var selectedInput = propsPane ? propsPane.querySelector(".inspector-activity-template:checked") : null;
  var selectedValue = selectedInput ? selectedInput.value : "";

  return normalizeActivityTemplateId(stepType, selectedValue);
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
    activityTemplate: step ? readStepActivityTemplate(step, step.type || step.stepTypeId || "") : "",
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
  if (stepType === "intro-card") { return "🚀"; }
  if (stepType === "card-reveal") { return "🃏"; }
  if (stepType === "sorting") { return "🧺"; }
  if (stepType === "multiple-choice") { return "✅"; }
  if (stepType === "multi-select") { return "☑️"; }
  if (stepType === "scenario-choice") { return "🧭"; }
  if (stepType === "scenario-simulator") { return "🎛️"; }
  if (stepType === "sequence-memory") { return "🔢"; }
  if (stepType === "timed-sequence") { return "⏱️"; }
  if (stepType === "practice-challenge") { return "🏁"; }
  if (stepType === "creative-canvas") { return "🎨"; }
  if (stepType === "roadmap") { return "🗺️"; }
  if (stepType === "matching") { return "🔗"; }
  if (stepType === "ordering") { return "🔢"; }
  if (stepType === "reflection") { return "💭"; }
  if (stepType === "textBriefing") { return "📄"; }
  if (stepType === "vocabulary") { return "📖"; }
  if (stepType === "phrase") { return "💬"; }
  if (stepType === "listening") { return "🎧"; }
  if (stepType === "speakingPrompt") { return "🎤"; }
  if (stepType === "reflectionShell") { return "💭"; }
  if (isEmotionalCheckInStepType(stepType)) { return "💙"; }
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
  if (stepType === "intro-card") { return "fa-solid fa-rocket"; }
  if (stepType === "card-reveal") { return "fa-solid fa-clone"; }
  if (stepType === "sorting") { return "fa-solid fa-table-cells"; }
  if (stepType === "multiple-choice") { return "fa-solid fa-circle-check"; }
  if (stepType === "multi-select") { return "fa-solid fa-list-check"; }
  if (stepType === "scenario-choice") { return "fa-solid fa-route"; }
  if (stepType === "scenario-simulator") { return "fa-solid fa-terminal"; }
  if (stepType === "sequence-memory") { return "fa-solid fa-grip"; }
  if (stepType === "timed-sequence") { return "fa-solid fa-stopwatch"; }
  if (stepType === "practice-challenge") { return "fa-solid fa-trophy"; }
  if (stepType === "creative-canvas") { return "fa-solid fa-palette"; }
  if (stepType === "roadmap") { return "fa-solid fa-route"; }
  if (stepType === "matching") { return "fa-solid fa-link"; }
  if (stepType === "ordering") { return "fa-solid fa-arrow-down-1-9"; }
  if (stepType === "reflection") { return "fa-solid fa-comment-dots"; }
  if (stepType === "textBriefing") { return "fa-solid fa-file-lines"; }
  if (stepType === "vocabulary") { return "fa-solid fa-book"; }
  if (stepType === "phrase") { return "fa-solid fa-comment-dots"; }
  if (stepType === "listening") { return "fa-solid fa-headphones"; }
  if (stepType === "speakingPrompt") { return "fa-solid fa-microphone"; }
  if (stepType === "reflectionShell") { return "fa-solid fa-clipboard-question"; }
  if (isEmotionalCheckInStepType(stepType)) { return "fa-regular fa-face-smile"; }
  if (stepType === "customExperience") { return "fa-solid fa-shapes"; }
  if (stepType === "cyberCodeMission") { return "fa-solid fa-code"; }
  if (stepType === "dragMatchIsland") { return "fa-solid fa-gamepad"; }
  if (stepType === "externalTask") { return "fa-solid fa-clipboard-check"; }
  return "fa-solid fa-puzzle-piece";
}

function isEmotionalCheckInStepType(stepType) {
  return stepType === "emotional-check-in" ||
    stepType === "mood-reset" ||
    stepType === "emotionalcheckin" ||
    stepType === "emotionalCheckIn" ||
    stepType === "EmotionalCheckIn";
}

function supportsLearningContentPull(stepType) {
  return stepType === "card-reveal"
    || stepType === "sorting"
    || stepType === "multiple-choice"
    || stepType === "matching"
    || stepType === "ordering"
    || stepType === "roadmap"
    || stepType === "reflection";
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
    html += '<div class="course-path-card is-loading">';
    html += '<div class="oqu-skeleton-card" style="width:20px;height:20px;border-radius:50%;flex-shrink:0"></div>';
    html += '<div class="course-path-card-copy">';
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
  html += '<div class="flex shrink-0 flex-col items-end gap-2">';
  html += '<span id="learningContentAutosaveStatus" class="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">Saved</span>';
  html += '<button type="button" class="save-learning-content-btn rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-slate-800"><i class="fa-solid fa-floppy-disk"></i> Save Learning Content</button>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  html += '<div class="grid gap-4">';
  html += buildVocabularyPairsEditor(content);
  html += buildLearningContentCollapsibleEditor("Concepts", "concepts", content.concepts, "Concepts students should understand and apply.");
  html += buildLearningContentCollapsibleEditor("Rules", "rules", content.rules, "Grammar, usage, or behavior rules that activities can reference.");
  html += buildLearningContentCollapsibleEditor("Examples", "examples", content.examples, "Sample sentences, worked examples, or model answers.");
  html += buildLearningContentCollapsibleEditor("Custom Content", "customContent", content.customContent, "Extra source notes that do not fit the structured sections.");
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

function buildVocabularyPairsEditor(content) {
  var pairs = createVocabularyPairsForUi(content.vocabulary, content.definitions);
  var html = '<section class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">';

  html += '<div class="mb-4 flex items-start justify-between gap-4">';
  html += '<div><div class="text-xs font-black uppercase tracking-widest text-slate-400">Vocabulary</div><p class="mt-1 text-xs font-semibold leading-5 text-slate-500">Add word and definition pairs used by vocabulary activities.</p></div>';
  html += '<button type="button" class="add-vocabulary-pair-btn rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow-sm hover:bg-emerald-700"><i class="fa-solid fa-plus"></i></button>';
  html += '</div>';
  html += '<textarea id="learningContentVocabularyHidden" data-learning-content-field="vocabulary" class="hidden">' + escapeHtml(content.vocabulary.join("\n")) + '</textarea>';
  html += '<textarea id="learningContentDefinitionsHidden" data-learning-content-field="definitions" class="hidden">' + escapeHtml(content.definitions.join("\n")) + '</textarea>';
  html += '<div id="vocabularyPairList" class="max-h-72 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-3">' + buildVocabularyPairList(pairs) + '</div>';
  html += buildVocabularyPairModal();
  html += '</section>';

  return html;
}

function buildVocabularyPairList(pairs) {
  if (!pairs || pairs.length === 0) {
    return '<div class="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center text-sm font-semibold text-slate-500">No vocabulary pairs yet.</div>';
  }

  return pairs.map(function (pair, index) {
    return '<button type="button" class="edit-vocabulary-pair-btn mb-2 flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:bg-emerald-50" data-index="' + index + '">'
      + '<span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-xs font-black text-emerald-700">' + (index + 1) + '</span>'
      + '<span class="min-w-0 flex-1"><strong class="block truncate text-sm text-slate-950">' + escapeHtml(pair.word) + '</strong><small class="mt-1 block text-xs font-semibold leading-5 text-slate-500">' + escapeHtml(pair.definition) + '</small></span>'
      + '<i class="fa-solid fa-pen text-xs text-slate-400"></i>'
      + '</button>';
  }).join('');
}

function buildVocabularyPairModal() {
  return '<div id="vocabularyPairModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/70 p-6">'
    + '<div class="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">'
    + '<div class="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h3 id="vocabularyPairModalTitle" class="text-lg font-black text-slate-950">Vocabulary pair</h3><button type="button" class="close-vocabulary-pair-modal rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600">Close</button></div>'
    + '<div class="grid gap-4 p-5">'
    + '<input type="hidden" id="vocabularyPairEditIndex" value="">'
    + '<div><label class="text-xs font-black uppercase tracking-widest text-slate-400">Vocabulary word</label><input id="vocabularyPairWordInput" class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"></div>'
    + '<div><label class="text-xs font-black uppercase tracking-widest text-slate-400">Definition</label><textarea id="vocabularyPairDefinitionInput" class="mt-2 min-h-[110px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"></textarea></div>'
    + '<p id="vocabularyPairModalError" class="hidden rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-700"></p>'
    + '<div class="flex justify-between gap-2"><button type="button" class="remove-vocabulary-pair-btn rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-black text-red-700">Remove</button><button type="button" class="save-vocabulary-pair-btn rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white">Save Pair</button></div>'
    + '</div></div></div>';
}

function openVocabularyPairModal(indexValue) {
  var modal = document.getElementById("vocabularyPairModal");
  var indexInput = document.getElementById("vocabularyPairEditIndex");
  var title = document.getElementById("vocabularyPairModalTitle");
  var wordInput = document.getElementById("vocabularyPairWordInput");
  var definitionInput = document.getElementById("vocabularyPairDefinitionInput");
  var removeButton = document.querySelector(".remove-vocabulary-pair-btn");
  var pairs = readVocabularyPairsFromHiddenFields();
  var index = indexValue === "" || indexValue == null ? -1 : parseInt(indexValue, 10);
  var pair = index >= 0 && pairs[index] ? pairs[index] : { word: "", definition: "" };

  if (indexInput) { indexInput.value = index >= 0 ? String(index) : ""; }
  if (title) { title.textContent = index >= 0 ? "Edit vocabulary pair" : "Add vocabulary pair"; }
  if (wordInput) { wordInput.value = pair.word; }
  if (definitionInput) { definitionInput.value = pair.definition; }
  if (removeButton) { removeButton.style.display = index >= 0 ? "inline-flex" : "none"; }
  hideVocabularyPairError();

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeVocabularyPairModal() {
  var modal = document.getElementById("vocabularyPairModal");

  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function saveVocabularyPairFromModal() {
  var word = readElementValue("vocabularyPairWordInput").trim();
  var definition = readElementValue("vocabularyPairDefinitionInput").trim();
  var indexValue = readElementValue("vocabularyPairEditIndex");
  var index = indexValue ? parseInt(indexValue, 10) : -1;
  var pairs = readVocabularyPairsFromHiddenFields();

  if (!word || !definition) {
    showVocabularyPairError("Add both a word and a definition before saving.");
    return;
  }

  if (index >= 0 && pairs[index]) {
    pairs[index] = { word: word, definition: definition };
  } else {
    pairs.push({ word: word, definition: definition });
  }

  writeVocabularyPairsToHiddenFields(pairs);
  closeVocabularyPairModal();
}

function removeVocabularyPair(indexValue) {
  var index = parseInt(indexValue, 10);
  var pairs = readVocabularyPairsFromHiddenFields();

  if (!Number.isFinite(index) || !pairs[index]) {
    return;
  }

  pairs.splice(index, 1);
  writeVocabularyPairsToHiddenFields(pairs);
  closeVocabularyPairModal();
}

function readVocabularyPairsFromHiddenFields() {
  return createVocabularyPairsForUi(
    parseLines(readElementValue("learningContentVocabularyHidden")),
    parseLines(readElementValue("learningContentDefinitionsHidden"))
  );
}

function writeVocabularyPairsToHiddenFields(pairs) {
  var safePairs = Array.isArray(pairs) ? pairs : [];
  var vocabulary = safePairs.map(function (pair) { return pair.word; });
  var definitions = safePairs.map(function (pair) { return pair.definition; });
  var vocabularyField = document.getElementById("learningContentVocabularyHidden");
  var definitionsField = document.getElementById("learningContentDefinitionsHidden");
  var list = document.getElementById("vocabularyPairList");

  if (vocabularyField) { vocabularyField.value = vocabulary.join("\n"); }
  if (definitionsField) { definitionsField.value = definitions.join("\n"); }
  if (list) { list.innerHTML = buildVocabularyPairList(safePairs); }
}

function createVocabularyPairsForUi(vocabulary, definitions) {
  var words = Array.isArray(vocabulary) ? vocabulary : [];
  var defs = Array.isArray(definitions) ? definitions : [];
  var maxLength = Math.max(words.length, defs.length);
  var pairs = [];
  var index = 0;

  while (index < maxLength) {
    pairs.push({
      word: readString(words[index], ""),
      definition: readString(defs[index], "")
    });
    index = index + 1;
  }

  return pairs.filter(function (pair) {
    return pair.word || pair.definition;
  });
}

function showVocabularyPairError(message) {
  var error = document.getElementById("vocabularyPairModalError");

  if (error) {
    error.textContent = message;
    error.classList.remove("hidden");
  }
}

function hideVocabularyPairError() {
  var error = document.getElementById("vocabularyPairModalError");

  if (error) {
    error.textContent = "";
    error.classList.add("hidden");
  }
}

function readElementValue(id) {
  var element = document.getElementById(id);

  if (!element || typeof element.value !== "string") {
    return "";
  }

  return element.value;
}

function buildLearningContentTextarea(label, field, items, placeholder) {
  return '<div class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">'
    + '<label class="text-xs font-black uppercase tracking-widest text-slate-400">' + escapeHtml(label) + '</label>'
    + '<textarea data-learning-content-field="' + field + '" class="mt-3 min-h-[150px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" placeholder="' + escapeHtml(placeholder) + '">' + escapeHtml(items.join("\n")) + '</textarea>'
    + '</div>';
}

function buildLearningContentCollapsibleEditor(label, field, items, helperText) {
  var safeItems = Array.isArray(items) && items.length > 0 ? items : [""];
  var html = "";

  html += '<details class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm" open>';
  html += '<summary class="cursor-pointer text-xs font-black uppercase tracking-widest text-slate-500"><span class="mr-2 text-emerald-600">✓</span>' + escapeHtml(label) + '</summary>';
  html += '<p class="mt-3 text-xs font-semibold leading-5 text-slate-500">' + escapeHtml(helperText) + '</p>';
  html += '<textarea id="learningContentHidden-' + escapeHtml(field) + '" data-learning-content-field="' + escapeHtml(field) + '" class="hidden">' + escapeHtml(items.join("\n")) + '</textarea>';
  html += '<div class="mt-3 space-y-2" data-learning-content-line-list="' + escapeHtml(field) + '">';
  safeItems.forEach(function (item) {
    html += buildLearningContentLineItem(field, item);
  });
  html += '</div>';
  html += '<button type="button" class="add-learning-content-line-btn mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-100" data-field="' + escapeHtml(field) + '"><i class="fa-solid fa-plus"></i> Add Item</button>';
  html += '</details>';

  return html;
}

function buildLearningContentLineItem(field, value) {
  return '<div class="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2">'
    + '<input type="text" class="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" data-learning-content-line-field="' + escapeHtml(field) + '" value="' + escapeHtml(value || "") + '">'
    + '<button type="button" class="remove-learning-content-line-btn rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs font-black text-rose-600 hover:bg-rose-50" data-field="' + escapeHtml(field) + '" aria-label="Remove item"><i class="fa-solid fa-trash-can"></i></button>'
    + '</div>';
}

function addLearningContentLine(field) {
  var safeField = field || "";
  var list = document.querySelector('[data-learning-content-line-list="' + safeField + '"]');

  if (!list) {
    return;
  }

  list.insertAdjacentHTML("beforeend", buildLearningContentLineItem(safeField, ""));
  updateLearningContentLineHidden(safeField);
  var inputs = list.querySelectorAll("[data-learning-content-line-field]");
  if (inputs.length > 0) {
    inputs[inputs.length - 1].focus();
  }
}

function removeLearningContentLine(button) {
  var field = button ? button.getAttribute("data-field") : "";
  var row = button ? button.closest("div") : null;
  var list = field ? document.querySelector('[data-learning-content-line-list="' + field + '"]') : null;

  if (row && row.parentNode) {
    row.parentNode.removeChild(row);
  }

  if (list && list.querySelectorAll("[data-learning-content-line-field]").length === 0) {
    list.insertAdjacentHTML("beforeend", buildLearningContentLineItem(field, ""));
  }

  updateLearningContentLineHidden(field);
}

function updateLearningContentLineHidden(field) {
  var safeField = field || "";
  var hidden = document.getElementById("learningContentHidden-" + safeField);

  if (!hidden) {
    return;
  }

  hidden.value = readLearningContentLineValues(safeField).join("\n");
}

function readLearningContentLineValues(field) {
  var inputs = document.querySelectorAll('[data-learning-content-line-field="' + field + '"]');
  var values = [];
  var index = 0;

  while (index < inputs.length) {
    if (inputs[index].value.trim()) {
      values.push(inputs[index].value.trim());
    }
    index = index + 1;
  }

  return values;
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
  var existingTypes = createExistingPathTypeMap(modes);
  var pathOptions = createLearningPathOptions(existingTypes);
  var html = "";

  html += '<div class="p-6 space-y-5 bg-slate-50/60 min-h-full">';
  html += '<div class="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-sky-50 to-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">';
  html += '<div class="flex items-start justify-between gap-5">';
  html += '<div>';
  html += '<div class="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">Course -> Modules -> Lesson Paths -> Learning Activities</div>';
  html += '<h2 class="mt-2 text-3xl font-black text-slate-950">Lesson Paths</h2>';
  html += '<p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Paths let you offer review, challenge, or support versions of the same module without creating duplicate modules.</p>';
  html += '</div>';
  html += '<button type="button" class="generate-mode-from-primary-btn rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-xs font-black text-emerald-700 shadow-sm hover:bg-emerald-50"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate From Main Path</button>';
  html += '</div>';
  html += '<div class="mt-5 grid grid-cols-5 gap-3">';
  pathOptions.forEach(function (option) {
    var disabled = option.required || option.exists ? " disabled" : "";
    var stateLabel = option.required ? "Required" : (option.exists ? "Added" : "Add");
    var optionClass = option.required
      ? "border-emerald-200 bg-white text-emerald-800"
      : option.exists
        ? "border-slate-200 bg-white text-slate-500"
        : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md";
    html += '<button type="button" class="create-learning-path-option-btn rounded-2xl border p-3 text-left transition ' + optionClass + '" data-path-type="' + escapeHtml(option.pathType) + '"' + disabled + '>';
    html += '<div class="flex items-center justify-between gap-2">';
    html += '<span class="grid h-9 w-9 place-items-center rounded-2xl ' + escapeHtml(option.iconBg) + '"><i class="' + escapeHtml(option.icon) + '"></i></span>';
    html += '<span class="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-slate-500">' + stateLabel + '</span>';
    html += '</div>';
    html += '<div class="mt-3 text-xs font-black text-slate-950">' + escapeHtml(option.title) + '</div>';
    html += '<div class="mt-1 text-[10px] leading-4 text-slate-500">' + escapeHtml(option.shortPurpose) + '</div>';
    html += '</button>';
  });
  html += '</div>';
  html += '</div>';

  html += buildPracticeModeBuilderPanel(existingTypes);

  html += '<div class="grid grid-cols-2 gap-4">';
  modes.forEach(function (mode) {
    var meta = readLearningPathMeta(mode);
    var title = readLearningPathTitle(mode, meta.title);
    var purpose = readLearningPathPurpose(mode, meta.purpose);
    var stepCount = readLearningPathStepCount(mode);
    var selected = selectedModeId === mode.id ? " ring-2 ring-emerald-300 border-emerald-200 shadow-[0_16px_38px_rgba(16,185,129,0.18)]" : " border-slate-100 shadow-sm";
    html += '<div class="learning-mode-card rounded-[26px] bg-white p-5 border cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition' + selected + '" data-mode-id="' + escapeHtml(mode.id) + '">';
    html += '<div class="flex items-start gap-4">';
    html += '<div class="grid h-16 w-16 shrink-0 place-items-center rounded-3xl ' + escapeHtml(meta.iconBg) + ' text-xl"><i class="' + escapeHtml(meta.icon) + '"></i></div>';
    html += '<div class="min-w-0 flex-1">';
    html += '<div class="flex items-center gap-2 flex-wrap">' + buildStatusPill(mode.status) + (mode.required ? '<span class="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">Required</span>' : '<span class="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-black uppercase text-sky-700">Optional</span>') + '</div>';
    html += '<h3 class="mt-3 text-xl font-black text-slate-950 truncate">' + escapeHtml(title) + '</h3>';
    html += '<p class="mt-1 min-h-[40px] text-xs leading-5 text-slate-500">' + escapeHtml(purpose) + '</p>';
    html += '</div>';
    html += '</div>';
    html += '<div class="mt-5 grid grid-cols-3 gap-2">';
    html += '<div class="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div class="text-[9px] font-black uppercase tracking-widest text-slate-400">Path Type</div><div class="mt-1 text-xs font-black text-slate-800">' + escapeHtml(meta.title) + '</div></div>';
    html += '<div class="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div class="text-[9px] font-black uppercase tracking-widest text-slate-400">Activities</div><div class="mt-1 text-xs font-black text-slate-800">' + stepCount + '</div></div>';
    html += '<div class="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div class="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</div><div class="mt-1 text-xs font-black text-slate-800">' + escapeHtml(readString(mode.status, "draft")) + '</div></div>';
    html += '</div>';
    html += '<div class="mt-4 flex items-center justify-between gap-2">';
    html += '<span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Alternate route inside this module</span>';
    html += '<div class="flex gap-2">';
    html += '<button type="button" class="edit-learning-path-steps-btn rounded-xl bg-emerald-600 px-3 py-1.5 text-[10px] font-black text-white hover:bg-emerald-700" data-mode-id="' + escapeHtml(mode.id) + '">Edit Learning Activities</button>';
    html += '<button type="button" class="duplicate-learning-mode-btn rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black text-slate-600 hover:bg-slate-50" data-mode-id="' + escapeHtml(mode.id) + '">Duplicate</button>';
    if (!mode.required) {
      html += '<button type="button" class="delete-learning-mode-btn rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-600 hover:bg-rose-100" data-mode-id="' + escapeHtml(mode.id) + '">Delete</button>';
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';

  html += '<div class="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">';
  html += '<div class="text-sm font-black text-slate-900">How Lesson Paths Work</div>';
  html += '<p class="mt-2 text-xs leading-5 text-slate-500">Main Path is required. Review, Challenge, Support, and Custom paths are optional alternate learning activity sequences inside the same module. Existing internal mode fields stay in place for compatibility.</p>';
  html += '</div>';
  html += '</div>';

  return html;
}

function buildAddPathModalHtml() {
  return '<div id="addPathModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/70 p-6">'
    + '<div class="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">'
    + '<div class="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">'
    + '<div><div class="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">Add Path</div><h2 class="mt-1 text-lg font-black text-slate-950">Choose a lesson path type</h2></div>'
    + '<button type="button" class="close-add-path-modal rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50">Close</button>'
    + '</div>'
    + '<div id="addPathModalBody" class="bg-slate-50 p-5"></div>'
    + '</div>'
    + '</div>';
}

function openAddPathModal(learningModes) {
  var modal = document.getElementById("addPathModal");
  var body = document.getElementById("addPathModalBody");
  var modes = createLearningModeList(learningModes, []);
  var existingTypes = createExistingPathTypeMap(modes);
  var options = createLearningPathOptions(existingTypes);
  var html = "";

  if (!modal || !body) {
    return;
  }

  html += '<div class="grid gap-3 md:grid-cols-2">';
  options.forEach(function (option) {
    var disabled = option.required || option.exists ? " disabled" : "";
    var stateLabel = option.required ? "Required" : (option.exists ? "Added" : "Create");
    var optionClass = option.required || option.exists
      ? "border-slate-200 bg-white text-slate-500"
      : "border-emerald-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md";

    html += '<button type="button" class="create-learning-path-option-btn rounded-2xl border p-4 text-left transition ' + optionClass + '" data-path-type="' + escapeHtml(option.pathType) + '"' + disabled + '>';
    html += '<div class="flex items-center justify-between gap-3"><span class="grid h-11 w-11 place-items-center rounded-2xl ' + escapeHtml(option.iconBg) + '"><i class="' + escapeHtml(option.icon) + '"></i></span><span class="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-slate-500">' + escapeHtml(stateLabel) + '</span></div>';
    html += '<div class="mt-3 text-sm font-black text-slate-950">' + escapeHtml(option.title) + '</div>';
    html += '<p class="mt-1 min-h-[38px] text-xs font-semibold leading-5 text-slate-500">' + escapeHtml(option.purpose) + '</p>';
    html += '</button>';
  });
  html += '</div>';

  body.innerHTML = html;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeAddPathModal() {
  var modal = document.getElementById("addPathModal");

  if (!modal) {
    return;
  }

  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function resetWorkspaceScroll() {
  var workspace = document.getElementById("workspaceContent");

  if (workspace) {
    workspace.scrollTop = 0;
  }
}

function findStepByIdInList(steps, stepId) {
  var safeSteps = Array.isArray(steps) ? steps : [];
  var index = 0;

  while (index < safeSteps.length) {
    if (readStepId(safeSteps[index], "") === stepId) {
      return safeSteps[index];
    }

    index = index + 1;
  }

  return null;
}

function buildPracticeModeBuilderPanel(existingTypes) {
  var modes = createPracticeModeBuilderOptions(existingTypes);
  var html = "";

  html += '<div class="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">';
  html += '<div class="flex items-start justify-between gap-4">';
  html += '<div><div class="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Practice Mode Builder</div><h3 class="mt-1 text-xl font-black text-slate-950">Before, after, and daily practice shells</h3><p class="mt-1 text-xs font-semibold leading-5 text-slate-500">Practice modes reuse lesson paths and learning activities. No duplicate module flow is created.</p></div>';
  html += '<span class="rounded-full bg-blue-50 px-3 py-2 text-[10px] font-black uppercase text-blue-700">Presentation + authoring shell</span>';
  html += '</div>';
  html += '<div class="mt-4 grid gap-3 md:grid-cols-3">';
  modes.forEach(function (mode) {
    var disabled = mode.exists ? " disabled" : "";
    var buttonClass = mode.exists
      ? "border-emerald-100 bg-emerald-50 text-emerald-800"
      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50";
    html += '<button type="button" class="create-learning-path-option-btn rounded-2xl border p-4 text-left transition ' + buttonClass + '" data-path-type="' + escapeHtml(mode.pathType) + '"' + disabled + '>';
    html += '<div class="flex items-center justify-between gap-3"><span class="grid h-10 w-10 place-items-center rounded-2xl ' + escapeHtml(mode.iconBg) + '"><i class="' + escapeHtml(mode.icon) + '"></i></span><span class="rounded-full bg-white px-2 py-1 text-[9px] font-black uppercase tracking-wide">' + (mode.exists ? "Ready" : "Create") + '</span></div>';
    html += '<div class="mt-3 text-sm font-black text-slate-950">' + escapeHtml(mode.title) + '</div>';
    html += '<p class="mt-1 min-h-[40px] text-[11px] font-semibold leading-5 text-slate-500">' + escapeHtml(mode.purpose) + '</p>';
    html += '<div class="mt-3 text-[10px] font-black uppercase tracking-wide text-blue-600">' + escapeHtml(mode.routeLabel) + '</div>';
    html += '</button>';
  });
  html += '</div>';
  html += '</div>';

  return html;
}

function createPracticeModeBuilderOptions(existingTypes) {
  var existing = existingTypes || {};
  return [
    {
      title: "Before Class Warmup",
      purpose: "Prepare students before the main lesson with a short entry sequence.",
      pathType: "main",
      routeLabel: "Main Path",
      exists: true,
      icon: "fa-solid fa-sun text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-700"
    },
    {
      title: "After Class Reinforcement",
      purpose: "Review and strengthen the same module after the lesson.",
      pathType: "review",
      routeLabel: "Review Path",
      exists: existing.review === true,
      icon: "fa-solid fa-rotate text-sky-700",
      iconBg: "bg-sky-100 text-sky-700"
    },
    {
      title: "Five Minute Daily Practice",
      purpose: "Create a compact recurring practice route for many-module courses.",
      pathType: "challenge",
      routeLabel: "Practice Path",
      exists: existing.challenge === true,
      icon: "fa-solid fa-stopwatch text-violet-700",
      iconBg: "bg-violet-100 text-violet-700"
    }
  ];
}

function buildLearningModesInspector() {
  var html = "";
  html += '<div class="space-y-4">';
  html += '<div class="rounded-3xl border border-blue-100 bg-blue-50 p-4">';
  html += '<div class="text-xs font-black text-blue-900">Practice Mode Builder</div>';
  html += '<div class="mt-2 text-xs leading-5 text-blue-800">Before Class, After Class, and Daily Practice are authoring shells over the same lesson path and learning activity system.</div>';
  html += '</div>';
  html += '<div class="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">';
  html += '<div class="text-xs font-black text-emerald-900">Lesson Path Basics</div>';
  html += '<div class="mt-2 text-xs leading-5 text-emerald-800">Main Path is required. Add optional paths when students need review, challenge, or support routes through the same module.</div>';
  html += '</div>';
  html += '<div class="rounded-2xl border border-slate-100 p-4">';
  html += '<div class="text-xs font-black text-slate-900">Path Types</div>';
  html += '<div class="mt-2 space-y-2 text-xs leading-5 text-slate-500">';
  html += '<div><strong class="text-slate-700">Main:</strong> required core lesson sequence.</div>';
  html += '<div><strong class="text-slate-700">Review:</strong> reinforce the same module.</div>';
  html += '<div><strong class="text-slate-700">Challenge:</strong> extend confident students.</div>';
  html += '<div><strong class="text-slate-700">Support:</strong> slower guided version.</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  return html;
}

function buildSelectedLearningModeInspector(mode, tab) {
  if (!mode) {
    return buildLearningModesInspector();
  }

  var html = "";
  var meta = readLearningPathMeta(mode);
  var title = readLearningPathTitle(mode, meta.title);
  var purpose = readLearningPathPurpose(mode, meta.purpose);
  var stepCount = readLearningPathStepCount(mode);

  html += '<div class="space-y-4">';
  html += '<div class="rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 p-4 border border-emerald-100">';
  html += '<div class="flex items-center gap-3">';
  html += '<div class="grid h-11 w-11 place-items-center rounded-2xl ' + escapeHtml(meta.iconBg) + '"><i class="' + escapeHtml(meta.icon) + '"></i></div>';
  html += '<div>';
  html += '<div class="text-[10px] font-black uppercase tracking-widest text-emerald-600">Selected Path</div>';
  html += '<div class="mt-1 text-lg font-black text-slate-950">' + escapeHtml(title) + '</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="mt-3 text-xs font-semibold leading-5 text-slate-500">' + escapeHtml(purpose) + '</div>';
  html += '</div>';
  html += '<div class="rounded-2xl border border-slate-100 p-4" data-inspector-mode="lesson-path">';
  html += '<div class="oqu-inspector-field">';
  html += '<label class="oqu-inspector-label">Path title</label>';
  html += '<input type="text" class="oqu-inspector-input inspector-path-title" value="' + escapeHtml(title) + '" placeholder="Path title">';
  html += '</div>';
  html += '<div class="oqu-inspector-field">';
  html += '<label class="oqu-inspector-label">Purpose</label>';
  html += '<textarea class="oqu-inspector-textarea inspector-path-purpose" placeholder="Explain when a teacher should use this path.">' + escapeHtml(purpose) + '</textarea>';
  html += '</div>';
  html += '<button type="button" class="save-learning-path-btn w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition mt-1" data-mode-id="' + escapeHtml(readString(mode.id, "primary")) + '">Save Path Details</button>';
  html += '</div>';
  html += '<div class="rounded-2xl border border-slate-100 p-4">';
  html += '<div class="oqu-inspector-readonly-label">Path ID</div>';
  html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(readString(mode.id, "primary")) + '</div>';
  html += '<div class="oqu-inspector-readonly-label">Path type</div>';
  html += '<div class="oqu-inspector-readonly-value mb-3">' + escapeHtml(meta.title) + '</div>';
  html += '<div class="oqu-inspector-readonly-label">Steps</div>';
  html += '<div class="oqu-inspector-readonly-value mb-3">' + stepCount + '</div>';
  html += '<div class="oqu-inspector-readonly-label">Status</div>';
  html += '<div class="mt-1">' + buildStatusPill(readString(mode.status, "draft")) + '</div>';
  html += '</div>';
  html += '<div class="rounded-2xl border border-slate-100 p-4 text-xs leading-5 text-slate-500">';
  html += tab === "learningModes" ? 'Click Edit Learning Activities to build the activity sequence for this path.' : 'The main panel and inspector are synced to this selected path.';
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
    } else if (document.querySelector('[data-learning-content-line-field="' + field + '"]')) {
      content[field] = readLearningContentLineValues(field);
    } else {
      content[field] = parseLines(fields[index].value);
    }
    index = index + 1;
  }

  return content;
}

function isLearningContentInput(target) {
  if (!target || typeof target.closest !== "function") {
    return false;
  }

  return Boolean(
    target.closest("[data-learning-content-line-field]") ||
    target.closest("[data-learning-content-field]")
  );
}

function validateLearningContentForAutosave(content) {
  var vocabulary = Array.isArray(content && content.vocabulary) ? content.vocabulary : [];
  var definitions = Array.isArray(content && content.definitions) ? content.definitions : [];

  if (vocabulary.length !== definitions.length) {
    return {
      valid: false,
      message: "Error — Retry: every vocabulary word needs one definition."
    };
  }

  return {
    valid: true,
    message: ""
  };
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

function createExistingPathTypeMap(modes) {
  var map = {};
  var list = Array.isArray(modes) ? modes : [];

  list.forEach(function (mode) {
    var meta = readLearningPathMeta(mode);
    map[meta.pathType] = true;
  });

  return map;
}

function createLearningPathOptions(existingTypes) {
  var existing = existingTypes || {};
  return [
    Object.assign(readLearningPathOption("main"), {
      required: true,
      exists: true
    }),
    Object.assign(readLearningPathOption("review"), {
      exists: existing.review === true
    }),
    Object.assign(readLearningPathOption("challenge"), {
      exists: existing.challenge === true
    }),
    Object.assign(readLearningPathOption("support"), {
      exists: existing.support === true
    }),
    Object.assign(readLearningPathOption("custom"), {
      exists: false
    })
  ];
}

function readLearningPathOption(pathType) {
  if (pathType === "main" || pathType === "primary") {
    return {
      pathType: "main",
      modeType: "primary",
      title: "Main Path",
      purpose: "The required core step sequence for this module.",
      shortPurpose: "Required core sequence.",
      icon: "fa-solid fa-star text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-700"
    };
  }

  if (pathType === "review") {
    return {
      pathType: "review",
      modeType: "review",
      title: "Review Path",
      purpose: "Reinforce the same module with a lighter review sequence.",
      shortPurpose: "Reinforce key ideas.",
      icon: "fa-solid fa-rotate text-sky-700",
      iconBg: "bg-sky-100 text-sky-700"
    };
  }

  if (pathType === "challenge" || pathType === "practice") {
    return {
      pathType: "challenge",
      modeType: "practice",
      title: "Challenge Path",
      purpose: "Extend confident students with deeper practice and challenge steps.",
      shortPurpose: "Stretch ready learners.",
      icon: "fa-solid fa-bolt text-violet-700",
      iconBg: "bg-violet-100 text-violet-700"
    };
  }

  if (pathType === "support" || pathType === "assessment") {
    return {
      pathType: "support",
      modeType: "assessment",
      title: "Support Path",
      purpose: "Offer a slower guided route through the same module.",
      shortPurpose: "Guide extra support.",
      icon: "fa-solid fa-hands-holding-child text-amber-700",
      iconBg: "bg-amber-100 text-amber-700"
    };
  }

  return {
    pathType: "custom",
    modeType: "custom",
    title: "Custom Path",
    purpose: "A custom step sequence inside this module.",
    shortPurpose: "Design your own route.",
    icon: "fa-solid fa-route text-slate-700",
    iconBg: "bg-slate-100 text-slate-700"
  };
}

function readLearningPathMeta(mode) {
  var type = mode && typeof mode.modeType === "string" ? mode.modeType : "";
  if (mode && mode.id === "primary") {
    return readLearningPathOption("main");
  }

  if (type === "primary") return readLearningPathOption("main");
  if (type === "review") return readLearningPathOption("review");
  if (type === "practice") return readLearningPathOption("challenge");
  if (type === "assessment") return readLearningPathOption("support");
  return readLearningPathOption("custom");
}

function readLearningPathTitle(mode, fallbackTitle) {
  var title = readLocalizedText(mode && mode.title, fallbackTitle || "Lesson Path");
  var meta = readLearningPathMeta(mode);

  if (title === "Primary Mode" || title === "Learning Mode") {
    return meta.title;
  }

  if (title === "Review Mode") {
    return "Review Path";
  }

  if (title === "Practice Mode") {
    return "Challenge Path";
  }

  if (title === "Assessment Mode") {
    return "Support Path";
  }

  if (title === "Legacy Mode") {
    return "Legacy Path";
  }

  return title;
}

function readLearningPathPurpose(mode, fallbackPurpose) {
  var purpose = readString(mode && mode.purpose, fallbackPurpose || "");

  if (purpose.indexOf("mode") !== -1 || purpose.indexOf("Mode") !== -1 || purpose.length === 0) {
    return readLearningPathMeta(mode).purpose;
  }

  return purpose;
}

function readLearningPathStepCount(mode) {
  if (mode && typeof mode.stepCount === "number") {
    return mode.stepCount;
  }

  if (mode && Array.isArray(mode.steps)) {
    return mode.steps.length;
  }

  return 0;
}

function readLearningModeIcon(mode) {
  if (mode && mode.modeType === "primary") return '<i class="fa-solid fa-star"></i>';
  if (mode && mode.modeType === "review") return '<i class="fa-solid fa-rotate"></i>';
  if (mode && mode.modeType === "practice") return '<i class="fa-solid fa-bolt"></i>';
  if (mode && mode.modeType === "assessment") return '<i class="fa-solid fa-hands-holding-child"></i>';
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
