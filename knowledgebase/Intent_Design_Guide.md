Intent Design Guide

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
Purpose: Prevent Intent sprawl, duplication, and structural drift
Version: 2.0

1. Purpose

Intents define the behavioral vocabulary of OquWay.

An Intent says what the system is trying to do.
Stage functions define how each stage contributes to that action.

2. Intent Files Are Declarations

Intent files must not contain:

Inline validation logic
Inline normalization logic
Inline AddContext logic
Inline authorization logic
Inline processing logic
Database calls
UI logic
Business shortcuts

Intent files should import stage functions and return a clear stage map.

3. Required Intent Shape

Every Intent must declare all six runtime stages:

validate
normalize
addContext
authorize
process
emit

Every property must be an array.
Empty arrays are allowed.
Missing properties are architecture errors.

Example:

import { emitIntentResult } from "../../stages/emit/emitters.js";

export function CreateCourseIntent() {
    return {
        type: "CreateCourseIntent",
        validate: [],
        normalize: [],
        addContext: [],
        authorize: [],
        process: [],
        emit: [
            emitIntentResult
        ]
    };
}

4. Stage Function Imports

Intent files may import only from public stage export files:

../../stages/validate/validators.js
../../stages/normalize/normalizers.js
../../stages/addContext/contexts.js
../../stages/authorize/authorizers.js
../../stages/process/processors.js
../../stages/emit/emitters.js

Deep imports into domain or core folders are forbidden from intents.

5. Naming Rules

Intent names must:

Start with a clear verb
Describe one business action
Remain globally understandable
Avoid abbreviations
Avoid UI-only language

Good examples:

CreateCatalogCourseIntent
UpdateCatalogModuleIntent
AddStepIntent
PublishCourseIntent
RecordSpeakingSubmissionIntent
AddTeacherFeedbackIntent

Bad examples:

SaveIntent
HandleCourse
DoThing
ProcessDataIntent
CreateOrUpdateCourseIntent

6. Scope Rule

Each Intent represents one meaningful action.

If an action needs multiple unrelated outcomes, split it into multiple Intents.
If an action is only a UI interaction, keep it outside ICF unless it causes meaningful system behavior.

7. Stage Responsibility Reminder

Validate checks structure and rules.
Normalize makes payload data canonical.
AddContext attaches read-only system information.
Authorize checks permission and scope.
Process performs the query or mutation.
Emit formats the result and audit-facing output.

Only Process may mutate state.

8. Course Creator Direction

The current product direction is:

Course Creator creates courses.
Each course contains a Module Creator.
Each module contains configurable steps selected by the user.
Each step type must be customizable as much as practical while staying inside its step contract.

Initial supported step types:

Vocabulary Builder
Phrase Builder
Listening Challenge
Discussion Prompt
Speaking Recording
Reflection Survey

9. Teacher Feedback Direction

Speaking Recording submissions must surface in the teacher dashboard for review.
Teachers must be able to add comments that the student can review.

10. Analytics Direction

Analytics should help determine which course parts are working.
Student-facing progress should be summarized by communication category, such as:

Family Communication - 45% mastered
Travel Communication - 15% mastered
Professional Networking - 0% mastered

The mastery score may combine vocabulary, listening, speaking, completion, confidence, and teacher feedback data.

11. Practice Mode Direction

Supported practice modes are:

Before Class Warmup
After Class Reinforcement
Five Minute Daily Practice

Five Minute Daily Practice is a coming-soon shell for now.

12. No XP Or Badges For Now

Do not build XP or badge systems in the current pilot.
Motivation can be handled through completion, streak shells, confidence trends, and teacher feedback.

13. Final Law

When in doubt, keep Intents boring, explicit, and easy to inspect.
A boring Intent file is a healthy Intent file.

End of Intent Design Guide
Version 2.0
