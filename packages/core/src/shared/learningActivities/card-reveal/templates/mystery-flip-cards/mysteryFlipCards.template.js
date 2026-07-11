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
  html += '<div><span>Mystery Reveal</span><h2>' + escapeHtml(content.title || "Mystery Flip Cards") + '</h2><p>' + escapeHtml(content.instructions || "Flip every card to reveal the hidden answer.") + '</p></div>';
  html += '<button type="button" class="oqu-mystery-flip-all">Flip All</button>';
  html += '</div>';
  html += '<div class="oqu-mystery-progress"><strong>0/' + cards.length + '</strong><span>cards revealed</span></div>';
  html += '<div class="oqu-mystery-flip-grid">';

  cards.forEach(function (card, index) {
    html += '<button type="button" class="oqu-mystery-flip-card" data-card-id="' + escapeHtml(card.id) + '" data-card-index="' + index + '">';
    html += '<span class="oqu-mystery-card-inner">';
    html += '<span class="oqu-mystery-card-face oqu-mystery-card-front"><small>Card ' + (index + 1) + '</small><strong>' + escapeHtml(card.front) + '</strong><em>' + escapeHtml(card.hint || "Tap to reveal") + '</em></span>';
    html += '<span class="oqu-mystery-card-face oqu-mystery-card-back"><small>Revealed</small><strong>' + escapeHtml(card.back) + '</strong></span>';
    html += '</span>';
    html += '</button>';
  });

  html += '</div><div class="oqu-mystery-finale" hidden>All mysteries revealed.</div>';
  html += '</article>';

  container.innerHTML = html;
  attachCardClicks(container, activityContext, cards);
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
    instructions: "Flip every card to reveal the hidden answer.",
    cards: [
      { id: "mystery-1", front: "Input", back: "Data entered into a computer.", hint: "IPO" },
      { id: "mystery-2", front: "Process", back: "The work the computer performs on data.", hint: "IPO" },
      { id: "mystery-3", front: "Output", back: "The result produced by the computer.", hint: "IPO" }
    ]
  };
}

export function getTemplatePreviewContent() {
  return {
    templateId: "mystery-flip-cards",
    title: "Mystery Flip Cards",
    instructions: "Flip the cards to uncover each computing concept.",
    cards: [
      { id: "mystery-preview-1", front: "Hidden concept", back: "Variable", hint: "Stores data" },
      { id: "mystery-preview-2", front: "Hidden concept", back: "Loop", hint: "Repeats steps" },
      { id: "mystery-preview-3", front: "Hidden concept", back: "Condition", hint: "Makes a decision" },
      { id: "mystery-preview-4", front: "Hidden concept", back: "Function", hint: "Reusable code" },
      { id: "mystery-preview-5", front: "Hidden concept", back: "Debugging", hint: "Find and fix" },
      { id: "mystery-preview-6", front: "Hidden concept", back: "Output", hint: "Result" }
    ]
  };
}

function attachCardClicks(container, activityContext, cards) {
  var onClick = function (event) {
    var flipAll = event.target.closest(".oqu-mystery-flip-all");
    var card = event.target.closest(".oqu-mystery-flip-card");

    if (flipAll) {
      Array.prototype.forEach.call(container.querySelectorAll(".oqu-mystery-flip-card"), function (button) {
        revealCard(container, activityContext, button, cards);
      });
      return;
    }

    if (!card) {
      return;
    }

    revealCard(container, activityContext, card, cards);
  };

  activityContext.templateState.onClick = onClick;
  container.addEventListener("click", onClick);
}

function revealCard(container, activityContext, card, cards) {
  var index = Number(card.getAttribute("data-card-index") || 0);

  if (card.classList.contains("is-revealed")) {
    return;
  }

  card.classList.add("is-revealed");
  updateProgress(container, cards.length);
  activityContext.onInteraction({
    type: "card_revealed",
    cardId: card.getAttribute("data-card-id") || "",
    cardIndex: index,
    templateId: "mystery-flip-cards"
  });
}

function updateProgress(container, total) {
  var revealed = container.querySelectorAll(".oqu-mystery-flip-card.is-revealed").length;
  var progress = container.querySelector(".oqu-mystery-progress strong");
  var finale = container.querySelector(".oqu-mystery-finale");

  if (progress) {
    progress.textContent = revealed + "/" + total;
  }

  if (finale && revealed >= total) {
    finale.hidden = false;
  }
}

function buildMysteryFlipCardsCss() {
  return ""
    + ".oqu-card-reveal-shell{width:min(820px,100%);margin:0 auto;display:grid;gap:16px;color:#0f172a}.oqu-card-reveal-header{display:flex;align-items:start;justify-content:space-between;gap:14px}.oqu-card-reveal-header span{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.14em;color:#7c3aed}.oqu-card-reveal-header h2{margin:4px 0;font-size:28px;font-weight:950}.oqu-card-reveal-header p{margin:0;color:#64748b;font-size:14px;font-weight:750}.oqu-mystery-flip-all{border:1px solid #ddd6fe;background:#f5f3ff;color:#6d28d9;border-radius:999px;padding:9px 13px;font-size:12px;font-weight:950;cursor:pointer}.oqu-mystery-progress{display:flex;align-items:center;gap:8px;border:1px solid #e9d5ff;background:#faf5ff;border-radius:16px;padding:10px 12px;width:max-content}.oqu-mystery-progress strong{color:#6d28d9}.oqu-mystery-progress span{color:#64748b;font-size:12px;font-weight:850}"
    + ".oqu-mystery-flip-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;perspective:1200px}.oqu-mystery-flip-card{min-height:172px;border:0;background:transparent;padding:0;cursor:pointer;perspective:1000px}.oqu-mystery-card-inner{position:relative;display:block;width:100%;height:172px;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.8,.2,1)}.oqu-mystery-flip-card.is-revealed .oqu-mystery-card-inner{transform:rotateY(180deg)}.oqu-mystery-card-face{position:absolute;inset:0;border-radius:18px;backface-visibility:hidden;display:grid;place-items:center;align-content:center;gap:8px;padding:16px;text-align:center;box-shadow:0 16px 34px rgba(15,23,42,.14)}.oqu-mystery-card-front{background:radial-gradient(circle at top,#ede9fe,#dbeafe);border:1px solid #c4b5fd}.oqu-mystery-card-back{transform:rotateY(180deg);background:linear-gradient(135deg,#fff7ed,#fffbeb);border:1px solid #fdba74}.oqu-mystery-card-face small{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.12em;color:#7c3aed}.oqu-mystery-card-face strong{font-size:20px;font-weight:950}.oqu-mystery-card-face em{font-style:normal;font-size:12px;font-weight:850;color:#64748b}.oqu-mystery-card-back small{color:#c2410c}.oqu-mystery-card-back strong{color:#9a3412}.oqu-mystery-finale{border:1px solid #bbf7d0;background:#f0fdf4;color:#047857;border-radius:16px;padding:12px 14px;font-size:13px;font-weight:950;text-align:center}"
    + "@media(max-width:760px){.oqu-mystery-flip-grid{grid-template-columns:1fr 1fr}.oqu-card-reveal-header{flex-direction:column}.oqu-mystery-card-inner,.oqu-mystery-flip-card{min-height:150px;height:150px}}";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
