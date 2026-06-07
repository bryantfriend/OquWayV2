import { createIntent } from "../../../../../packages/icf/index.js?v=1.1.120-student-course-debug-summary";
import { runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.120-student-course-debug-summary";
import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.120-student-course-debug-summary";

function getActor() {
    const user = auth.currentUser;
    if (!user) {
        return null;
    }

    return {
        id: user.uid,
        name: user.displayName || user.email,
        role: "ROLE_COURSE_CREATOR" // Inject role here until custom claims are setup
    };
}

export const catalogCourseService = {
    async createCatalogCourse(payload) {
        const intentResult = createIntent({
            type: "CreateCourseIntent",
            payload: payload,
            actor: getActor()
        });

        if (!intentResult.ok) {
            return intentResult;
        }

        return await runIntentPipeline(intentResult.definition, intentResult.executionInput);
    },

    async fetchAllCatalogCourses() {
        const intentResult = createIntent({
            type: "LoadCoursesIntent",
            payload: {},
            actor: getActor()
        });

        if (!intentResult.ok) {
            return intentResult;
        }

        return await runIntentPipeline(intentResult.definition, intentResult.executionInput);
    },

    async archiveCourse(courseId) {
        return runNamedIntent("ArchiveCourseIntent", { courseId: courseId });
    },

    async deleteCourse(courseId) {
        return runNamedIntent("DeleteCourseIntent", { courseId: courseId });
    },

    async previewCourse(courseId) {
        return runNamedIntent("PreviewCourseIntent", { courseId: courseId });
    }
};

async function runNamedIntent(intentType, payload) {
    const intentResult = createIntent({
        type: intentType,
        payload: payload,
        actor: getActor()
    });

    if (!intentResult.ok) {
        return intentResult;
    }

    return await runIntentPipeline(intentResult.definition, intentResult.executionInput);
}
