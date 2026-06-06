import { createStatusBadge } from "../badges/index.js";
import { createEmptyState, createErrorState, createLoadingState } from "../states/index.js";
import { createAttributeString, escapeHtml } from "../shared/html.js";

export function createCommandCenterShell(config) {
  var safeConfig = config || {};
  var classNames = readCommandCenterClassNames(safeConfig);
  var attributes = createAttributeString({
    role: "dialog",
    "aria-modal": "true",
    "aria-label": safeConfig.label || safeConfig.title || "Command Center"
  });
  var header = safeConfig.header || createCommandCenterHeader(safeConfig.headerConfig || safeConfig);
  var tabs = safeConfig.tabsHtml || createCommandCenterTabs(safeConfig.tabs || [], safeConfig.activeTab, safeConfig.tabOptions || {});
  var rightRail = safeConfig.rightRail ? safeConfig.rightRail : "";

  return '<div class="' + escapeHtml(classNames.backdrop) + '"' + attributes + '>'
    + '<section class="' + escapeHtml(classNames.modal) + '">'
    + header
    + '<div class="' + escapeHtml(classNames.shell) + '">'
    + tabs
    + '<main class="' + escapeHtml(classNames.content) + '">' + (safeConfig.content || "") + '</main>'
    + rightRail
    + '</div></section></div>';
}

export function createCommandCenterHeader(config) {
  var safeConfig = config || {};
  var classNames = readCommandCenterClassNames(safeConfig);
  var avatar = safeConfig.avatarHtml || (safeConfig.avatar ? '<span class="' + escapeHtml(classNames.avatar) + '">' + escapeHtml(safeConfig.avatar) + '</span>' : "");
  var statusBadge = safeConfig.statusBadge || (safeConfig.status ? createStatusBadge(safeConfig.status, safeConfig.statusOptions || {}) : "");
  var metadata = createMetadataRow(safeConfig.metadata);
  var actions = createCommandCenterActionRow(safeConfig.actions || [], {
    className: classNames.headerActions
  });
  var closeButton = safeConfig.closeAction ? '<button type="button" class="' + escapeHtml(classNames.closeButton) + '" data-action="' + escapeHtml(safeConfig.closeAction) + '" aria-label="Close">x</button>' : "";

  return '<header class="' + escapeHtml(classNames.header) + '">'
    + '<div class="' + escapeHtml(classNames.identity) + '">'
    + avatar
    + '<div><div class="' + escapeHtml(classNames.titleRow) + '"><h2>' + escapeHtml(safeConfig.title || "Untitled") + '</h2>' + (safeConfig.titleAfterHtml || "") + statusBadge + '</div>'
    + (safeConfig.subtitle ? '<p>' + escapeHtml(safeConfig.subtitle) + '</p>' : "")
    + metadata + '</div>'
    + '</div>' + actions + closeButton + '</header>';
}

export function createCommandCenterTabs(tabs, activeTab, options) {
  var safeTabs = Array.isArray(tabs) ? tabs : [];
  var safeOptions = options || {};
  var action = safeOptions.action || "command-center-tab";
  var className = safeOptions.className || "oqu-command-center-tabs";
  var label = safeOptions.label || "";
  var html = '<nav class="' + escapeHtml(className) + '">';
  var index = 0;

  while (index < safeTabs.length) {
    var tab = normalizeTabConfig(safeTabs[index]);
    html += '<button type="button" class="' + (activeTab === tab.key ? "is-active" : "") + '" data-action="' + escapeHtml(action) + '" data-id="' + escapeHtml(tab.key) + '"><span>' + escapeHtml(tab.icon || "") + '</span>' + escapeHtml(tab.label) + '</button>';
    index = index + 1;
  }

  if (label) {
    html += '<small>' + escapeHtml(label) + '</small>';
  }

  return html + '</nav>';
}

export function createCommandCenterKpiGrid(cards, options) {
  var safeCards = Array.isArray(cards) ? cards : [];
  var safeOptions = options || {};
  var className = safeOptions.className || "oqu-command-center-kpi-grid";
  var html = '<div class="' + escapeHtml(className) + '">';
  var index = 0;

  while (index < safeCards.length) {
    html += createCommandCenterKpiCard(safeCards[index]);
    index = index + 1;
  }

  return html + '</div>';
}

export function createCommandCenterActionRow(actions, options) {
  var safeActions = Array.isArray(actions) ? actions : [];
  var safeOptions = options || {};
  var className = safeOptions.className || "oqu-command-center-actions";
  var html = '<div class="' + escapeHtml(className) + '">';
  var index = 0;

  while (index < safeActions.length) {
    html += createCommandCenterActionButton(safeActions[index]);
    index = index + 1;
  }

  return html + '</div>';
}

