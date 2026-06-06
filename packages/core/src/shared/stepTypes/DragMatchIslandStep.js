import { BaseStep } from "./BaseStep.js?v=1.1.81-class-command-center";

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

  static renderPlayerShell(config) {
    var title = this.readText(config, "title", "Drag Match Island");
    var subtitle = this.readText(config, "subtitle", "Match the cards to the right places.");
    var items = this.readText(config, "items", "Keyboard\nMouse\nMonitor\nPrinter");
    var theme = this.readText(config, "theme", "sunny");
    var html = "";

    html += '<article class="oqu-player-step oqu-full-experience-step oqu-drag-island-step">';
    html += '<div class="oqu-experience-kicker">Games · ' + this.escapeHtml(theme) + '</div>';
    html += '<section class="oqu-island-header">';
    html += '<div>';
    html += '<h2>' + this.escapeHtml(title) + '</h2>';
    html += '<p>' + this.escapeHtml(subtitle) + '</p>';
    html += '</div>';
    html += '<div class="oqu-island-sun">☀</div>';
    html += '</section>';
    html += '<div class="oqu-island-board">';
    html += '<div class="oqu-island-water">Matching area placeholder</div>';
    html += '<div class="oqu-island-card-row">';
    html += this.renderItemCards(items);
    html += '</div>';
    html += '</div>';
    html += '<button type="button" class="oqu-player-complete-btn">Complete Island Match</button>';
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
        html += '<span class="oqu-island-card">' + this.escapeHtml(itemText) + '</span>';
      }

      itemIndex = itemIndex + 1;
    }

    if (html.length === 0) {
      html += '<span class="oqu-island-card">Card</span>';
    }

    return html;
  }
}
