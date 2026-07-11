export function renderMiniGameTemplate(activityContext, options) {
  var ctx = activityContext && typeof activityContext === "object" ? activityContext : {};
  var opts = options && typeof options === "object" ? options : {};
  var container = ctx.container || null;
  var content = ctx.content && typeof ctx.content === "object" ? ctx.content : {};
  var archetype = text(opts.archetype, "quest-map");
  var accent = text(opts.accent, "#2563eb");
  if (!container) return;
  container.innerHTML = '<style>' + css() + '</style>'
    + '<article class="oqu-mini-game oqu-mini-' + cls(archetype) + '" style="--oqu-mini-accent:' + esc(accent) + '">'
    + header(content, opts) + body(content, opts, archetype) + footer(opts, archetype) + '</article>';
  bind(container, ctx, opts, archetype);
}

export function destroyMiniGameTemplate(activityContext) {
  var ctx = activityContext || {};
  var c = ctx.container;
  var s = ctx.templateState || {};
  if (!c) return;
  if (s.click) c.removeEventListener("click", s.click);
  if (s.move) c.removeEventListener("pointermove", s.move);
  if (s.dragstart) {
    c.removeEventListener("dragstart", s.dragstart);
    c.removeEventListener("dragover", s.dragover);
    c.removeEventListener("dragleave", s.dragleave);
    c.removeEventListener("drop", s.drop);
    c.removeEventListener("dragend", s.dragend);
  }
}

export function mergeTemplateContent(templateId, defaultContent, patch) {
  return Object.assign({ templateId: templateId }, defaultContent || {}, patch || {});
}

function header(content, opts) {
  var eyebrow = text(opts.eyebrow, text(content.activityLabel, "Learning Activity"));
  var title = first([opts.title, content.title, content.heading, content.word, content.phrase, content.missionTitle, content.question, content.prompt, "Learning Activity"]);
  var sub = first([opts.subtitle, content.instructions, content.bodyText, content.meaning, content.translation, content.missionSubtitle, content.calloutText, ""]);
  return '<header class="oqu-mini-head"><div>' + esc(eyebrow) + '</div><h2>' + esc(title) + '</h2>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</header>';
}

function body(content, opts, type) {
  if (type === "lab-switchboard") return lab(content, opts);
  if (type === "evidence-board") return evidence(content, opts);
  if (type === "drag-bays") return drag(content, opts);
  if (type === "terminal-challenge") return terminal(content, opts);
  if (type === "scanner-grid") return scanner(content, opts);
  if (type === "boss-battle") return boss(content, opts);
  if (type === "timeline-unlock") return timeline(content, opts);
  if (type === "builder-workbench") return builder(content, opts);
  if (type === "media-mixer") return media(content, opts);
  if (type === "upload-studio") return upload(content, opts);
  if (type === "emoji-checkin") return emojiCheckin(content, opts);
  if (type === 'mood-meter') return mood(content, opts);
  if (type === "dialog-builder") return dialog(content, opts);
  if (type === "roadmap-trail") return roadmap(content, opts);
  if (type === "card-stack") return stack(content, opts);
  if (type === "quiz-show") return quiz(content, opts);
  if (type === "matrix-grid") return matrix(content, opts);
  return quest(content, opts);
}

function quest(content, opts) {
  return '<section class="oqu-mini-board oqu-quest"><div class="route"></div>' + items(content, opts).map(function (item, i) {
    return '<button type="button" data-mini="select"><span>' + (i + 1) + '</span><strong>' + esc(item) + '</strong><small>' + esc(text(opts.nodeLabel, "Explore")) + '</small></button>';
  }).join("") + '<output>Choose a stop on the map.</output></section>';
}

function lab(content, opts) {
  return '<section class="oqu-mini-board oqu-lab"><div class="screen"><strong>System check</strong><span>Turn on each module.</span></div><div class="grid3">' + items(content, opts).map(function (item) {
    return '<button type="button" data-mini="toggle"><span></span><strong>' + esc(item) + '</strong></button>';
  }).join("") + '</div><output>0 modules active.</output></section>';
}

