export function renderTemplate(activityContext) {
  var container = activityContext && activityContext.container ? activityContext.container : null;
  var content = activityContext && activityContext.content ? activityContext.content : {};
  var cards = Array.isArray(content.cards) ? content.cards : [];
  var folders = groupCardsByFolder(cards);
  var html = "";

  if (!container) return;

  html += '<style>' + buildDigitalFileExplorerCss() + '</style>';
  html += '<article class="oqu-file-explorer">';
  html += '<header><div><span>Digital Investigation</span><h2>' + escapeHtml(content.title || "Digital File Explorer") + '</h2><p>' + escapeHtml(content.instructions || "Open each folder, then inspect the files inside.") + '</p></div><div class="oqu-window-controls"><b></b><b></b><b></b></div></header>';
  html += '<section class="oqu-file-window"><nav class="oqu-folder-list">';
  folders.forEach(function (folder, index) {
    html += '<button type="button" class="oqu-folder-tab' + (index === 0 ? ' is-active' : '') + '" data-folder-index="' + index + '"><span></span>' + escapeHtml(folder.name) + '<small>' + folder.cards.length + '</small></button>';
  });
  html += '</nav><div class="oqu-file-list">';
  folders.forEach(function (folder, folderIndex) {
    html += '<div class="oqu-folder-panel' + (folderIndex === 0 ? ' is-active' : '') + '" data-folder-panel="' + folderIndex + '">';
    folder.cards.forEach(function (card, cardIndex) {
      html += '<button type="button" class="oqu-file-item" data-card-id="' + escapeHtml(card.id) + '" data-card-index="' + card.sourceIndex + '"><span class="oqu-file-icon">TXT</span><strong>' + escapeHtml(card.front) + '.txt</strong><small>Click to open</small></button>';
    });
    html += '</div>';
  });
  html += '</div></section><aside class="oqu-file-preview"><strong>No file open</strong><span>Select a file to inspect its contents.</span></aside>';
  html += '</article>';

  container.innerHTML = html;
  attachFileExplorerClicks(container, activityContext, cards);
}

export function destroyTemplate(activityContext) {
  if (activityContext && activityContext.templateState && activityContext.templateState.onClick && activityContext.container) {
    activityContext.container.removeEventListener("click", activityContext.templateState.onClick);
  }
}

export function getTemplateDefaultContent() {
  return {
    templateId: "digital-file-explorer",
    title: "Investigate Computer Files",
    instructions: "Open each folder and read every file.",
    cards: [
      { id: "file-1", front: "CPU", back: "The CPU processes instructions.", hint: "Hardware" },
      { id: "file-2", front: "RAM", back: "RAM holds temporary working data.", hint: "Hardware" },
      { id: "file-3", front: "Spreadsheet", back: "A spreadsheet organizes data in rows and columns.", hint: "Applications" }
    ]
  };
}

export function getTemplatePreviewContent() {
  return {
    templateId: "digital-file-explorer",
    title: "Computer Concepts Explorer",
    instructions: "Browse the folders and open the files to complete the investigation.",
    cards: [
      { id: "file-preview-1", front: "Input", back: "Data entered into a computer system.", hint: "IPO Model" },
      { id: "file-preview-2", front: "Process", back: "The computer works on input using instructions.", hint: "IPO Model" },
      { id: "file-preview-3", front: "Output", back: "The result produced by the computer.", hint: "IPO Model" },
      { id: "file-preview-4", front: "PowerPoint", back: "Presentation software used to communicate ideas visually.", hint: "Office Apps" },
      { id: "file-preview-5", front: "Excel", back: "Spreadsheet software used for data and formulas.", hint: "Office Apps" }
    ]
  };
}

function attachFileExplorerClicks(container, activityContext, cards) {
  var preview = container.querySelector(".oqu-file-preview");
  var onClick = function (event) {
    var folder = event.target.closest(".oqu-folder-tab");
    var file = event.target.closest(".oqu-file-item");
    var index = 0;
    var card = null;

    if (folder) {
      showFolder(container, Number(folder.getAttribute("data-folder-index") || 0));
      return;
    }

    if (!file) return;

    index = Number(file.getAttribute("data-card-index") || 0);
    card = cards[index] || {};
    file.classList.add("is-opened");
    if (preview) {
      preview.innerHTML = '<strong>' + escapeHtml(card.front || "File") + '.txt</strong><span>' + escapeHtml(card.back || "Opened") + '</span>';
    }
    activityContext.onInteraction({ type: "card_revealed", cardId: file.getAttribute("data-card-id") || "", cardIndex: index, templateId: "digital-file-explorer" });
  };

  activityContext.templateState.onClick = onClick;
  container.addEventListener("click", onClick);
}

