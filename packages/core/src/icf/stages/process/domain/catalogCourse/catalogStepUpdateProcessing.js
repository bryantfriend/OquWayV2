function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function catalogStepUpdateProcessing(executionState) {
    const { payload, context } = executionState;
    const existingStep = context.existingStep || {};
    const stepType = readStepType(payload, existingStep);

    executionState.result = {
        id: payload.stepId,
        ...existingStep,
        type: stepType,
        stepTypeId: stepType,
        title: payload.title || existingStep.title || readStepTitle(payload, stepType),
        instructions: payload.instructions || existingStep.instructions || readInstructions(payload),
        config: readStepConfig(payload, existingStep, stepType),
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy
    };

    return { valid: true };
}
function readStepType(payload, existingStep) {
    const source = payload || {};
    const existing = existingStep || {};
    const config = source.config && typeof source.config === "object" && !Array.isArray(source.config) ? source.config : {};
    const existingConfig = existing.config && typeof existing.config === "object" && !Array.isArray(existing.config) ? existing.config : {};
    const stepType = source.stepType || source.stepTypeId || source.type || config.type || config.stepType || config.activityType || existing.type || existing.stepTypeId || existing.stepType || existingConfig.type || existingConfig.stepType || existingConfig.activityType || "";
    return normalizeStepType(stepType);
}

function normalizeStepType(stepType) {
    if (stepType === "card-reveal") {
        return "cardReveal";
    }

    return typeof stepType === "string" ? stepType.trim() : "";
}

function readStepTitle(payload, stepType) {
    if (payload && payload.config && payload.config.title) {
        return { en: String(payload.config.title), ru: "", ky: "" };
    }

    if (stepType === "cardReveal") {
        return { en: "Card Reveal", ru: "", ky: "" };
    }

    return { en: "New Step", ru: "", ky: "" };
}

function readInstructions(payload) {
    if (payload && payload.config && payload.config.instructions) {
        return { en: String(payload.config.instructions), ru: "", ky: "" };
    }

    return { en: "", ru: "", ky: "" };
}

function readStepConfig(payload, existingStep, stepType) {
    const existingConfig = existingStep && existingStep.config && typeof existingStep.config === "object" && !Array.isArray(existingStep.config) ? existingStep.config : {};
    const nextConfig = payload && payload.config && typeof payload.config === "object" && !Array.isArray(payload.config) ? payload.config : existingConfig;
    return Object.assign({}, nextConfig, {
        type: nextConfig.type || stepType
    });
}
