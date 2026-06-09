export function normalizeCourseMetadata(executionState) {
  const payload = readPayload(executionState);
  const defaultLanguage = normalizeDefaultLanguage(payload.defaultLanguage);
  const languages = normalizeLanguages(payload.languages, defaultLanguage);
  const courseData = {
    title: normalizeLocalizedText(payload.title, defaultLanguage),
    description: normalizeLocalizedText(payload.description, defaultLanguage),
    subject: normalizeTextValue(payload.subject),
    level: normalizeTextValue(payload.level),
    language: normalizeLanguage(payload.language, defaultLanguage),
    status: normalizeStatus(payload.status),
    defaultLanguage: defaultLanguage,
    languages: languages,
    tags: normalizeTags(payload.tags),
    slug: normalizeSlug(payload.title, defaultLanguage)
  };

  appendOptionalVisualFields(courseData, payload);

  return {
    valid: true,
    data: courseData
  };
}

function appendOptionalVisualFields(courseData, payload) {
  if ("iconUrl" in payload) {
    courseData.iconUrl = normalizeTextValue(payload.iconUrl);
  }

  if ("heroImageUrl" in payload) {
    courseData.heroImageUrl = normalizeTextValue(payload.heroImageUrl);
  }

  if ("themeColor" in payload) {
    courseData.themeColor = normalizeTextValue(payload.themeColor);
  }

  if ("accentColor" in payload) {
    courseData.accentColor = normalizeTextValue(payload.accentColor);
  }
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

function normalizeLocalizedText(value, defaultLanguage) {
  const localizedText = createEmptyLocalizedText();

  if (typeof value === "string") {
    localizedText[defaultLanguage] = value.trim();
    return localizedText;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return localizedText;
  }

  localizedText.en = normalizeTextValue(value.en);
  localizedText.ru = normalizeTextValue(value.ru);
  localizedText.ky = normalizeTextValue(value.ky);

  return localizedText;
}

function createEmptyLocalizedText() {
  return {
    en: "",
    ru: "",
    ky: ""
  };
}

function normalizeTextValue(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeDefaultLanguage(defaultLanguage) {
  if (isSupportedLanguage(defaultLanguage)) {
    return defaultLanguage;
  }

  return "en";
}

function normalizeLanguages(languages, defaultLanguage) {
  const normalizedLanguages = [];
  let languageIndex = 0;

  if (Array.isArray(languages)) {
    while (languageIndex < languages.length) {
      appendLanguage(normalizedLanguages, languages[languageIndex]);
      languageIndex = languageIndex + 1;
    }
  }

  appendLanguage(normalizedLanguages, defaultLanguage);

  if (normalizedLanguages.length === 0) {
    normalizedLanguages.push("en");
  }

  return normalizedLanguages;
}

function appendLanguage(languageList, languageCode) {
  if (!isSupportedLanguage(languageCode)) {
    return;
  }

  if (languageList.indexOf(languageCode) !== -1) {
    return;
  }

  languageList.push(languageCode);
}

function normalizeTags(tags) {
  const normalizedTags = [];
  let tagIndex = 0;

  if (!Array.isArray(tags)) {
    return normalizedTags;
  }

  while (tagIndex < tags.length) {
    appendTag(normalizedTags, tags[tagIndex]);
    tagIndex = tagIndex + 1;
  }

  return normalizedTags;
}

function appendTag(tagList, tagValue) {
  let normalizedTag = "";

  if (typeof tagValue !== "string") {
    return;
  }

  normalizedTag = tagValue.trim();

  if (normalizedTag.length === 0) {
    return;
  }

  if (tagList.indexOf(normalizedTag) !== -1) {
    return;
  }

  tagList.push(normalizedTag);
}

function normalizeStatus(status) {
  if (status === "published" || status === "archived") {
    return status;
  }

  return "draft";
}

function normalizeLanguage(language, fallbackLanguage) {
  if (isSupportedLanguage(language)) {
    return language;
  }

  return fallbackLanguage;
}

function normalizeSlug(titleValue, defaultLanguage) {
  const localizedTitle = normalizeLocalizedText(titleValue, defaultLanguage);
  let sourceTitle = localizedTitle[defaultLanguage];

  if (!sourceTitle) {
    sourceTitle = localizedTitle.en;
  }

  return sourceTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function isSupportedLanguage(languageCode) {
  return languageCode === "en" || languageCode === "ru" || languageCode === "ky";
}
