Original prompt: Implement modular Practice Challenge templates, Scenario Simulator, Sequence Memory, and Timed Sequence Challenge.

Progress:
- Started Tuning Challenge implementation as a `practice-challenge` template.
- User added Falling Target Challenge, Navigation Challenge, and Care Simulator while Tuning was in progress. Implementing these as sibling `practice-challenge` templates in the same routing system.
- Added renderer/config/engine modules for Tuning Challenge, Falling Target Challenge, Navigation Challenge, and Care Simulator.
- Registered all new Practice Challenge templates in the Practice Challenge renderer router and activity template registry.
- Added the new `scenario-simulator` step type with rapid decision rendering, preset scenarios, timer/typewriter helpers, validation helpers, gamification results, and safe fallback behavior for future templates.
- Registered Scenario Simulator in the step type registry, Course Creator picker, activity template registry, and ICF add-step title map.
- Added ICT Systems, Cybersecurity, Digital Citizenship, Science, History, Business, SEL, and Classroom Expectations preset examples.
- Bumped build/cache version to `1.1.190-scenario-simulator`.
- Direct render smoke, preset smoke, targeted syntax checks, vanilla JS audit, and repo pre-commit checks passed after the version bump.
- Started Sequence Memory implementation from the Synth Matrix hook spec as a vanilla JS `sequence-memory` step.
- Added Sequence Memory renderer/config/engine modules, pad grid, start overlay, results, preset library, validation helper, and Web Audio helper.
- Registered Sequence Memory in the step type registry, Course Creator picker, activity template registry, and ICF add-step title map.
- Added ready `synth-sequence` and `pattern-repeat` templates, plus safe coming-soon fallbacks for `rhythm-builder` and `algorithm-trace`.
- Made Timer Enabled show managed elapsed play time without changing the sequence rules.
- Bumped build/cache version to `1.1.191-sequence-memory`.
- Fixed a Scenario Simulator editor schema/default-config mismatch so its generic editor fields remain visible.
- Sequence Memory render smoke, engine smoke, schema audit, vanilla JS audit, `git diff --check`, and repo pre-commit checks passed.
- Started Timed Sequence Challenge implementation from the Defusal / Wire Sequence hook spec as a vanilla JS `timed-sequence` step.
- Added Timed Sequence renderer/config/engine modules, guide, buttons, countdown timer, results, preset library, validation helper, and managed timer utility.
- Registered Timed Sequence in the step type registry, Course Creator picker, activity template registry, and ICF add-step title map.
- Added ready `defusal-sequence` and `workflow-sequence` templates, plus safe coming-soon fallbacks for `code-execution-order` and `emergency-response`.
- Added subject presets for ICT System Defusal, ICT Workflow, Coding, Science Method, Math Procedure, English Writing, and Classroom Routine.
- Bumped build/cache version to `1.1.192-timed-sequence`.
- Timed Sequence render smoke, engine smoke, schema audit, vanilla JS audit, `git diff --check`, and repo pre-commit checks passed.

TODO:
- Manual browser testing in Course Creator and Student Preview.
