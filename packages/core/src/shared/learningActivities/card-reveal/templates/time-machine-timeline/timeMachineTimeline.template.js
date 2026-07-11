export function renderTemplate(activityContext) {
  var container = activityContext && activityContext.container ? activityContext.container : null;
  var content = activityContext && activityContext.content ? activityContext.content : {};
  var cards = Array.isArray(content.cards) ? content.cards : [];
  var html = "";

  if (!container) return;

  html += '<style>' + buildTimeMachineTimelineCss() + '</style>';
  html += '<article class="oqu-time-machine"><header><span>Timeline Reveal</span><h2>' + escapeHtml(content.title || "Time Machine Timeline") + '</h2><p>' + escapeHtml(content.instructions || "Unlock each event to travel through the sequence.") + '</p></header>';
  html += '<section class="oqu-time-track">';
  cards.forEach(function (card, index) {
    html += '<button type="button" class="oqu-time-node" data-card-id="' + escapeHtml(card.id) + '" data-card-index="' + index + '"' + (index > 0 ? ' disabled' : '') + '><span>' + escapeHtml(card.front) + '</span><strong>' + (index === 0 ? 'Start' : 'Locked') + '</strong></button>';
  });
  html += '</section><aside class="oqu-time-readout"><strong>Time machine ready</strong><span>Start with the first event. Each reveal unlocks the next milestone.</span></aside></article>';

  container.innerHTML = html;
  attachTimelineClicks(container, activityContext, cards);
}

export function destroyTemplate(activityContext) {
  if (activityContext && activityContext.templateState && activityContext.templateState.onClick && activityContext.container) {
    activityContext.container.removeEventListener("click", activityContext.templateState.onClick);
  }
}

export function getTemplateDefaultContent() {
  return {
    templateId: "time-machine-timeline",
    title: "Timeline Reveal",
    instructions: "Unlock the events in order.",
    cards: [
      { id: "time-1", front: "First", back: "The first milestone begins the story.", hint: "Step 1" },
      { id: "time-2", front: "Next", back: "The next milestone changes what happens.", hint: "Step 2" },
      { id: "time-3", front: "Result", back: "The final milestone shows the result.", hint: "Step 3" }
    ]
  };
}

export function getTemplatePreviewContent() {
  return {
    templateId: "time-machine-timeline",
    title: "Evolution of Computers",
    instructions: "Unlock each milestone in the history of computers.",
    cards: [
      { id: "time-preview-1", front: "Abacus", back: "An early tool for calculation and counting.", hint: "Ancient" },
      { id: "time-preview-2", front: "Mechanical Calculators", back: "Machines began helping people perform arithmetic.", hint: "Machines" },
      { id: "time-preview-3", front: "Electronic Computers", back: "Electronic components made computers faster and more flexible.", hint: "Electronic" },
      { id: "time-preview-4", front: "Personal Computers", back: "Computers became common in homes, schools, and offices.", hint: "Modern" }
    ]
  };
}

function attachTimelineClicks(container, activityContext, cards) {
  var readout = container.querySelector(".oqu-time-readout");
  var onClick = function (event) {
    var node = event.target.closest(".oqu-time-node");
    var index = 0;
    var card = null;
    var next = null;
    if (!node || node.disabled) return;
    index = Number(node.getAttribute("data-card-index") || 0);
    card = cards[index] || {};
    node.classList.add("is-unlocked");
    node.querySelector("strong").textContent = "Unlocked";
    next = container.querySelector('.oqu-time-node[data-card-index="' + (index + 1) + '"]');
    if (next) {
      next.disabled = false;
      next.querySelector("strong").textContent = "Next";
    }
    if (readout) readout.innerHTML = '<strong>' + escapeHtml(card.front || "Event") + '</strong><span>' + escapeHtml(card.back || "Revealed") + '</span>';
    activityContext.onInteraction({ type: "card_revealed", cardId: node.getAttribute("data-card-id") || "", cardIndex: index, templateId: "time-machine-timeline" });
  };
  activityContext.templateState.onClick = onClick;
  container.addEventListener("click", onClick);
}

function buildTimeMachineTimelineCss() {
  return ""
    + ".oqu-time-machine{width:min(860px,100%);margin:0 auto;display:grid;gap:16px;color:#0f172a}.oqu-time-machine header span{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.14em;color:#4f46e5}.oqu-time-machine h2{margin:4px 0;font-size:28px;font-weight:950}.oqu-time-machine p{margin:0;color:#64748b;font-weight:750}.oqu-time-track{position:relative;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:14px;border:1px solid #c7d2fe;border-radius:24px;background:linear-gradient(135deg,#eef2ff,#f8fafc);padding:24px}.oqu-time-track:before{content:'';position:absolute;left:38px;right:38px;top:50%;height:4px;background:#a5b4fc;border-radius:99px}.oqu-time-node{position:relative;z-index:1;min-height:132px;border:1px solid #c7d2fe;border-radius:18px;background:#fff;color:#312e81;padding:14px;display:grid;gap:8px;place-items:center;cursor:pointer;box-shadow:0 12px 24px rgba(79,70,229,.12)}.oqu-time-node:disabled{cursor:not-allowed;opacity:.55;filter:grayscale(.4)}.oqu-time-node span{font-size:16px;font-weight:950;text-align:center}.oqu-time-node strong{font-size:10px;text-transform:uppercase;letter-spacing:.12em;background:#eef2ff;color:#4f46e5;border-radius:99px;padding:6px 10px}.oqu-time-node.is-unlocked{background:#ecfdf5;border-color:#34d399;color:#065f46}.oqu-time-node.is-unlocked strong{background:#dcfce7;color:#047857}.oqu-time-readout{border:1px solid #c7d2fe;background:#eef2ff;border-radius:18px;padding:16px;display:grid;gap:6px}.oqu-time-readout strong{font-size:18px}.oqu-time-readout span{color:#4338ca;font-weight:800;line-height:1.5}@media(max-width:680px){.oqu-time-track:before{display:none}.oqu-time-track{grid-template-columns:1fr}}";
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}
