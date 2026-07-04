function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function catalogStepCreateProcessing(executionState) {
    const { payload, context } = executionState;
    const stepType = readStepType(payload);
    const title = readStepTitle(payload, stepType);

    executionState.result = {
        id: generateId(),
        moduleId: payload.moduleId,
        type: stepType,
        stepTypeId: stepType,
        title: title,
        instructions: readInstructions(payload),
        config: readStepConfig(payload, stepType),
        order: payload.order || 0,
        status: payload.status || "draft",
        createdAt: context.systemTimestamp,
        createdBy: context.createdBy
    };

    return { valid: true };
}
function readStepType(payload) {
    const source = payload || {};
    const config = source.config && typeof source.config === "object" && !Array.isArray(source.config) ? source.config : {};
    const stepType = source.stepType || source.stepTypeId || source.type || config.type || config.stepType || config.activityType || "";
    return normalizeStepType(stepType);
}

function normalizeStepType(stepType) {
    if (stepType === "card-reveal") {
        return "cardReveal";
    }

    return typeof stepType === "string" ? stepType.trim() : "";
}

function readStepTitle(payload, stepType) {
    if (payload && payload.title) {
        return payload.title;
    }

    if (payload && payload.config && payload.config.title) {
        return { en: String(payload.config.title), ru: "", ky: "" };
    }

    if (stepType === "cardReveal") {
        return { en: "Card Reveal", ru: "", ky: "" };
    }

    return { en: "New Step", ru: "", ky: "" };
}

function readInstructions(payload) {
    if (payload && payload.instructions) {
        return payload.instructions;
    }

    if (payload && payload.config && payload.config.instructions) {
        return { en: String(payload.config.instructions), ru: "", ky: "" };
    }

    return { en: "", ru: "", ky: "" };
}

function readStepConfig(payload, stepType) {
    const config = payload && payload.config && typeof payload.config === "object" && !Array.isArray(payload.config) ? payload.config : {};
    return Object.assign({}, config, {
        type: config.type || stepType
    });
}
