Naming Architecture

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
Architecture: Intent-Centric Framework (ICF)
Scope: Entire Codebase
Version: 1.0

1. Purpose

Naming is architectural infrastructure.

If naming drifts:

Intent clarity degrades

Stage symmetry collapses

Domains blur

Refactors become dangerous

Authorization becomes ambiguous

Cognitive load increases exponentially

This document defines the permanent naming system for OquWay.

Naming is not cosmetic.

Naming is structural.

2. Global Naming Philosophy

All names must be:

Explicit

Deterministic

Domain-prefixed

Unambiguous

Future-proof

Stable over time

Short names are forbidden when ambiguity exists.

Clarity > Brevity.

3. Domain Naming Rules

Domains represent business areas.

Examples:

course

module

step

enrollment

analytics

location

participant

session

audit

Rules:

Lowercase

Singular

One word when possible

No abbreviations

Stable once introduced

Domains must not be renamed after production launch.

4. Intent Naming Rules

Intent names must:

Use PascalCase

Start with a verb

End with Intent

Map directly to a business action

Be globally unique

Pattern:

{Verb}{Domain}{OptionalQualifier}Intent

Examples:

CreateCourseIntent

UpdateModuleIntent

PublishCourseIntent

EnrollParticipantIntent

CompleteStepIntent

AssignInstructorToLocationIntent

ViewLocationAnalyticsIntent

Forbidden:

SaveIntent

UpdateIntent

ProcessIntent

HandleCourseIntent

GenericActionIntent

If the name does not communicate business meaning, redesign it.

5. Intent Type Constant Naming

Intent configuration must include:

type: "CREATE_COURSE"

Rules:

UPPER_SNAKE_CASE

Verb first

No “Intent” suffix

Must match file name conceptually

Examples:

CREATE_COURSE

UPDATE_MODULE

PUBLISH_COURSE

ENROLL_PARTICIPANT

Intent type strings are part of audit logs.
They must remain stable.

6. Stage Function Naming

Stage functions must:

Use camelCase

Include domain prefix

Include clear action

End with stage suffix

Pattern:

{domain}{Action}{StageName}

Examples:

Validation:

courseRequireTitleValidation

moduleRequireCourseIdValidation

Normalization:

moduleNormalizeOrderNormalization

enrollmentNormalizeTimestampNormalization

Context:

enrollmentAttachLocationContext

courseAttachActorContext

Authorization:

courseRequireInstructorAuthorization

analyticsRequireRegionScopeAuthorization

Processing:

courseCreateRecordProcessing

moduleReorderProcessing

Forbidden:

validateTitle

normalize

attachContext

process

authorize

Generic stage names are banned.

7. Stage Folder Naming

Stage folders must be:

validate

normalize

addContext

authorize

process

emit

No alternate naming allowed.

Export files must be:

validators.js

normalizers.js

contexts.js

authorizers.js

processors.js

emitters.js

No deviations allowed.

8. File Naming Rules

General JavaScript files:

camelCase

Must match exported function name

One exported function per file

Example:

File:

courseRequireTitleValidation.js

Exported:

export function courseRequireTitleValidation() {}

No mismatched names.

9. Folder Naming Rules

Folders must be:

lowercase

singular

domain-based

never stage-based (for intents)

Correct:

intents/
    course/
    module/

Incorrect:

intents/
    validate/
    process/
10. Location Naming Rules

“School” is deprecated.

Use:

location

locationId

locationType

Never use:

schoolId

schoolType

Location types may include:

SCHOOL

CORPORATE_BRANCH

TRAINING_CENTER

GYM

LIBRARY

Enums must use UPPER_SNAKE_CASE.

11. Tenant Naming Rules

Identifiers:

tenantId

regionId

locationId

Never invent alternate names like:

orgId

companyId

branchId (unless domain-specific)

Consistency prevents query chaos.

12. Variable Naming Rules

Variables:

camelCase

Explicit meaning

No single-letter variables (except loops)

Examples:

authorizedLocationIds

safeScope

actorRole

intentPayload

normalizedTimestamp

Forbidden:

data

obj

thing

temp

x

13. Database Field Naming

Firestore fields:

camelCase preferred

snake_case only if legacy compatibility required

No mixed conventions

Required common fields:

locationId

tenantId

regionId

createdAt

updatedAt

createdBy

updatedBy

Consistency prevents analytics errors.

14. Analytics Naming Rules

Analytics fields must:

Avoid ranking language

Avoid subjective wording

Be neutral and measurable

Correct:

engagementRate

completionPercentage

averageSessionDuration

confidenceScore

Incorrect:

bestTeacher

weakestSchool

topPerformer

Governance neutrality is required.

15. Audit Naming Rules

Audit records must include:

intentType

actorId

actorRole

locationId

tenantId

resultStatus

timestamp

Audit field names must never change once in production.

16. Enum Naming Rules

Enums must:

Use UPPER_SNAKE_CASE

Be stored as strings (not numbers)

Be deterministic

Example:

ROLE_LOCATION_ADMIN
ROLE_REGION_ADMIN
ROLE_MINISTRY_ADMIN
ROLE_SUPER_ADMIN

Never use numeric role codes.

17. Reserved Words

The following words have architectural meaning and must not be reused casually:

Intent

Validate

Normalize

AddContext

Authorize

Process

Emit

Tenant

Location

Scope

Governance

Diagnostics

Avoid naming unrelated utilities with these words.

18. Anti-Drift Rules

Never:

Rename a domain casually

Rename an intent type without versioning

Rename stage suffix patterns

Introduce alternate naming patterns

Abbreviate domains inconsistently

If a rename is required:

Version it

Deprecate gradually

Update export layer only

Preserve backward compatibility

19. Expansion Stability Principle

If naming rules are followed:

1,000+ stage functions remain readable

500+ intents remain manageable

Refactors are localized

Cognitive load remains stable

Authorization logic remains traceable

Analytics remain consistent

Multi-tenant boundaries remain clear

Naming stability equals architectural stability.

20. Final Law

Names define structure.

Structure defines scalability.

Scalability defines national viability.

If naming discipline collapses,
architecture collapses.

Naming discipline is non-negotiable.

End of Naming Architecture
Version 1.0


