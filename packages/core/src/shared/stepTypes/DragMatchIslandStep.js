import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss, buildSvgIslandMap } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.85-visual-helpers-syntax";

export class DragMatchIslandStep extends BaseStep {
  static get type() {
    return "dragMatchIsland";
  }

  static get label() {
    return "Drag Match Island";
  }

  static get description() {
    return "A playful island shell for future drag-and-match activities.";
  }

  static get category() {
    return "Games";
  }

  static get complexity() {
    return "Medium";
  }

  static get previewMode() {
    return "full";
  }

  static get completionMode() {
    return "manual";
  }

  static get defaultConfig() {
    return {
      title: "",
      subtitle: "",
      items: "",
      theme: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "title",
          label: "Title",
          type: "text"
        },
        {
          key: "subtitle",
          label: "Subtitle",
          type: "text"
        },
        {
          key: "items",
          label: "Items",
          type: "textarea"
        },
        {
          key: "theme",
          label: "Theme",
          type: "text"
        }
      ]
    };
  }

  static renderPlayer(container, config, callbacks) {
    if (!container) {
      return;
    }

    var safeConfig = this.createConfig(config);
    container.innerHTML = this.renderPlayerShell(safeConfig);
    attachDragMatchIslandHandlers(container, callbacks);
    this.attachCompletionHandler(container, callbacks);
  }

  static renderPlayerShell(config) {
    var title = this.readText(config, "title", "Drag Match Island");
    var subtitle = this.readText(config, "subtitle", "Match the cards to the right places.");
    var items = this.readText(config, "items", "Keyboard\nMouse\nMonitor\nPrinter");
    var theme = this.readText(config, "theme", "sunny");
    var html = "";

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-full-experience-step oqu-drag-island-step oqu-theme-' + this.escapeHtml(theme) + '" style="background: linear-gradient(to bottom, #bae6fd, #e0f2fe); border-radius: 24px; padding: 32px; max-width: 800px; margin: 0 auto; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.15); border: 2px solid white; position: relative; overflow: hidden;">';

    // Water ripples overlay
    html += '<div class="oqu-decorative-overlay" style="background-image: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 2px, transparent 2px); background-size: 40px 40px; opacity: 0.5;"></div>';

    html += '<div class="oqu-interactive-content">';
    html += '<div class="oqu-island-topbar" style="display: flex; justify-content: flex-start; margin-bottom: 24px;">';
    html += '<div class="oqu-island-kicker" style="background: white; color: #0284c7; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">' + buildSvgIslandMap() + ' Drag & Match</div>';
    html += '</div>';

    html += '<section class="oqu-island-header" style="text-align: center; margin-bottom: 32px;">';
    html += '<div class="oqu-island-header-text">';
    html += '<h2 style="font-size: 2.5rem; color: #0369a1; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(255,255,255,0.8); font-weight: 900;">' + this.escapeHtml(title) + '</h2>';
    html += '<p style="font-size: 1.2rem; color: #0284c7; font-weight: 500;">' + this.escapeHtml(subtitle) + '</p>';
    html += '</div>';
    html += '</section>';

    html += '<div class="oqu-island-board" style="background: #fef3c7; border-radius: 24px; padding: 24px; border: 4px solid #fde68a; box-shadow: inset 0 0 20px rgba(217, 119, 6, 0.1); margin-bottom: 32px;">';

    html += '<div class="oqu-island-drop-zones" style="display: flex; gap: 16px; margin-bottom: 32px; justify-content: center;">';
    html += '<div class="oqu-island-drop-zone" data-drop-zone="1" style="flex: 1; max-width: 200px; height: 120px; background: rgba(255,255,255,0.5); border: 2px dashed #d97706; border-radius: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;"><span class="oqu-drop-placeholder" style="color: #b45309; font-weight: bold; opacity: 0.6;">Drop Area 1</span></div>';
    html += '<div class="oqu-island-drop-zone" data-drop-zone="2" style="flex: 1; max-width: 200px; height: 120px; background: rgba(255,255,255,0.5); border: 2px dashed #d97706; border-radius: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;"><span class="oqu-drop-placeholder" style="color: #b45309; font-weight: bold; opacity: 0.6;">Drop Area 2</span></div>';
    html += '</div>';

    html += '<div class="oqu-island-card-row" style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">';
    html += this.renderItemCards(items);
    html += '</div>';

    html += '</div>';

    html += '<div class="oqu-island-footer" style="text-align: center;">';
    html += '<button type="button" class="oqu-player-complete-btn oqu-island-btn oqu-anim-pulse" style="background: #f59e0b; color: white; border: none; border-bottom: 4px solid #d97706; padding: 16px 40px; border-radius: 30px; font-weight: 800; font-size: 1.2rem; cursor: pointer; transition: transform 0.1s;">Complete Match</button>';
    html += '</div>';
    html += '</div>';
    html += '</article>';

    return html;
  }

  static renderItemCards(items) {
    var itemList = items.split("\n");
    var html = "";
    var itemIndex = 0;

    while (itemIndex < itemList.length) {
      var itemText = itemList[itemIndex].trim();

      if (itemText.length > 0) {
        html += '<span class="oqu-island-draggable-card" draggable="true" data-choice-index="' + itemIndex + '" style="background: white; padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; color: #334155; font-weight: 600; cursor: grab; display: inline-flex; align-items: center; gap: 8px;"><i class="fa-solid fa-grip-vertical oqu-drag-handle" style="color: #cbd5e1;"></i> ' + this.escapeHtml(itemText) + '</span>';
      }

      itemIndex = itemIndex + 1;
    }

    if (html.length === 0) {
      html += '<span class="oqu-island-draggable-card" draggable="true" data-choice-index="0" style="background: white; padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); color: #334155; font-weight: 600; cursor: grab;"><i class="fa-solid fa-grip-vertical oqu-drag-handle" style="color: #cbd5e1;"></i> Card</span>';
    }

    return html;
  }
}


