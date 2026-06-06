import { db, doc, getDoc, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.108-student-class-alias-merge";

export async function attachStepRegistryDefinitionForStep(executionState) {
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

