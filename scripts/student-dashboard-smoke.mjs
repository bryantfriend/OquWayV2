import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const port = Number(process.env.STUDENT_DASHBOARD_SMOKE_PORT || 4188);
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const playwright = await loadPlaywright();

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", baseUrl);
  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(repoRoot, safePath === path.sep ? "index.html" : safePath);

  if (!filePath.startsWith(repoRoot)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, { "content-type": readContentType(filePath), "cache-control": "no-store" });
    response.end(body);
  } catch (error) {
    response.writeHead(404);
    response.end("Not found");
  }
});

await new Promise((resolve) => server.listen(port, host, resolve));

const browser = await launchBrowser(playwright);
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const failures = [];

try {
  await page.goto(`${baseUrl}/apps/student-dashboard/index.html?preview=1&smoke=1`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".student-course-card, .student-empty", { timeout: 45000 });

  await checkProfileModal(page, failures);
  await checkSettingsModal(page, failures);
  await checkProgressModal(page, failures);
  await checkSidebarNavigation(page, failures);
  await checkCourseOpenAndBack(page, failures);
  await checkUnfinishedPracticeMode(page, failures);
  await checkNoCoursesPreview(page, failures);
  await checkOptionalViewFailure(page, failures);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length > 0) {
  console.error("Student Dashboard smoke failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

console.log("Student Dashboard smoke passed.");

async function checkProfileModal(page, failures) {
  await clickUnique(page.getByRole("button", { name: "Profile", exact: true }), "Profile button");
  const text = await readModalText(page);
  if (!text.includes("Student Profile") || !text.includes("ASSIGNED COURSES")) {
    failures.push("Profile modal did not show student profile fields.");
  }
  await closeModal(page);
}

async function checkSettingsModal(page, failures) {
  await clickUnique(page.getByRole("button", { name: "Settings", exact: true }), "Settings button");
  const text = await readModalText(page);
  if (!text.includes("Settings") || !text.includes("Language") || !text.includes("Dashboard density")) {
    failures.push("Settings modal did not show real settings controls.");
  }
  await clickUnique(page.getByRole("button", { name: "Compact", exact: true }), "Compact setting");
  const compactActive = await page.locator(".student-settings-choice-active", { hasText: "Compact" }).count();
  if (compactActive !== 1) {
    failures.push("Settings preference did not update selected state.");
  }
  await closeModal(page);
}

async function checkProgressModal(page, failures) {
  await clickUnique(page.getByRole("button", { name: "Progress Details", exact: true }), "Progress Details button");
  const text = await readModalText(page);
  const normalizedText = text.toLowerCase();
  if (!normalizedText.includes("progress details") || !normalizedText.includes("assigned") || !normalizedText.includes("overall")) {
    failures.push("Progress Details modal did not show summary data.");
  }
  await closeModal(page);
}

async function checkCourseOpenAndBack(page, failures) {
  await clickUnique(page.getByRole("button", { name: "Home", exact: true }), "Home sidebar button");
  const continueButtonCount = await page.locator(".student-continue-learning-btn").count();
  const courseCardCount = await page.locator(".student-course-card").count();

  if (continueButtonCount === 0 && courseCardCount === 0) {
    return;
  }

  if (continueButtonCount === 1) {
    await clickUnique(page.locator(".student-continue-learning-btn"), "Continue Learning button");
  } else {
    await page.locator(".student-course-card").first().click();
  }

  await page.waitForSelector(".student-player-empty, .course-player-shell, #student-practice-player-root", { timeout: 45000 });
  const hasCourseState = await page.locator(".student-player-empty").count();
  const hasPlayer = await page.locator(".course-player-shell, #student-practice-player-root").count();
  if (hasCourseState === 0 && hasPlayer === 0) {
    failures.push("Continue Learning did not open a player or a clear course state.");
    return;
  }

  const backButton = page.getByRole("button", { name: "Return to Dashboard", exact: true });
  if (await backButton.count() === 1) {
    await backButton.click();
    await page.waitForSelector(".student-course-card, .student-empty", { timeout: 10000 });
  }
}

async function checkSidebarNavigation(page, failures) {
  await clickUnique(page.getByRole("button", { name: "Courses", exact: true }), "Courses sidebar button");
  await expectActiveSidebar(page, "Courses", failures);
  let text = await page.locator("#app").innerText();
  if (!text.includes("All Assigned Courses")) {
    failures.push("Courses sidebar view did not show the full courses layout.");
  }

  await clickUnique(page.getByRole("button", { name: "Achievements", exact: true }), "Achievements sidebar button");
  await expectActiveSidebar(page, "Achievements", failures);
  text = await page.locator("#app").innerText();
  if (!text.includes("No achievements yet") || !text.includes("Keep learning to unlock your first one.")) {
    failures.push("Achievements sidebar view did not show the expected empty state.");
  }

  await clickUnique(page.getByRole("button", { name: "Rewards", exact: true }), "Rewards sidebar button");
  await expectActiveSidebar(page, "Rewards", failures);
  text = await page.locator("#app").innerText();
  if (!text.includes("Rewards")) {
    failures.push("Rewards sidebar view did not render.");
  }

  await clickUnique(page.getByRole("button", { name: "Calendar", exact: true }), "Calendar sidebar button");
  await expectActiveSidebar(page, "Calendar", failures);
  text = await page.locator("#app").innerText();
  if (!text.includes("No calendar items yet.")) {
    failures.push("Calendar sidebar view did not show the expected empty state.");
  }

  await clickUnique(page.getByRole("button", { name: "Home", exact: true }), "Home sidebar button");
  await expectActiveSidebar(page, "Home", failures);
  text = await page.locator("#app").innerText();
  if (!text.includes("Continue Learning") && !text.includes("No assigned courses yet")) {
    failures.push("Home sidebar view did not return to the dashboard home layout.");
  }
}

async function checkUnfinishedPracticeMode(page, failures) {
  const emptyMode = page.locator(".student-practice-empty-mode").first();
  if (await emptyMode.count() < 1) {
    return;
  }

  await emptyMode.click();
  const text = await readModalText(page);
  if (!text.includes("This practice mode is not ready yet")) {
    failures.push("Empty practice mode did not show a not-ready modal.");
  }
  await closeModal(page);
}

async function checkNoCoursesPreview(page, failures) {
  await page.goto(`${baseUrl}/apps/student-dashboard/index.html?preview=1&emptyCourses=1&smoke=1`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".student-empty", { timeout: 10000 });
  const text = await page.locator("#app").innerText();

  if (!text.includes("No assigned courses yet") || !text.includes("Check Again") || !text.includes("View Profile") || !text.includes("Courses")) {
    failures.push("No-courses preview did not show the improved empty state actions.");
  }
}

async function checkOptionalViewFailure(page, failures) {
  await page.goto(`${baseUrl}/apps/student-dashboard/index.html?preview=1&failAchievements=1&smoke=1`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".student-course-card, .student-empty", { timeout: 45000 });
  await clickUnique(page.getByRole("button", { name: "Achievements", exact: true }), "Achievements sidebar button");
  await expectActiveSidebar(page, "Achievements", failures);
  const text = await page.locator("#app").innerText();

  if (!text.includes("Preview failure for achievements.") || !text.includes("No achievements yet")) {
    failures.push("Failed achievements lookup did not keep the dashboard open with a clear state.");
  }
}

async function expectActiveSidebar(page, label, failures) {
  const activeText = await page.locator(".student-sidebar-btn-active").innerText();

  if (activeText.trim() !== label) {
    failures.push(`Sidebar active state expected ${label}, found ${activeText.trim()}.`);
  }
}

async function readModalText(page) {
  await page.waitForSelector(".student-modal", { timeout: 10000 });
  return page.locator(".student-modal").innerText();
}

async function closeModal(page) {
  const closeButton = page.getByRole("button", { name: "Close", exact: true });
  if (await closeButton.count() === 1) {
    await closeButton.click();
    await page.waitForSelector(".student-modal", { state: "detached", timeout: 10000 });
  }
}

async function clickUnique(locator, label) {
  const count = await locator.count();
  if (count !== 1) {
    throw new Error(`${label} expected 1 match, found ${count}.`);
  }
  await locator.click();
}

function readContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js" || ext === ".mjs") return "text/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch (error) {
    const require = createRequire(import.meta.url);
    const bundledPath = "C:/Users/fangb_kyiapn1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright";
    return require(bundledPath);
  }
}

async function launchBrowser(playwrightApi) {
  const channels = [process.env.PLAYWRIGHT_CHANNEL, "chrome", "msedge"].filter(Boolean);
  let lastError = null;

  for (const channel of channels) {
    try {
      return await playwrightApi.chromium.launch({ channel, headless: true });
    } catch (error) {
      lastError = error;
    }
  }

  try {
    return await playwrightApi.chromium.launch({ headless: true });
  } catch (error) {
    throw lastError || error;
  }
}