function showFolder(container, folderIndex) {
  Array.prototype.forEach.call(container.querySelectorAll(".oqu-folder-tab"), function (tab) { tab.classList.toggle("is-active", Number(tab.getAttribute("data-folder-index") || 0) === folderIndex); });
  Array.prototype.forEach.call(container.querySelectorAll(".oqu-folder-panel"), function (panel) { panel.classList.toggle("is-active", Number(panel.getAttribute("data-folder-panel") || 0) === folderIndex); });
}

function groupCardsByFolder(cards) {
  var folders = [];
  var byName = {};
  cards.forEach(function (card, index) {
    var name = card.hint || "Concepts";
    if (!byName[name]) {
      byName[name] = { name: name, cards: [] };
      folders.push(byName[name]);
    }
    byName[name].cards.push(Object.assign({ sourceIndex: index }, card));
  });
  return folders.length > 0 ? folders : [{ name: "Concepts", cards: [] }];
}

function buildDigitalFileExplorerCss() {
  return ""
    + ".oqu-file-explorer{width:min(900px,100%);margin:0 auto;border:1px solid #cbd5e1;border-radius:22px;overflow:hidden;background:#f8fafc;color:#0f172a;box-shadow:0 20px 50px rgba(15,23,42,.14)}.oqu-file-explorer header{display:flex;justify-content:space-between;gap:16px;padding:18px 20px;background:#e2e8f0;border-bottom:1px solid #cbd5e1}.oqu-file-explorer header span{font-size:10px;font-weight:950;text-transform:uppercase;color:#2563eb;letter-spacing:.14em}.oqu-file-explorer h2{margin:4px 0;font-size:26px;font-weight:950}.oqu-file-explorer p{margin:0;color:#475569;font-weight:750}.oqu-window-controls{display:flex;gap:7px}.oqu-window-controls b{width:12px;height:12px;border-radius:50%;background:#94a3b8}.oqu-window-controls b:first-child{background:#ef4444}.oqu-window-controls b:nth-child(2){background:#f59e0b}.oqu-window-controls b:nth-child(3){background:#22c55e}"
    + ".oqu-file-window{display:grid;grid-template-columns:220px 1fr;min-height:320px}.oqu-folder-list{display:grid;align-content:start;gap:8px;padding:14px;border-right:1px solid #e2e8f0;background:#fff}.oqu-folder-tab{border:0;border-radius:12px;background:transparent;padding:12px;text-align:left;font-weight:900;color:#334155;display:grid;grid-template-columns:18px 1fr auto;gap:8px;align-items:center;cursor:pointer}.oqu-folder-tab span{width:18px;height:14px;border-radius:3px;background:#fbbf24}.oqu-folder-tab small{font-size:10px;color:#64748b}.oqu-folder-tab.is-active{background:#dbeafe;color:#1d4ed8}"
    + ".oqu-file-list{padding:18px}.oqu-folder-panel{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.oqu-folder-panel.is-active{display:grid}.oqu-file-item{border:1px solid #dbeafe;border-radius:14px;background:#fff;padding:14px;text-align:left;display:grid;grid-template-columns:42px 1fr;gap:6px 12px;align-items:center;cursor:pointer}.oqu-file-item:hover{border-color:#60a5fa}.oqu-file-item.is-opened{background:#ecfdf5;border-color:#34d399}.oqu-file-icon{grid-row:span 2;width:42px;height:48px;border-radius:8px;background:#eff6ff;color:#2563eb;display:grid;place-items:center;font-size:10px;font-weight:950}.oqu-file-item strong{font-size:14px}.oqu-file-item small{font-size:11px;color:#64748b;font-weight:800}.oqu-file-preview{border-top:1px solid #e2e8f0;background:#fff;padding:16px 20px;display:grid;gap:6px}.oqu-file-preview strong{font-size:17px}.oqu-file-preview span{font-weight:800;color:#475569;line-height:1.5}"
    + "@media(max-width:760px){.oqu-file-window{grid-template-columns:1fr}.oqu-folder-list{border-right:0;border-bottom:1px solid #e2e8f0}.oqu-folder-panel.is-active{grid-template-columns:1fr}}";
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}
