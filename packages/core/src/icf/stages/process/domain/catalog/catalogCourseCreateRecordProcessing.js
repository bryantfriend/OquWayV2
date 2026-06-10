import { db, collection, doc, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";

export async function catalogCourseCreateRecordProcessing(executionState) {
    const { payload, context, actor } = executionState;

    // Generate a simple UUID-like string without platform random APIs.
    function generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const id = generateId();
    const timestamp = context.systemTimestamp || Date.now();
    const createdBy = (actor ? actor.id : undefined) || context.actorRole || "SYSTEM";

    const record = {
        id,
        slug: payload.slug,

        title: payload.title,
        description: payload.description || "",
        subject: payload.subject || "",
        level: payload.level || "",
        language: payload.language || payload.defaultLanguage || "en",
        status: payload.status || "draft",
        iconUrl: payload.iconUrl || "",

        languages: payload.languages || ["en"],
        defaultLanguage: payload.defaultLanguage || "en",

        tags: payload.tags || [],
        moduleOrder: [],

        version: 1,
        isArchived: false,
        isDeleted: false,

        createdBy,
        createdAt: timestamp,
        updatedAt: timestamp
    };

    await setDoc(doc(collection(db, "catalogCourses"), id), record);

    executionState.result = record;

    return { valid: true };
}

