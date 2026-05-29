export function validateCourseMetadataPayload(executionState) {
  const payload = readPayload(executionState);
  const errors = [];

  appendTitleErrors(errors, payload.title);
  appendDescriptionErrors(errors, payload.description);
  appendStatusErrors(errors, payload.status);
  appendLanguageErrors(errors, payload.languages, payload.defaultLanguage);

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors
    };
  }

  return { valid: true };
}

function readPayload(executionState) {
  if (!executionState) {
    return {};
  }

  if (!executionState.payload) {
    return {};
  }

  return executionState.payload;
}

function appendTitleErrors(errors, titleValue) {
  if (!hasUsableLocalizedText(titleValue)) {
    errors.push({
      code: "COURSE_TITLE_REQUIRED",
      field: "title",
      message: "Course title is required."
    });
  }
}

function appendDescriptionErrors(errors, descriptionValue) {
  if (typeof descriptionValue === "undefined") {
    return;
  }

  if (descriptionValue === null) {
    errors.push({
      code: "COURSE_DESCRIPTION_INVALID",
      field: "description",
      message: "Course description must be text or a language object."
    });
    return;
  }

  if (typeof descriptionValue === "string") {
    return;
  }

  if (typeof descriptionValue === "object" && !Array.isArray(descriptionValue)) {
    return;
  }

  errors.push({
    code: "COURSE_DESCRIPTION_INVALID",
    field: "description",
    message: "Course description must be text or a language object."
  });
}

function appendStatusErrors(errors, statusValue) {
  if (typeof statusValue === "undefined" || statusValue === null || statusValue === "") {
    return;
  }

  if (statusValue !== "draft" && statusValue !== "published" && statusValue !== "archived") {
    errors.push({
      code: "COURSE_STATUS_INVALID",
      field: "status",
      message: "Course status must be draft, published, or archived."
    });
  }
}

function appendLanguageErrors(errors, languagesValue, defaultLanguageValue) {
  if (typeof languagesValue !== "undefined" && !Array.isArray(languagesValue)) {
    errors.push({
      code: "COURSE_LANGUAGES_INVALID",
      field: "languages",
      message: "Course languages must be an array."
    });
    return;
  }

  if (Array.isArray(languagesValue) && languagesValue.length === 0) {
    errors.push({
      code: "COURSE_LANGUAGES_REQUIRED",
      field: "languages",
      message: "At least one course language is required."
    });
    return;
  }

  appendInvalidLanguageCodes(errors, languagesValue);
  appendDefaultLanguageErrors(errors, languagesValue, defaultLanguageValue);
}

function appendInvalidLanguageCodes(errors, languagesValue) {
  let languageIndex = 0;

  if (!Array.isArray(languagesValue)) {
    return;
  }

  while (languageIndex < languagesValue.length) {
    if (!isSupportedLanguage(languagesValue[languageIndex])) {
      errors.push({
        code: "COURSE_LANGUAGE_UNSUPPORTED",
        field: "languages",
        message: "Unsupported course language: " + languagesValue[languageIndex]
      });
    }

    languageIndex = languageIndex + 1;
  }
}

function appendDefaultLanguageErrors(errors, languagesValue, defaultLanguageValue) {
  if (typeof defaultLanguageValue === "undefined" || defaultLanguageValue === null || defaultLanguageValue === "") {
    return;
  }

  if (!isSupportedLanguage(defaultLanguageValue)) {
    errors.push({
      code: "COURSE_DEFAULT_LANGUAGE_UNSUPPORTED",
      field: "defaultLanguage",
      message: "Unsupported default language: " + defaultLanguageValue
    });
    return;
  }

  if (Array.isArray(languagesValue) && languagesValue.indexOf(defaultLanguageValue) === -1) {
    errors.push({
      code: "COURSE_DEFAULT_LANGUAGE_NOT_SELECTED",
      field: "defaultLanguage",
      message: "Default language must be one of the selected course languages."
    });
  }
}

function hasUsableLocalizedText(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (!value) {
    return false;
  }

  if (typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  return hasUsableLanguageValue(value, "en")
    || hasUsableLanguageValue(value, "ru")
    || hasUsableLanguageValue(value, "ky");
}

function hasUsableLanguageValue(value, languageCode) {
  if (typeof value[languageCode] !== "string") {
    return false;
  }

  return value[languageCode].trim().length > 0;
}

function isSupportedLanguage(languageCode) {
  return languageCode === "en" || languageCode === "ru" || languageCode === "ky";
}
