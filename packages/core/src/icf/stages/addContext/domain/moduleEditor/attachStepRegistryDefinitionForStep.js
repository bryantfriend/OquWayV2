import { db, doc, getDoc, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js";

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

