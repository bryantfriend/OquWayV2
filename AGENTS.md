# OquWayV2 Agent Notes

## Project Overview
OquWayV2 is a static multi-dashboard education app with shared packages for Firebase, domain logic, UI helpers, permissions, and ICF pipeline code.

## Architecture Rules
- Keep dashboard behavior inside its app folder and shared behavior inside `packages/`.
- Do not modify Firebase rules unless the task explicitly asks for it.
- Prefer existing shared helpers over new abstractions.
- Preserve valid forward-slash paths.

## ICF Pipeline Order
Intent flow is: normalize, validate, addContext, authorize, process, emit.

## Code Style
- Use plain JavaScript modules and the repo's existing import style.
- Keep changes small, explicit, and scoped to the request.
- Avoid unrelated refactors and formatting churn.

## Testing Expectations
- Run targeted `node --check` syntax checks for touched JavaScript files.
- For dashboard changes, verify the relevant user flow or explain why it was not run.
- Check `git status` before and after work.

## Output Format
End with what changed, files touched, tests run, commit hash when pushed, and known risks.
