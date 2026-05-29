Version History

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
Scope: System-Wide Architectural Versioning
Version: 1.0

1. Purpose

This document tracks architectural versions of OquWay.

It does NOT track:

Minor bug fixes

UI styling updates

Small feature additions

It tracks:

Architectural rule changes

Structural reorganizations

Pipeline changes

Multi-tenant model changes

Governance modifications

Breaking behavioral changes

If a change affects structure, determinism, naming, tenancy, or stage rules — it belongs here.

Version history protects long-term stability.

2. Versioning Philosophy

OquWay follows semantic architectural versioning:

MAJOR.MINOR.PATCH
MAJOR

Incremented when:

Core architecture changes

ICF pipeline changes

Stage responsibilities change

Tenant model changes

Folder symmetry rules change

Governance model changes

Breaking naming changes occur

Requires migration documentation.

MINOR

Incremented when:

New domains are added

New dashboards are added

New architectural documents are introduced

Non-breaking structural expansions occur

New stage types are added without altering pipeline order

Must not break existing intents or exports.

PATCH

Incremented when:

Documentation clarifications occur

Minor corrections are made

Non-breaking refinements occur

Typographical corrections occur

Internal rule clarifications are added

Patch changes must not alter behavior.

3. Version 1.0.0

Initial stabilized architectural foundation.

Established:

Intent-Centric Framework (ICF)

Strict pipeline order:

Validate

Normalize

AddContext

Authorize

Process

Emit

Single core engine model

Stage symmetry rules

Stage export rules

Naming architecture standards

Multi-tenant hierarchy model

Location-first abstraction (replacing school-only model)

Governance data-layer separation

StepType specification

Validation standards

Intent design discipline

Folder responsibility structure

Determinism requirement

Audit requirement

This version represents the first production-stable architecture.

4. Architectural Baseline (v1.x)

Version 1.x guarantees:

Pipeline order will not change.

Stage boundaries remain strict.

Location remains primary isolation unit.

Authorization precedes mutation.

No state mutation outside Process stage.

No deep imports across stage boundaries.

No cross-tenant access without authorization.

Additive growth only.

Folder symmetry remains stable.

Knowledgebase overrides implementation.

Any violation requires a major version bump.

5. Change Documentation Requirements

Every architectural change must document:

What changed

Why it changed

Risk impact

Migration requirements (if any)

Backward compatibility status

No undocumented architectural changes are allowed.

6. Breaking Change Protocol

If a breaking change is required:

Increment MAJOR version.

Freeze old version behavior.

Provide migration guide.

Deprecate gradually if possible.

Log rationale clearly in this file.

Never silently change:

Intent types

Stage order

Naming conventions

Tenant boundaries

Governance layer rules

StepType contracts

7. Architectural Integrity Rule

Implementation must conform to:

OquWay Architecture document

ICF Formal Specification

Naming Architecture

Multi-Tenant Architecture Guide

Validation Standards

StepType Specification

Stage Export Rules

Stage Symmetry Rules

Intent Design Guide

If implementation conflicts with documentation:

Documentation overrides implementation.

8. Audit Stability

Audit record structure must not change in minor or patch versions.

Changing audit schema requires:

MAJOR version bump

Migration plan

Backward compatibility review

Audit stability is critical for national-scale deployment.

9. Multi-Tenant Stability Guarantee

Location abstraction is locked in as of v1.0.

Future versions must not:

Revert to school-only terminology

Remove location boundary enforcement

Remove tenant isolation rules

Introduce UI-level tenant filtering

Tenant enforcement remains ICF-bound.

10. Expansion Stability Rule

Architectural evolution must be:

Additive.

Not:

Reorganizational

Structural refactoring of core folders

Intent mass renaming

Stage reshuffling

Domain collapsing

If reorganization is required:

MAJOR version increment required.

11. AI-Assisted Development Note

OquWay is designed for AI-assisted generation.

Version stability ensures:

AI prompts remain consistent

File paths remain predictable

Stage imports remain stable

Naming remains deterministic

Expansion remains controlled

Architectural drift reduces AI reliability.

Version discipline preserves it.

12. Future Version Placeholders

Reserved:

1.1.x — Minor architectural clarifications

1.2.x — Analytics expansion framework

2.0.0 — Reserved for potential pipeline restructuring (if ever required)

Major version increments must be rare.

Architectural stability is a feature.

13. Final Law

Architecture without version control becomes unstable.

Version discipline ensures:

Determinism

Auditability

Tenant isolation

Governance compliance

Predictable growth

OquWay is long-term infrastructure.

Infrastructure must evolve deliberately.

14. Version 1.1.0

Platform V2 MVP expansion release.

Added:

Super Admin Dashboard MVP

Location, class, and student management

Student fruit password reset flow

Location loginMode administration

Unique location login slugs and direct login paths

Course assignment MVP

Student Dashboard MVP with progress persistence

Reusable Practice Mode Player

Course Creator MVP through courses, modules, sessions, practice modes, and step shells

Step System MVP with media uploads, student view, and playtest support

Backward compatibility:

ICF pipeline order remains unchanged.

Stage boundaries remain unchanged.

Existing location-based student login remains supported.

Direct location links are additive and do not remove the general location picker.

Risk notes:

Firebase Hosting must rewrite /l/**, /login/**, and /location/** to the student login app before clean production links work.

Fruit password reset depends on the resetStudentFruitPassword Cloud Function being deployed in the active Firebase functions project.

End of Version History
Version 1.1.0


