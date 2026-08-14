const JOURNEY_START_KEY = "oquwayStudentJourneyStartedAt";
const JOURNEY_MARKS_KEY = "oquwayStudentJourneyMarks";

export function startStudentPortalJourney() {
  if (!window.sessionStorage) return;

  if (!window.sessionStorage.getItem(JOURNEY_START_KEY)) {
    window.sessionStorage.setItem(JOURNEY_START_KEY, String(Date.now()));
    window.sessionStorage.setItem(JOURNEY_MARKS_KEY, "[]");
  }

  markStudentPortalJourney("login-script-ready");
}

export function markStudentPortalJourney(name) {
  if (!name || !window.sessionStorage) return;

  var startedAt = Number(window.sessionStorage.getItem(JOURNEY_START_KEY) || Date.now());
  var marks = readMarks();
  var entry = {
    name: name,
    elapsedMs: Math.max(0, Date.now() - startedAt),
    at: Date.now()
  };

  marks = marks.filter(function (mark) { return mark.name !== name; });
  marks.push(entry);
  window.sessionStorage.setItem(JOURNEY_MARKS_KEY, JSON.stringify(marks));

  if (window.performance && typeof window.performance.mark === "function") {
    window.performance.mark("oquway:" + name);
  }

  window.dispatchEvent(new CustomEvent("oquway:student-journey", { detail: entry }));
}

export function completeStudentPortalJourney() {
  markStudentPortalJourney("dashboard-interactive");
  var marks = readMarks();

  console.info("[student-portal-performance]", marks.map(function (mark) {
    return { milestone: mark.name, elapsedMs: mark.elapsedMs };
  }));

  return marks;
}

function readMarks() {
  try {
    var marks = JSON.parse(window.sessionStorage.getItem(JOURNEY_MARKS_KEY) || "[]");
    return Array.isArray(marks) ? marks : [];
  } catch (error) {
    return [];
  }
}
