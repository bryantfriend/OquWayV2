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


This document defines the mandatory constraints for any AI-generated code, configuration, documentation, or architectural decision inside OquWay.

AI output must conform to:

Intent-Centric Framework (ICF)

Step Engine Mandatory Rules 

Adding a new game instructions

OquWay Governance Doctrine 

OquWay Governance

Folder Responsibility Rules

Validation Standards

Naming Conventions

AI is not a creative assistant.

AI is a constrained code generator inside a governed system.

1️⃣ Absolute Structural Rule

All generated business logic must follow:

Intent → Validate → Normalize → AddContext → Authorize → Process → Emit

AI must never:

Combine stages

Skip stages

Collapse stages into UI logic

Move authorization after processing

2️⃣ UI Isolation Rule

AI must never generate:

Firestore queries inside UI files

Authorization checks inside UI

Data mutation inside render()

Business logic inside components

UI may only:

Call intents

Receive emitted result

Render state

3️⃣ Step Engine Generation Rules

When generating Steps, AI must strictly follow:

BaseStep inheritance

Static metadata

defaultConfig ↔ editorSchema symmetry

Defensive DOM handling

Explicit completion logic

Refer to StepType specification 

Adding a new game instructions

AI must never:

Use instance methods

Import BaseStep

Leave editorSchema empty

Add fields not in defaultConfig

4️⃣ Schema Symmetry Rule

If AI generates:

editorSchema

defaultConfig

Firestore documents

Config objects

Then:

Every editable field must exist in all relevant structures.

AI must not:

Invent nested keys

Introduce optional chaining in ICF JavaScript

Leave fields uninitialized

5️⃣ Governance Boundary Rule

AI must respect data layers:

Identity Layer
Interaction Layer
Session Layer
Diagnostic Layer

AI must never generate:

Direct diagnostic manipulation

Identity + diagnostic merging

Ranking systems

Cross-tenant data access

Governance Doctrine binding applies 

OquWay Governance

6️⃣ Multi-Tenant Awareness Rule

AI must assume:

Multiple locations

Multiple regions

Strict scope boundaries

All queries must include:

tenantId

schoolId (if applicable)

role context

No global queries allowed unless Super Admin scoped.

7️⃣ No Shortcut Rule

AI must never:

Use magic constants

Hardcode IDs

Bypass shared processors

Duplicate authorization logic

Collapse ICF into a single function

8️⃣ Defensive Code Rule

AI-generated code must:

Null-check DOM

Null-check payloads

Validate intent fields

Fail safely

If unsure, AI must request clarification instead of guessing.

9️⃣ Naming Rule Compliance

AI must follow:

camelCase for variables

PascalCase for classes

kebab-case for step ids

snake_case only for database fields if required

Refer to Naming-Conventions.md.

🔟 Output Cleanliness Rule

AI output must:

Be modular

Be testable

Avoid over-commenting

Avoid framework introduction

Remain vanilla JS unless approved

11 Location Abstraction Rule

AI must treat all institutional references as location, not school.

A location is defined as:

A multi-tenant learning host that may represent a school, training center, corporate branch, gym, library, or other educational entity.

AI must:

Use locationId instead of schoolId

Query /locations/ collection

Attach locationContext during the AddContext stage

Avoid assuming K-12 educational constraints

AI must never:

Hardcode “school” assumptions

Tie logic to academic-only structures

Restrict features to traditional education models

All dashboards, processors, and authorizers must be location-aware.


