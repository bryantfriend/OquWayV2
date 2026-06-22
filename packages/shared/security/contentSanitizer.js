import DOMPurify from "../../vendor/dompurify/purify.es.mjs";

const RICH_TEXT_CONFIG = {
  ALLOWED_TAGS: ["a", "b", "br", "code", "em", "i", "li", "ol", "p", "strong", "ul"],
  ALLOWED_ATTR: ["href", "rel", "target"],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
};

const SVG_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: false },
  ALLOWED_TAGS: [
    "svg", "g", "path", "circle", "ellipse", "line", "polyline", "polygon", "rect", "title", "desc", "text", "tspan", "defs", "linearGradient", "radialGradient", "stop"
  ],
  ALLOWED_ATTR: [
    "aria-hidden", "aria-label", "class", "cx", "cy", "d", "fill", "height", "id", "offset", "opacity", "points", "r", "role", "rx", "ry", "stroke", "stroke-linecap", "stroke-linejoin", "stroke-width", "tabindex", "transform", "viewBox", "width", "x", "x1", "x2", "y", "y1", "y2"
  ],
  FORBID_TAGS: ["animate", "foreignObject", "iframe", "script", "style"],
  FORBID_ATTR: ["onabort", "onerror", "onload", "onclick", "onfocus", "href", "xlink:href"]
};

export const CONTENT_SANITIZER_PROFILES = {
  plainText: "plainText",
  restrictedRichText: "restrictedRichText",
  restrictedSvg: "restrictedSvg"
};

export function sanitizePlainText(value) {
  return String(value == null ? "" : value);
}

export function sanitizeRestrictedRichText(value) {
  return DOMPurify.sanitize(String(value == null ? "" : value), RICH_TEXT_CONFIG);
}

export function sanitizeRestrictedSvg(value) {
  return DOMPurify.sanitize(String(value == null ? "" : value), SVG_CONFIG);
}

export function sanitizeContent(value, profile) {
  if (profile === CONTENT_SANITIZER_PROFILES.restrictedRichText) {
    return sanitizeRestrictedRichText(value);
  }

  if (profile === CONTENT_SANITIZER_PROFILES.restrictedSvg) {
    return sanitizeRestrictedSvg(value);
  }

  return sanitizePlainText(value);
}

export function setTextContent(element, value) {
  if (!element) {
    return;
  }

  element.textContent = sanitizePlainText(value);
}

export function setSanitizedHtml(element, value, profile) {
  if (!element) {
    return;
  }

  element.innerHTML = sanitizeContent(value, profile);
}

export function createSanitizationReport(value, profile) {
  var originalValue = String(value == null ? "" : value);
  var sanitizedValue = sanitizeContent(originalValue, profile);

  return {
    profile: profile || CONTENT_SANITIZER_PROFILES.plainText,
    changed: sanitizedValue !== originalValue,
    removedCharacters: Math.max(0, originalValue.length - sanitizedValue.length)
  };
}
