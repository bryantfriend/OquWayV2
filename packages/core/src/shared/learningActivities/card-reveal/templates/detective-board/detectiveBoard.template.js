export function renderTemplate(activityContext) {
  var container = activityContext && activityContext.container ? activityContext.container : null;
  var content = activityContext && activityContext.content ? activityContext.content : {};
  var cards = Array.isArray(content.cards) ? content.cards : [];
  var html = "";

  if (!container) return;

  html += '<style>' + buildDetectiveBoardCss() + '</style>';
  html += '<article class="oqu-detective-board"><header><span>Case File</span><h2>' + escapeHtml(content.title || "Detective Investigation Board") + '</h2><p>' + escapeHtml(content.instructions || "Inspect each clue, then connect the evidence.") + '</p></header>';
  html += '<section class="oqu-evidence-wall">';
  cards.forEach(function (card, index) {
    html += '<button type="button" class="oqu-evidence-card oqu-evidence-card-' + (index % 6) + '" data-card-id="' + escapeHtml(card.id) + '" data-card-index="' + index + '"><span>' + escapeHtml(card.hint || "Evidence") + '</span><strong>' + escapeHtml(card.front) + '</strong><small>Inspect clue</small></button>';
  });
  html += '<svg class="oqu-evidence-strings" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M18 24 L78 18 L52 54 L22 78 L82 76" /></svg>';
  html += '</section><aside class="oqu-case-notes"><strong>Case notes</strong><span>Open every clue to build the final explanation.</span></aside></article>';

  container.innerHTML = html;
  attachEvidenceClicks(container, activityContext, cards);
}

export function destroyTemplate(activityContext) {
  if (activityContext && activityContext.templateState && activityContext.templateState.onClick && activityContext.container) {
    activityContext.container.removeEventListener("click", activityContext.templateState.onClick);
  }
}

export function getTemplateDefaultContent() {
  return {
    templateId: "detective-board",
    title: "Solve the Computer Mystery",
    instructions: "Inspect each clue and decide how the ideas connect.",
    cards: [
      { id: "detective-1", front: "Input", back: "Input starts the process by sending data into the computer.", hint: "Clue" },
      { id: "detective-2", front: "Process", back: "Processing changes input by following instructions.", hint: "Evidence" },
      { id: "detective-3", front: "Output", back: "Output is the final result the user can see or use.", hint: "Result" }
    ]
  };
}

export function getTemplatePreviewContent() {
  return {
    templateId: "detective-board",
    title: "Who Helped Create Modern Computing?",
    instructions: "Inspect the evidence and connect the people, machines, and ideas.",
    cards: [
      { id: "detective-preview-1", front: "Charles Babbage", back: "Designed mechanical computing machines such as the Difference Engine.", hint: "Photo" },
      { id: "detective-preview-2", front: "Ada Lovelace", back: "Wrote early algorithm ideas for a computing machine.", hint: "Note" },
      { id: "detective-preview-3", front: "Alan Turing", back: "Helped define key ideas in computation and code-breaking.", hint: "File" },
      { id: "detective-preview-4", front: "ENIAC", back: "An early electronic general-purpose computer.", hint: "Record" }
    ]
  };
}

function attachEvidenceClicks(container, activityContext, cards) {
  var notes = container.querySelector(".oqu-case-notes");
  var onClick = function (event) {
    var clue = event.target.closest(".oqu-evidence-card");
    var index = 0;
    var card = null;
    if (!clue) return;
    index = Number(clue.getAttribute("data-card-index") || 0);
    card = cards[index] || {};
    clue.classList.add("is-inspected");
    if (notes) notes.innerHTML = '<strong>' + escapeHtml(card.front || "Clue") + '</strong><span>' + escapeHtml(card.back || "Revealed") + '</span>';
    if (container.querySelectorAll(".oqu-evidence-card.is-inspected").length >= cards.length) {
      container.querySelector(".oqu-evidence-wall").classList.add("case-solved");
    }
    activityContext.onInteraction({ type: "card_revealed", cardId: clue.getAttribute("data-card-id") || "", cardIndex: index, templateId: "detective-board" });
  };
  activityContext.templateState.onClick = onClick;
  container.addEventListener("click", onClick);
}

function buildDetectiveBoardCss() {
  return ""
    + ".oqu-detective-board{width:min(880px,100%);margin:0 auto;display:grid;gap:16px;color:#0f172a}.oqu-detective-board header span{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.14em;color:#92400e}.oqu-detective-board h2{margin:4px 0;font-size:28px;font-weight:950}.oqu-detective-board p{margin:0;color:#64748b;font-weight:750}.oqu-evidence-wall{position:relative;min-height:390px;border:1px solid #fed7aa;border-radius:24px;background:linear-gradient(135deg,#451a03,#78350f);overflow:hidden;padding:18px}.oqu-evidence-wall:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 20%,rgba(255,255,255,.12),transparent 24%),radial-gradient(circle at 80% 70%,rgba(255,255,255,.10),transparent 28%)}"
    + ".oqu-evidence-card{position:absolute;z-index:2;width:150px;min-height:104px;border:0;border-radius:8px;background:#fffbeb;color:#292524;padding:12px;text-align:left;display:grid;gap:5px;cursor:pointer;box-shadow:0 12px 24px rgba(0,0,0,.24);transform:rotate(var(--tilt,0deg));transition:transform .18s ease,filter .18s ease}.oqu-evidence-card:hover{filter:brightness(1.04);transform:rotate(var(--tilt,0deg)) translateY(-3px)}.oqu-evidence-card span{font-size:10px;font-weight:950;text-transform:uppercase;color:#b45309}.oqu-evidence-card strong{font-size:15px}.oqu-evidence-card small{font-size:11px;color:#78716c;font-weight:800}.oqu-evidence-card.is-inspected{outline:3px solid #22c55e}.oqu-evidence-card-0{left:8%;top:13%;--tilt:-4deg}.oqu-evidence-card-1{right:12%;top:9%;--tilt:3deg}.oqu-evidence-card-2{left:38%;top:39%;--tilt:1deg}.oqu-evidence-card-3{left:12%;bottom:12%;--tilt:5deg}.oqu-evidence-card-4{right:12%;bottom:13%;--tilt:-5deg}.oqu-evidence-card-5{left:55%;bottom:6%;--tilt:2deg}.oqu-evidence-strings{position:absolute;inset:0;z-index:1;opacity:.18}.oqu-evidence-strings path{fill:none;stroke:#f97316;stroke-width:1.5}.oqu-evidence-wall.case-solved .oqu-evidence-strings{opacity:.9}.oqu-case-notes{border:1px solid #fed7aa;background:#fff7ed;border-radius:18px;padding:16px;display:grid;gap:6px}.oqu-case-notes strong{font-size:18px}.oqu-case-notes span{color:#9a3412;font-weight:800;line-height:1.5}"
    + "@media(max-width:720px){.oqu-evidence-wall{display:grid;gap:12px;min-height:auto}.oqu-evidence-card{position:relative;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:auto;transform:none}.oqu-evidence-strings{display:none}}";
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}
