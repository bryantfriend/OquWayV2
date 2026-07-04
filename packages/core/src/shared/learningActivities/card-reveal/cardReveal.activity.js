import {
  getDefaultCardRevealContent,
  normalizeCardRevealConfig,
  validateCardRevealConfig
} from "./cardReveal.schema.js?v=1.1.225-learning-activity-source-folders";
import {
  cardRevealActivityDefinition,
  getCardRevealTemplateDefinition
} from "./cardReveal.registry.js?v=1.1.225-learning-activity-source-folders";

export function createCardRevealActivityContext(container, config, callbacks) {
  var safeCallbacks = callbacks && typeof callbacks === "object" ? callbacks : {};
  var normalized = normalizeCardRevealConfig(config);
  var templateDefinition = readTemplateDefinition(normalized.templateId);
  var revealedCardIds = [];
  var completed = false;
  var activityContext = {
    activityType: "cardReveal",
    templateId: templateDefinition.meta.templateId,
    requestedTemplateId: normalized.templateId,
    container: container,
    content: normalized,
    schema: cardRevealActivityDefinition.schema,
    templateMetadata: templateDefinition.meta,
    templateState: {},
    onInteraction: function (interaction) {
      var event = normalizeInteraction(interaction, templateDefinition.meta.templateId);

      if (event.type === "card_revealed" && revealedCardIds.indexOf(event.cardId) === -1) {
        revealedCardIds.push(event.cardId);
      }

      if (typeof safeCallbacks.onInteraction === "function") {
        safeCallbacks.onInteraction(event);
      }

      if (!completed && isCardRevealComplete(normalized, revealedCardIds)) {
        completed = true;
        if (typeof safeCallbacks.onComplete === "function") {
          safeCallbacks.onComplete({
            success: true,
            score: 100,
            data: {
              activityType: "cardReveal",
              templateId: templateDefinition.meta.templateId,
              revealedCardIds: revealedCardIds.slice()
            }
          });
        }
      }
    }
  };

  return {
    activityContext: activityContext,
    templateDefinition: templateDefinition,
    validation: validateCardRevealConfig(normalized)
  };
}

export function renderCardRevealActivity(container, config, callbacks) {
  var renderState = createCardRevealActivityContext(container, config, callbacks);

  if (!container) {
    return null;
  }

  if (!renderState.validation.valid) {
    container.innerHTML = buildValidationErrorHtml(renderState.validation.errors);
    return renderState.activityContext;
  }

  renderState.templateDefinition.module.renderTemplate(renderState.activityContext);
  return renderState.activityContext;
}

export function destroyCardRevealActivity(activityContext) {
  var templateDefinition = null;

  if (!activityContext) {
    return;
  }

  templateDefinition = getCardRevealTemplateDefinition(activityContext.templateId);
  if (templateDefinition && templateDefinition.module && typeof templateDefinition.module.destroyTemplate === "function") {
    templateDefinition.module.destroyTemplate(activityContext);
  }
}

export function getCardRevealDefaultContent() {
  return getDefaultCardRevealContent();
}

export function getCardRevealPreviewContent(templateId) {
  var templateDefinition = readTemplateDefinition(templateId);

  if (templateDefinition && templateDefinition.module && typeof templateDefinition.module.getTemplatePreviewContent === "function") {
    return Object.assign(
      { templateId: templateDefinition.meta.templateId },
      templateDefinition.module.getTemplatePreviewContent()
    );
  }

  return getDefaultCardRevealContent();
}

function readTemplateDefinition(templateId) {
  var templateDefinition = getCardRevealTemplateDefinition(templateId);
  var fallbackTemplateId = cardRevealActivityDefinition.defaultTemplate;

  if (templateDefinition) {
    return templateDefinition;
  }

  console.warn("[learning-activity] Explicit template fallback", {
    activityType: "cardReveal",
    requestedTemplateId: templateId || "",
    fallbackTemplateId: fallbackTemplateId
  });

  return getCardRevealTemplateDefinition(fallbackTemplateId);
}

function normalizeInteraction(interaction, templateId) {
  var source = interaction && typeof interaction === "object" ? interaction : {};

  return {
    type: typeof source.type === "string" ? source.type : "unknown",
    activityType: "cardReveal",
    templateId: templateId,
    cardId: typeof source.cardId === "string" ? source.cardId : "",
    cardIndex: typeof source.cardIndex === "number" ? source.cardIndex : 0,
    createdAt: new Date().toISOString()
  };
}

function isCardRevealComplete(config, revealedCardIds) {
  var cards = Array.isArray(config.cards) ? config.cards : [];

  return cards.length > 0 && revealedCardIds.length >= cards.length;
}

function buildValidationErrorHtml(errors) {
  var html = "";

  html += '<section class="oqu-player-step course-player-fallback-step">';
  html += '<h2>Card Reveal cannot render</h2>';
  html += '<div class="course-player-fallback-label">Validation failed</div>';
  html += '<ul>';
  errors.forEach(function (error) {
    html += '<li>' + escapeHtml(error.message || error.code || "Invalid card reveal content.") + '</li>';
  });
  html += '</ul>';
  html += '</section>';

  return html;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
