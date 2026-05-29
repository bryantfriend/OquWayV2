Course Creator Current Plan

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

1. Pilot Principle

OquWay should not replace the teacher.

Teacher = Coach
OquWay = Personal Trainer

The teacher handles explanation, conversation, correction, group work, roleplay, and human interaction.
OquWay handles daily practice, review, repetition, pronunciation practice, progress tracking, homework reinforcement, and motivation between classes.

2. Builder Hierarchy

The current target structure is:

Course Creator
Module Creator inside each course
Step selection and step customization inside each module

Each step must be customizable as much as practical without breaking its step contract.

3. Initial Step Types

The pilot supports six reusable step types:

Vocabulary Builder
Phrase Builder
Listening Challenge
Discussion Prompt
Speaking Recording
Reflection Survey

The twelve-session course should be created by changing content, not by creating a custom engine for each lesson.

4. Practice Modes

The product should support three practice modes:

Before Class Warmup
After Class Reinforcement
Five Minute Daily Practice

Five Minute Daily Practice is a coming-soon shell for now.

5. Session One Example

Session One topic:
Family and Children

Before Class:
Five-minute warmup with family vocabulary, basic phrases, and a quick matching activity.

During Class:
Teacher runs the class. OquWay is not required during live instruction.

After Class:
Reinforcement module named My Family.

Recommended flow:
Review vocabulary
Practice useful phrases
Complete a short listening challenge
Record a speaking response
Complete a confidence reflection
Finish with a simple completion state

6. Speaking Review Loop

Speaking Recording submissions must appear in the teacher dashboard.

The teacher should be able to:

Review the recording
See related course/module/step context
Add comments
Mark feedback as complete

The student should be able to:

Review teacher comments
Replay their own recording if available
See whether feedback has been provided

7. Analytics Direction

Analytics should help us understand which parts of the course are working.

Do not expose every raw metric as a separate category.
Use simple communication categories such as:

Family Communication - 45% mastered
Travel Communication - 15% mastered
Professional Networking - 0% mastered
Business Meetings - 0% mastered
Cross-Cultural Communication - 0% mastered

The mastery score may combine:

Completion
Vocabulary accuracy
Listening performance
Speaking submissions
Reflection confidence
Teacher feedback
Daily practice activity

8. Teacher Dashboard Shells

The teacher dashboard should include, even as shells:

Individual progress
Class summary
Confidence trends
Missing homework
Speaking submissions
Daily practice streaks
Teacher feedback comments

9. No XP Or Badges For Now

The pilot should not include XP or badges yet.

Use progress, confidence, completion, and teacher feedback before adding gamification.

10. Next Build Priority

Architecture alignment comes first.

After that, rebuild the Course Creator around:

Course setup
Module setup
Step selection
Step customization
Teacher review flow
Analytics shell
Practice mode shells

End of Course Creator Current Plan
