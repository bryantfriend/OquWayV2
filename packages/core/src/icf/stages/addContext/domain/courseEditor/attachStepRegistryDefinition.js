import { db, doc, getDoc, collection, getDocs, query, orderBy } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.114-student-profile-rules";

export async function attachStepRegistryDefinition(executionState) {
    const { payload } = executionState;
    if (!payload.stepType) return { valid: true };

    return {
        valid: true,
        data: {
            stepDefinition: {
                type: payload.stepType,
                defaultConfig: { title: "New " + payload.stepType }
            }
        }
    };
}

