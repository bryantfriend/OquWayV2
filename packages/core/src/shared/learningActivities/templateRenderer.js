export function renderLearningActivityTemplate(activityContext, options) {
  var safeContext = activityContext && typeof activityContext === "object" ? activityContext : {};
  var safeOptions = options && typeof options === "object" ? options : {};
  var container = safeContext.container || null;
  var content = safeContext.content && typeof safeContext.content === "object" ? safeContext.content : {};
  var layout = readText(safeOptions.layout, "studio-card");
  var interaction = readText(safeOptions.interaction, "choice");
  var accent = readText(safeOptions.accent, "#2563eb");
  var html = "";

  if (!container) {
    return;
  }

  html += '<style>' + buildTemplateCss(accent) + '</style>';
  html += '<article class="oqu-template-activity oqu-template-layout-' + escapeClass(layout) + '" style="--oqu-template-accent:' + escapeHtml(accent) + '">';
  html += buildHeader(content, safeOptions);
  html += buildBody(content, safeOptions, interaction);
  html += buildFooter(content, safeOptions, interaction);
  html += '</article>';

  container.innerHTML = html;
  attachTemplateEvents(container, safeContext, safeOptions, interaction);
}

export function destroyLearningActivityTemplate(activityContext) {
  if (!activityContext || !activityContext.container || !activityContext.templateState) {
    return;
  }

  if (activityContext.templateState.onClick) {
    activityContext.container.removeEventListener("click", activityContext.templateState.onClick);
  }
  if (activityContext.templateState.onDragStart) {
    activityContext.container.removeEventListener("dragstart", activityContext.templateState.onDragStart);
    activityContext.container.removeEventListener("dragover", activityContext.templateState.onDragOver);
    activityContext.container.removeEventListener("dragleave", activityContext.templateState.onDragLeave);
    activityContext.container.removeEventListener("drop", activityContext.templateState.onDrop);
    activityContext.container.removeEventListener("dragend", activityContext.templateState.onDragEnd);
  }
}

export function mergeTemplateContent(templateId, defaultContent, patch) {
  return Object.assign(
    { templateId: templateId },
    defaultContent && typeof defaultContent === "object" ? defaultContent : {},
    patch && typeof patch === "object" ? patch : {}
  );
}

function buildHeader(content, options) {
  var eyebrow = readText(options.eyebrow, readText(content.activityLabel, "Learning Activity"));
  var title = readTitle(content, options);
  var subtitle = readSubtitle(content, options);
  var html = "";

  html += '<header class="oqu-template-header">';
  html += '<div class="oqu-template-eyebrow">' + escapeHtml(eyebrow) + '</div>';
  html += '<h2>' + escapeHtml(title) + '</h2>';
  if (subtitle) {
    html += '<p>' + escapeHtml(subtitle) + '</p>';
  }
  html += '</header>';

  return html;
}

function buildBody(content, options, interaction) {
  if (interaction === "reflection") {
    return buildReflectionBody(content);
  }

  if (interaction === "text") {
    return buildTextResponseBody(content, options);
  }

  if (interaction === "media") {
    return buildMediaBody(content, options);
  }

  if (interaction === "terminal") {
    return buildTerminalBody(content);
  }

  if (interaction === "external") {
    return buildExternalTaskBody(content);
  }

  if (interaction === "drag") {
    return buildDragBody(content, options);
  }

  if (interaction === "reveal") {
    return buildRevealBody(content);
  }

  return buildChoiceBody(content, options);
}

function buildChoiceBody(content, options) {
  var items = readItems(content, options);
  var html = "";
  var index = 0;

  html += '<section class="oqu-template-board">';
  html += '<div class="oqu-template-choice-grid">';

  while (index < items.length) {
    html += '<button type="button" class="oqu-template-choice" data-choice-index="' + index + '">';
    html += '<span>' + escapeHtml(String(index + 1)) + '</span>';
    html += '<strong>' + escapeHtml(items[index]) + '</strong>';
    html += '</button>';
    index = index + 1;
  }

  html += '</div>';
  html += '</section>';

  return html;
}

