The /apps directory contains all role-based dashboard applications within OquWay.

Each dashboard is an ICF-governed interface that exposes only the data layer permitted by its role.

Dashboards do not compute truth.
Dashboards emit results from governed processes.

All dashboards must follow the mandatory ICF execution model:

Intent → Validate → Normalize → Add Context → Authorize → Process → Emit Result

Governance constraints are derived from the OquWay Governance Doctrine 

OquWay Governance

System vision is aligned with the OquWay platform architecture 

OquWay_Prototype_Design_Document

🏢 Location Abstraction

A Location is any governed learning host within OquWay.

A location may represent:

School

Education center

Corporate branch

Gym

Library

Training facility

Community learning hub

Any structured growth environment

All institutional logic must use:

locationId
locationType

Dashboards must never assume K-12 school structure.

🧠 1️⃣ ICF Dashboard Execution Model

Every dashboard action must be implemented as a complete ICF pipeline.

Required Flow
Intent:
  { type: "VIEW_GROUP_SUMMARY", groupId }

Validate:
  - user authenticated
  - required fields exist

Normalize:
  - sanitize filters
  - normalize IDs
  - coerce timestamps

Add Context:
  - attach user role
  - attach locationId
  - attach locationType
  - attach tenantId (if applicable)
  - attach permitted scopes

Authorize:
  - verify user may access this resource
  - enforce doctrine data layer limits

Process:
  - fetch aggregated data only
  - compute safe metrics
  - attach confidence levels where applicable

Emit Result:
  - structured payload
  - no raw interaction logs
Dashboards May Never

Directly query unrestricted Firestore collections

Compute diagnostic truth independently

Override model outputs

Merge identity + diagnostic layers

Access forbidden data scopes

All data access must occur inside ICF processors.

🏗 2️⃣ Dashboard List (ICF Applications)

All dashboards are location-scoped ICF applications.

🟢 Student Dashboard
Purpose

View personal progress

View intention balances

View assigned modules

Data Scope

Identity: self only

Interaction: summarized only

Diagnostics: personal only

No peer comparison

Bound to one location

🔵 Teacher / Instructor Dashboard
Purpose

View group-level engagement

Track module progress

View participant summaries

Data Scope

Identity: assigned participants only

Interaction: session aggregates

Diagnostics: confidence-weighted summaries

No cross-location access

Works for:

Schools

Corporate training departments

Gym program instructors

Library workshop leaders

🟡 Location Admin Dashboard
Purpose

View location-wide operational health

Participation rates

Module adoption

Resource utilization

Data Scope

Identity: scoped to location

Interaction: aggregated

Diagnostics: location-level summaries

No raw interaction logs

This dashboard works for any location type.

🟠 Regional Admin Dashboard
Purpose

Multi-location analytics

Infrastructure signals

Engagement comparisons (non-ranking)

Data Scope

Aggregated across locations

No participant identifiers

No location shaming

Used for:

Regional education authorities

Multi-branch companies

Franchise networks

🔴 Ministry / System Dashboard
Purpose

System-wide anonymized analytics

Concept difficulty heatmaps

Investment guidance signals

Data Scope

Fully anonymized & aggregated

No student identifiers

No location-level public exposure

Must respect Governance Sections 7–11 

OquWay Governance

⚫ Super Admin Dashboard
Purpose

System health

Audit logs

Diagnostic confidence monitoring

Role management

Tenant management

Data Scope

Controlled elevated access

Logged access

Break-glass protocols apply

🟣 Course Creator Dashboard
Purpose

Create and manage global catalog courses

Manage modules and tracks

Configure intent/mood logic

Export/import JSON structures

This dashboard is not tied to any location.

Data Scope

Course metadata

Module structures

Block definitions

No participant data

No diagnostic data

This aligns with the Course & Module Editor system 

OquWay_Course_Module_Editor_Des…

Course Creator must:

Emit versioned course objects

Never access interaction logs

Never view participant performance

🧩 3️⃣ Shared ICF Core (Required)

All dashboards must use shared core processors:

/shared/
  ├── intents/
  ├── validators.js
  ├── normalizers.js
  ├── contexts.js
  ├── authorizers.js
  ├── processors.js
  ├── emitters.js

Dashboards are thin shells.

They must not implement:

Their own validation logic

Their own authorization logic

Their own diagnostic calculations

Direct Firestore access

🎨 4️⃣ UI Separation Rule

Dashboards are UI renderers only.

UI must:

Consume emitted results

Not compute business logic

Not compute permissions

Not query Firestore directly

All Firestore access must occur inside ICF processors.

🔒 5️⃣ Governance Compliance Rule

Before adding any new dashboard feature, define:

Intent type

Data layer touched

Role scope

Authorization boundary

Emitted payload structure

If any feature:

Enables ranking

Exposes raw interaction logs

Bypasses confidence labeling

Violates role separation

It is out of scope.

Governance doctrine binding applies 

OquWay Governance

🚀 6️⃣ Future-Proofing Rule

New dashboards must:

Declare role type

Declare location scope

Declare data layer access

Register ICF intents

Register processors

Pass scope audit

Dashboards are not allowed to grow organically.
They must grow structurally.

🧠 Architectural Principle

OquWay dashboards are not school dashboards.

They are location-governed growth interfaces.

This abstraction allows OquWay to scale across:

Public education

Private education

Corporate training

Skill development

Health & fitness programs

Community learning hubs

International deployments

Governed. Modular. Scalable.