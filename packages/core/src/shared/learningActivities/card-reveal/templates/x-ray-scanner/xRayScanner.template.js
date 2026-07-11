export function renderTemplate(activityContext) {
  var container = activityContext && activityContext.container ? activityContext.container : null;
  var content = activityContext && activityContext.content ? activityContext.content : {};
  var cards = Array.isArray(content.cards) ? content.cards : [];
  var html = "";

  if (!container) return;

  html += '<style>' + buildXRayScannerCss() + '</style>';
  html += '<article class="oqu-xray-scanner">';
  html += '<header><span>Scanner Reveal</span><h2>' + escapeHtml(content.title || "X-Ray Scanner") + '</h2><p>' + escapeHtml(content.instructions || "Move the scanner and inspect each hidden part.") + '</p></header>';
  html += '<section class="oqu-xray-stage"><div class="oqu-xray-object"><div class="oqu-xray-screen"></div>';
  cards.forEach(function (card, index) {
    html += '<button type="button" class="oqu-xray-part oqu-xray-part-' + (index % 6) + '" data-card-id="' + escapeHtml(card.id) + '" data-card-index="' + index + '"><strong>' + escapeHtml(card.front) + '</strong><span>' + escapeHtml(card.hint || "Layer") + '</span></button>';
  });
  html += '<div class="oqu-xray-lens" aria-hidden="true"><span></span></div></div></section><aside class="oqu-xray-readout"><strong>Scanner ready</strong><span>Move your pointer over the object, then click a revealed part.</span></aside>';
  html += '</article>';

  container.innerHTML = html;
  attachScannerHandlers(container, activityContext, cards);
}

export function destroyTemplate(activityContext) {
  if (!activityContext || !activityContext.templateState || !activityContext.container) return;
  if (activityContext.templateState.onClick) activityContext.container.removeEventListener("click", activityContext.templateState.onClick);
  if (activityContext.templateState.onMove) activityContext.container.removeEventListener("pointermove", activityContext.templateState.onMove);
}

export function getTemplateDefaultContent() {
  return {
    templateId: "x-ray-scanner",
    title: "Scan the Computer",
    instructions: "Move the scanner over the computer and reveal each hidden component.",
    cards: [
      { id: "xray-1", front: "Motherboard", back: "The main circuit board that connects computer components.", hint: "Core" },
      { id: "xray-2", front: "CPU", back: "The processor runs instructions and calculations.", hint: "Processing" },
      { id: "xray-3", front: "Fan", back: "The fan helps keep components cool.", hint: "Cooling" }
    ]
  };
}

export function getTemplatePreviewContent() {
  return {
    templateId: "x-ray-scanner",
    title: "Hardware X-Ray",
    instructions: "Scan the computer case and reveal what is inside.",
    cards: [
      { id: "xray-preview-1", front: "Motherboard", back: "Connects CPU, memory, storage, and expansion cards.", hint: "Board" },
      { id: "xray-preview-2", front: "CPU", back: "Executes instructions and processes data.", hint: "Chip" },
      { id: "xray-preview-3", front: "RAM", back: "Temporary memory used while apps are open.", hint: "Memory" },
      { id: "xray-preview-4", front: "SSD", back: "Fast storage for files and software.", hint: "Storage" }
    ]
  };
}

function attachScannerHandlers(container, activityContext, cards) {
  var lens = container.querySelector(".oqu-xray-lens");
  var readout = container.querySelector(".oqu-xray-readout");
  var stage = container.querySelector(".oqu-xray-object");
  var onMove = function (event) {
    var rect = stage ? stage.getBoundingClientRect() : null;
    if (!rect || !lens) return;
    lens.style.left = Math.max(20, Math.min(rect.width - 20, event.clientX - rect.left)) + "px";
    lens.style.top = Math.max(20, Math.min(rect.height - 20, event.clientY - rect.top)) + "px";
  };
  var onClick = function (event) {
    var part = event.target.closest(".oqu-xray-part");
    var index = 0;
    var card = null;
    if (!part) return;
    index = Number(part.getAttribute("data-card-index") || 0);
    card = cards[index] || {};
    part.classList.add("is-scanned");
    if (readout) readout.innerHTML = '<strong>' + escapeHtml(card.front || "Part") + '</strong><span>' + escapeHtml(card.back || "Revealed") + '</span>';
    activityContext.onInteraction({ type: "card_revealed", cardId: part.getAttribute("data-card-id") || "", cardIndex: index, templateId: "x-ray-scanner" });
  };
  activityContext.templateState.onMove = onMove;
  activityContext.templateState.onClick = onClick;
  container.addEventListener("pointermove", onMove);
  container.addEventListener("click", onClick);
}

function buildXRayScannerCss() {
  return ""
    + ".oqu-xray-scanner{width:min(850px,100%);margin:0 auto;display:grid;gap:16px;color:#0f172a}.oqu-xray-scanner header span{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.14em;color:#7c3aed}.oqu-xray-scanner h2{margin:4px 0;font-size:28px;font-weight:950}.oqu-xray-scanner p{margin:0;color:#64748b;font-weight:750}"
    + ".oqu-xray-stage{border:1px solid #ddd6fe;border-radius:24px;background:radial-gradient(circle at center,#f5f3ff,#eef2ff);padding:22px}.oqu-xray-object{position:relative;min-height:360px;border-radius:28px;background:linear-gradient(135deg,#1e293b,#334155);overflow:hidden;box-shadow:inset 0 0 70px rgba(14,165,233,.22)}.oqu-xray-screen{position:absolute;inset:42px;border:2px solid rgba(125,211,252,.35);border-radius:28px;background:repeating-linear-gradient(90deg,rgba(125,211,252,.05) 0 12px,transparent 12px 24px)}"
    + ".oqu-xray-lens{position:absolute;width:148px;height:148px;border-radius:50%;transform:translate(-50%,-50%);left:50%;top:50%;border:2px solid #67e8f9;background:rgba(103,232,249,.16);box-shadow:0 0 0 999px rgba(15,23,42,.18),0 0 34px rgba(103,232,249,.55);pointer-events:none}.oqu-xray-lens span{position:absolute;left:50%;top:0;bottom:0;width:2px;background:#67e8f9}.oqu-xray-part{position:absolute;border:1px solid rgba(103,232,249,.65);border-radius:16px;background:rgba(15,23,42,.72);color:#e0f2fe;padding:10px;display:grid;gap:3px;cursor:pointer;min-width:122px}.oqu-xray-part strong{font-size:13px}.oqu-xray-part span{font-size:10px;font-weight:900;color:#67e8f9;text-transform:uppercase}.oqu-xray-part.is-scanned{background:#ecfeff;color:#155e75}.oqu-xray-part-0{left:12%;top:16%}.oqu-xray-part-1{right:18%;top:18%}.oqu-xray-part-2{left:36%;top:46%}.oqu-xray-part-3{right:12%;bottom:18%}.oqu-xray-part-4{left:12%;bottom:16%}.oqu-xray-part-5{left:50%;bottom:8%}"
    + ".oqu-xray-readout{border:1px solid #ddd6fe;background:#faf5ff;border-radius:18px;padding:16px;display:grid;gap:6px}.oqu-xray-readout strong{font-size:18px}.oqu-xray-readout span{color:#6d28d9;font-weight:800;line-height:1.5}@media(max-width:720px){.oqu-xray-object{min-height:520px}.oqu-xray-part{position:relative;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;margin:12px}.oqu-xray-lens{display:none}}";
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}
