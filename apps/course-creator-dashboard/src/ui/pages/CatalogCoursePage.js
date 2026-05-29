import { catalogCourseService } from '../services/catalogCourseService.js';
import { courseCreatorStore } from '../state/courseCreatorState.js';

export class CatalogCoursePage {
  constructor() {
    this.unsubscribe = null;
  }

  render() {
    return `
      <!-- Top Navigation -->
      <nav class="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-blue-600 font-bold text-xl tracking-tight">OquWay</span>
        </div>
        <div class="flex items-center gap-4 text-sm font-semibold text-gray-700">
          <span>Course Creator Dashboard</span>
          <div class="flex items-center gap-2 cursor-pointer">
            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="User Avatar" class="w-8 h-8 rounded-full">
            <i class="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-6xl mx-auto px-6 py-8">
        
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Course Management</h1>
          
          <div class="flex items-center gap-3">
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input type="text" placeholder="Search courses..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64">
            </div>
            <a href="#location-login-settings" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition flex items-center gap-2">
              Login Modes
            </a>
            <button id="openCreateModalBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition flex items-center gap-2">
              <i class="fa-solid fa-plus"></i> Create New Course
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-4">
            <div class="relative inline-block text-left">
              <select class="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option>Filter by Tag</option>
              </select>
              <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            </div>
            <div class="relative inline-block text-left">
              <select class="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option>Sort by: Date Created</option>
              </select>
              <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-600">Show Archived Courses</span>
            <!-- Toggle Switch Placeholder -->
            <div class="w-11 h-6 bg-gray-200 rounded-full flex items-center p-1 cursor-not-allowed">
              <div class="bg-white w-4 h-4 rounded-full shadow-md"></div>
            </div>
            <span class="text-sm font-medium text-gray-500">Off</span>
          </div>
        </div>

        <!-- Table Container -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th class="py-3 px-6 font-semibold w-1/3">Title</th>
                <th class="py-3 px-6 font-semibold">Tags</th>
                <th class="py-3 px-6 font-semibold">Languages</th>
                <th class="py-3 px-6 font-semibold">Version</th>
                <th class="py-3 px-6 font-semibold">Created By</th>
                <th class="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody id="courseTableBody" class="divide-y divide-gray-200">
              ${buildSkeletonTableRows(6, 5)}
            </tbody>
          </table>
          
          <!-- Pagination Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <span class="text-sm text-gray-600" id="paginationInfo">Showing 0 to 0 of 0 courses</span>
            <div class="flex items-center space-x-1" id="paginationControls">
              <!-- Controls rendered dynamically -->
            </div>
          </div>
        </div>

        <!-- Archived Count -->
        <div class="mt-8">
          <button class="text-sm font-semibold text-gray-900 hover:text-blue-600 transition">
            Archived Courses <span class="font-normal text-gray-500">(0)</span> <span class="text-blue-600 ml-1">View &rsaquo;</span>
          </button>
        </div>

      </main>

      <!-- Create Modal (Hidden by default) -->
      <div id="createModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50 transition-opacity">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Create New Course</h3>
            <button id="closeModalBtn" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="px-6 py-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
            <input id="newCourseTitle" type="text" placeholder="e.g. 7th Grade ICT" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
            
            <label class="block text-sm font-medium text-gray-700 mb-1">Supported Languages (Hold Ctrl/Cmd to select multiple)</label>
            <select id="newCourseLanguages" multiple class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-24">
              <option value="en" selected>English (en)</option>
              <option value="ru">Russian (ru)</option>
              <option value="ky">Kyrgyz (ky)</option>
            </select>

            <label class="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
            <select id="newCourseLanguage" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
              <option value="en" selected>English (en)</option>
              <option value="ru">Russian (ru)</option>
              <option value="ky">Kyrgyz (ky)</option>
            </select>
            
            <p id="createError" class="text-red-500 text-xs hidden mb-2"></p>
          </div>
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 justify-end flex gap-2 flex-col">
            <div id="createStatusBanner" style="display:none"></div>
            <div class="flex gap-2 justify-end">
              <button id="cancelModalBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button id="submitCreateBtn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition shadow-sm flex items-center gap-2">Create Course</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async loadData() {
    try {
      const currentState = courseCreatorStore.getState();
      if (currentState.courses && currentState.courses.length > 0) {
        courseCreatorStore.setState({ isFetching: false, error: null });
        return; // Already loaded, use cache
      }

      courseCreatorStore.setState({ isFetching: true, error: null });
      const result = await catalogCourseService.fetchAllCatalogCourses();
      if (result && result.emitted && result.emitted.success) {
        courseCreatorStore.setState({
          courses: result.emitted.data || [],
          isFetching: false
        });
      } else {
        let errorMsg = "Validation or processing failed";
        errorMsg = this.readResultErrorMessage(result);
        courseCreatorStore.setState({ error: errorMsg, isFetching: false });
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("Failed to load courses:", err);
      document.getElementById('courseTableBody').innerHTML = `<tr><td colspan="6" class="py-10 text-center text-red-500 text-sm">Failed to load courses. Check console.</td></tr>`;
    }
  }

  renderTable(state) {
    const tbody = document.getElementById('courseTableBody');
    const info = document.getElementById('paginationInfo');
    const self = this;

    if (state.isFetching) {
      tbody.innerHTML = buildSkeletonTableRows(6, 5);
      return;
    }

    if (state.error) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-10 text-center text-red-500 text-sm">${state.error}</td></tr>`;
      return;
    }

