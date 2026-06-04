// apps/teacher-dashboard/src/ui/services/courseService.js

import { createIntent } from "../../../../../../packages/core/src/icf/engine/createIntent.js";
import { runIntentPipeline } from "../../../../../../packages/core/src/icf/engine/runIntentPipeline.js";

// In real app, this will come from Firebase Auth
function getCurrentActor() {
  return {
    id: "teacher-123",
    role: "ROLE_TEACHER",
    locationId: "location-001"
  };
}

export async function createCourse(title) {
  const actor = getCurrentActor();

  const { definition, executionInput } = createIntent({
    type: "CreateCourseIntent",
    payload: { title },
    actor
  });

  const result = await runIntentPipeline(definition, executionInput);

  return result.emitted;
}
