StepType Specification

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

1. Purpose

StepTypes are reusable learning building blocks.

They define what a learner does inside a module step, how the step is configured by a course creator, and what evidence the step can emit for analytics and teacher review.

StepTypes are not independent business engines.
Meaningful persistence, analytics writes, submissions, and teacher feedback must go through ICF Intents.

2. Initial Pilot StepTypes

The pilot supports six step types:

Vocabulary Builder
Phrase Builder
Listening Challenge
Discussion Prompt
Speaking Recording
Reflection Survey

Do not add more step types until these are working well enough to build the first course path.

3. Step Customization Rule

Each step instance must be customizable as much as practical.

Common editable fields should include:

Title
Instructions
Estimated time
Learning objective
Communication category
Difficulty
Required or optional flag
Content items
Feedback text
Completion rule
Analytics tags

Each StepType may define additional fields specific to its behavior.

4. Required StepType Contract

A StepType definition must describe:

type
label
description
config schema
default config
editable fields
student-facing behavior
completion behavior
evidence emitted
analytics contribution
teacher review behavior, when applicable

5. Step Instance Contract

A step instance belongs to one module and references one StepType.

A step instance should contain:

id
type
order
config
isDraft
createdAt
updatedAt

The config object contains the customized values for that specific module step.

6. StepType Responsibilities

StepTypes may:

Render learning activity UI
Validate local input before submission
Emit local completion signals
Collect structured learning evidence
Request an ICF Intent for persistence

StepTypes must not:

Write directly to Firestore
Authorize users
Compute tenant scope
Mutate course/module records directly
Bypass ICF
Expose raw sensitive data

7. Speaking Recording Rule

Speaking Recording steps must support teacher review.

A speaking submission should create or update a review item visible in the teacher dashboard.

The teacher should be able to:

Review the recording
Add comments
Mark feedback as complete

The student should be able to:

See teacher comments
See feedback status
Use feedback for further practice

8. Reflection Survey Rule

Reflection Survey steps should measure confidence, not just correctness.

A common pattern is a 1 to 5 confidence rating tied to a communication category.

Example:

How confident are you discussing family topics in English?

9. Analytics Rule

Step evidence should support simple communication-category mastery.

Examples:

Family Communication - 45% mastered
Travel Communication - 15% mastered
Professional Networking - 0% mastered

The score may combine:

Vocabulary results
Phrase practice results
Listening results
Speaking submission status
Teacher feedback
Reflection confidence
Completion history
Daily practice activity

10. Practice Mode Support

StepTypes must be reusable across:

Before Class Warmup
After Class Reinforcement
Five Minute Daily Practice

Five Minute Daily Practice is a coming-soon shell for now.

11. No XP Or Badges For Now

Do not add XP or badge behavior to StepTypes in the current pilot.

12. Final Principle

StepTypes should make course creation flexible without making the engine complicated.

One good StepType with strong customization is better than many narrow StepTypes.

End of StepType Specification
Version 2.0
