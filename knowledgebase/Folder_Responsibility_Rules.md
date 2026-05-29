🌍 Purpose

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


This document defines strict folder responsibilities for OquWay.

Each folder exists for a reason.
Each layer has a boundary.
No cross-layer contamination is allowed.

This structure protects:

ICF stage integrity

Location-based multi-tenancy

Governance data-layer separation 

OquWay Governance

Step engine stability 

Adding a new game instructions

Long-term scalability

If folder responsibility is violated, architectural drift begins.

🧠 Core Architectural Rule

All business logic must flow through:

Intent → Validate → Normalize → AddContext → Authorize → Process → Emit

Folders are organized around this execution model.

🗂 Top-Level Structure

Example structure (conceptual):

/apps/
  student-dashboard/
  teacher-dashboard/
  location-admin-dashboard/
  regional-admin-dashboard/
  ministry-dashboard/
  super-admin-dashboard/
  course-creator-dashboard/

packages/core/src/icf/stages/
  intents/
  validators.js
  normalizers.js
  contexts.js
  authorizers.js
  processors.js
  emitters.js

/steps/
  language/
  logic/
  math/

/auth/

/core/ (if present)
🖥 /apps/ — Dashboard Shells
Purpose

UI-only layer.

Dashboards are thin shells that:

Collect user interaction

Dispatch intents

Render emitted results

Allowed

Event listeners

State rendering

Layout logic

Calling shared intent executor

Forbidden

Firestore queries

Authorization logic

Business calculations

Data-layer merging

Hardcoded role checks

Dashboards must never “decide” truth.

🔁 packages/core/src/icf/stages/ — ICF Core Engine

This folder contains system logic.

All business logic belongs here.

packages/core/src/icf/stages/intents/

Defines intent type constants

Registers allowed intents

Maps intents to processors

No processing here — only registration.

validators.js

Responsible for:

Required field validation

Field format checking

Null safety

Forbidden:

Authorization

Database queries

Role checks

normalizers.js

Responsible for:

Type coercion

ID normalization

Filter sanitization

Default value injection

Forbidden:

Permissions

Business calculations

Database reads

contexts.js

Responsible for:

Attaching actor

Attaching locationId

Attaching locationType

Attaching tenant scope

Attaching role

Context must never be inferred later.

Forbidden:

Heavy queries

Authorization decisions

Processing logic

authorizers.js

Responsible for:

Scope verification

Role-intent checks

Data-layer permissions

Emitting constraint filters

Must be:

Pure

Deterministic

Fast

Forbidden:

Business logic

Data mutation

Analytics computation

Must emit:

{
  decision,
  safeScope,
  constraints
}
processors.js

Responsible for:

Fetching scoped data

Applying constraints

Computing derived metrics

Enforcing governance boundaries

Forbidden:

UI decisions

Role inference

Ignoring constraints

Cross-location queries without permission

Processors must respect emitted constraints.

emitters.js

Responsible for:

Structuring final output

Removing forbidden fields

Attaching confidence labels

Formatting payload

Forbidden:

Heavy processing

Authorization

Direct database access

🧱 /steps/ — Step Engine Modules

All Step Types live here.

Each Step must follow mandatory engine rules 

Adding a new game instructions

Required structure:

/steps/
  language/
    MatchingStep.js
  math/
    EquationBuilderStep.js

Rules:

Extend BaseStep

Static metadata required

defaultConfig ↔ editorSchema symmetry

Defensive DOM handling

Explicit completion logic

Steps must not:

Query Firestore

Perform authorization

Access global state

Access diagnostics layer

Steps operate only on config + user interaction.

🔐 /auth/ — Authentication Layer

Responsible for:

Login

Logout

Token validation

User identity resolution

Forbidden:

Authorization logic

Role-based scope enforcement

Business logic

Dashboard routing logic beyond role redirect

Authentication ≠ Authorization.

🧠 /core/ (Optional Structural Folder)

If present, may contain:

Engine bootstrap

App initialization

Global event bus

Dependency injection

Must not contain:

Business logic

Authorization logic

Database queries

🏢 Location & Tenant Enforcement

No folder may assume:

schoolId

All institutional references must use:

locationId
locationType
tenantId

All queries must be location-scoped unless explicitly system-level.

🛡 Cross-Folder Contamination Rules

Forbidden patterns:

/apps/ importing Firestore directly

/steps/ importing packages/core/src/icf/stages/processors

/validators/ importing /authorizers

/processors/ bypassing /authorizers

/apps/ accessing data layers directly

UI code referencing identity-layer PII unnecessarily

If you see circular dependencies, architecture is being violated.

🧪 Testing Responsibility

Each folder must be testable independently:

validators: unit tests

normalizers: unit tests

authorizers: policy tests

processors: scoped integration tests

dashboards: UI rendering tests

steps: isolated runtime tests

🚫 Hard Architectural Bans

Business logic inside UI

Authorization after processing

Implicit permission growth

Hardcoded role behavior

Cross-location data leaks

Mixing Identity + Diagnostics directly

🧠 Scalability Principle

Folders must assume:

Multiple locations

Multiple tenants

Multiple role hierarchies

Enterprise expansion

International deployment

Never build “just for schools” logic.

🏁 Final Rule

If adding a feature requires modifying:

UI

Authorizer

Processor

Data layer

Without clear stage separation —

Stop and refactor first.

Folders enforce architecture.
Architecture enforces governance.
Governance protects scalability.


