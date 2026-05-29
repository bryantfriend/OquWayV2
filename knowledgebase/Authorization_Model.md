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


This document defines the authorization model for OquWay.

Authorization answers one question:

Is this actor allowed to perform this intent on this resource in this context?

Authorization is not UI logic.
Authorization is not validation.
Authorization is an ICF stage:

Intent → Validate → Normalize → AddContext → Authorize → Process → Emit

Authorization is required before any protected processing occurs.

🧱 Core Concepts
1) Actor

The authenticated entity attempting an action.

Actor fields (minimum):

uid

role

locationMemberships[] (scoped memberships)

tenantId (optional; for multi-tenant deployments)

2) Location (Primary Institutional Unit)

A Location is any governed learning host in OquWay.

Examples:

School

Training center

Corporate branch

Gym

Library

Location fields (minimum):

locationId

locationType (e.g., school, corporate, gym, library, training_center)

tenantId (optional)

3) Resource

The object being accessed.

Resources are categorized by data layer (see Governance Doctrine) 

OquWay Governance

:

Identity Layer (PII, profiles)

Interaction Layer (raw immutable logs)

Session Layer (session-scoped progress & results)

Diagnostics Layer (derived analytics & confidence-weighted insight)

Authorization decisions must respect layer boundaries.

4) Intent

A structured action request (not “a page”).

Example:

VIEW_STUDENT_PROGRESS

ASSIGN_MODULE_TO_GROUP

CREATE_COURSE_TEMPLATE

EXPORT_COURSE_JSON

VIEW_LOCATION_ANALYTICS

Intents drive:

required inputs

required context

required permissions

allowed data layers

processor routing

🎭 Role Model

Roles are capability bundles, not identity labels.

Core Roles

student

teacher (or instructor)

locationAdmin

regionalAdmin

ministryAdmin (system analytics consumer)

superAdmin

courseCreator (catalog authoring)

Note: “courseCreator” is a role because Course Creator is not location-bound.

🔐 Scope Model

Authorization is always evaluated inside scope.

Scope Types

Self Scope

The actor is the same as the target subject.

Example: student viewing their own progress.

Location Scope

Actor is authorized within a single locationId.

Example: teacher viewing groups in their assigned location.

Multi-Location Scope

Actor is authorized across multiple locations via region/tenant assignment.

Example: regionalAdmin viewing aggregated trends across locations.

System Scope

Actor has platform-wide privileges.

Example: superAdmin managing roles, audit logs.

🧩 Membership & Assignment Graph

OquWay authorization depends on relationships, not assumptions.

Required Relationship Links

actor → locationMembership (role within location)

teacher → groupAssignment (which groups they serve)

student → groupMembership (which groups they belong to)

locationAdmin → locationOwnership (admin scope)

regionalAdmin → regionOrTenantScope (multi-location scope)

courseCreator → catalogAccess (global authoring)

ministryAdmin → analyticsScope (system-level aggregated only)

✅ Permission Model

Permissions are expressed as:

allow(role, intent, resourceType, constraints)

Example Permission Statements (Conceptual)

student can VIEW_SELF_PROGRESS on SessionSummary within SelfScope

teacher can VIEW_GROUP_SUMMARY on SessionAggregates within LocationScope

locationAdmin can VIEW_LOCATION_OPERATIONAL within LocationScope

regionalAdmin can VIEW_REGION_AGGREGATES within MultiLocationScope

ministryAdmin can VIEW_SYSTEM_ANALYTICS within SystemAggregatedScope only

courseCreator can CREATE_COURSE_TEMPLATE on CourseCatalog globally

superAdmin can MANAGE_ROLES and VIEW_AUDIT_LOGS in SystemScope

🧠 ICF Authorization Stage Contract
Inputs to Authorize Stage

Authorize receives:

intent (normalized)

context (attached in AddContext stage)

actor (resolved from auth)

resourceRef (what is being accessed)

Outputs from Authorize Stage

Authorize emits:

decision: "allow" | "deny"

reasonCode (machine readable)

safeScope (what subset is allowed)

constraints (filters to enforce in Process)

Authorize must never:

query heavy datasets

compute analytics

mutate data

“fix” missing fields (that’s Validate/Normalize)

🧱 Mandatory Constraint Filters

Authorization should emit constraints like:

locationId in actor.locationMemberships

groupId in actor.assignedGroups

studentId in groupMembership

dataLayerAllowed = ["session", "diagnosticsSummary"]

These constraints must be enforced again inside Process (defense-in-depth).

🛡️ Data Layer Access Rules (Non-Negotiable)

Derived from Governance Doctrine 

OquWay Governance

Identity Layer

student: self only

teacher: assigned participants only

locationAdmin: within location only

regional/ministry: no direct identity access by default

superAdmin: restricted + logged

Interaction Layer (Raw Logs)

non-editable, restricted

never exposed to dashboards as raw streams

typically only system processors / tightly scoped tooling

if surfaced at all: redacted and role-restricted

Session Layer

commonly allowed with scope constraints

best place for “operational truth” dashboards

Diagnostics Layer

never editable

role-based summaries only

always confidence-labeled where applicable

ministry/system analytics: aggregated and anonymized

🧾 Common Deny Reasons (Standardized)

Use consistent deny codes so UI can react predictably:

AUTH_NOT_LOGGED_IN

AUTH_ROLE_MISSING

AUTH_LOCATION_SCOPE_VIOLATION

AUTH_GROUP_NOT_ASSIGNED

AUTH_IDENTITY_LAYER_FORBIDDEN

AUTH_INTERACTION_LAYER_FORBIDDEN

AUTH_DIAGNOSTICS_SCOPE_FORBIDDEN

AUTH_SYSTEM_ONLY

AUTH_CATALOG_ONLY

🧰 Implementation Guidance
Authorizers Live In

Shared layer:

packages/core/src/icf/stages/authorizers.js (or packages/core/src/icf/stages/authorizers/ folder later)

Authorizers Should Be

pure (no side effects)

deterministic

fast

scope-emitting (constraints first)

Processors Must

re-check constraints

apply filters to queries

never trust UI claims

🧪 Test Matrix (Minimum)

Every new intent must have tests for:

allowed role + allowed scope ✅

allowed role + forbidden scope ❌

forbidden role ❌

missing context ❌

cross-location attempts ❌

identity layer leakage attempts ❌

🧠 Summary

Authorization in OquWay is:

intent-driven

location-scoped

data-layer governed

constraint-emitting

enforced before processing

This model ensures OquWay scales beyond schools into any location-based learning ecosystem—without compromising trust or governance. ✅


