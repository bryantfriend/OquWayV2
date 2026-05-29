OquWay

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


Intent-Centric Learning Infrastructure
Architecture Model: Intent-Centric Framework (ICF)
Version: 1.0

🌍 What Is OquWay?

OquWay is a deterministic, multi-tenant, location-first learning infrastructure platform.

It is not just a dashboard application.

It is a governed behavioral engine designed to support:

Schools

Corporate training centers

Libraries

Gyms

Educational institutes

Regional oversight bodies

Ministry-level analytics

Enterprise deployments

OquWay is built for national and enterprise scale from day one.

🧠 Core Philosophy

OquWay operates on a single architectural law:

No state mutation may occur outside an Intent execution pipeline.

All meaningful system actions must follow:

Intent
  → Validate
  → Normalize
  → AddContext
  → Authorize
  → Process
  → Emit

Only the Process stage may mutate state.

All dashboards consume this engine.
None may bypass it.

🏗 System Architecture Overview

OquWay is structured as:

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
Core Engine

packages/core/

Contains:

ICF runtime engine

Intent definitions

Stage logic

Domain models

Authorization policies

Multi-tenant enforcement

Audit emission

This is the behavioral brain of the system.

There must never be multiple engines.

🖥 Dashboards (UI Layer)

Dashboards are thin UI surfaces.

They:

Render components

Collect input

Construct Intent payloads

Display emitted results

They do NOT:

Write to Firestore directly

Perform authorization checks

Contain business logic

Mutate state outside ICF

All dashboards are clients of the same core engine.

🏢 Location-First Multi-Tenancy

OquWay is location-based.

Primary boundary:

locationId

A location may represent:

School

Corporate branch

Training center

Gym

Library

Enterprise unit

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

All operational data must be location-scoped.

Authorization must enforce location isolation.

No cross-location leakage is allowed.

🔐 Role Model

Supported roles include:

Participant

Instructor

Location Admin

Regional Admin

Ministry Admin

Tenant Admin

Super Admin

Role logic exists only in the Authorization stage.

UI must never enforce role restrictions independently.

📊 Governance Data Layers

OquWay enforces strict data separation:

Identity Layer

Interaction Layer

Session Layer

Diagnostics Layer

Layers must never be merged arbitrarily.

Diagnostics are derived.
Interaction logs are immutable.
Authorization gates exposure.

🧩 StepType System

StepTypes define reusable learning building blocks.

Blueprints live in code (domain layer).

Instances live in data (Firestore).

Blueprints and instances must never be mixed.

StepTypes follow strict engine contracts.

📚 Knowledgebase

The knowledgebase/ directory contains:

Architectural specifications

Naming rules

Stage symmetry rules

Export rules

Multi-tenant guide

Intent design guide

Course Creator current plan

StepType specification

These documents:

Govern AI-assisted development

Prevent architectural drift

Override implementation if conflicts arise

The knowledgebase is binding.

🚀 Expansion Model

OquWay evolves by:

Adding new domains

Adding new intents

Adding new stage functions

Adding new dashboards

It does NOT evolve by:

Reorganizing core structure

Forking engines

Duplicating logic

Bypassing ICF

Growth must be additive.

🧪 Determinism Requirement

Given:

The same Intent

The same system state

The same context

The result must be identical.

Random behavior must be explicitly controlled.

Uncontrolled side effects are forbidden.

🛡 Auditability

Every Intent execution must produce:

intentType

actorId

actorRole

locationId

tenantId (if applicable)

timestamp

result

duration

All mutations must be traceable.

🎯 Final Principle

OquWay is not a collection of dashboards.

It is a deterministic behavioral engine with multiple interfaces.

The engine is singular.
The surfaces are plural.
The pipeline is non-negotiable.
Location isolation is mandatory.
Authorization precedes mutation.
Growth is additive.

End of README
Version 1.0


