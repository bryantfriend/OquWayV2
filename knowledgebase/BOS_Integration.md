# BOS Integration Contract v1

OquWay reports one native fact to BOS: a successfully committed course publication. The integration is disabled by default and runs only in Firebase Functions. Browser applications never receive the BOS endpoint, integration ID, or secret.

## Supported event catalog

| Event type | Canonical evidence | Emission point | Safe data sent |
| --- | --- | --- | --- |
| `course_published` | A `catalogCourses/{courseId}` or legacy `courses/{courseId}` document changes to `status: "published"`, or an already-published course receives a higher numeric `version` from Publish Update | `captureBosCoursePublished` and `captureBosLegacyCoursePublished` Firestore triggers | Fixed factual summary, publication timestamp, environment, course version, and Firebase source-event reference |

The trigger writes `_bosOutbox/{eventId}` with a stable event ID derived from the Firebase event ID. `deliverBosOutboxEvent` then publishes the event. Firestore rules deny all client reads and writes to the outbox.

## Signing contract

The publisher serializes the JSON body once, creates a Unix-seconds timestamp, and signs this exact UTF-8 value:

```text
{timestamp}.{rawJsonBody}
```

It uses HMAC-SHA256 and sends the lowercase hex digest as `X-BOS-Signature: sha256={digest}`. Requests also include `X-BOS-Integration-Id`, `X-BOS-Timestamp`, `Idempotency-Key` (the event ID), and `Content-Type: application/json`.

This implements the BOS v1 draft supplied with this repository task. Before connection, BOS must confirm that its final receiver uses these header names and signing input; if the final BOS repository contract differs, update this boundary and its signing test together.

## Configuration

Copy `functions/.env.example` to the appropriate untracked Firebase Functions environment file for non-secret settings. Do not commit the resulting file.

| Variable | Required when enabled | Purpose |
| --- | --- | --- |
| `BOS_ENABLED` | Yes | Set exactly `true` to capture and deliver events; any other value disables the integration |
| `BOS_EVENTS_ENDPOINT` | Yes | BOS HTTPS ingestion endpoint |
| `BOS_INTEGRATION_ID` | Yes | BOS-issued integration identity; this is not a BOS Project ID |
| `BOS_INTEGRATION_SECRET` | Yes | HMAC secret; store with Firebase Secret Manager outside local development |
| `BOS_ENVIRONMENT` | Yes | `development`, `staging`, or `production` |
| `BOS_TIMEOUT_MS` | No | Per-attempt timeout, default 5000, clamped from 100 through 30000 |
| `BOS_MAX_ATTEMPTS` | No | Total attempts per delivery invocation, default 3, clamped from 1 through 5 |
| `BOS_RETRY_BASE_DELAY_MS` | No | Initial retry delay, default 250, clamped from 1 through 5000 |

For deployed Functions, create the secret without placing it in source control:

```powershell
firebase functions:secrets:set BOS_INTEGRATION_SECRET
```

Set the remaining variables through the repository's normal Firebase Functions environment process. Do not enable BOS until the endpoint, integration ID, environment, secret, and receiver contract have been confirmed.

## Delivery, retry, and replay

Delivery uses a five-second default timeout and bounded exponential retry. HTTP 408, 425, 429, and 5xx responses, network errors, and timeouts are retryable. HTTP 409 is treated as successful duplicate acceptance. Other 4xx responses fail immediately.

Success changes the outbox status to `delivered`. Exhausted or invalid delivery changes it to `failed` with only a safe error code; payloads and receiver response bodies are never logged. No BOS error is thrown back into the course publication transaction because capture and delivery occur after Firestore commits.

Failed records remain durable for investigation. There is intentionally no paid scheduler solely for BOS. After correcting configuration or receiver availability, an operator using the Firebase Admin SDK may set a failed record back to `pending`; that update invokes the delivery trigger again. Event IDs remain unchanged, so receiver idempotency still applies.

## Privacy exclusions

The event builder uses an allowlist. It never reads or sends student identity, names, photos, reflections, uploads, grades, individual activity, actor identity, course titles, descriptions, or course content. Metrics are limited to numeric `courseVersion`. Logs contain only event ID, event type, attempt number, safe status/code, and duplicate state.

## Local testing

From `functions`:

```powershell
npm test
```

The tests use an in-process mock receiver and cover payload validation, deterministic IDs, request signing, success, timeout, retry, duplicate response, unavailable BOS, invalid configuration, secret-safe logs/errors, privacy filtering, authoritative transition detection, and failure isolation.

For emulator testing, create an untracked `functions/.env.local` with development credentials, start the existing Firebase emulators, and update a test `catalogCourses` document from draft to published. Keep `BOS_ENABLED=false` when no mock receiver is running.

## Deliberately unsupported events

- `module_test_completed`: no existing CI workflow or authoritative server transition proves this candidate event.
- `deployment_completed`: `.github/workflows` is empty, so there is no successful deployment job to hook safely.
- `learning_summary_observed`: no dated, server-produced aggregate snapshot currently exists. Client dashboard calculations are not authoritative and may include private student data.

No BOS Project ID, task, decision, deadline, priority, next action, health, readiness, blockage, or project-completion claim is produced.

## Manual BOS connection checklist

1. BOS registers project key `oquway`, allows only `course_published`, and issues the endpoint, integration ID, and secret.
2. BOS confirms the v1 signature headers/input above and idempotent duplicate response behavior.
3. An operator stores `BOS_INTEGRATION_SECRET` in Firebase Secret Manager and configures the non-secret variables for the target environment.
4. Run `npm test` and a development emulator delivery to a mock receiver.
5. Review the emitted payload against `functions/test/fixtures/course-published.json`.
6. Deploy the three Functions and rules through the normal deployment process only after approval; this change does not deploy them.
7. Set `BOS_ENABLED=true` only after the receiver is ready. Set it back to `false` to disable future capture and delivery.