function attachDragMatchIslandHandlers(container, callbacks) {
  var onDragStart = function (event) {
    var card = event.target.closest(".oqu-island-draggable-card");

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
    var zone = event.target.closest(".oqu-island-drop-zone");

    if (!zone) {
      return;
    }

    event.preventDefault();
    zone.classList.add("is-ready");
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  };
  var onDrop = function (event) {
    var zone = event.target.closest(".oqu-island-drop-zone");
    var card = container.querySelector(".oqu-island-draggable-card.is-dragging");

    if (!zone || !card) {
      return;
    }

    event.preventDefault();
    moveIslandCard(card, zone, callbacks);
  };
  var onDragEnd = function () {
    clearIslandDragState(container);
  };
  var onClick = function (event) {
    var card = event.target.closest(".oqu-island-draggable-card");
    var zones = container.querySelectorAll(".oqu-island-drop-zone");
    var index = 0;

    if (!card) {
      return;
    }

    while (index < zones.length) {
      if (!zones[index].querySelector(".oqu-island-draggable-card")) {
        moveIslandCard(card, zones[index], callbacks);
        return;
      }
      index = index + 1;
    }

    if (zones.length > 0) {
      moveIslandCard(card, zones[zones.length - 1], callbacks);
    }
  };

  container.addEventListener("dragstart", onDragStart);
  container.addEventListener("dragover", onDragOver);
  container.addEventListener("drop", onDrop);
  container.addEventListener("dragend", onDragEnd);
  container.addEventListener("click", onClick);
}

function moveIslandCard(card, zone, callbacks) {
  var placeholder = zone.querySelector(".oqu-drop-placeholder");

  if (placeholder) {
    placeholder.remove();
  }

  card.classList.remove("is-dragging");
  card.classList.add("is-dropped");
  zone.classList.remove("is-ready");
  zone.appendChild(card);

  if (callbacks && typeof callbacks.onInteraction === "function") {
    callbacks.onInteraction({
      type: "item_dropped",
      activityType: "dragMatchIsland",
      choiceIndex: Number(card.getAttribute("data-choice-index") || 0),
      dropZone: zone.getAttribute("data-drop-zone") || ""
    });
  }
}

function clearIslandDragState(container) {
  var cards = container.querySelectorAll(".oqu-island-draggable-card.is-dragging");
  var zones = container.querySelectorAll(".oqu-island-drop-zone.is-ready");
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
}
