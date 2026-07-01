import { getCourseById } from "../../../../../../../domain/courses/index.js";

export async function attachCourseDocument(executionState) {
    const { payload } = executionState;
    if (!payload.courseId) return { valid: true };

    try {
        const course = await getCourseById(payload.courseId, { sources: ["catalogCourses", "courses"] });

        if (!course) {
            return {
                valid: false,
                errors: [{ message: "Course not found: " + payload.courseId }]
            };
        }

        return {
            valid: true,
            data: {
                course: course,
                courseCollectionName: course.source || "catalogCourses"
            }
        };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach course document: " + err.message }]
        };
    }
}
