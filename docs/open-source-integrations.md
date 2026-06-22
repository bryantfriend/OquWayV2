# Open-Source Integration Architecture

## Adapter Boundaries

OquWay wraps each runtime dependency before app code uses it:

- SortableJS: `packages/ui/adapters/sortableListAdapter.js`
- DOMPurify: `packages/shared/security/contentSanitizer.js`
- i18next: `packages/shared/localization/localizationService.js`
- SVG.js: `packages/ui/adapters/svgSceneAdapter.js`
- Playwright: `playwright.config.js` and `tests/e2e`

The runtime data flow remains:

UI -> OquWay adapter -> existing app service -> existing ICF intent -> authoritative persistence.

No adapter imports the low-level Firestore SDK.

## ICF Boundaries

Module reordering uses `ReorderModulesIntent`, then the existing draft save path. The Sortable adapter only returns stable ordered module IDs; `courseEditorService.reorderModulesById` compares the order, skips unchanged submissions, and maps the move to the existing intent.

Step reordering uses `ReorderPracticeModeStepsIntent`. The Sortable adapter returns stable step IDs; `moduleEditorService.reorderPracticeModeSteps` skips unchanged order before optimistic state or writes.

Course description sanitization happens before `UpdateCourseMetadataIntent` or `UpdateCourseFieldIntent` receives supported rich text. Render-time escaping remains in place for legacy records.

SVG Roadmap interaction flows through SVG.js -> `svgSceneAdapter` -> normalized activation -> existing Roadmap button behavior -> Step Engine completion callback.

## Sanitization Profiles

`plainText` uses text content and never turns text into HTML.

`restrictedRichText` allows narrow educational formatting such as paragraphs, lists, emphasis, code, and safe links. It removes scripts, event handlers, iframes, forms, JavaScript URLs, and unsafe embeds.

`restrictedSvg` allows basic SVG shapes/text and removes scripts, event attributes, `foreignObject`, and active external references. Trusted SVG.js scenes are constructed from OquWay-owned configuration rather than serialized vendor objects.

## Localization

Locale resources live in `packages/shared/localization/locales`. Current languages are English (`en`), Russian (`ru`), and Kyrgyz (`ky`).

Locale resolution order:

1. Local UI preference in `localStorage`
2. Supported browser locale
3. English fallback

The preference is browser/device-local. No new Firestore collection was added.

Translations are rendered with `textContent` or escaped strings. i18next interpolation escaping remains enabled.

## SVG Scene Lifecycle

`initializeSvgScene` validates the container, destroys an existing scene, creates one responsive SVG root, binds pointer and keyboard interaction, respects reduced motion, and removes listeners/SVG roots on destroy. Future SVG renderers should pass OquWay-owned scene configuration and route interactions back to the Step Engine.

## Feature Flags And Rollback

Runtime flags live in `packages/shared/config/features.js` and may be overridden with `window.OQUWAY_FEATURE_FLAGS`:

- `sortableAuthoring`
- `localizedUi`
- `svgRoadmapRenderer`

DOMPurify is not optional at unsafe rich-text/SVG boundaries. Playwright is development-only.

Rollback does not require Firestore changes: turn off Sortable or SVG flags to use existing controls/rendering, or turn off `localizedUi` to render English fallback.

## Playwright

Commands:

- `npm install`
- `npx playwright install chromium`
- `npm run test:integration`
- `npm run test:e2e`
- `npm run test:e2e:headed`
- `npm run test:e2e:ui`

`OQUWAY_E2E_BASE_URL` can point tests at an existing local server. Without it, Playwright starts `tests/fixtures/staticServer.js`.

Synthetic fixtures in `tests/fixtures/open-integrations.html` contain no real student data, credentials, tokens, emotional check-ins, or production screenshots.

## Manual Test Checklist

1. Run `npm install`.
2. Run `npx playwright install chromium`.
3. Start the Course Creator app using the repo’s normal Firebase/local hosting flow.
4. Log in with a synthetic course creator/admin.
5. Open a synthetic course overview, drag modules in the Visual Module Map, reload, and confirm the order remains.
6. Use module move up/down buttons and confirm the same persistence.
7. Open a module editor, drag learning activities, reload, and confirm step content follows stable step IDs.
8. Use step move up/down buttons and confirm the same persistence.
9. Try an unauthorized account and confirm reorder does not persist.
10. Disable network or emulator writes during reorder and confirm the UI restores the previous order and shows an error.
11. Save a course description containing allowed formatting and unsafe HTML; confirm formatting remains and unsafe markup is removed.
12. Change language between English, Russian, and Kyrgyz; confirm shared labels and `html[lang]` update and survive reload in the same browser.
13. Open a Roadmap step; confirm one SVG root renders, pointer and keyboard activation work, and completion still flows through the existing Step Engine.
14. Enable reduced motion in the browser/OS and confirm the SVG scene remains usable without relying on animation.
15. Run `npm run test:integration`.

## Known Limitations

Client-side sanitization cannot protect writes made by a malicious client that bypasses the UI. Existing validators and Firestore rules still enforce field shape and authorization, while render-time sanitization protects legacy records.

Only a focused shared UI slice is localized in this implementation; author-created course content is intentionally not translated.

The SVG.js vertical slice covers the classic Roadmap renderer. Other visual step renderers can adopt the same adapter later.
