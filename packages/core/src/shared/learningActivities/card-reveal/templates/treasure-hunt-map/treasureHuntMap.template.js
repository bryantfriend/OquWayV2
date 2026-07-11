export function renderTemplate(activityContext) {
  var container = activityContext && activityContext.container ? activityContext.container : null;
  var content = activityContext && activityContext.content ? activityContext.content : {};
  var cards = Array.isArray(content.cards) ? content.cards : [];
  var html = "";

  if (!container) return;

  html += '<style>' + buildTreasureHuntMapCss() + '</style>';
  html += '<article class="oqu-card-reveal-shell oqu-treasure-map">';
  html += '<header><span>Exploration Reveal</span><h2>' + escapeHtml(content.title || "Treasure Hunt Map") + '</h2><p>' + escapeHtml(content.instructions || "Tap each hotspot to uncover the hidden information.") + '</p></header>';
  html += '<section class="oqu-map-stage"><div class="oqu-map-path"></div>';
  cards.forEach(function (card, index) {
    html += '<button type="button" class="oqu-map-hotspot oqu-map-hotspot-' + (index % 6) + '" data-card-id="' + escapeHtml(card.id) + '" data-card-index="' + index + '">';
    html += '<span class="oqu-hotspot-pulse"></span><strong>' + escapeHtml(card.front) + '</strong><small>' + escapeHtml(card.hint || "Discover") + '</small></button>';
  });
  html += '</section><aside class="oqu-map-panel"><strong>Select a hotspot</strong><span>Each discovery stays marked on the map.</span></aside>';
  html += '</article>';

  container.innerHTML = html;
  attachHotspotClicks(container, activityContext, cards);
}

export function destroyTemplate(activityContext) {
  if (activityContext && activityContext.templateState && activityContext.templateState.onClick && activityContext.container) {
    activityContext.container.removeEventListener("click", activityContext.templateState.onClick);
  }
}

export function getTemplateDefaultContent() {
  return {
    templateId: "treasure-hunt-map",
    title: "Computer Lab Treasure Hunt",
    instructions: "Explore each glowing station to learn what it does.",
    cards: [
      { id: "map-1", front: "Monitor", back: "The screen displays information from the computer.", hint: "Display" },
      { id: "map-2", front: "Keyboard", back: "The keyboard sends typed input into the computer.", hint: "Input" },
      { id: "map-3", front: "System Unit", back: "The system unit contains important processing hardware.", hint: "Hardware" }
    ]
  };
}

export function getTemplatePreviewContent() {
  return {
    templateId: "treasure-hunt-map",
    title: "Explore the ICT Desk",
    instructions: "Find the hidden parts of the computer workstation.",
    cards: [
      { id: "map-preview-1", front: "CPU", back: "Processes instructions and controls many computer operations.", hint: "Brain" },
      { id: "map-preview-2", front: "RAM", back: "Temporarily stores data while programs are running.", hint: "Memory" },
      { id: "map-preview-3", front: "SSD", back: "Stores files and programs even when the computer is off.", hint: "Storage" },
      { id: "map-preview-4", front: "Router", back: "Connects devices to a network and helps send data.", hint: "Network" }
    ]
  };
}

function attachHotspotClicks(container, activityContext, cards) {
  var panel = container.querySelector(".oqu-map-panel");
  var onClick = function (event) {
    var button = event.target.closest(".oqu-map-hotspot");
    var card = null;
    var index = 0;

    if (!button) return;

    index = Number(button.getAttribute("data-card-index") || 0);
    card = cards[index] || {};
    button.classList.add("is-found");
    if (panel) {
      panel.innerHTML = '<strong>' + escapeHtml(card.front || "Discovery") + '</strong><span>' + escapeHtml(card.back || "Revealed") + '</span>';
    }
    activityContext.onInteraction({ type: "card_revealed", cardId: button.getAttribute("data-card-id") || "", cardIndex: index, templateId: "treasure-hunt-map" });
  };

  activityContext.templateState.onClick = onClick;
  container.addEventListener("click", onClick);
}

function buildTreasureHuntMapCss() {
  return ""
    + ".oqu-card-reveal-shell{width:min(860px,100%);margin:0 auto;color:#0f172a}.oqu-treasure-map{display:grid;gap:16px}.oqu-treasure-map header span{font-size:10px;font-weight:950;text-transform:uppercase;color:#0f766e;letter-spacing:.14em}.oqu-treasure-map h2{margin:4px 0;font-size:28px;font-weight:950}.oqu-treasure-map p{margin:0;color:#64748b;font-weight:750}"
    + ".oqu-map-stage{position:relative;min-height:360px;border:1px solid #bae6fd;border-radius:24px;overflow:hidden;background:linear-gradient(135deg,#ecfeff,#f0fdf4 50%,#fff7ed);box-shadow:inset 0 0 0 1px rgba(255,255,255,.7)}.oqu-map-path{position:absolute;inset:42px;border:3px dashed rgba(20,184,166,.35);border-radius:48% 42% 52% 40%;transform:rotate(-8deg)}"
    + ".oqu-map-hotspot{position:absolute;width:132px;min-height:86px;border:0;border-radius:18px;background:#fff;color:#0f172a;padding:12px;display:grid;gap:4px;place-items:center;cursor:pointer;box-shadow:0 12px 30px rgba(15,23,42,.12);transition:transform .18s ease,box-shadow .18s ease}.oqu-map-hotspot:hover{transform:translateY(-3px) scale(1.02)}.oqu-map-hotspot strong{font-size:14px}.oqu-map-hotspot small{font-size:10px;font-weight:900;color:#0891b2;text-transform:uppercase}.oqu-hotspot-pulse{width:16px;height:16px;border-radius:50%;background:#38bdf8;box-shadow:0 0 0 8px rgba(56,189,248,.18)}.oqu-map-hotspot.is-found{background:#dcfce7}.oqu-map-hotspot.is-found .oqu-hotspot-pulse{background:#22c55e}"
    + ".oqu-map-hotspot-0{left:8%;top:14%}.oqu-map-hotspot-1{right:12%;top:12%}.oqu-map-hotspot-2{left:38%;top:38%}.oqu-map-hotspot-3{left:12%;bottom:12%}.oqu-map-hotspot-4{right:10%;bottom:16%}.oqu-map-hotspot-5{left:52%;bottom:8%}.oqu-map-panel{border:1px solid #ccfbf1;background:#f0fdfa;border-radius:18px;padding:16px;display:grid;gap:6px}.oqu-map-panel strong{font-size:18px}.oqu-map-panel span{color:#0f766e;font-weight:800;line-height:1.5}"
    + "@media(max-width:720px){.oqu-map-stage{min-height:520px}.oqu-map-hotspot{position:relative;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;margin:12px;width:calc(100% - 24px)}.oqu-map-path{display:none}}";
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}
