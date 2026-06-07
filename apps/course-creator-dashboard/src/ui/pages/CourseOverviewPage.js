import { courseEditorStore } from '../state/courseEditorState.js?v=1.1.112-student-assignment-error-debug';
import { courseEditorService } from '../services/courseEditorService.js?v=1.1.112-student-assignment-error-debug';
import { courseAssignmentService } from '../services/courseAssignmentService.js?v=1.1.112-student-assignment-error-debug';
import { externalTaskReviewService } from '../services/externalTaskReviewService.js?v=1.1.112-student-assignment-error-debug';
import {
  createEmptyState,
  createErrorState,
  createLoadingState,
  createStatusBadge
} from '../../../../../packages/ui/index.js?v=1.1.112-student-assignment-error-debug';

export class CourseOverviewPage {
  constructor(courseId, options) {
    this.courseId = courseId;
    this.options = options || {};
    this.unsubscribe = null;
    this.userHasEditedMetadata = false;
    this.localTags = [];
    this.editingModuleId = null;
    this.moduleWizardStep = 1;
    this.moduleWizardTemplateKey = 'school';
    this.moduleWizardLoadingTimer = null;
    this.lastLoggedCourseContext = "";
    this.assignments = [];
    this.assignmentsLoading = false;
    this.assignmentPendingId = "";
    this.assignmentPendingAction = "";
    this.externalTaskSubmissions = [];
    this.externalTaskLoading = false;
    this.externalTaskPendingId = "";
    this.externalTaskStatusFilter = "pending";
    this.ALL_LANGUAGES = [
      { code: 'en', name: 'English (en)' },
      { code: 'ru', name: 'Russian (ru)' },
      { code: 'ky', name: 'Kyrgyz (ky)' }
    ];
  }

