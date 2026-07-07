export function renderTemplate(activityContext) {
  var container = activityContext && activityContext.container ? activityContext.container : null;
  var content = activityContext && activityContext.content ? activityContext.content : {};
  var cards = Array.isArray(content.cards) ? content.cards : [];
  var html = "";

  if (!container) {
    return;
  }

  html += '<style>' + buildClassicCardRevealCss() + '</style>';
  html += '<article class="oqu-card-reveal-shell oqu-classic-card-reveal">';
  html += '<div class="oqu-card-reveal-header">';
  html += '<h2>' + escapeHtml(content.title || "Card Reveal") + '</h2>';
  html += '<p>' + escapeHtml(content.instructions || "Select each card to reveal the answer.") + '</p>';
  html += '</div>';
  html += '<div class="oqu-classic-card-reveal-list">';

  cards.forEach(function (card, index) {
    html += '<button type="button" class="oqu-classic-card-reveal-card" data-card-id="' + escapeHtml(card.id) + '" data-card-index="' + index + '">';
    html += '<span class="oqu-card-reveal-card-kicker">Card ' + (index + 1) + '</span>';
    html += '<strong class="oqu-card-reveal-card-front">' + escapeHtml(card.front) + '</strong>';
    html += '<span class="oqu-card-reveal-card-back" hidden>' + escapeHtml(card.back) + '</span>';
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
    templateId: "classic-card-reveal",
    title: "Card Reveal",
    instructions: "Select each card to reveal the answer.",
    cards: [
      { id: "card-1", front: "Term", back: "Definition" },
      { id: "card-2", front: "Question", back: "Answer" }
    ]
  };
}

export function getTemplatePreviewContent() {
  return {
    templateId: "classic-card-reveal",
    title: "Classic Card Reveal",
    instructions: "Click each card to reveal the answer.",
    cards: [
      { id: "classic-1", front: "Algorithm", back: "A clear sequence of steps for solving a problem." },
      { id: "classic-2", front: "Input", back: "Data given to a program before it runs." },
      { id: "classic-3", front: "Output", back: "The result produced by a program." }
    ]
  };
}

function attachCardClicks(container, activityContext) {
  var onClick = function (event) {
    var card = event.target.closest(".oqu-classic-card-reveal-card");
    var back = null;

    if (!card) {
      return;
    }

    card.classList.add("is-revealed");
    back = card.querySelector(".oqu-card-reveal-card-back");
    if (back) {
      back.hidden = false;
    }

    activityContext.onInteraction({
      type: "card_revealed",
      cardId: card.getAttribute("data-card-id") || "",
      cardIndex: Number(card.getAttribute("data-card-index") || 0),
      templateId: "classic-card-reveal"
    });
  };

  activityContext.templateState.onClick = onClick;
  container.addEventListener("click", onClick);
}

function buildClassicCardRevealCss() {
  return ""
    + ".oqu-card-reveal-shell{width:min(720px,100%);margin:0 auto;display:grid;gap:16px;color:#0f172a}"
    + ".oqu-card-reveal-header{text-align:left}.oqu-card-reveal-header h2{margin:0 0 6px;font-size:26px;font-weight:950}.oqu-card-reveal-header p{margin:0;color:#64748b;font-size:14px;font-weight:750}"
    + ".oqu-classic-card-reveal-list{display:grid;gap:12px}.oqu-classic-card-reveal-card{border:1px solid #dbe5f2;border-radius:8px;background:#fff;padding:16px;text-align:left;display:grid;gap:8px;cursor:pointer;transition:border-color .15s ease,background .15s ease,transform .15s ease}"
    + ".oqu-classic-card-reveal-card:hover{transform:translateY(-1px);border-color:#93c5fd}.oqu-classic-card-reveal-card.is-revealed{border-color:#34d399;background:#ecfdf5}"
    + ".oqu-card-reveal-card-kicker{color:#2563eb;font-size:10px;font-weight:950;text-transform:uppercase}.oqu-card-reveal-card-front{font-size:18px}.oqu-card-reveal-card-back{color:#047857;font-size:14px;font-weight:850;line-height:1.5}";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
