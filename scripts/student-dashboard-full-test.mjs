import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const port = Number(process.env.STUDENT_DASHBOARD_FULL_TEST_PORT || 4190);
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const artifactDir = path.join(repoRoot, "output", "playwright");
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
const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
const failures = [];
const warnings = [];
const consoleErrors = [];
const debugLogs = [];

page.on("console", (message) => {
  const text = message.text();
  if (message.type() === "error") {
    consoleErrors.push(text);
  }

  if (text.indexOf("[StudentDashboard]") !== -1
      || text.indexOf("[student-course") !== -1
      || text.indexOf("[student-open-course") !== -1) {
    debugLogs.push(message.type() + ": " + text);
  }
});

page.on("pageerror", (error) => {
  consoleErrors.push(error && error.message ? error.message : String(error));
});

try {
  await page.goto(`${baseUrl}/apps/student-dashboard/index.html?preview=1&smoke=1&studentDebug=1`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".student-course-card, .student-empty, .student-error", { timeout: 45000 });
  await failOnVisibleError(page, "initial dashboard");

  await clickDashboardButtons(page, failures, warnings);
  await openCourseFocus(page, failures);
  await clickCourseFocusButtons(page, failures, warnings);
  await completeSelectedModuleActivities(page, failures, warnings);
  await failOnVisibleError(page, "final dashboard state");
} catch (error) {
  failures.push(readErrorMessage(error));
  await captureFailureScreenshot(page, "student-dashboard-full-test-failure.png");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

if (consoleErrors.length > 0) {
  const importantConsoleErrors = consoleErrors.filter((message) => {
    return message.indexOf("Failed to load resource: the server responded with a status of 404") === -1;
  });

  if (importantConsoleErrors.length > 0) {
    failures.push("Browser console/page errors were reported: " + importantConsoleErrors.slice(0, 5).join(" | "));
  } else {
    warnings.push("Browser reported only non-critical 404 resource noise.");
  }
}

if (warnings.length > 0) {
  console.log("Student Dashboard full test warnings:");
  warnings.forEach((warning) => console.log("- " + warning));
}

if (failures.length > 0) {
  if (debugLogs.length > 0) {
    console.error("Student Dashboard debug logs:");
    debugLogs.slice(-20).forEach((entry) => console.error("- " + entry));
  }
  console.error("Student Dashboard full test failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

console.log("Student Dashboard full test passed.");

async function clickDashboardButtons(page, failures, warnings) {
  await clickIfPresent(page.getByRole("button", { name: "Home", exact: true }), "Home dashboard button", failures);
  await clickIfPresent(page.getByRole("button", { name: "Courses", exact: true }), "Courses dashboard button", failures);
  await clickIfPresent(page.getByRole("button", { name: "Profile", exact: true }), "Profile dashboard button", failures);
  await clickIfPresent(page.getByRole("button", { name: "Achievements", exact: true }), "Achievements dashboard button", failures);
  await clickIfPresent(page.getByRole("button", { name: "Rewards", exact: true }), "Rewards dashboard button", failures);

  await clickIfPresent(page.getByRole("button", { name: "Settings", exact: true }), "Settings button", failures);
  if (await page.locator(".student-modal").count() > 0) {
    await clickIfPresent(page.getByRole("button", { name: "Compact", exact: true }), "Compact setting", failures);
    await closeModal(page);
  }

  await clickIfPresent(page.getByRole("button", { name: "Progress Details", exact: true }), "Progress Details button", failures);
  if (await page.locator(".student-modal").count() > 0) {
    await closeModal(page);
  }

  const bonusButton = page.locator(".student-bonus-claim-btn").first();
  if (await bonusButton.count() > 0) {
    await bonusButton.click();
    await page.waitForTimeout(250);
  } else {
    warnings.push("No daily bonus claim button was present on this fixture.");
  }

  await failOnVisibleError(page, "dashboard button pass");
}

async function openCourseFocus(page, failures) {
  if (await page.locator(".student-course-card, .student-continue-learning-btn").count() === 0) {
    await page.goto(`${baseUrl}/apps/student-dashboard/index.html?preview=1&smoke=1&studentDebug=1`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".student-course-card, .student-empty, .student-error", { timeout: 45000 });
    await failOnVisibleError(page, "dashboard reload before course open");
  }

  await clickIfPresent(page.getByRole("button", { name: "Courses", exact: true }), "Courses dashboard button", failures);
  if (await page.locator(".student-course-card, .student-continue-learning-btn").count() === 0) {
    await clickIfPresent(page.getByRole("button", { name: "Home", exact: true }), "Home dashboard button", failures);
  }

  const continueButton = page.locator(".student-continue-learning-btn").first();
  const courseCard = page.locator(".student-course-card").first();

  if (await continueButton.count() > 0) {
    await continueButton.click();
  } else if (await courseCard.count() > 0) {
    await courseCard.click();
  } else {
    throw new Error("No course card or Continue Learning button was available.");
  }

  await page.waitForSelector(".course-focus-shell, .student-player-empty, .course-player-shell, #student-practice-player-root", { timeout: 45000 });
  await failOnVisibleError(page, "course open");

  if (await page.locator(".course-focus-shell").count() === 0) {
    throw new Error("Opening a course did not render the course focus shell.");
  }
}

async function clickCourseFocusButtons(page, failures, warnings) {
  await clickIfPresent(page.getByRole("button", { name: "Courses", exact: true }), "Course focus Courses nav", failures);
  await clickIfPresent(page.getByRole("button", { name: "Achievements", exact: true }), "Course focus Achievements nav", failures);
  await clickIfPresent(page.getByRole("button", { name: "Rewards", exact: true }), "Course focus Rewards nav", failures);

  await openCourseFocus(page, failures);

  const scrollButtons = await page.locator(".course-journey-scroll-btn, .course-activity-scroll-btn").count();
  for (let index = 0; index < scrollButtons; index += 1) {
    await page.locator(".course-journey-scroll-btn, .course-activity-scroll-btn").nth(index).click();
  }

  const modules = await readModuleTargets(page);
  if (modules.length === 0) {
    failures.push("No module buttons were available in course focus.");
    return;
  }

  for (const moduleId of modules) {
    await page.locator(`.course-journey-node[data-module-id="${cssEscape(moduleId)}"]`).first().click();
    await page.waitForTimeout(150);
    await failOnVisibleError(page, `module ${moduleId}`);
  }

  if (await page.locator(".course-focus-continue-btn:not([disabled])").count() > 0) {
    await page.locator(".course-focus-continue-btn:not([disabled])").first().click();
    await page.waitForSelector(".course-player-shell, #student-practice-player-root, .student-player-empty", { timeout: 30000 });
    await page.locator(".course-player-back-btn").first().click();
    await page.waitForSelector(".course-focus-shell", { timeout: 10000 });
  } else {
    warnings.push("Course focus Continue button was disabled for this fixture.");
  }
}

async function completeSelectedModuleActivities(page, failures, warnings) {
  await ensureCourseFocus(page, failures);

  const activities = await readActivityTargets(page);
  if (activities.length === 0) {
    failures.push("The selected module did not expose any playable activity cards.");
    return;
  }

  for (const activity of activities) {
    await ensureCourseFocus(page, failures);
    await clickActivity(page, activity);
    await page.waitForSelector(".course-player-shell, .student-player-empty", { timeout: 45000 });
    await failOnVisibleError(page, `activity ${activity.practiceModeKey}`);

    if (await page.locator(".student-player-empty").count() > 0) {
      warnings.push(`Activity ${activity.practiceModeKey} opened an empty player state.`);
      continue;
    }

    await completeOpenPlayer(page, activity, failures, warnings);
    await page.locator(".course-player-back-btn").first().click();
    await page.waitForSelector(".course-focus-shell", { timeout: 15000 });
  }
}

async function ensureCourseFocus(page, failures) {
  if (await page.locator(".course-focus-shell").count() > 0) {
    return;
  }

  if (await page.locator(".course-player-back-btn").count() > 0) {
    await page.locator(".course-player-back-btn").first().click();
    await page.waitForSelector(".course-focus-shell", { timeout: 15000 });
    return;
  }

  await openCourseFocus(page, failures);
}

async function completeOpenPlayer(page, activity, failures, warnings) {
  const visitedSteps = [];
  const maxSteps = 40;

  for (let index = 0; index < maxSteps; index += 1) {
    if (await page.locator(".course-player-complete-shell").count() > 0) {
      return;
    }

    await page.waitForSelector(".course-player-shell", { timeout: 15000 });
    const stepLabel = await readCurrentStepLabel(page);
    visitedSteps.push(stepLabel);
    await completeCurrentPlayerStep(page, stepLabel, warnings);

    if (await page.locator(".course-player-complete-shell").count() > 0) {
      return;
    }

    const nextButton = page.locator(".course-player-next-btn").first();
    if (await nextButton.count() === 0) {
      failures.push(`No Next/Finish button found after ${stepLabel}.`);
      return;
    }

    await nextButton.click();
    await page.waitForTimeout(300);
  }

  failures.push(`Activity ${activity.practiceModeKey} did not finish within ${maxSteps} player iterations. Visited: ${visitedSteps.join(" -> ")}`);
}

async function completeCurrentPlayerStep(page, stepLabel, warnings) {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    if (await isCurrentStepComplete(page)) {
      return;
    }

    await fillVisibleInputs(page);

    if (await clickFirstVisible(page, [
      ".oqu-player-complete-btn",
      ".course-player-complete-btn",
      "[data-preview-external-task-complete]",
      "[data-eci-complete]",
      "[data-eci-final]:not([disabled])",
      "[data-timed-sequence-next]",
      "[data-sequence-continue]"
    ])) {
      await page.waitForTimeout(350);
      continue;
    }

    if (await clickFirstVisible(page, [
      "[data-eci-mood-key]",
      "[data-eci-generate]",
      "[data-sequence-start]",
      "[data-timed-sequence-start]",
      "[data-sequence-pad]:not([disabled])",
      "[data-timed-sequence-item]:not([disabled])",
      "[data-collector-item]",
      "[data-care-resource]",
      "[data-scenario-option]",
      "[data-scenario-choice]",
      "[data-choice-index]",
      "[data-option-index]",
      "[data-answer-index]",
      "[data-match-item]",
      "[data-ordering-item]",
      ".oqu-step-option",
      ".oqu-answer-option",
      ".oqu-choice-card",
      ".oqu-sort-card",
      ".oqu-match-card"
    ])) {
      await page.waitForTimeout(350);
      continue;
    }

    await clickGenericActivityControl(page);
    await page.waitForTimeout(350);
  }

  if (!(await isCurrentStepComplete(page))) {
    warnings.push(`Could not prove completion through visible activity controls for ${stepLabel}; pressing Next will expose the player guard if it is still incomplete.`);
  }
}

async function isCurrentStepComplete(page) {
  if (await page.locator(".course-player-complete-shell").count() > 0) {
    return true;
  }

  const nextButton = page.locator(".course-player-next-btn").first();
  if (await nextButton.count() === 0) {
    return false;
  }

  return await nextButton.evaluate((button) => !button.disabled);
}

async function clickGenericActivityControl(page) {
  await page.evaluate(() => {
    const root = document.querySelector("#course-player-step-render-target");
    if (!root) {
      return;
    }

    const blocked = [
      ".course-player-back-btn",
      ".course-player-next-btn",
      ".course-player-previous-btn",
      ".course-player-restart-btn",
      "[disabled]"
    ];
    const controls = Array.from(root.querySelectorAll("button, [role='button'], input[type='checkbox'], input[type='radio']"));
    const control = controls.find((candidate) => {
      if (!candidate || !(candidate instanceof HTMLElement)) {
        return false;
      }

      if (blocked.some((selector) => candidate.matches(selector) || candidate.closest(selector))) {
        return false;
      }

      const rect = candidate.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    if (control) {
      control.click();
    }
  });
}

async function fillVisibleInputs(page) {
  await page.evaluate(() => {
    const root = document.querySelector("#course-player-step-render-target");
    if (!root) {
      return;
    }

    const fields = Array.from(root.querySelectorAll("textarea, input[type='text'], input:not([type])"));
    fields.forEach((field) => {
      if (!(field instanceof HTMLInputElement) && !(field instanceof HTMLTextAreaElement)) {
        return;
      }

      if (field.disabled || field.readOnly) {
        return;
      }

      const rect = field.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      field.value = "Student dashboard full test response";
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    });

    const choiceFields = Array.from(root.querySelectorAll("input[type='checkbox'], input[type='radio']"));
    choiceFields.forEach((field) => {
      if (field instanceof HTMLInputElement && !field.disabled && !field.checked) {
        field.click();
      }
    });
  });
}

async function clickFirstVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count() === 0) {
      continue;
    }

    if (!(await locator.isVisible().catch(() => false))) {
      continue;
    }

    if (await locator.isDisabled().catch(() => false)) {
      continue;
    }

    await locator.click();
    return true;
  }

  return false;
}

async function readModuleTargets(page) {
  return page.locator(".course-journey-node[data-module-id]").evaluateAll((nodes) => {
    return Array.from(new Set(nodes.map((node) => node.getAttribute("data-module-id")).filter(Boolean)));
  });
}

async function readActivityTargets(page) {
  return page.locator(".course-activity-card[data-course-id][data-module-id][data-session-id][data-practice-mode-key]").evaluateAll((nodes) => {
    return nodes.map((node) => ({
      courseId: node.getAttribute("data-course-id") || "",
      moduleId: node.getAttribute("data-module-id") || "",
      sessionId: node.getAttribute("data-session-id") || "",
      practiceModeKey: node.getAttribute("data-practice-mode-key") || "",
      label: node.textContent ? node.textContent.trim().replace(/\s+/g, " ") : ""
    })).filter((activity) => activity.courseId && activity.moduleId && activity.sessionId && activity.practiceModeKey);
  });
}

async function clickActivity(page, activity) {
  const selector = [
    `.course-activity-card[data-course-id="${cssEscape(activity.courseId)}"]`,
    `[data-module-id="${cssEscape(activity.moduleId)}"]`,
    `[data-session-id="${cssEscape(activity.sessionId)}"]`,
    `[data-practice-mode-key="${cssEscape(activity.practiceModeKey)}"]`
  ].join("");
  const activityButton = page.locator(selector).first();
  const count = await activityButton.count();

  if (count !== 1) {
    throw new Error(`Activity card expected 1 match for ${activity.label || activity.practiceModeKey}, found ${count}.`);
  }

  await activityButton.scrollIntoViewIfNeeded();
  await activityButton.click();
}

async function readCurrentStepLabel(page) {
  const countText = await page.locator(".course-player-step-count").first().innerText().catch(() => "Learning Activity");
  const titleText = await page.locator(".course-player-title-block p").first().innerText().catch(() => "");
  return `${countText.trim()} ${titleText.trim()}`.trim();
}

async function closeModal(page) {
  const closeButton = page.getByRole("button", { name: "Close", exact: true });
  if (await closeButton.count() > 0) {
    await closeButton.first().click();
    await page.waitForSelector(".student-modal", { state: "detached", timeout: 10000 });
  }
}

async function clickIfPresent(locator, label, failures) {
  const count = await locator.count();
  if (count === 0) {
    return false;
  }

  if (count > 1) {
    failures.push(`${label} expected at most 1 match, found ${count}.`);
    return false;
  }

  await locator.click();
  await pageWaitShort(locator);
  return true;
}

async function pageWaitShort(locator) {
  const page = locator.page();
  await page.waitForTimeout(200);
}

async function failOnVisibleError(page, context) {
  const errorLocator = page.locator(".student-error:visible");

  if (await errorLocator.count() > 0) {
    const text = await errorLocator.first().innerText();
    throw new Error(`${context} rendered an error state: ${text.trim()}`);
  }
}

async function captureFailureScreenshot(page, fileName) {
  try {
    await mkdir(artifactDir, { recursive: true });
    await page.screenshot({ path: path.join(artifactDir, fileName), fullPage: true });
  } catch (error) {
    // Screenshot capture should not hide the original failure.
  }
}

function cssEscape(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
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

function readErrorMessage(error) {
  if (error && error.stack) {
    return error.stack.split("\n").slice(0, 4).join(" | ");
  }

  if (error && error.message) {
    return error.message;
  }

  return String(error);
}