export function createCommandCenterSection(config) {
  var safeConfig = config || {};
  var className = safeConfig.className || "oqu-command-center-section";
  var title = safeConfig.title ? '<h3>' + escapeHtml(safeConfig.title) + '</h3>' : "";
  var subtitle = safeConfig.subtitle ? '<p>' + escapeHtml(safeConfig.subtitle) + '</p>' : "";
  var head = title || subtitle ? '<div class="oqu-command-center-section-head">' + title + subtitle + (safeConfig.actionHtml || "") + '</div>' : "";

  return '<section class="' + escapeHtml(className) + '">' + head + (safeConfig.body || "") + '</section>';
}

export function createCommandCenterDangerZone(config) {
  var safeConfig = config || {};
  var actions = createCommandCenterActionRow(safeConfig.actions || [], {
    className: safeConfig.actionsClassName || "oqu-command-center-danger-actions"
  });

  return createCommandCenterSection({
    className: safeConfig.className || "oqu-command-center-danger-zone",
    title: safeConfig.title || "Danger Zone",
    subtitle: safeConfig.message || "Destructive actions must be explicitly supported.",
    body: actions + (safeConfig.footerHtml || "")
  });
}

export function createCommandCenterEmptyState(title, message, options) {
  return createEmptyState(title, message, options);
}

export function createCommandCenterLoadingState(message, options) {
  return createLoadingState(message, options);
}

export function createCommandCenterErrorState(title, message, options) {
  return createErrorState(title, message, options);
}

function createCommandCenterKpiCard(card) {
  var safeCard = card || {};
  var className = safeCard.className || "oqu-command-center-kpi";
  var attributes = createAttributeString({
    "data-action": safeCard.action,
    "data-id": safeCard.id,
    type: safeCard.action ? "button" : null
  });
  var tagName = safeCard.action ? "button" : "article";

  return '<' + tagName + ' class="' + escapeHtml(className) + '"' + attributes + '>'
    + (safeCard.icon ? '<span>' + escapeHtml(safeCard.icon) + '</span>' : "")
    + '<strong>' + escapeHtml(safeCard.value === undefined ? "" : safeCard.value) + '</strong>'
    + '<small>' + escapeHtml(safeCard.label || "") + '</small>'
    + (safeCard.detail ? '<em>' + escapeHtml(safeCard.detail) + '</em>' : "")
    + '</' + tagName + '>';
}

function createCommandCenterActionButton(action) {
  var safeAction = action || {};
  var className = safeAction.className || "oqu-command-center-action";
  var disabled = safeAction.disabled ? " disabled" : "";

  return '<button type="button" class="' + escapeHtml(className) + '" data-action="' + escapeHtml(safeAction.action || "") + '" data-id="' + escapeHtml(safeAction.id || "") + '"' + disabled + '>' + escapeHtml(safeAction.label || "Action") + '</button>';
}

function createMetadataRow(metadata) {
  var items = Array.isArray(metadata) ? metadata : [];
  var html = "";
  var index = 0;

  if (items.length === 0) {
    return "";
  }

  html += "<p>";
  while (index < items.length) {
    if (index > 0) {
      html += "<span></span>";
    }
    html += "<small>" + escapeHtml(items[index]) + "</small>";
    index = index + 1;
  }
  html += "</p>";

  return html;
}

function normalizeTabConfig(tab) {
  if (Array.isArray(tab)) {
    return {
      key: tab[0],
      label: tab[1],
      icon: tab[2]
    };
  }

  return {
    key: tab && tab.key ? tab.key : "",
    label: tab && tab.label ? tab.label : "",
    icon: tab && tab.icon ? tab.icon : ""
  };
}

function readCommandCenterClassNames(config) {
  var classNames = config.classNames || {};

  return {
    backdrop: classNames.backdrop || "oqu-command-center-backdrop",
    modal: classNames.modal || "oqu-command-center-modal",
    header: classNames.header || "oqu-command-center-header",
    identity: classNames.identity || "oqu-command-center-identity",
    avatar: classNames.avatar || "oqu-command-center-avatar",
    titleRow: classNames.titleRow || "oqu-command-center-title",
    headerActions: classNames.headerActions || "oqu-command-center-header-actions",
    closeButton: classNames.closeButton || "oqu-command-center-close",
    shell: classNames.shell || "oqu-command-center-shell",
    content: classNames.content || "oqu-command-center-content"
  };
}