function evidence(content, opts) {
  return '<section class="oqu-mini-board oqu-evidence"><div class="thread"></div>' + cards(content, opts).map(function (card, i) {
    return '<button type="button" data-mini="reveal"><small>Clue ' + (i + 1) + '</small><strong>' + esc(card.front) + '</strong><span hidden>' + esc(card.back) + '</span></button>';
  }).join("") + '<output>Open clues to build the case.</output></section>';
}

function drag(content, opts) {
  var zones = Array.isArray(opts.zones) && opts.zones.length ? opts.zones : ["Match", "Review", "Apply"];
  return '<section class="oqu-mini-board oqu-drag"><div class="source">' + items(content, opts).map(function (item, i) {
    return '<button type="button" draggable="true" class="drag-card" data-mini="drag" data-index="' + i + '"><span>::</span><strong>' + esc(item) + '</strong></button>';
  }).join("") + '</div><div class="drops">' + zones.map(function (zone) {
    return '<div class="drop"><span>' + esc(zone) + '</span></div>';
  }).join("") + '</div><output>Place each card into a bay. Click works too.</output></section>';
}

function terminal(content, opts) {
  var code = text(content.starterCode, text(content.data, "run lesson.check()"));
  return '<section class="oqu-mini-board oqu-terminal"><div class="bar"><span></span><span></span><span></span></div><pre>' + esc(code) + '</pre><div class="grid3">' + items(content, opts).map(function (item) {
    return '<button type="button" data-mini="select">' + esc(item) + '</button>';
  }).join("") + '</div><output>Select a command to run the mission.</output></section>';
}

function scanner(content, opts) {
  return '<section class="oqu-mini-board oqu-scanner"><div class="lens"></div><div class="field">' + cards(content, opts).map(function (card, i) {
    return '<button type="button" class="dot d' + (i % 6) + '" data-mini="reveal"><strong>' + esc(card.front) + '</strong><span hidden>' + esc(card.back) + '</span></button>';
  }).join("") + '</div><output>Move the scanner and inspect each signal.</output></section>';
}

function boss(content, opts) {
  return '<section class="oqu-mini-board oqu-boss"><div class="boss"><strong>' + esc(text(opts.bossName, "Challenge Boss")) + '</strong><div class="hp"><span style="width:100%"></span></div><small>Choose moves to lower the meter.</small></div><div class="grid2">' + items(content, opts).map(function (item, i) {
    return '<button type="button" data-mini="attack"><span>Move ' + (i + 1) + '</span><strong>' + esc(item) + '</strong></button>';
  }).join("") + '</div><output>Choose a move.</output></section>';
}

function timeline(content, opts) {
  return '<section class="oqu-mini-board oqu-time">' + items(content, opts).map(function (item, i) {
    return '<button type="button" data-mini="unlock"' + (i > 0 ? ' disabled' : '') + '><span>' + (i + 1) + '</span><strong>' + esc(item) + '</strong><small>' + (i ? 'Locked' : 'Start') + '</small></button>';
  }).join("") + '<output>Unlock the sequence one step at a time.</output></section>';
}
function builder(content, opts) {
  return '<section class="oqu-mini-board oqu-builder"><div class="tools">' + items(content, opts).map(function (item) {
    return '<button type="button" data-mini="toggle"><span></span>' + esc(item) + '</button>';
  }).join("") + '</div><textarea placeholder="Build your answer here"></textarea><output>Use the tools, then write your response.</output></section>';
}

function media(content, opts) {
  var transcript = first([content.transcript, content.exampleSentence, content.usageExample, content.bodyText, "Listen for the most important clue."]);
  return '<section class="oqu-mini-board oqu-media"><div class="player"><button type="button" data-mini="toggle">Play sample</button><div class="wave"><span></span><span></span><span></span><span></span><span></span></div></div><div class="chips">' + transcript.split(/\s+/).slice(0, 12).map(function (word) {
    return '<button type="button" data-mini="select">' + esc(word) + '</button>';
  }).join("") + '</div><details><summary>Transcript</summary><p>' + esc(transcript) + '</p></details></section>';
}

function upload(content, opts) {
  return '<section class="oqu-mini-board oqu-upload"><ol>' + checklist(content, opts).map(function (item) {
    return '<li>' + esc(item) + '</li>';
  }).join("") + '</ol><label class="filebox">Attach student work<input type="file" multiple></label><textarea placeholder="Add a note for the teacher"></textarea><output></output></section>';
}

