import { db, doc, getDoc, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.78-location-command-center";

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