function buildRevealBody(content) {
  var cards = Array.isArray(content.cards) ? content.cards : [];
  var items = cards.length > 0 ? cards : readItems(content, {});
  var html = "";
  var index = 0;

  html += '<section class="oqu-template-board">';
  html += '<div class="oqu-template-reveal-grid">';

  while (index < items.length) {
    var card = items[index];
    var front = typeof card === "string" ? card : readText(card.front, "Prompt");
    var back = typeof card === "string" ? "Revealed" : readText(card.back, readText(card.answer, "Answer"));
    html += '<button type="button" class="oqu-template-reveal-btn" data-choice-index="' + index + '">';
    html += '<span class="oqu-template-reveal-front">' + escapeHtml(front) + '</span>';
    html += '<span class="oqu-template-reveal-back" hidden>' + escapeHtml(back) + '</span>';
    html += '</button>';
    index = index + 1;
  }

  html += '</div>';
  html += '</section>';

  return html;
}

function buildReflectionBody(content) {
  var responseType = readText(content.responseType, "scale");
  var html = "";
  var index = 1;

  html += '<section class="oqu-template-board">';
  if (responseType === "scale") {
    html += '<div class="oqu-template-scale">';
    while (index <= 5) {
      html += '<button type="button" class="oqu-template-scale-btn" data-choice-index="' + index + '">' + index + '</button>';
      index = index + 1;
    }
    html += '</div>';
  } else {
    html += '<textarea class="oqu-template-response" placeholder="Write your response here"></textarea>';
  }
  html += '</section>';

  return html;
}

function buildTextResponseBody(content, options) {
  var prompt = readText(options.prompt, readText(content.prompt, readText(content.question, "Write a response.")));
  var html = "";

  html += '<section class="oqu-template-board">';
  html += '<p class="oqu-template-prompt">' + escapeHtml(prompt) + '</p>';
  html += '<textarea class="oqu-template-response" placeholder="Type your response"></textarea>';
  html += '</section>';

  return html;
}

function buildMediaBody(content, options) {
  var audioUrl = readText(content.audioUrl, "");
  var transcript = readText(content.transcript, readText(content.exampleSentence, ""));
  var html = "";

  html += '<section class="oqu-template-board">';
  if (audioUrl) {
    html += '<audio class="oqu-template-audio" controls src="' + escapeHtml(audioUrl) + '"></audio>';
  } else {
    html += '<div class="oqu-template-media-placeholder">' + escapeHtml(readText(options.mediaPlaceholder, "Media can be added in the editor.")) + '</div>';
  }
  if (transcript) {
    html += '<details class="oqu-template-details"><summary>Reference</summary><p>' + escapeHtml(transcript) + '</p></details>';
  }
  html += '</section>';

  return html;
}

function buildTerminalBody(content) {
  var code = readText(content.starterCode, readText(content.data, "{ ready: true }"));
  var html = "";

  html += '<section class="oqu-template-board oqu-template-terminal">';
  html += '<div class="oqu-template-terminal-bar"><span></span><span></span><span></span></div>';
  html += '<pre>' + escapeHtml(code) + '</pre>';
  html += '</section>';

  return html;
}

function buildExternalTaskBody(content) {
  var checklist = readItems(content, { sourceKey: "checklist" });
  var html = "";
  var index = 0;

  html += '<section class="oqu-template-board">';
  html += '<ul class="oqu-template-checklist">';
  while (index < checklist.length) {
    html += '<li><span></span>' + escapeHtml(checklist[index]) + '</li>';
    index = index + 1;
  }
  html += '</ul>';
  html += '<label class="oqu-template-filebox">Add proof<input type="file" class="oqu-template-file-input" multiple></label>';
  html += '<textarea class="oqu-template-response" placeholder="Optional note"></textarea>';
  html += '<div class="oqu-template-status" aria-live="polite"></div>';
  html += '</section>';

  return html;
}

