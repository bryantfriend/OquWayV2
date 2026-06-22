import i18next from "../../vendor/i18next/i18next.js";
import { isFeatureEnabled } from "../config/features.js";
import { en } from "./locales/en.js";
import { ru } from "./locales/ru.js";
import { ky } from "./locales/ky.js";

const SUPPORTED_LANGUAGES = ["en", "ru", "ky"];
const STORAGE_KEY = "oquway.ui.language";

var initialized = false;
var initializingPromise = null;
var listeners = [];

export function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES.slice();
}

export function initializeLocalization(options) {
  var safeOptions = options || {};

  if (!isFeatureEnabled("localizedUi")) {
    return Promise.resolve({ language: "en", enabled: false });
  }

  if (initialized) {
    return Promise.resolve({ language: i18next.language || "en", enabled: true });
  }

  if (initializingPromise) {
    return initializingPromise;
  }

  initializingPromise = i18next.init({
    lng: resolveInitialLanguage(safeOptions),
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      ky: { translation: ky }
    },
    interpolation: {
      escapeValue: true
    },
    returnEmptyString: false
  }).then(function () {
    initialized = true;
    applyDocumentLanguage(i18next.language);
    return { language: i18next.language, enabled: true };
  });

  return initializingPromise;
}

export function translate(key, options) {
  if (!initialized) {
    return readFallbackKey(key, options);
  }

  return i18next.t(key, options || {});
}

export function getCurrentLanguage() {
  if (!initialized) {
    return resolveStoredLanguage() || "en";
  }

  return normalizeLanguage(i18next.language);
}

export function changeLanguage(language) {
  var normalizedLanguage = normalizeLanguage(language);

  return initializeLocalization({ language: normalizedLanguage }).then(function () {
    return i18next.changeLanguage(normalizedLanguage);
  }).then(function () {
    persistLanguage(normalizedLanguage);
    applyDocumentLanguage(normalizedLanguage);
    notifyLanguageListeners(normalizedLanguage);
    return normalizedLanguage;
  });
}

export function onLanguageChanged(listener) {
  if (typeof listener !== "function") {
    return function () {};
  }

  listeners.push(listener);
  return function () {
    listeners = listeners.filter(function (registeredListener) {
      return registeredListener !== listener;
    });
  };
}

export function renderLanguageSelector(selectId) {
  var id = selectId || "oquwayLanguageSelect";
  var language = getCurrentLanguage();

  return '<label class="oqu-language-selector-label" for="' + escapeHtml(id) + '">'
    + '<span>' + escapeHtml(translate("language.label")) + '</span>'
    + '<select id="' + escapeHtml(id) + '" class="oqu-language-selector">'
    + renderLanguageOption("en", translate("language.english"), language)
    + renderLanguageOption("ru", translate("language.russian"), language)
    + renderLanguageOption("ky", translate("language.kyrgyz"), language)
    + '</select>'
    + '</label>';
}

export function attachLanguageSelector(selectElement, onChanged) {
  if (!selectElement) {
    return function () {};
  }

  selectElement.value = getCurrentLanguage();

  function handleChange() {
    changeLanguage(selectElement.value).then(function (language) {
      if (typeof onChanged === "function") {
        onChanged(language);
      }
    });
  }

  selectElement.addEventListener("change", handleChange);

  return function () {
    selectElement.removeEventListener("change", handleChange);
  };
}

function resolveInitialLanguage(options) {
  return normalizeLanguage(options.language || resolveStoredLanguage() || resolveBrowserLanguage() || "en");
}

function resolveStoredLanguage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return "";
  }

  return window.localStorage.getItem(STORAGE_KEY) || "";
}

function persistLanguage(language) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, normalizeLanguage(language));
}

function resolveBrowserLanguage() {
  if (typeof navigator === "undefined") {
    return "";
  }

  return navigator.language || "";
}

function normalizeLanguage(language) {
  var value = String(language || "").toLowerCase().split("-")[0];

  return SUPPORTED_LANGUAGES.indexOf(value) === -1 ? "en" : value;
}

function applyDocumentLanguage(language) {
  if (typeof document === "undefined" || !document.documentElement) {
    return;
  }

  document.documentElement.lang = normalizeLanguage(language);
  document.documentElement.dir = "ltr";
}

function notifyLanguageListeners(language) {
  listeners.slice().forEach(function (listener) {
    listener(language);
  });
}

function renderLanguageOption(value, label, selectedLanguage) {
  return '<option value="' + escapeHtml(value) + '"' + (selectedLanguage === value ? " selected" : "") + '>' + escapeHtml(label) + '</option>';
}

function readFallbackKey(key, options) {
  var segments = String(key || "").split(".");
  var value = en;
  var index = 0;

  while (index < segments.length && value) {
    value = value[segments[index]];
    index = index + 1;
  }

  if (typeof value !== "string") {
    return String(key || "");
  }

  return interpolate(value, options || {});
}

function interpolate(value, options) {
  var result = value;
  Object.keys(options).forEach(function (key) {
    result = result.replace(new RegExp("{{\\s*" + key + "\\s*}}", "g"), escapeHtml(options[key]));
  });
  return result;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
