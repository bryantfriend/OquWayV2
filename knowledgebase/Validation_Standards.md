Validation Standards

Current ICF Alignment

This document must be interpreted through the latest ICF template:
C:/Users/fangb_kyiapn1/OneDrive/Desktop/Working/ICF/Template/ICF.md

If older wording in this document conflicts with that file, ICF.md wins.

Current required ICF sequence:
Intent Registration
Validate
Normalize
AddContext
Authorize
Process
Emit

Current ICF folders:
packages/core/src/icf/engine
packages/core/src/icf/intents
packages/core/src/icf/stages

Current stage folders:
validate
normalize
addContext
authorize
process
emit

Each stage folder may contain only:
core
domain

Every Intent must explicitly declare all six runtime stages, even empty pass-through arrays. Intent files are declarations and stage maps only.

ICF JavaScript rules:
No arrow functions.
No optional chaining.
No nullish coalescing.
No crypto API.
Use clear variable names, explicit helper functions, clear stage separation, and no clever shortcuts.


Project: OquWay
Architecture Model: Intent-Centric Framework (ICF)
Scope: ICF Validation Stage
Version: 1.0

1. Purpose

Validation is the first defensive boundary of the ICF pipeline.

Its purpose is to ensure:

Structural correctness

Business rule compliance

Deterministic execution

Early failure

Zero invalid state mutation

Validation protects the system before any normalization, context injection, authorization, or processing occurs.

If validation discipline fails, downstream integrity collapses.

2. Validation Stage Law

The Validation stage must:

Be pure

Be deterministic

Be side-effect free

Fail fast

Mutate nothing

Validation may:

Inspect Intent payload

Inspect basic preconditions

Perform read-only lookups if required

Validation must never:

Write to database

Modify context

Modify payload

Infer authorization

Trigger downstream logic

Validation is a gate — not a processor.

3. What Validation Is Responsible For

Validation is responsible for:

Schema validation

Required field enforcement

Type checking

Format validation

Business rule preconditions

State existence checks (read-only)

Range constraints

Enum validation

Validation ensures the request is structurally legal — not authorized.

4. What Validation Is NOT Responsible For

Validation must not:

Decide permissions

Attach tenant scope

Enforce location isolation

Compute derived fields

Apply default values

Perform normalization

Mutate state

Emit analytics

Compute diagnostics

If it mutates, it is not validation.

5. Validation Function Structure

Each validation file must:

Export exactly one function

Match filename exactly

Be domain-prefixed

End with Validation

Example:

export function courseRequireTitleValidation(intent) {
  if (!intent.payload.title) {
    return {
      valid: false,
      error: "TITLE_REQUIRED"
    };
  }

  return { valid: true };
}

Validation functions must:

Return structured result

Not throw unhandled errors

Not mutate intent

6. Validation Return Contract

Validation must return:

{
  valid: boolean,
  error?: string,
  details?: object
}

Rules:

valid must always be present

Error codes must be machine-readable

No sensitive system details in error messages

Errors must be deterministic

Validation must stop pipeline on failure.

7. Validation Ordering Principle

Within an Intent:

Validation functions must be ordered:

Required fields

Type validation

Format validation

Business rule validation

State existence validation

Fail fast principle applies.

Never continue validation once critical failure occurs.

8. Schema Validation Rules

Every Intent must validate:

Payload existence

Required fields

Expected data types

Enum values

Array structures

Object shape

No implicit assumptions allowed.

Example:

if (typeof intent.payload.locationId !== "string") {
  return { valid: false, error: "INVALID_LOCATION_ID_TYPE" };
}
9. Business Rule Validation

Validation may enforce business invariants such as:

Title length minimum

Maximum modules per course

Valid date ranges

Allowed transitions

Business rule validation must:

Be deterministic

Not modify state

Not depend on external randomness

10. State Existence Validation

Validation may perform read-only checks:

Does course exist?

Does module belong to location?

Is referenced ID valid?

Rules:

Reads only

No writes

No cross-tenant scans

Must respect location scoping when applicable

Existence validation is not authorization.

11. Multi-Tenant Validation Rule

Validation must:

Confirm payload does not include authoritative tenant data

Reject attempts to override locationId

Reject payload containing foreign tenant identifiers

Tenant enforcement happens later,
but validation must reject obvious boundary violations.

12. Determinism Rule

Validation must produce the same result given:

Same payload

Same system state

No time-based validation unless explicitly passed in payload.

No implicit randomness.

13. No Silent Failures Rule

Validation must:

Explicitly return error

Provide machine-readable code

Stop execution

Forbidden:

Console-only errors

Silent returns

Partial validation success

Logging without failure return

All failures must be structured.

14. Error Code Standards

Error codes must:

Use UPPER_SNAKE_CASE

Be domain-prefixed when appropriate

Be stable

Examples:

TITLE_REQUIRED

INVALID_MODULE_ORDER

COURSE_NOT_FOUND

INVALID_STEP_TYPE

INVALID_DATE_RANGE

Do not include dynamic data in error codes.

15. Validation vs Authorization

Clear separation:

Validation asks:
"Is this request structurally legal?"

Authorization asks:
"Is this actor allowed to perform this request?"

Do not mix the two.

Example:

Wrong:
"User cannot modify this course" inside validation.

Correct:
Validation ensures courseId exists.
Authorization ensures user can modify it.

16. Validation Complexity Rule

If validation logic becomes:

Deeply nested

Over 100 lines

Hard to reason about

Then:

Split into multiple validation functions

Move domain-specific logic into domain folder

Maintain single responsibility per validation file

Validation must remain readable.

17. Forbidden Patterns

Validation must never:

Mutate database

Mutate intent

Attach context

Compute analytics

Check role permissions

Fetch large datasets

Scan entire collections

Depend on UI state

If it does, it violates ICF purity.

18. Validation File Organization

Validation must follow stage symmetry:

validate/
    core/
    domain/
        course/
        module/
        step/
    validators.js

All validation functions must be exported through:

validators.js

Deep imports are forbidden.

19. Testing Requirements

Every validation function must be tested for:

Valid input

Missing required fields

Wrong type

Boundary values

Cross-tenant injection attempt

Malformed payload

Validation must fail predictably.

20. Stability Guarantee

If validation standards are followed:

Invalid data never reaches processing

Authorization logic remains clean

Processing remains deterministic

Multi-tenant isolation remains intact

Error handling remains structured

AI-generated code remains predictable

Validation is the first structural defense.

21. Final Law

Validation protects the integrity of the pipeline.

If validation becomes lax:

Authorization becomes fragile

Processing becomes dangerous

Audit trails become unreliable

Multi-tenant isolation becomes porous

Validation must be:

Strict

Deterministic

Structured

Fail-fast

Side-effect free

There are no exceptions.

End of Validation Standards
Version 1.0


