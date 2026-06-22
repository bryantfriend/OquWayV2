# Third-Party Notices

OquWay vendors browser runtime files from exact npm package versions and keeps development tooling pinned in `package-lock.json`.

| Package | Version | License | Purpose | OquWay adapter | Upgrade notes |
| --- | ---: | --- | --- | --- | --- |
| `sortablejs` | `1.15.7` | MIT | Drag-and-drop ordering for authoring lists | `packages/ui/adapters/sortableListAdapter.js` | Update npm pin, copy `modular/sortable.esm.js`, rerun Playwright reorder tests. |
| `dompurify` | `3.4.11` | MPL-2.0 OR Apache-2.0 | Central rich-text and SVG sanitization | `packages/shared/security/contentSanitizer.js` | Update npm pin, copy `dist/purify.es.mjs`, rerun sanitizer tests. |
| `@playwright/test` | `1.61.0` | Apache-2.0 | Browser-based development and integration tests | `playwright.config.js`, `tests/e2e/open-integrations.spec.js` | Update npm pin, run `npx playwright install`, rerun e2e tests. |
| `i18next` | `26.3.1` | MIT | Shared UI localization for English, Russian, Kyrgyz | `packages/shared/localization/localizationService.js` | Update npm pin, copy `dist/esm/i18next.js`, rerun localization tests. |
| `@svgdotjs/svg.js` | `3.2.5` | MIT | SVG scene construction for Roadmap renderer | `packages/ui/adapters/svgSceneAdapter.js` | Update npm pin, copy `dist/svg.esm.js`, rerun SVG roadmap tests. |

The integrations do not enable telemetry by default and do not send OquWay data to external services.
