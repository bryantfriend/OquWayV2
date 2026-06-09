import { catalogCourseService } from "../services/catalogCourseService.js?v=1.1.152-course-builder-loading-timeout";
import { courseCreatorStore } from "../state/courseCreatorState.js?v=1.1.152-course-builder-loading-timeout";

export class CatalogCoursePage {
  constructor() {
    this.unsubscribe = null;
  }

  render() {
    return `
      <div id="course-builder-root" class="builder-shell min-h-screen">
        <nav class="builder-nav">
          <div class="builder-brand"><span>OquWay</span><small>Course Builder 2.0</small></div>
          <div class="builder-nav-actions">
            <a href="#location-login-settings" class="builder-btn builder-btn-ghost">Login Modes</a>
            <button id="openCreateModalBtn" class="builder-btn builder-btn-primary"><i class="fa-solid fa-plus"></i> New Course</button>
          </div>
        </nav>

        <main class="builder-main">
          <section class="builder-hero">
            <div>
              <p class="builder-eyebrow">Create, preview, publish, assign</p>
              <h1>Course Builder</h1>
              <p>Build structured learning paths from course metadata through modules and student-ready steps.</p>
            </div>
            <img src="./src/assets/course-builder.svg" alt="">
          </section>

          <section class="builder-toolbar">
            <div class="builder-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input id="courseSearchInput" type="search" placeholder="Search courses">
            </div>
            <select id="courseStatusFilter" class="builder-select" aria-label="Status filter">
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button id="openArchivedCoursesBtn" class="builder-btn builder-btn-ghost"><i class="fa-solid fa-box-archive"></i> View Archived Courses</button>
          </section>

          <section id="courseBuilderStatus" class="builder-status" hidden></section>
          <section id="courseGrid" class="builder-course-grid">${buildSkeletonCards(6)}</section>
        </main>

        <div id="createModal" class="builder-modal hidden">
          <div class="builder-modal-panel">
            <div class="builder-modal-head">
              <div>
                <p class="builder-eyebrow">New Course</p>
                <h2>Create course shell</h2>
              </div>
              <button id="closeModalBtn" class="builder-icon-btn" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="builder-form-grid">
              <label>Title<input id="newCourseTitle" type="text" placeholder="ICT Foundations"></label>
              <label>Subject<input id="newCourseSubject" type="text" placeholder="ICT"></label>
              <label>Level / Grade<input id="newCourseLevel" type="text" placeholder="Grade 7"></label>
              <label>Default Language
                <select id="newCourseLanguage">
                  <option value="en" selected>English</option>
                  <option value="ru">Russian</option>
                  <option value="ky">Kyrgyz</option>
                </select>
              </label>
              <label class="builder-field-wide">Description<textarea id="newCourseDescription" placeholder="What students will learn"></textarea></label>
              <label class="builder-field-wide">Supported Languages
                <select id="newCourseLanguages" multiple>
                  <option value="en" selected>English</option>
                  <option value="ru">Russian</option>
                  <option value="ky">Kyrgyz</option>
                </select>
              </label>
            </div>
            <p id="createError" class="builder-error" hidden></p>
            <div id="createStatusBanner" class="builder-status" hidden></div>
            <div class="builder-modal-actions">
              <button id="cancelModalBtn" class="builder-btn builder-btn-ghost">Cancel</button>
              <button id="submitCreateBtn" class="builder-btn builder-btn-primary">Create Course</button>
            </div>
          </div>
        </div>

        <div id="archivedCoursesModal" class="builder-modal hidden">
          <div class="builder-modal-panel builder-modal-panel-wide">
            <div class="builder-modal-head">
              <div>
                <p class="builder-eyebrow">Archive</p>
                <h2>Archived Courses</h2>
              </div>
              <button id="closeArchivedCoursesBtn" class="builder-icon-btn" aria-label="Close archived courses"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <section id="archivedCoursesStatus" class="builder-status" hidden></section>
            <section id="archivedCoursesList" class="builder-archive-list"></section>
            <div class="builder-modal-actions">
              <button id="doneArchivedCoursesBtn" class="builder-btn builder-btn-primary">Done</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async loadData() {
    try {
      courseCreatorStore.setState({ isFetching: true, error: null });
      var result = await catalogCourseService.fetchAllCatalogCourses();

      if (result && result.emitted && result.emitted.success) {
        courseCreatorStore.setState({
          courses: result.emitted.data || [],
          isFetching: false,
          archivePendingCourseId: "",
          restorePendingCourseId: "",
          permanentDeletePendingCourseId: "",
          isArchivedListReloading: false,
          error: null
        });
        return;
      }

      throw new Error(this.readResultErrorMessage(result));
    } catch (error) {
      courseCreatorStore.setState({
        isFetching: false,
        isArchivedListReloading: false,
        error: error.message
      });
    }
  }

  renderCourses(state) {
    var grid = document.getElementById("courseGrid");
    var status = document.getElementById("courseBuilderStatus");

    this.renderArchivedCourses(state);

    if (!grid) {
      return;
    }

    if (state.isFetching) {
      grid.innerHTML = buildSkeletonCards(6);
      hideStatus(status);
      return;
    }

    if (state.error) {
      grid.innerHTML = "";
      showStatus(status, "error", state.error);
      return;
    }

    var courses = filterCourses(state.courses || [], state.searchQuery || "", state.statusFilter || "all");

    if (courses.length === 0) {
      grid.innerHTML = buildEmptyState();
      hideStatus(status);
      return;
    }

    hideStatus(status);
    grid.innerHTML = courses.map(function (course) {
      return buildCourseCard(course, state);
    }).join("");
  }

  attachEvents() {
    var self = this;

    this.unsubscribe = courseCreatorStore.subscribe(function (state) {
      self.renderCourses(state);
    });

    this.loadData();
    this.bindFilters();
    this.bindCreateModal();
    this.bindArchivedModal();
    this.bindCourseActions();
  }

  bindFilters() {
    var searchInput = document.getElementById("courseSearchInput");
    var statusFilter = document.getElementById("courseStatusFilter");

    searchInput.addEventListener("input", function () {
      courseCreatorStore.setState({ searchQuery: searchInput.value });
    });

    statusFilter.addEventListener("change", function () {
      courseCreatorStore.setState({ statusFilter: statusFilter.value });
    });
  }

  bindArchivedModal() {
    var self = this;
    var modal = document.getElementById("archivedCoursesModal");
    var openButton = document.getElementById("openArchivedCoursesBtn");
    var closeButton = document.getElementById("closeArchivedCoursesBtn");
    var doneButton = document.getElementById("doneArchivedCoursesBtn");
    var list = document.getElementById("archivedCoursesList");

    openButton.addEventListener("click", function () {
      hideStatus(document.getElementById("archivedCoursesStatus"));
      courseCreatorStore.setState({ isArchivedModalOpen: true });
    });

    closeButton.addEventListener("click", function () {
      courseCreatorStore.setState({ isArchivedModalOpen: false });
    });

    doneButton.addEventListener("click", function () {
      courseCreatorStore.setState({ isArchivedModalOpen: false });
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        courseCreatorStore.setState({ isArchivedModalOpen: false });
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && courseCreatorStore.getState().isArchivedModalOpen) {
        courseCreatorStore.setState({ isArchivedModalOpen: false });
      }
    });

    list.addEventListener("click", function (event) {
      var button = event.target.closest("[data-archived-course-action]");

      if (!button) {
        return;
      }

      var courseId = button.getAttribute("data-id");
      var action = button.getAttribute("data-archived-course-action");

      if (action === "restore") {
        self.restoreCourse(courseId);
        return;
      }

      if (action === "permanent-delete") {
        self.permanentlyDeleteCourse(courseId);
      }
    });
  }

  renderArchivedCourses(state) {
    var modal = document.getElementById("archivedCoursesModal");
    var list = document.getElementById("archivedCoursesList");

    if (!modal || !list) {
      return;
    }

    modal.classList.toggle("hidden", state.isArchivedModalOpen !== true);

    if (state.isArchivedListReloading) {
      list.innerHTML = buildArchivedReloadingState();
      return;
    }

    if (state.isFetching) {
      list.innerHTML = buildArchivedSkeletonRows(3);
      return;
    }

    var archivedCourses = getArchivedCourses(state.courses || []);

    if (archivedCourses.length === 0) {
      list.innerHTML = buildArchivedEmptyState();
      return;
    }

    list.innerHTML = archivedCourses.map(function (course) {
      return buildArchivedCourseRow(course, state);
    }).join("");
  }

  bindCourseActions() {
    var grid = document.getElementById("courseGrid");
    var self = this;

    grid.addEventListener("click", function (event) {
      var button = event.target.closest("[data-course-action]");

      if (!button) {
        return;
      }

      var courseId = button.getAttribute("data-id");
      var action = button.getAttribute("data-course-action");

      if (action === "edit") {
        window.location.hash = "#overview?courseId=" + encodeURIComponent(courseId);
        return;
      }

      if (action === "preview") {
        window.location.hash = "#overview?courseId=" + encodeURIComponent(courseId) + "&preview=1";
        return;
      }

      if (action === "assign") {
        window.location.hash = "#overview?courseId=" + encodeURIComponent(courseId) + "&assign=1";
        return;
      }

      if (action === "publish") {
        window.location.hash = "#overview?courseId=" + encodeURIComponent(courseId) + "&publish=1";
        return;
      }

      if (action === "archive") {
        self.archiveCourse(courseId);
        return;
      }

      if (action === "delete") {
        self.deleteCourse(courseId);
      }
    });
  }

  archiveCourse(courseId) {
    var self = this;
    var currentState = courseCreatorStore.getState();

    if (currentState.archivePendingCourseId) {
      return;
    }

    courseCreatorStore.setState({ archivePendingCourseId: courseId });
    showPageStatus("loading", "Archiving course...");
    catalogCourseService.archiveCourse(courseId).then(function (result) {
      if (!result || !result.emitted || !result.emitted.success) {
        throw new Error(self.readResultErrorMessage(result));
      }
      showPageStatus("success", "Course archived.");
      self.loadData();
    }).catch(function (error) {
      showPageStatus("error", error.message);
      courseCreatorStore.setState({ archivePendingCourseId: "" });
    });
  }

  deleteCourse(courseId) {
    var self = this;

    if (!confirm("Delete this course shell? Existing legacy content will not be hard-deleted.")) {
      return;
    }

    showPageStatus("loading", "Deleting course...");
    catalogCourseService.deleteCourse(courseId).then(function (result) {
      if (!result || !result.emitted || !result.emitted.success) {
        throw new Error(self.readResultErrorMessage(result));
      }
      showPageStatus("success", "Course deleted.");
      self.loadData();
    }).catch(function (error) {
      showPageStatus("error", error.message);
    });
  }

  restoreCourse(courseId) {
    var self = this;
    var currentState = courseCreatorStore.getState();

    if (currentState.restorePendingCourseId || currentState.permanentDeletePendingCourseId) {
      return;
    }

    courseCreatorStore.setState({ restorePendingCourseId: courseId });
    showArchivedStatus("loading", "Restoring course to draft...");

    catalogCourseService.restoreCourse(courseId).then(function (result) {
      if (!result || !result.emitted || !result.emitted.success) {
        throw new Error(self.readResultErrorMessage(result));
      }

      showArchivedStatus("success", "Course restored to draft.");
      self.loadData();
    }).catch(function (error) {
      showArchivedStatus("error", error.message);
      courseCreatorStore.setState({ restorePendingCourseId: "" });
    });
  }

  permanentlyDeleteCourse(courseId) {
    var self = this;
    var currentState = courseCreatorStore.getState();

    if (currentState.restorePendingCourseId || currentState.permanentDeletePendingCourseId) {
      return;
    }

    if (!confirm("Permanently delete this archived course? This cannot be undone.")) {
      return;
    }

    courseCreatorStore.setState({ permanentDeletePendingCourseId: courseId });
    showArchivedStatus("loading", "Permanently deleting course...");

    catalogCourseService.permanentlyDeleteCourse(courseId).then(function (result) {
      if (!result || !result.emitted || !result.emitted.success) {
        throw new Error(self.readResultErrorMessage(result));
      }

      showArchivedStatus("loading", "Refreshing archived courses...");
      courseCreatorStore.setState({
        permanentDeletePendingCourseId: "",
        isArchivedListReloading: true
      });
      window.setTimeout(function () {
        self.loadData();
      }, 500);
    }).catch(function (error) {
      showArchivedStatus("error", error.message);
      courseCreatorStore.setState({
        permanentDeletePendingCourseId: "",
        isArchivedListReloading: false
      });
    });
  }

  bindCreateModal() {
    var self = this;
    var modal = document.getElementById("createModal");
    var titleInput = document.getElementById("newCourseTitle");
    var errorText = document.getElementById("createError");

    document.getElementById("openCreateModalBtn").addEventListener("click", function () {
      resetCreateForm();
      modal.classList.remove("hidden");
      titleInput.focus();
    });

    document.getElementById("closeModalBtn").addEventListener("click", function () {
      modal.classList.add("hidden");
    });

    document.getElementById("cancelModalBtn").addEventListener("click", function () {
      modal.classList.add("hidden");
    });

    document.getElementById("submitCreateBtn").addEventListener("click", function () {
      var payload = readCreatePayload();
      var validation = validateCreatePayload(payload);

      hideCreateError(errorText);

      if (!validation.valid) {
        showCreateError(errorText, validation.message);
        return;
      }

      setCreateButtonPending(true);
      showCreateStatus("loading", "Creating course...");

      catalogCourseService.createCatalogCourse(payload).then(function (result) {
        if (!result || !result.emitted || !result.emitted.success) {
          throw new Error(self.readResultErrorMessage(result));
        }

        showCreateStatus("success", "Course created.");
        modal.classList.add("hidden");
        setCreateButtonPending(false);
        self.loadData();
      }).catch(function (error) {
        showCreateStatus("error", error.message);
        setCreateButtonPending(false);
      });
    });
  }

  readResultErrorMessage(result) {
    if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
      return result.emitted.errors[0].message || result.emitted.errors[0].code || "Intent failed.";
    }

    if (result && result.errors && result.errors.length > 0) {
      return result.errors[0].message || result.errors[0].code || "Intent failed.";
    }

    return "Intent failed.";
  }
}

function buildCourseCard(course, state) {
  var title = readLocalizedText(course.title, course.defaultLanguage) || "Untitled Course";
  var description = readLocalizedText(course.description, course.defaultLanguage) || "Add a description before publishing.";
  var status = readCourseStatus(course);
  var isArchivePending = state && state.archivePendingCourseId === course.id;
  var isAnyArchivePending = Boolean(state && state.archivePendingCourseId);
  var cardClass = isArchivePending ? " builder-course-card-archiving" : "";
  var actionDisabled = isArchivePending ? " disabled" : "";
  var archiveDisabled = isAnyArchivePending || status === "archived" ? " disabled" : "";
  var archiveLabel = isArchivePending
    ? '<span class="oqu-spinner oqu-spinner-blue"></span> Archiving...'
    : (status === "archived" ? "Archived" : "Archive");
  var moduleCount = readVerifiedCount(course, "moduleCount");
  var stepCount = readVerifiedCount(course, "stepCount");
  var countSource = course.countSource || course.moduleCountSource || "catalogCourses";
  var moduleLabel = buildCountLabel(moduleCount, "module");
  var stepLabel = buildCountLabel(stepCount, "step");
  var legacySourceLabel = countSource === "courses" ? '<span class="builder-count-source">Legacy source</span>' : "";

  return `
    <article class="builder-course-card${cardClass}" aria-busy="${isArchivePending ? "true" : "false"}">
      <div class="builder-course-card-top">
        <img src="./src/assets/module-stack.svg" alt="">
        <span class="builder-badge builder-badge-${escapeHtml(status)}">${escapeHtml(status)}</span>
      </div>
      ${isArchivePending ? '<div class="builder-archive-overlay"><span class="oqu-spinner oqu-spinner-blue"></span><strong>Archiving course...</strong></div>' : ''}
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
      <div class="builder-course-meta">
        <span>${escapeHtml(moduleLabel)}</span>
        <span>${escapeHtml(stepLabel)}</span>
        ${legacySourceLabel}
        <span>${escapeHtml(readUpdatedLabel(course.updatedAt || course.createdAt))}</span>
      </div>
      <div class="builder-card-actions">
        <button data-course-action="edit" data-id="${escapeHtml(course.id)}"${actionDisabled}>Edit</button>
        <button data-course-action="preview" data-id="${escapeHtml(course.id)}"${actionDisabled}>Preview</button>
        <button data-course-action="publish" data-id="${escapeHtml(course.id)}"${actionDisabled}>Publish</button>
        <button data-course-action="assign" data-id="${escapeHtml(course.id)}"${actionDisabled}>Assign</button>
        <button class="${isArchivePending ? "builder-archive-btn-pending" : ""}" data-course-action="archive" data-id="${escapeHtml(course.id)}"${archiveDisabled}>${archiveLabel}</button>
      </div>
    </article>
  `;
}

function filterCourses(courses, searchQuery, statusFilter) {
  var query = searchQuery.toLowerCase().trim();

  return courses.filter(function (course) {
    if (readCourseStatus(course) === "archived") {
      return false;
    }

    var statusMatches = statusFilter === "all" || readCourseStatus(course) === statusFilter;
    var text = [
      readLocalizedText(course.title, course.defaultLanguage),
      readLocalizedText(course.description, course.defaultLanguage),
      course.subject || "",
      course.level || ""
    ].join(" ").toLowerCase();

    return statusMatches && (!query || text.indexOf(query) !== -1);
  });
}

function getArchivedCourses(courses) {
  return courses.filter(function (course) {
    return readCourseStatus(course) === "archived";
  }).sort(compareByUpdatedDate);
}

function buildArchivedCourseRow(course, state) {
  var title = readLocalizedText(course.title, course.defaultLanguage) || "Untitled Course";
  var description = readLocalizedText(course.description, course.defaultLanguage) || "No description yet.";
  var moduleCount = readVerifiedCount(course, "moduleCount");
  var stepCount = readVerifiedCount(course, "stepCount");
  var isRestorePending = state && state.restorePendingCourseId === course.id;
  var isDeletePending = state && state.permanentDeletePendingCourseId === course.id;
  var isAnyPending = Boolean(state && (state.restorePendingCourseId || state.permanentDeletePendingCourseId));
  var disabled = isAnyPending ? " disabled" : "";
  var restoreLabel = isRestorePending
    ? '<span class="oqu-spinner oqu-spinner-blue"></span> Restoring...'
    : "Restore to Draft";
  var deleteLabel = isDeletePending
    ? '<span class="oqu-spinner oqu-spinner-blue"></span> Deleting...'
    : "Permanently Delete";

  return `
    <article class="builder-archive-row" aria-busy="${isRestorePending || isDeletePending ? "true" : "false"}">
      <div>
        <span class="builder-badge builder-badge-archived">archived</span>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
        <div class="builder-course-meta">
          <span>${escapeHtml(buildCountLabel(moduleCount, "module"))}</span>
          <span>${escapeHtml(buildCountLabel(stepCount, "step"))}</span>
          <span>${escapeHtml(readUpdatedLabel(course.updatedAt || course.createdAt))}</span>
        </div>
      </div>
      <div class="builder-archive-row-actions">
        <button data-archived-course-action="restore" data-id="${escapeHtml(course.id)}"${disabled}>${restoreLabel}</button>
        <button class="builder-danger-btn" data-archived-course-action="permanent-delete" data-id="${escapeHtml(course.id)}"${disabled}>${deleteLabel}</button>
      </div>
    </article>
  `;
}

function buildArchivedEmptyState() {
  return '<section class="builder-empty builder-archive-empty"><img src="./src/assets/empty-course.svg" alt=""><h2>No archived courses</h2><p>Archived courses will appear here after they are removed from the active builder list.</p></section>';
}

function buildArchivedReloadingState() {
  return '<section class="builder-archive-reloading" aria-live="polite" aria-busy="true"><div><span class="oqu-spinner oqu-spinner-blue"></span><strong>Reloading archived courses...</strong><small>Updating the list after permanent delete.</small></div>' + buildArchivedSkeletonRows(3) + '</section>';
}

function buildArchivedSkeletonRows(count) {
  var html = "";
  var index = 0;

  while (index < count) {
    html += '<article class="builder-archive-row builder-skeleton"><div></div><span></span><p></p></article>';
    index = index + 1;
  }

  return html;
}

function readCreatePayload() {
  var languagesSelect = document.getElementById("newCourseLanguages");
  var selectedLanguages = [];

  for (var index = 0; index < languagesSelect.options.length; index++) {
    if (languagesSelect.options[index].selected) {
      selectedLanguages.push(languagesSelect.options[index].value);
    }
  }

  return {
    title: document.getElementById("newCourseTitle").value.trim(),
    description: document.getElementById("newCourseDescription").value.trim(),
    subject: document.getElementById("newCourseSubject").value.trim(),
    level: document.getElementById("newCourseLevel").value.trim(),
    language: document.getElementById("newCourseLanguage").value,
    defaultLanguage: document.getElementById("newCourseLanguage").value,
    languages: selectedLanguages,
    status: "draft",
    tags: []
  };
}

function validateCreatePayload(payload) {
  if (!payload.title) {
    return { valid: false, message: "Course title is required." };
  }

  if (payload.languages.length === 0) {
    return { valid: false, message: "Select at least one language." };
  }

  if (payload.languages.indexOf(payload.defaultLanguage) === -1) {
    return { valid: false, message: "Default language must be selected." };
  }

  return { valid: true };
}

function resetCreateForm() {
  document.getElementById("newCourseTitle").value = "";
  document.getElementById("newCourseDescription").value = "";
  document.getElementById("newCourseSubject").value = "";
  document.getElementById("newCourseLevel").value = "";
  document.getElementById("newCourseLanguage").value = "en";
  var languagesSelect = document.getElementById("newCourseLanguages");

  for (var index = 0; index < languagesSelect.options.length; index++) {
    languagesSelect.options[index].selected = languagesSelect.options[index].value === "en";
  }

  hideCreateError(document.getElementById("createError"));
  hideStatus(document.getElementById("createStatusBanner"));
}

function setCreateButtonPending(isPending) {
  var button = document.getElementById("submitCreateBtn");
  button.disabled = isPending;
  button.textContent = isPending ? "Creating..." : "Create Course";
}

function showCreateError(errorText, message) {
  errorText.textContent = message;
  errorText.hidden = false;
}

function hideCreateError(errorText) {
  errorText.textContent = "";
  errorText.hidden = true;
}

function showCreateStatus(type, message) {
  showStatus(document.getElementById("createStatusBanner"), type, message);
}

function showArchivedStatus(type, message) {
  showStatus(document.getElementById("archivedCoursesStatus"), type, message);
}

function showPageStatus(type, message) {
  showStatus(document.getElementById("courseBuilderStatus"), type, message);
}

function showStatus(element, type, message) {
  if (!element) {
    return;
  }

  element.className = "builder-status builder-status-" + type;
  element.textContent = message;
  element.hidden = false;
}

function hideStatus(element) {
  if (!element) {
    return;
  }

  element.hidden = true;
  element.textContent = "";
}

function buildSkeletonCards(count) {
  var html = "";
  var index = 0;

  while (index < count) {
    html += '<article class="builder-course-card builder-skeleton"><div></div><span></span><p></p><p></p></article>';
    index = index + 1;
  }

  return html;
}

function buildEmptyState() {
  return '<section class="builder-empty"><img src="./src/assets/empty-course.svg" alt=""><h2>No courses found</h2><p>Create a course shell or adjust your filters.</p></section>';
}

function readLocalizedText(value, defaultLanguage) {
  var language = defaultLanguage || "en";

  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return value[language] || value.en || value.ru || value.ky || "";
}

function readCourseStatus(course) {
  if (course && course.isArchived) {
    return "archived";
  }

  if (course && course.status) {
    return course.status;
  }

  return "draft";
}

function readVerifiedCount(course, key) {
  if (!course || course.countsVerified !== true) {
    return null;
  }

  return typeof course[key] === "number" ? course[key] : 0;
}

function buildCountLabel(count, label) {
  if (count === null) {
    return "Counting...";
  }

  return count + " " + label + (count === 1 ? "" : "s");
}

function readUpdatedLabel(value) {
  var date = readDate(value);

  if (!date) {
    return "Updated recently";
  }

  return "Updated " + date.toLocaleDateString();
}

function readDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (value.seconds) {
    return new Date(value.seconds * 1000);
  }

  if (typeof value === "number") {
    return new Date(value);
  }

  return null;
}

function compareByUpdatedDate(a, b) {
  return readDateMillis(b.updatedAt || b.createdAt) - readDateMillis(a.updatedAt || a.createdAt);
}

function readDateMillis(value) {
  var date = readDate(value);

  return date ? date.getTime() : 0;
}

function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
