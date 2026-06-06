// Stubbed data loaders for contexts. In a real system, these would fetch from Firestore before processing.

export async function attachExistingCourseContext(executionState) {
    // Let's assume fetching course by executionState.payload.courseId
    // return { valid: true, data: { existingCourse: fetchedRecord } };
    return { valid: true };
}