function buildDragBody(content, options) {
  var items = readItems(content, options);
  var html = "";
  var index = 0;

  html += '<section class="oqu-template-board oqu-template-drag-board">';
  html += '<div class="oqu-template-drag-source" aria-label="Items to drag">';
  while (index < items.length) {
    html += '<button type="button" draggable="true" class="oqu-template-drag-card" data-choice-index="' + index + '">';
    html += '<span class="oqu-template-drag-handle">::</span>';
    html += '<strong>' + escapeHtml(items[index]) + '</strong>';
    html += '</button>';
    index = index + 1;
  }
  html += '</div>';
  html += '<div class="oqu-template-drop-grid">';
  html += '<div class="oqu-template-drop-zone" data-drop-zone="1"><span>Drop here</span></div>';
  html += '<div class="oqu-template-drop-zone" data-drop-zone="2"><span>Drop here</span></div>';
  html += '</div>';
  html += '<div class="oqu-template-status" aria-live="polite">Drag each card into a drop area. Click a card to move it if dragging is hard on this device.</div>';
  html += '</section>';

  return html;
}

function buildFooter(content, options, interaction) {
  var label = readText(options.completeLabel, interaction === "external" ? "Submit" : "Complete");
  var buttonClass = interaction === "external" ? "oqu-template-external-submit" : "oqu-template-complete-btn";
  var disabled = interaction === "drag" ? " disabled" : "";

  return '<footer class="oqu-template-footer"><button type="button" class="' + buttonClass + '"' + disabled + '>' + escapeHtml(label) + '</button></footer>';
}

function attachTemplateEvents(container, activityContext, options, interaction) {
  var onClick = function (event) {
    var choice = event.target.closest(".oqu-template-choice,.oqu-template-scale-btn");
    var dragCard = event.target.closest(".oqu-template-drag-card");
    var reveal = event.target.closest(".oqu-template-reveal-btn");
    var complete = event.target.closest(".oqu-template-complete-btn");
    var externalSubmit = event.target.closest(".oqu-template-external-submit");

    if (choice) {
      markSelected(choice);
      emitInteraction(activityContext, "choice_selected", choice);
      return;
    }

    if (dragCard && interaction === "drag") {
      moveDragCardByClick(dragCard, activityContext);
      return;
    }

    if (reveal) {
      reveal.classList.add("is-revealed");
      toggleReveal(reveal);
      emitInteraction(activityContext, "card_revealed", reveal);
      return;
    }

    if (complete) {
      completeActivity(activityContext, options);
      return;
    }

    if (externalSubmit) {
      submitExternalTask(container, activityContext, externalSubmit);
    }
  };

  if (!activityContext.templateState) {
    activityContext.templateState = {};
  }

  activityContext.templateState.onClick = onClick;
  container.addEventListener("click", onClick);

  if (interaction === "drag") {
    attachDragEvents(container, activityContext);
  }
}

function markSelected(choice) {
  var group = choice.parentNode;
  var options = group ? group.querySelectorAll(".oqu-template-choice,.oqu-template-scale-btn") : [];
  var index = 0;

  while (index < options.length) {
    options[index].classList.remove("is-selected");
    index = index + 1;
  }

  choice.classList.add("is-selected");
}

function toggleReveal(reveal) {
  var front = reveal.querySelector(".oqu-template-reveal-front");
  var back = reveal.querySelector(".oqu-template-reveal-back");

  if (front) {
    front.hidden = true;
  }
  if (back) {
    back.hidden = false;
  }
}

function emitInteraction(activityContext, type, element) {
  var detail = {
    type: type,
    activityType: readText(activityContext.activityType, ""),
    templateId: readText(activityContext.templateId, ""),
    choiceIndex: Number(element.getAttribute("data-choice-index") || 0)
  };

  if (typeof activityContext.onInteraction === "function") {
    activityContext.onInteraction(detail);
  }

  if (activityContext.callbacks && typeof activityContext.callbacks.onInteraction === "function") {
    activityContext.callbacks.onInteraction(detail);
  }
}

