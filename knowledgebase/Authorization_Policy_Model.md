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


This document defines the formal authorization policy matrix for OquWay.

Where:

Authorization_Model.md explains how authorization works

Authorization_Policy_Model.md defines what is allowed

This file answers:

Which role can perform which intent on which data layer under which scope?

All policies must respect:

ICF execution order

Location abstraction

Governance data layer separation 

OquWay Governance

🧱 Core Policy Dimensions

Authorization decisions are determined by:

Role

Intent

Scope

Data Layer

Constraints

All five must align.

🎭 Role Definitions
Role	Location Bound	Multi-Location	System Scope
student	✅	❌	❌
teacher	✅	❌	❌
locationAdmin	✅	❌	❌
regionalAdmin	✅ (multiple)	✅	❌
ministryAdmin	❌	Aggregated only	Limited
courseCreator	❌	❌	Catalog only
superAdmin	✅	✅	✅
🗂 Data Layer Permissions Matrix

Derived from Governance Doctrine 

OquWay Governance

Legend:

✅ Allowed (with constraints)

🔒 Restricted (special handling)

❌ Forbidden

📊 Aggregated only

🟢 Student
Data Layer	Permission
Identity	✅ Self only
Interaction	❌ Raw logs
Session	✅ Self only
Diagnostics	✅ Self summaries

Constraints:

actor.uid === subject.uid

locationId in actor.locationMemberships

🔵 Teacher / Instructor
Data Layer	Permission
Identity	✅ Assigned participants
Interaction	🔒 Redacted / filtered only
Session	✅ Group aggregates
Diagnostics	✅ Confidence-weighted summaries

Constraints:

groupId in actor.assignedGroups

locationId in actor.locationMemberships

Teachers may never:

Access raw global interaction logs

View diagnostics across unrelated groups

🟡 Location Admin
Data Layer	Permission
Identity	✅ Within location
Interaction	🔒 Redacted only
Session	✅ Aggregated within location
Diagnostics	✅ Location-level summaries

Constraints:

locationId in actor.locationMemberships

No cross-location access

Location Admin may not:

Access system-wide analytics

View cross-location comparisons

🟠 Regional Admin
Data Layer	Permission
Identity	❌ Individual-level by default
Interaction	❌ Raw logs
Session	📊 Aggregated across locations
Diagnostics	📊 Aggregated trends only

Constraints:

locationId in actor.regionScope

No identity exposure

No ranking systems

🔴 Ministry / System Analytics
Data Layer	Permission
Identity	❌
Interaction	❌
Session	📊 Fully anonymized
Diagnostics	📊 System-level trends only

Constraints:

No identifiable student data

No location shaming

No public ranking

Must follow Governance Doctrine Sections 7–11 

OquWay Governance

🟣 Course Creator
Data Layer	Permission
Identity	❌
Interaction	❌
Session	❌
Diagnostics	❌
Course Catalog	✅ Full authoring

Course Creator may:

Create course templates

Edit modules

Export/import JSON

Version content

Course Creator may never:

View participant data

Access location data

Access diagnostics

Aligned with Course Module Editor architecture 

OquWay_Course_Module_Editor_Des…

⚫ Super Admin
Data Layer	Permission
Identity	🔒 Logged access only
Interaction	🔒 Logged + restricted
Session	✅
Diagnostics	✅
Audit Logs	✅
Role Management	✅

Constraints:

All elevated access logged

Break-glass protocol required for sensitive identity access

🧠 Intent Classification

Every intent must be categorized as:

Self-Scope Intent

Location-Scope Intent

Multi-Location Intent

System Intent

Catalog Intent

Example Intent Policies
VIEW_SELF_PROGRESS

Role: student

Scope: Self

Layers: Session, Diagnostics

Constraints: actor.uid === subject.uid

VIEW_GROUP_SUMMARY

Role: teacher

Scope: Location

Layers: Session (aggregated), Diagnostics (summaries)

Constraints:

groupId in actor.assignedGroups

locationId match

VIEW_LOCATION_OPERATIONAL

Role: locationAdmin

Scope: Location

Layers: Session aggregates, Diagnostics summaries

VIEW_REGION_ANALYTICS

Role: regionalAdmin

Scope: Multi-Location

Layers: Aggregated Session + Diagnostics only

VIEW_SYSTEM_HEATMAP

Role: ministryAdmin

Scope: System

Layers: Fully anonymized Diagnostics only

CREATE_COURSE_TEMPLATE

Role: courseCreator

Scope: Global

Layers: CourseCatalog only

MANAGE_ROLES

Role: superAdmin

Scope: System

Layers: Identity (restricted + logged)

🔐 Deny Conditions

Authorization must deny if:

Role does not match intent

Location scope mismatch

Group assignment mismatch

Cross-location identity access

Attempted raw interaction exposure

Diagnostics layer override attempt

Standardized deny codes must be emitted.

🧩 Constraint Emission Contract

Authorize stage must emit:

{
  decision: "allow",
  safeScope: {
    locationIds: [...],
    groupIds: [...],
    dataLayers: ["session", "diagnosticsSummary"]
  },
  constraints: {
    locationFilter: true,
    groupFilter: true,
    aggregatedOnly: true
  }
}

Processors must enforce these constraints again.

🛡 Policy Evolution Rule

When introducing a new:

Role

Intent

Data layer

Location type

You must update:

Authorization_Model.md

Authorization_Policy_Model.md

Shared authorizers

Test matrix

No implicit permission growth allowed.

🧠 Final Principle

OquWay authorization is:

Location-based

Intent-driven

Data-layer governed

Constraint-emitting

Defense-in-depth enforced

This structure allows OquWay to scale into:

Education

Corporate training

Fitness ecosystems

Community growth platforms

Multi-tenant SaaS

Without rewriting the core security model.


