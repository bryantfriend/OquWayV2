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


This document defines the mandatory coding standards for OquWay.

These standards ensure:

ICF architectural integrity

Location-based multi-tenant safety

Governance layer separation 

OquWay Governance

Step engine compliance 

Adding a new game instructions

Scalability across education and enterprise environments

These rules are not stylistic preferences.
They are structural safeguards.

🧠 1️⃣ Architectural Foundation

OquWay is built on:

Intent → Validate → Normalize → AddContext → Authorize → Process → Emit

No business logic may bypass this structure.

❌ Forbidden Patterns

Direct Firestore access inside UI

Authorization inside render()

Business logic inside components

Cross-layer data merging

Hardcoded role checks inside UI

Processing before authorization

🏢 2️⃣ Location-Based Multi-Tenancy

All institutional logic must use:

locationId
locationType
tenantId (if applicable)

Never use:

schoolId

Location abstraction must support:

Schools

Corporate branches

Gyms

Libraries

Training centers

Future growth environments

All queries must be location-scoped unless explicitly system-level.

🗂 3️⃣ Folder Responsibility Rules

Each folder has a strict responsibility.

/apps/

Dashboard shells only

UI rendering only

Calls shared ICF engine

No Firestore logic

No authorization logic

packages/core/src/icf/stages/

Core engine components:

packages/core/src/icf/stages/
  ├── intents/
  ├── validators.js
  ├── normalizers.js
  ├── contexts.js
  ├── authorizers.js
  ├── processors.js
  ├── emitters.js

This is where business logic lives.

/steps/

Step Types must follow mandatory engine rules 

Adding a new game instructions

Never deviate from BaseStep contract.

🧩 4️⃣ ICF Stage Responsibilities
Intent

Structured object

No logic

No mutation

Validate

Required fields

Field formats

Null checks

No database calls

Normalize

Coerce types

Standardize IDs

Sanitize filters

No permissions logic

AddContext

Attach actor

Attach locationId

Attach locationType

Attach role

Attach tenant scope

Context is never inferred inside Process.

Authorize

Pure

Deterministic

Constraint-emitting

No heavy queries

No processing

Must emit safeScope.

Process

Apply constraints

Fetch data

Compute derived metrics

Respect data-layer limits

No UI decisions

Emit

Structured

No raw interaction logs

No PII beyond allowed scope

Confidence labeling when applicable

🔐 5️⃣ Data Layer Separation

Never mix:

Identity layer

Interaction layer

Session layer

Diagnostics layer

Derived from Governance Doctrine 

OquWay Governance

Rules:

Diagnostics are never editable

Interaction logs are immutable

Identity must be scoped

Session data is operational truth

🧱 6️⃣ Defensive Coding Rules

All code must:

Null-check inputs

Fail safely

Avoid implicit assumptions

Use explicit scope filters

Validate intent structure

Never assume:

User role

Location membership

Group assignment

Optional DOM elements

🧾 7️⃣ Naming Conventions
Variables

camelCase

Classes

PascalCase

Step IDs

kebab-case

Database Fields

snake_case (if needed for consistency)

Intent Types

UPPER_SNAKE_CASE

Example:

{
  type: "VIEW_LOCATION_ANALYTICS"
}
🔎 8️⃣ Query Rules

All queries must:

Include location filter (unless system-level)

Include scope constraints from Authorize stage

Avoid full collection scans

Use indexes when needed

Never trust UI-supplied IDs blindly

🛡 9️⃣ Security Rules

Never:

Trust client-side role checks

Expose raw interaction logs to dashboards

Expose cross-location identity data

Allow ranking features without governance approval

Compute diagnostics inside UI

Defense-in-depth required.

🧪 🔟 Testing Standards

Each new intent must test:

Allowed role, correct scope

Allowed role, wrong scope

Wrong role

Cross-location attempt

Identity leakage attempt

Diagnostics misuse attempt

🧠 1️⃣1️⃣ Step Engine Compliance

All Step Types must follow:

BaseStep inheritance

Metadata required

defaultConfig ↔ editorSchema symmetry

Defensive DOM handling

Explicit completion guard

See Step Creation Engine Rules 

Adding a new game instructions

If step takes more than 1 hour, audit schema alignment first.

🚫 1️⃣2️⃣ Anti-Patterns (Hard Bans)

Spaghetti logic inside dashboards

Duplicate authorization checks

Direct Firestore inside UI

Business logic inside CSS/HTML

Silent failure without reason codes

Implicit permission expansion

Hardcoded locationType behavior

🧠 1️⃣3️⃣ Scalability Principle

All code must assume:

Multiple locations

Multiple tenants

Multiple role hierarchies

Future enterprise expansion

No “this is just for schools” logic allowed.

🏁 Final Principle

OquWay is not an app.

It is a governed growth infrastructure.

Coding must:

Preserve ICF integrity

Preserve location abstraction

Preserve data-layer separation

Preserve role-bound authorization

Preserve long-term scalability

If a feature breaks any of these — redesign it.


