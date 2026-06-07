import { db, doc, getDoc, collection, getDocs, query, orderBy } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.110-student-class-alias-query";

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

