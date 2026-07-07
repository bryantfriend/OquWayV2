export function renderTemplate(activityContext) {
  var container = activityContext && activityContext.container ? activityContext.container : null;
  var content = activityContext && activityContext.content ? activityContext.content : {};
  var cards = Array.isArray(content.cards) ? content.cards : [];
  var html = "";

  if (!container) {
    return;
  }

  html += '<style>' + buildMysteryFlipCardsCss() + '</style>';
  html += '<article class="oqu-card-reveal-shell oqu-mystery-flip">';
  html += '<div class="oqu-card-reveal-header">';
  html += '<h2>' + escapeHtml(content.title || "Mystery Flip Cards") + '</h2>';
  html += '<p>' + escapeHtml(content.instructions || "Open every card to reveal the hidden answer.") + '</p>';
  html += '</div>';
  html += '<div class="oqu-mystery-flip-grid">';

  cards.forEach(function (card, index) {
    html += '<button type="button" class="oqu-mystery-flip-card" data-card-id="' + escapeHtml(card.id) + '" data-card-index="' + index + '">';
    html += '<span class="oqu-mystery-card-number">' + (index + 1) + '</span>';
    html += '<span class="oqu-mystery-card-front">' + escapeHtml(card.front) + '</span>';
    html += '<span class="oqu-mystery-card-back" hidden>' + escapeHtml(card.back) + '</span>';
    html += '</button>';
  });

  html += '</div>';
  html += '</article>';

  container.innerHTML = html;
  attachCardClicks(container, activityContext);
}

export function destroyTemplate(activityContext) {
  if (activityContext && activityContext.templateState && activityContext.templateState.onClick && activityContext.container) {
    activityContext.container.removeEventListener("click", activityContext.templateState.onClick);
  }
}

export function getTemplateDefaultContent() {
  return {
    templateId: "mystery-flip-cards",
    title: "Mystery Flip Cards",
    instructions: "Open every card to reveal the hidden answer.",
    cards: [
      { id: "mystery-1", front: "Mystery 1", back: "Answer 1" },
      { id: "mystery-2", front: "Mystery 2", back: "Answer 2" },
      { id: "mystery-3", front: "Mystery 3", back: "Answer 3" }
    ]
  };
}

export function getTemplatePreviewContent() {
  return {
    templateId: "mystery-flip-cards",
    title: "Mystery Flip Cards",
    instructions: "Flip the cards to uncover each computing concept.",
    cards: [
      { id: "mystery-preview-1", front: "Hidden concept", back: "Variable" },
      { id: "mystery-preview-2", front: "Hidden concept", back: "Loop" },
      { id: "mystery-preview-3", front: "Hidden concept", back: "Condition" },
      { id: "mystery-preview-4", front: "Hidden concept", back: "Function" },
      { id: "mystery-preview-5", front: "Hidden concept", back: "Debugging" },
      { id: "mystery-preview-6", front: "Hidden concept", back: "Output" }
    ]
  };
}

function attachCardClicks(container, activityContext) {
  var onClick = function (event) {
    var card = event.target.closest(".oqu-mystery-flip-card");
    var front = null;
    var back = null;

    if (!card) {
      return;
    }

    card.classList.add("is-revealed");
    front = card.querySelector(".oqu-mystery-card-front");
    back = card.querySelector(".oqu-mystery-card-back");
    if (front) {
      front.hidden = true;
    }
    if (back) {
      back.hidden = false;
    }

    activityContext.onInteraction({
      type: "card_revealed",
      cardId: card.getAttribute("data-card-id") || "",
      cardIndex: Number(card.getAttribute("data-card-index") || 0),
      templateId: "mystery-flip-cards"
    });
  };

  activityContext.templateState.onClick = onClick;
  container.addEventListener("click", onClick);
}

function buildMysteryFlipCardsCss() {
  return ""
    + ".oqu-card-reveal-shell{width:min(780px,100%);margin:0 auto;display:grid;gap:16px;color:#0f172a}"
    + ".oqu-card-reveal-header h2{margin:0 0 6px;font-size:26px;font-weight:950}.oqu-card-reveal-header p{margin:0;color:#64748b;font-size:14px;font-weight:750}"
    + ".oqu-mystery-flip-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.oqu-mystery-flip-card{min-height:148px;border:1px solid #bae6fd;border-radius:8px;background:#f0f9ff;color:#0f172a;padding:14px;display:grid;place-items:center;gap:8px;cursor:pointer;transition:transform .18s ease,background .18s ease,border-color .18s ease}"
    + ".oqu-mystery-flip-card:hover{transform:translateY(-2px)}.oqu-mystery-flip-card.is-revealed{background:#fff7ed;border-color:#fdba74}"
    + ".oqu-mystery-card-number{width:36px;height:36px;border-radius:999px;background:#2563eb;color:#fff;display:grid;place-items:center;font-weight:950}.oqu-mystery-card-front{font-size:14px;font-weight:900;color:#0369a1}.oqu-mystery-card-back{font-size:20px;font-weight:950;color:#9a3412;text-align:center}"
    + "@media(max-width:700px){.oqu-mystery-flip-grid{grid-template-columns:1fr 1fr}.oqu-mystery-flip-card{min-height:126px}}";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
