Multi-Tenant Architecture Guide

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
Scope: National & Enterprise Infrastructure
Architecture Model: Intent-Centric Framework (ICF)
Version: 1.1

1. Purpose

OquWay is a national-scale and enterprise-grade platform.

It must support:

Multiple locations (schools, training centers, corporate branches, gyms, libraries)

Multiple regions

Ministry-level oversight

Multi-branch organizations

Private and public institutions

Future international expansion

Multi-tenant SaaS deployments

This document defines how tenant isolation and hierarchical access must be designed and enforced.

Failure to follow these rules can result in:

Data leakage

Cross-location contamination

Broken analytics

Political risk

Legal risk

Enterprise contract violations

Tenant discipline is mandatory.

2. Hierarchical Model

OquWay follows a hierarchical governance model:

System (Platform)
    ↓
Tenant (Optional — e.g., Country, Corporate Parent)
    ↓
Region (Optional)
    ↓
Location (Primary Institutional Unit)
    ↓
User

Important:

Location replaces “School.”

Location is the core operational boundary.

Region and Tenant are aggregation layers.

System is global infrastructure.

Not all deployments require all layers.

The architecture must support expansion without reorganization.

3. Core Identifiers

Every stored entity must include:

locationId (required)

locationType (required)

tenantId (optional but recommended)

regionId (optional depending on deployment)

Why redundancy is required:

Simplifies filtering

Avoids join dependency

Improves query performance

Enables deterministic aggregation

Prevents accidental cross-tenant reads

No document may exist without a clear location boundary unless it is explicitly global (e.g., course catalog).

4. Location as Primary Boundary

Location is the foundational isolation unit.

A location may represent:

School

Corporate branch

Training center

Gym

Library

Community hub

All operational data must be location-scoped.

No feature may assume a school-only model.

Location abstraction enables enterprise expansion without refactor.

5. Tenant Context Injection Rule

Tenant and location data must never be trusted from UI payload.

Tenant context must be attached during:

ICF AddContext stage.

Example:

context.locationId = resolvedFromMembership;
context.locationType = resolvedFromLocation;
context.regionId = resolvedFromLocation;
context.tenantId = resolvedFromRegionOrConfig;

Payload must not include authoritative tenant identifiers.

Context is authoritative — payload is not.

6. Tenant Isolation Rule

No Intent may:

Access data outside its authorized location scope

Aggregate across locations without authorization

Modify cross-location records

Merge identity across tenant boundaries

Tenant isolation must be enforced in:

ICF Authorize stage.

Never in UI.

Processors must re-apply scope constraints (defense-in-depth).

7. Role + Tenant Coupling Rule

Authorization must evaluate:

Role

Location membership

Region scope (if applicable)

Tenant scope (if applicable)

Ownership where applicable

Example logic:

Instructor can modify only their assigned location’s modules.

Location Admin can view data within their location.

Regional Admin can view aggregated analytics across assigned locations.

Ministry Admin can view anonymized system-level analytics.

Super Admin may override scope with logged access.

Authorization must emit constraint filters.

8. Data Storage Strategy

Recommended structure:

locations/{locationId}/courses/{courseId}
locations/{locationId}/modules/{moduleId}
locations/{locationId}/participants/{participantId}
locations/{locationId}/sessions/{sessionId}

Global collections allowed only for:

Catalog templates

System configurations

Analytics aggregates

Audit logs (properly scoped)

Avoid global flat collections without location scoping.

All documents must be queryable by locationId.

9. Aggregation Strategy

Higher-level analytics must be:

Derived from controlled aggregation queries

Filtered by authorized location scope

Pre-processed via secure analytics layer

Emitted without identity leakage

Regional analytics:

Aggregated across authorized locations only

Ministry/System analytics:

Fully anonymized

No raw per-location identity exposure

Cross-location analytics require explicit authorization.

10. Cross-Location Data Rule

The following are forbidden:

Collection scans without location filter

Queries missing tenant boundary

Identity queries across locations

Diagnostics merged across unrelated tenants

UI-level tenant filtering used as security

Every query must enforce:

locationId IN safeScope.locationIds

11. Intent Tenant Responsibility

Every Intent must assume:

It operates within a location boundary

Context attaches tenant and region data

Authorization verifies scope

Processing never writes outside authorized scope

No Intent may infer location from UI alone.

Location enforcement must happen before processing.

12. Multi-Tenant Expansion Strategy

Future growth scenarios:

New regions added

Multiple ministries added

Corporate tenants onboarded

International deployment

Franchise networks

SaaS licensing

Architecture must allow:

Adding new tenant identifiers

Adding new region layers

Extending hierarchy

Scaling without folder reorganization

Scaling without data migration chaos

Core must remain stable.

13. Tenant Migration Strategy

If a location changes region:

Region metadata must be updated via controlled Intent

Historical audit data must remain intact

No destructive reorganization of historical records

Migration must be deterministic and logged

If a tenant structure changes:

Changes must be versioned

Audit trail must remain consistent

No silent tenant shifts allowed.

14. Analytics Isolation

Analytics must respect tenant boundaries:

Location analytics → location scope only

Regional analytics → region scope only

Tenant analytics → tenant scope only

Ministry/System analytics → anonymized aggregated only

Never expose raw per-location sensitive data across tenants.

Governance data-layer separation applies 

OquWay Governance

15. Performance Considerations

Multi-tenant design must:

Avoid deep nested queries

Avoid cross-tenant scans

Index by locationId

Index by tenantId when applicable

Use deterministic query patterns

Avoid collection-group scans without filters

Tenant identifiers must be indexed.

Performance optimizations must never bypass tenant boundaries.

16. Testing Requirements

Multi-tenant testing must simulate:

Two different locations

Two different regions

Multiple tenants

Conflicting roles

Cross-scope access attempts

Unauthorized analytics attempts

System must prove:

Isolation is enforced at authorization and processing stages.

17. No UI Tenant Logic Rule

UI must never:

Hard-code location IDs

Infer region or tenant

Implement security filtering

Hide data assuming backend will protect it

Tenant enforcement belongs only in:

ICF Authorization stage.

UI is not a security boundary.

18. Audit Requirements

Every Intent execution must log:

Actor

Role

locationId

regionId (if applicable)

tenantId (if applicable)

Intent type

Result

Timestamp

Audit must make it possible to reconstruct:

Who accessed what, and under which tenant scope.

Audit logs must be immutable.

19. Stability Principle

A national or enterprise system fails when:

Tenant boundaries are inconsistent

Authorization is inconsistently enforced

Cross-location leakage occurs

Analytics bypass scope enforcement

Location abstraction is violated

Tenant discipline is non-negotiable.

20. Architectural Guarantee

If this guide is followed:

OquWay scales safely across locations

Regional analytics remain clean

Ministry dashboards remain trustworthy

Enterprise deployments remain isolated

International expansion requires no structural refactor

Governance boundaries remain enforceable

Political and legal risk are minimized

21. Final Law

Multi-tenancy is not a feature.

It is a foundational architectural constraint.

All new development must respect:

Location boundaries

Tenant hierarchy

Region aggregation

Authorization constraint emission

Data-layer governance separation

From day one.

End of Multi-Tenant Architecture Guide
Version 1.1


