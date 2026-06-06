import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.79-user-command-center";

export async function catalogCourseUpdateMetadataProcessing(executionState) {
    const payload = executionState.payload;
    const context = executionState.context;
    const existingCourse = readExistingCourse(context);
    const metadataUpdate = createMetadataUpdate(payload, context);
    const updatedCourse = Object.assign({}, existingCourse, metadataUpdate);

    try {
        await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId), metadataUpdate, { merge: true });
        executionState.result = updatedCourse;
        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            errors: [
                {
                    code: "COURSE_METADATA_WRITE_FAILED",
                    message: "Failed to update course metadata: " + error.message
                }
            ]
        };
    }
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}

function readExistingCourse(context) {
    if (context && context.course) {
        return context.course;
    }

    if (context && context.existingCourse) {
        return context.existingCourse;
    }

    return {};
}

function createMetadataUpdate(payload, context) {
    return {
        title: readLocalizedText(payload.title),
        description: readLocalizedText(payload.description),
        subject: readText(payload.subject),
        level: readText(payload.level),
        language: readDefaultLanguage(payload.language || payload.defaultLanguage),
        status: readStatus(payload.status),
        defaultLanguage: readDefaultLanguage(payload.defaultLanguage),
        languages: readLanguages(payload.languages, payload.defaultLanguage),
        tags: readTags(payload.tags),
        slug: readText(payload.slug),
        updatedAt: serverTimestamp(),
        updatedBy: readText(context.updatedBy),
        updatedByName: readText(context.updatedByName)
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

