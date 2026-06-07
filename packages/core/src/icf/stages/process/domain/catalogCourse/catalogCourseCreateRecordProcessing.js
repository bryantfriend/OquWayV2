import { db, collection, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.118-fruit-login-student-identity";

function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function catalogCourseCreateRecordProcessing(executionState) {
    const payload = executionState.payload;
    const context = executionState.context;
    const id = generateId();
    const record = createCourseRecord(id, payload, context);

    try {
        await setDoc(doc(collection(db, "courses"), id), record);
        executionState.result = record;
        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            errors: [
                {
                    code: "COURSE_CREATE_WRITE_FAILED",
                    message: "Failed to create course in database: " + error.message
                }
            ]
        };
    }
}

function createCourseRecord(id, payload, context) {
    return {
        id: id,
        title: readLocalizedText(payload.title),
        description: readLocalizedText(payload.description),
        status: readStatus(payload.status),
        defaultLanguage: readDefaultLanguage(payload.defaultLanguage),
        languages: readLanguages(payload.languages, payload.defaultLanguage),
        tags: readTags(payload.tags),
        slug: readText(payload.slug),
        version: readVersion(payload.version),
        createdBy: readText(context.createdBy),
        createdByName: readText(context.createdByName),
        tenantId: readText(context.tenantId),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: readText(context.createdBy),
        updatedByName: readText(context.createdByName),
        isArchived: false,
        isDeleted: false
    };
}

function readLocalizedText(value) {
    const localizedText = {
        en: "",
        ru: "",
        ky: ""
    };

    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return localizedText;
    }

    localizedText.en = readText(value.en);
    localizedText.ru = readText(value.ru);
    localizedText.ky = readText(value.ky);

    return localizedText;
}

function readLanguages(languages, defaultLanguage) {
    const languageList = [];
    let languageIndex = 0;

    if (Array.isArray(languages)) {
        while (languageIndex < languages.length) {
            appendLanguage(languageList, languages[languageIndex]);
            languageIndex = languageIndex + 1;
        }
    }

    appendLanguage(languageList, defaultLanguage);

    if (languageList.length === 0) {
        languageList.push("en");
    }

    return languageList;
}

function appendLanguage(languageList, languageCode) {
    if (languageCode !== "en" && languageCode !== "ru" && languageCode !== "ky") {
        return;
    }

    if (languageList.indexOf(languageCode) !== -1) {
        return;
    }

    languageList.push(languageCode);
}

function readTags(tags) {
    if (!Array.isArray(tags)) {
        return [];
    }

    return tags.slice();
}

function readText(value) {
    if (typeof value !== "string") {
        return "";
    }

    return value;
}

function readStatus(status) {
    if (status === "published" || status === "archived") {
        return status;
    }

    return "draft";
}

function readDefaultLanguage(defaultLanguage) {
    if (defaultLanguage === "ru" || defaultLanguage === "ky") {
        return defaultLanguage;
    }

    return "en";
}

function readVersion(version) {
    if (typeof version === "number" && version > 0) {
        return version;
    }

    return 1;
}

