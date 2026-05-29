ICF Stage Export Rules

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
Applies To: ICF Stage Layer
Purpose: Prevent export-file entropy and import instability
Version: 2.0

1. Source Of Truth

The active ICF stage structure is:

packages/core/src/icf/stages/validate
packages/core/src/icf/stages/normalize
packages/core/src/icf/stages/addContext
packages/core/src/icf/stages/authorize
packages/core/src/icf/stages/process
packages/core/src/icf/stages/emit

Each stage folder may contain only:

core
domain

No base, runtime, schema, stepEngine, policy, role, or scope sibling folders are allowed inside a stage folder.

2. Public Export Files

Each stage exposes one public export file from its stage folder:

Stage Folder | Public Export File
validate | validators.js
normalize | normalizers.js
addContext | contexts.js
authorize | authorizers.js
process | processors.js
emit | emitters.js

Intent files must import from these public export files only.

Correct examples:

import { validateCourseId } from "../../stages/validate/validators.js";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js";
import { attachCourseDocument } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processSaveCourseDraft } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

Forbidden example:

import { validateCourseId } from "../../stages/validate/domain/courseEditor/validateCourseId.js";

3. Export File Contents

Public export files may contain only:

Explicit export statements
Short section comments

Public export files must not contain:

Stage logic
Conditionals
Function definitions
Database calls
Authorization decisions
State mutation
Wildcard exports

4. Stage Function File Rule

Each stage implementation file must:

Export exactly one named function
Use a clear domain-prefixed name
Live in either core or domain
Match the stage responsibility
Avoid clever shortcuts

Examples:

validate/domain/courseEditor/validateCourseId.js
normalize/domain/courseEditor/normalizeCourseId.js
addContext/domain/courseEditor/attachCourseDocument.js
authorize/domain/catalogCourse/requireCourseCreatorAuthorization.js
process/domain/moduleEditor/processAddStep.js
emit/core/emitIntentResult.js

5. Ordering Rule

Within a public export file:

Core exports come first
Domain exports follow
Domain groups stay alphabetized when practical
Existing unrelated exports must not be reshuffled casually

6. Relocation Rule

If a stage function moves:

Move the implementation file
Update only the stage public export file
Do not edit every intent import

7. Emit Rule

Emit is a required stage.

Emit must not be hidden inside Process.
Emit must have its own public export file.
Every Intent must explicitly include an emit array.

8. Final Rule

Export files are stability boundaries.
They exist so intents can remain simple declarations while stage implementations evolve safely.

End of ICF Stage Export Rules
Version 2.0