  render() {
    return `
      <div id="course-overview-root" class="min-h-screen bg-gray-50 flex flex-col">
        <!-- Top Nav -->
        <nav class="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center z-10 sticky top-0 shadow-sm">
          <div class="flex items-center gap-4">
            <span class="text-blue-600 font-bold text-xl tracking-tight">OquWay</span>
            <div class="h-6 w-px bg-gray-300"></div>
            <span class="text-gray-600 font-medium text-sm" id="headerContextualTitle">Loading course...</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <span id="saveStatusIndicator" class="text-green-600 font-medium flex items-center gap-1 mr-2 hidden">
              <i class="fa-regular fa-circle-check"></i> Autosave
            </span>
            <a href="#dashboard" class="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition shadow-sm">Back to Catalog</a>
            <button id="previewCourseBtn" class="border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-medium shadow-sm transition flex items-center gap-2">
              <i class="fa-solid fa-eye"></i> Preview as Student
            </button>
            <button id="archiveCourseBtn" class="border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-medium shadow-sm transition flex items-center gap-2">
              <i class="fa-solid fa-box-archive"></i> Archive
            </button>
            <button id="publishCourseBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition flex items-center gap-2">
              <i class="fa-solid fa-arrow-up-from-bracket"></i> Publish Update
            </button>
          </div>
        </nav>

        <main class="max-w-7xl mx-auto w-full px-6 py-8 flex gap-8 pb-32">

          <!-- Left Column: Modules List -->
          <div class="flex-1">
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Course Modules</h1>
              <div class="flex items-center gap-3">
                <span id="moduleCreateStatusMsg" style="display:none" class="text-sm font-medium"></span>
                <button id="addModuleBtn" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold transition shadow-sm flex items-center gap-2 text-sm">
                  <i class="fa-solid fa-plus text-gray-400"></i> New Module
                </button>
              </div>
            </div>

            <div id="moduleRepairBanner" class="hidden mb-4"></div>

            <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th class="py-3 px-6 font-semibold w-12 text-center">Order</th>
                    <th class="py-3 px-6 font-semibold">Module Title</th>
                    <th class="py-3 px-6 font-semibold text-center w-24">Status</th>
                    <th class="py-3 px-6 font-semibold text-center w-24">Steps</th>
                    <th class="py-3 px-6 font-semibold text-center w-32">Updated</th>
                    <th class="py-3 px-6 font-semibold text-right w-32">Actions</th>
                  </tr>
                </thead>
                <tbody id="moduleTableBody" class="divide-y divide-gray-100 text-sm">
                  ${buildModuleSkeletonRows(3)}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right Column: Course Settings -->
          <div class="w-96 shrink-0">
            <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-24">
              <h2 class="text-lg font-bold text-gray-900 tracking-tight mb-5 border-b border-gray-100 pb-3">Course Metadata</h2>

              <div id="courseOverviewSummary" class="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
                ${createLoadingState('Loading course...', {
                  className: 'flex items-center gap-2 text-xs font-semibold text-gray-500',
                  beforeHtml: '<i class="fa-solid fa-circle-notch fa-spin text-blue-500"></i>'
                })}
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Course Title</label>
                  <input type="text" id="courseTitleInput" class="course-meta-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-field="title" placeholder="Loading...">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Course Description</label>
                  <textarea id="courseDescriptionInput" class="course-meta-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[88px]" data-field="description" placeholder="Short course description..."></textarea>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select id="courseStatusSelect" class="course-meta-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                  <input type="text" id="courseSubjectInput" class="course-meta-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ICT, English, Math">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Level / Grade</label>
                  <input type="text" id="courseLevelInput" class="course-meta-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Grade 7">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Tags</label>
                  <div id="tagsContainer" class="flex flex-wrap gap-2 mb-2 min-h-[24px]"></div>
                  <div class="flex gap-2">
                    <input type="text" id="newTagInput" class="course-meta-input w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add tag...">
                    <button id="addTagBtn" class="bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-200 transition">Add</button>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Supported Languages (Ctrl+Click to Select Multiple)</label>
                  <select id="courseLangsSelect" multiple class="course-meta-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-28">
                    <!-- Populated via JS -->
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Default Language</label>
                  <select id="courseDefaultLangSelect" class="course-meta-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <!-- Populated via JS -->
                  </select>
                </div>
              </div>

              <button id="saveMetadataBtn" class="w-full mt-6 bg-gray-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg shadow-sm transition text-sm flex justify-center items-center gap-2">
                Save Settings
              </button>

              <div class="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                <span>Version: <span id="courseVersionText" class="font-medium text-gray-800">1</span></span>
                <span>Status: <span id="courseStatusText" class="font-medium text-gray-800">draft</span></span>
              </div>

              <div class="mt-6 pt-5 border-t border-gray-100">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 class="text-lg font-bold text-gray-900 tracking-tight">Assignments</h2>
                    <p class="text-xs text-gray-500 mt-1">Control which students can see this course.</p>
                  </div>
                  <button id="refreshAssignmentsBtn" class="text-xs font-bold text-blue-600 hover:text-blue-700">Refresh</button>
                </div>

                <div id="assignmentStatusMessage" class="hidden mb-3 text-xs font-semibold"></div>

                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Target Type</label>
                    <select id="assignmentTargetTypeSelect" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="class">Class</option>
                      <option value="student">Student</option>
                      <option value="location">Location</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Target ID</label>
                    <input id="assignmentTargetIdInput" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Paste class, student, or location ID">
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Initial Status</label>
                    <select id="assignmentStatusSelect" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>
                  <button id="createAssignmentBtn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition text-sm">
                    Assign Course
                  </button>
                </div>

                <div id="assignmentList" class="mt-5 space-y-2">
                  ${buildAssignmentSkeletonRows(2)}
                </div>
              </div>

              <div class="mt-6 pt-5 border-t border-gray-100">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 class="text-lg font-bold text-gray-900 tracking-tight">External Task Reviews</h2>
                    <p class="text-xs text-gray-500 mt-1">Review real-world task proof submitted by students.</p>
                  </div>
                  <button id="refreshExternalTasksBtn" class="text-xs font-bold text-blue-600 hover:text-blue-700">Refresh</button>
                </div>
                <div id="externalTaskStatusMessage" class="hidden mb-3 text-xs font-semibold"></div>
                <div id="externalTaskFilters" class="mb-3 flex flex-wrap gap-2">
                  ${buildExternalTaskFilterButton('pending', this.externalTaskStatusFilter)}
                  ${buildExternalTaskFilterButton('needsWork', this.externalTaskStatusFilter)}
                  ${buildExternalTaskFilterButton('complete', this.externalTaskStatusFilter)}
                  ${buildExternalTaskFilterButton('incomplete', this.externalTaskStatusFilter)}
                </div>
                <div id="externalTaskReviewList" class="space-y-2">
                  ${buildAssignmentSkeletonRows(2)}
                </div>
              </div>
            </div>
          </div>

        </main>

        <div id="coursePreviewModal" class="fixed inset-0 bg-slate-950/70 hidden flex items-center justify-center z-50 p-6">
          <div class="bg-white rounded-[28px] shadow-2xl w-full max-w-5xl max-h-[88vh] overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-emerald-50">
              <div>
                <p class="text-[10px] font-black text-blue-600 uppercase tracking-wide">Preview Mode</p>
                <h2 class="text-xl font-black text-gray-950">Student Course Preview</h2>
              </div>
              <button id="closeCoursePreviewBtn" class="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl font-bold text-sm">Return to Editor</button>
            </div>
            <div id="coursePreviewBody" class="p-6 overflow-y-auto max-h-[72vh]"></div>
          </div>
        </div>

        ${buildCreateModuleWizardModal()}

        <!-- Module Title Edit Modal -->
        <div id="moduleTitleModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50 transition-opacity">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 class="text-lg font-bold text-gray-900">Edit Module Titles</h3>
              <button id="closeModuleTitleBtn" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto" id="moduleTitleInputsContainer">
              <!-- Dynamically generated inputs based on course languages -->
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 justify-end flex gap-2">
              <button id="cancelModuleTitleBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button id="saveModuleTitleBtn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition shadow-sm">Save Titles</button>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  renderTags() {
    var container = document.getElementById('tagsContainer');
    if (!container) {
      return;
    }

    if (this.localTags.length === 0) {
      container.innerHTML = '<span class="text-gray-400 text-xs italic">No tags added yet</span>';
      return;
    }

    container.innerHTML = this.localTags.map(function (t, i) {
      return '<span class="bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm">'
        + t
        + '<i class="fa-solid fa-xmark cursor-pointer text-blue-300 hover:text-red-500 transition remove-tag-btn" data-index="' + i + '"></i>'
        + '</span>';
    }).join('');
  }

  renderLangsSelect(selectEl, selectedCodes) {
    selectEl.innerHTML = this.ALL_LANGUAGES.map(function (lang) {
      var isSelected = selectedCodes.indexOf(lang.code) !== -1;
      return '<option value="' + lang.code + '" ' + (isSelected ? 'selected' : '') + '>' + lang.name + '</option>';
    }).join('');
  }

  renderDefaultLangSelect(selectEl, selectedCodes, defaultCode) {
    var filteredLangs = this.ALL_LANGUAGES.filter(function (l) {
      return selectedCodes.indexOf(l.code) !== -1;
    });

    selectEl.innerHTML = filteredLangs.map(function (lang) {
      var isSelected = lang.code === defaultCode;
      return '<option value="' + lang.code + '" ' + (isSelected ? 'selected' : '') + '>' + lang.name + '</option>';
    }).join('');

    if (selectEl.options.length > 0 && selectEl.selectedIndex === -1) {
      selectEl.selectedIndex = 0;
    }
  }

  getLocalizedText(value, defaultLanguage) {
    var languageCode = defaultLanguage;

    if (!languageCode) {
      languageCode = 'en';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (!value || typeof value !== 'object') {
      return '';
    }

    if (typeof value[languageCode] === 'string' && value[languageCode].length > 0) {
      return value[languageCode];
    }

    if (typeof value.en === 'string' && value.en.length > 0) {
      return value.en;
    }

    if (typeof value.ru === 'string' && value.ru.length > 0) {
      return value.ru;
    }

    if (typeof value.ky === 'string' && value.ky.length > 0) {
      return value.ky;
    }

    return '';
  }

  resolveCourseTitle(course, defaultLanguage, fallbackTitle) {
    var fallback = fallbackTitle || 'Untitled Course';
    var title = '';

    if (!course || typeof course !== 'object') {
      return fallback;
    }

    title = this.getLocalizedText(course.title, defaultLanguage);
    if (title) {
      return title;
    }

    title = this.getLocalizedText(course.name, defaultLanguage);
    if (title) {
      return title;
    }

    title = this.getLocalizedText(course.displayName, defaultLanguage);
    if (title) {
      return title;
    }

    return fallback;
  }

  logCourseHeaderRender(state, course, resolvedTitle) {
    console.info("[course-header:render]", {
      isFetching: Boolean(state && state.isFetching),
      courseId: course && course.id ? course.id : this.courseId,
      rawTitle: course ? course.title : undefined,
      resolvedTitle: resolvedTitle
    });
  }

  buildLocalizedText(existingValue, defaultLanguage, inputValue) {
    var localizedText = {
      en: '',
      ru: '',
      ky: ''
    };

    if (typeof existingValue === 'string') {
      localizedText.en = existingValue;
    }

    if (existingValue && typeof existingValue === 'object') {
      localizedText.en = this.readLanguageText(existingValue.en);
      localizedText.ru = this.readLanguageText(existingValue.ru);
      localizedText.ky = this.readLanguageText(existingValue.ky);
    }

    if (defaultLanguage !== 'ru' && defaultLanguage !== 'ky') {
      defaultLanguage = 'en';
    }

    localizedText[defaultLanguage] = inputValue;
    return localizedText;
  }

  readLanguageText(value) {
    if (typeof value !== 'string') {
      return '';
    }

    return value;
  }

  readResultErrorMessage(result) {
    if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
      return result.emitted.errors[0].message || result.emitted.errors[0].code || 'Intent failed.';
    }

    if (result && result.errors && result.errors.length > 0) {
      return result.errors[0].message || result.errors[0].code || 'Intent failed.';
    }

    return 'Intent failed.';
  }

  previewCourse() {
    var body = document.getElementById('coursePreviewBody');
    var modal = document.getElementById('coursePreviewModal');
    var self = this;

    body.innerHTML = '<div class="text-center py-12 text-blue-600 font-black">Loading preview...</div>';
    modal.classList.remove('hidden');

    courseEditorService.previewCourse(this.courseId).then(function (result) {
      if (!result || !result.emitted || !result.emitted.success) {
        body.innerHTML = '<div class="text-center py-12 text-red-600 font-black">' + escapeHtml(self.readResultErrorMessage(result)) + '</div>';
        return;
      }

      body.innerHTML = buildCoursePreview(result.emitted.data.course);
    }).catch(function (error) {
      body.innerHTML = '<div class="text-center py-12 text-red-600 font-black">' + escapeHtml(error.message) + '</div>';
    });
  }

  openModuleTitleModal(moduleId) {
    this.editingModuleId = moduleId;
    var state = courseEditorStore.getState();
    var course = state.course;
    if (!course) {
      return;
    }

    var matchingModules = state.modules.filter(function (m) {
      return (m.id || m.moduleId) === moduleId;
    });
    var module = matchingModules[0];
    if (!module) {
      return;
    }

    var titleObj = module.title || (module.config && module.config.title) || {};
    if (typeof titleObj === 'string') {
      titleObj = { en: titleObj };
    }

    var supportedLangs = course.languages || ['en'];
    var container = document.getElementById('moduleTitleInputsContainer');
    var self = this;

    container.innerHTML = supportedLangs.map(function (code) {
      var matchingLang = self.ALL_LANGUAGES.filter(function (l) {
        return l.code === code;
      });
      var langDef = matchingLang[0];
      var labelName = langDef ? langDef.name : code;
      var currentVal = titleObj[code] || '';
      return '<div>'
        + '<label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">' + labelName + '</label>'
        + '<input type="text" data-lang="' + code + '" value="' + currentVal + '" class="module-title-lang-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Module name in ' + labelName + '...">'
        + '</div>';
    }).join('');

    document.getElementById('moduleTitleModal').classList.remove('hidden');
  }

  openCreateModuleWizard() {
    var modal = document.getElementById('createModuleWizardModal');
    var status = document.getElementById('moduleWizardStatus');
    var self = this;

    if (!modal) {
      return;
    }

    this.moduleWizardStep = 1;
    this.moduleWizardTemplateKey = 'school';
    this.resetCreateModuleWizardFields();
    status.textContent = 'Preparing wizard...';
    status.className = 'text-xs font-bold text-blue-700';
    modal.classList.remove('hidden');
    this.showModuleWizardStep(1);

    courseEditorService.openCreateModuleWizard(this.courseId).then(function (result) {
      if (!result || !result.emitted || !result.emitted.success) {
        status.textContent = self.readResultErrorMessage(result);
        status.className = 'text-xs font-bold text-red-700';
        return;
      }

      status.textContent = 'Ready to generate a module skeleton.';
      status.className = 'text-xs font-bold text-emerald-700';
      self.renderWizardTemplateCards();
    }).catch(function (error) {
      status.textContent = error.message;
      status.className = 'text-xs font-bold text-red-700';
    });
  }

  resetCreateModuleWizardFields() {
    setInputValue('wizardModuleTitleInput', '');
    setInputValue('wizardDescriptionInput', '');
    setInputValue('wizardSubjectInput', '');
    setInputValue('wizardTopicInput', '');
    setInputValue('wizardLevelInput', '');
    setInputValue('wizardEstimatedMinutesInput', '15');
    setInputValue('wizardLanguageSelect', 'en');
    setInputValue('wizardLearningPasteInput', 'Go = move somewhere\nStop = end movement\nTurn = change direction');
    setInputValue('wizardVocabularyInput', '');
    setInputValue('wizardDefinitionsInput', '');
    setInputValue('wizardConceptsInput', '');
    setInputValue('wizardRulesInput', '');
    setInputValue('wizardExamplesInput', '');
    setInputValue('wizardCustomContentInput', '');
    setCheckedValue('wizardGenerateStepsToggle', true);
    setElementHtml('moduleWizardWarnings', '');
    setElementHtml('moduleWizardPreview', buildWizardEmptyPreview());
    this.setModuleWizardLoadingState(false);
  }

  closeCreateModuleWizard() {
    this.setModuleWizardLoadingState(false);
    var modal = document.getElementById('createModuleWizardModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showModuleWizardStep(step) {
    this.moduleWizardStep = step;

    document.querySelectorAll('[data-wizard-step]').forEach(function (panel) {
      panel.classList.toggle('hidden', panel.getAttribute('data-wizard-step') !== String(step));
    });

    document.querySelectorAll('[data-wizard-progress]').forEach(function (item) {
      var progressStep = parseInt(item.getAttribute('data-wizard-progress'), 10);
      var isActive = progressStep === step;
      var isDone = progressStep < step;
      item.className = isActive || isDone
        ? 'flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-xs font-black text-white shadow-sm'
        : 'flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-400 ring-1 ring-slate-200';
    });

    setElementText('moduleWizardStepNumber', String(step));
    setElementText('moduleWizardStepLabel', readWizardStepLabel(step));

    var backBtn = document.getElementById('moduleWizardBackBtn');
    var nextBtn = document.getElementById('moduleWizardNextBtn');
    var createBtn = document.getElementById('moduleWizardCreateBtn');

    if (backBtn) {
      backBtn.disabled = step === 1;
      backBtn.classList.toggle('opacity-40', step === 1);
    }

    if (nextBtn) {
      nextBtn.classList.toggle('hidden', step === 4);
    }

    if (createBtn) {
      createBtn.classList.toggle('hidden', step !== 4);
    }

    if (step === 4) {
      this.previewWizardSkeleton();
    }
  }

  renderWizardTemplateCards() {
    document.querySelectorAll('.wizard-template-card').forEach(function (card) {
      var isSelected = card.getAttribute('data-template') === this.moduleWizardTemplateKey;
      card.className = isSelected
        ? 'wizard-template-card text-left rounded-2xl border-2 border-blue-400 bg-blue-50 p-4 shadow-lg shadow-blue-100 transition hover:-translate-y-1'
        : 'wizard-template-card text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md';
    }, this);
  }

  selectWizardTemplate(templateKey) {
    this.moduleWizardTemplateKey = normalizeModuleTemplateKey(templateKey);
    this.renderWizardTemplateCards();
  }

  parseWizardLearningContent() {
    var self = this;
    var rawText = readInputValue('wizardLearningPasteInput');
    var btn = document.getElementById('moduleWizardParseBtn');
    var status = document.getElementById('moduleWizardStatus');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Parsing';
    }

    courseEditorService.parseLearningContent(this.courseId, rawText).then(function (result) {
      if (!result || !result.emitted || !result.emitted.success) {
        throw new Error(self.readResultErrorMessage(result));
      }

      self.populateWizardLearningContent(result.emitted.data.learningContent);
      self.renderWizardWarnings(result.emitted.data.warnings || result.emitted.warnings || []);
      status.textContent = 'Learning content parsed. You can edit it before generating.';
      status.className = 'text-xs font-bold text-emerald-700';
    }).catch(function (error) {
      status.textContent = error.message;
      status.className = 'text-xs font-bold text-red-700';
    }).finally(function () {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Parse Content';
      }
    });
  }

  populateWizardLearningContent(learningContent) {
    var content = learningContent || {};
    setInputValue('wizardVocabularyInput', readContentLines(content.vocabulary).join('\n'));
    setInputValue('wizardDefinitionsInput', readContentLines(content.definitions).join('\n'));
    setInputValue('wizardConceptsInput', readContentLines(content.concepts).join('\n'));
    setInputValue('wizardRulesInput', readContentLines(content.rules).join('\n'));
    setInputValue('wizardExamplesInput', readContentLines(content.examples).join('\n'));
    setInputValue('wizardCustomContentInput', readContentLines(content.customContent).join('\n'));
  }

  renderWizardWarnings(warnings) {
    if (!warnings || warnings.length === 0) {
      setElementHtml('moduleWizardWarnings', '<div class="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">Parsed cleanly.</div>');
      return;
    }

    setElementHtml('moduleWizardWarnings', warnings.map(function (warning) {
      return '<div class="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">' + escapeHtml(warning.message || 'Review this parsed line.') + '</div>';
    }).join(''));
  }

  buildWizardPayload() {
    return {
      title: readInputValue('wizardModuleTitleInput'),
      description: readInputValue('wizardDescriptionInput'),
      subject: readInputValue('wizardSubjectInput'),
      topic: readInputValue('wizardTopicInput'),
      level: readInputValue('wizardLevelInput'),
      estimatedMinutes: readNumberInput('wizardEstimatedMinutesInput', 15),
      language: readInputValue('wizardLanguageSelect') || 'en',
      templateKey: this.moduleWizardTemplateKey,
      generateStarterSteps: readCheckedValue('wizardGenerateStepsToggle'),
      learningContent: {
        vocabulary: readTextareaLines('wizardVocabularyInput'),
        definitions: readTextareaLines('wizardDefinitionsInput'),
        concepts: readTextareaLines('wizardConceptsInput'),
        rules: readTextareaLines('wizardRulesInput'),
        examples: readTextareaLines('wizardExamplesInput'),
        customContent: readTextareaLines('wizardCustomContentInput'),
        notes: ''
      }
    };
  }

  previewWizardSkeleton() {
    var preview = document.getElementById('moduleWizardPreview');
    var payload = this.buildWizardPayload();

    if (!preview) {
      return;
    }

    preview.innerHTML = '<div class="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-black text-blue-700">Generating preview...</div>';

    courseEditorService.generateModuleSkeleton(this.courseId, payload).then(function (result) {
      if (!result || !result.emitted || !result.emitted.success) {
        preview.innerHTML = '<div class="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-black text-red-700">Preview failed.</div>';
        return;
      }

      preview.innerHTML = buildWizardSkeletonPreview(result.emitted.data);
    }).catch(function (error) {
      preview.innerHTML = '<div class="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-black text-red-700">' + escapeHtml(error.message) + '</div>';
    });
  }

  async createModuleFromWizard() {
    var payload = this.buildWizardPayload();
    var title = payload.title.trim();
    var status = document.getElementById('moduleWizardStatus');
    var btn = document.getElementById('moduleWizardCreateBtn');
    var createdModuleId = '';
    var didCreate = false;

    if (!title) {
      status.textContent = 'Module title is required.';
      status.className = 'text-xs font-bold text-red-700';
      this.showModuleWizardStep(1);
      return;
    }

    this.showModuleWizardStep(4);
    this.setModuleWizardLoadingState(true, 'Creating module...');

    try {
      var result = await courseEditorService.createModuleFromWizard(this.courseId, payload);
      if (!result || !result.emitted || !result.emitted.success) {
        throw new Error(this.readResultErrorMessage(result));
      }

      didCreate = true;
      createdModuleId = result.emitted.data && (result.emitted.data.id || result.emitted.data.moduleId)
        ? result.emitted.data.id || result.emitted.data.moduleId
        : '';
      this.setModuleWizardSuccessState();
      showModuleStatusMsg(
        document.getElementById('moduleCreateStatusMsg'),
        'success',
        '<span class="oqu-success-icon">&#10003;</span> Module created.'
      );
      setTimeout(function () {
        var statusMsg = document.getElementById('moduleCreateStatusMsg');
        if (statusMsg) {
          statusMsg.style.display = 'none';
        }
      }, 2200);

      await waitForMilliseconds(850);
      this.closeCreateModuleWizard();

      if (createdModuleId) {
        window.location.hash = '#module-editor?courseId=' + encodeURIComponent(this.courseId) + '&moduleId=' + encodeURIComponent(createdModuleId);
      }
    } catch (error) {
      status.textContent = error.message;
      status.className = 'text-xs font-bold text-red-700';
      this.setModuleWizardLoadingState(false);
      this.setModuleWizardErrorState(error.message);
    } finally {
      if (didCreate) {
        this.stopModuleWizardMessageRotation();
      }

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-sparkles"></i> Create Module';
      }
    }
  }

  setModuleWizardLoadingState(isLoading, message) {
    var overlay = document.getElementById('moduleWizardLoadingOverlay');
    var status = document.getElementById('moduleWizardStatus');
    var createBtn = document.getElementById('moduleWizardCreateBtn');

    this.stopModuleWizardMessageRotation();

    setModuleWizardControlsDisabled(isLoading);

    if (createBtn) {
      createBtn.disabled = isLoading;
      if (isLoading) {
        createBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Generating';
      } else {
        createBtn.innerHTML = '<i class="fa-solid fa-sparkles"></i> Create Module';
      }
    }

    if (!overlay) {
      return;
    }

    if (!isLoading) {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      return;
    }

    overlay.classList.remove('hidden');
    overlay.innerHTML = buildWizardLoadingState(message || 'Creating module...');
    this.startModuleWizardMessageRotation();

    if (status) {
      status.textContent = 'Building your module...';
      status.className = 'text-xs font-bold text-blue-700';
    }
  }

  startModuleWizardMessageRotation() {
    var messageEl = document.getElementById('moduleWizardLoadingMessage');
    var messages = [
      'Creating module...',
      'Building Learning Content...',
      'Creating Primary Mode...',
      'Preparing starter steps...',
      'Almost ready...'
    ];
    var index = 0;

    if (!messageEl) {
      return;
    }

    messageEl.textContent = messages[index];
    this.moduleWizardLoadingTimer = setInterval(function () {
      index = (index + 1) % messages.length;
      messageEl.textContent = messages[index];
    }, 1100);
  }

  stopModuleWizardMessageRotation() {
    if (this.moduleWizardLoadingTimer) {
      clearInterval(this.moduleWizardLoadingTimer);
      this.moduleWizardLoadingTimer = null;
    }
  }

  setModuleWizardSuccessState() {
    var overlay = document.getElementById('moduleWizardLoadingOverlay');
    var status = document.getElementById('moduleWizardStatus');

    this.stopModuleWizardMessageRotation();

    if (overlay) {
      overlay.classList.remove('hidden');
      overlay.innerHTML = buildWizardSuccessState();
    }

    if (status) {
      status.textContent = 'Module created!';
      status.className = 'text-xs font-bold text-emerald-700';
    }
  }

  setModuleWizardErrorState(message) {
    var overlay = document.getElementById('moduleWizardLoadingOverlay');

    this.stopModuleWizardMessageRotation();
    setModuleWizardControlsDisabled(false);

    if (overlay) {
      overlay.classList.remove('hidden');
      overlay.innerHTML = buildWizardErrorState(message || 'Module generation failed. Try again.');
      var dismissBtn = document.getElementById('moduleWizardDismissErrorBtn');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', function () {
          overlay.classList.add('hidden');
          overlay.innerHTML = '';
        });
      }
    }
  }

  logCourseEditorContext(course) {
    var stateCourseId = course && course.id ? course.id : "";
    var signature = (this.courseId || "") + "|" + stateCourseId;

    if (this.lastLoggedCourseContext === signature) {
      return;
    }

    this.lastLoggedCourseContext = signature;
    console.info("[course-editor:context]", {
      routeCourseId: this.courseId,
      stateCourseId: stateCourseId,
      openedCourseId: stateCourseId,
      catalogPath: "catalogCourses/" + (this.courseId || "") + "/modules"
    });
  }

  attachEvents() {
    var self = this;
    courseEditorStore.resetState();

    this.unsubscribe = courseEditorStore.subscribe(function (newState) {
      self.updateUI(newState);
    });

    console.info("[course-editor:context]", {
      routeCourseId: this.courseId,
      stateCourseId: "",
      openedCourseId: "",
      catalogPath: "catalogCourses/" + (this.courseId || "") + "/modules"
    });

    courseEditorService.openCourseEditor(this.courseId);
    this.loadAssignments();
    this.loadExternalTaskSubmissions();

    if (this.options.focusAssignment) {
      setTimeout(function () {
        var assignmentButton = document.getElementById('createAssignmentBtn');
        if (assignmentButton) {
          assignmentButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600);
    }

    if (this.options.openPreview) {
      setTimeout(function () {
        self.previewCourse();
      }, 900);
    }

    if (this.options.publishOnOpen) {
      setTimeout(function () {
        courseEditorService.publishCourse(self.courseId);
      }, 900);
    }

    document.getElementById('refreshAssignmentsBtn').addEventListener('click', function () {
      self.loadAssignments();
    });

    document.getElementById('refreshExternalTasksBtn').addEventListener('click', function () {
      self.loadExternalTaskSubmissions();
    });

    document.getElementById('externalTaskFilters').addEventListener('click', function (e) {
      var filterBtn = e.target.closest('.external-task-filter-btn');
      if (filterBtn) {
        self.externalTaskStatusFilter = filterBtn.getAttribute('data-status') || 'pending';
        self.renderExternalTaskFilters();
        self.loadExternalTaskSubmissions();
      }
    });

    document.getElementById('externalTaskReviewList').addEventListener('click', function (e) {
      var reviewBtn = e.target.closest('.external-task-review-btn');
      if (reviewBtn) {
        self.reviewExternalTaskSubmission(
          reviewBtn.getAttribute('data-id'),
          reviewBtn.getAttribute('data-review-status')
        );
      }
    });

    document.getElementById('createAssignmentBtn').addEventListener('click', function () {
      self.createAssignment();
    });

    document.getElementById('assignmentList').addEventListener('click', function (e) {
      var statusBtn = e.target.closest('.assignment-status-btn');
      var archiveBtn = e.target.closest('.assignment-archive-btn');

      if (statusBtn) {
        self.updateAssignmentStatus(
          statusBtn.getAttribute('data-id'),
          statusBtn.getAttribute('data-status')
        );
        return;
      }

      if (archiveBtn) {
        self.archiveAssignment(archiveBtn.getAttribute('data-id'));
      }
    });

    document.getElementById('publishCourseBtn').addEventListener('click', function () {
      courseEditorService.publishCourse(self.courseId);
    });

    document.getElementById('previewCourseBtn').addEventListener('click', function () {
      self.previewCourse();
    });

    document.getElementById('archiveCourseBtn').addEventListener('click', function () {
      courseEditorService.archiveCourse(self.courseId).then(function (result) {
        if (!result || !result.emitted || !result.emitted.success) {
          alert('Archive failed: ' + self.readResultErrorMessage(result));
          return;
        }
        alert('Course archived.');
        courseEditorService.openCourseEditor(self.courseId);
      });
    });

    document.getElementById('closeCoursePreviewBtn').addEventListener('click', function () {
      document.getElementById('coursePreviewModal').classList.add('hidden');
    });

    document.getElementById('addModuleBtn').addEventListener('click', function () {
      self.openCreateModuleWizard();
    });

    document.getElementById('moduleRepairBanner').addEventListener('click', function (e) {
      var repairBtn = e.target.closest('#repairCourseModulesBtn');
      if (repairBtn) {
        self.repairCourseModules();
      }
    });

    document.getElementById('moduleWizardCloseBtn').addEventListener('click', function () {
      self.closeCreateModuleWizard();
    });

    document.getElementById('moduleWizardCancelBtn').addEventListener('click', function () {
      self.closeCreateModuleWizard();
    });

    document.getElementById('moduleWizardBackBtn').addEventListener('click', function () {
      self.showModuleWizardStep(Math.max(1, self.moduleWizardStep - 1));
    });

    document.getElementById('moduleWizardNextBtn').addEventListener('click', function () {
      self.showModuleWizardStep(Math.min(4, self.moduleWizardStep + 1));
    });

    document.getElementById('moduleWizardParseBtn').addEventListener('click', function () {
      self.parseWizardLearningContent();
    });

    document.getElementById('moduleWizardPreviewBtn').addEventListener('click', function () {
      self.previewWizardSkeleton();
    });

    document.getElementById('moduleWizardCreateBtn').addEventListener('click', function () {
      self.createModuleFromWizard();
    });

    document.querySelectorAll('.wizard-template-card').forEach(function (card) {
      card.addEventListener('click', function () {
        self.selectWizardTemplate(card.getAttribute('data-template'));
      });
    });

    // Event delegation for opening Module Step Editor and Title Modal
    var tbody = document.getElementById('moduleTableBody');
    tbody.addEventListener('click', function (e) {
      var editBtn = e.target.closest('.open-module-btn');
      if (editBtn) {
        var moduleId = editBtn.getAttribute('data-id');
        window.location.hash = '#module-editor?courseId=' + self.courseId + '&moduleId=' + moduleId;
        return;
      }

      var titleBtn = e.target.closest('.edit-module-name-btn');
      if (titleBtn) {
        var moduleId = titleBtn.getAttribute('data-id');
        self.openModuleTitleModal(moduleId);
      }
    });

    // Drag and Drop Module Reordering
    var draggedRowIndex = null;

    tbody.addEventListener('dragstart', function (e) {
      var row = e.target.closest('tr.module-row');
      if (!row) {
        return;
      }
      draggedRowIndex = parseInt(row.getAttribute('data-index'), 10);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', row.innerHTML);
      row.classList.add('opacity-50');
    });

    tbody.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      var row = e.target.closest('tr.module-row');
      if (row && row.getAttribute('data-index') !== String(draggedRowIndex)) {
        row.classList.add('bg-blue-50', 'border-t-2', 'border-blue-400');
      }
      return false;
    });

    tbody.addEventListener('dragleave', function (e) {
      var row = e.target.closest('tr.module-row');
      if (row) {
        row.classList.remove('bg-blue-50', 'border-t-2', 'border-blue-400');
      }
    });

    tbody.addEventListener('drop', function (e) {
      e.stopPropagation();
      var row = e.target.closest('tr.module-row');
      if (row) {
        row.classList.remove('bg-blue-50', 'border-t-2', 'border-blue-400');
        var dropIndex = parseInt(row.getAttribute('data-index'), 10);
        if (draggedRowIndex !== null && draggedRowIndex !== dropIndex) {
          courseEditorService.reorderModules(self.courseId, draggedRowIndex, dropIndex).then(function () {
            courseEditorService.saveDraft(self.courseId);
          });
        }
      }
      return false;
    });

    tbody.addEventListener('dragend', function (e) {
      var row = e.target.closest('tr.module-row');
      if (row) {
        row.classList.remove('opacity-50');
      }
      var rows = tbody.querySelectorAll('tr.module-row');
      for (var i = 0; i < rows.length; i++) {
        rows[i].classList.remove('bg-blue-50', 'border-t-2', 'border-blue-400');
      }
      draggedRowIndex = null;
    });

    // Track when user is typing/editing locally so we don't accidentally overwrite with state polling
    var inputs = document.querySelectorAll('.course-meta-input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('input', function () { self.userHasEditedMetadata = true; });
      inputs[i].addEventListener('change', function () { self.userHasEditedMetadata = true; });
    }

    // Tags Logic
    var newTagInput = document.getElementById('newTagInput');
    var addTagBtn = document.getElementById('addTagBtn');

    function addTag() {
      var val = newTagInput.value.trim();
      if (val && self.localTags.indexOf(val) === -1) {
        self.localTags.push(val);
        self.renderTags();
        self.userHasEditedMetadata = true;
        newTagInput.value = '';
      }
    }

    addTagBtn.addEventListener('click', addTag);
    newTagInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addTag();
      }
    });
    document.getElementById('tagsContainer').addEventListener('click', function (e) {
      if (e.target.classList.contains('remove-tag-btn')) {
        var idx = parseInt(e.target.getAttribute('data-index'), 10);
        self.localTags.splice(idx, 1);
        self.renderTags();
        self.userHasEditedMetadata = true;
      }
    });

    // Language Select dependent logic
    var langsSelect = document.getElementById('courseLangsSelect');
    var dLangSelect = document.getElementById('courseDefaultLangSelect');
    langsSelect.addEventListener('change', function () {
      self.userHasEditedMetadata = true;
      var selectedCodes = [];
      for (var i = 0; i < langsSelect.options.length; i++) {
        if (langsSelect.options[i].selected) {
          selectedCodes.push(langsSelect.options[i].value);
        }
      }
      var currentDefault = dLangSelect.value;
      self.renderDefaultLangSelect(dLangSelect, selectedCodes, currentDefault);
    });

    // Submit Save Settings
    document.getElementById('saveMetadataBtn').addEventListener('click', function () {
      var state = courseEditorStore.getState();
      var course = state.course || {};
      var title = document.getElementById('courseTitleInput').value.trim();
      var description = document.getElementById('courseDescriptionInput').value.trim();
      var subject = document.getElementById('courseSubjectInput').value.trim();
      var level = document.getElementById('courseLevelInput').value.trim();
      var status = document.getElementById('courseStatusSelect').value || 'draft';
      var langs = [];
      for (var i = 0; i < langsSelect.options.length; i++) {
        if (langsSelect.options[i].selected) {
          langs.push(langsSelect.options[i].value);
        }
      }
      var defaultLang = dLangSelect.value;
      var btn = document.getElementById('saveMetadataBtn');

      btn.innerHTML = '<span class="oqu-spinner"></span> Saving\u2026';
      btn.disabled = true;
      btn.classList.add('oqu-btn-pending');

      courseEditorService.updateCourseMetadata(self.courseId, {
        title: self.buildLocalizedText(course.title, defaultLang || 'en', title),
        description: self.buildLocalizedText(course.description, defaultLang || 'en', description),
        subject: subject,
        level: level,
        language: defaultLang || 'en',
        status: status,
        tags: self.localTags.slice(),
        languages: langs.length ? langs : ['en'],
        defaultLanguage: defaultLang || 'en'
      }).then(function (result) {
        btn.disabled = false;
        btn.classList.remove('oqu-btn-pending');

        if (!result || !result.emitted || !result.emitted.success) {
          btn.textContent = 'Save Settings';
          return;
        }

        self.userHasEditedMetadata = false;
        btn.innerHTML = '<span class="oqu-success-icon">&#10003;</span> Saved';
        btn.classList.replace('bg-gray-900', 'bg-green-600');
        setTimeout(function () {
          btn.textContent = 'Save Settings';
          btn.classList.replace('bg-green-600', 'bg-gray-900');
        }, 2000);
      }).catch(function (err) {
        btn.textContent = 'Save Settings';
        btn.disabled = false;
        btn.classList.remove('oqu-btn-pending');
        console.error('[CourseOverview] Save settings failed:', err);
      });
    });

    // Module Title Modal Events
    function closeModalFn() {
      document.getElementById('moduleTitleModal').classList.add('hidden');
    }

    document.getElementById('closeModuleTitleBtn').addEventListener('click', closeModalFn);
    document.getElementById('cancelModuleTitleBtn').addEventListener('click', closeModalFn);
    document.getElementById('saveModuleTitleBtn').addEventListener('click', function () {
      if (!self.editingModuleId) {
        return;
      }
      var titleInputs = document.querySelectorAll('.module-title-lang-input');
      var newTitleObj = {};
      for (var i = 0; i < titleInputs.length; i++) {
        var langCode = titleInputs[i].getAttribute('data-lang');
        var val = titleInputs[i].value.trim();
        if (val) {
          newTitleObj[langCode] = val;
        }
      }
      if (Object.keys(newTitleObj).length === 0) {
        newTitleObj.en = 'Untitled Module';
      }

      courseEditorService.updateModule(self.courseId, self.editingModuleId, {
        title: newTitleObj,
        description: {},
        status: 'draft'
      });
      closeModalFn();
    });
  }

  updateUI(state) {
    if (state.error && !state.course) {
      document.getElementById('headerContextualTitle').textContent = 'Could not load course';
      this.renderCourseSummary(null, state);
      document.getElementById('moduleTableBody').innerHTML = '<tr><td colspan="6" class="py-6 border-b bg-red-50">'
        + createErrorState('Could not load course', state.error, {
          className: 'rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700 flex flex-col gap-1'
        })
        + '</td></tr>';
      return;
    }

    if (!state.course && state.isFetching) {
      this.logCourseHeaderRender(state, null, 'Loading course...');
      document.getElementById('headerContextualTitle').textContent = 'Loading course...';
      this.renderCourseSummary(null, state);
      document.getElementById('moduleTableBody').innerHTML = buildModuleSkeletonRows(3);
      return;
    }

    var course = state.course;
    if (course) {
      var defaultLanguage = course.defaultLanguage || 'en';
      var courseTitle = this.resolveCourseTitle(course, defaultLanguage, 'Untitled Course');
      this.logCourseHeaderRender(state, course, courseTitle);
      this.logCourseEditorContext(course);
      document.getElementById('headerContextualTitle').innerHTML = escapeHtml(courseTitle) + ' <span class="text-gray-400 mx-1">&rarr;</span> Config &amp; Modules Overview';

      if (!this.userHasEditedMetadata) {
        var titleInput = document.getElementById('courseTitleInput');
        titleInput.value = this.resolveCourseTitle(course, defaultLanguage, 'Untitled Course');

        var descriptionInput = document.getElementById('courseDescriptionInput');
        descriptionInput.value = this.getLocalizedText(course.description, defaultLanguage);

        var statusSelect = document.getElementById('courseStatusSelect');
        statusSelect.value = course.status || 'draft';

        document.getElementById('courseSubjectInput').value = course.subject || '';
        document.getElementById('courseLevelInput').value = course.level || '';

        this.localTags = (course.tags || []).slice();
        this.renderTags();

        var langsSelect = document.getElementById('courseLangsSelect');
        var supportedLangs = course.languages || ['en'];
        this.renderLangsSelect(langsSelect, supportedLangs);

        var dLangSelect = document.getElementById('courseDefaultLangSelect');
        this.renderDefaultLangSelect(dLangSelect, supportedLangs, course.defaultLanguage || 'en');
      }

      document.getElementById('courseVersionText').textContent = course.version || 1;
      document.getElementById('courseStatusText').textContent = course.status || 'draft';
      this.renderCourseSummary(course, state);
    } else {
      this.logCourseHeaderRender(state, null, 'Untitled Course');
      document.getElementById('headerContextualTitle').textContent = 'Course not found';
      this.renderCourseSummary(null, state);
    }

    var saveIndicator = document.getElementById('saveStatusIndicator');
    if (state.isDraftSaving) {
      saveIndicator.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';
      saveIndicator.classList.remove('hidden');
      saveIndicator.className = 'text-yellow-600 font-medium flex items-center gap-1 mr-2';
    } else if (state.error && state.course) {
      saveIndicator.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Could not save changes';
      saveIndicator.classList.remove('hidden');
      saveIndicator.className = 'text-red-600 font-medium flex items-center gap-1 mr-2';
    } else if (state.lastSaved) {
      saveIndicator.innerHTML = '<i class="fa-regular fa-circle-check"></i> Saved';
      saveIndicator.classList.remove('hidden');
      saveIndicator.className = 'text-green-600 font-medium flex items-center gap-1 mr-2';
    }

    this.renderModuleRepairBanner(state);
    this.renderModuleList(state.modules, state.course, state.moduleSourceCheck);
  }

  renderCourseSummary(course, state) {
    var summary = document.getElementById('courseOverviewSummary');
    var safeModules = state && Array.isArray(state.modules) ? state.modules : [];

    if (!summary) {
      return;
    }

    if (!course && state && state.isFetching) {
      summary.innerHTML = createLoadingState('Loading course...', {
        className: 'flex items-center gap-2 text-xs font-semibold text-gray-500',
        beforeHtml: '<i class="fa-solid fa-circle-notch fa-spin text-blue-500"></i>'
      });
      return;
    }

    if (!course && state && state.error) {
      summary.innerHTML = createErrorState('Could not load course', state.error, {
        className: 'rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700 flex flex-col gap-1'
      });
      return;
    }

    if (!course) {
      summary.innerHTML = createEmptyState('Course not found', 'Open a course from the catalog to edit modules and settings.', {
        className: 'rounded-lg border border-dashed border-gray-300 bg-white p-3 text-xs text-gray-500',
        titleTag: 'strong',
        messageTag: 'p'
      });
      return;
    }

    var defaultLanguage = course.defaultLanguage || 'en';
    var title = this.resolveCourseTitle(course, defaultLanguage, 'Untitled Course');
    var description = this.getLocalizedText(course.description, defaultLanguage) || 'No description yet.';
    var status = course.status || 'draft';
    var visibility = readCourseVisibility(course);
    var moduleCount = safeModules.length;
    var stepCount = countCourseSteps(safeModules);
    var updatedAt = formatCourseDate(course.updatedAt || course.modifiedAt || course.createdAt);
    var assignmentsSummary = summarizeAssignments(this.assignments);

    summary.innerHTML = '<div class="space-y-3">'
      + '<div class="flex items-start justify-between gap-3">'
      + '<div class="min-w-0">'
      + '<div class="text-sm font-black text-gray-900 truncate">' + escapeHtml(title) + '</div>'
      + '<p class="mt-1 line-clamp-2 text-xs font-medium text-gray-500">' + escapeHtml(description) + '</p>'
      + '</div>'
      + createStatusBadge(status, {
        className: 'shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide bg-white text-gray-700 border-gray-200',
        statusClassPrefix: ''
      })
      + '</div>'
      + '<div class="grid grid-cols-2 gap-2">'
      + buildCourseSummaryItem('Visibility', visibility)
      + buildCourseSummaryItem('Modules', String(moduleCount))
      + buildCourseSummaryItem('Steps', String(stepCount))
      + buildCourseSummaryItem('Updated', updatedAt)
      + '</div>'
      + '<div class="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-800">'
      + escapeHtml(assignmentsSummary)
      + '</div>'
      + '</div>';
  }

  renderModuleRepairBanner(state) {
    var banner = document.getElementById('moduleRepairBanner');
    var sourceCheck = state && state.moduleSourceCheck ? state.moduleSourceCheck : null;

    if (!banner) {
      return;
    }

    if (!sourceCheck || !sourceCheck.needsModuleMigration) {
      banner.classList.add('hidden');
      banner.innerHTML = '';
      return;
    }

    var legacyCount = typeof sourceCheck.legacyCoursesModulesCount === 'number' ? sourceCheck.legacyCoursesModulesCount : 0;
    var isRepairing = Boolean(state.isRepairingModules);
    banner.classList.remove('hidden');
    banner.innerHTML = '<div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">'
      + '<div class="flex items-center justify-between gap-4">'
      + '<div>'
      + '<p class="text-sm font-black">Legacy modules were found for this course.</p>'
      + '<p class="mt-1 text-xs font-semibold text-amber-800">Showing ' + legacyCount + ' module' + (legacyCount === 1 ? '' : 's') + ' from courses/{courseId}/modules. Repair copies them to catalogCourses/{courseId}/modules without deleting legacy data.</p>'
      + '</div>'
      + '<button id="repairCourseModulesBtn" class="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300" ' + (isRepairing ? 'disabled' : '') + '>'
      + (isRepairing ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Repairing...' : '<i class="fa-solid fa-screwdriver-wrench"></i> Repair Course Modules')
      + '</button>'
      + '</div>'
      + '</div>';
  }

  repairCourseModules() {
    var self = this;

    courseEditorService.repairCourseModules(this.courseId).then(function (result) {
      if (!result || !result.emitted || !result.emitted.success) {
        alert('Repair failed: ' + self.readResultErrorMessage(result));
      }
    }).catch(function (error) {
      alert('Repair failed: ' + error.message);
    });
  }

  loadAssignments() {
    var self = this;
    this.assignmentsLoading = true;
    this.renderAssignments();
    this.showAssignmentStatus('loading', 'Loading assignments...');

    courseAssignmentService.listCourseAssignments(this.courseId).then(function (assignments) {
      self.assignments = assignments;
      self.assignmentsLoading = false;
      self.renderAssignments();
      self.renderCourseSummary(courseEditorStore.getState().course, courseEditorStore.getState());
      self.showAssignmentStatus('success', 'Assignments loaded.');
      setTimeout(function () {
        self.hideAssignmentStatus();
      }, 1400);
    }).catch(function (error) {
      self.assignmentsLoading = false;
      self.renderAssignments();
      self.renderCourseSummary(courseEditorStore.getState().course, courseEditorStore.getState());
      self.showAssignmentStatus('error', error.message);
    });
  }

  createAssignment() {
    var self = this;
    var targetTypeSelect = document.getElementById('assignmentTargetTypeSelect');
    var targetIdInput = document.getElementById('assignmentTargetIdInput');
    var statusSelect = document.getElementById('assignmentStatusSelect');
    var createButton = document.getElementById('createAssignmentBtn');
    var targetId = targetIdInput.value.trim();

    if (!targetId) {
      this.showAssignmentStatus('error', 'Add a target ID before assigning the course.');
      return;
    }

    createButton.disabled = true;
    createButton.textContent = 'Assigning...';
    this.showAssignmentStatus('loading', 'Creating assignment...');

    courseAssignmentService.createCourseAssignment(
      this.courseId,
      targetTypeSelect.value,
      targetId,
      statusSelect.value
    ).then(function () {
      targetIdInput.value = '';
      createButton.disabled = false;
      createButton.textContent = 'Assign Course';
      self.showAssignmentStatus('success', 'Course assignment saved.');
      self.loadAssignments();
    }).catch(function (error) {
      createButton.disabled = false;
      createButton.textContent = 'Assign Course';
      self.showAssignmentStatus('error', error.message);
    });
  }

  updateAssignmentStatus(assignmentId, status) {
    var self = this;
    var isDisable = status === 'disabled';
    this.assignmentPendingId = assignmentId;
    this.assignmentPendingAction = isDisable ? 'disable' : 'update';
    this.renderAssignments();
    this.showAssignmentStatus('loading', isDisable ? 'Disabling assignment...' : 'Updating assignment...');

    var request = isDisable
      ? courseAssignmentService.disableCourseAssignment(assignmentId)
      : courseAssignmentService.updateCourseAssignment(assignmentId, status);

    request.then(function () {
      self.assignmentPendingId = "";
      self.assignmentPendingAction = "";
      self.showAssignmentStatus('success', isDisable ? 'Assignment disabled.' : 'Assignment updated.');
      self.loadAssignments();
    }).catch(function (error) {
      self.assignmentPendingId = "";
      self.assignmentPendingAction = "";
      self.renderAssignments();
      self.showAssignmentStatus('error', error.message);
    });
  }

  archiveAssignment(assignmentId) {
    var self = this;
    this.assignmentPendingId = assignmentId;
    this.assignmentPendingAction = 'archive';
    this.renderAssignments();
    this.showAssignmentStatus('loading', 'Archiving assignment...');

    courseAssignmentService.archiveCourseAssignment(assignmentId).then(function () {
      self.assignmentPendingId = "";
      self.assignmentPendingAction = "";
      self.showAssignmentStatus('success', 'Assignment archived.');
      self.loadAssignments();
    }).catch(function (error) {
      self.assignmentPendingId = "";
      self.assignmentPendingAction = "";
      self.renderAssignments();
      self.showAssignmentStatus('error', error.message);
    });
  }

  renderAssignments() {
    var list = document.getElementById('assignmentList');

    if (!list) {
      return;
    }

    if (this.assignmentsLoading) {
      list.innerHTML = buildAssignmentSkeletonRows(2);
      return;
    }

    if (!this.assignments || this.assignments.length === 0) {
      list.innerHTML = '<div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-500 font-medium">No assignments yet. Add a class, student, or location target above.</div>';
      return;
    }

    var pendingId = this.assignmentPendingId;
    var pendingAction = this.assignmentPendingAction;

    list.innerHTML = this.assignments.map(function (assignment) {
      return buildAssignmentRow(assignment, {
        isPending: pendingId && pendingId === assignment.id,
        pendingAction: pendingAction
      });
    }).join('');
  }

  loadExternalTaskSubmissions() {
    var self = this;
    this.externalTaskLoading = true;
    this.renderExternalTaskSubmissions();
    this.showExternalTaskStatus('loading', 'Loading external task submissions...');

    externalTaskReviewService.loadSubmissions({
      courseId: this.courseId,
      reviewStatus: this.externalTaskStatusFilter
    }).then(function (submissions) {
      self.externalTaskSubmissions = submissions;
      self.showExternalTaskStatus('success', 'Review queue loaded.');
      setTimeout(function () {
        self.hideExternalTaskStatus();
      }, 1400);
    }).catch(function (error) {
      self.showExternalTaskStatus('error', error.message);
    }).finally(function () {
      self.externalTaskLoading = false;
      self.renderExternalTaskSubmissions();
    });
  }

  reviewExternalTaskSubmission(submissionId, reviewStatus) {
    var self = this;
    var feedbackInput = document.querySelector('.external-task-feedback-input[data-id="' + cssEscape(submissionId) + '"]');
    var feedback = feedbackInput ? feedbackInput.value : '';

    this.externalTaskPendingId = submissionId;
    this.renderExternalTaskSubmissions();
    this.showExternalTaskStatus('loading', 'Saving review...');

    externalTaskReviewService.reviewSubmission(submissionId, reviewStatus, feedback).then(function () {
      self.externalTaskPendingId = "";
      self.showExternalTaskStatus('success', 'Review saved.');
      self.loadExternalTaskSubmissions();
    }).catch(function (error) {
      self.externalTaskPendingId = "";
      self.renderExternalTaskSubmissions();
      self.showExternalTaskStatus('error', error.message);
    });
  }

  renderExternalTaskFilters() {
    var filters = document.getElementById('externalTaskFilters');

    if (!filters) {
      return;
    }

    filters.innerHTML = buildExternalTaskFilterButton('pending', this.externalTaskStatusFilter)
      + buildExternalTaskFilterButton('needsWork', this.externalTaskStatusFilter)
      + buildExternalTaskFilterButton('complete', this.externalTaskStatusFilter)
      + buildExternalTaskFilterButton('incomplete', this.externalTaskStatusFilter);
  }

  renderExternalTaskSubmissions() {
    var list = document.getElementById('externalTaskReviewList');
    var pendingId = this.externalTaskPendingId;

    if (!list) {
      return;
    }

    if (this.externalTaskLoading) {
      list.innerHTML = buildAssignmentSkeletonRows(2);
      return;
    }

    if (!this.externalTaskSubmissions || this.externalTaskSubmissions.length === 0) {
      list.innerHTML = '<div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-500 font-medium">No external task submissions yet.</div>';
      return;
    }

    list.innerHTML = this.externalTaskSubmissions.map(function (submission) {
      return buildExternalTaskSubmissionCard(submission, pendingId === submission.id);
    }).join('');
  }

  showExternalTaskStatus(type, message) {
    var statusMessage = document.getElementById('externalTaskStatusMessage');

    if (!statusMessage) {
      return;
    }

    var colorClass = 'text-blue-700 bg-blue-50 border-blue-100';

    if (type === 'error') {
      colorClass = 'text-red-700 bg-red-50 border-red-100';
    }

    if (type === 'success') {
      colorClass = 'text-green-700 bg-green-50 border-green-100';
    }

    statusMessage.className = 'mb-3 rounded-lg border px-3 py-2 text-xs font-semibold ' + colorClass;
    statusMessage.textContent = message;
  }

  hideExternalTaskStatus() {
    var statusMessage = document.getElementById('externalTaskStatusMessage');

    if (statusMessage) {
      statusMessage.className = 'hidden mb-3 text-xs font-semibold';
      statusMessage.textContent = '';
    }
  }

  showAssignmentStatus(type, message) {
    var statusMessage = document.getElementById('assignmentStatusMessage');

    if (!statusMessage) {
      return;
    }

    var colorClass = 'text-blue-700 bg-blue-50 border-blue-100';

    if (type === 'error') {
      colorClass = 'text-red-700 bg-red-50 border-red-100';
    }

    if (type === 'success') {
      colorClass = 'text-green-700 bg-green-50 border-green-100';
    }

    statusMessage.className = 'mb-3 text-xs font-semibold border rounded-lg px-3 py-2 ' + colorClass;
    statusMessage.textContent = message;
  }

  hideAssignmentStatus() {
    var statusMessage = document.getElementById('assignmentStatusMessage');

    if (statusMessage) {
      statusMessage.className = 'hidden mb-3 text-xs font-semibold';
      statusMessage.textContent = '';
    }
  }

  renderModuleList(modules, course, moduleSourceCheck) {
    var tbody = document.getElementById('moduleTableBody');
    var safeModules = Array.isArray(modules) ? modules : [];

    console.info("[course-editor:render-modules]", {
      renderedModuleCount: safeModules.length,
      moduleIds: safeModules.map(readModuleId),
      moduleTitles: safeModules.map(readModuleTitle)
    });

    console.info("[course:render:modules]", {
      renderedModuleCount: safeModules.length,
      renderedModuleIds: safeModules.map(readModuleId),
      renderedModuleTitles: safeModules.map(readModuleTitle),
      moduleSource: moduleSourceCheck && moduleSourceCheck.moduleSource ? moduleSourceCheck.moduleSource : 'catalogCourses'
    });

    if (safeModules.length === 0) {
      var courseModuleCount = course && typeof course.moduleCount === 'number' ? course.moduleCount : 0;
      var courseModuleOrder = course && Array.isArray(course.moduleOrder) ? course.moduleOrder : [];
      var hasLegacyModules = moduleSourceCheck && moduleSourceCheck.legacyCoursesModulesCount > 0;

      if (course && (courseModuleCount > 0 || courseModuleOrder.length > 0 || hasLegacyModules)) {
        console.warn("[course-editor:render-module-mismatch]", {
          courseId: course.id || this.courseId,
          moduleCount: courseModuleCount,
          loadedModuleDocCount: 0,
          moduleOrder: courseModuleOrder,
          moduleSourceCheck: moduleSourceCheck || null
        });
        tbody.innerHTML = '<tr><td colspan="6" class="py-6 border-b bg-amber-50">'
          + createErrorState('Module documents were not loaded', 'This course says it has modules, but no module documents were loaded. Use Repair Course Modules if legacy modules are detected.', {
            className: 'rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold text-amber-800 flex flex-col gap-1'
          })
          + '</td></tr>';
        return;
      }

      tbody.innerHTML = '<tr><td colspan="6" class="py-6 border-b">'
        + createEmptyState('This course does not have modules yet.', 'Create a module to start building the learning path.', {
          className: 'rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500',
          titleTag: 'strong',
          messageTag: 'p'
        })
        + '</td></tr>';
      return;
    }

    tbody.innerHTML = safeModules.map(function (m, idx) {
      var moduleDisplay = normalizeModuleDisplay(m, idx);
      var moduleSource = moduleSourceCheck && moduleSourceCheck.moduleSource ? moduleSourceCheck.moduleSource : 'catalogCourses';

      console.info("[course-render:module-card]", {
        moduleId: moduleDisplay.id,
        title: moduleDisplay.title,
        status: moduleDisplay.status,
        moduleSource: moduleSource
      });

      var dirtyDot = moduleDisplay.isDirty
        ? '<span class="inline-flex items-center gap-1 text-orange-500 font-bold ml-2 text-[10px] uppercase tracking-wider"><div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div>Unsaved</span>'
        : '';
      var stepLabel = moduleDisplay.stepCount + ' step' + (moduleDisplay.stepCount === 1 ? '' : 's');
      var publishedBadge = createStatusBadge(moduleDisplay.status, {
        label: moduleDisplay.statusLabel,
        className: 'inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide bg-white border-gray-200 ' + moduleDisplay.statusClass,
        statusClassPrefix: ''
      });

      return '<tr class="hover:bg-gray-50 transition group module-row" draggable="true" data-index="' + idx + '">'
        + '<td class="py-4 px-6 border-b border-gray-100 text-center text-gray-400 font-medium text-xs module-drag-handle cursor-grab active:cursor-grabbing">'
        + '<i class="fa-solid fa-grip-vertical mr-2 hover:text-gray-600 transition pointer-events-none"></i>'
        + (idx + 1)
        + '</td>'
        + '<td class="py-4 px-6 border-b border-gray-100 font-semibold text-gray-900 pointer-events-none">'
        + '<div class="flex items-center gap-3">'
        + '<span class="text-base">' + escapeHtml(moduleDisplay.title) + '</span>'
        + '<button data-id="' + escapeHtml(moduleDisplay.id) + '" class="edit-module-name-btn hidden group-hover:flex bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-blue-600 transition w-6 h-6 items-center justify-center rounded-md shadow-sm opacity-0 group-hover:opacity-100 pointer-events-auto"><i class="fa-solid fa-pen text-[10px]"></i></button>'
        + dirtyDot
        + '</div>'
        + '</td>'
        + '<td class="py-4 px-6 border-b border-gray-100 text-center">'
        + publishedBadge
        + '</td>'
        + '<td class="py-4 px-6 border-b border-gray-100 text-center text-xs font-bold text-gray-600">'
        + escapeHtml(stepLabel)
        + '</td>'
        + '<td class="py-4 px-6 border-b border-gray-100 text-center text-xs font-semibold text-gray-500">'
        + escapeHtml(formatCourseDate(moduleDisplay.updatedAt))
        + '</td>'
        + '<td class="py-4 px-6 border-b border-gray-100 text-right">'
        + '<button data-id="' + escapeHtml(moduleDisplay.id) + '" class="open-module-btn border border-gray-200 bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded text-sm font-bold transition shadow-sm items-center gap-1 inline-flex">'
        + 'Edit Learning Modes <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>'
        + '</button>'
        + '</td>'
        + '</tr>';
    }).join('');
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

function buildCreateModuleWizardModal() {
  return `
    <div id="createModuleWizardModal" class="fixed inset-0 hidden bg-slate-950/70 z-50 p-4 lg:p-8 overflow-y-auto">
      <div class="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div class="bg-gradient-to-r from-blue-50 via-white to-emerald-50 px-6 py-5 border-b border-slate-100">
          <div class="flex items-start justify-between gap-5">
            <div class="flex items-center gap-4 min-w-0">
              <img src="./src/assets/module-wizard.svg" alt="" class="h-16 w-16 rounded-2xl bg-white object-contain shadow-sm ring-1 ring-slate-100">
              <div class="min-w-0">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Create Module Wizard</p>
                <h2 class="text-2xl font-black text-slate-950">Learning content to module skeleton</h2>
                <p class="mt-1 text-sm font-semibold text-slate-500">Enter content once, generate learning experiences, then refine.</p>
              </div>
            </div>
            <button id="moduleWizardCloseBtn" class="h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="mt-5 flex flex-wrap items-center gap-2">
            <span data-wizard-progress="1" class="flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-xs font-black text-white shadow-sm">1 Basics</span>
            <span data-wizard-progress="2" class="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-400 ring-1 ring-slate-200">2 Content</span>
            <span data-wizard-progress="3" class="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-400 ring-1 ring-slate-200">3 Template</span>
            <span data-wizard-progress="4" class="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-400 ring-1 ring-slate-200">4 Generate</span>
          </div>
        </div>

        <div class="grid lg:grid-cols-[1fr_320px] min-h-[580px]">
          <div class="p-6">
            <div class="mb-5 flex items-center justify-between gap-4">
              <div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step <span id="moduleWizardStepNumber">1</span></p>
                <h3 id="moduleWizardStepLabel" class="text-xl font-black text-slate-950">Module Basics</h3>
              </div>
              <button id="moduleWizardPreviewBtn" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm hover:bg-slate-50">
                <i class="fa-solid fa-rotate"></i> Refresh Preview
              </button>
            </div>

            <section data-wizard-step="1" class="grid gap-4 md:grid-cols-2">
              ${buildWizardInput('Module Title', 'wizardModuleTitleInput', 'Go, Stop, and Turn', true)}
              ${buildWizardInput('Subject / Topic Area', 'wizardSubjectInput', 'English / Movement verbs', false)}
              ${buildWizardInput('Topic', 'wizardTopicInput', 'Action words', false)}
              ${buildWizardInput('Level / Grade', 'wizardLevelInput', 'Grade 2', false)}
              ${buildWizardInput('Estimated Minutes', 'wizardEstimatedMinutesInput', '15', false, 'number')}
              <div>
                <label class="block text-xs font-black uppercase tracking-wide text-slate-500 mb-1">Language</label>
                <select id="wizardLanguageSelect" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="en">English</option>
                  <option value="ru">Russian</option>
                  <option value="ky">Kyrgyz</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-black uppercase tracking-wide text-slate-500 mb-1">Description</label>
                <textarea id="wizardDescriptionInput" class="min-h-[92px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What students will learn..."></textarea>
              </div>
            </section>

            <section data-wizard-step="2" class="hidden">
              <div class="grid gap-5 lg:grid-cols-[1fr_1fr]">
                <div class="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <div class="flex items-center gap-3 mb-3">
                    <img src="./src/assets/learning-content-import.svg" alt="" class="h-14 w-14 object-contain">
                    <div>
                      <h4 class="text-sm font-black text-slate-950">Paste Learning Content</h4>
                      <p class="text-xs font-semibold text-slate-500">Use lines like Go = move somewhere.</p>
                    </div>
                  </div>
                  <textarea id="wizardLearningPasteInput" class="min-h-[260px] w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  <button id="moduleWizardParseBtn" class="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-blue-700">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Parse Content
                  </button>
                  <div id="moduleWizardWarnings" class="mt-3 grid gap-2"></div>
                </div>
                <div class="grid gap-3">
                  ${buildWizardTextarea('Vocabulary', 'wizardVocabularyInput', 'One term per line')}
                  ${buildWizardTextarea('Definitions', 'wizardDefinitionsInput', 'Definitions aligned by line')}
                  ${buildWizardTextarea('Concepts', 'wizardConceptsInput', 'Concepts or ideas')}
                  ${buildWizardTextarea('Rules', 'wizardRulesInput', 'Rules or patterns')}
                  ${buildWizardTextarea('Examples', 'wizardExamplesInput', 'Example sentences')}
                  ${buildWizardTextarea('Custom Content', 'wizardCustomContentInput', 'Unstructured notes')}
                </div>
              </div>
            </section>

            <section data-wizard-step="3" class="hidden">
              <div class="grid gap-4 md:grid-cols-2">
                ${buildWizardTemplateCard('school', 'template-school.svg', 'School', 'Primary and review modes for classroom rhythm.', 'Primary, Review')}
                ${buildWizardTemplateCard('educationCenter', 'template-center.svg', 'Education Center', 'Focused mode for guided reinforcement.', 'Primary')}
                ${buildWizardTemplateCard('intensive', 'template-intensive.svg', 'Intensive', 'Full scaffold for fast multi-mode authoring.', 'Primary, Review, Practice, Assessment')}
                ${buildWizardTemplateCard('custom', 'generate-module.svg', 'Custom', 'Minimal editable skeleton for special formats.', 'Primary')}
              </div>
              <label class="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-black text-emerald-800">
                <input id="wizardGenerateStepsToggle" type="checkbox" checked class="h-5 w-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500">
                Generate starter steps
              </label>
            </section>

            <section data-wizard-step="4" class="hidden">
              <div id="moduleWizardPreview">${buildWizardEmptyPreview()}</div>
            </section>
          </div>

          <aside class="border-l border-slate-100 bg-slate-50 p-6">
            <img src="./src/assets/generate-module.svg" alt="" class="mx-auto mb-5 h-36 w-36 object-contain">
            <div class="rounded-2xl border border-white bg-white p-4 shadow-sm">
              <p class="text-[10px] font-black uppercase tracking-wide text-slate-400">Firestore output</p>
              <div class="mt-3 grid gap-2 text-xs font-bold text-slate-600">
                <span>catalogCourses/{courseId}</span>
                <span>/modules/{moduleId}</span>
                <span>/learningContent/{contentId}</span>
                <span>/learningModes/{modeId}</span>
                <span>/steps/{stepId}</span>
              </div>
            </div>
            <p id="moduleWizardStatus" class="mt-4 text-xs font-bold text-slate-500">Ready.</p>
          </aside>
        </div>

        <div class="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-4">
          <button id="moduleWizardCancelBtn" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">Cancel</button>
          <div class="flex gap-3">
            <button id="moduleWizardBackBtn" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">Back</button>
            <button id="moduleWizardNextBtn" class="rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-black">Next</button>
            <button id="moduleWizardCreateBtn" class="hidden rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-blue-700">
              <i class="fa-solid fa-sparkles"></i> Create Module
            </button>
          </div>
        </div>
        <div id="moduleWizardLoadingOverlay" class="hidden absolute inset-0 z-20 flex items-center justify-center bg-white/90 px-5 py-8 backdrop-blur-sm"></div>
      </div>
    </div>
  `;
}

function buildWizardInput(label, id, placeholder, required, type) {
  return '<div>'
    + '<label class="block text-xs font-black uppercase tracking-wide text-slate-500 mb-1">' + label + (required ? ' *' : '') + '</label>'
    + '<input id="' + id + '" type="' + (type || 'text') + '" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="' + placeholder + '">'
    + '</div>';
}

function buildWizardTextarea(label, id, placeholder) {
  return '<div>'
    + '<label class="block text-[10px] font-black uppercase tracking-wide text-slate-500 mb-1">' + label + '</label>'
    + '<textarea id="' + id + '" class="min-h-[70px] w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="' + placeholder + '"></textarea>'
    + '</div>';
}

function buildWizardTemplateCard(templateKey, assetName, title, description, modes) {
  return '<button type="button" data-template="' + templateKey + '" class="wizard-template-card text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">'
    + '<div class="flex items-start gap-4">'
    + '<img src="./src/assets/' + assetName + '" alt="" class="h-20 w-24 rounded-2xl bg-slate-50 object-contain">'
    + '<div class="min-w-0">'
    + '<h4 class="text-base font-black text-slate-950">' + title + '</h4>'
    + '<p class="mt-1 text-xs font-semibold leading-5 text-slate-500">' + description + '</p>'
    + '<p class="mt-3 text-[10px] font-black uppercase tracking-wide text-blue-600">' + modes + '</p>'
    + '</div>'
    + '</div>'
    + '</button>';
}

function buildWizardEmptyPreview() {
  return '<div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">'
    + '<h4 class="text-lg font-black text-slate-900">Skeleton preview</h4>'
    + '<p class="mt-2 text-sm font-semibold text-slate-500">Complete the wizard steps to preview modes and starter activities.</p>'
    + '</div>';
}

function buildWizardLoadingState(message) {
  return '<div class="module-wizard-loading-card">'
    + '<div class="module-wizard-stage">'
    + '<div class="module-wizard-path-dot module-wizard-path-dot-one"></div>'
    + '<div class="module-wizard-path-dot module-wizard-path-dot-two"></div>'
    + '<div class="module-wizard-path-dot module-wizard-path-dot-three"></div>'
    + '<div class="module-wizard-card-stack" aria-hidden="true">'
    + '<div class="module-wizard-mini-card module-wizard-mini-card-one"><i class="fa-solid fa-book-open"></i><span></span></div>'
    + '<div class="module-wizard-mini-card module-wizard-mini-card-two"><i class="fa-solid fa-puzzle-piece"></i><span></span></div>'
    + '<div class="module-wizard-mini-card module-wizard-mini-card-three"><i class="fa-solid fa-route"></i><span></span></div>'
    + '</div>'
    + '</div>'
    + '<p class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Building your module...</p>'
    + '<h3 id="moduleWizardLoadingMessage" class="mt-2 text-2xl font-black text-slate-950">' + escapeHtml(message || 'Creating module...') + '</h3>'
    + '<p class="mt-2 text-sm font-semibold leading-6 text-slate-500">OquWay is connecting content, modes, and starter steps.</p>'
    + '<div class="mt-5 grid grid-cols-4 gap-2" aria-hidden="true">'
    + '<span class="module-wizard-progress-step"></span>'
    + '<span class="module-wizard-progress-step"></span>'
    + '<span class="module-wizard-progress-step"></span>'
    + '<span class="module-wizard-progress-step"></span>'
    + '</div>'
    + '</div>';
}

function buildWizardSuccessState() {
  return '<div class="module-wizard-loading-card module-wizard-success-card">'
    + '<div class="module-wizard-success-icon"><i class="fa-solid fa-check"></i></div>'
    + '<p class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Module created!</p>'
    + '<h3 class="mt-2 text-2xl font-black text-slate-950">Opening the editor...</h3>'
    + '<p class="mt-2 text-sm font-semibold leading-6 text-slate-500">Your module document and summary fields are saved.</p>'
    + '</div>';
}

function buildWizardErrorState(message) {
  return '<div class="module-wizard-loading-card module-wizard-error-card">'
    + '<div class="module-wizard-error-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>'
    + '<p class="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Generation stopped</p>'
    + '<h3 class="mt-2 text-2xl font-black text-slate-950">Try again when ready.</h3>'
    + '<p class="mt-2 text-sm font-semibold leading-6 text-slate-500">' + escapeHtml(message || 'Something went wrong while creating the module.') + '</p>'
    + '<button type="button" id="moduleWizardDismissErrorBtn" class="mt-5 rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-black">Back to Step 4</button>'
    + '</div>';
}

function buildWizardSkeletonPreview(data) {
  var module = data && data.module ? data.module : {};
  var modes = module.learningModes || {};
  var modeIds = Object.keys(modes);
  var html = '<div class="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-5">';
  html += '<div class="flex items-start justify-between gap-4"><div><p class="text-[10px] font-black uppercase tracking-wide text-blue-600">Generated Skeleton</p><h4 class="text-2xl font-black text-slate-950">' + escapeHtml(readPreviewText(module.title, 'Untitled Module')) + '</h4><p class="mt-1 text-sm font-semibold text-slate-600">' + escapeHtml(readPreviewText(module.description, 'Ready for editing.')) + '</p></div><span class="rounded-full bg-white px-3 py-2 text-xs font-black text-blue-700 shadow-sm">' + (data.generatedStepCount || 0) + ' steps</span></div>';
  html += '<div class="mt-5 grid gap-3 md:grid-cols-2">';
  html += modeIds.map(function (modeId) {
    var mode = modes[modeId];
    var steps = data.stepsByMode && data.stepsByMode[modeId] ? data.stepsByMode[modeId] : [];
    return '<div class="rounded-2xl border border-white bg-white p-4 shadow-sm">'
      + '<div class="flex items-center justify-between gap-2"><strong class="text-sm text-slate-950">' + escapeHtml(mode.title || 'Learning Mode') + '</strong><span class="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">' + steps.length + ' steps</span></div>'
      + '<p class="mt-1 text-xs font-semibold text-slate-500">' + escapeHtml(mode.purpose || '') + '</p>'
      + '<div class="mt-3 grid gap-2">' + steps.map(function (step) {
        return '<span class="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">' + escapeHtml(readPreviewText(step.title, 'Starter Step')) + '</span>';
      }).join('') + '</div>'
      + '</div>';
  }).join('');
  html += '</div></div>';
  return html;
}

function showModuleBtnPending(btn, label) {
  btn.innerHTML = '<span class="oqu-spinner oqu-spinner-blue"></span> ' + label;
  btn.disabled = true;
  btn.classList.add('oqu-btn-pending');
}

function restoreModuleBtn(btn, html) {
  btn.innerHTML = html;
  btn.disabled = false;
  btn.classList.remove('oqu-btn-pending');
}

function setModuleWizardControlsDisabled(isDisabled) {
  [
    'moduleWizardCloseBtn',
    'moduleWizardCancelBtn',
    'moduleWizardBackBtn',
    'moduleWizardNextBtn',
    'moduleWizardPreviewBtn',
    'moduleWizardParseBtn'
  ].forEach(function (id) {
    var element = document.getElementById(id);
    if (element) {
      element.disabled = Boolean(isDisabled);
      element.classList.toggle('opacity-50', Boolean(isDisabled));
      element.classList.toggle('cursor-not-allowed', Boolean(isDisabled));
    }
  });
}

function waitForMilliseconds(duration) {
  return new Promise(function (resolve) {
    setTimeout(resolve, duration);
  });
}

function showModuleStatusMsg(msgEl, type, html) {
  var colorClass = 'text-blue-600';
  if (type === 'error') {
    colorClass = 'text-red-600';
  }
  if (type === 'success') {
    colorClass = 'text-green-600';
  }
  msgEl.className = 'text-sm font-medium flex items-center gap-1.5 ' + colorClass;
  msgEl.innerHTML = html;
  msgEl.style.display = 'flex';
}

function buildModuleSkeletonRows(rowCount) {
  var rows = '';
  var row = 0;

  while (row < rowCount) {
    rows += '<tr>'
      + '<td class="py-4 px-6 border-b border-gray-100"><div class="oqu-skeleton-line" style="height:12px;width:30px;margin:0 auto"></div></td>'
      + '<td class="py-4 px-6 border-b border-gray-100"><div class="oqu-skeleton-line" style="height:14px;width:65%"></div></td>'
      + '<td class="py-4 px-6 border-b border-gray-100"><div class="oqu-skeleton-line" style="height:12px;width:48px;margin:0 auto"></div></td>'
      + '<td class="py-4 px-6 border-b border-gray-100"><div class="oqu-skeleton-line" style="height:12px;width:52px;margin:0 auto"></div></td>'
      + '<td class="py-4 px-6 border-b border-gray-100"><div class="oqu-skeleton-line" style="height:12px;width:72px;margin:0 auto"></div></td>'
      + '<td class="py-4 px-6 border-b border-gray-100"><div class="oqu-skeleton-line" style="height:28px;width:90px;margin-left:auto;border-radius:8px"></div></td>'
      + '</tr>';
    row = row + 1;
  }

  return rows;
}

function buildAssignmentRow(assignment, options) {
  var rowOptions = options || {};
  var assignmentId = escapeHtml(assignment.id || '');
  var targetType = escapeHtml(assignment.targetType || 'target');
  var targetId = escapeHtml(assignment.targetId || '');
  var status = assignment.status || 'active';
  var isPending = Boolean(rowOptions.isPending);
  var pendingLabel = readAssignmentPendingLabel(rowOptions.pendingAction);
  var nextStatus = status === 'active' ? 'disabled' : 'active';
  var nextStatusLabel = status === 'active' ? 'Disable' : 'Activate';
  var buttonDisabled = isPending ? ' disabled aria-busy="true"' : '';
  var actionLabel = isPending ? pendingLabel : nextStatusLabel;
  var archiveLabel = isPending && rowOptions.pendingAction === 'archive' ? 'Archiving...' : 'Archive';

  return '<div class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">'
    + '<div class="flex items-start justify-between gap-2">'
    + '<div class="min-w-0">'
    + '<div class="text-[10px] font-black uppercase tracking-wide text-gray-400">' + targetType + '</div>'
    + '<div class="text-xs font-bold text-gray-900 truncate">' + targetId + '</div>'
    + '</div>'
    + '<span class="' + buildAssignmentStatusClass(status) + '">' + escapeHtml(status) + '</span>'
    + '</div>'
    + '<div class="mt-3 flex gap-2">'
    + '<button class="assignment-status-btn flex-1 rounded-lg border border-blue-100 bg-blue-50 px-2 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed" data-id="' + assignmentId + '" data-status="' + nextStatus + '"' + buttonDisabled + '>' + actionLabel + '</button>'
    + '<button class="assignment-archive-btn flex-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-[11px] font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed" data-id="' + assignmentId + '"' + buttonDisabled + '>' + archiveLabel + '</button>'
    + '</div>'
    + '</div>';
}

function readAssignmentPendingLabel(action) {
  if (action === 'disable') {
    return 'Disabling...';
  }

  if (action === 'archive') {
    return 'Working...';
  }

  return 'Saving...';
}

function buildExternalTaskFilterButton(status, activeStatus) {
  var active = status === activeStatus;
  var className = active
    ? 'external-task-filter-btn rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white'
    : 'external-task-filter-btn rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-gray-600 hover:bg-gray-200';

  return '<button type="button" class="' + className + '" data-status="' + escapeHtml(status) + '">' + escapeHtml(readExternalTaskStatusLabel(status)) + '</button>';
}

function buildExternalTaskSubmissionCard(submission, isPending) {
  var files = Array.isArray(submission.files) ? submission.files : [];
  var disabled = isPending ? ' disabled aria-busy="true"' : '';
  var html = '<div class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">';

  html += '<div class="flex items-start justify-between gap-2">';
  html += '<div class="min-w-0"><div class="text-[10px] font-black uppercase tracking-wide text-purple-500">External Task</div>';
  html += '<div class="text-xs font-bold text-gray-900 truncate">' + escapeHtml(submission.taskTitle || 'Untitled task') + '</div>';
  html += '<div class="text-[11px] text-gray-500">' + escapeHtml(submission.studentName || submission.studentId || 'Student') + '</div>';
  html += '<div class="mt-1 text-[10px] font-semibold text-gray-400">' + escapeHtml(readExternalTaskContextLabel(submission)) + '</div></div>';
  html += '<span class="' + buildExternalTaskStatusClass(submission.reviewStatus || 'pending') + '">' + escapeHtml(readExternalTaskStatusLabel(submission.reviewStatus || 'pending')) + '</span>';
  html += '</div>';

  if (submission.studentNote) {
    html += '<p class="mt-3 rounded-lg bg-slate-50 p-2 text-[11px] font-semibold text-slate-600">' + escapeHtml(submission.studentNote) + '</p>';
  }

  html += '<div class="mt-3 flex flex-wrap gap-2">';
  files.forEach(function (file) {
    if (isImageProof(file)) {
      html += '<a class="block overflow-hidden rounded-lg border border-slate-200 bg-slate-50" href="' + escapeHtml(file.downloadUrl || '#') + '" target="_blank" rel="noopener">';
      html += '<img class="h-20 w-28 object-cover" src="' + escapeHtml(file.downloadUrl || '') + '" alt="' + escapeHtml(file.name || 'proof image') + '">';
      html += '</a>';
      return;
    }

    html += '<a class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100" href="' + escapeHtml(file.downloadUrl || '#') + '" target="_blank" rel="noopener">' + escapeHtml(file.name || 'proof file') + '</a>';
  });
  if (files.length === 0) {
    html += '<span class="text-[11px] font-semibold text-slate-400">No file proof attached</span>';
  }
  html += '</div>';

  html += '<label class="mt-3 block text-[10px] font-black uppercase tracking-wide text-slate-400">Teacher feedback</label>';
  html += '<textarea class="external-task-feedback-input mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-[11px] font-semibold text-slate-700 outline-none focus:border-blue-300" data-id="' + escapeHtml(submission.id || '') + '" rows="2" placeholder="Feedback for the student">' + escapeHtml(submission.teacherFeedback || '') + '</textarea>';

  html += '<div class="mt-3 grid grid-cols-3 gap-2">';
  html += '<button class="external-task-review-btn rounded-lg border border-green-100 bg-green-50 px-2 py-1.5 text-[10px] font-black text-green-700 hover:bg-green-100 disabled:opacity-60" data-id="' + escapeHtml(submission.id || '') + '" data-review-status="complete"' + disabled + '>' + (isPending ? 'Saving...' : 'Complete') + '</button>';
  html += '<button class="external-task-review-btn rounded-lg border border-amber-100 bg-amber-50 px-2 py-1.5 text-[10px] font-black text-amber-700 hover:bg-amber-100 disabled:opacity-60" data-id="' + escapeHtml(submission.id || '') + '" data-review-status="needsWork"' + disabled + '>Needs Work</button>';
  html += '<button class="external-task-review-btn rounded-lg border border-red-100 bg-red-50 px-2 py-1.5 text-[10px] font-black text-red-700 hover:bg-red-100 disabled:opacity-60" data-id="' + escapeHtml(submission.id || '') + '" data-review-status="incomplete"' + disabled + '>Incomplete</button>';
  html += '</div>';
  html += '</div>';

  return html;
}

function readExternalTaskContextLabel(submission) {
  var parts = [];

  if (submission.courseId) { parts.push("Course " + submission.courseId); }
  if (submission.moduleId) { parts.push("Module " + submission.moduleId); }
  if (submission.stepId) { parts.push("Step " + submission.stepId); }

  return parts.length > 0 ? parts.join(" / ") : "Course/module/step context pending";
}

function isImageProof(file) {
  return Boolean(file && typeof file.contentType === "string" && file.contentType.indexOf("image/") === 0 && file.downloadUrl);
}

function buildExternalTaskStatusClass(status) {
  if (status === 'complete') {
    return 'rounded-full bg-green-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-green-700';
  }

  if (status === 'needsWork') {
    return 'rounded-full bg-yellow-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-700';
  }

  if (status === 'incomplete') {
    return 'rounded-full bg-red-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-red-700';
  }

  return 'rounded-full bg-purple-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-purple-700';
}

function readExternalTaskStatusLabel(status) {
  if (status === 'needsWork') {
    return 'Needs Work';
  }

  if (status === 'complete') {
    return 'Complete';
  }

  if (status === 'incomplete') {
    return 'Incomplete';
  }

  return 'Pending';
}

function buildAssignmentStatusClass(status) {
  if (status === 'active') {
    return 'rounded-full bg-green-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-green-700';
  }

  if (status === 'paused') {
    return 'rounded-full bg-yellow-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-700';
  }

  return 'rounded-full bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-gray-600';
}

function buildAssignmentSkeletonRows(rowCount) {
  var rows = '';
  var row = 0;

  while (row < rowCount) {
    rows += '<div class="rounded-xl border border-gray-100 bg-white p-3">'
      + '<div class="oqu-skeleton-line" style="height:10px;width:48px;margin-bottom:8px"></div>'
      + '<div class="oqu-skeleton-line" style="height:12px;width:80%"></div>'
      + '</div>';
    row = row + 1;
  }

  return rows;
}

function setInputValue(id, value) {
  var element = document.getElementById(id);
  if (element) {
    element.value = value;
  }
}

function readInputValue(id) {
  var element = document.getElementById(id);
  if (!element) {
    return '';
  }

  return element.value || '';
}

function setCheckedValue(id, value) {
  var element = document.getElementById(id);
  if (element) {
    element.checked = Boolean(value);
  }
}

function readCheckedValue(id) {
  var element = document.getElementById(id);
  return element ? element.checked === true : false;
}

function setElementHtml(id, html) {
  var element = document.getElementById(id);
  if (element) {
    element.innerHTML = html;
  }
}

function setElementText(id, text) {
  var element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function readTextareaLines(id) {
  return readInputValue(id).split(/\r?\n/).map(function (line) {
    return line.trim();
  }).filter(function (line) {
    return line.length > 0;
  });
}

function readContentLines(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(function (item) {
    if (typeof item === 'string') {
      return item;
    }

    if (item && typeof item === 'object') {
      return item.term || item.word || item.title || item.text || item.definition || '';
    }

    return '';
  }).filter(function (line) {
    return line.length > 0;
  });
}

function readNumberInput(id, fallback) {
  var value = Number(readInputValue(id));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function readWizardStepLabel(step) {
  if (step === 2) {
    return 'Add Learning Content';
  }

  if (step === 3) {
    return 'Choose Module Template';
  }

  if (step === 4) {
    return 'Generate Module Skeleton';
  }

  return 'Module Basics';
}

function readLearningContentItemCount(learningContent) {
  var total = 0;
  Object.keys(learningContent || {}).forEach(function (key) {
    if (Array.isArray(learningContent[key])) {
      total = total + learningContent[key].length;
    }
  });
  return total;
}

function normalizeModuleTemplateKey(value) {
  var templateKey = typeof value === 'string' ? value.trim() : '';
  if (templateKey === 'school' || templateKey === 'educationCenter' || templateKey === 'intensive' || templateKey === 'custom') {
    return templateKey;
  }

  return 'custom';
}

function buildCoursePreview(course) {
  var modules = Array.isArray(course && course.modules) ? course.modules : [];
  var title = readPreviewText(course ? course.title : null, 'Untitled Course');
  var description = readPreviewText(course ? course.description : null, 'Student preview shows the course exactly as learners will scan it.');

  var html = '<section class="space-y-6">';
  html += '<div class="rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">';
  html += '<div class="flex items-start justify-between gap-4"><div><p class="text-[10px] font-black uppercase tracking-wide text-blue-600">Preview Mode</p><h1 class="text-3xl font-black text-slate-950">' + escapeHtml(title) + '</h1><p class="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">' + escapeHtml(description) + '</p></div><img src="./src/assets/preview-student.svg" alt="" class="w-32 h-32 object-contain"></div>';
  html += '</div>';

  if (modules.length === 0) {
    html += '<div class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center"><h2 class="text-xl font-black text-slate-900">No modules yet</h2><p class="mt-2 text-sm font-semibold text-slate-500">Add a module and student steps before publishing.</p></div>';
    html += '</section>';
    return html;
  }

  html += modules.map(function (module, index) {
    return buildPreviewModule(module, index);
  }).join('');
  html += '</section>';
  return html;
}

function buildPreviewModule(module, index) {
  var sessions = Array.isArray(module.sessions) ? module.sessions : [];
  var stepCount = countPreviewModuleSteps(module);
  var html = '<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">';
  html += '<div class="flex items-start gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">' + (index + 1) + '</div><div class="min-w-0 flex-1"><h2 class="text-xl font-black text-slate-950">' + escapeHtml(readPreviewText(module.title || (module.config && module.config.title), 'Untitled Module')) + '</h2><p class="mt-1 text-sm font-semibold text-slate-500">' + stepCount + ' student step' + (stepCount === 1 ? '' : 's') + '</p></div></div>';

  if (sessions.length === 0) {
    html += '<div class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">No sessions or steps yet.</div>';
  } else {
    html += '<div class="mt-4 grid gap-3">';
    html += sessions.map(buildPreviewSession).join('');
    html += '</div>';
  }

  html += '</article>';
  return html;
}

function buildPreviewSession(session) {
  var steps = readPreviewSteps(session);
  var html = '<div class="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div class="flex items-center justify-between gap-3"><strong class="text-sm text-slate-900">' + escapeHtml(readPreviewText(session.title, 'Practice Session')) + '</strong><span class="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">' + steps.length + ' steps</span></div>';

  if (steps.length > 0) {
    html += '<ol class="mt-3 grid gap-2">';
    html += steps.map(function (step, index) {
      return '<li class="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[11px] font-black text-blue-700">' + (index + 1) + '</span><span class="min-w-0 flex-1">' + escapeHtml(readPreviewText(step.title, 'Untitled Step')) + '</span><small class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-500">' + escapeHtml(step.type || 'step') + '</small></li>';
    }).join('');
    html += '</ol>';
  }

  html += '</div>';
  return html;
}

function readPreviewSteps(session) {
  var practiceModes = session && session.practiceModes ? session.practiceModes : {};
  var steps = [];

  Object.keys(practiceModes).forEach(function (key) {
    if (practiceModes[key] && Array.isArray(practiceModes[key].steps)) {
      steps = steps.concat(practiceModes[key].steps);
    }
  });

  steps.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });
  return steps;
}

function countPreviewModuleSteps(module) {
  var sessions = Array.isArray(module.sessions) ? module.sessions : [];
  var count = 0;

  sessions.forEach(function (session) {
    count = count + readPreviewSteps(session).length;
  });

  return count;
}

function countCourseSteps(modules) {
  var safeModules = Array.isArray(modules) ? modules : [];
  var count = 0;

  safeModules.forEach(function (module) {
    count = count + countModuleSteps(module);
  });

  return count;
}

function countModuleSteps(module) {
  if (!module || typeof module !== 'object') {
    return 0;
  }

  if (typeof module.stepCount === 'number') {
    return module.stepCount;
  }

  if (Array.isArray(module.steps)) {
    return module.steps.length;
  }

  if (Array.isArray(module.sessions)) {
    return countPreviewModuleSteps(module);
  }

  return countLearningModeSteps(module.learningModes);
}

function countLearningModeSteps(learningModes) {
  if (!learningModes || typeof learningModes !== 'object') {
    return 0;
  }

  var count = 0;
  Object.keys(learningModes).forEach(function (modeId) {
    var mode = learningModes[modeId];

    if (mode && Array.isArray(mode.steps)) {
      count = count + mode.steps.length;
    }
  });

  return count;
}

function readPreviewText(value, fallback) {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  if (value && typeof value === 'object') {
    return value.en || value.ru || value.ky || fallback;
  }

  return fallback;
}

function readModuleId(module) {
  if (!module) {
    return '';
  }

  return module.id || module.moduleId || '';
}

function readModuleTitle(module) {
  var title = module ? module.title || (module.config && module.config.title) : '';

  if (typeof title === 'string') {
    return title;
  }

  if (title && typeof title === 'object') {
    return title.en || title.ru || title.ky || '';
  }

  return '';
}

function normalizeModuleDisplay(module, index) {
  var id = readModuleId(module);
  var title = readModuleDisplayText([
    module ? module.title : null,
    module && module.config ? module.config.title : null,
    module ? module.name : null,
    module ? module.displayName : null
  ], 'Untitled Module');
  var description = readModuleDisplayText([
    module ? module.description : null,
    module && module.config ? module.config.description : null,
    module ? module.summary : null
  ], '');
  var status = readModuleStatus(module);

  return {
    id: id,
    title: title,
    description: description,
    status: status,
    statusLabel: readModuleStatusLabel(status),
    statusClass: readModuleStatusClass(status),
    stepCount: countModuleSteps(module),
    updatedAt: module ? module.updatedAt || module.modifiedAt || module.createdAt || null : null,
    isDirty: Boolean(module && module.isDirty),
    index: index
  };
}

function readModuleDisplayText(values, fallback) {
  for (var index = 0; index < values.length; index += 1) {
    var value = values[index];
    var text = readModuleTextValue(value);

    if (text) {
      return text;
    }
  }

  return fallback;
}

function readModuleTextValue(value) {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (!value || typeof value !== 'object') {
    return '';
  }

  if (typeof value.en === 'string' && value.en.trim()) {
    return value.en.trim();
  }

  if (typeof value.ru === 'string' && value.ru.trim()) {
    return value.ru.trim();
  }

  if (typeof value.ky === 'string' && value.ky.trim()) {
    return value.ky.trim();
  }

  var keys = Object.keys(value);
  for (var index = 0; index < keys.length; index += 1) {
    if (typeof value[keys[index]] === 'string' && value[keys[index]].trim()) {
      return value[keys[index]].trim();
    }
  }

  return '';
}

function readModuleStatus(module) {
  if (!module) {
    return 'draft';
  }

  if (typeof module.status === 'string' && module.status.trim()) {
    return module.status.trim();
  }

  if (module.isDraft === false) {
    return 'published';
  }

  return 'draft';
}

function readModuleStatusLabel(status) {
  if (status === 'published') {
    return 'Published';
  }

  if (status === 'archived') {
    return 'Archived';
  }

  if (status === 'active') {
    return 'Active';
  }

  return 'Draft';
}

function readModuleStatusClass(status) {
  if (status === 'published' || status === 'active') {
    return 'text-green-700';
  }

  if (status === 'archived') {
    return 'text-gray-500';
  }

  return 'text-yellow-700';
}

function readCourseVisibility(course) {
  if (!course) {
    return 'Unknown';
  }

  if (course.visibility) {
    return course.visibility;
  }

  if (course.isPublic === true) {
    return 'Public';
  }

  if (course.status === 'published') {
    return 'Published';
  }

  return 'Draft only';
}

function summarizeAssignments(assignments) {
  var safeAssignments = Array.isArray(assignments) ? assignments : [];
  var activeAssignments = safeAssignments.filter(function (assignment) {
    return assignment && assignment.status !== 'archived' && assignment.status !== 'disabled';
  });

  if (activeAssignments.length === 0) {
    return 'No active class, student, or location assignments yet.';
  }

  return activeAssignments.length + ' active assignment' + (activeAssignments.length === 1 ? '' : 's') + ' connected to this course.';
}

function buildCourseSummaryItem(label, value) {
  return '<div class="rounded-lg border border-gray-200 bg-white px-3 py-2">'
    + '<div class="text-[10px] font-black uppercase tracking-wide text-gray-400">' + escapeHtml(label) + '</div>'
    + '<div class="mt-1 truncate text-xs font-bold text-gray-900">' + escapeHtml(value || 'None') + '</div>'
    + '</div>';
}

function formatCourseDate(value) {
  var date = normalizeDateValue(value);

  if (!date) {
    return 'Not saved';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function normalizeDateValue(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }

  if (typeof value === 'number' || typeof value === 'string') {
    var date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

function escapeHtml(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cssEscape(value) {
  if (typeof CSS !== 'undefined' && CSS && typeof CSS.escape === 'function') {
    return CSS.escape(String(value || ''));
  }

  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
