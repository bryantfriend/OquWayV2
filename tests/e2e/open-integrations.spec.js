import { test, expect } from "@playwright/test";

test("localized UI changes language and falls back safely", async function ({ page }) {
  await page.goto("/tests/fixtures/open-integrations.html");
  await expect(page.locator("#localizedStatus")).toHaveText("Order saved.");

  await page.selectOption("#languageSelect", "ru");
  await expect(page.locator("#localizedStatus")).toHaveText("Порядок сохранен.");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");

  var fallback = await page.evaluate(async function () {
    var localization = await import("/packages/shared/localization/localizationService.js?v=1.1.209-open-integrations");
    return localization.translate("missing.integration.key");
  });
  expect(fallback).toBe("missing.integration.key");
});

test("sortable adapter reorders stable IDs and keyboard path records one write", async function ({ page }) {
  await page.goto("/tests/fixtures/open-integrations.html");
  await page.click("#keyboardMoveDown");

  await expect(page.locator("#sortableStatus")).toHaveText("Order saved.");
  await expect.poll(function () {
    return page.evaluate(function () {
      return window.oquwayLastOrder.join(",");
    });
  }).toBe("module-b,module-a,module-c");
  await expect.poll(function () {
    return page.evaluate(function () {
      return window.oquwayWrites;
    });
  }).toBe(1);
});

test("DOMPurify profiles remove unsafe rich text and SVG payloads", async function ({ page }) {
  await page.goto("/tests/fixtures/open-integrations.html");

  await expect(page.locator("#richText strong")).toHaveText("learner");
  await expect(page.locator("#richText script")).toHaveCount(0);
  await expect(page.locator("#richText img")).toHaveCount(0);
  await expect(page.locator("#svgMarkup script")).toHaveCount(0);
  await expect(page.locator("#svgMarkup foreignObject")).toHaveCount(0);

  var xssState = await page.evaluate(function () {
    return {
      xss: window.__xss === 1,
      svgXss: window.__svgXss === 1
    };
  });
  expect(xssState).toEqual({ xss: false, svgXss: false });
});

test("SVG.js roadmap renders one root and supports pointer and keyboard activation", async function ({ page }) {
  await page.goto("/tests/fixtures/open-integrations.html");

  await expect(page.locator("[data-oqu-svg-root]")).toHaveCount(1);
  await page.locator("[data-oqu-svg-root] [role='button']").first().click();
  await expect(page.locator("#svgStatus")).toHaveText("node-1");

  await page.locator("[data-oqu-svg-root] [role='button']").nth(1).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#svgStatus")).toHaveText("node-2");

  await page.evaluate(function () {
    window.oquwaySvgScene.destroy();
  });
  await expect(page.locator("[data-oqu-svg-root]")).toHaveCount(0);
});
