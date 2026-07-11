export const cardRevealSchema = {
  activityType: "cardReveal",
  displayName: "Card Reveal",
  requiredContentFields: ["cards.front", "cards.back"],
  fields: [
    {
      key: "title",
      label: "Title",
      type: "text"
    },
    {
      key: "instructions",
      label: "Instructions",
      type: "textarea"
    },
    {
      key: "templateId",
      label: "Template",
      type: "select",
      options: ["mystery-flip-cards", "treasure-hunt-map", "digital-file-explorer", "x-ray-scanner", "detective-board", "time-machine-timeline", "classic-card-reveal", "speed-reveal-stack"]
    },
    {
      key: "cards",
      label: "Cards",
      type: "cardList",
      itemFields: ["front", "back", "hint"]
    }
  ]
};

export function getDefaultCardRevealContent() {
  return {
    templateId: "mystery-flip-cards",
    title: "Mystery Flip Cards",
    instructions: "Flip each card to reveal the hidden concept.",
    cards: [
      {
        id: "card-1",
        front: "Input",
        back: "Data entered into a computer system.",
        hint: "IPO"
      },
      {
        id: "card-2",
        front: "Output",
        back: "The result produced by the computer.",
        hint: "IPO"
      },
      {
        id: "card-3",
        front: "Process",
        back: "The work a computer performs on input data.",
        hint: "IPO"
      }
    ]
  };
}

export function getCardRevealPreviewContent(templateId) {
  return {
    templateId: templateId || "classic-card-reveal",
    title: "Card Reveal Preview",
    instructions: "Click each card to test the selected template.",
    cards: [
      {
        id: "preview-1",
        front: "Algorithm",
        back: "A clear sequence of steps for solving a problem.",
        hint: ""
      },
      {
        id: "preview-2",
        front: "Loop",
        back: "A structure that repeats instructions.",
        hint: ""
      },
      {
        id: "preview-3",
        front: "Condition",
        back: "A decision that changes what happens next.",
        hint: ""
      }
    ]
  };
}

export function normalizeCardRevealConfig(config) {
  var source = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var defaults = getDefaultCardRevealContent();
  var cards = normalizeCards(source.cards);

  return {
    templateId: readString(source.templateId, defaults.templateId),
    title: readString(source.title, defaults.title),
    instructions: readString(source.instructions, defaults.instructions),
    cards: cards.length > 0 ? cards : defaults.cards
  };
}

export function validateCardRevealConfig(config) {
  var normalized = normalizeCardRevealConfig(config);
  var errors = [];

  if (normalized.cards.length === 0) {
    errors.push({
      code: "CARD_REVEAL_REQUIRES_CARDS",
      message: "Card Reveal requires at least one card."
    });
  }

  normalized.cards.forEach(function (card, index) {
    if (!card.front || !card.back) {
      errors.push({
        code: "CARD_REVEAL_CARD_INCOMPLETE",
        message: "Card " + (index + 1) + " requires front and back text."
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors,
    normalized: normalized
  };
}

function normalizeCards(cards) {
  var safeCards = Array.isArray(cards) ? cards : [];
  var normalized = [];

  safeCards.forEach(function (card, index) {
    var source = card && typeof card === "object" ? card : {};
    var front = readString(source.front || source.term || source.question, "");
    var back = readString(source.back || source.definition || source.answer, "");

    if (!front && !back) {
      return;
    }

    normalized.push({
      id: readString(source.id, "card-" + (index + 1)),
      front: front,
      back: back,
      hint: readString(source.hint, "")
    });
  });

  return normalized;
}

function readString(value, fallbackText) {
  if (typeof value !== "string") {
    return fallbackText;
  }

  return value.trim() || fallbackText;
}