function mood(content, opts) {
  return '<section class="oqu-mini-board oqu-mood"><div class="meter">' + ["Not yet", "A little", "Getting it", "Strong", "Teach it"].map(function (label, i) {
    return '<button type="button" data-mini="select"><span>' + (i + 1) + '</span><strong>' + esc(label) + '</strong></button>';
  }).join("") + '</div><textarea placeholder="What made you choose that level?"></textarea></section>';
}


function emojiCheckin(content, opts) {
  return '<section class="oqu-mini-board oqu-mood"><div class="meter">' + ["Happy", "Okay", "Thinking", "Stuck", "Confident"].map(function (label, i) {
    var faces = ["😄", "🙂", "🤔", "😟", "🔥"];
    return '<button type="button" data-mini="select"><span>' + faces[i] + '</span><strong>' + esc(label) + '</strong></button>';
  }).join("") + '</div><textarea placeholder="Why did you choose that emoji?"></textarea></section>';
}
function dialog(content, opts) {
  return '<section class="oqu-mini-board oqu-dialog"><div>' + items(content, opts).map(function (item, i) {
    return '<button type="button" data-mini="select"><small>Line ' + (i + 1) + '</small><strong>' + esc(item) + '</strong></button>';
  }).join("") + '</div><output>Choose the line you would say next.</output></section>';
}

function roadmap(content, opts) {
  return '<section class="oqu-mini-board oqu-road">' + items(content, opts).map(function (item, i) {
    return '<button type="button" data-mini="unlock"' + (i > 0 ? ' disabled' : '') + '><span>' + (i + 1) + '</span><strong>' + esc(item) + '</strong></button>';
  }).join("") + '<div class="progress"><span style="width:0%"></span></div></section>';
}

function stack(content, opts) {
  return '<section class="oqu-mini-board oqu-stack">' + cards(content, opts).map(function (card, i) {
    return '<button type="button" data-mini="reveal" style="--i:' + i + '"><small>Card ' + (i + 1) + '</small><strong>' + esc(card.front) + '</strong><span hidden>' + esc(card.back) + '</span></button>';
  }).join("") + '<output>Flip through the stack.</output></section>';
}

function quiz(content, opts) {
  return '<section class="oqu-mini-board oqu-quiz"><div class="podium"><strong>' + esc(first([content.question, content.title, opts.title, "Choose the best answer"])) + '</strong></div><div class="grid2">' + items(content, opts).map(function (item, i) {
    return '<button type="button" data-mini="select"><span>' + String.fromCharCode(65 + i) + '</span><strong>' + esc(item) + '</strong></button>';
  }).join("") + '</div></section>';
}

function matrix(content, opts) {
  return '<section class="oqu-mini-board oqu-matrix"><div class="grid3">' + items(content, opts).map(function (item) {
    return '<button type="button" data-mini="toggle"><span></span><strong>' + esc(item) + '</strong></button>';
  }).join("") + '</div><output>Select every tile that applies.</output></section>';
}

function footer(opts, type) {
  var action = type === "upload-studio" ? "submit" : "complete";
  return '<footer><button type="button" data-mini="' + action + '">' + esc(text(opts.completeLabel, action === "submit" ? "Submit for review" : "Complete activity")) + '</button></footer>';
}

function bind(container, ctx, opts, type) {
  var count = 0;
  var click = function (event) {
    var el = event.target.closest("[data-mini]");
    var action = el ? el.getAttribute("data-mini") : "";
    if (!el) return;
    if (action === "complete") return complete(ctx, opts);
    if (action === "submit") return submit(container, ctx, el);
    if (action === "drag") return clickDrag(container, el, ctx);
    if (action === "unlock") { count += 1; unlock(container, el, count); return emit(ctx, "step_unlocked", el); }
    if (action === "attack") { count += 1; el.classList.add("is-selected"); hp(container, count); return emit(ctx, "attack_selected", el); }
    if (action === "reveal") { el.classList.add("is-revealed"); reveal(container, el); return emit(ctx, "item_revealed", el); }
    if (action === "toggle") { el.classList.toggle("is-selected"); status(container); return emit(ctx, "item_toggled", el); }
    if (action === "select") { select(container, el); return emit(ctx, "item_selected", el); }
  };
  ctx.templateState = ctx.templateState || {};
  ctx.templateState.click = click;
  container.addEventListener("click", click);
  if (type === "scanner-grid") moveLens(container, ctx);
  if (type === "drag-bays") dragEvents(container, ctx);
}

