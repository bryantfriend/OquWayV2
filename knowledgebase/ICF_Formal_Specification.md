ICF Formal Specification

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


Intent-Centric Framework (ICF)
Version 1.1
Author: Bryant Friend
Project: OquWay

1. Purpose

The Intent-Centric Framework (ICF) is a deterministic architectural paradigm designed to ensure:

Predictable system behavior

Strict state control

Auditability of all mutations

Separation of concerns

Elimination of uncontrolled side effects

Location-based multi-tenancy

Governance-compliant data layer separation

Scalable domain-driven development

ICF governs all business logic within OquWay.

All meaningful system behavior must flow through ICF.

2. Core Law of ICF

No state mutation may occur outside an Intent execution pipeline.

All meaningful system changes must be expressed as an Intent and executed through the ICF pipeline.

There are no exceptions.

Infrastructure, UI, dashboards, steps, services, and background jobs must not bypass the pipeline.

3. Definition of an Intent

An Intent is a structured declaration of a requested business action.

An Intent must include:

type (string, UPPER_SNAKE_CASE verb-based name)

payload (object)

actor (identifier of requester)

timestamp (number)

optional metadata

Example:

{
  "type": "VIEW_LOCATION_ANALYTICS",
  "payload": { "locationId": "loc_123" },
  "actor": "uid_456",
  "timestamp": 1739200000
}

An Intent does not directly execute logic.
It defines the action that will be processed through the pipeline.

4. Required Pipeline Order

Every Intent must execute in the following exact order:

Intent Registration

Validate

Normalize

AddContext

Authorize

Process

Emit

Execution must be:

Sequential

Atomic (when mutating state)

Deterministic

Constraint-enforced

If any stage fails, the pipeline must stop immediately and no state changes may occur.

5. Stage Definitions
5.1 Validate Stage
Purpose

Ensure the Intent is structurally and logically valid before execution.

Responsibilities

Schema validation

Required field checks

Field format checks

Business rule validation

State precondition checks (read-only)

Rules

No state mutation

No external writes

Must fail fast on invalid input

Must return structured error

5.2 Normalize Stage
Purpose

Transform input into a canonical and deterministic format.

Responsibilities

Apply default values

Standardize timestamps

Normalize IDs

Convert types

Sanitize filters

Rules

No state mutation

No external writes

No permission logic

No role inference

5.3 AddContext Stage
Purpose

Attach necessary read-only system information required for later stages.

Context Must Include (when applicable)

Actor role

locationId

locationType

tenantId (if multi-tenant)

Scope assignments (group membership, region scope, etc.)

Current state snapshot (read-only)

System configuration

Rules

Context is read-only

No state mutation

External reads allowed

No writes

No permission decisions

Location is the primary institutional abstraction.
ICF must never assume a “school” model.

5.4 Authorize Stage
Purpose

Verify the actor has permission to perform the Intent within the given context.

Authorization must be:

Role-aware

Location-scoped

Data-layer governed

Constraint-emitting

Responsibilities

Role validation

Location membership validation

Scope verification

Data layer permission checks

Emitting safeScope constraints

Must Emit
{
  "decision": "allow",
  "safeScope": {},
  "constraints": {}
}
Rules

No state mutation

Must fail immediately if unauthorized

No heavy processing

No analytics computation

Must not fetch large datasets

Authorization must respect Governance data-layer separation 

OquWay Governance

5.5 Process Stage
Purpose

Execute the actual state mutation or state query defined by the Intent.

Rules

Only stage allowed to mutate state

Must be atomic

Must be deterministic

Must enforce valid state transitions

Must apply authorization constraints

Must support rollback behavior

Must not depend on uncontrolled randomness

Must not bypass data-layer rules

All writes must occur here and only here.

Processors must:

Re-apply authorization constraints (defense-in-depth)

Enforce location scoping

Enforce data layer boundaries

5.6 Emit Stage
Purpose

Return structured outcome and record audit data.

Result must include:

success (boolean)

data (object)

errors (array)

intentType

actor

duration

timestamp

Emit stage must:

Remove forbidden fields

Redact unauthorized data

Attach confidence labeling when applicable

Produce immutable audit entry

All Intent executions must produce an immutable audit record.

6. Determinism Requirement

Given:

The same Intent

The same system state

The same context

The result must be identical.

Random behavior must be:

Explicitly injected

Seeded

Logged

Uncontrolled side effects are forbidden.

7. Auditability Requirement

Every state mutation must be traceable to:

The Intent that caused it

The actor who triggered it

The timestamp

The execution result

The affected location scope

The system must allow reconstruction of historical state transitions.

Audit logs must be immutable.

8. Data Layer Governance Enforcement

ICF must respect the following layers 

OquWay Governance

:

Identity Layer

Interaction Layer

Session Layer

Diagnostics Layer

Rules:

Identity data must be scoped

Interaction logs are immutable

Diagnostics are never directly editable

Session data represents operational truth

Cross-layer merging must be intentional and authorized

No stage may violate layer boundaries.

9. Separation of Responsibilities

ICF enforces strict separation:

UI layer may not mutate state

UI layer may not authorize

Validation may not mutate state

Authorization may not mutate state

Only Process may mutate state

Steps may not access database directly

Infrastructure services must not bypass pipeline

10. Transactional Integrity

If multiple state mutations are required:

They must execute atomically

If any mutation fails, all previous mutations must roll back

Partial state updates are forbidden

All transactional behavior must be deterministic.

11. Error Handling

All stage failures must return structured errors.

Errors must:

Be explicit

Be descriptive

Use standardized error codes

Not expose sensitive system internals

Stop execution immediately

No silent failures are allowed.

12. Prohibited Behaviors

The following are forbidden:

Direct database writes from UI

Business logic inside UI components

Authorization checks inside UI

Hidden mutations inside helper functions

Stage skipping

Implicit permission growth

Cross-location identity leakage

Non-deterministic processing without explicit control

13. Compliance

All code within OquWay must conform to this specification.

If a conflict arises between implementation and specification:

The specification overrides the implementation.

ICF is the governing law of OquWay.

End of ICF Formal Specification
Version 1.1


