import { getModuleById } from "../../../../../../../domain/modules/index.js";

export async function attachModule(executionState) {
    const { payload, context } = executionState;

    if (context.modules && payload.moduleId) {
        let found = null;
        for (let i = 0; i < context.modules.length; i++) {
            if (context.modules[i].id === payload.moduleId) {
                found = context.modules[i];
                break;
            }
        }
        if (found) {
            return { valid: true, data: { module: found } };
        }
    }

    if (!payload.courseId || !payload.moduleId) return { valid: true };

    try {
        const moduleRecord = await getModuleById(payload.courseId, payload.moduleId, {
            sources: [readCourseCollectionName(executionState), "catalogCourses", "courses"]
        });

        if (!moduleRecord) {
            return {
                valid: false,
                errors: [{ message: "Module not found" }]
            };
        }

        return { valid: true, data: { module: moduleRecord } };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach module: " + err.message }]
        };
    }
}

function readCourseCollectionName() {
    return "catalogCourses";
}