function select(container, el) {
  Array.prototype.forEach.call(el.parentNode ? el.parentNode.querySelectorAll("[data-mini='select']") : [], function (node) { node.classList.remove("is-selected"); });
  el.classList.add("is-selected");
  out(container, clean(el));
}

function reveal(container, el) {
  var hidden = el.querySelector("[hidden]");
  if (hidden) hidden.hidden = false;
  out(container, clean(hidden || el));
}

function unlock(container, el, count) {
  var next = container.querySelector("[data-mini='unlock'][disabled]");
  el.classList.add("is-selected");
  el.disabled = true;
  if (next) next.disabled = false;
  var total = container.querySelectorAll("[data-mini='unlock']").length || 1;
  var bar = container.querySelector(".progress span");
  if (bar) bar.style.width = Math.min(100, Math.round(count / total * 100)) + "%";
  out(container, clean(el));
}

function hp(container, count) {
  var total = container.querySelectorAll("[data-mini='attack']").length || 1;
  var bar = container.querySelector(".hp span");
  var left = Math.max(0, 100 - Math.round(count / total * 100));
  if (bar) bar.style.width = left + "%";
  out(container, left === 0 ? "Challenge cleared." : left + "% challenge remaining.");
}

function status(container) {
  var output = container.querySelector("output");
  if (output) output.textContent = container.querySelectorAll(".is-selected").length + " selected.";
}

function complete(ctx, opts) {
  if (ctx.callbacks && typeof ctx.callbacks.onComplete === "function") ctx.callbacks.onComplete({ success: true, score: typeof opts.score === "number" ? opts.score : 100, data: { activityType: text(ctx.activityType, ""), templateId: text(ctx.templateId, "") } });
}

async function submit(container, ctx, button) {
  var output = container.querySelector("output");
  var input = container.querySelector("input[type='file']");
  var note = container.querySelector("textarea");
  var files = input && input.files ? Array.prototype.slice.call(input.files) : [];
  button.disabled = true;
  if (output) output.textContent = "Submitting...";
  try {
    if (ctx.callbacks && typeof ctx.callbacks.onExternalTaskSubmit === "function") await ctx.callbacks.onExternalTaskSubmit({ config: ctx.content || {}, files: files, studentNote: note ? note.value : "", previousSubmission: null, previousSubmissionId: "", isResubmission: false });
    if (output) output.textContent = "Submitted for review.";
    complete(ctx, { score: 100 });
  } catch (error) {
    button.disabled = false;
    if (output) output.textContent = error && error.message ? error.message : "Could not submit yet.";
  }
}
function moveLens(container, ctx) {
  var move = function (event) {
    var area = event.target.closest(".oqu-scanner");
    var lens = container.querySelector(".lens");
    var rect = area ? area.getBoundingClientRect() : null;
    if (!lens || !rect) return;
    lens.style.left = Math.max(0, event.clientX - rect.left - 44) + "px";
    lens.style.top = Math.max(0, event.clientY - rect.top - 44) + "px";
  };
  ctx.templateState.move = move;
  container.addEventListener("pointermove", move);
}