function completeActivity(activityContext, options) {
  var score = readNumber(options.score, 100);

  if (activityContext.callbacks && typeof activityContext.callbacks.onComplete === "function") {
    activityContext.callbacks.onComplete({
      success: true,
      score: score,
      data: {
        activityType: readText(activityContext.activityType, ""),
        templateId: readText(activityContext.templateId, "")
      }
    });
  }
}

async function submitExternalTask(container, activityContext, button) {
  var status = container.querySelector(".oqu-template-status");
  var filesInput = container.querySelector(".oqu-template-file-input");
  var noteInput = container.querySelector(".oqu-template-response");
  var files = filesInput && filesInput.files ? Array.prototype.slice.call(filesInput.files) : [];

  button.disabled = true;
  writeStatus(status, "Submitting...");

  try {
    if (activityContext.callbacks && typeof activityContext.callbacks.onExternalTaskSubmit === "function") {
      await activityContext.callbacks.onExternalTaskSubmit({
        config: activityContext.content || {},
        files: files,
        studentNote: noteInput ? noteInput.value : "",
        previousSubmission: null,
        previousSubmissionId: "",
        isResubmission: false
      });
    }

    writeStatus(status, "Submitted for review.");
    completeActivity(activityContext, { score: 100 });
  } catch (error) {
    button.disabled = false;
    writeStatus(status, error && error.message ? error.message : "Could not submit yet.");
  }
}

function attachDragEvents(container, activityContext) {
  var onDragStart = function (event) {
    var card = event.target.closest(".oqu-template-drag-card");

    if (!card) {
      return;
    }

    card.classList.add("is-dragging");
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.getAttribute("data-choice-index") || "");
    }
  };
  var onDragOver = function (event) {
    var zone = event.target.closest(".oqu-template-drop-zone");

    if (!zone) {
      return;
    }

    event.preventDefault();
    zone.classList.add("is-ready");
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  };
  var onDragLeave = function (event) {
    var zone = event.target.closest(".oqu-template-drop-zone");

    if (zone) {
      zone.classList.remove("is-ready");
    }
  };
  var onDrop = function (event) {
    var zone = event.target.closest(".oqu-template-drop-zone");
    var card = container.querySelector(".oqu-template-drag-card.is-dragging");

    if (!zone || !card) {
      return;
    }

    event.preventDefault();
    moveDragCard(card, zone, activityContext);
  };
  var onDragEnd = function () {
    var cards = container.querySelectorAll(".oqu-template-drag-card.is-dragging");
    var zones = container.querySelectorAll(".oqu-template-drop-zone.is-ready");
    var index = 0;

    while (index < cards.length) {
      cards[index].classList.remove("is-dragging");
      index = index + 1;
    }

    index = 0;
    while (index < zones.length) {
      zones[index].classList.remove("is-ready");
      index = index + 1;
    }
  };

  activityContext.templateState.onDragStart = onDragStart;
  activityContext.templateState.onDragOver = onDragOver;
  activityContext.templateState.onDragLeave = onDragLeave;
  activityContext.templateState.onDrop = onDrop;
  activityContext.templateState.onDragEnd = onDragEnd;

  container.addEventListener("dragstart", onDragStart);
  container.addEventListener("dragover", onDragOver);
  container.addEventListener("dragleave", onDragLeave);
  container.addEventListener("drop", onDrop);
  container.addEventListener("dragend", onDragEnd);
}

function moveDragCard(card, zone, activityContext) {
  var placeholder = zone.querySelector("span");

  if (placeholder) {
    placeholder.remove();
  }

  card.classList.remove("is-dragging");
  card.classList.add("is-dropped");
  zone.classList.remove("is-ready");
  zone.classList.add("has-card");
  zone.appendChild(card);
  emitInteraction(activityContext, "item_dropped", card);
  updateDragCompletion(card.closest(".oqu-template-activity"));
}

function moveDragCardByClick(card, activityContext) {
  var container = card.closest(".oqu-template-activity");
  var zones = container ? container.querySelectorAll(".oqu-template-drop-zone") : [];
  var zoneIndex = 0;

  while (zoneIndex < zones.length) {
    if (!zones[zoneIndex].querySelector(".oqu-template-drag-card")) {
      moveDragCard(card, zones[zoneIndex], activityContext);
      return;
    }
    zoneIndex = zoneIndex + 1;
  }

  if (zones.length > 0) {
    moveDragCard(card, zones[zones.length - 1], activityContext);
  }
}

