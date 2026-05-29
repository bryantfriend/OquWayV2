OquWay Architecture

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
Scope: National & Enterprise Learning Infrastructure
Version: 1.1

1. Purpose

OquWay is designed as a national-scale and enterprise-grade learning infrastructure platform.

It must support:

Participants (students, trainees, employees)

Instructors

Location Administrators

Regional Administrators

Ministry / System Administrators

Corporate oversight layers

Future dashboards and analytics portals

International deployments

The architecture must:

Prevent logic duplication

Enforce deterministic behavior

Enforce strict stage-based mutation

Support multi-tenant + multi-location isolation

Allow unlimited UI expansion

Maintain full auditability

Respect governance data-layer separation 

OquWay Governance

Remain stable over years of growth

OquWay is infrastructure, not an app.

2. Architectural Philosophy

OquWay follows these core principles:

Single Core Engine

Multiple UI Surfaces

Strict Stage-Based State Mutation

Location-First Multi-Tenancy

Deterministic Processing

Authorization Before Mutation

Additive Growth Only (No Reorganization After Launch)

Architecture must evolve by addition, not reorganization.

3. High-Level System Layers

OquWay consists of six primary layers:

UI Layer

ICF Engine Layer

Domain Layer

Infrastructure Layer

Shared Utilities Layer

Knowledgebase Layer (Design-Time Only)

Each layer has strict responsibilities and boundaries.

Layer violations are architectural defects.

4. Recommended Repository Structure
root/
    knowledgebase/

    packages/
        core/
            src/
                icf/
                domain/
                infrastructure/
                shared/

    apps/
        student-dashboard/
        teacher-dashboard/
        location-admin-dashboard/
        regional-admin-dashboard/
        ministry-dashboard/
        super-admin-dashboard/
        course-creator-dashboard/

Key notes:

“School” dashboards are replaced by Location dashboards.

Course Creator is global and not tied to a location.

Core is singular and shared by all apps.

5. Core Package

The packages/core directory contains all runtime logic.

This is the behavioral engine.

It contains:

ICF engine

Intent definitions

Stage logic (validate, normalize, addContext, authorize, process, emit)

Domain models

Infrastructure adapters

Authorization policies

Multi-tenant enforcement

Audit emission

UI must never bypass this layer.

There must never be multiple core engines.

6. UI Layer (Dashboards)

Dashboards are UI surfaces only.

Each dashboard:

Renders components

Collects user input

Constructs Intent payloads

Calls ICF pipeline

Displays emitted results

Dashboards must not:

Write to Firestore directly

Implement business logic

Perform authorization checks

Modify state outside ICF

Compute cross-tenant filters

Dashboards are thin clients of the Core engine.

7. ICF Engine Layer

The ICF layer governs all state changes.

Pipeline:

Intent Registration

Validate

Normalize

AddContext

Authorize

Process

Emit

Rules:

Sequential

Atomic

Deterministic

Fail-fast

Only Process may mutate state

Authorization must emit constraint scope

Emit must produce audit record

No state mutation may occur outside this pipeline.

8. Domain Layer

The Domain layer defines meaning and structure.

It includes:

Course model

Module model

Step model

Enrollment model

Location model

Region model

Tenant model

User model

Audit model

It defines:

Schemas

Domain constants

StepType blueprints

Domain invariants

Non-infrastructure business rules

Domain layer does not:

Perform database writes

Execute authorization

Execute ICF pipeline

Domain defines meaning — not execution.

9. Infrastructure Layer

Infrastructure contains adapters to external systems.

Examples:

Firestore

Firebase Auth

Storage

Analytics services

Messaging services

Rules:

Reads allowed during AddContext

Writes allowed only during Process

No business logic

No authorization decisions

No cross-tenant assumptions

Infrastructure is replaceable.
Business logic is not.

10. Shared Layer

Shared contains reusable, UI-neutral helpers.

Examples:

Formatting utilities

Deterministic date helpers

Localization utilities

Non-domain-specific helpers

Shared must never contain:

Business rules

Authorization logic

State mutation

Tenant enforcement

Shared is pure utility.

11. Knowledgebase Layer

The knowledgebase contains architectural governance documents.

It:

Is not imported by runtime code

Guides AI code generation

Prevents architectural drift

Defines naming conventions

Defines folder symmetry

Defines export rules

Defines tenant model

It is version-controlled and binding.

Specification overrides implementation.

12. Multi-Tenant & Location Model

OquWay is location-first.

Primary boundary: locationId

Optional hierarchy:

System
    ↓
Tenant
    ↓
Region
    ↓
Location
    ↓
User

Every operational entity must include:

locationId

locationType

tenantId (if applicable)

regionId (if applicable)

Location abstraction replaces “school.”

A location may be:

School

Corporate branch

Training center

Gym

Library

Enterprise unit

Tenant context must be attached in AddContext stage.

Tenant isolation must be enforced in Authorization stage.

No cross-location data leakage is allowed.

13. Role Model

OquWay supports hierarchical roles:

Participant

Instructor

Location Admin

Regional Admin

Ministry Admin

Tenant Admin (enterprise)

Super Admin

Rules:

Role evaluation occurs only in Authorization stage.

UI must not enforce role restrictions independently.

Authorization must emit constraint filters.

Elevated access must be logged.

Role + location scope must always be evaluated together.

14. Governance Data Layers

OquWay enforces data-layer separation 

OquWay Governance

:

Identity Layer

Interaction Layer

Session Layer

Diagnostics Layer

Rules:

Diagnostics are derived and immutable.

Interaction logs are immutable.

Identity is scope-bound.

Layers must not be merged arbitrarily.

Dashboards may not expose raw cross-layer data without authorization.

Layer violations are architectural failures.

15. StepType Blueprint vs Step Instance

StepType Blueprint (Code):

Lives in Domain layer

Defines reusable step structure

Defines schema and rendering contract

Version-controlled

Step Instance (Data):

Stored in Firestore

References StepType by name

Contains per-module configuration

Immutable except through ICF

Blueprints are code.
Instances are data.

They must never be mixed.

16. Expansion Strategy

Future dashboards may include:

Accreditation Dashboard

Inspection Dashboard

Public Analytics Portal

Parent Dashboard

Corporate Training Dashboard

Research Dashboard

These must:

Be added under /apps/

Import core package

Use ICF exclusively

Not duplicate engine logic

Core must never fork.

17. Deployment Model

Dashboards may be deployed:

As separate web apps

Under separate subdomains

As mobile applications

As embedded enterprise portals

All must consume the same core engine.

No environment may have a modified behavioral engine.

18. Evolution Rule

Architecture must evolve by:

Adding new domains

Adding new intents

Adding new stage functions

Adding new dashboards

Architecture must NOT evolve by:

Reorganizing core folder structure

Duplicating logic across dashboards

Creating separate engines per dashboard

Introducing alternate pipelines

Structural symmetry must be preserved.

19. Architectural Stability Guarantee

If this architecture is followed:

OquWay scales to national and enterprise levels.

New dashboards can be added without core refactoring.

Multi-tenant isolation remains enforceable.

Governance remains intact.

Authorization remains centralized.

AI-assisted development remains consistent.

Auditability remains reconstructible.

Political and enterprise risk is minimized.

20. Final Principle

OquWay is not a dashboard application.

It is a deterministic behavioral engine with multiple interfaces.

The engine is singular.
The surfaces are plural.

The pipeline is non-negotiable.
The location boundary is primary.
Authorization precedes mutation.
Growth is additive.

All governance documents reinforce this principle.

End of OquWay Architecture
Version 1.1