function dragEvents(container, ctx) {
  var start = function (event) {
    var card = event.target.closest(".drag-card");
    if (!card) return;
    card.classList.add("dragging");
    if (event.dataTransfer) event.dataTransfer.setData("text/plain", card.getAttribute("data-index") || "");
  };
  var over = function (event) {
    var zone = event.target.closest(".drop");
    if (!zone) return;
    event.preventDefault();
    zone.classList.add("ready");
  };
  var leave = function (event) {
    var zone = event.target.closest(".drop");
    if (zone) zone.classList.remove("ready");
  };
  var drop = function (event) {
    var zone = event.target.closest(".drop");
    var card = container.querySelector(".drag-card.dragging");
    if (!zone || !card) return;
    event.preventDefault();
    place(card, zone, ctx);
  };
  var end = function () {
    Array.prototype.forEach.call(container.querySelectorAll(".dragging,.ready"), function (node) { node.classList.remove("dragging"); node.classList.remove("ready"); });
  };
  ctx.templateState.dragstart = start;
  ctx.templateState.dragover = over;
  ctx.templateState.dragleave = leave;
  ctx.templateState.drop = drop;
  ctx.templateState.dragend = end;
  container.addEventListener("dragstart", start);
  container.addEventListener("dragover", over);
  container.addEventListener("dragleave", leave);
  container.addEventListener("drop", drop);
  container.addEventListener("dragend", end);
}

function clickDrag(container, card, ctx) {
  var zones = container.querySelectorAll(".drop");
  for (var i = 0; i < zones.length; i += 1) if (!zones[i].querySelector(".drag-card")) return place(card, zones[i], ctx);
  if (zones.length) place(card, zones[zones.length - 1], ctx);
}

function place(card, zone, ctx) {
  var label = zone.querySelector("span");
  if (label) label.remove();
  card.classList.remove("dragging");
  card.classList.add("is-selected");
  zone.classList.add("filled");
  zone.classList.remove("ready");
  zone.appendChild(card);
  emit(ctx, "item_dropped", card);
}

function emit(ctx, type, el) {
  var detail = { type: type, activityType: text(ctx.activityType, ""), templateId: text(ctx.templateId, ""), choiceIndex: Number(el && el.getAttribute ? el.getAttribute("data-index") || 0 : 0), createdAt: new Date().toISOString() };
  if (typeof ctx.onInteraction === "function") ctx.onInteraction(detail);
  if (ctx.callbacks && typeof ctx.callbacks.onInteraction === "function") ctx.callbacks.onInteraction(detail);
}

function items(content, opts) {
  var key = text(opts.sourceKey, "");
  var source = key ? content[key] : null;
  var parsed = parse(content.data);
  if (source == null && parsed) source = parsed.choices || parsed.items || parsed.checkpoints || parsed.steps;
  if (source == null) source = content.items || content.checklist || content.data;
  if (Array.isArray(source)) return source.map(label).filter(Boolean);
  if (typeof source === "string" && source.length) return source.split(/\r?\n|,/).map(function (x) { return x.trim(); }).filter(Boolean);
  return [first([content.word, content.heading, content.missionTitle, content.prompt, "Concept"]), first([content.translation, content.calloutText, content.missionSubtitle, "Example"]), first([content.exampleSentence, content.successMessage, content.bodyText, "Apply"])].filter(Boolean);
}

function cards(content, opts) {
  if (Array.isArray(content.cards) && content.cards.length) return content.cards.map(function (card) { return { front: text(card.front, text(card.label, "Prompt")), back: text(card.back, text(card.answer, "Revealed")) }; });
  return items(content, opts).map(function (item, i) { return { front: item, back: first([content.translation, content.meaning, content.calloutText, content.successMessage, "Discovery " + (i + 1)]) }; });
}

function checklist(content, opts) {
  var list = content.checklist;
  if (Array.isArray(list)) return list.map(label).filter(Boolean);
  if (typeof list === "string" && list.length) return list.split(/\r?\n|,/).map(function (x) { return x.trim(); }).filter(Boolean);
  return items(content, opts);
}

function parse(value) { try { return typeof value === "string" && value.length ? JSON.parse(value) : null; } catch (error) { return null; } }
function label(item) { return typeof item === "string" ? item : item && typeof item === "object" ? first([item.label, item.text, item.front, item.title, item.name, ""]) : ""; }
function clean(el) { return el && el.textContent ? el.textContent.trim().replace(/\s+/g, " ") : "Selected."; }
function out(container, value) { var output = container.querySelector("output"); if (output) output.textContent = value || "Selected."; }
function first(values) { for (var i = 0; i < values.length; i += 1) if (typeof values[i] === "string" && values[i].length) return values[i]; return ""; }
function text(value, fallback) { return typeof value === "string" && value.length ? value : fallback || ""; }
function cls(value) { return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "-"); }
function esc(value) { return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }

function css() {
  return ""
    + ".oqu-mini-game{width:min(900px,100%);margin:0 auto;border:1px solid #dbe3ef;border-radius:8px;background:#fff;color:#0f172a;overflow:hidden;box-shadow:0 18px 38px rgba(15,23,42,.08)}"
    + ".oqu-mini-head{padding:22px 24px 16px;border-bottom:1px solid #e2e8f0}.oqu-mini-head div{display:inline-grid;background:color-mix(in srgb,var(--oqu-mini-accent) 12%,white);color:var(--oqu-mini-accent);border-radius:999px;padding:5px 10px;font-size:11px;font-weight:900;text-transform:uppercase}.oqu-mini-head h2{margin:12px 0 6px;font-size:28px;line-height:1.08;font-weight:950}.oqu-mini-head p{margin:0;color:#64748b;font-weight:700;line-height:1.45}.oqu-mini-board{padding:24px;display:grid;gap:16px}.oqu-mini-board button{font:inherit}footer{padding:0 24px 24px}footer button{width:100%;border:0;border-radius:8px;background:var(--oqu-mini-accent);color:#fff;padding:14px 18px;font-weight:950;cursor:pointer}output{min-height:22px;color:#2563eb;font-weight:850}.is-selected{border-color:var(--oqu-mini-accent)!important;background:color-mix(in srgb,var(--oqu-mini-accent) 10%,white)!important}.is-revealed{border-color:var(--oqu-mini-accent)!important}"
    + ".oqu-quest{position:relative;grid-template-columns:repeat(3,minmax(0,1fr))}.route{position:absolute;left:48px;right:48px;top:50%;height:3px;background:#cbd5e1}.oqu-quest button{position:relative;border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:14px;text-align:left;display:grid;gap:8px;cursor:pointer}.oqu-quest span,.oqu-time span,.oqu-road span,.meter span{width:42px;height:42px;border-radius:999px;background:var(--oqu-mini-accent);color:#fff;display:grid;place-items:center;font-weight:900}.oqu-quest output,.oqu-evidence output,.oqu-drag output{grid-column:1/-1}"
    + ".oqu-lab{background:#f8fafc}.screen{border:1px solid #334155;background:#0f172a;color:#e2e8f0;border-radius:8px;padding:16px;display:flex;justify-content:space-between;gap:12px}.grid3,.tools,.meter{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.grid3 button,.tools button,.meter button{border:1px solid #cbd5e1;background:white;border-radius:8px;padding:14px;text-align:left;cursor:pointer;font-weight:850}.grid3 button span,.tools button span{display:inline-block;width:30px;height:16px;border-radius:999px;background:#cbd5e1;margin-right:8px}.is-selected span{background:var(--oqu-mini-accent)!important}"
    + ".oqu-evidence{position:relative;grid-template-columns:repeat(3,minmax(0,1fr));background:#fffbeb}.thread{position:absolute;inset:40px;border-top:2px dashed #f59e0b;border-bottom:2px dashed #f59e0b;pointer-events:none}.oqu-evidence button{position:relative;border:1px solid #fbbf24;background:#fff7ed;border-radius:8px;padding:14px;min-height:122px;text-align:left;display:grid;gap:8px;cursor:pointer}.oqu-evidence small{color:#92400e;font-weight:900}.oqu-evidence span:not([hidden]){color:#0f766e;font-weight:800}"
    + ".oqu-drag{grid-template-columns:1fr 1fr;background:#ecfeff}.source,.drops{display:grid;gap:10px}.drag-card{border:1px solid #67e8f9;background:#fff;border-radius:8px;padding:12px;text-align:left;cursor:grab}.drag-card span{color:#0891b2;margin-right:8px}.drop{min-height:74px;border:2px dashed #67e8f9;border-radius:8px;display:grid;place-items:center;padding:10px;background:#f8fafc;color:#0e7490;font-weight:900}.drop.filled{background:#fff}"
    + ".oqu-terminal{background:#020617;color:#e2e8f0}.bar{display:flex;gap:7px}.bar span{width:11px;height:11px;border-radius:999px;background:#38bdf8}.oqu-terminal pre{margin:0;white-space:pre-wrap;overflow:auto;border:1px solid #334155;border-radius:8px;padding:16px}.oqu-terminal button{border:1px solid #334155;background:#0f172a;color:#e2e8f0;border-radius:8px;padding:12px;cursor:pointer}"
    + ".oqu-scanner{position:relative;background:#eff6ff;overflow:hidden}.lens{position:absolute;width:88px;height:88px;border-radius:999px;border:3px solid var(--oqu-mini-accent);box-shadow:0 0 0 999px rgba(15,23,42,.08);pointer-events:none}.field{min-height:270px;position:relative;border:1px solid #bfdbfe;border-radius:8px;background:linear-gradient(135deg,#fff,#dbeafe)}.dot{position:absolute;border:1px solid #93c5fd;background:#fff;border-radius:999px;padding:10px 12px;cursor:pointer}.d0{left:8%;top:15%}.d1{left:52%;top:10%}.d2{left:28%;top:44%}.d3{left:70%;top:48%}.d4{left:12%;top:72%}.d5{left:58%;top:76%}"
    + ".oqu-boss{background:#fef2f2}.boss{border:1px solid #fecaca;background:#fff;border-radius:8px;padding:16px;display:grid;gap:10px}.hp{height:16px;border-radius:999px;background:#fee2e2;overflow:hidden}.hp span{display:block;height:100%;background:#ef4444;transition:width .2s}.grid2 button{border:1px solid #fecaca;background:white;border-radius:8px;padding:14px;text-align:left;cursor:pointer}.grid2 span{display:block;color:var(--oqu-mini-accent);font-weight:900}"
    + ".oqu-time button,.oqu-road button{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:14px;text-align:left;display:grid;grid-template-columns:40px 1fr auto;gap:10px;align-items:center;cursor:pointer}.oqu-time button:disabled,.oqu-road button:disabled{opacity:.55;cursor:not-allowed}.progress{height:10px;border-radius:999px;background:#e2e8f0;overflow:hidden}.progress span{display:block;height:100%;background:var(--oqu-mini-accent)}"
    + ".oqu-builder textarea,.oqu-upload textarea,.oqu-mood textarea{width:100%;min-height:96px;border:1px solid #cbd5e1;border-radius:8px;padding:14px;font:inherit;box-sizing:border-box}.player{border:1px solid #cbd5e1;border-radius:8px;padding:16px;display:flex;align-items:center;gap:14px}.player button{border:0;background:var(--oqu-mini-accent);color:#fff;border-radius:8px;padding:10px 14px;font-weight:900}.wave{display:flex;gap:5px;align-items:end;height:42px}.wave span{width:9px;background:var(--oqu-mini-accent);border-radius:999px}.wave span:nth-child(1){height:18px}.wave span:nth-child(2){height:32px}.wave span:nth-child(3){height:24px}.wave span:nth-child(4){height:40px}.wave span:nth-child(5){height:22px}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips button{border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:8px 12px;cursor:pointer}"
    + ".oqu-upload ol{margin:0;padding-left:22px;display:grid;gap:8px;font-weight:800}.filebox{border:2px dashed #cbd5e1;border-radius:8px;padding:20px;text-align:center;font-weight:900;color:#64748b;cursor:pointer}.filebox input{display:none}.meter{grid-template-columns:repeat(5,minmax(0,1fr))}.meter button{display:grid;gap:6px}.oqu-dialog div,.oqu-stack{display:grid;gap:10px}.oqu-dialog button,.oqu-stack button{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:14px;text-align:left;cursor:pointer}.oqu-stack button{transform:translateX(calc(var(--i) * 8px));box-shadow:0 8px 16px rgba(15,23,42,.08)}.podium{border:1px solid #fde68a;background:#fffbeb;border-radius:8px;padding:18px;text-align:center;font-size:20px}.oqu-matrix{background:#f8fafc}"
    + "@media(max-width:760px){.oqu-quest,.oqu-evidence,.oqu-drag,.grid3,.grid2,.tools,.meter{grid-template-columns:1fr}.oqu-mini-head h2{font-size:23px}.route{display:none}}";
}