function updateDragCompletion(container) {
  var sourceCards = container ? container.querySelectorAll(".oqu-template-drag-source .oqu-template-drag-card") : [];
  var completeButton = container ? container.querySelector(".oqu-template-complete-btn") : null;
  var status = container ? container.querySelector(".oqu-template-status") : null;

  if (!completeButton) {
    return;
  }

  if (sourceCards.length === 0) {
    completeButton.disabled = false;
    writeStatus(status, "All cards placed. Complete the activity when ready.");
  } else {
    completeButton.disabled = true;
    writeStatus(status, sourceCards.length + " card(s) left to place.");
  }
}

function writeStatus(status, text) {
  if (status) {
    status.textContent = text;
  }
}

function readTitle(content, options) {
  return readFirstText([
    options.title,
    content.title,
    content.heading,
    content.word,
    content.phrase,
    content.missionTitle,
    content.question,
    content.prompt,
    "Learning Activity"
  ]);
}

function readSubtitle(content, options) {
  return readFirstText([
    options.subtitle,
    content.instructions,
    content.bodyText,
    content.meaning,
    content.translation,
    content.missionSubtitle,
    content.calloutText,
    ""
  ]);
}

function readFirstText(values) {
  var index = 0;

  while (index < values.length) {
    if (typeof values[index] === "string" && values[index].length > 0) {
      return values[index];
    }
    index = index + 1;
  }

  return "";
}

function readItems(content, options) {
  var sourceKey = readText(options.sourceKey, "");
  var source = sourceKey ? content[sourceKey] : null;
  var fallback = [
    readText(content.usageExample, ""),
    readText(content.exampleSentence, ""),
    readText(content.successMessage, ""),
    readText(content.calloutText, "")
  ].filter(Boolean);

  if (source == null) {
    source = content.items || content.checklist || content.data || fallback;
  }

  if (Array.isArray(source)) {
    return source.map(function (item) {
      if (typeof item === "string") {
        return item;
      }
      if (item && typeof item === "object") {
        return readText(item.label, readText(item.text, readText(item.front, "")));
      }
      return "";
    }).filter(Boolean);
  }

  if (typeof source === "string" && source.length > 0) {
    return source.split(/\r?\n|,/).map(function (item) {
      return item.trim();
    }).filter(Boolean);
  }

  return ["Try it", "Check", "Reflect"];
}

