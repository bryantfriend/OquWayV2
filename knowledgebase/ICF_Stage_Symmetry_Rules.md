ICF Stage Symmetry Rules

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
Purpose: Prevent folder chaos, naming drift, and structural reorganization
Version: 2.0

1. Governed Stage Folders

All ICF stage logic lives under:

packages/core/src/icf/stages/

The only valid stage folders are:

validate
normalize
addContext
authorize
process
emit

No other stage folder names are current.

2. Required Stage Folder Pattern

Each stage folder follows the same pattern:

stageName/
    core/
    domain/
    publicExportFile.js

Allowed examples:

validate/core/
validate/domain/
normalize/domain/
addContext/domain/
authorize/domain/
process/domain/
emit/core/
emit/domain/

3. Forbidden Stage Siblings

The following folders are not allowed as direct children of a stage folder:

base
runtime
schemas
stepEngine
policy
role
scope
helpers
utils

If a reusable function is cross-domain, place it in core.
If a function is domain-specific, place it in domain.

4. Public Export Files

Each stage must expose one public export file:

validate/validators.js
normalize/normalizers.js
addContext/contexts.js
authorize/authorizers.js
process/processors.js
emit/emitters.js

Intents may import only from these files.

5. Intent Symmetry

Every Intent must declare all required runtime stages:

validate
normalize
addContext
authorize
process
emit

Empty arrays are allowed for pass-through stages.
Missing stage properties are architecture errors.

Correct shape:

export function CreateCourseIntent() {
    return {
        type: "CreateCourseIntent",
        validate: [],
        normalize: [],
        addContext: [],
        authorize: [],
        process: [],
        emit: []
    };
}

6. Stage Naming

Function names should describe their domain and purpose clearly.

Examples:

validateCourseId
normalizeCourseId
attachCourseDocument
requireCourseCreatorAuthorization
processSaveCourseDraft
emitIntentResult

Short ambiguous names such as validate, normalize, authorize, process, or emit are not valid exported stage-function names.

7. Additive Growth Rule

New behavior is added by:

Adding new intent files under packages/core/src/icf/intents
Adding new stage files under an existing stage folder
Adding exports to the relevant public export file

New behavior must not require reorganizing the ICF folder structure.

8. Final Rule

The ICF folder structure is intentionally small:

engine
intents
stages

That simplicity is a design constraint. Preserve it.

End of ICF Stage Symmetry Rules
Version 2.0
