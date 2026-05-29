const apps = [
  {
    icon: "🎓",
    title: "Student Login",
    description: "Student access portal.",
    href: "./apps/student-login/"
  },
  {
    icon: "📘",
    title: "Student Dashboard",
    description: "Student learning dashboard.",
    href: "./apps/student-dashboard/"
  },
  {
    icon: "🧑‍🏫",
    title: "Teacher Dashboard",
    description: "Teacher classroom tools.",
    href: "./apps/teacher-dashboard/"
  },
  {
    icon: "🏫",
    title: "School Admin Dashboard",
    description: "Manage classes, teachers and students.",
    href: "./apps/school-admin-dashboard/"
  },
  {
    icon: "🗺️",
    title: "Regional Admin Dashboard",
    description: "Regional oversight and analytics.",
    href: "./apps/regional-admin-dashboard/"
  },
  {
    icon: "📊",
    title: "Ministry Dashboard",
    description: "National educational analytics.",
    href: "./apps/ministry-dashboard/"
  },
  {
    icon: "📚",
    title: "Course Dashboard",
    description: "Browse and manage courses.",
    href: "./apps/course-dashboard/"
  },
  {
    icon: "🛠️",
    title: "Course Creator",
    description: "Create modules, lessons and tracks.",
    href: "./apps/course-creator-dashboard/"
  },
  {
    icon: "⚙️",
    title: "Super Admin Dashboard",
    description: "System-wide management.",
    href: "./apps/super-admin-dashboard/"
  },
  {
    icon: "🧪",
    title: "Developer Sandbox",
    description: "Experimental tools and testing.",
    href: "./apps/dev-sandbox/"
  }
];

const appGrid = document.getElementById("appGrid");
const appSearch = document.getElementById("appSearch");
const currentYear = document.getElementById("currentYear");

function renderApps(items) {
  if (!appGrid) {
    return;
  }

  if (items.length === 0) {
    appGrid.innerHTML = '<div class="empty-state">No applications match your search.</div>';
    return;
  }

  appGrid.innerHTML = items.map(function (app) {
    return [
      '<article class="app-card">',
      '<div class="app-icon" aria-hidden="true">' + escapeHtml(app.icon) + '</div>',
      '<div>',
      '<h2>' + escapeHtml(app.title) + '</h2>',
      '<p>' + escapeHtml(app.description) + '</p>',
      '</div>',
      '<a class="open-button" href="' + escapeHtml(app.href) + '">Open</a>',
      '</article>'
    ].join("");
  }).join("");
}

function filterApps(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return apps;
  }

  return apps.filter(function (app) {
    return app.title.toLowerCase().indexOf(normalizedQuery) !== -1
      || app.description.toLowerCase().indexOf(normalizedQuery) !== -1;
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (appSearch) {
  appSearch.addEventListener("input", function () {
    renderApps(filterApps(appSearch.value));
  });
}

renderApps(apps);