    const courses = state.courses;
    const paginationControls = document.getElementById('paginationControls');

    if (courses.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-10 text-center text-gray-500 text-sm border-b">No active courses found. Create one above!</td></tr>`;
      info.textContent = `Showing 0 to 0 of 0 courses`;
      paginationControls.innerHTML = '';
      return;
    }

    info.textContent = `Showing 1 to ${courses.length} of ${courses.length} courses`;
    paginationControls.innerHTML = `
      <button class="px-3 py-1 border border-gray-200 rounded bg-white text-gray-500 disabled:opacity-50 text-sm cursor-not-allowed" disabled><i class="fa-solid fa-chevron-left"></i></button>
      <button class="px-3 py-1 border border-blue-600 rounded bg-blue-600 text-white text-sm">1</button>
      <button class="px-3 py-1 border border-gray-200 rounded bg-white text-gray-500 disabled:opacity-50 text-sm cursor-not-allowed" disabled><i class="fa-solid fa-chevron-right"></i></button>
    `;

    tbody.innerHTML = courses.map(function (course) {
      const displayTitle = self.getLocalizedText(course.title, course.defaultLanguage) || 'Untitled Course';
      // Tags mockup
      const tagsHtml = (course.tags || []).length > 0
        ? course.tags.map(function (t) { return `<span class="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded text-xs font-semibold mr-1">${t}</span>`; }).join('')
        : `<span class="text-gray-400 text-xs italic">No tags</span>`;

      const langs = course.languages || ['en'];
      const langHtml = langs.map(function (l) {
        // Mocking flags simply using country codes or solid colors for UI accuracy
        let flagSrc = '';
        if (l === 'en') flagSrc = '🇺🇸';
        else if (l === 'ru') flagSrc = '🇷🇺';
        else if (l === 'zh-CN' || l === 'cn') flagSrc = '🇨🇳';
        else if (l === 'tr') flagSrc = '🇹🇷';
        else flagSrc = '🌐';
        return `<span class="text-lg" title="${l}">${flagSrc}</span>`;
      }).join(' ');

      return `
        <tr class="hover:bg-gray-50 transition">
          <td class="py-4 px-6 border-b border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl shadow-sm border border-blue-200">
              <i class="fa-solid fa-laptop-code"></i>
            </div>
            <div>
              <div class="font-bold text-gray-900 text-base">${displayTitle}</div>
              <div class="mt-1">${tagsHtml}</div>
            </div>
          </td>
          <td class="py-4 px-6 border-b border-gray-100 align-middle">
            <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium border border-gray-200">Placeholder Tag</span>
          </td>
          <td class="py-4 px-6 border-b border-gray-100 align-middle whitespace-nowrap">
            <div class="flex items-center gap-1">${langHtml}</div>
          </td>
          <td class="py-4 px-6 border-b border-gray-100 align-middle text-gray-700 font-medium">
            ${course.version || 1}
          </td>
          <td class="py-4 px-6 border-b border-gray-100 align-middle">
            <div class="flex items-center gap-3">
              <img src="https://ui-avatars.com/api/?name=${course.createdByName || course.createdBy || 'Unknown'}&background=random" class="w-8 h-8 rounded-full">
              <div class="text-sm">
                <div class="font-bold text-gray-900 drop-shadow-sm">${course.createdByName || 'Unknown User'}</div>
                <div class="text-gray-500 text-xs">${course.createdBy || 'system'}</div>
              </div>
            </div>
          </td>
          <td class="py-4 px-6 border-b border-gray-100 align-middle text-center whitespace-nowrap">
            <button data-id="${course.id}" class="edit-course-btn border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded text-sm font-semibold transition shadow-sm mr-2 flex inline-flex items-center gap-1">
              <i class="fa-solid fa-pen text-xs cursor-pointer pointer-events-none"></i> Edit
            </button>
            <button class="border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-red-500 px-2.5 py-1.5 rounded text-sm transition shadow-sm inline-flex items-center justify-center">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  getLocalizedText(value, defaultLanguage) {
    let languageCode = defaultLanguage;

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

  attachEvents() {
    const self = this;

    // Subscribe to state changes to automatically re-render parts of the UI
    this.unsubscribe = courseCreatorStore.subscribe(function (newState) {
      self.renderTable(newState);
    });

    self.loadData();

    const tbody = document.getElementById('courseTableBody');
    tbody.addEventListener('click', function (e) {
      const editBtn = e.target.closest('.edit-course-btn');
      if (editBtn) {
        const courseId = editBtn.getAttribute('data-id');
        window.location.hash = '#overview?courseId=' + courseId;
      }
    });

    const modal = document.getElementById('createModal');
    const titleInput = document.getElementById('newCourseTitle');
    const errText = document.getElementById('createError');

    document.getElementById('openCreateModalBtn').addEventListener('click', function () {
      titleInput.value = '';
      document.getElementById('newCourseLanguages').value = 'en';
      document.getElementById('newCourseLanguage').value = 'en';
      errText.classList.add('hidden');
      hideCreateStatusBanner();
      modal.classList.remove('hidden');
    });

    const closeModal = function () {
      modal.classList.add('hidden');
    };

    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

    document.getElementById('submitCreateBtn').addEventListener('click', function () {
      const title = titleInput.value.trim();
      const defaultLanguage = document.getElementById('newCourseLanguage').value;
      const languagesSelect = document.getElementById('newCourseLanguages');
      var selectedLanguages = [];

      for (var i = 0; i < languagesSelect.options.length; i++) {
        if (languagesSelect.options[i].selected) {
          selectedLanguages.push(languagesSelect.options[i].value);
        }
      }

      errText.classList.add('hidden');
      hideCreateStatusBanner();

      if (!title) {
        errText.textContent = "Title is required.";
        errText.classList.remove('hidden');
        return;
      }

      if (selectedLanguages.length === 0) {
        errText.textContent = "At least one supported language is required.";
        errText.classList.remove('hidden');
        return;
      }

      if (!defaultLanguage) {
        errText.textContent = "Default language is required.";
        errText.classList.remove('hidden');
        return;
      }

      if (selectedLanguages.indexOf(defaultLanguage) === -1) {
        errText.textContent = "Default language must be one of the selected supported languages.";
        errText.classList.remove('hidden');
        return;
      }

      var btn = document.getElementById('submitCreateBtn');
      showBtnPending(btn, 'Building your course shell…');
      showCreateStatusBanner('creating', '<span class="oqu-spinner oqu-spinner-blue"></span> Building your course shell…');

      var coursePayload = {
        title: title,
        description: '',
        status: 'draft',
        defaultLanguage: defaultLanguage,
        tags: [],
        languages: selectedLanguages
      };

      catalogCourseService.createCatalogCourse(coursePayload).then(function (res) {
        if (!res || !res.emitted || !res.emitted.success) {
          throw new Error(self.readResultErrorMessage(res));
        }
        showCreateStatusBanner('success', '<span class="oqu-success-icon">&#10003;</span> Course created!');
        setTimeout(function () {
          closeModal();
          hideCreateStatusBanner();
          restoreBtn(btn, 'Create Course');
        }, 900);
        self.appendCreatedCourse(res.emitted.data);
      }).catch(function (err) {
        showCreateStatusBanner('error', '&#9888; ' + err.message);
        restoreBtn(btn, 'Create Course');
      });
    });
  }

  readResultErrorMessage(result) {
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

    return "Validation or processing failed";
  }

  appendCreatedCourse(course) {
    const currentState = courseCreatorStore.getState();
    const courses = currentState.courses ? currentState.courses.slice() : [];

    courses.push(course);

    courseCreatorStore.setState({
      courses: courses,
      isFetching: false,
      error: null
    });
  }
}

function showBtnPending(btn, label) {
  btn.innerHTML = '<span class="oqu-spinner"></span> ' + label;
  btn.disabled = true;
  btn.classList.add('oqu-btn-pending');
}

function restoreBtn(btn, label) {
  btn.textContent = label;
  btn.disabled = false;
  btn.classList.remove('oqu-btn-pending');
}

function showCreateStatusBanner(type, html) {
  var banner = document.getElementById('createStatusBanner');
  if (!banner) {
    return;
  }
  var typeClass = 'oqu-status-creating';
  if (type === 'error') {
    typeClass = 'oqu-status-error';
  }
  if (type === 'success') {
    typeClass = 'oqu-status-success';
  }
  banner.className = 'oqu-status-banner ' + typeClass;
  banner.innerHTML = html;
  banner.style.display = 'flex';
}

function hideCreateStatusBanner() {
  var banner = document.getElementById('createStatusBanner');
  if (banner) {
    banner.style.display = 'none';
    banner.innerHTML = '';
  }
}

function buildSkeletonTableRows(colCount, rowCount) {
  var rows = '';
  var row = 0;

  while (row < rowCount) {
    var cells = '';
    var col = 0;

    while (col < colCount) {
      var widthPct = (col === 0) ? 60 : 40;
      cells += '<td class="py-4 px-6 border-b border-gray-100">'
        + '<div class="oqu-skeleton-line" style="height:14px;width:' + widthPct + '%"></div>'
        + '</td>';
      col = col + 1;
    }

    rows += '<tr>' + cells + '</tr>';
    row = row + 1;
  }

  return rows;
}