function buildTemplateCss(accent) {
  return ""
    + ".oqu-template-activity{width:min(820px,100%);margin:0 auto;border:1px solid #dbeafe;border-radius:8px;background:#fff;color:#0f172a;overflow:hidden;box-shadow:0 18px 40px rgba(15,23,42,.08)}"
    + ".oqu-template-layout-field-lab{background:#f8fafc}.oqu-template-layout-story-path{background:#fff7ed}.oqu-template-layout-skill-sprint{background:#f0fdf4}.oqu-template-layout-terminal-run{background:#0f172a;color:#e2e8f0;border-color:#334155}.oqu-template-layout-island-board{background:#ecfeff}.oqu-template-layout-reflection-journal{background:#faf5ff}.oqu-template-layout-task-brief{background:#f8fafc}"
    + ".oqu-template-header{padding:22px 24px 14px;border-bottom:1px solid rgba(148,163,184,.25)}.oqu-template-eyebrow{display:inline-flex;background:color-mix(in srgb,var(--oqu-template-accent) 12%,white);color:var(--oqu-template-accent);border-radius:999px;padding:5px 10px;font-size:11px;font-weight:900;text-transform:uppercase}.oqu-template-header h2{margin:12px 0 6px;font-size:28px;line-height:1.1;font-weight:950}.oqu-template-header p{margin:0;color:#64748b;font-weight:700;line-height:1.5}"
    + ".oqu-template-board{padding:22px 24px;display:grid;gap:14px}.oqu-template-choice-grid,.oqu-template-reveal-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.oqu-template-choice,.oqu-template-scale-btn,.oqu-template-reveal-btn{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:14px;cursor:pointer;color:#0f172a;font:inherit;transition:transform .15s ease,border-color .15s ease,background .15s ease}.oqu-template-choice{display:grid;gap:8px;text-align:left}.oqu-template-choice span{width:28px;height:28px;border-radius:999px;background:var(--oqu-template-accent);color:#fff;display:grid;place-items:center;font-weight:900}.oqu-template-choice strong{font-size:14px;line-height:1.3}.oqu-template-choice:hover,.oqu-template-scale-btn:hover,.oqu-template-reveal-btn:hover{transform:translateY(-1px);border-color:var(--oqu-template-accent)}.oqu-template-choice.is-selected,.oqu-template-scale-btn.is-selected,.oqu-template-reveal-btn.is-revealed{background:color-mix(in srgb,var(--oqu-template-accent) 10%,white);border-color:var(--oqu-template-accent)}"
    + ".oqu-template-reveal-btn{min-height:130px;display:grid;place-items:center;text-align:center;font-weight:900}.oqu-template-reveal-back{color:var(--oqu-template-accent)}.oqu-template-scale{display:flex;gap:10px;justify-content:center}.oqu-template-scale-btn{width:54px;height:54px;border-radius:999px;font-weight:950}.oqu-template-response{width:100%;min-height:96px;border:1px solid #cbd5e1;border-radius:8px;padding:14px;font:inherit;box-sizing:border-box}.oqu-template-prompt{margin:0;color:#334155;font-weight:800}.oqu-template-audio{width:100%}.oqu-template-media-placeholder,.oqu-template-filebox{border:2px dashed #cbd5e1;border-radius:8px;padding:22px;text-align:center;color:#64748b;background:#f8fafc;font-weight:800}.oqu-template-filebox{display:block;cursor:pointer}.oqu-template-filebox input{display:none}.oqu-template-details{border:1px solid #e2e8f0;border-radius:8px;background:#fff;padding:12px}.oqu-template-details summary{cursor:pointer;font-weight:900;color:var(--oqu-template-accent)}.oqu-template-details p{margin:10px 0 0;color:#334155;line-height:1.5}.oqu-template-terminal{background:#020617;border-color:#334155;color:#e2e8f0}.oqu-template-terminal-bar{display:flex;gap:6px}.oqu-template-terminal-bar span{width:10px;height:10px;border-radius:999px;background:#38bdf8}.oqu-template-terminal pre{margin:0;overflow:auto;white-space:pre-wrap;font-size:13px;line-height:1.5}.oqu-template-checklist{list-style:none;margin:0;padding:0;display:grid;gap:10px}.oqu-template-checklist li{display:flex;gap:10px;align-items:flex-start;font-weight:800;color:#334155}.oqu-template-checklist span{width:18px;height:18px;border-radius:999px;background:var(--oqu-template-accent);margin-top:2px;flex:0 0 auto}.oqu-template-status{min-height:20px;color:#2563eb;font-weight:800}.oqu-template-footer{padding:0 24px 24px}.oqu-template-footer button{width:100%;border:0;border-radius:8px;background:var(--oqu-template-accent);color:#fff;padding:14px 18px;font-weight:950;cursor:pointer;box-shadow:0 12px 22px color-mix(in srgb,var(--oqu-template-accent) 24%,transparent)}.oqu-template-footer button:disabled{opacity:.7;cursor:not-allowed}"
    + "@media(max-width:720px){.oqu-template-choice-grid,.oqu-template-reveal-grid{grid-template-columns:1fr}.oqu-template-header h2{font-size:23px}.oqu-template-scale{flex-wrap:wrap}.oqu-template-scale-btn{width:48px;height:48px}}";
}

function readText(value, fallbackText) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  return fallbackText || "";
}

function readNumber(value, fallbackNumber) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return fallbackNumber;
}

function escapeClass(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "-");
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
