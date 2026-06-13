import {
  getActivityTemplateDefinition,
  getDefaultActivityTemplateId,
  normalizeActivityTemplateId
} from "./activityTemplateRegistry.js?v=1.1.184-scenario-choice";
import {
  createGamificationSummary,
  renderActivityResults,
  renderCelebration,
  renderStars,
  updateStreak
} from "./gamificationService.js?v=1.1.184-scenario-choice";

const BaseStep = typeof window !== "undefined"
  ? window.CourseEngine.BaseStep
  : globalThis.CourseEngine.BaseStep;

class InteractiveLearningStepBase extends BaseStep {
  static category = "Practice";
  static complexity = "Medium";
  static previewMode = "full";
  static completionMode = "interactive";
  static defaultConfig = {};
  static editorSchema = { fields: [] };

  static validateConfig(config) {
    return Boolean(config && typeof config === "object" && !Array.isArray(config));
  }

  static render(container, config) {
    this.assertRenderArgs({ container: container });
    container.innerHTML = this.renderPlayerShell(this.createConfig(config));
  }

  static renderPlayer(container, config, callbacks) {
    this.assertRenderArgs({ container: container });
    var safeCallbacks = callbacks || {};
    var onComplete = safeCallbacks.onComplete;
    const complete = this.createCompletionGuard(onComplete);
    var safeConfig = this.createConfig(config);

    container.innerHTML = this.renderPlayerShell(safeConfig);
    this.attachPlayerHandlers(container, safeConfig, complete);
  }

  static attachPlayerHandlers(container, config, complete) {
    var completeButton = container.querySelector("[data-step-complete]");

    if (completeButton) {
      completeButton.addEventListener("click", function () {
        complete({
          success: true,
          score: 100,
          data: {}
        });
      });
    }
  }

  static renderPlayerShell(config) {
    return buildShell(this, config, "");
  }
}

export class IntroCardStep extends InteractiveLearningStepBase {
  static type = "intro-card";
  static label = "Intro Card";
  static description = "A welcome or explanation screen with a clear continue action.";
  static category = "Basic / Content";
  static complexity = "Easy";
  static defaultConfig = {
    title: "Welcome",
    subtitle: "",
    bodyText: "Start your learning journey.",
    icon: "🚀",
    calloutText: "",
    buttonText: "Continue"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "bodyText", label: "Body Text", type: "textarea" },
    { key: "icon", label: "Icon", type: "text" },
    { key: "calloutText", label: "Callout Text", type: "textarea" },
    { key: "buttonText", label: "Button Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    var body = "";

    body += '<div class="intro-card-icon">' + this.escapeHtml(readText(config, "icon", "🚀")) + '</div>';
    body += '<h2>' + this.escapeHtml(readText(config, "title", "Welcome")) + '</h2>';
    if (readText(config, "subtitle", "")) {
      body += '<p class="intro-card-subtitle">' + this.escapeHtml(readText(config, "subtitle", "")) + '</p>';
    }
    body += '<p>' + this.escapeHtml(readText(config, "bodyText", "Start your learning journey.")) + '</p>';
    if (readText(config, "calloutText", "")) {
      body += '<div class="intro-card-callout">' + this.escapeHtml(readText(config, "calloutText", "")) + '</div>';
    }
    body += '<button type="button" class="intro-card-button" data-step-complete>' + this.escapeHtml(readText(config, "buttonText", "Continue")) + '</button>';

    return buildShell(this, config, body);
  }
}

export class CardRevealStep extends InteractiveLearningStepBase {
  static type = "card-reveal";
  static label = "Card Reveal";
  static description = "Students tap cards to uncover key ideas one at a time.";
  static category = "Basic / Content";
  static complexity = "Easy";
  static defaultConfig = {
    title: "Reveal the Cards",
    instructions: "Click each card to reveal more information.",
    cardsText: "💻|Computers|ICT includes using computers to process information.\n🌐|Internet|ICT includes using networks and the internet to find and share information.",
    requireAllCards: "true",
    buttonText: "Continue"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "instructions", label: "Instructions", type: "textarea" },
    { key: "cardsText", label: "Cards Text", type: "textarea" },
    { key: "requireAllCards", label: "Require All Cards", type: "select", options: boolOptions() },
    { key: "buttonText", label: "Button Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    var cards = parseCardLines(config.cardsText);
    var body = "";

    body += '<h2>' + this.escapeHtml(readText(config, "title", "Reveal the Cards")) + '</h2>';
    body += '<p>' + this.escapeHtml(readText(config, "instructions", "Click each card to reveal more information.")) + '</p>';
    body += '<div class="card-reveal-grid">';
    cards.forEach(function (card, index) {
      body += '<button type="button" class="card-reveal-card" data-card-index="' + index + '" aria-expanded="false">';
      body += '<span class="card-reveal-card-inner">';
      body += '<span class="card-reveal-front"><span class="card-reveal-icon">' + BaseStep.escapeHtml(card.icon) + '</span><strong>' + BaseStep.escapeHtml(card.title) + '</strong><em>Tap to reveal</em></span>';
      body += '<span class="card-reveal-back"><strong>' + BaseStep.escapeHtml(card.title) + '</strong><span>' + BaseStep.escapeHtml(card.description) + '</span></span>';
      body += '</span>';
      body += '</button>';
    });
    body += '</div>';
    body += '<button type="button" class="card-reveal-button" data-step-complete>' + this.escapeHtml(readText(config, "buttonText", "Continue")) + '</button>';

    return buildShell(this, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var cards = container.querySelectorAll(".card-reveal-card");
    var button = container.querySelector("[data-step-complete]");
    var requireAllCards = readBoolean(config.requireAllCards, true);

    if (button && requireAllCards) {
      button.disabled = true;
    }

    forEachElement(cards, function (card) {
      card.addEventListener("click", function () {
        if (card.classList.contains("is-revealed")) {
          return;
        }
        card.classList.add("is-revealed");
        card.classList.add("is-reveal-pop");
        card.setAttribute("aria-expanded", "true");
        window.setTimeout(function () {
          card.classList.remove("is-reveal-pop");
        }, 520);
        if (button && requireAllCards) {
          button.disabled = container.querySelectorAll(".card-reveal-card.is-revealed").length !== cards.length;
        }
      });
    });

    if (button) {
      button.addEventListener("click", function () {
        if (!button.disabled) {
          complete({ success: true, score: 100, data: { revealedCards: container.querySelectorAll(".card-reveal-card.is-revealed").length } });
        }
      });
    }
  }
}

export class SortingStep extends InteractiveLearningStepBase {
  static type = "sorting";
  static label = "Sorting";
  static description = "Students sort examples into the correct categories.";
  static category = "Practice";
  static complexity = "Medium";
  static defaultConfig = {
    title: "Sort the Items",
    instructions: "Move each item into the correct group.",
    categoriesText: "ICT\nNot ICT",
    itemsText: "Using a computer to write a document|ICT\nWriting with a pencil|Not ICT",
    buttonText: "Check Answers",
    successText: "Great sorting!"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "instructions", label: "Instructions", type: "textarea" },
    { key: "categoriesText", label: "Categories Text", type: "textarea" },
    { key: "itemsText", label: "Items Text", type: "textarea" },
    { key: "buttonText", label: "Button Text", type: "text" },
    { key: "successText", label: "Success Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    var templateRenderer = getSortingTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.renderPlayerShell === "function") {
      return templateRenderer.renderPlayerShell(this, config);
    }

    var categories = parseLines(config.categoriesText, ["ICT", "Not ICT"]);
    var items = parseSortItems(config.itemsText);
    var body = "";

    body += '<h2>' + this.escapeHtml(readText(config, "title", "Sort the Items")) + '</h2>';
    body += '<p>' + this.escapeHtml(readText(config, "instructions", "Move each item into the correct group.")) + '</p>';
    body += '<div class="sorting-workspace">';
    body += '<div class="sorting-items" aria-label="Items to sort">';
    items.forEach(function (item, index) {
      body += '<button type="button" class="sorting-item" data-item-index="' + index + '" data-answer="' + BaseStep.escapeHtml(item.category) + '">' + BaseStep.escapeHtml(item.label) + '</button>';
    });
    body += '</div><div class="sorting-categories">';
    categories.forEach(function (category) {
      body += '<button type="button" class="sorting-category" data-category="' + BaseStep.escapeHtml(category) + '"><strong>' + BaseStep.escapeHtml(category) + '</strong><span></span></button>';
    });
    body += '</div></div>';
    body += '<div class="sorting-feedback" aria-live="polite"></div>';
    body += '<button type="button" class="sorting-button" data-check-sorting>' + this.escapeHtml(readText(config, "buttonText", "Check Answers")) + '</button>';

    return buildShell(this, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var templateRenderer = getSortingTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.attachPlayerHandlers === "function") {
      templateRenderer.attachPlayerHandlers(container, config, complete);
      return;
    }

    var selectedItem = null;
    var items = container.querySelectorAll(".sorting-item");
    var categories = container.querySelectorAll(".sorting-category");
    var checkButton = container.querySelector("[data-check-sorting]");
    var feedback = container.querySelector(".sorting-feedback");

    forEachElement(items, function (item) {
      item.addEventListener("click", function () {
        if (item.classList.contains("is-correct")) {
          return;
        }
        clearSelection(items);
        item.classList.add("is-selected");
        selectedItem = item;
      });
    });

    forEachElement(categories, function (category) {
      category.addEventListener("click", function () {
        var count;
        if (!selectedItem) {
          return;
        }
        selectedItem.setAttribute("data-choice", category.getAttribute("data-category") || "");
        selectedItem.classList.remove("is-selected");
        selectedItem.classList.add("is-placed");
        selectedItem.querySelector("span");
        category.appendChild(selectedItem);
        count = category.querySelectorAll(".sorting-item").length;
        setCategoryCount(category, count);
        selectedItem = null;
      });
    });

    if (checkButton) {
      checkButton.addEventListener("click", function () {
        var correctCount = 0;
        var currentItems = container.querySelectorAll(".sorting-item");

        forEachElement(currentItems, function (item) {
          var correct = (item.getAttribute("data-choice") || "") === (item.getAttribute("data-answer") || "");
          item.classList.toggle("is-correct", correct);
          item.classList.toggle("is-incorrect", !correct);
          if (correct) {
            correctCount = correctCount + 1;
          }
        });

        if (correctCount === currentItems.length && currentItems.length > 0) {
          if (feedback) {
            feedback.textContent = readText(config, "successText", "Great sorting!");
          }
          complete({
            success: true,
            score: 100,
            data: {
              sortedItems: correctCount,
              gamification: readGamificationSummary("Classic Sorting", correctCount, currentItems.length, true)
            }
          });
        } else if (feedback) {
          feedback.textContent = "Move every item to the group that fits best.";
        }
      });
    }
  }
}

export class MultipleChoiceStep extends InteractiveLearningStepBase {
  static type = "multiple-choice";
  static label = "Multiple Choice";
  static description = "A single-answer or select-all check with feedback.";
  static category = "Assessment / Check";
  static complexity = "Easy";
  static defaultConfig = {
    title: "Choose the Correct Answer",
    questionText: "Which of these are examples of ICT?",
    choicesText: "Using a computer to write a document|true\nWriting with a pencil|false",
    selectionMode: "multiple",
    feedbackCorrect: "Correct!",
    feedbackIncorrect: "Try again.",
    allowRetry: "true",
    buttonText: "Check Answer"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "questionText", label: "Question Text", type: "textarea" },
    { key: "choicesText", label: "Choices Text", type: "textarea" },
    { key: "selectionMode", label: "Selection Mode", type: "select", options: [
      { value: "single", label: "Single" },
      { value: "multiple", label: "Multiple" }
    ] },
    { key: "feedbackCorrect", label: "Feedback Correct", type: "text" },
    { key: "feedbackIncorrect", label: "Feedback Incorrect", type: "text" },
    { key: "allowRetry", label: "Allow Retry", type: "select", options: boolOptions() },
    { key: "buttonText", label: "Button Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    var templateRenderer = getMultipleChoiceTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.renderPlayerShell === "function") {
      return templateRenderer.renderPlayerShell(this, config);
    }

    var choices = parseChoices(config.choicesText);
    var body = "";

    body += '<h2>' + this.escapeHtml(readText(config, "title", "Choose the Correct Answer")) + '</h2>';
    body += '<fieldset class="multiple-choice-fieldset">';
    body += '<legend>' + this.escapeHtml(readText(config, "questionText", "Which answer is correct?")) + '</legend>';
    choices.forEach(function (choice, index) {
      body += '<button type="button" class="multiple-choice-option" data-choice-index="' + index + '" data-correct="' + (choice.correct ? "true" : "false") + '">' + BaseStep.escapeHtml(choice.label) + '</button>';
    });
    body += '</fieldset>';
    body += '<div class="multiple-choice-feedback" aria-live="polite"></div>';
    body += '<button type="button" class="multiple-choice-button" data-check-choice>' + this.escapeHtml(readText(config, "buttonText", "Check Answer")) + '</button>';

    return buildShell(this, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var templateRenderer = getMultipleChoiceTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.attachPlayerHandlers === "function") {
      templateRenderer.attachPlayerHandlers(container, config, complete);
      return;
    }

    var options = container.querySelectorAll(".multiple-choice-option");
    var checkButton = container.querySelector("[data-check-choice]");
    var feedback = container.querySelector(".multiple-choice-feedback");
    var multiple = readText(config, "selectionMode", "multiple") !== "single";
    var allowRetry = readBoolean(config.allowRetry, true);

    forEachElement(options, function (option) {
      option.addEventListener("click", function () {
        if (!multiple) {
          clearSelection(options);
        }
        option.classList.toggle("is-selected");
      });
    });

    if (checkButton) {
      checkButton.addEventListener("click", function () {
        var correct = choicesAreCorrect(options);
        markChoiceResults(options);
        if (feedback) {
          feedback.textContent = correct ? readText(config, "feedbackCorrect", "Correct!") : readText(config, "feedbackIncorrect", "Try again.");
        }
        if (correct || !allowRetry) {
          complete({
            success: correct,
            score: correct ? 100 : 0,
            data: {
              correct: correct,
              gamification: readGamificationSummary("Classic Multiple Choice", correct ? 1 : 0, 1, true)
            }
          });
        }
      });
    }
  }
}

export class MultiSelectStep extends InteractiveLearningStepBase {
  static type = "multi-select";
  static label = "Multi Select";
  static description = "Students select all correct answers from a list of options.";
  static category = "Assessment / Check";
  static complexity = "Easy";
  static defaultConfig = {
    title: "Technology Around Us",
    prompt: "Which of these use ICT or digital technology?",
    options: "A traffic light controlling cars\nAn ATM giving money\nA phone sending a message\nA computer opening a document\nA teacher writing on a whiteboard\nA student creating a presentation\nA calculator solving a math problem",
    correctAnswers: "A traffic light controlling cars\nAn ATM giving money\nA phone sending a message\nA computer opening a document\nA student creating a presentation\nA calculator solving a math problem",
    feedback: "ICT is not only computers in the lab. It is all around us.",
    incorrectFeedback: "Not quite. Select every correct answer and remove anything that does not fit.",
    buttonText: "Submit Answers"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "prompt", label: "Prompt", type: "textarea" },
    { key: "options", label: "Options", type: "textarea" },
    { key: "correctAnswers", label: "Correct Answers", type: "textarea" },
    { key: "feedback", label: "Feedback", type: "textarea" },
    { key: "incorrectFeedback", label: "Incorrect Feedback", type: "textarea" },
    { key: "buttonText", label: "Button Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    return MultiSelectRenderer.renderPlayerShell(this, config);
  }

  static attachPlayerHandlers(container, config, complete) {
    MultiSelectRenderer.attachPlayerHandlers(container, config, complete);
  }
}

export class ScenarioChoiceStep extends InteractiveLearningStepBase {
  static type = "scenario-choice";
  static label = "Scenario Choice";
  static description = "Students read a scenario and choose the best action.";
  static category = "Decision Making";
  static complexity = "Easy";
  static defaultConfig = {
    title: "What Should You Do?",
    scenario: "You finish early. What should you do?",
    options: "Start talking loudly.\nOpen random websites.\nCheck your work, try an extension activity, or wait quietly.\nLeave your seat without permission.",
    correctAnswer: "Check your work, try an extension activity, or wait quietly.",
    feedback: "Good choice! Responsible students use their time productively.",
    incorrectFeedback: "Think about the choice that is safe, respectful, and productive.",
    explanation: "Checking your work or waiting quietly helps you keep learning without distracting others.",
    buttonText: "Submit Choice"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "scenario", label: "Scenario", type: "textarea" },
    { key: "options", label: "Options", type: "textarea" },
    { key: "correctAnswer", label: "Correct Answer", type: "textarea" },
    { key: "feedback", label: "Feedback", type: "textarea" },
    { key: "explanation", label: "Optional Explanation", type: "textarea" },
    { key: "incorrectFeedback", label: "Incorrect Feedback", type: "textarea" },
    { key: "buttonText", label: "Button Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    return ScenarioChoiceRenderer.renderPlayerShell(this, config);
  }

  static attachPlayerHandlers(container, config, complete) {
    ScenarioChoiceRenderer.attachPlayerHandlers(container, config, complete);
  }
}

export class RoadmapStep extends InteractiveLearningStepBase {
  static type = "roadmap";
  static label = "Roadmap";
  static description = "Shows a sequence of topics students can explore.";
  static category = "Basic / Content";
  static complexity = "Easy";
  static defaultConfig = {
    title: "Your Learning Roadmap",
    instructions: "Explore what you will learn.",
    roadmapText: "1|Input, Process, Output|Learn how computers receive information, process it, and give results.\n2|Networks and the Internet|Learn how computers connect and share information.",
    requireAllItems: "true",
    buttonText: "Continue"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "instructions", label: "Instructions", type: "textarea" },
    { key: "roadmapText", label: "Roadmap Text", type: "textarea" },
    { key: "requireAllItems", label: "Require All Items", type: "select", options: boolOptions() },
    { key: "buttonText", label: "Button Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    var templateRenderer = getRoadmapTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.renderPlayerShell === "function") {
      return templateRenderer.renderPlayerShell(this, config);
    }

    var items = parseRoadmapItems(config.roadmapText);
    var body = "";

    body += '<h2>' + this.escapeHtml(readText(config, "title", "Your Learning Roadmap")) + '</h2>';
    body += '<p>' + this.escapeHtml(readText(config, "instructions", "Explore what you will learn.")) + '</p>';
    body += '<ol class="roadmap-list">';
    items.forEach(function (item, index) {
      body += '<li><button type="button" class="roadmap-item" data-roadmap-index="' + index + '" aria-expanded="false">';
      body += '<span class="roadmap-number">' + BaseStep.escapeHtml(item.number) + '</span>';
      body += '<span><strong>' + BaseStep.escapeHtml(item.title) + '</strong><em>' + BaseStep.escapeHtml(item.description) + '</em></span>';
      body += '</button></li>';
    });
    body += '</ol>';
    body += '<button type="button" class="roadmap-button" data-step-complete>' + this.escapeHtml(readText(config, "buttonText", "Continue")) + '</button>';

    return buildShell(this, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var templateRenderer = getRoadmapTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.attachPlayerHandlers === "function") {
      templateRenderer.attachPlayerHandlers(container, config, complete);
      return;
    }

    var items = container.querySelectorAll(".roadmap-item");
    var button = container.querySelector("[data-step-complete]");
    var requireAllItems = readBoolean(config.requireAllItems, true);

    if (button && requireAllItems) {
      button.disabled = true;
    }

    forEachElement(items, function (item) {
      item.addEventListener("click", function () {
        item.classList.add("is-open");
        item.setAttribute("aria-expanded", "true");
        if (button && requireAllItems) {
          button.disabled = container.querySelectorAll(".roadmap-item.is-open").length !== items.length;
        }
      });
    });

    if (button) {
      button.addEventListener("click", function () {
        if (!button.disabled) {
          complete({ success: true, score: 100, data: { viewedItems: container.querySelectorAll(".roadmap-item.is-open").length } });
        }
      });
    }
  }
}

export class MatchingStep extends InteractiveLearningStepBase {
  static type = "matching";
  static label = "Matching";
  static description = "Students match terms to their meanings.";
  static category = "Practice";
  static complexity = "Medium";
  static defaultConfig = {
    title: "Match the Terms",
    instructions: "Match each word to its meaning.",
    pairsText: "Course|The full subject you are studying\nModule|One topic or lesson inside the course\nStep|One activity inside a module",
    buttonText: "Check Matches",
    successText: "Great matching!"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "instructions", label: "Instructions", type: "textarea" },
    { key: "pairsText", label: "Pairs Text", type: "textarea" },
    { key: "buttonText", label: "Button Text", type: "text" },
    { key: "successText", label: "Success Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    var templateRenderer = getMatchingTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.renderPlayerShell === "function") {
      return templateRenderer.renderPlayerShell(this, config);
    }

    var pairs = parsePairs(config.pairsText);
    var body = "";

    body += '<h2>' + this.escapeHtml(readText(config, "title", "Match the Terms")) + '</h2>';
    body += '<p>' + this.escapeHtml(readText(config, "instructions", "Match each word to its meaning.")) + '</p>';
    body += '<div class="matching-board"><div class="matching-column">';
    pairs.forEach(function (pair, index) {
      body += '<button type="button" class="matching-card" data-match-side="term" data-match-id="' + index + '">' + BaseStep.escapeHtml(pair.left) + '</button>';
    });
    body += '</div><div class="matching-column">';
    pairs.slice().reverse().forEach(function (pair, reverseIndex) {
      var index = pairs.length - reverseIndex - 1;
      body += '<button type="button" class="matching-card" data-match-side="definition" data-match-id="' + index + '">' + BaseStep.escapeHtml(pair.right) + '</button>';
    });
    body += '</div></div>';
    body += '<div class="matching-feedback" aria-live="polite"></div>';
    body += '<button type="button" class="matching-button" data-check-matches>' + this.escapeHtml(readText(config, "buttonText", "Check Matches")) + '</button>';

    return buildShell(this, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var templateRenderer = getMatchingTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.attachPlayerHandlers === "function") {
      templateRenderer.attachPlayerHandlers(container, config, complete);
      return;
    }

    var selected = null;
    var cards = container.querySelectorAll(".matching-card");
    var checkButton = container.querySelector("[data-check-matches]");
    var feedback = container.querySelector(".matching-feedback");

    forEachElement(cards, function (card) {
      card.addEventListener("click", function () {
        if (card.classList.contains("is-matched")) {
          return;
        }
        if (!selected) {
          card.classList.add("is-selected");
          selected = card;
          return;
        }
        if (selected === card) {
          card.classList.remove("is-selected");
          selected = null;
          return;
        }
        if ((selected.getAttribute("data-match-side") || "") !== (card.getAttribute("data-match-side") || "")
            && (selected.getAttribute("data-match-id") || "") === (card.getAttribute("data-match-id") || "")) {
          selected.classList.remove("is-selected");
          selected.classList.add("is-matched");
          card.classList.add("is-matched");
          selected = null;
        } else {
          selected.classList.remove("is-selected");
          card.classList.add("is-incorrect");
          selected = null;
          window.setTimeout(function () {
            card.classList.remove("is-incorrect");
          }, 500);
        }
      });
    });

    if (checkButton) {
      checkButton.addEventListener("click", function () {
        var matched = container.querySelectorAll(".matching-card.is-matched").length;
        if (matched === cards.length && cards.length > 0) {
          if (feedback) {
            feedback.textContent = readText(config, "successText", "Great matching!");
          }
          complete({ success: true, score: 100, data: { matchedPairs: matched / 2 } });
        } else if (feedback) {
          feedback.textContent = "Match every term with its meaning first.";
        }
      });
    }
  }
}

export class OrderingStep extends InteractiveLearningStepBase {
  static type = "ordering";
  static label = "Ordering";
  static description = "Students arrange steps into the correct sequence.";
  static category = "Practice";
  static complexity = "Medium";
  static defaultConfig = {
    title: "Put These in Order",
    instructions: "Arrange the actions in the correct order.",
    itemsText: "Read the instruction\nTry the activity\nCheck your answer\nFix mistakes if needed\nClick continue",
    buttonText: "Check Order",
    successText: "Correct order!"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "instructions", label: "Instructions", type: "textarea" },
    { key: "itemsText", label: "Items Text", type: "textarea" },
    { key: "buttonText", label: "Button Text", type: "text" },
    { key: "successText", label: "Success Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    var templateRenderer = getOrderingTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.renderPlayerShell === "function") {
      return templateRenderer.renderPlayerShell(this, config);
    }

    var items = parseLines(config.itemsText, ["Read the instruction", "Try the activity", "Check your answer"]);
    var visibleItems = items.slice().reverse();
    var body = "";

    body += '<h2>' + this.escapeHtml(readText(config, "title", "Put These in Order")) + '</h2>';
    body += '<p>' + this.escapeHtml(readText(config, "instructions", "Arrange the actions in the correct order.")) + '</p>';
    body += '<ol class="ordering-list">';
    visibleItems.forEach(function (item) {
      body += '<li class="ordering-item" data-correct-index="' + items.indexOf(item) + '">';
      body += '<span>' + BaseStep.escapeHtml(item) + '</span>';
      body += '<button type="button" data-move-order="up" aria-label="Move up">↑</button>';
      body += '<button type="button" data-move-order="down" aria-label="Move down">↓</button>';
      body += '</li>';
    });
    body += '</ol>';
    body += '<div class="ordering-feedback" aria-live="polite"></div>';
    body += '<button type="button" class="ordering-button" data-check-order>' + this.escapeHtml(readText(config, "buttonText", "Check Order")) + '</button>';

    return buildShell(this, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var templateRenderer = getOrderingTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.attachPlayerHandlers === "function") {
      templateRenderer.attachPlayerHandlers(container, config, complete);
      return;
    }

    var buttons = container.querySelectorAll("[data-move-order]");
    var checkButton = container.querySelector("[data-check-order]");
    var feedback = container.querySelector(".ordering-feedback");

    forEachElement(buttons, function (button) {
      button.addEventListener("click", function () {
        moveOrderingItem(button);
      });
    });

    if (checkButton) {
      checkButton.addEventListener("click", function () {
        var correct = markOrderingState(container);
        if (correct) {
          if (feedback) {
            feedback.textContent = readText(config, "successText", "Correct order!");
          }
          complete({ success: true, score: 100, data: {} });
        } else if (feedback) {
          feedback.textContent = "Keep adjusting the order, then check again.";
        }
      });
    }
  }
}

export class ReflectionStep extends InteractiveLearningStepBase {
  static type = "reflection";
  static label = "Reflection";
  static description = "A short exit ticket or reflection response.";
  static category = "Assessment / Check";
  static complexity = "Easy";
  static defaultConfig = {
    title: "Reflection",
    promptText: "What are you most excited to learn?",
    responseMode: "choice",
    choicesText: "Computers\nInternet\nWord\nPowerPoint\nExcel\nI am not sure yet",
    requireResponse: "true",
    buttonText: "Finish"
  };
  static editorSchema = { fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "promptText", label: "Prompt Text", type: "textarea" },
    { key: "responseMode", label: "Response Mode", type: "select", options: [
      { value: "choice", label: "Choice" },
      { value: "short-text", label: "Short Text" },
      { value: "both", label: "Both" }
    ] },
    { key: "choicesText", label: "Choices Text", type: "textarea" },
    { key: "requireResponse", label: "Require Response", type: "select", options: boolOptions() },
    { key: "buttonText", label: "Button Text", type: "text" }
  ] };

  static renderPlayerShell(config) {
    var templateRenderer = getReflectionTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.renderPlayerShell === "function") {
      return templateRenderer.renderPlayerShell(this, config);
    }

    var responseMode = readText(config, "responseMode", "choice");
    var choices = parseLines(config.choicesText, ["Computers", "Internet", "I am not sure yet"]);
    var body = "";

    body += '<h2>' + this.escapeHtml(readText(config, "title", "Reflection")) + '</h2>';
    body += '<p>' + this.escapeHtml(readText(config, "promptText", "What are you most excited to learn?")) + '</p>';
    if (responseMode === "choice" || responseMode === "both") {
      body += '<div class="reflection-choices">';
      choices.forEach(function (choice, index) {
        body += '<button type="button" class="reflection-choice" data-reflection-choice="' + index + '">' + BaseStep.escapeHtml(choice) + '</button>';
      });
      body += '</div>';
    }
    if (responseMode === "short-text" || responseMode === "both") {
      body += '<textarea class="reflection-text" placeholder="Write your response"></textarea>';
    }
    body += '<div class="reflection-feedback" aria-live="polite"></div>';
    body += '<button type="button" class="reflection-button" data-submit-reflection>' + this.escapeHtml(readText(config, "buttonText", "Finish")) + '</button>';

    return buildShell(this, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var templateRenderer = getReflectionTemplateRenderer(config);

    if (templateRenderer && typeof templateRenderer.attachPlayerHandlers === "function") {
      templateRenderer.attachPlayerHandlers(container, config, complete);
      return;
    }

    var choices = container.querySelectorAll(".reflection-choice");
    var textInput = container.querySelector(".reflection-text");
    var button = container.querySelector("[data-submit-reflection]");
    var feedback = container.querySelector(".reflection-feedback");
    var requireResponse = readBoolean(config.requireResponse, true);

    forEachElement(choices, function (choice) {
      choice.addEventListener("click", function () {
        clearSelection(choices);
        choice.classList.add("is-selected");
      });
    });

    if (button) {
      button.addEventListener("click", function () {
        var selectedChoice = container.querySelector(".reflection-choice.is-selected");
        var textValue = textInput ? textInput.value.trim() : "";
        var hasResponse = Boolean(selectedChoice || textValue);

        if (requireResponse && !hasResponse) {
          if (feedback) {
            feedback.textContent = "Add a response before finishing.";
          }
          return;
        }

        complete({
          success: true,
          score: 100,
          data: {
            choice: selectedChoice ? selectedChoice.textContent : "",
            response: textValue
          }
        });
      });
    }
  }
}

export default IntroCardStep;

class TimelineBuilderOrderingTemplate {
  static renderPlayerShell(StepType, config) {
    var data = createTimelineBuilderData(config);
    var body = "";

    body += '<div class="timeline-builder-shell" data-timeline-root>';
    body += '<div class="timeline-builder-header">';
    body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Timeline Builder")) + '</h2>';
    body += '<p>' + StepType.escapeHtml(readText(config, "instructions", "Drag the events into the correct sequence.")) + '</p>';
    body += '</div>';

    if (!data.valid) {
      body += '<div class="timeline-builder-empty">';
      body += '<strong>Timeline Builder needs ordering items.</strong>';
      body += '<span>Add at least two items in the Ordering editor, one per line.</span>';
      body += '</div>';
      body += '</div>';
      return buildShell(StepType, config, body);
    }

    body += '<div class="timeline-builder-meta">';
    body += '<span data-timeline-attempts>Attempts: 0</span>';
    body += '<em data-timeline-accuracy>Accuracy: 0%</em>';
    body += '</div>';
    body += '<ol class="timeline-builder-list" data-timeline-list aria-label="Timeline events">';
    data.shuffledItems.forEach(function (item, index) {
      body += renderTimelineCard(item, index);
    });
    body += '</ol>';
    body += '<div class="timeline-builder-feedback" data-timeline-feedback aria-live="polite">Arrange the events, then check the timeline.</div>';
    body += '<div class="timeline-builder-actions">';
    body += '<button type="button" class="timeline-builder-check" data-timeline-check>Check Timeline</button>';
    body += '<button type="button" class="timeline-builder-hint" data-timeline-hint hidden>Show Hint</button>';
    body += '</div>';
    body += '<div class="timeline-builder-results" data-timeline-results hidden></div>';
    body += '</div>';

    return buildShell(StepType, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var data = createTimelineBuilderData(config);
    var list = container.querySelector("[data-timeline-list]");
    var checkButton = container.querySelector("[data-timeline-check]");
    var hintButton = container.querySelector("[data-timeline-hint]");
    var state = {
      attempts: 0,
      hintsUsed: 0,
      completed: false,
      startedAt: Date.now(),
      draggedCard: null
    };

    if (!data.valid || !list) {
      return;
    }

    bindTimelineDragHandlers(container, list, state);
    bindTimelineMoveButtons(container, state);
    updateTimelineCardNumbers(container);

    if (checkButton) {
      checkButton.addEventListener("click", function () {
        checkTimelineOrder(container, data, state, complete);
      });
    }

    if (hintButton) {
      hintButton.addEventListener("click", function () {
        showTimelineHint(container, data, state);
      });
    }
  }
}

var orderingTemplateMap = {
  "timeline-builder": TimelineBuilderOrderingTemplate
};

function getOrderingTemplateRenderer(config) {
  var templateId = normalizeActivityTemplateId("ordering", readRawActivityTemplateId(config));

  return orderingTemplateMap[templateId] || null;
}

function createTimelineBuilderData(config) {
  var rawItemsText = typeof config.itemsText === "string" ? config.itemsText.trim() : "";
  var labels = rawItemsText ? parseLines(rawItemsText, []) : [];
  var items = labels.map(function (label, index) {
    return {
      label: label,
      correctIndex: index
    };
  });
  var shuffledItems = shuffleTimelineItems(items);

  return {
    items: items,
    shuffledItems: shuffledItems,
    valid: items.length >= 2
  };
}

function shuffleTimelineItems(items) {
  var shuffledItems = shuffleCards(items);

  if (items.length > 1 && isTimelineOrderCorrect(shuffledItems)) {
    shuffledItems = shuffledItems.slice().reverse();
  }

  return shuffledItems;
}

function renderTimelineCard(item, index) {
  return '<li class="timeline-builder-card" draggable="true" data-timeline-card data-correct-index="' + item.correctIndex + '">'
    + '<span class="timeline-builder-node" data-timeline-position>' + (index + 1) + '</span>'
    + '<span class="timeline-builder-copy">' + BaseStep.escapeHtml(item.label) + '</span>'
    + '<span class="timeline-builder-card-actions">'
    + '<button type="button" data-timeline-move="previous" aria-label="Move earlier">←</button>'
    + '<button type="button" data-timeline-move="next" aria-label="Move later">→</button>'
    + '</span>'
    + '</li>';
}

function bindTimelineDragHandlers(container, list, state) {
  list.addEventListener("dragstart", function (event) {
    var card = event.target && event.target.closest ? event.target.closest("[data-timeline-card]") : null;

    if (!card || state.completed) {
      return;
    }

    state.draggedCard = card;
    card.classList.add("is-dragging");
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.getAttribute("data-correct-index") || "");
    }
  });

  list.addEventListener("dragover", function (event) {
    var targetCard = event.target && event.target.closest ? event.target.closest("[data-timeline-card]") : null;

    if (!state.draggedCard || state.completed) {
      return;
    }

    event.preventDefault();
    clearTimelineDropState(container);
    if (targetCard && targetCard !== state.draggedCard) {
      targetCard.classList.add("is-drop-target");
    }
  });

  list.addEventListener("drop", function (event) {
    var targetCard = event.target && event.target.closest ? event.target.closest("[data-timeline-card]") : null;

    if (!state.draggedCard || state.completed) {
      return;
    }

    event.preventDefault();
    if (targetCard && targetCard !== state.draggedCard) {
      list.insertBefore(state.draggedCard, targetCard);
    } else {
      list.appendChild(state.draggedCard);
    }
    clearTimelineDropState(container);
    state.draggedCard.classList.remove("is-dragging");
    state.draggedCard = null;
    clearTimelineValidation(container);
    updateTimelineCardNumbers(container);
  });

  list.addEventListener("dragend", function () {
    if (state.draggedCard) {
      state.draggedCard.classList.remove("is-dragging");
    }
    state.draggedCard = null;
    clearTimelineDropState(container);
  });
}

function bindTimelineMoveButtons(container, state) {
  container.addEventListener("click", function (event) {
    var button = event.target && event.target.closest ? event.target.closest("[data-timeline-move]") : null;
    var card = button ? button.closest("[data-timeline-card]") : null;
    var list = card ? card.parentElement : null;
    var direction = button ? button.getAttribute("data-timeline-move") : "";

    if (!button || !card || !list || state.completed) {
      return;
    }

    if (direction === "previous" && card.previousElementSibling) {
      list.insertBefore(card, card.previousElementSibling);
    } else if (direction === "next" && card.nextElementSibling) {
      list.insertBefore(card.nextElementSibling, card);
    }
    clearTimelineValidation(container);
    updateTimelineCardNumbers(container);
  });
}

function checkTimelineOrder(container, data, state, complete) {
  var feedback = container.querySelector("[data-timeline-feedback]");
  var hintButton = container.querySelector("[data-timeline-hint]");
  var resultsElement = container.querySelector("[data-timeline-results]");
  var checkButton = container.querySelector("[data-timeline-check]");
  var cards = readTimelineCards(container);
  var correctCount = markTimelineState(cards);
  var accuracy = calculateTimelineAccuracy(correctCount, data.items.length);
  var completed = correctCount === data.items.length && data.items.length > 0;
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var gamification = null;

  if (state.completed) {
    return;
  }

  state.attempts = state.attempts + 1;
  updateTimelineStats(container, state, accuracy);

  if (!completed) {
    if (feedback) {
      feedback.textContent = state.attempts >= 2
        ? "Some events are still out of order. A hint is available."
        : "Some timeline positions need another look.";
    }
    if (hintButton && state.attempts >= 2) {
      hintButton.hidden = false;
    }
    return;
  }

  state.completed = true;
  gamification = createTimelineGamification(state, data.items.length, completionTimeSeconds);
  if (feedback) {
    feedback.textContent = "Timeline complete.";
  }
  if (hintButton) {
    hintButton.hidden = true;
  }
  if (checkButton) {
    checkButton.disabled = true;
  }
  forEachElement(cards, function (card) {
    card.draggable = false;
    card.classList.add("is-locked");
  });
  if (resultsElement) {
    resultsElement.hidden = false;
    resultsElement.innerHTML = renderActivityResults(gamification);
  }

  complete({
    success: true,
    score: gamification.accuracy,
    data: {
      attempts: state.attempts,
      completionTimeSeconds: completionTimeSeconds,
      hintsUsed: state.hintsUsed,
      completed: true,
      finalAccuracy: gamification.accuracy,
      gamification: gamification,
      template: "timeline-builder"
    }
  });
}

function showTimelineHint(container, data, state) {
  var feedback = container.querySelector("[data-timeline-feedback]");
  var cards = readTimelineCards(container);
  var correctCard = null;
  var misplacedCard = null;

  if (state.completed) {
    return;
  }

  state.hintsUsed = state.hintsUsed + 1;
  clearTimelineHints(container);

  forEachElement(cards, function (card, index) {
    if (!correctCard && Number(card.getAttribute("data-correct-index")) === index) {
      correctCard = card;
    }
    if (!misplacedCard && Number(card.getAttribute("data-correct-index")) !== index) {
      misplacedCard = card;
    }
  });

  if (correctCard) {
    correctCard.classList.add("is-hint");
    if (feedback) {
      feedback.textContent = "Hint: one highlighted event is already in the right place.";
    }
    return;
  }

  if (misplacedCard && feedback) {
    feedback.textContent = readTimelineRelativeHint(data, misplacedCard);
  }
}

function readTimelineRelativeHint(data, card) {
  var correctIndex = Number(card.getAttribute("data-correct-index"));
  var item = data.items[correctIndex];
  var previous = correctIndex > 0 ? data.items[correctIndex - 1] : null;
  var next = correctIndex < data.items.length - 1 ? data.items[correctIndex + 1] : null;

  if (!item) {
    return "Hint: look for the event that should happen earliest.";
  }

  if (previous) {
    return "Hint: " + item.label + " happens after " + previous.label + ".";
  }

  if (next) {
    return "Hint: " + item.label + " happens before " + next.label + ".";
  }

  return "Hint: check the beginning and end of the timeline.";
}

function createTimelineGamification(state, totalItems, completionTimeSeconds) {
  var adjustedCorrect = Math.max(0, totalItems - Math.max(0, state.attempts - 1) - state.hintsUsed);

  return createGamificationSummary({
    correctAnswers: adjustedCorrect,
    totalAnswers: totalItems,
    completed: true,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: "Timeline Builder"
  });
}

function readTimelineCards(container) {
  return container.querySelectorAll("[data-timeline-card]");
}

function markTimelineState(cards) {
  var correctCount = 0;

  forEachElement(cards, function (card, index) {
    var correct = Number(card.getAttribute("data-correct-index")) === index;
    card.classList.toggle("is-correct", correct);
    card.classList.toggle("is-incorrect", !correct);
    if (correct) {
      correctCount = correctCount + 1;
    }
  });

  return correctCount;
}

function calculateTimelineAccuracy(correctCount, totalItems) {
  if (!totalItems) {
    return 0;
  }

  return Math.round((correctCount / totalItems) * 100);
}

function updateTimelineStats(container, state, accuracy) {
  var attemptsElement = container.querySelector("[data-timeline-attempts]");
  var accuracyElement = container.querySelector("[data-timeline-accuracy]");

  if (attemptsElement) {
    attemptsElement.textContent = "Attempts: " + state.attempts;
  }
  if (accuracyElement) {
    accuracyElement.textContent = "Accuracy: " + accuracy + "%";
  }
}

function updateTimelineCardNumbers(container) {
  var positions = container.querySelectorAll("[data-timeline-position]");

  forEachElement(positions, function (position, index) {
    position.textContent = String(index + 1);
  });
}

function clearTimelineValidation(container) {
  var cards = readTimelineCards(container);

  forEachElement(cards, function (card) {
    card.classList.remove("is-correct", "is-incorrect", "is-hint");
  });
}

function clearTimelineHints(container) {
  var cards = readTimelineCards(container);

  forEachElement(cards, function (card) {
    card.classList.remove("is-hint");
  });
}

function clearTimelineDropState(container) {
  var cards = readTimelineCards(container);

  forEachElement(cards, function (card) {
    card.classList.remove("is-drop-target");
  });
}

function isTimelineOrderCorrect(items) {
  var correct = true;

  items.forEach(function (item, index) {
    if (item.correctIndex !== index) {
      correct = false;
    }
  });

  return correct;
}

class EmojiCheckInReflectionTemplate {
  static renderPlayerShell(StepType, config) {
    var moods = readEmojiCheckInMoods();
    var body = "";

    body += '<div class="emoji-checkin-shell" data-emoji-checkin-root>';
    body += '<div class="emoji-checkin-header">';
    body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Emoji Check-In")) + '</h2>';
    body += '<p>' + StepType.escapeHtml(readText(config, "promptText", "How are you feeling right now?")) + '</p>';
    body += '</div>';
    body += '<div class="emoji-checkin-moods" role="radiogroup" aria-label="Mood options">';
    moods.forEach(function (mood) {
      body += '<button type="button" class="emoji-checkin-mood" role="radio" aria-checked="false" data-emoji-mood="' + StepType.escapeHtml(mood.value) + '" data-emoji-label="' + StepType.escapeHtml(mood.label) + '">';
      body += '<span class="emoji-checkin-icon" aria-hidden="true">' + StepType.escapeHtml(mood.emoji) + '</span>';
      body += '<strong>' + StepType.escapeHtml(mood.label) + '</strong>';
      body += '</button>';
    });
    body += '</div>';
    body += '<label class="emoji-checkin-note">';
    body += '<span>Optional note</span>';
    body += '<textarea data-emoji-note rows="3" placeholder="Add anything you want your teacher to know."></textarea>';
    body += '</label>';
    body += '<div class="emoji-checkin-feedback" data-emoji-feedback aria-live="polite">Choose the mood that feels closest. There is no wrong answer.</div>';
    body += '<button type="button" class="emoji-checkin-submit" data-emoji-submit>Submit Check-In</button>';
    body += '<div class="emoji-checkin-confirmation" data-emoji-confirmation hidden>';
    body += '<strong>Thanks for checking in.</strong>';
    body += '<span>Your response has been saved for this activity.</span>';
    body += '</div>';
    body += '</div>';

    return buildShell(StepType, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var moods = container.querySelectorAll("[data-emoji-mood]");
    var noteInput = container.querySelector("[data-emoji-note]");
    var submitButton = container.querySelector("[data-emoji-submit]");
    var feedback = container.querySelector("[data-emoji-feedback]");
    var confirmation = container.querySelector("[data-emoji-confirmation]");
    var selectedMood = null;
    var submitted = false;

    forEachElement(moods, function (moodButton) {
      moodButton.addEventListener("click", function () {
        if (submitted) {
          return;
        }

        clearEmojiMoodSelection(moods);
        moodButton.classList.add("is-selected");
        moodButton.setAttribute("aria-checked", "true");
        selectedMood = {
          mood: moodButton.getAttribute("data-emoji-mood") || "",
          moodLabel: moodButton.getAttribute("data-emoji-label") || ""
        };
        if (feedback) {
          feedback.textContent = selectedMood.moodLabel + " selected. You can change it before submitting.";
        }
      });
    });

    if (submitButton) {
      submitButton.addEventListener("click", function () {
        var note = noteInput ? noteInput.value.trim() : "";

        if (submitted) {
          return;
        }

        if (!selectedMood || !selectedMood.mood) {
          if (feedback) {
            feedback.textContent = "Select one mood before submitting.";
          }
          return;
        }

        submitted = true;
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Check-In Submitted";
        }
        if (noteInput) {
          noteInput.disabled = true;
        }
        forEachElement(moods, function (moodButton) {
          moodButton.disabled = true;
        });
        if (feedback) {
          feedback.textContent = "Thank you. Your check-in was submitted.";
        }
        if (confirmation) {
          confirmation.hidden = false;
        }

        complete({
          success: true,
          score: 100,
          data: {
            mood: selectedMood.mood,
            moodLabel: selectedMood.moodLabel,
            note: note,
            submittedAt: new Date().toISOString(),
            template: "emoji-check-in"
            // TODO: Surface this reflection payload in the teacher dashboard if no existing progress/reflection view displays it.
          }
        });
      });
    }
  }
}

var reflectionTemplateRenderers = {
  "emoji-check-in": EmojiCheckInReflectionTemplate
};

function getReflectionTemplateRenderer(config) {
  var templateId = normalizeActivityTemplateId("reflection", readRawActivityTemplateId(config));

  return reflectionTemplateRenderers[templateId] || null;
}

function readEmojiCheckInMoods() {
  return [
    { value: "very-happy", label: "Very happy", emoji: "😄" },
    { value: "happy", label: "Happy", emoji: "🙂" },
    { value: "okay", label: "Okay", emoji: "😐" },
    { value: "tired", label: "Tired", emoji: "😴" },
    { value: "frustrated", label: "Frustrated", emoji: "😕" },
    { value: "sad", label: "Sad", emoji: "😢" }
  ];
}

function clearEmojiMoodSelection(moods) {
  forEachElement(moods, function (moodButton) {
    moodButton.classList.remove("is-selected");
    moodButton.setAttribute("aria-checked", "false");
  });
}

class BubblePopSortingTemplate {
  static renderPlayerShell(StepType, config) {
    var data = createSortingTemplateData(config);
    var body = "";

    body += '<div class="bubble-pop-header">';
    body += '<div>';
    body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Bubble Pop Sorting")) + '</h2>';
    body += '<p>' + StepType.escapeHtml(readText(config, "instructions", "Pop the bubbles that match the target category.")) + '</p>';
    body += '</div>';
    body += '<div class="bubble-pop-score" aria-live="polite"><strong data-bubble-score>0</strong><span>Score</span></div>';
    body += '</div>';

    if (!data.valid) {
      body += '<div class="bubble-pop-empty">';
      body += '<strong>Bubble Pop needs sorting content.</strong>';
      body += '<span>Add categories and items in the format Item|Category, then preview again.</span>';
      body += '</div>';
      return buildShell(StepType, config, body);
    }

    body += '<div class="bubble-pop-roundbar">';
    body += '<span>Target category</span>';
    body += '<strong data-bubble-target>' + StepType.escapeHtml(data.categories[0]) + '</strong>';
    body += '<em data-bubble-progress>Round 1 of ' + data.categories.length + '</em>';
    body += '</div>';
    body += '<div class="bubble-pop-feedback" data-bubble-feedback aria-live="polite">Pop every bubble that belongs to ' + StepType.escapeHtml(data.categories[0]) + '.</div>';
    body += '<div class="bubble-pop-stage" data-bubble-stage>';
    data.items.forEach(function (item, index) {
      var position = readBubblePosition(index);
      body += '<button type="button" class="bubble-pop-bubble" data-bubble-item data-item-index="' + index + '" data-category="' + StepType.escapeHtml(item.category) + '" style="' + position + '">';
      body += '<span>' + StepType.escapeHtml(item.label) + '</span>';
      body += '</button>';
    });
    body += '</div>';
    body += '<button type="button" class="bubble-pop-complete" data-step-complete disabled>' + StepType.escapeHtml(readText(config, "buttonText", "Complete")) + '</button>';

    return buildShell(StepType, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var data = createSortingTemplateData(config);
    var bubbles = container.querySelectorAll("[data-bubble-item]");
    var target = container.querySelector("[data-bubble-target]");
    var progress = container.querySelector("[data-bubble-progress]");
    var feedback = container.querySelector("[data-bubble-feedback]");
    var scoreElement = container.querySelector("[data-bubble-score]");
    var completeButton = container.querySelector("[data-step-complete]");
    var state = {
      categoryIndex: 0,
      score: 0,
      incorrectCount: 0,
      poppedByCategory: {}
    };

    if (!data.valid) {
      if (completeButton) {
        completeButton.disabled = true;
      }
      return;
    }

    data.categories.forEach(function (category) {
      state.poppedByCategory[category] = {};
    });

    renderBubbleRound(container, data, state, target, progress, feedback, scoreElement, completeButton);

    forEachElement(bubbles, function (bubble) {
      bubble.addEventListener("click", function () {
        handleBubblePop(container, bubble, data, state, target, progress, feedback, scoreElement, completeButton, complete);
      });
    });
  }
}

class CharacterRunnerSortingTemplate {
  static renderPlayerShell(StepType, config) {
    var data = createCharacterRunnerData(config);
    var leftCategory = data.categories[0] || "Left";
    var rightCategory = data.categories[1] || "Right";
    var body = "";

    body += '<div class="runner-sort-shell" data-runner-root tabindex="0">';
    body += '<div class="runner-sort-header">';
    body += '<div>';
    body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Character Runner Sorting")) + '</h2>';
    body += '<p>' + StepType.escapeHtml(readText(config, "instructions", "Move the character to the correct category bin.")) + '</p>';
    body += '</div>';
    body += '<div class="runner-sort-score"><strong data-runner-score>0</strong><span>Score</span></div>';
    body += '</div>';

    if (!data.valid) {
      body += '<div class="runner-sort-empty">';
      body += '<strong>Character Runner needs two sorting categories.</strong>';
      body += '<span>Add two categories and items in the format Item|Category, then preview again.</span>';
      body += '</div>';
      body += '</div>';
      return buildShell(StepType, config, body);
    }

    body += '<div class="runner-sort-progress">';
    body += '<span data-runner-progress>Item 1 of ' + data.items.length + '</span>';
    body += '<em data-runner-accuracy>0% accuracy</em>';
    body += '</div>';
    body += '<div class="runner-sort-feedback" data-runner-feedback aria-live="polite">Choose the category for this item.</div>';
    body += '<div class="runner-sort-arena" data-runner-arena>';
    body += '<button type="button" class="runner-sort-bin is-left" data-runner-choice="left" data-category="' + StepType.escapeHtml(leftCategory) + '">';
    body += '<span>Left</span><strong>' + StepType.escapeHtml(leftCategory) + '</strong>';
    body += '</button>';
    body += '<div class="runner-sort-lane">';
    body += '<div class="runner-sort-item" data-runner-item>' + StepType.escapeHtml(data.items[0].label) + '</div>';
    body += '<div class="runner-sort-avatar" data-runner-avatar aria-hidden="true"><span>▶</span></div>';
    body += '</div>';
    body += '<button type="button" class="runner-sort-bin is-right" data-runner-choice="right" data-category="' + StepType.escapeHtml(rightCategory) + '">';
    body += '<span>Right</span><strong>' + StepType.escapeHtml(rightCategory) + '</strong>';
    body += '</button>';
    body += '</div>';
    body += '<div class="runner-sort-controls" aria-label="Character movement controls">';
    body += '<button type="button" data-runner-choice="left">← ' + StepType.escapeHtml(leftCategory) + '</button>';
    body += '<button type="button" data-runner-choice="right">' + StepType.escapeHtml(rightCategory) + ' →</button>';
    body += '</div>';
    body += '<div class="runner-sort-results" data-runner-results hidden></div>';
    body += '</div>';

    return buildShell(StepType, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var data = createCharacterRunnerData(config);
    var root = container.querySelector("[data-runner-root]");
    var state = {
      itemIndex: 0,
      score: 0,
      correctCount: 0,
      totalAnswers: 0,
      locked: false,
      completed: false
    };

    if (!data.valid || !root) {
      return;
    }

    renderCharacterRunnerItem(container, data, state);
    if (typeof root.focus === "function") {
      root.focus();
    }

    root.addEventListener("click", function (event) {
      var choice = event.target && event.target.closest ? event.target.closest("[data-runner-choice]") : null;

      if (!choice) {
        return;
      }

      handleCharacterRunnerChoice(container, choice.getAttribute("data-runner-choice") || "", data, state, complete);
    });

    bindCharacterRunnerKeyboard(container, data, state, complete);
  }
}

var sortingGameRendererMap = {
  "bubble-pop-sorting": BubblePopSortingTemplate,
  "character-runner-sorting": CharacterRunnerSortingTemplate
};

var sortingTemplateRenderers = sortingGameRendererMap;

var movementSortingRendererMap = {
  "character-runner-sorting": CharacterRunnerSortingTemplate
};

class QuizShowMultipleChoiceTemplate {
  static renderPlayerShell(StepType, config) {
    var data = createQuizShowData(config);
    var body = "";

    body += '<div class="quiz-show-shell" data-quiz-show-root>';
    body += '<div class="quiz-show-header">';
    body += '<div>';
    body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Quiz Show")) + '</h2>';
    body += '<p>' + StepType.escapeHtml(readText(config, "instructions", "Choose the best answer.")) + '</p>';
    body += '</div>';
    body += '<div class="quiz-show-score"><strong data-quiz-score>0</strong><span>Score</span></div>';
    body += '<div class="quiz-show-xp"><strong data-quiz-xp>0</strong><span>XP</span></div>';
    body += '</div>';

    if (!data.valid) {
      body += '<div class="quiz-show-empty">';
      body += '<strong>Quiz Show needs question data.</strong>';
      body += '<span>Add a question and choices in the Multiple Choice editor. Use Choice|true for correct answers.</span>';
      body += '</div>';
      body += '</div>';
      return buildShell(StepType, config, body);
    }

    body += '<div class="quiz-show-progress"><span data-quiz-progress>Question 1 of ' + data.questions.length + '</span><em data-quiz-scoreline>0 correct</em></div>';
    body += '<div class="quiz-show-streak" data-quiz-streak>Streak: 0</div>';
    body += '<div class="quiz-show-question" data-quiz-question>' + StepType.escapeHtml(data.questions[0].question) + '</div>';
    body += '<div class="quiz-show-answers" data-quiz-answers></div>';
    body += '<div class="quiz-show-feedback" data-quiz-feedback aria-live="polite"></div>';
    body += '<button type="button" class="quiz-show-next" data-quiz-next hidden>Next Question</button>';
    body += '<div class="quiz-show-results" data-quiz-results hidden></div>';
    body += '</div>';

    return buildShell(StepType, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var data = createQuizShowData(config);
    var root = container.querySelector("[data-quiz-show-root]");
    var answers = container.querySelector("[data-quiz-answers]");
    var nextButton = container.querySelector("[data-quiz-next]");
    var state = {
      questionIndex: 0,
      correctCount: 0,
      streak: 0,
      maxStreak: 0,
      answered: false,
      completed: false,
      startedAt: Date.now()
    };

    if (!data.valid || !root || !answers || !nextButton) {
      return;
    }

    renderQuizShowQuestion(container, data, state);

    answers.addEventListener("click", function (event) {
      var button = event.target && event.target.closest ? event.target.closest("[data-quiz-answer]") : null;
      if (!button || state.answered) {
        return;
      }
      handleQuizShowAnswer(container, button, data, state);
    });

    nextButton.addEventListener("click", function () {
      if (!state.answered) {
        return;
      }

      if (state.questionIndex >= data.questions.length - 1) {
        renderQuizShowResults(container, data, state, complete);
        return;
      }

      state.questionIndex = state.questionIndex + 1;
      state.answered = false;
      renderQuizShowQuestion(container, data, state);
    });
  }
}

class MillionaireMultipleChoiceTemplate {
  static renderPlayerShell(StepType, config) {
    var data = createQuizShowData(config);
    var body = "";

    body += '<div class="millionaire-shell" data-millionaire-root>';
    body += '<div class="millionaire-header">';
    body += '<div>';
    body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Millionaire Style")) + '</h2>';
    body += '<p>' + StepType.escapeHtml(readText(config, "instructions", "Choose carefully, then lock in your answer.")) + '</p>';
    body += '</div>';
    body += '<div class="millionaire-score"><strong data-millionaire-score>0</strong><span>Score</span></div>';
    body += '</div>';

    if (!data.valid) {
      body += '<div class="quiz-show-empty">';
      body += '<strong>Millionaire Style needs question data.</strong>';
      body += '<span>Add questions and choices in the Multiple Choice editor. Use Choice|true for correct answers.</span>';
      body += '</div>';
      body += '</div>';
      return buildShell(StepType, config, body);
    }

    body += '<div class="millionaire-layout">';
    body += '<aside class="millionaire-ladder" data-millionaire-ladder aria-label="Question progression"></aside>';
    body += '<section class="millionaire-stage">';
    body += '<div class="millionaire-progress"><span data-millionaire-progress>Question 1 of ' + data.questions.length + '</span><em data-millionaire-streak>Streak: 0</em></div>';
    body += '<div class="millionaire-question" data-millionaire-question>' + StepType.escapeHtml(data.questions[0].question) + '</div>';
    body += '<div class="millionaire-answers" data-millionaire-answers></div>';
    body += '<div class="millionaire-confirm" data-millionaire-confirm hidden>';
    body += '<strong>Lock In Answer?</strong>';
    body += '<div><button type="button" data-millionaire-confirm-answer>Confirm</button><button type="button" data-millionaire-change-answer>Change Answer</button></div>';
    body += '</div>';
    body += '<div class="millionaire-feedback" data-millionaire-feedback aria-live="polite"></div>';
    body += '<button type="button" class="millionaire-next" data-millionaire-next hidden>Next Question</button>';
    body += '</section>';
    body += '</div>';
    body += '<div class="millionaire-lifelines" aria-label="Lifelines">';
    body += '<button type="button" data-millionaire-lifeline="fifty">50/50</button>';
    body += '<button type="button" data-millionaire-lifeline="hint">Hint</button>';
    body += '<button type="button" data-millionaire-lifeline="skip">Skip Question</button>';
    body += '</div>';
    body += '<div class="millionaire-results" data-millionaire-results hidden></div>';
    body += '</div>';

    return buildShell(StepType, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var data = createQuizShowData(config);
    var answers = container.querySelector("[data-millionaire-answers]");
    var confirmButton = container.querySelector("[data-millionaire-confirm-answer]");
    var changeButton = container.querySelector("[data-millionaire-change-answer]");
    var nextButton = container.querySelector("[data-millionaire-next]");
    var state = {
      questionIndex: 0,
      selectedIndex: null,
      correctCount: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      questionsAnswered: 0,
      skippedCount: 0,
      lifelinesUsed: {},
      completed: false,
      startedAt: Date.now()
    };

    if (!data.valid || !answers || !confirmButton || !changeButton || !nextButton) {
      return;
    }

    renderMillionaireQuestion(container, data, state);

    answers.addEventListener("click", function (event) {
      var answer = event.target && event.target.closest ? event.target.closest("[data-millionaire-answer]") : null;

      if (!answer || state.selectedIndex !== null || state.completed) {
        return;
      }

      selectMillionaireAnswer(container, Number(answer.getAttribute("data-choice-index")), state);
    });

    confirmButton.addEventListener("click", function () {
      confirmMillionaireAnswer(container, data, state);
    });

    changeButton.addEventListener("click", function () {
      clearMillionaireSelection(container, state);
    });

    nextButton.addEventListener("click", function () {
      advanceMillionaireQuestion(container, data, state, complete);
    });

    container.addEventListener("click", function (event) {
      var lifeline = event.target && event.target.closest ? event.target.closest("[data-millionaire-lifeline]") : null;

      if (!lifeline) {
        return;
      }

      useMillionaireLifeline(container, data, state, lifeline, complete);
    });
  }
}

var multipleChoiceRendererMap = {
  "quiz-show": QuizShowMultipleChoiceTemplate,
  "millionaire-style": MillionaireMultipleChoiceTemplate
};

var multipleChoiceTemplateRenderers = multipleChoiceRendererMap;

class MultiSelectRenderer {
  static renderPlayerShell(StepType, config) {
    var renderer = getMultiSelectTemplateRenderer(config);
    return renderer.renderPlayerShell(StepType, config);
  }

  static attachPlayerHandlers(container, config, complete) {
    var renderer = getMultiSelectTemplateRenderer(config);
    renderer.attachPlayerHandlers(container, config, complete);
  }
}

class ClassicMultiSelectRenderer {
  static renderPlayerShell(StepType, config) {
    return renderMultiSelectPlayerShell(StepType, config, {
      template: "classic-multi-select",
      shellClass: "multi-select-classic",
      optionClass: "multi-select-option",
      inputType: "checkbox",
      emptyTitle: "Multi Select needs options.",
      emptyMessage: "Add options and correct answers in the Multi Select editor."
    });
  }

  static attachPlayerHandlers(container, config, complete) {
    attachMultiSelectHandlers(container, config, complete, {
      template: "classic-multi-select",
      activityName: "Classic Multi Select",
      revealCorrectOnIncorrect: false
    });
  }
}

class TechnologyScannerRenderer {
  static renderPlayerShell(StepType, config) {
    return renderMultiSelectPlayerShell(StepType, config, {
      template: "technology-scanner",
      shellClass: "technology-scanner",
      optionClass: "technology-scanner-card",
      emptyTitle: "Technology Scanner needs options.",
      emptyMessage: "Add items students can scan for technology use."
    });
  }

  static attachPlayerHandlers(container, config, complete) {
    attachMultiSelectHandlers(container, config, complete, {
      template: "technology-scanner",
      activityName: "Technology Scanner",
      revealCorrectOnIncorrect: false
    });
  }
}

class GridDetectiveRenderer {
  static renderPlayerShell(StepType, config) {
    return renderMultiSelectPlayerShell(StepType, config, {
      template: "grid-detective",
      shellClass: "grid-detective",
      optionClass: "grid-detective-card",
      emptyTitle: "Grid Detective needs clues.",
      emptyMessage: "Add options and correct answers in the Multi Select editor."
    });
  }

  static attachPlayerHandlers(container, config, complete) {
    attachMultiSelectHandlers(container, config, complete, {
      template: "grid-detective",
      activityName: "Grid Detective",
      revealCorrectOnIncorrect: true
    });
  }
}

var multiSelectTemplateMap = {
  "classic-multi-select": ClassicMultiSelectRenderer,
  "technology-scanner": TechnologyScannerRenderer,
  "grid-detective": GridDetectiveRenderer
};

class ScenarioChoiceRenderer {
  static renderPlayerShell(StepType, config) {
    var renderer = getScenarioChoiceTemplateRenderer(config);
    return renderer.renderPlayerShell(StepType, config);
  }

  static attachPlayerHandlers(container, config, complete) {
    var renderer = getScenarioChoiceTemplateRenderer(config);
    renderer.attachPlayerHandlers(container, config, complete);
  }
}

class ClassicScenarioChoiceRenderer {
  static renderPlayerShell(StepType, config) {
    return renderScenarioChoicePlayerShell(StepType, config, {
      template: "classic-scenario-choice",
      shellClass: "scenario-choice-classic",
      optionClass: "scenario-choice-option",
      emptyTitle: "Scenario Choice needs options.",
      emptyMessage: "Add a scenario, response options, and the best response in the editor."
    });
  }

  static attachPlayerHandlers(container, config, complete) {
    attachScenarioChoiceHandlers(container, config, complete, {
      template: "classic-scenario-choice",
      activityName: "Classic Scenario Choice",
      revealConsequence: false
    });
  }
}

class WhatHappensNextRenderer {
  static renderPlayerShell(StepType, config) {
    return renderScenarioChoicePlayerShell(StepType, config, {
      template: "what-happens-next",
      shellClass: "what-happens-next",
      optionClass: "scenario-choice-option scenario-choice-consequence-option",
      scenarioLabel: "Situation",
      emptyTitle: "What Happens Next needs a situation.",
      emptyMessage: "Add a scenario, choices, and the best response."
    });
  }

  static attachPlayerHandlers(container, config, complete) {
    attachScenarioChoiceHandlers(container, config, complete, {
      template: "what-happens-next",
      activityName: "What Happens Next",
      revealConsequence: true
    });
  }
}

class ClassroomHeroRenderer {
  static renderPlayerShell(StepType, config) {
    return renderScenarioChoicePlayerShell(StepType, config, {
      template: "classroom-hero",
      shellClass: "classroom-hero",
      optionClass: "scenario-choice-option classroom-hero-action",
      scenarioLabel: "Hero Moment",
      emptyTitle: "Classroom Hero needs a scenario.",
      emptyMessage: "Add a classroom situation and the responsible action students should choose."
    });
  }

  static attachPlayerHandlers(container, config, complete) {
    attachScenarioChoiceHandlers(container, config, complete, {
      template: "classroom-hero",
      activityName: "Classroom Hero",
      revealConsequence: true
    });
  }
}

var scenarioChoiceTemplateMap = {
  "classic-scenario-choice": ClassicScenarioChoiceRenderer,
  "what-happens-next": WhatHappensNextRenderer,
  "classroom-hero": ClassroomHeroRenderer
};

class AdventurePathRoadmap {
  static renderPlayerShell(StepType, config) {
    var data = createAdventurePathData(config);
    var body = "";

    body += '<div class="adventure-path-shell" data-adventure-path-root>';
    body += '<div class="adventure-path-header">';
    body += '<div>';
    body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Your Learning Roadmap")) + '</h2>';
    body += '<p>' + StepType.escapeHtml(readText(config, "instructions", "Follow the path through each checkpoint.")) + '</p>';
    body += '</div>';
    body += '<div class="adventure-path-meter" aria-label="Roadmap progress">';
    body += '<strong data-adventure-percent>0%</strong>';
    body += '<span><b data-adventure-current>1</b> of <b data-adventure-total>' + data.items.length + '</b> steps</span>';
    body += '</div>';
    body += '</div>';

    if (!data.valid) {
      body += '<div class="adventure-path-empty">';
      body += '<strong>Adventure Path needs roadmap items.</strong>';
      body += '<span>Add roadmap rows in the Roadmap editor using Number|Title|Description.</span>';
      body += '</div>';
      body += '</div>';
      return buildShell(StepType, config, body);
    }

    body += '<div class="adventure-path-progressbar" aria-hidden="true"><span data-adventure-bar style="width:0%;"></span></div>';
    body += '<div class="adventure-path-status" data-adventure-status aria-live="polite">Start with the first checkpoint.</div>';
    body += '<ol class="adventure-path-list" data-adventure-list>';
    data.items.forEach(function (item, index) {
      var sideClass = index % 2 === 0 ? "is-left" : "is-right";
      var stateClass = index === 0 ? "is-current" : "is-future";
      body += '<li class="adventure-path-stop ' + sideClass + ' ' + stateClass + '" data-adventure-stop>';
      body += '<button type="button" class="adventure-path-checkpoint" data-adventure-checkpoint data-roadmap-index="' + index + '" aria-current="' + (index === 0 ? "step" : "false") + '"' + (index > 0 ? " disabled" : "") + '>';
      body += '<span class="adventure-path-node" data-adventure-node>' + StepType.escapeHtml(index === 0 ? item.number : "🔒") + '</span>';
      body += '<span class="adventure-path-copy">';
      body += '<strong>' + StepType.escapeHtml(item.title) + '</strong>';
      body += '<em>' + StepType.escapeHtml(item.description) + '</em>';
      body += '</span>';
      body += '</button>';
      body += '</li>';
    });
    body += '</ol>';
    body += '<div class="adventure-path-complete" data-adventure-complete hidden>';
    body += '<strong>Roadmap complete.</strong>';
    body += '<span>You reached every checkpoint.</span>';
    body += '</div>';
    body += '</div>';

    return buildShell(StepType, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var data = createAdventurePathData(config);
    var state = {
      currentIndex: 0,
      completedCount: 0,
      completed: false
    };

    if (!data.valid) {
      return;
    }

    updateAdventurePath(container, data, state);

    container.addEventListener("click", function (event) {
      var checkpoint = event.target && event.target.closest ? event.target.closest("[data-adventure-checkpoint]") : null;

      if (!checkpoint) {
        return;
      }

      handleAdventurePathCheckpoint(container, checkpoint, data, state, complete);
    });
  }
}

class LevelUnlockRoadmap {
  static renderPlayerShell(StepType, config) {
    var data = createLevelUnlockData(config);
    var body = "";

    body += '<div class="level-unlock-shell" data-level-unlock-root>';
    body += '<div class="level-unlock-header">';
    body += '<div>';
    body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Level Unlock Map")) + '</h2>';
    body += '<p>' + StepType.escapeHtml(readText(config, "instructions", "Complete each level to unlock the next one.")) + '</p>';
    body += '</div>';
    body += '<div class="level-unlock-summary" aria-label="Roadmap summary">';
    body += '<div><span>Current Level</span><strong><b data-level-current>1</b> of <b data-level-total>' + data.items.length + '</b></strong></div>';
    body += '<div><span>XP</span><strong data-level-xp>0</strong></div>';
    body += '<div><span>Stars</span><strong data-level-stars-total>0</strong></div>';
    body += '</div>';
    body += '</div>';

    if (!data.valid) {
      body += '<div class="level-unlock-empty">';
      body += '<strong>Level Unlock Map needs roadmap items.</strong>';
      body += '<span>Add roadmap rows in the Roadmap editor using Number|Title|Description.</span>';
      body += '</div>';
      body += '</div>';
      return buildShell(StepType, config, body);
    }

    body += '<div class="level-unlock-progress" aria-label="Roadmap progress">';
    body += '<span data-level-bar style="width:0%;"></span>';
    body += '</div>';
    body += '<div class="level-unlock-status" data-level-status aria-live="polite">Level 1 is available.</div>';
    body += '<ol class="level-unlock-list" data-level-list>';
    data.items.forEach(function (item, index) {
      var stateClass = index === 0 ? "is-available" : "is-locked";
      body += '<li class="level-unlock-stop ' + stateClass + '" data-level-stop data-node-id="' + StepType.escapeHtml(item.nodeId) + '">';
      body += '<button type="button" class="level-unlock-node" data-level-node data-roadmap-index="' + index + '" aria-current="' + (index === 0 ? "step" : "false") + '"' + (index > 0 ? " disabled" : "") + '>';
      body += '<span class="level-unlock-badge" data-level-badge aria-hidden="true">' + (index === 0 ? "▶" : "🔒") + '</span>';
      body += '<span class="level-unlock-copy">';
      body += '<strong>' + StepType.escapeHtml(item.title) + '</strong>';
      body += '<em>' + StepType.escapeHtml(item.description) + '</em>';
      body += '</span>';
      body += '<span class="level-unlock-rewards">';
      body += '<span data-level-node-stars aria-label="0 stars">' + renderStars(0) + '</span>';
      body += '<span><b data-level-node-xp>0</b> XP</span>';
      body += '<span data-level-node-score>Locked</span>';
      body += '</span>';
      body += '</button>';
      body += '</li>';
    });
    body += '</ol>';
    body += '<div class="level-unlock-complete" data-level-complete hidden>';
    body += '<strong>Roadmap complete.</strong>';
    body += '<span>Every level is complete. Revisit levels any time to keep building mastery.</span>';
    body += '</div>';
    body += '</div>';

    return buildShell(StepType, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var data = createLevelUnlockData(config);
    var state = createLevelUnlockState(data);

    if (!data.valid) {
      return;
    }

    updateLevelUnlockMap(container, data, state);

    container.addEventListener("click", function (event) {
      var node = event.target && event.target.closest ? event.target.closest("[data-level-node]") : null;

      if (!node) {
        return;
      }

      handleLevelUnlockNode(container, node, data, state, complete);
    });
  }
}

var roadmapThemeRendererMap = {
  "adventure-path": AdventurePathRoadmap,
  "level-unlock-map": LevelUnlockRoadmap
};

function getRoadmapTemplateRenderer(config) {
  var templateId = normalizeActivityTemplateId("roadmap", readRawActivityTemplateId(config));

  return roadmapThemeRendererMap[templateId] || null;
}

function createAdventurePathData(config) {
  var rawRoadmapText = typeof config.roadmapText === "string" ? config.roadmapText.trim() : "";
  var items = rawRoadmapText ? parseRoadmapItems(rawRoadmapText).filter(function (item) {
    return item.title || item.description;
  }) : [];

  return {
    items: items,
    valid: items.length > 0
  };
}

function handleAdventurePathCheckpoint(container, checkpoint, data, state, complete) {
  var index = Number(checkpoint.getAttribute("data-roadmap-index"));

  if (state.completed || index !== state.currentIndex) {
    return;
  }

  checkpoint.classList.add("is-activating");
  window.setTimeout(function () {
    checkpoint.classList.remove("is-activating");
  }, 380);

  state.completedCount = Math.max(state.completedCount, index + 1);
  state.currentIndex = Math.min(index + 1, data.items.length - 1);
  updateAdventurePath(container, data, state);

  if (state.completedCount >= data.items.length) {
    completeAdventurePath(container, data, state, complete);
  }
}

function updateAdventurePath(container, data, state) {
  var stops = container.querySelectorAll("[data-adventure-stop]");
  var currentElement = container.querySelector("[data-adventure-current]");
  var totalElement = container.querySelector("[data-adventure-total]");
  var percentElement = container.querySelector("[data-adventure-percent]");
  var barElement = container.querySelector("[data-adventure-bar]");
  var statusElement = container.querySelector("[data-adventure-status]");
  var percent = data.items.length > 0 ? Math.round((state.completedCount / data.items.length) * 100) : 0;

  forEachElement(stops, function (stop, index) {
    var checkpoint = stop.querySelector("[data-adventure-checkpoint]");
    var node = stop.querySelector("[data-adventure-node]");
    var item = data.items[index] || {};
    var isComplete = index < state.completedCount;
    var isCurrent = !state.completed && index === state.currentIndex && !isComplete;
    var isFuture = !isComplete && !isCurrent;

    stop.classList.toggle("is-complete", isComplete);
    stop.classList.toggle("is-current", isCurrent);
    stop.classList.toggle("is-future", isFuture);

    if (checkpoint) {
      checkpoint.disabled = !isCurrent;
      checkpoint.setAttribute("aria-current", isCurrent ? "step" : "false");
      checkpoint.setAttribute("aria-pressed", isComplete ? "true" : "false");
    }

    if (node) {
      node.textContent = isComplete ? "✓" : isFuture ? "🔒" : item.number;
    }
  });

  if (currentElement) {
    currentElement.textContent = String(Math.min(state.completedCount + 1, data.items.length));
  }
  if (totalElement) {
    totalElement.textContent = String(data.items.length);
  }
  if (percentElement) {
    percentElement.textContent = percent + "%";
  }
  if (barElement) {
    barElement.style.width = percent + "%";
  }
  if (statusElement) {
    if (state.completedCount >= data.items.length) {
      statusElement.textContent = "Every checkpoint is complete.";
    } else {
      statusElement.textContent = "Current checkpoint: " + data.items[state.currentIndex].title;
    }
  }
}

function completeAdventurePath(container, data, state, complete) {
  var completeElement = container.querySelector("[data-adventure-complete]");

  if (state.completed) {
    return;
  }

  state.completed = true;
  if (completeElement) {
    completeElement.hidden = false;
  }
  updateAdventurePath(container, data, state);
  complete({
    success: true,
    score: 100,
    data: {
      completedItems: data.items.length,
      template: "adventure-path"
    }
  });
}

function createLevelUnlockData(config) {
  var roadmapData = createAdventurePathData(config);
  var items = roadmapData.items.map(function (item, index) {
    return Object.assign({}, item, {
      nodeId: createRoadmapNodeId(item, index)
    });
  });
  var unlockMode = readText(config, "unlockMode", "sequential");

  if (["sequential", "free-choice", "mastery-required"].indexOf(unlockMode) === -1) {
    unlockMode = "sequential";
  }

  return {
    items: items,
    unlockMode: unlockMode,
    valid: items.length > 0
  };
}

function createLevelUnlockState(data) {
  return {
    currentIndex: 0,
    unlockedIndex: data.unlockMode === "free-choice" ? data.items.length - 1 : 0,
    completedCount: 0,
    inProgressIndex: null,
    nodeProgress: {},
    startedAt: Date.now(),
    completed: false
  };
}

function handleLevelUnlockNode(container, node, data, state, complete) {
  var index = Number(node.getAttribute("data-roadmap-index"));
  var status = readLevelUnlockNodeStatus(index, state);

  if (state.completed || status === "locked" || status === "completed" || status === "mastered" || status === "in-progress") {
    return;
  }

  state.inProgressIndex = index;
  if (!state.nodeProgress[index]) {
    state.nodeProgress[index] = {
      nodeId: data.items[index].nodeId,
      startedAt: new Date().toISOString(),
      completed: false,
      mastered: false,
      starsEarned: 0,
      xpEarned: 0,
      bestScore: 0
    };
  }

  updateLevelUnlockMap(container, data, state);

  window.setTimeout(function () {
    completeLevelUnlockNode(container, data, state, index, complete);
  }, 360);
}

function completeLevelUnlockNode(container, data, state, index, complete) {
  var progress = state.nodeProgress[index] || {};
  var summary = readGamificationSummary("Level " + (index + 1), 1, 1, true, state.startedAt);
  var isMastered = summary.accuracy >= 90 && summary.stars === 3;

  if (state.completed || progress.completed) {
    return;
  }

  state.nodeProgress[index] = Object.assign({}, progress, {
    completed: true,
    completedAt: new Date().toISOString(),
    starsEarned: summary.stars,
    xpEarned: summary.xpEarned,
    bestScore: summary.accuracy,
    mastered: isMastered,
    gamification: summary
  });
  state.inProgressIndex = null;
  state.completedCount = countCompletedLevelUnlockNodes(state);
  state.currentIndex = Math.min(state.completedCount, data.items.length - 1);

  if (data.unlockMode === "free-choice") {
    state.unlockedIndex = data.items.length - 1;
  } else if (data.unlockMode === "mastery-required") {
    state.unlockedIndex = isMastered ? Math.max(state.unlockedIndex, index + 1) : index;
  } else {
    state.unlockedIndex = Math.max(state.unlockedIndex, index + 1);
  }

  state.unlockedIndex = Math.min(state.unlockedIndex, data.items.length - 1);
  updateLevelUnlockMap(container, data, state);
  setLevelUnlockStatus(container, isMastered ? "🏆 Mastery Achieved!" : "✨ New Level Unlocked!");

  if (state.completedCount >= data.items.length) {
    completeLevelUnlockMap(container, data, state, complete);
  }
}

function updateLevelUnlockMap(container, data, state) {
  var stops = container.querySelectorAll("[data-level-stop]");
  var currentElement = container.querySelector("[data-level-current]");
  var totalElement = container.querySelector("[data-level-total]");
  var xpElement = container.querySelector("[data-level-xp]");
  var starsElement = container.querySelector("[data-level-stars-total]");
  var barElement = container.querySelector("[data-level-bar]");
  var percent = data.items.length > 0 ? Math.round((state.completedCount / data.items.length) * 100) : 0;
  var totals = calculateLevelUnlockTotals(state);

  forEachElement(stops, function (stop, index) {
    var node = stop.querySelector("[data-level-node]");
    var badge = stop.querySelector("[data-level-badge]");
    var nodeStars = stop.querySelector("[data-level-node-stars]");
    var nodeXp = stop.querySelector("[data-level-node-xp]");
    var nodeScore = stop.querySelector("[data-level-node-score]");
    var progress = state.nodeProgress[index] || {};
    var status = readLevelUnlockNodeStatus(index, state);

    stop.classList.toggle("is-locked", status === "locked");
    stop.classList.toggle("is-available", status === "available");
    stop.classList.toggle("is-in-progress", status === "in-progress");
    stop.classList.toggle("is-completed", status === "completed");
    stop.classList.toggle("is-mastered", status === "mastered");

    if (node) {
      node.disabled = status === "locked" || status === "in-progress" || status === "completed" || status === "mastered";
      node.setAttribute("aria-current", status === "available" || status === "in-progress" ? "step" : "false");
      node.setAttribute("aria-pressed", progress.completed ? "true" : "false");
      node.setAttribute("aria-label", readLevelUnlockAriaLabel(data.items[index], index, status, progress));
    }
    if (badge) {
      badge.textContent = readLevelUnlockBadge(status, data.items[index], index);
    }
    if (nodeStars) {
      nodeStars.innerHTML = renderStars(progress.starsEarned || 0);
      nodeStars.setAttribute("aria-label", (progress.starsEarned || 0) + " stars");
    }
    if (nodeXp) {
      nodeXp.textContent = String(progress.xpEarned || 0);
    }
    if (nodeScore) {
      nodeScore.textContent = readLevelUnlockScoreLabel(status, progress);
    }
  });

  if (currentElement) {
    currentElement.textContent = String(Math.min(state.completedCount + 1, data.items.length));
  }
  if (totalElement) {
    totalElement.textContent = String(data.items.length);
  }
  if (xpElement) {
    xpElement.textContent = String(totals.xpEarned);
  }
  if (starsElement) {
    starsElement.textContent = String(totals.starsEarned);
  }
  if (barElement) {
    barElement.style.width = percent + "%";
  }
  if (!state.completed) {
    updateLevelUnlockStatusText(container, data, state, percent);
  }
}

function updateLevelUnlockStatusText(container, data, state, percent) {
  var currentItem = data.items[state.currentIndex] || data.items[data.items.length - 1];

  if (state.inProgressIndex !== null) {
    setLevelUnlockStatus(container, "Level " + (state.inProgressIndex + 1) + " is in progress.");
  } else if (state.completedCount >= data.items.length) {
    setLevelUnlockStatus(container, "All levels are complete. Progress: " + percent + "%.");
  } else if (currentItem) {
    setLevelUnlockStatus(container, "Available now: " + currentItem.title + ".");
  }
}

function completeLevelUnlockMap(container, data, state, complete) {
  var completeElement = container.querySelector("[data-level-complete]");
  var totals = calculateLevelUnlockTotals(state);
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var summary = createGamificationSummary({
    correctAnswers: state.completedCount,
    totalAnswers: data.items.length,
    completed: true,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: "Level Unlock Roadmap",
    message: "Every level is unlocked. Keep revisiting to protect your mastery."
  });

  if (state.completed) {
    return;
  }

  state.completed = true;
  updateLevelUnlockMap(container, data, state);
  if (completeElement) {
    completeElement.hidden = false;
    completeElement.innerHTML = renderActivityResults(summary);
  }

  complete({
    success: true,
    score: summary.accuracy,
    data: {
      completed: true,
      mastered: totals.masteredCount === data.items.length,
      completedLevels: state.completedCount,
      totalLevels: data.items.length,
      starsEarned: totals.starsEarned,
      xpEarned: totals.xpEarned,
      completionTimeSeconds: completionTimeSeconds,
      progressPercent: summary.accuracy,
      gamification: summary,
      achievements: summary.achievements,
      achievementCandidates: summary.perfect ? ["first-perfect-score", "level-unlock-master"] : [],
      analytics: readLevelUnlockAnalytics(state),
      nodeProgress: readLevelUnlockAnalytics(state),
      unlockMode: data.unlockMode,
      template: "level-unlock-map"
    }
  });
}

function readLevelUnlockNodeStatus(index, state) {
  var progress = state.nodeProgress[index] || {};

  if (progress.mastered) {
    return "mastered";
  }

  if (progress.completed) {
    return "completed";
  }

  if (state.inProgressIndex === index) {
    return "in-progress";
  }

  if (index <= state.unlockedIndex) {
    return "available";
  }

  return "locked";
}

function readLevelUnlockBadge(status, item, index) {
  if (status === "locked") {
    return "🔒";
  }
  if (status === "available") {
    return "▶";
  }
  if (status === "in-progress") {
    return "⭐";
  }
  if (status === "mastered") {
    return "🏆";
  }
  if (status === "completed") {
    return "✓";
  }

  return item && item.number ? item.number : String(index + 1);
}

function readLevelUnlockScoreLabel(status, progress) {
  if (status === "locked") {
    return "Locked";
  }
  if (status === "available") {
    return "Available";
  }
  if (status === "in-progress") {
    return "In progress";
  }
  if (status === "mastered") {
    return "Mastered";
  }
  if (progress.completed) {
    return "Completed";
  }

  return "Available";
}

function readLevelUnlockAriaLabel(item, index, status, progress) {
  var title = item && item.title ? item.title : "Level " + (index + 1);
  var scoreText = progress && progress.completed ? ", " + (progress.starsEarned || 0) + " stars, " + (progress.xpEarned || 0) + " XP" : "";

  return title + ", " + status.replace("-", " ") + scoreText;
}

function calculateLevelUnlockTotals(state) {
  var totals = {
    xpEarned: 0,
    starsEarned: 0,
    masteredCount: 0
  };

  Object.keys(state.nodeProgress).forEach(function (key) {
    var progress = state.nodeProgress[key] || {};

    totals.xpEarned = totals.xpEarned + (Number(progress.xpEarned) || 0);
    totals.starsEarned = totals.starsEarned + (Number(progress.starsEarned) || 0);
    if (progress.mastered) {
      totals.masteredCount = totals.masteredCount + 1;
    }
  });

  return totals;
}

function countCompletedLevelUnlockNodes(state) {
  var count = 0;

  Object.keys(state.nodeProgress).forEach(function (key) {
    if (state.nodeProgress[key] && state.nodeProgress[key].completed) {
      count = count + 1;
    }
  });

  return count;
}

function readLevelUnlockAnalytics(state) {
  var analytics = [];

  Object.keys(state.nodeProgress).forEach(function (key) {
    var progress = state.nodeProgress[key] || {};

    analytics.push({
      nodeId: progress.nodeId || key,
      startedAt: progress.startedAt || "",
      completedAt: progress.completedAt || "",
      starsEarned: Number(progress.starsEarned) || 0,
      xpEarned: Number(progress.xpEarned) || 0,
      bestScore: Number(progress.bestScore) || 0,
      completed: progress.completed === true,
      mastered: progress.mastered === true
    });
  });

  return analytics;
}

function setLevelUnlockStatus(container, message) {
  var statusElement = container.querySelector("[data-level-status]");

  if (statusElement) {
    statusElement.textContent = message;
  }
}

function createRoadmapNodeId(item, index) {
  var raw = [item.number, item.title].join("-").toLowerCase();
  var slug = raw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return slug || "level-" + (index + 1);
}

class MemoryGameMatchingTemplate {
  static renderPlayerShell(StepType, config) {
    var data = createMemoryGameData(config);
    var body = "";

    body += '<div class="memory-game-shell" data-memory-game-root>';
    body += '<div class="memory-game-header">';
    body += '<div>';
    body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Memory Match")) + '</h2>';
    body += '<p>' + StepType.escapeHtml(readText(config, "instructions", "Flip two cards and find each matching pair.")) + '</p>';
    body += '</div>';
    body += '<div class="memory-game-progress"><strong data-memory-found>0</strong><span>of <b data-memory-total>' + data.pairs.length + '</b> pairs</span></div>';
    body += '</div>';

    if (!data.valid) {
      body += '<div class="memory-game-empty">';
      body += '<strong>Memory Game needs matching pairs.</strong>';
      body += '<span>Add pairs in the Matching editor using Term|Meaning, then preview again.</span>';
      body += '</div>';
      body += '</div>';
      return buildShell(StepType, config, body);
    }

    body += '<div class="memory-game-feedback" data-memory-feedback aria-live="polite">Flip two cards to find a match.</div>';
    body += '<div class="memory-game-grid" data-memory-grid>';
    data.cards.forEach(function (card) {
      body += '<button type="button" class="memory-card" data-memory-card data-pair-id="' + card.pairId + '" data-card-id="' + card.cardId + '">';
      body += '<span class="memory-card-inner">';
      body += '<span class="memory-card-front" aria-hidden="true">?</span>';
      body += '<span class="memory-card-back">' + StepType.escapeHtml(card.text) + '</span>';
      body += '</span>';
      body += '</button>';
    });
    body += '</div>';
    body += '<div class="memory-game-complete" data-memory-complete hidden>';
    body += '<strong>' + StepType.escapeHtml(readText(config, "successText", "Great matching!")) + '</strong>';
    body += '<span>All pairs matched.</span>';
    body += '</div>';
    body += '</div>';

    return buildShell(StepType, config, body);
  }

  static attachPlayerHandlers(container, config, complete) {
    var data = createMemoryGameData(config);
    var cards = container.querySelectorAll("[data-memory-card]");
    var state = {
      selectedCards: [],
      matchedPairs: {},
      matchedCount: 0,
      incorrectCount: 0,
      locked: false,
      completed: false
    };

    if (!data.valid || cards.length === 0) {
      return;
    }

    updateMemoryGameProgress(container, state, data.pairs.length);

    forEachElement(cards, function (card) {
      card.addEventListener("click", function () {
        handleMemoryCardFlip(container, card, state, data, complete);
      });
    });
  }
}

var matchingTemplateRenderers = {
  "memory-game": MemoryGameMatchingTemplate
};

function getMatchingTemplateRenderer(config) {
  var templateId = normalizeActivityTemplateId("matching", readRawActivityTemplateId(config));

  return matchingTemplateRenderers[templateId] || null;
}

function createMemoryGameData(config) {
  var rawPairsText = typeof config.pairsText === "string" ? config.pairsText.trim() : "";
  var pairs = rawPairsText ? parsePairs(rawPairsText).filter(function (pair) {
    return pair.left && pair.right;
  }) : [];
  var cards = [];

  pairs.forEach(function (pair, index) {
    cards.push({ pairId: String(index), cardId: String(index) + "-term", text: pair.left });
    cards.push({ pairId: String(index), cardId: String(index) + "-definition", text: pair.right });
  });

  return {
    pairs: pairs,
    cards: shuffleCards(cards),
    valid: pairs.length > 0
  };
}

function shuffleCards(cards) {
  var shuffled = Array.isArray(cards) ? cards.slice() : [];
  var index = shuffled.length - 1;

  while (index > 0) {
    var swapIndex = Math.floor(Math.random() * (index + 1));
    var card = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = card;
    index = index - 1;
  }

  return shuffled;
}

function handleMemoryCardFlip(container, card, state, data, complete) {
  if (state.locked || state.completed || card.classList.contains("is-matched") || card.classList.contains("is-flipped")) {
    return;
  }

  card.classList.add("is-flipped");
  state.selectedCards.push(card);

  if (state.selectedCards.length === 1) {
    setMemoryFeedback(container, "Find the matching card.", "");
    return;
  }

  if (state.selectedCards.length < 2) {
    return;
  }

  compareMemoryCards(container, state, data, complete);
}

function compareMemoryCards(container, state, data, complete) {
  var firstCard = state.selectedCards[0];
  var secondCard = state.selectedCards[1];
  var firstPairId = firstCard.getAttribute("data-pair-id") || "";
  var secondPairId = secondCard.getAttribute("data-pair-id") || "";
  var isMatch = firstPairId && firstPairId === secondPairId && firstCard !== secondCard;

  state.locked = true;

  if (isMatch) {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
    state.matchedPairs[firstPairId] = true;
    state.matchedCount = Object.keys(state.matchedPairs).length;
    state.selectedCards = [];
    state.locked = false;
    setMemoryFeedback(container, "Match found.", "correct");
    updateMemoryGameProgress(container, state, data.pairs.length);
    completeMemoryGameIfReady(container, state, data, complete);
    return;
  }

  firstCard.classList.add("is-wrong");
  secondCard.classList.add("is-wrong");
  state.incorrectCount = state.incorrectCount + 1;
  setMemoryFeedback(container, "Not a match yet. Try again.", "incorrect");

  window.setTimeout(function () {
    firstCard.classList.remove("is-flipped", "is-wrong");
    secondCard.classList.remove("is-flipped", "is-wrong");
    state.selectedCards = [];
    state.locked = false;
    setMemoryFeedback(container, "Flip two cards to find a match.", "");
  }, 850);
}

function updateMemoryGameProgress(container, state, totalPairs) {
  var foundElement = container.querySelector("[data-memory-found]");
  var totalElement = container.querySelector("[data-memory-total]");

  if (foundElement) {
    foundElement.textContent = String(state.matchedCount);
  }

  if (totalElement) {
    totalElement.textContent = String(totalPairs);
  }
}

function completeMemoryGameIfReady(container, state, data, complete) {
  var completeElement = container.querySelector("[data-memory-complete]");
  var gamification = readGamificationSummary("Memory Game", state.matchedCount, state.matchedCount + state.incorrectCount, true);

  if (state.completed || state.matchedCount < data.pairs.length) {
    return;
  }

  state.completed = true;
  if (completeElement) {
    completeElement.hidden = false;
    completeElement.innerHTML = renderActivityResults(gamification);
  }
  setMemoryFeedback(container, "All pairs matched.", "correct");
  complete({
    success: true,
    score: 100,
    data: {
      matchedPairs: state.matchedCount,
      gamification: gamification,
      template: "memory-game"
    }
  });
}

function setMemoryFeedback(container, message, stateName) {
  var feedbackElement = container.querySelector("[data-memory-feedback]");

  if (!feedbackElement) {
    return;
  }

  feedbackElement.textContent = message;
  feedbackElement.classList.toggle("is-correct", stateName === "correct");
  feedbackElement.classList.toggle("is-incorrect", stateName === "incorrect");
}

function getMultiSelectTemplateRenderer(config) {
  var templateId = normalizeActivityTemplateId("multi-select", readRawActivityTemplateId(config));

  return multiSelectTemplateMap[templateId] || ClassicMultiSelectRenderer;
}

function renderMultiSelectPlayerShell(StepType, config, options) {
  var data = createMultiSelectData(config);
  var safeOptions = options || {};
  var template = safeOptions.template || "classic-multi-select";
  var shellClass = safeOptions.shellClass || "multi-select-classic";
  var optionClass = safeOptions.optionClass || "multi-select-option";
  var body = "";

  body += '<div class="multi-select-shell ' + shellClass + '" data-multi-select-root data-template="' + StepType.escapeHtml(template) + '">';
  body += '<div class="multi-select-header">';
  body += '<div>';
  body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Multi Select")) + '</h2>';
  body += '<p>' + StepType.escapeHtml(readText(config, "prompt", "Select all correct answers.")) + '</p>';
  body += '</div>';
  body += '<div class="multi-select-score"><strong data-multi-select-score>0</strong><span>Selected</span></div>';
  body += '</div>';

  if (!data.valid) {
    body += '<div class="multi-select-empty">';
    body += '<strong>' + StepType.escapeHtml(safeOptions.emptyTitle || "Multi Select needs options.") + '</strong>';
    body += '<span>' + StepType.escapeHtml(safeOptions.emptyMessage || "Add options and correct answers in the editor.") + '</span>';
    body += '</div>';
    body += '</div>';
    return buildShell(StepType, config, body);
  }

  body += '<div class="multi-select-streak" data-multi-select-streak>Streak: 0</div>';
  body += '<div class="multi-select-options" data-multi-select-options>';
  data.options.forEach(function (option, index) {
    if (safeOptions.inputType === "checkbox") {
      body += '<label class="' + optionClass + '" data-multi-select-option data-answer-key="' + StepType.escapeHtml(option.key) + '">';
      body += '<input type="checkbox" data-multi-select-input>';
      body += '<span>' + StepType.escapeHtml(option.label) + '</span>';
      body += '</label>';
      return;
    }

    body += '<button type="button" class="' + optionClass + '" data-multi-select-option data-answer-key="' + StepType.escapeHtml(option.key) + '">';
    body += '<span class="multi-select-card-number">' + (index + 1) + '</span>';
    body += '<strong>' + StepType.escapeHtml(option.label) + '</strong>';
    body += '</button>';
  });
  body += '</div>';
  body += '<div class="multi-select-feedback" data-multi-select-feedback aria-live="polite"></div>';
  body += '<button type="button" class="multi-select-submit" data-multi-select-submit>' + StepType.escapeHtml(readText(config, "buttonText", "Submit Answers")) + '</button>';
  body += '<div class="multi-select-results" data-multi-select-results hidden></div>';
  body += '</div>';

  return buildShell(StepType, config, body);
}

function attachMultiSelectHandlers(container, config, complete, options) {
  var data = createMultiSelectData(config);
  var safeOptions = options || {};
  var root = container.querySelector("[data-multi-select-root]");
  var optionList = container.querySelector("[data-multi-select-options]");
  var submitButton = container.querySelector("[data-multi-select-submit]");
  var state = {
    selectedKeys: {},
    attempts: 0,
    streak: 0,
    completed: false,
    startedAt: Date.now()
  };

  if (!data.valid || !root || !optionList || !submitButton) {
    return;
  }

  optionList.addEventListener("click", function (event) {
    var option = event.target && event.target.closest ? event.target.closest("[data-multi-select-option]") : null;

    if (event.target && event.target.closest && event.target.closest("[data-multi-select-input]")) {
      return;
    }

    if (!option || state.completed) {
      return;
    }

    if (option.querySelector("[data-multi-select-input]")) {
      event.preventDefault();
    }

    toggleMultiSelectOption(container, option, state);
  });

  optionList.addEventListener("change", function (event) {
    var input = event.target && event.target.closest ? event.target.closest("[data-multi-select-input]") : null;
    var option = input ? input.closest("[data-multi-select-option]") : null;

    if (!input || !option || state.completed) {
      return;
    }

    setMultiSelectOptionSelected(container, option, input.checked, state);
  });

  submitButton.addEventListener("click", function () {
    submitMultiSelect(container, config, data, state, safeOptions, complete);
  });

  updateMultiSelectSelectedCount(container, state);
}

function toggleMultiSelectOption(container, option, state) {
  var input = option.querySelector("[data-multi-select-input]");
  var selected = !option.classList.contains("is-selected");

  if (input) {
    input.checked = selected;
  }

  setMultiSelectOptionSelected(container, option, selected, state);
}

function setMultiSelectOptionSelected(container, option, selected, state) {
  var key = option.getAttribute("data-answer-key") || "";

  if (!key) {
    return;
  }

  if (selected) {
    state.selectedKeys[key] = true;
  } else {
    delete state.selectedKeys[key];
  }

  option.classList.toggle("is-selected", selected);
  clearMultiSelectMarkedState(container);
  setMultiSelectFeedback(container, "Choose all answers that fit, then submit.", "");
  updateMultiSelectSelectedCount(container, state);
}

function submitMultiSelect(container, config, data, state, options, complete) {
  var correct = isMultiSelectSelectionCorrect(state.selectedKeys, data.correctKeys);
  var selectedLabels = readSelectedMultiSelectLabels(data, state.selectedKeys);
  var summary = null;
  var streakUpdate = null;
  var submitButton = container.querySelector("[data-multi-select-submit]");
  var resultsElement = container.querySelector("[data-multi-select-results]");

  if (state.completed) {
    return;
  }

  state.attempts = state.attempts + 1;
  streakUpdate = updateStreak(state.streak, correct);
  state.streak = streakUpdate.streak;
  updateMultiSelectStreak(container, state, streakUpdate.milestone);
  markMultiSelectOptions(container, data, state.selectedKeys, correct || options.revealCorrectOnIncorrect);

  if (!correct) {
    setMultiSelectFeedback(container, createMultiSelectIncorrectFeedback(config, data, state, options), "incorrect");
    if (options.revealCorrectOnIncorrect) {
      appendMultiSelectCorrectAnswerList(container, data);
    }
    return;
  }

  state.completed = true;
  summary = readGamificationSummary(options.activityName || "Multi Select", data.correctAnswers.length, data.correctAnswers.length, true, state.startedAt);
  setMultiSelectFeedback(container, readText(config, "feedback", "Correct. You selected every matching answer."), "correct");
  if (submitButton) {
    submitButton.disabled = true;
  }
  if (resultsElement) {
    resultsElement.hidden = false;
    resultsElement.innerHTML = renderActivityResults(summary);
  }

  complete({
    success: true,
    score: 100,
    data: {
      selectedAnswers: selectedLabels,
      correctAnswers: data.correctAnswers.slice(),
      attempts: state.attempts,
      completionTimeSeconds: summary.completionTimeSeconds,
      gamification: summary,
      template: options.template || "classic-multi-select"
    }
  });
}

function createMultiSelectData(config) {
  var optionLabels = readConfigList(config.options, MultiSelectStep.defaultConfig.options);
  var correctLabels = readConfigList(config.correctAnswers, MultiSelectStep.defaultConfig.correctAnswers);
  var optionKeys = {};
  var correctKeys = {};
  var options = [];
  var correctAnswers = [];

  optionLabels.forEach(function (label) {
    var key = normalizeAnswerKey(label);
    if (key && !optionKeys[key]) {
      optionKeys[key] = true;
      options.push({ label: label, key: key });
    }
  });

  correctLabels.forEach(function (label) {
    var key = normalizeAnswerKey(label);
    if (key && optionKeys[key] && !correctKeys[key]) {
      correctKeys[key] = true;
      correctAnswers.push(label);
    }
  });

  return {
    options: options,
    correctAnswers: correctAnswers,
    correctKeys: correctKeys,
    valid: options.length > 0 && correctAnswers.length > 0
  };
}

function readConfigList(value, fallbackValue) {
  if (Array.isArray(value)) {
    return value.map(function (item) {
      return cleanMultiSelectLine(item);
    }).filter(Boolean);
  }

  return parseLines(typeof value === "string" ? value : fallbackValue, []).map(function (line) {
    return cleanMultiSelectLine(line);
  }).filter(Boolean);
}

function cleanMultiSelectLine(value) {
  return String(value == null ? "" : value).trim().replace(/^([-*]|\d+[.)])\s+/, "");
}

function normalizeAnswerKey(value) {
  return String(value == null ? "" : value).trim().replace(/\s+/g, " ").toLowerCase();
}

function isMultiSelectSelectionCorrect(selectedKeys, correctKeys) {
  var selected = Object.keys(selectedKeys || {}).sort();
  var correct = Object.keys(correctKeys || {}).sort();
  var index = 0;

  if (selected.length !== correct.length) {
    return false;
  }

  while (index < correct.length) {
    if (selected[index] !== correct[index]) {
      return false;
    }
    index = index + 1;
  }

  return true;
}

function createMultiSelectIncorrectFeedback(config, data, state, options) {
  var message = readText(config, "incorrectFeedback", "Not quite. Select every correct answer and remove anything that does not fit.");

  if (options && options.template === "grid-detective") {
    return "Score: " + countCorrectMultiSelectSelections(data, state.selectedKeys) + " / " + data.correctAnswers.length + ". " + message;
  }

  return message;
}

function countCorrectMultiSelectSelections(data, selectedKeys) {
  var count = 0;

  Object.keys(selectedKeys || {}).forEach(function (key) {
    if (data.correctKeys && data.correctKeys[key]) {
      count = count + 1;
    }
  });

  return count;
}

function markMultiSelectOptions(container, data, selectedKeys, revealCorrect) {
  var correctKeys = data.correctKeys || {};
  var options = container.querySelectorAll("[data-multi-select-option]");

  forEachElement(options, function (option) {
    var key = option.getAttribute("data-answer-key") || "";
    var selected = Boolean(selectedKeys[key]);
    var correct = Boolean(correctKeys[key]);

    option.classList.toggle("is-correct", correct && (selected || revealCorrect));
    option.classList.toggle("is-incorrect", selected && !correct);
    option.classList.toggle("is-missed", revealCorrect && correct && !selected);
  });
}

function clearMultiSelectMarkedState(container) {
  var options = container.querySelectorAll("[data-multi-select-option]");

  forEachElement(options, function (option) {
    option.classList.remove("is-correct", "is-incorrect", "is-missed");
  });
}

function updateMultiSelectSelectedCount(container, state) {
  var scoreElement = container.querySelector("[data-multi-select-score]");

  if (scoreElement) {
    scoreElement.textContent = String(Object.keys(state.selectedKeys || {}).length);
  }
}

function updateMultiSelectStreak(container, state, milestone) {
  var streakElement = container.querySelector("[data-multi-select-streak]");

  if (!streakElement) {
    return;
  }

  streakElement.textContent = milestone || ("Streak: " + state.streak);
  streakElement.classList.toggle("has-milestone", Boolean(milestone));
}

function setMultiSelectFeedback(container, message, stateName) {
  var feedbackElement = container.querySelector("[data-multi-select-feedback]");

  if (!feedbackElement) {
    return;
  }

  feedbackElement.textContent = message;
  feedbackElement.classList.toggle("is-correct", stateName === "correct");
  feedbackElement.classList.toggle("is-incorrect", stateName === "incorrect");
}

function appendMultiSelectCorrectAnswerList(container, data) {
  var feedbackElement = container.querySelector("[data-multi-select-feedback]");

  if (!feedbackElement) {
    return;
  }

  feedbackElement.innerHTML = BaseStep.escapeHtml(feedbackElement.textContent)
    + '<span class="multi-select-correct-list">Correct answers: '
    + BaseStep.escapeHtml(data.correctAnswers.join(", "))
    + '</span>';
}

function readSelectedMultiSelectLabels(data, selectedKeys) {
  var labels = [];

  data.options.forEach(function (option) {
    if (selectedKeys[option.key]) {
      labels.push(option.label);
    }
  });

  return labels;
}

function getScenarioChoiceTemplateRenderer(config) {
  var templateId = normalizeActivityTemplateId("scenario-choice", readRawActivityTemplateId(config));

  return scenarioChoiceTemplateMap[templateId] || ClassicScenarioChoiceRenderer;
}

function renderScenarioChoicePlayerShell(StepType, config, options) {
  var data = createScenarioChoiceData(config);
  var safeOptions = options || {};
  var template = safeOptions.template || "classic-scenario-choice";
  var shellClass = safeOptions.shellClass || "scenario-choice-classic";
  var optionClass = safeOptions.optionClass || "scenario-choice-option";
  var scenarioLabel = safeOptions.scenarioLabel || "Scenario";
  var body = "";

  body += '<div class="scenario-choice-shell ' + shellClass + '" data-scenario-choice-root data-template="' + StepType.escapeHtml(template) + '">';
  body += '<div class="scenario-choice-header">';
  body += '<div>';
  body += '<h2>' + StepType.escapeHtml(readText(config, "title", "Scenario Choice")) + '</h2>';
  body += '<p>' + StepType.escapeHtml("Choose the best response for this real-world situation.") + '</p>';
  body += '</div>';
  body += '<div class="scenario-choice-score"><strong data-scenario-attempts>0</strong><span>Attempts</span></div>';
  body += '</div>';

  if (!data.valid) {
    body += '<div class="scenario-choice-empty">';
    body += '<strong>' + StepType.escapeHtml(safeOptions.emptyTitle || "Scenario Choice needs content.") + '</strong>';
    body += '<span>' + StepType.escapeHtml(safeOptions.emptyMessage || "Add a scenario, choices, and a correct answer in the editor.") + '</span>';
    body += '</div>';
    body += '</div>';
    return buildShell(StepType, config, body);
  }

  body += '<div class="scenario-choice-card">';
  if (template === "classroom-hero") {
    body += '<div class="classroom-hero-avatar" aria-hidden="true">★</div>';
  }
  body += '<span class="scenario-choice-label">' + StepType.escapeHtml(scenarioLabel) + '</span>';
  body += '<p>' + StepType.escapeHtml(data.scenario) + '</p>';
  body += '</div>';
  body += '<div class="scenario-choice-streak" data-scenario-streak>Streak: 0</div>';
  body += '<div class="scenario-choice-options" data-scenario-options>';
  data.options.forEach(function (option, index) {
    body += '<button type="button" class="' + optionClass + '" data-scenario-option data-answer-key="' + StepType.escapeHtml(option.key) + '">';
    body += '<span class="scenario-choice-option-index">' + String.fromCharCode(65 + index) + '</span>';
    body += '<strong>' + StepType.escapeHtml(option.label) + '</strong>';
    body += '</button>';
  });
  body += '</div>';
  body += '<div class="scenario-choice-feedback" data-scenario-feedback aria-live="polite"></div>';
  body += '<button type="button" class="scenario-choice-submit" data-scenario-submit>' + StepType.escapeHtml(readText(config, "buttonText", "Submit Choice")) + '</button>';
  body += '<div class="scenario-choice-results" data-scenario-results hidden></div>';
  body += '</div>';

  return buildShell(StepType, config, body);
}

function attachScenarioChoiceHandlers(container, config, complete, options) {
  var data = createScenarioChoiceData(config);
  var safeOptions = options || {};
  var root = container.querySelector("[data-scenario-choice-root]");
  var optionList = container.querySelector("[data-scenario-options]");
  var submitButton = container.querySelector("[data-scenario-submit]");
  var state = {
    selectedKey: "",
    attempts: 0,
    streak: 0,
    completed: false,
    startedAt: Date.now()
  };

  if (!data.valid || !root || !optionList || !submitButton) {
    return;
  }

  optionList.addEventListener("click", function (event) {
    var option = event.target && event.target.closest ? event.target.closest("[data-scenario-option]") : null;

    if (!option || state.completed) {
      return;
    }

    selectScenarioChoiceOption(container, option, state);
  });

  submitButton.addEventListener("click", function () {
    submitScenarioChoice(container, config, data, state, safeOptions, complete);
  });

  updateScenarioChoiceAttempts(container, state);
}

function selectScenarioChoiceOption(container, option, state) {
  var key = option.getAttribute("data-answer-key") || "";
  var options = container.querySelectorAll("[data-scenario-option]");

  if (!key) {
    return;
  }

  clearScenarioChoiceMarkedState(container);
  forEachElement(options, function (item) {
    item.classList.toggle("is-selected", item === option);
  });
  state.selectedKey = key;
  setScenarioChoiceFeedback(container, "Submit when you are ready to make this decision.", "");
}

function submitScenarioChoice(container, config, data, state, options, complete) {
  var correct = false;
  var summary = null;
  var streakUpdate = null;
  var submitButton = container.querySelector("[data-scenario-submit]");
  var resultsElement = container.querySelector("[data-scenario-results]");

  if (state.completed) {
    return;
  }

  if (!state.selectedKey) {
    setScenarioChoiceFeedback(container, "Choose one response first.", "incorrect");
    return;
  }

  state.attempts = state.attempts + 1;
  correct = state.selectedKey === data.correctKey;
  streakUpdate = updateStreak(state.streak, correct);
  state.streak = streakUpdate.streak;
  updateScenarioChoiceAttempts(container, state);
  updateScenarioChoiceStreak(container, state, streakUpdate.milestone);
  markScenarioChoiceOptions(container, data, state.selectedKey, correct || options.revealConsequence);

  if (!correct) {
    setScenarioChoiceFeedback(container, createScenarioChoiceIncorrectFeedback(config, data, options), "incorrect");
    return;
  }

  state.completed = true;
  summary = readGamificationSummary(options.activityName || "Scenario Choice", 1, 1, true, state.startedAt);
  setScenarioChoiceFeedback(container, createScenarioChoiceSuccessFeedback(config, data, options), "correct");
  if (submitButton) {
    submitButton.disabled = true;
  }
  disableScenarioChoiceOptions(container);
  if (resultsElement) {
    resultsElement.hidden = false;
    resultsElement.innerHTML = renderCelebration("Activity Complete") + renderActivityResults(summary);
  }

  complete({
    success: true,
    score: 100,
    data: {
      selectedAnswer: data.optionLabelsByKey[state.selectedKey] || "",
      correctAnswer: data.correctAnswer,
      attempts: state.attempts,
      completionTimeSeconds: summary.completionTimeSeconds,
      gamification: summary,
      template: options.template || "classic-scenario-choice"
    }
  });
}

function createScenarioChoiceData(config) {
  var optionLabels = readConfigList(config.options, ScenarioChoiceStep.defaultConfig.options);
  var correctAnswer = cleanMultiSelectLine(readText(config, "correctAnswer", ScenarioChoiceStep.defaultConfig.correctAnswer));
  var optionKeys = {};
  var optionLabelsByKey = {};
  var options = [];
  var correctKey = normalizeAnswerKey(correctAnswer);

  optionLabels.forEach(function (label) {
    var key = normalizeAnswerKey(label);
    if (key && !optionKeys[key]) {
      optionKeys[key] = true;
      optionLabelsByKey[key] = label;
      options.push({ label: label, key: key });
    }
  });

  return {
    scenario: readText(config, "scenario", ScenarioChoiceStep.defaultConfig.scenario),
    options: options,
    correctAnswer: correctAnswer,
    correctKey: optionKeys[correctKey] ? correctKey : "",
    optionLabelsByKey: optionLabelsByKey,
    valid: options.length > 1 && Boolean(optionKeys[correctKey])
  };
}

function createScenarioChoiceSuccessFeedback(config, data, options) {
  var message = readText(config, "feedback", "Good choice.");
  var explanation = readText(config, "explanation", "");

  if (options && options.template === "what-happens-next" && explanation) {
    return message + " Consequence: " + explanation;
  }

  if (options && options.template === "classroom-hero" && explanation) {
    return message + " Hero move: " + explanation;
  }

  return explanation ? message + " " + explanation : message;
}

function createScenarioChoiceIncorrectFeedback(config, data, options) {
  var message = readText(config, "incorrectFeedback", "Think about the safest and most responsible choice.");
  var explanation = readText(config, "explanation", "");

  if (options && options.template === "what-happens-next") {
    message += " Consequence: " + (explanation || "The best choice protects you and others.");
  } else if (options && options.template === "classroom-hero") {
    message += " A hero choice is: " + data.correctAnswer + ".";
    if (explanation) {
      message += " " + explanation;
    }
  } else if (explanation) {
    message += " " + explanation;
  }

  return message;
}

function markScenarioChoiceOptions(container, data, selectedKey, revealCorrect) {
  var options = container.querySelectorAll("[data-scenario-option]");

  forEachElement(options, function (option) {
    var key = option.getAttribute("data-answer-key") || "";
    var selected = key === selectedKey;
    var correct = key === data.correctKey;

    option.classList.toggle("is-correct", correct && (selected || revealCorrect));
    option.classList.toggle("is-incorrect", selected && !correct);
  });
}

function clearScenarioChoiceMarkedState(container) {
  var options = container.querySelectorAll("[data-scenario-option]");

  forEachElement(options, function (option) {
    option.classList.remove("is-correct", "is-incorrect");
  });
}

function disableScenarioChoiceOptions(container) {
  var options = container.querySelectorAll("[data-scenario-option]");

  forEachElement(options, function (option) {
    option.disabled = true;
  });
}

function updateScenarioChoiceAttempts(container, state) {
  var attemptsElement = container.querySelector("[data-scenario-attempts]");

  if (attemptsElement) {
    attemptsElement.textContent = String(state.attempts);
  }
}

function updateScenarioChoiceStreak(container, state, milestone) {
  var streakElement = container.querySelector("[data-scenario-streak]");

  if (!streakElement) {
    return;
  }

  streakElement.textContent = milestone || ("Streak: " + state.streak);
  streakElement.classList.toggle("has-milestone", Boolean(milestone));
}

function setScenarioChoiceFeedback(container, message, stateName) {
  var feedbackElement = container.querySelector("[data-scenario-feedback]");

  if (!feedbackElement) {
    return;
  }

  feedbackElement.textContent = message;
  feedbackElement.classList.toggle("is-correct", stateName === "correct");
  feedbackElement.classList.toggle("is-incorrect", stateName === "incorrect");
}

function getMultipleChoiceTemplateRenderer(config) {
  var templateId = normalizeActivityTemplateId("multiple-choice", readRawActivityTemplateId(config));

  return multipleChoiceTemplateRenderers[templateId] || null;
}

function createQuizShowData(config) {
  var questionLines = parseLines(config.questionText, []);
  var text = typeof config.choicesText === "string" ? config.choicesText : "";
  var blocks = text.split(/\r?\n\s*\r?\n/).map(function (block) {
    return block.trim();
  }).filter(Boolean);
  var questions = [];

  if (questionLines.length === 0) {
    questionLines = [readText(config, "questionText", "Choose the correct answer.")];
  }

  if (blocks.length > 1) {
    blocks.forEach(function (block, index) {
      var questionText = questionLines[index] || questionLines[0] || "Question " + (index + 1);
      var choices = parseChoices(block);
      questions.push(createQuizShowQuestion(questionText, choices));
    });
  } else {
    questions.push(createQuizShowQuestion(questionLines.join(" "), parseChoices(config.choicesText)));
  }

  questions = questions.filter(function (question) {
    return question.question && question.choices.length > 0 && question.correctIndexes.length > 0;
  });

  return {
    questions: questions,
    feedbackCorrect: readText(config, "feedbackCorrect", "Correct!"),
    feedbackIncorrect: readText(config, "feedbackIncorrect", "Try again."),
    valid: questions.length > 0
  };
}

function createQuizShowQuestion(questionText, choices) {
  var safeChoices = Array.isArray(choices) ? choices : [];
  var correctIndexes = [];

  safeChoices.forEach(function (choice, index) {
    if (choice.correct) {
      correctIndexes.push(index);
    }
  });

  return {
    question: questionText,
    choices: safeChoices,
    correctIndexes: correctIndexes
  };
}

function renderQuizShowQuestion(container, data, state) {
  var question = data.questions[state.questionIndex];
  var questionElement = container.querySelector("[data-quiz-question]");
  var progressElement = container.querySelector("[data-quiz-progress]");
  var scoreElement = container.querySelector("[data-quiz-score]");
  var scorelineElement = container.querySelector("[data-quiz-scoreline]");
  var xpElement = container.querySelector("[data-quiz-xp]");
  var streakElement = container.querySelector("[data-quiz-streak]");
  var answersElement = container.querySelector("[data-quiz-answers]");
  var feedbackElement = container.querySelector("[data-quiz-feedback]");
  var nextButton = container.querySelector("[data-quiz-next]");
  var resultsElement = container.querySelector("[data-quiz-results]");
  var html = "";

  if (!question || !answersElement) {
    return;
  }

  if (questionElement) {
    questionElement.textContent = question.question;
  }
  if (progressElement) {
    progressElement.textContent = "Question " + (state.questionIndex + 1) + " of " + data.questions.length;
  }
  if (scoreElement) {
    scoreElement.textContent = String(state.correctCount);
  }
  if (scorelineElement) {
    scorelineElement.textContent = state.correctCount + " correct";
  }
  if (xpElement) {
    xpElement.textContent = String(readGamificationSummary("Quiz Show", state.correctCount, data.questions.length, false).xpEarned);
  }
  if (streakElement) {
    streakElement.textContent = "Streak: " + state.streak;
    streakElement.classList.remove("has-milestone");
  }
  if (feedbackElement) {
    feedbackElement.textContent = "";
    feedbackElement.innerHTML = "";
    feedbackElement.classList.remove("is-correct", "is-incorrect");
  }
  if (nextButton) {
    nextButton.hidden = true;
    nextButton.textContent = state.questionIndex >= data.questions.length - 1 ? "Show Results" : "Next Question";
  }
  if (resultsElement) {
    resultsElement.hidden = true;
  }

  question.choices.forEach(function (choice, index) {
    var letter = String.fromCharCode(65 + index);
    html += '<button type="button" class="quiz-show-answer" data-quiz-answer data-choice-index="' + index + '">';
    html += '<span class="quiz-show-answer-letter">' + letter + '</span>';
    html += '<span>' + BaseStep.escapeHtml(choice.label) + '</span>';
    html += '</button>';
  });

  answersElement.hidden = false;
  answersElement.innerHTML = html;
}

function handleQuizShowAnswer(container, button, data, state) {
  var question = data.questions[state.questionIndex];
  var selectedIndex = Number(button.getAttribute("data-choice-index"));
  var correct = question.correctIndexes.indexOf(selectedIndex) !== -1;
  var answerButtons = container.querySelectorAll("[data-quiz-answer]");
  var feedbackElement = container.querySelector("[data-quiz-feedback]");
  var nextButton = container.querySelector("[data-quiz-next]");
  var scoreElement = container.querySelector("[data-quiz-score]");
  var scorelineElement = container.querySelector("[data-quiz-scoreline]");
  var xpElement = container.querySelector("[data-quiz-xp]");
  var streakElement = container.querySelector("[data-quiz-streak]");
  var streakResult = updateStreak(state.streak, correct);
  var feedbackText = "";

  state.answered = true;
  state.streak = streakResult.streak;
  state.maxStreak = Math.max(state.maxStreak, state.streak);
  if (correct) {
    state.correctCount = state.correctCount + 1;
  }

  forEachElement(answerButtons, function (answerButton) {
    var answerIndex = Number(answerButton.getAttribute("data-choice-index"));
    var isCorrectAnswer = question.correctIndexes.indexOf(answerIndex) !== -1;
    answerButton.disabled = true;
    answerButton.classList.toggle("is-correct", isCorrectAnswer);
    answerButton.classList.toggle("is-incorrect", answerIndex === selectedIndex && !correct);
  });

  if (feedbackElement) {
    feedbackElement.classList.toggle("is-correct", correct);
    feedbackElement.classList.toggle("is-incorrect", !correct);
    feedbackText = correct
      ? data.feedbackCorrect
      : data.feedbackIncorrect + " Correct answer: " + readCorrectChoiceLabels(question).join(", ");
    if (correct && streakResult.milestone) {
      feedbackText = feedbackText + " " + streakResult.milestone;
    }
    feedbackElement.innerHTML = renderCelebration(correct ? "correct" : "incorrect")
      + '<span>' + BaseStep.escapeHtml(feedbackText) + '</span>';
  }
  if (scoreElement) {
    scoreElement.textContent = String(state.correctCount);
  }
  if (scorelineElement) {
    scorelineElement.textContent = state.correctCount + " correct";
  }
  if (xpElement) {
    xpElement.textContent = String(readGamificationSummary("Quiz Show", state.correctCount, data.questions.length, false).xpEarned);
  }
  if (streakElement) {
    streakElement.textContent = streakResult.milestone ? streakResult.milestone + " Streak: " + state.streak : "Streak: " + state.streak;
    streakElement.classList.toggle("has-milestone", Boolean(streakResult.milestone));
  }
  if (nextButton) {
    nextButton.hidden = false;
  }
}

function renderQuizShowResults(container, data, state, complete) {
  var questionElement = container.querySelector("[data-quiz-question]");
  var answersElement = container.querySelector("[data-quiz-answers]");
  var feedbackElement = container.querySelector("[data-quiz-feedback]");
  var nextButton = container.querySelector("[data-quiz-next]");
  var resultsElement = container.querySelector("[data-quiz-results]");
  var progressElement = container.querySelector("[data-quiz-progress]");
  var scoreElement = container.querySelector("[data-quiz-score]");
  var xpElement = container.querySelector("[data-quiz-xp]");
  var total = data.questions.length;
  var summary = readGamificationSummary("Quiz Show", state.correctCount, total, true, state.startedAt);

  if (state.completed) {
    return;
  }

  state.completed = true;

  if (questionElement) {
    questionElement.textContent = "Quiz Show Complete";
  }
  if (answersElement) {
    answersElement.hidden = true;
  }
  if (feedbackElement) {
    feedbackElement.textContent = "";
    feedbackElement.classList.remove("is-correct", "is-incorrect");
  }
  if (nextButton) {
    nextButton.hidden = true;
  }
  if (progressElement) {
    progressElement.textContent = "Results";
  }
  if (scoreElement) {
    scoreElement.textContent = String(state.correctCount);
  }
  if (xpElement) {
    xpElement.textContent = String(summary.xpEarned);
  }
  if (resultsElement) {
    resultsElement.hidden = false;
    resultsElement.innerHTML = renderActivityResults(summary);
    resultsElement.classList.toggle("is-perfect", summary.perfect);
  }

  complete({
    success: true,
    score: summary.accuracy,
    data: {
      correctCount: state.correctCount,
      totalQuestions: total,
      maxStreak: state.maxStreak,
      gamification: summary,
      template: "quiz-show"
    }
  });
}

function readCorrectChoiceLabels(question) {
  var labels = [];

  question.correctIndexes.forEach(function (index) {
    if (question.choices[index]) {
      labels.push(question.choices[index].label);
    }
  });

  return labels;
}

function readQuizShowEncouragement(percent) {
  if (percent >= 90) {
    return "Excellent work. You really know this.";
  }

  if (percent >= 70) {
    return "Nice job. You are getting stronger.";
  }

  return "Good effort. Review the answers and try again.";
}

function renderMillionaireQuestion(container, data, state) {
  var question = data.questions[state.questionIndex];
  var questionElement = container.querySelector("[data-millionaire-question]");
  var progressElement = container.querySelector("[data-millionaire-progress]");
  var streakElement = container.querySelector("[data-millionaire-streak]");
  var scoreElement = container.querySelector("[data-millionaire-score]");
  var answersElement = container.querySelector("[data-millionaire-answers]");
  var confirmElement = container.querySelector("[data-millionaire-confirm]");
  var feedbackElement = container.querySelector("[data-millionaire-feedback]");
  var nextButton = container.querySelector("[data-millionaire-next]");
  var resultsElement = container.querySelector("[data-millionaire-results]");
  var html = "";

  if (!question || !answersElement) {
    return;
  }

  state.selectedIndex = null;
  if (questionElement) {
    questionElement.textContent = question.question;
  }
  if (progressElement) {
    progressElement.textContent = "Question " + (state.questionIndex + 1) + " of " + data.questions.length;
  }
  if (streakElement) {
    streakElement.textContent = "Streak: " + state.streak;
    streakElement.classList.remove("has-milestone");
  }
  if (scoreElement) {
    scoreElement.textContent = String(state.score);
  }
  if (confirmElement) {
    confirmElement.hidden = true;
  }
  if (feedbackElement) {
    feedbackElement.innerHTML = "";
    feedbackElement.classList.remove("is-correct", "is-incorrect");
  }
  if (nextButton) {
    nextButton.hidden = true;
    nextButton.textContent = state.questionIndex >= data.questions.length - 1 ? "Show Results" : "Next Question";
  }
  if (resultsElement) {
    resultsElement.hidden = true;
  }

  question.choices.forEach(function (choice, index) {
    var letter = String.fromCharCode(65 + index);
    html += '<button type="button" class="millionaire-answer" data-millionaire-answer data-choice-index="' + index + '">';
    html += '<span class="millionaire-answer-letter">' + letter + '</span>';
    html += '<span>' + BaseStep.escapeHtml(choice.label) + '</span>';
    html += '</button>';
  });

  answersElement.hidden = false;
  answersElement.innerHTML = html;
  renderMillionaireLadder(container, data, state);
  updateMillionaireLifelineState(container, state);
}

function renderMillionaireLadder(container, data, state) {
  var ladder = container.querySelector("[data-millionaire-ladder]");
  var html = "";

  if (!ladder) {
    return;
  }

  data.questions.forEach(function (question, index) {
    var stateClass = index < state.questionIndex ? "is-complete" : index === state.questionIndex ? "is-current" : "is-future";
    html += '<div class="millionaire-ladder-step ' + stateClass + '">';
    html += '<span>Question ' + (index + 1) + '</span>';
    html += '<strong>' + ((index + 1) * 10) + ' pts</strong>';
    html += '</div>';
  });

  ladder.innerHTML = html;
}

function selectMillionaireAnswer(container, selectedIndex, state) {
  var confirmElement = container.querySelector("[data-millionaire-confirm]");
  var answers = container.querySelectorAll("[data-millionaire-answer]");

  state.selectedIndex = selectedIndex;
  forEachElement(answers, function (answer) {
    var isSelected = Number(answer.getAttribute("data-choice-index")) === selectedIndex;
    answer.classList.toggle("is-selected", isSelected);
  });
  if (confirmElement) {
    confirmElement.hidden = false;
  }
}

function clearMillionaireSelection(container, state) {
  var confirmElement = container.querySelector("[data-millionaire-confirm]");
  var answers = container.querySelectorAll("[data-millionaire-answer]");

  state.selectedIndex = null;
  forEachElement(answers, function (answer) {
    answer.classList.remove("is-selected");
  });
  if (confirmElement) {
    confirmElement.hidden = true;
  }
}

function confirmMillionaireAnswer(container, data, state) {
  var question = data.questions[state.questionIndex];
  var selectedIndex = state.selectedIndex;
  var correct = question && question.correctIndexes.indexOf(selectedIndex) !== -1;
  var answers = container.querySelectorAll("[data-millionaire-answer]");
  var confirmElement = container.querySelector("[data-millionaire-confirm]");
  var feedbackElement = container.querySelector("[data-millionaire-feedback]");
  var nextButton = container.querySelector("[data-millionaire-next]");
  var scoreElement = container.querySelector("[data-millionaire-score]");
  var streakElement = container.querySelector("[data-millionaire-streak]");
  var streakResult = updateStreak(state.streak, correct);
  var feedbackText = "";

  if (selectedIndex === null || !question) {
    return;
  }

  state.questionsAnswered = state.questionsAnswered + 1;
  state.streak = streakResult.streak;
  state.maxStreak = Math.max(state.maxStreak, state.streak);
  if (correct) {
    state.correctCount = state.correctCount + 1;
    state.score = state.score + 10;
  }

  forEachElement(answers, function (answer) {
    var answerIndex = Number(answer.getAttribute("data-choice-index"));
    var isCorrectAnswer = question.correctIndexes.indexOf(answerIndex) !== -1;
    answer.disabled = true;
    answer.classList.toggle("is-correct", isCorrectAnswer);
    answer.classList.toggle("is-incorrect", answerIndex === selectedIndex && !correct);
  });

  if (confirmElement) {
    confirmElement.hidden = true;
  }
  if (feedbackElement) {
    feedbackElement.classList.toggle("is-correct", correct);
    feedbackElement.classList.toggle("is-incorrect", !correct);
    feedbackText = correct
      ? "Correct. +" + 10 + " points."
      : "Not quite. Correct answer: " + readCorrectChoiceLabels(question).join(", ");
    if (correct && streakResult.milestone) {
      feedbackText = feedbackText + " " + streakResult.milestone;
    }
    feedbackElement.innerHTML = renderCelebration(correct ? "correct" : "incorrect")
      + '<span>' + BaseStep.escapeHtml(feedbackText) + '</span>';
  }
  if (scoreElement) {
    scoreElement.textContent = String(state.score);
  }
  if (streakElement) {
    streakElement.textContent = streakResult.milestone ? streakResult.milestone + " Streak: " + state.streak : "Streak: " + state.streak;
    streakElement.classList.toggle("has-milestone", Boolean(streakResult.milestone));
  }
  if (nextButton) {
    nextButton.hidden = false;
  }
  updateMillionaireLifelineState(container, state);
}

function advanceMillionaireQuestion(container, data, state, complete) {
  if (state.questionIndex >= data.questions.length - 1) {
    renderMillionaireResults(container, data, state, complete);
    return;
  }

  state.questionIndex = state.questionIndex + 1;
  renderMillionaireQuestion(container, data, state);
}

function useMillionaireLifeline(container, data, state, lifelineButton, complete) {
  var kind = lifelineButton.getAttribute("data-millionaire-lifeline") || "";

  if (state.completed || state.selectedIndex !== null || state.lifelinesUsed[kind]) {
    return;
  }

  state.lifelinesUsed[kind] = true;
  if (kind === "fifty") {
    useMillionaireFifty(container, data, state);
  } else if (kind === "hint") {
    useMillionaireHint(container, data, state);
  } else if (kind === "skip") {
    useMillionaireSkip(container, data, state, complete);
  }

  updateMillionaireLifelineState(container, state);
}

function useMillionaireFifty(container, data, state) {
  var question = data.questions[state.questionIndex];
  var answers = container.querySelectorAll("[data-millionaire-answer]");
  var removed = 0;

  forEachElement(answers, function (answer) {
    var answerIndex = Number(answer.getAttribute("data-choice-index"));
    var isCorrect = question.correctIndexes.indexOf(answerIndex) !== -1;
    if (!isCorrect && removed < 2) {
      answer.hidden = true;
      answer.disabled = true;
      removed = removed + 1;
    }
  });
  setMillionaireFeedback(container, "Two incorrect answers were removed.", "checkpoint");
}

function useMillionaireHint(container, data, state) {
  var question = data.questions[state.questionIndex];
  var labels = readCorrectChoiceLabels(question);
  var message = labels.length > 0
    ? "Hint: look for the answer that best matches " + labels[0].split(/\s+/).slice(0, 3).join(" ") + "."
    : "Hint: reread the question and eliminate answers that do not fit.";

  setMillionaireFeedback(container, message, "checkpoint");
}

function useMillionaireSkip(container, data, state, complete) {
  state.skippedCount = state.skippedCount + 1;
  state.questionsAnswered = state.questionsAnswered + 1;
  state.streak = 0;
  setMillionaireFeedback(container, "Question skipped. No points awarded.", "checkpoint");
  if (state.questionIndex >= data.questions.length - 1) {
    renderMillionaireResults(container, data, state, complete);
    return;
  }
  state.questionIndex = state.questionIndex + 1;
  window.setTimeout(function () {
    renderMillionaireQuestion(container, data, state);
  }, 320);
}

function updateMillionaireLifelineState(container, state) {
  var buttons = container.querySelectorAll("[data-millionaire-lifeline]");

  forEachElement(buttons, function (button) {
    var kind = button.getAttribute("data-millionaire-lifeline") || "";
    button.disabled = Boolean(state.lifelinesUsed[kind]) || state.selectedIndex !== null || state.completed;
    button.classList.toggle("is-used", Boolean(state.lifelinesUsed[kind]));
  });
}

function setMillionaireFeedback(container, message, kind) {
  var feedbackElement = container.querySelector("[data-millionaire-feedback]");

  if (!feedbackElement) {
    return;
  }

  feedbackElement.classList.remove("is-correct", "is-incorrect");
  feedbackElement.innerHTML = renderCelebration(kind || "checkpoint")
    + '<span>' + BaseStep.escapeHtml(message) + '</span>';
}

function renderMillionaireResults(container, data, state, complete) {
  var answersElement = container.querySelector("[data-millionaire-answers]");
  var questionElement = container.querySelector("[data-millionaire-question]");
  var confirmElement = container.querySelector("[data-millionaire-confirm]");
  var feedbackElement = container.querySelector("[data-millionaire-feedback]");
  var nextButton = container.querySelector("[data-millionaire-next]");
  var resultsElement = container.querySelector("[data-millionaire-results]");
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var accuracy = data.questions.length > 0 ? Math.round((state.correctCount / data.questions.length) * 100) : 0;
  var lifelinesUsedCount = Object.keys(state.lifelinesUsed).length;
  var summary = createGamificationSummary({
    correctAnswers: state.correctCount,
    totalAnswers: data.questions.length,
    completed: true,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: "Millionaire Style"
  });

  if (state.completed) {
    return;
  }

  state.completed = true;
  updateMillionaireLifelineState(container, state);

  if (answersElement) {
    answersElement.hidden = true;
  }
  if (questionElement) {
    questionElement.textContent = "Millionaire Style Complete";
  }
  if (confirmElement) {
    confirmElement.hidden = true;
  }
  if (feedbackElement) {
    feedbackElement.innerHTML = summary.perfect
      ? renderCelebration("perfect") + '<span>Perfect score. Excellent work.</span>'
      : "";
  }
  if (nextButton) {
    nextButton.hidden = true;
  }
  if (resultsElement) {
    resultsElement.hidden = false;
    resultsElement.innerHTML = renderActivityResults(summary)
      + '<div class="millionaire-analytics"><span>Lifelines used: ' + lifelinesUsedCount + '</span><span>Completion time: ' + completionTimeSeconds + 's</span></div>';
  }

  complete({
    success: true,
    score: accuracy,
    data: {
      questionsAnswered: state.questionsAnswered,
      correctAnswers: state.correctCount,
      lifelinesUsed: lifelinesUsedCount,
      lifelineDetails: Object.keys(state.lifelinesUsed),
      completionTimeSeconds: completionTimeSeconds,
      accuracy: accuracy,
      finalScore: state.score,
      maxStreak: state.maxStreak,
      gamification: summary,
      achievementCandidates: summary.perfect ? ["first-perfect-score", "millionaire-master"] : [],
      template: "millionaire-style"
    }
  });
}

function readGamificationSummary(activityName, correctAnswers, totalAnswers, completed, startedAt) {
  var completionTimeSeconds = 0;

  if (startedAt && Number.isFinite(startedAt)) {
    completionTimeSeconds = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  }

  // TODO: Pass persisted student gamification progress here when the progress pipeline exposes it to step renderers.
  return createGamificationSummary({
    correctAnswers: correctAnswers,
    totalAnswers: totalAnswers,
    completed: completed !== false,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: activityName
  });
}

function getSortingTemplateRenderer(config) {
  var templateId = normalizeActivityTemplateId("sorting", readRawActivityTemplateId(config));

  return sortingTemplateRenderers[templateId] || null;
}

function createSortingTemplateData(config) {
  var categories = parseLines(config.categoriesText, []);
  var rawItems = parseSortItems(config.itemsText);
  var items = [];

  rawItems.forEach(function (item, index) {
    if (item.label && item.category && categories.indexOf(item.category) !== -1) {
      items.push(Object.assign({}, item, { index: index }));
    }
  });

  return {
    categories: categories,
    items: items,
    successText: readText(config, "successText", "Great sorting!"),
    valid: categories.length > 0 && items.length > 0 && countCategoriesWithItems(categories, items) === categories.length
  };
}

function createCharacterRunnerData(config) {
  var data = createSortingTemplateData(config);

  return {
    categories: data.categories,
    items: data.items,
    successText: data.successText,
    valid: data.valid && data.categories.length === 2
  };
}

function bindCharacterRunnerKeyboard(container, data, state, complete) {
  var doc = container.ownerDocument || document;
  var onKeyDown = function (event) {
    var key = event.key || "";
    var choice = "";

    if (!container.isConnected) {
      doc.removeEventListener("keydown", onKeyDown);
      return;
    }

    if (key === "ArrowLeft" || key === "a" || key === "A") {
      choice = "left";
    } else if (key === "ArrowRight" || key === "d" || key === "D") {
      choice = "right";
    }

    if (!choice) {
      return;
    }

    event.preventDefault();
    handleCharacterRunnerChoice(container, choice, data, state, complete);
  };

  doc.addEventListener("keydown", onKeyDown);
}

function handleCharacterRunnerChoice(container, choice, data, state, complete) {
  var categoryIndex = choice === "left" ? 0 : choice === "right" ? 1 : -1;
  var selectedCategory = data.categories[categoryIndex] || "";
  var item = data.items[state.itemIndex];
  var avatar = container.querySelector("[data-runner-avatar]");
  var root = container.querySelector("[data-runner-root]");
  var correct = Boolean(item && selectedCategory === item.category);
  var feedbackMessage = "";

  if (state.locked || state.completed || categoryIndex < 0 || !item) {
    return;
  }

  state.locked = true;
  state.totalAnswers = state.totalAnswers + 1;

  if (correct) {
    state.score = state.score + 10;
    state.correctCount = state.correctCount + 1;
    feedbackMessage = "Nice delivery. " + item.label + " belongs in " + item.category + ".";
  } else {
    feedbackMessage = "Close. " + item.label + " belongs in " + item.category + ".";
  }

  if (root) {
    root.classList.toggle("is-correct", correct);
    root.classList.toggle("is-incorrect", !correct);
  }
  if (avatar) {
    avatar.classList.remove("is-moving-left", "is-moving-right", "is-success", "is-error");
    avatar.classList.add(choice === "left" ? "is-moving-left" : "is-moving-right");
    avatar.classList.add(correct ? "is-success" : "is-error");
  }

  setCharacterRunnerFeedback(container, feedbackMessage, correct ? "correct" : "incorrect");
  updateCharacterRunnerStats(container, data, state);

  window.setTimeout(function () {
    if (state.itemIndex >= data.items.length - 1) {
      completeCharacterRunner(container, data, state, complete);
      return;
    }

    state.itemIndex = state.itemIndex + 1;
    state.locked = false;
    renderCharacterRunnerItem(container, data, state);
  }, 760);
}

function renderCharacterRunnerItem(container, data, state) {
  var itemElement = container.querySelector("[data-runner-item]");
  var avatar = container.querySelector("[data-runner-avatar]");
  var root = container.querySelector("[data-runner-root]");
  var item = data.items[state.itemIndex];

  if (itemElement && item) {
    itemElement.textContent = item.label;
  }
  if (avatar) {
    avatar.classList.remove("is-moving-left", "is-moving-right", "is-success", "is-error");
  }
  if (root) {
    root.classList.remove("is-correct", "is-incorrect");
  }

  setCharacterRunnerFeedback(container, "Choose the category for this item.", "");
  updateCharacterRunnerStats(container, data, state);
}

function updateCharacterRunnerStats(container, data, state) {
  var progressElement = container.querySelector("[data-runner-progress]");
  var scoreElement = container.querySelector("[data-runner-score]");
  var accuracyElement = container.querySelector("[data-runner-accuracy]");
  var accuracy = readCharacterRunnerAccuracy(state);

  if (progressElement) {
    progressElement.textContent = "Item " + Math.min(state.itemIndex + 1, data.items.length) + " of " + data.items.length;
  }
  if (scoreElement) {
    scoreElement.textContent = String(state.score);
  }
  if (accuracyElement) {
    accuracyElement.textContent = accuracy + "% accuracy";
  }
}

function setCharacterRunnerFeedback(container, message, stateName) {
  var feedbackElement = container.querySelector("[data-runner-feedback]");

  if (!feedbackElement) {
    return;
  }

  feedbackElement.textContent = message;
  feedbackElement.classList.toggle("is-correct", stateName === "correct");
  feedbackElement.classList.toggle("is-incorrect", stateName === "incorrect");
}

function completeCharacterRunner(container, data, state, complete) {
  var root = container.querySelector("[data-runner-root]");
  var arena = container.querySelector("[data-runner-arena]");
  var controls = container.querySelector(".runner-sort-controls");
  var resultsElement = container.querySelector("[data-runner-results]");
  var accuracy = readCharacterRunnerAccuracy(state);
  var gamification = readGamificationSummary("Character Runner Sorting", state.correctCount, state.totalAnswers, true);

  if (state.completed) {
    return;
  }

  state.completed = true;
  state.locked = false;
  if (root) {
    root.classList.add("is-complete");
    root.classList.remove("is-correct", "is-incorrect");
  }
  if (arena) {
    arena.hidden = true;
  }
  if (controls) {
    controls.hidden = true;
  }
  if (resultsElement) {
    resultsElement.hidden = false;
    resultsElement.innerHTML = renderActivityResults(gamification);
  }
  setCharacterRunnerFeedback(container, "Sorting run complete.", "correct");
  updateCharacterRunnerStats(container, data, state);

  complete({
    success: true,
    score: accuracy,
    data: {
      score: state.score,
      correctAnswers: state.correctCount,
      totalAnswers: state.totalAnswers,
      accuracy: accuracy,
      gamification: gamification,
      template: "character-runner-sorting"
    }
  });
}

function readCharacterRunnerAccuracy(state) {
  if (!state.totalAnswers) {
    return 0;
  }

  return Math.round((state.correctCount / state.totalAnswers) * 100);
}

function readCharacterRunnerEncouragement(accuracy) {
  if (accuracy >= 90) {
    return "Excellent run. You sorted with real confidence.";
  }

  if (accuracy >= 70) {
    return "Nice work. You kept the run moving.";
  }

  return "Good effort. Review the categories and try another run.";
}

function countCategoriesWithItems(categories, items) {
  var count = 0;

  categories.forEach(function (category) {
    var hasItem = false;
    items.forEach(function (item) {
      if (item.category === category) {
        hasItem = true;
      }
    });
    if (hasItem) {
      count = count + 1;
    }
  });

  return count;
}

function readBubblePosition(index) {
  var positions = [
    "left:5%;top:12%;--bubble-delay:0s;--bubble-size:112px;",
    "left:32%;top:6%;--bubble-delay:.35s;--bubble-size:126px;",
    "left:60%;top:14%;--bubble-delay:.12s;--bubble-size:116px;",
    "left:14%;top:44%;--bubble-delay:.22s;--bubble-size:132px;",
    "left:45%;top:36%;--bubble-delay:.48s;--bubble-size:120px;",
    "left:64%;top:48%;--bubble-delay:.18s;--bubble-size:128px;",
    "left:28%;top:64%;--bubble-delay:.42s;--bubble-size:110px;",
    "left:56%;top:64%;--bubble-delay:.08s;--bubble-size:122px;"
  ];

  return positions[index % positions.length];
}

function renderBubbleRound(container, data, state, target, progress, feedback, scoreElement, completeButton) {
  var category = data.categories[state.categoryIndex] || "";
  var roundComplete = isBubbleCategoryComplete(data, state, category);
  var allComplete = areAllBubbleCategoriesComplete(data, state);

  if (target) {
    target.textContent = category;
  }

  if (progress) {
    progress.textContent = allComplete ? "All rounds complete" : "Round " + (state.categoryIndex + 1) + " of " + data.categories.length;
  }

  if (scoreElement) {
    scoreElement.textContent = String(state.score);
  }

  if (feedback && !allComplete) {
    feedback.textContent = roundComplete ? "Nice. Moving to the next category..." : "Pop every bubble that belongs to " + category + ".";
  }

  if (completeButton) {
    completeButton.disabled = !allComplete;
  }

  updateBubbleVisibility(container, data, state, category, allComplete);
}

function updateBubbleVisibility(container, data, state, category, allComplete) {
  var bubbles = container.querySelectorAll("[data-bubble-item]");

  forEachElement(bubbles, function (bubble) {
    var item = data.items[Number(bubble.getAttribute("data-item-index"))];
    var popped = item && state.poppedByCategory[item.category] && state.poppedByCategory[item.category][String(item.index)];
    var visible = Boolean(item && !allComplete && !popped && (item.category === category || hasRemainingCorrectItems(data, state, category)));

    bubble.hidden = !visible;
    bubble.classList.remove("is-wrong");
  });
}

function handleBubblePop(container, bubble, data, state, target, progress, feedback, scoreElement, completeButton, complete) {
  var itemIndex = Number(bubble.getAttribute("data-item-index"));
  var item = data.items[itemIndex];
  var category = data.categories[state.categoryIndex] || "";

  if (!item || bubble.hidden || bubble.classList.contains("is-popped")) {
    return;
  }

  if (item.category !== category) {
    state.incorrectCount = state.incorrectCount + 1;
    bubble.classList.remove("is-wrong");
    void bubble.offsetWidth;
    bubble.classList.add("is-wrong");
    if (feedback) {
      feedback.textContent = "Not for " + category + ". Try another bubble.";
    }
    return;
  }

  state.poppedByCategory[item.category][String(item.index)] = true;
  state.score = state.score + 1;
  bubble.classList.add("is-popped");
  if (scoreElement) {
    scoreElement.textContent = String(state.score);
  }
  if (feedback) {
    feedback.textContent = "Pop! " + item.label + " belongs to " + category + ".";
  }

  window.setTimeout(function () {
    bubble.hidden = true;
    bubble.classList.remove("is-popped");
    advanceBubbleRoundIfNeeded(container, data, state, target, progress, feedback, scoreElement, completeButton, complete);
  }, 260);
}

function advanceBubbleRoundIfNeeded(container, data, state, target, progress, feedback, scoreElement, completeButton, complete) {
  var category = data.categories[state.categoryIndex] || "";

  if (isBubbleCategoryComplete(data, state, category)) {
    if (state.categoryIndex < data.categories.length - 1) {
      state.categoryIndex = state.categoryIndex + 1;
    }
  }

  renderBubbleRound(container, data, state, target, progress, feedback, scoreElement, completeButton);

  if (areAllBubbleCategoriesComplete(data, state)) {
    if (feedback) {
      feedback.textContent = data.successText;
    }
    complete({
      success: true,
      score: 100,
      data: {
        sortedItems: data.items.length,
        gamification: readGamificationSummary("Bubble Pop Sorting", data.items.length, data.items.length + state.incorrectCount, true),
        template: "bubble-pop-sorting"
      }
    });
  }
}

function isBubbleCategoryComplete(data, state, category) {
  var complete = true;

  data.items.forEach(function (item) {
    if (item.category === category && !state.poppedByCategory[category][String(item.index)]) {
      complete = false;
    }
  });

  return complete;
}

function areAllBubbleCategoriesComplete(data, state) {
  var complete = true;

  data.categories.forEach(function (category) {
    if (!isBubbleCategoryComplete(data, state, category)) {
      complete = false;
    }
  });

  return complete;
}

function hasRemainingCorrectItems(data, state, category) {
  var remaining = false;

  data.items.forEach(function (item) {
    if (item.category === category && !state.poppedByCategory[category][String(item.index)]) {
      remaining = true;
    }
  });

  return remaining;
}

function buildShell(StepType, config, bodyHtml) {
  var rootClass = StepType.type + "-step";

  return '<style>' + buildScopedCss(rootClass) + '</style>'
    + '<article class="oqu-step-engine ' + rootClass + '">'
    + buildActivityTemplateFallbackNotice(StepType.type, config)
    + bodyHtml
    + '</article>';
}

function buildActivityTemplateFallbackNotice(stepType, config) {
  var rawTemplateId = readRawActivityTemplateId(config);
  var normalizedTemplateId = normalizeActivityTemplateId(stepType, rawTemplateId);
  var defaultTemplateId = getDefaultActivityTemplateId(stepType);
  var templateDefinition = getActivityTemplateDefinition(stepType, normalizedTemplateId);
  var isUnknownTemplate = Boolean(rawTemplateId && rawTemplateId !== normalizedTemplateId);
  var shouldShowNotice = isUnknownTemplate || templateDefinition.status !== "ready";
  var label = isUnknownTemplate ? rawTemplateId : templateDefinition.name;

  if (!shouldShowNotice) {
    return "";
  }

  return '<div class="activity-template-fallback-notice">'
    + '<strong>' + BaseStep.escapeHtml(label || "Selected template") + ' is coming soon.</strong>'
    + '<span>Showing the classic activity layout for now.</span>'
    + '</div>';
}

function readRawActivityTemplateId(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return "";
  }

  if (typeof config._activityTemplate === "string") {
    return config._activityTemplate.trim();
  }

  if (typeof config.activityTemplate === "string") {
    return config.activityTemplate.trim();
  }

  return "";
}

function buildScopedCss(rootClass) {
  var scope = ".oqu-step-engine." + rootClass;

  return scope + "{box-sizing:border-box;width:100%;max-width:760px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:24px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;}"
    + scope + " *{box-sizing:border-box;}"
    + scope + " h2{margin:0 0 10px;font-size:26px;line-height:1.15;font-weight:900;color:#0f172a;letter-spacing:0;}"
    + scope + " p{margin:0 0 18px;color:#475569;font-size:15px;line-height:1.55;}"
    + scope + " button{font:inherit;min-height:42px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font-weight:800;cursor:pointer;transition:background .16s,border-color .16s,transform .16s;}"
    + scope + " button:hover:not(:disabled){background:#eff6ff;border-color:#60a5fa;}"
    + scope + " button:disabled{opacity:.45;cursor:not-allowed;}"
    + scope + " .activity-template-fallback-notice{display:grid;gap:3px;margin:0 0 16px;padding:10px 12px;border:1px solid #fed7aa;border-radius:12px;background:#fff7ed;color:#9a3412;}"
    + scope + " .activity-template-fallback-notice strong{font-size:12px;font-weight:900;line-height:1.3;}"
    + scope + " .activity-template-fallback-notice span{font-size:11px;font-weight:750;line-height:1.35;color:#c2410c;}"
    + scope + " .intro-card-icon{font-size:42px;margin-bottom:12px;}"
    + scope + " .intro-card-subtitle{font-weight:800;color:#2563eb;}"
    + scope + " .intro-card-callout{margin:14px 0;padding:12px;border-radius:12px;background:#ecfdf5;border:1px solid #a7f3d0;color:#047857;font-weight:800;}"
    + scope + " .intro-card-button," + scope + " .card-reveal-button," + scope + " .sorting-button," + scope + " .multiple-choice-button," + scope + " .roadmap-button," + scope + " .matching-button," + scope + " .ordering-button," + scope + " .reflection-button{background:#111827;color:#fff;border-color:#111827;padding:0 18px;}"
    + scope + " .card-reveal-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin:18px 0;perspective:1000px;}"
    + scope + " .card-reveal-card{min-height:156px;padding:0;text-align:left;background:transparent;border:0;perspective:1000px;}"
    + scope + " .card-reveal-card:hover:not(:disabled){background:transparent;border-color:transparent;transform:translateY(-2px);}"
    + scope + " .card-reveal-card-inner{position:relative;display:block;min-height:156px;transform-style:preserve-3d;transition:transform .58s cubic-bezier(.2,.8,.2,1),filter .2s ease;}"
    + scope + " .card-reveal-card.is-revealed .card-reveal-card-inner{transform:rotateY(180deg);}"
    + scope + " .card-reveal-front," + scope + " .card-reveal-back{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;gap:10px;border:1px solid #dbeafe;border-radius:16px;padding:18px;backface-visibility:hidden;box-shadow:0 10px 22px rgba(15,23,42,.08);}"
    + scope + " .card-reveal-front{background:linear-gradient(145deg,#eff6ff,#fff 62%);color:#0f172a;}"
    + scope + " .card-reveal-front strong{font-size:17px;line-height:1.2;}"
    + scope + " .card-reveal-front em{align-self:flex-start;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:11px;font-style:normal;font-weight:900;padding:5px 9px;}"
    + scope + " .card-reveal-icon{font-size:32px;line-height:1;}"
    + scope + " .card-reveal-back{background:linear-gradient(145deg,#ecfdf5,#fff 68%);border-color:#86efac;color:#065f46;transform:rotateY(180deg);}"
    + scope + " .card-reveal-back strong{font-size:13px;color:#047857;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .card-reveal-back span{color:#0f172a;line-height:1.5;font-weight:750;}"
    + scope + " .card-reveal-card.is-reveal-pop .card-reveal-card-inner{animation:cardRevealPop .52s cubic-bezier(.2,.8,.2,1);}"
    + scope + " .sorting-workspace{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:14px;margin:16px 0;}"
    + scope + " .sorting-items," + scope + " .sorting-categories," + scope + " .matching-column{display:flex;flex-direction:column;gap:10px;min-width:0;}"
    + scope + " .sorting-item{padding:10px 12px;text-align:left;background:#f8fafc;}"
    + scope + " .sorting-item.is-selected{background:#dbeafe;border-color:#3b82f6;}"
    + scope + " .sorting-item.is-correct{background:#dcfce7;border-color:#22c55e;}"
    + scope + " .sorting-item.is-incorrect{background:#fee2e2;border-color:#ef4444;}"
    + scope + " .sorting-category{padding:12px;min-height:90px;text-align:left;background:#fff7ed;display:flex;flex-direction:column;align-items:stretch;gap:8px;}"
    + scope + " .sorting-feedback," + scope + " .multiple-choice-feedback," + scope + " .matching-feedback," + scope + " .ordering-feedback," + scope + " .reflection-feedback{min-height:22px;margin:10px 0;color:#2563eb;font-size:13px;font-weight:800;}"
    + scope + " .bubble-pop-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px;}"
    + scope + " .bubble-pop-header h2{margin-bottom:8px;}"
    + scope + " .bubble-pop-score{flex:0 0 auto;min-width:74px;border:1px solid #bfdbfe;border-radius:14px;background:#eff6ff;padding:10px;text-align:center;color:#1d4ed8;}"
    + scope + " .bubble-pop-score strong{display:block;font-size:22px;font-weight:950;line-height:1;}"
    + scope + " .bubble-pop-score span{display:block;margin-top:3px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .bubble-pop-roundbar{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;margin-bottom:10px;}"
    + scope + " .bubble-pop-roundbar span," + scope + " .bubble-pop-roundbar em{font-size:11px;font-weight:900;color:#64748b;font-style:normal;}"
    + scope + " .bubble-pop-roundbar strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .bubble-pop-feedback{min-height:26px;margin:8px 0 12px;color:#2563eb;font-size:13px;font-weight:850;line-height:1.4;}"
    + scope + " .bubble-pop-stage{position:relative;min-height:390px;border:1px solid #dbeafe;border-radius:18px;background:radial-gradient(circle at 20% 18%,#dbeafe 0,transparent 24%),radial-gradient(circle at 78% 28%,#ccfbf1 0,transparent 24%),linear-gradient(180deg,#f8fafc,#ffffff);overflow:hidden;margin-bottom:14px;}"
    + scope + " .bubble-pop-bubble{position:absolute;width:var(--bubble-size);height:var(--bubble-size);min-height:0;border-radius:999px;border:1px solid rgba(125,211,252,.9);background:radial-gradient(circle at 32% 24%,rgba(255,255,255,.96),rgba(186,230,253,.92) 46%,rgba(59,130,246,.18));box-shadow:inset -10px -12px 24px rgba(37,99,235,.13),0 14px 28px rgba(14,116,144,.14);padding:14px;color:#0f172a;text-align:center;animation:bubbleFloat 4.4s ease-in-out infinite;animation-delay:var(--bubble-delay);}"
    + scope + " .bubble-pop-bubble:hover:not(:disabled){background:radial-gradient(circle at 32% 24%,#fff,#bfdbfe 48%,rgba(37,99,235,.26));border-color:#60a5fa;transform:translateY(-2px) scale(1.03);}"
    + scope + " .bubble-pop-bubble span{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;font-size:12px;font-weight:900;line-height:1.25;}"
    + scope + " .bubble-pop-bubble.is-popped{animation:bubblePop .25s ease-out forwards;pointer-events:none;}"
    + scope + " .bubble-pop-bubble.is-wrong{animation:bubbleWrong .32s ease-in-out;box-shadow:inset -10px -12px 24px rgba(244,63,94,.13),0 0 0 4px rgba(244,63,94,.12),0 14px 28px rgba(14,116,144,.12);border-color:#fda4af;}"
    + scope + " .bubble-pop-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + scope + " .bubble-pop-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .bubble-pop-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + scope + " .bubble-pop-complete{background:#111827;color:#fff;border-color:#111827;padding:0 18px;}"
    + scope + " .activity-celebration{display:inline-flex;align-items:center;justify-content:center;min-height:26px;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;line-height:1;text-transform:uppercase;letter-spacing:.06em;}"
    + scope + " .activity-celebration-correct," + scope + " .activity-celebration-perfect," + scope + " .activity-celebration-complete{border-color:#bbf7d0;background:#ecfdf5;color:#047857;}"
    + scope + " .activity-celebration-incorrect{border-color:#fed7aa;background:#fff7ed;color:#c2410c;}"
    + scope + " .activity-celebration-checkpoint{border-color:#bfdbfe;background:#eff6ff;color:#1d4ed8;}"
    + scope + " .activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}"
    + scope + " .activity-results-celebration{min-height:26px;}"
    + scope + " .activity-results-heading{display:grid;gap:4px;}"
    + scope + " .activity-results-heading strong{color:#0f172a;font-size:18px;font-weight:950;line-height:1.2;}"
    + scope + " .activity-results-heading span{color:#047857;font-size:13px;font-weight:850;line-height:1.4;}"
    + scope + " .activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;box-shadow:0 16px 34px rgba(37,99,235,.2);}"
    + scope + " .activity-results-stars{display:flex;align-items:center;justify-content:center;gap:3px;font-size:22px;line-height:1;}"
    + scope + " .activity-results-stars .is-earned{color:#f59e0b;}"
    + scope + " .activity-results-stars .is-empty{color:#cbd5e1;}"
    + scope + " .activity-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}"
    + scope + " .activity-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;}"
    + scope + " .activity-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}"
    + scope + " .activity-results-grid strong{display:block;margin-top:3px;color:#0f172a;font-size:14px;font-weight:950;}"
    + scope + " .activity-results-achievements{display:grid;gap:5px;width:100%;border:1px solid #fde68a;border-radius:12px;background:#fffbeb;padding:10px;color:#92400e;}"
    + scope + " .activity-results-achievements span{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .activity-results-achievements strong{font-size:12px;font-weight:950;}"
    + scope + " .runner-sort-shell{display:grid;gap:14px;outline:none;}"
    + scope + " .runner-sort-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}"
    + scope + " .runner-sort-header h2{margin-bottom:8px;}"
    + scope + " .runner-sort-score{flex:0 0 auto;min-width:78px;border:1px solid #bfdbfe;border-radius:14px;background:#eff6ff;padding:10px;text-align:center;color:#1d4ed8;}"
    + scope + " .runner-sort-score strong{display:block;font-size:24px;font-weight:950;line-height:1;}"
    + scope + " .runner-sort-score span{display:block;margin-top:3px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .runner-sort-progress{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:12px;font-weight:900;}"
    + scope + " .runner-sort-progress em{font-style:normal;color:#2563eb;white-space:nowrap;}"
    + scope + " .runner-sort-feedback{min-height:34px;border-radius:14px;padding:10px 12px;background:#f8fafc;color:#475569;font-size:13px;font-weight:850;line-height:1.45;}"
    + scope + " .runner-sort-feedback.is-correct{background:#ecfdf5;color:#047857;border:1px solid #bbf7d0;}"
    + scope + " .runner-sort-feedback.is-incorrect{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;}"
    + scope + " .runner-sort-arena{display:grid;grid-template-columns:minmax(96px,.8fr) minmax(150px,1.25fr) minmax(96px,.8fr);align-items:stretch;gap:12px;min-height:260px;border:1px solid #dbeafe;border-radius:18px;background:linear-gradient(180deg,#f8fafc,#ffffff);padding:14px;overflow:hidden;}"
    + scope + " .runner-sort-bin{min-height:190px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border-radius:16px;padding:12px;text-align:center;background:#ffffff;box-shadow:0 10px 22px rgba(15,23,42,.07);}"
    + scope + " .runner-sort-bin:hover:not(:disabled){background:#eff6ff;border-color:#60a5fa;transform:translateY(-2px);}"
    + scope + " .runner-sort-bin span{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;color:#64748b;}"
    + scope + " .runner-sort-bin strong{max-width:100%;overflow:hidden;text-overflow:ellipsis;color:#0f172a;font-size:15px;font-weight:950;line-height:1.2;}"
    + scope + " .runner-sort-bin.is-left{border-color:#bfdbfe;background:linear-gradient(160deg,#eff6ff,#ffffff);}"
    + scope + " .runner-sort-bin.is-right{border-color:#bbf7d0;background:linear-gradient(160deg,#ecfdf5,#ffffff);}"
    + scope + " .runner-sort-lane{position:relative;display:grid;grid-template-rows:auto minmax(120px,1fr);align-items:center;justify-items:center;gap:16px;min-width:0;}"
    + scope + " .runner-sort-lane:before{content:\"\";position:absolute;left:0;right:0;bottom:36px;height:10px;border-radius:999px;background:linear-gradient(90deg,#bfdbfe,#e2e8f0,#bbf7d0);}"
    + scope + " .runner-sort-item{position:relative;z-index:1;width:100%;max-width:260px;border:1px solid #fde68a;border-radius:16px;background:#fffbeb;color:#78350f;padding:14px;text-align:center;font-size:14px;font-weight:950;line-height:1.3;box-shadow:0 12px 24px rgba(146,64,14,.1);}"
    + scope + " .runner-sort-avatar{position:relative;z-index:1;width:72px;height:72px;border-radius:999px;display:grid;place-items:center;background:#111827;color:#fff;box-shadow:0 16px 34px rgba(15,23,42,.18);transition:transform .38s cubic-bezier(.2,.8,.2,1),background .2s ease;}"
    + scope + " .runner-sort-avatar span{display:grid;place-items:center;width:42px;height:42px;border-radius:999px;background:#2563eb;font-size:22px;font-weight:950;}"
    + scope + " .runner-sort-avatar.is-moving-left{transform:translateX(-72px);}"
    + scope + " .runner-sort-avatar.is-moving-right{transform:translateX(72px);}"
    + scope + " .runner-sort-avatar.is-success{background:#047857;}"
    + scope + " .runner-sort-avatar.is-success span{background:#22c55e;}"
    + scope + " .runner-sort-avatar.is-error{background:#9a3412;}"
    + scope + " .runner-sort-avatar.is-error span{background:#f97316;}"
    + scope + " .runner-sort-shell.is-correct .runner-sort-item{animation:runnerItemSuccess .42s ease-out;}"
    + scope + " .runner-sort-shell.is-incorrect .runner-sort-item{animation:runnerItemWrong .36s ease-in-out;}"
    + scope + " .runner-sort-controls{display:grid;grid-template-columns:1fr 1fr;gap:10px;}"
    + scope + " .runner-sort-controls button{min-height:52px;background:#111827;color:#fff;border-color:#111827;padding:0 12px;}"
    + scope + " .runner-sort-results{display:grid;justify-items:center;gap:7px;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}"
    + scope + " .runner-sort-results-score{width:82px;height:82px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;box-shadow:0 16px 34px rgba(37,99,235,.2);}"
    + scope + " .runner-sort-results strong{color:#0f172a;font-size:17px;font-weight:950;}"
    + scope + " .runner-sort-results span{color:#047857;font-size:13px;font-weight:900;}"
    + scope + " .runner-sort-results em{color:#475569;font-size:12px;font-style:normal;font-weight:800;line-height:1.4;}"
    + scope + " .runner-sort-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + scope + " .runner-sort-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .runner-sort-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + scope + " fieldset{border:0;padding:0;margin:0 0 12px;display:flex;flex-direction:column;gap:10px;}"
    + scope + " legend{font-size:17px;font-weight:900;margin-bottom:10px;color:#1e293b;}"
    + scope + " .multiple-choice-option," + scope + " .reflection-choice{padding:12px;text-align:left;background:#f8fafc;}"
    + scope + " .multiple-choice-option.is-selected," + scope + " .reflection-choice.is-selected{background:#dbeafe;border-color:#3b82f6;}"
    + scope + " .multiple-choice-option.is-correct{background:#dcfce7;border-color:#22c55e;}"
    + scope + " .multiple-choice-option.is-incorrect{background:#fee2e2;border-color:#ef4444;}"
    + scope + " .quiz-show-shell{display:grid;gap:14px;}"
    + scope + " .quiz-show-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}"
    + scope + " .quiz-show-header h2{margin-bottom:8px;}"
    + scope + " .quiz-show-score{flex:0 0 auto;min-width:78px;border:1px solid #fde68a;border-radius:14px;background:#fffbeb;padding:10px;text-align:center;color:#92400e;}"
    + scope + " .quiz-show-score strong{display:block;font-size:24px;font-weight:950;line-height:1;}"
    + scope + " .quiz-show-score span{display:block;margin-top:3px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .quiz-show-xp{flex:0 0 auto;min-width:78px;border:1px solid #bbf7d0;border-radius:14px;background:#ecfdf5;padding:10px;text-align:center;color:#047857;}"
    + scope + " .quiz-show-xp strong{display:block;font-size:24px;font-weight:950;line-height:1;}"
    + scope + " .quiz-show-xp span{display:block;margin-top:3px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .quiz-show-progress{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:12px;font-weight:900;}"
    + scope + " .quiz-show-progress em{font-style:normal;color:#2563eb;white-space:nowrap;}"
    + scope + " .quiz-show-streak{justify-self:start;border:1px solid #dbeafe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:6px 10px;font-size:11px;font-weight:950;line-height:1;}"
    + scope + " .quiz-show-streak.has-milestone{border-color:#fde68a;background:#fffbeb;color:#92400e;animation:quizStreakPulse .42s ease-out;}"
    + scope + " .quiz-show-question{border:1px solid #bfdbfe;border-radius:18px;background:linear-gradient(135deg,#eff6ff,#ffffff);padding:18px;color:#0f172a;font-size:20px;font-weight:950;line-height:1.25;}"
    + scope + " .quiz-show-answers{display:grid;grid-template-columns:1fr 1fr;gap:12px;}"
    + scope + " .quiz-show-answer{min-height:76px;display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:12px;border-radius:16px;background:#ffffff;text-align:left;padding:14px;box-shadow:0 10px 24px rgba(15,23,42,.07);}"
    + scope + " .quiz-show-answer:hover:not(:disabled){background:#eff6ff;border-color:#60a5fa;transform:translateY(-2px);}"
    + scope + " .quiz-show-answer:disabled{opacity:1;cursor:default;}"
    + scope + " .quiz-show-answer-letter{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:14px;font-weight:950;}"
    + scope + " .quiz-show-answer.is-correct{background:#dcfce7;border-color:#22c55e;color:#14532d;}"
    + scope + " .quiz-show-answer.is-correct .quiz-show-answer-letter{background:#22c55e;color:#fff;}"
    + scope + " .quiz-show-answer.is-incorrect{background:#fee2e2;border-color:#fb7185;color:#7f1d1d;}"
    + scope + " .quiz-show-answer.is-incorrect .quiz-show-answer-letter{background:#fb7185;color:#fff;}"
    + scope + " .quiz-show-feedback{min-height:30px;border-radius:14px;padding:10px 12px;background:#f8fafc;color:#475569;font-size:13px;font-weight:850;line-height:1.45;}"
    + scope + " .quiz-show-feedback{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}"
    + scope + " .quiz-show-feedback span:last-child{min-width:0;flex:1 1 180px;}"
    + scope + " .quiz-show-feedback:empty{padding:0;background:transparent;}"
    + scope + " .quiz-show-feedback.is-correct{background:#ecfdf5;color:#047857;border:1px solid #bbf7d0;}"
    + scope + " .quiz-show-feedback.is-incorrect{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;}"
    + scope + " .quiz-show-next{justify-self:end;background:#111827;color:#fff;border-color:#111827;padding:0 18px;}"
    + scope + " .quiz-show-results{display:grid;justify-items:center;gap:8px;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:24px;text-align:center;}"
    + scope + " .quiz-show-results-score{width:86px;height:86px;border-radius:999px;display:grid;place-items:center;background:#10b981;color:#fff;font-size:25px;font-weight:950;box-shadow:0 16px 34px rgba(16,185,129,.22);}"
    + scope + " .quiz-show-results strong{color:#0f172a;font-size:18px;font-weight:950;}"
    + scope + " .quiz-show-results span{color:#047857;font-size:13px;font-weight:850;line-height:1.45;}"
    + scope + " .quiz-show-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + scope + " .quiz-show-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .quiz-show-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + scope + " .millionaire-shell{display:grid;gap:14px;}"
    + scope + " .millionaire-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}"
    + scope + " .millionaire-header h2{margin-bottom:8px;}"
    + scope + " .millionaire-score{flex:0 0 auto;min-width:82px;border:1px solid #fde68a;border-radius:14px;background:#fffbeb;padding:10px;text-align:center;color:#92400e;}"
    + scope + " .millionaire-score strong{display:block;font-size:24px;font-weight:950;line-height:1;}"
    + scope + " .millionaire-score span{display:block;margin-top:3px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .millionaire-layout{display:grid;grid-template-columns:minmax(120px,.42fr) minmax(0,1fr);gap:14px;align-items:start;}"
    + scope + " .millionaire-ladder{display:grid;gap:6px;border:1px solid #dbeafe;border-radius:16px;background:#f8fafc;padding:10px;max-height:420px;overflow:auto;}"
    + scope + " .millionaire-ladder-step{display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;padding:7px 8px;color:#64748b;font-size:11px;font-weight:850;}"
    + scope + " .millionaire-ladder-step strong{white-space:nowrap;color:#475569;font-size:11px;font-weight:950;}"
    + scope + " .millionaire-ladder-step.is-current{border-color:#2563eb;background:#eff6ff;color:#1d4ed8;box-shadow:0 0 0 3px rgba(37,99,235,.1);}"
    + scope + " .millionaire-ladder-step.is-current strong{color:#1d4ed8;}"
    + scope + " .millionaire-ladder-step.is-complete{border-color:#bbf7d0;background:#ecfdf5;color:#047857;}"
    + scope + " .millionaire-ladder-step.is-complete strong{color:#047857;}"
    + scope + " .millionaire-stage{display:grid;gap:12px;min-width:0;}"
    + scope + " .millionaire-progress{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:12px;font-weight:900;}"
    + scope + " .millionaire-progress em{font-style:normal;color:#2563eb;white-space:nowrap;}"
    + scope + " .millionaire-progress em.has-milestone{color:#92400e;}"
    + scope + " .millionaire-question{border:1px solid #bfdbfe;border-radius:18px;background:linear-gradient(135deg,#eff6ff,#ffffff);padding:18px;color:#0f172a;font-size:20px;font-weight:950;line-height:1.25;}"
    + scope + " .millionaire-answers{display:grid;grid-template-columns:1fr 1fr;gap:12px;}"
    + scope + " .millionaire-answer{min-height:72px;display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:12px;border-radius:16px;background:#ffffff;text-align:left;padding:14px;box-shadow:0 10px 24px rgba(15,23,42,.07);}"
    + scope + " .millionaire-answer:hover:not(:disabled){background:#eff6ff;border-color:#60a5fa;transform:translateY(-2px);}"
    + scope + " .millionaire-answer:focus-visible{outline:3px solid rgba(37,99,235,.32);outline-offset:2px;}"
    + scope + " .millionaire-answer:disabled{opacity:1;cursor:default;}"
    + scope + " .millionaire-answer[hidden]{display:none;}"
    + scope + " .millionaire-answer-letter{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:14px;font-weight:950;}"
    + scope + " .millionaire-answer.is-selected{background:#fffbeb;border-color:#f59e0b;color:#78350f;}"
    + scope + " .millionaire-answer.is-selected .millionaire-answer-letter{background:#f59e0b;color:#fff;}"
    + scope + " .millionaire-answer.is-correct{background:#dcfce7;border-color:#22c55e;color:#14532d;}"
    + scope + " .millionaire-answer.is-correct .millionaire-answer-letter{background:#22c55e;color:#fff;}"
    + scope + " .millionaire-answer.is-incorrect{background:#fee2e2;border-color:#fb7185;color:#7f1d1d;}"
    + scope + " .millionaire-answer.is-incorrect .millionaire-answer-letter{background:#fb7185;color:#fff;}"
    + scope + " .millionaire-confirm{display:grid;gap:8px;border:1px solid #fde68a;border-radius:16px;background:#fffbeb;padding:12px;color:#78350f;}"
    + scope + " .millionaire-confirm strong{font-size:13px;font-weight:950;}"
    + scope + " .millionaire-confirm div{display:flex;gap:8px;flex-wrap:wrap;}"
    + scope + " .millionaire-confirm button{min-height:36px;padding:0 12px;}"
    + scope + " .millionaire-confirm [data-millionaire-confirm-answer]{background:#111827;color:#fff;border-color:#111827;}"
    + scope + " .millionaire-feedback{min-height:32px;border-radius:14px;padding:10px 12px;background:#f8fafc;color:#475569;font-size:13px;font-weight:850;line-height:1.45;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}"
    + scope + " .millionaire-feedback:empty{padding:0;background:transparent;}"
    + scope + " .millionaire-feedback.is-correct{background:#ecfdf5;color:#047857;border:1px solid #bbf7d0;}"
    + scope + " .millionaire-feedback.is-incorrect{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;}"
    + scope + " .millionaire-feedback span:last-child{min-width:0;flex:1 1 180px;}"
    + scope + " .millionaire-next{justify-self:end;background:#111827;color:#fff;border-color:#111827;padding:0 18px;}"
    + scope + " .millionaire-lifelines{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}"
    + scope + " .millionaire-lifelines button{min-height:42px;border-color:#bfdbfe;background:#eff6ff;color:#1d4ed8;padding:0 10px;}"
    + scope + " .millionaire-lifelines button:hover:not(:disabled){background:#dbeafe;border-color:#60a5fa;}"
    + scope + " .millionaire-lifelines button.is-used{background:#f8fafc;color:#94a3b8;border-color:#e2e8f0;}"
    + scope + " .millionaire-results{display:grid;gap:10px;}"
    + scope + " .millionaire-analytics{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;color:#475569;font-size:12px;font-weight:850;}"
    + scope + " .millionaire-analytics span{border:1px solid #dbeafe;border-radius:999px;background:#fff;padding:6px 10px;}"
    + scope + " .multi-select-shell{display:grid;gap:14px;min-width:0;}"
    + scope + " .multi-select-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;min-width:0;}"
    + scope + " .multi-select-header h2{margin:0 0 8px;font-size:24px;line-height:1.15;}"
    + scope + " .multi-select-header p{margin:0;color:#475569;font-size:14px;font-weight:750;line-height:1.45;}"
    + scope + " .multi-select-score{flex:0 0 auto;min-width:96px;border:1px solid #bfdbfe;border-radius:14px;background:#eff6ff;padding:10px;text-align:center;color:#1d4ed8;}"
    + scope + " .multi-select-score strong{display:block;font-size:24px;font-weight:950;line-height:1;}"
    + scope + " .multi-select-score span{display:block;margin-top:3px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .multi-select-streak{justify-self:start;border:1px solid #dbeafe;border-radius:999px;background:#f8fafc;color:#475569;padding:6px 10px;font-size:11px;font-weight:900;}"
    + scope + " .multi-select-streak.has-milestone{background:#fffbeb;border-color:#fde68a;color:#92400e;animation:quizStreakPulse .36s ease-out;}"
    + scope + " .multi-select-options{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;min-width:0;}"
    + scope + " .multi-select-option{min-width:0;min-height:54px;display:grid;grid-template-columns:22px minmax(0,1fr);align-items:center;gap:10px;border:1px solid #dbeafe;border-radius:14px;background:#ffffff;padding:11px 12px;text-align:left;color:#0f172a;font-size:13px;font-weight:850;line-height:1.35;box-shadow:0 8px 18px rgba(15,23,42,.05);cursor:pointer;transition:transform .16s,border-color .16s,background .16s,box-shadow .16s;}"
    + scope + " .multi-select-option:hover{border-color:#60a5fa;background:#eff6ff;transform:translateY(-1px);}"
    + scope + " .multi-select-option input{width:18px;height:18px;accent-color:#2563eb;}"
    + scope + " .technology-scanner .multi-select-options," + scope + " .grid-detective .multi-select-options{grid-template-columns:repeat(auto-fit,minmax(150px,1fr));}"
    + scope + " .technology-scanner-card," + scope + " .grid-detective-card{min-width:0;min-height:112px;display:grid;grid-template-rows:auto minmax(0,1fr);align-content:start;gap:8px;border:1px solid #dbeafe;border-radius:16px;background:#ffffff;padding:13px;text-align:left;color:#0f172a;box-shadow:0 10px 22px rgba(15,23,42,.07);transition:transform .16s,border-color .16s,background .16s,box-shadow .16s;}"
    + scope + " .technology-scanner-card:hover," + scope + " .grid-detective-card:hover{border-color:#60a5fa;background:#eff6ff;transform:translateY(-2px);}"
    + scope + " .technology-scanner-card strong," + scope + " .grid-detective-card strong{min-width:0;color:#0f172a;font-size:13px;font-weight:900;line-height:1.35;overflow-wrap:anywhere;}"
    + scope + " .multi-select-card-number{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:12px;font-weight:950;}"
    + scope + " .multi-select-option.is-selected," + scope + " .technology-scanner-card.is-selected," + scope + " .grid-detective-card.is-selected{border-color:#2563eb;background:#eff6ff;box-shadow:0 0 0 3px rgba(37,99,235,.12),0 10px 22px rgba(15,23,42,.07);}"
    + scope + " .technology-scanner-card.is-selected{background:linear-gradient(135deg,#eff6ff,#ecfeff);}"
    + scope + " .multi-select-option.is-correct," + scope + " .technology-scanner-card.is-correct," + scope + " .grid-detective-card.is-correct{border-color:#22c55e;background:#ecfdf5;color:#14532d;}"
    + scope + " .multi-select-option.is-incorrect," + scope + " .technology-scanner-card.is-incorrect," + scope + " .grid-detective-card.is-incorrect{border-color:#fb7185;background:#fff1f2;color:#7f1d1d;}"
    + scope + " .multi-select-option.is-missed," + scope + " .technology-scanner-card.is-missed," + scope + " .grid-detective-card.is-missed{border-color:#f59e0b;background:#fffbeb;color:#78350f;}"
    + scope + " .multi-select-feedback{min-height:34px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.45;display:grid;gap:5px;}"
    + scope + " .multi-select-feedback:empty{padding:0;background:transparent;border-color:transparent;min-height:0;}"
    + scope + " .multi-select-feedback.is-correct{background:#ecfdf5;color:#047857;border-color:#bbf7d0;}"
    + scope + " .multi-select-feedback.is-incorrect{background:#fff7ed;color:#c2410c;border-color:#fed7aa;}"
    + scope + " .multi-select-correct-list{display:block;color:#0f172a;font-size:12px;font-weight:850;line-height:1.4;}"
    + scope + " .multi-select-submit{justify-self:start;background:#111827;color:#fff;border-color:#111827;padding:0 16px;}"
    + scope + " .multi-select-submit:disabled{background:#94a3b8;border-color:#94a3b8;cursor:default;}"
    + scope + " .multi-select-results{display:grid;gap:10px;}"
    + scope + " .multi-select-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + scope + " .multi-select-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .multi-select-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + scope + " .scenario-choice-shell{display:grid;gap:14px;min-width:0;}"
    + scope + " .scenario-choice-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;min-width:0;}"
    + scope + " .scenario-choice-header h2{margin:0 0 8px;font-size:24px;line-height:1.15;}"
    + scope + " .scenario-choice-header p{margin:0;color:#475569;font-size:14px;font-weight:750;line-height:1.45;}"
    + scope + " .scenario-choice-score{flex:0 0 auto;min-width:96px;border:1px solid #bae6fd;border-radius:14px;background:#f0f9ff;padding:10px;text-align:center;color:#0369a1;}"
    + scope + " .scenario-choice-score strong{display:block;font-size:24px;font-weight:950;line-height:1;}"
    + scope + " .scenario-choice-score span{display:block;margin-top:3px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .scenario-choice-card{position:relative;overflow:hidden;border:1px solid #dbeafe;border-radius:18px;background:linear-gradient(135deg,#ffffff,#f8fafc);padding:16px;color:#0f172a;box-shadow:0 12px 28px rgba(15,23,42,.07);display:grid;gap:8px;}"
    + scope + " .what-happens-next .scenario-choice-card{border-color:#fed7aa;background:linear-gradient(135deg,#fff7ed,#ffffff);}"
    + scope + " .classroom-hero .scenario-choice-card{grid-template-columns:54px minmax(0,1fr);align-items:center;border-color:#bbf7d0;background:linear-gradient(135deg,#f0fdf4,#ffffff);}"
    + scope + " .scenario-choice-label{display:inline-flex;justify-self:start;border-radius:999px;background:#e0f2fe;color:#0369a1;padding:5px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .what-happens-next .scenario-choice-label{background:#ffedd5;color:#c2410c;}"
    + scope + " .classroom-hero .scenario-choice-label{background:#dcfce7;color:#15803d;}"
    + scope + " .scenario-choice-card p{margin:0;color:#0f172a;font-size:18px;font-weight:900;line-height:1.35;}"
    + scope + " .classroom-hero-avatar{grid-row:1 / span 2;width:48px;height:48px;border-radius:16px;background:#16a34a;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:22px;font-weight:950;box-shadow:0 10px 20px rgba(22,163,74,.2);}"
    + scope + " .scenario-choice-streak{justify-self:start;border:1px solid #dbeafe;border-radius:999px;background:#f8fafc;color:#475569;padding:6px 10px;font-size:11px;font-weight:900;}"
    + scope + " .scenario-choice-streak.has-milestone{background:#fffbeb;border-color:#fde68a;color:#92400e;animation:quizStreakPulse .36s ease-out;}"
    + scope + " .scenario-choice-options{display:grid;grid-template-columns:1fr;gap:10px;min-width:0;}"
    + scope + " .scenario-choice-option{min-width:0;min-height:58px;display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:11px;border:1px solid #dbeafe;border-radius:15px;background:#ffffff;padding:12px;text-align:left;color:#0f172a;box-shadow:0 8px 18px rgba(15,23,42,.05);transition:transform .16s,border-color .16s,background .16s,box-shadow .16s;}"
    + scope + " .scenario-choice-option:hover:not(:disabled){border-color:#60a5fa;background:#eff6ff;transform:translateY(-1px);}"
    + scope + " .scenario-choice-option strong{min-width:0;font-size:13px;font-weight:900;line-height:1.35;overflow-wrap:anywhere;}"
    + scope + " .scenario-choice-option-index{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:12px;font-weight:950;}"
    + scope + " .scenario-choice-option.is-selected{border-color:#2563eb;background:#eff6ff;box-shadow:0 0 0 3px rgba(37,99,235,.12),0 10px 22px rgba(15,23,42,.07);}"
    + scope + " .scenario-choice-option.is-correct{border-color:#22c55e;background:#ecfdf5;color:#14532d;}"
    + scope + " .scenario-choice-option.is-incorrect{border-color:#fb7185;background:#fff1f2;color:#7f1d1d;}"
    + scope + " .scenario-choice-consequence-option.is-correct{background:#f0fdf4;}"
    + scope + " .classroom-hero-action.is-correct{background:#ecfdf5;box-shadow:0 0 0 3px rgba(34,197,94,.12),0 10px 22px rgba(15,23,42,.07);}"
    + scope + " .scenario-choice-feedback{min-height:34px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.45;}"
    + scope + " .scenario-choice-feedback:empty{padding:0;background:transparent;border-color:transparent;min-height:0;}"
    + scope + " .scenario-choice-feedback.is-correct{background:#ecfdf5;color:#047857;border-color:#bbf7d0;}"
    + scope + " .scenario-choice-feedback.is-incorrect{background:#fff7ed;color:#c2410c;border-color:#fed7aa;}"
    + scope + " .scenario-choice-submit{justify-self:start;background:#111827;color:#fff;border-color:#111827;padding:0 16px;}"
    + scope + " .scenario-choice-submit:disabled{background:#94a3b8;border-color:#94a3b8;cursor:default;}"
    + scope + " .scenario-choice-results{display:grid;gap:10px;}"
    + scope + " .scenario-choice-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + scope + " .scenario-choice-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .scenario-choice-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + scope + " .roadmap-list{list-style:none;margin:16px 0;padding:0;display:flex;flex-direction:column;gap:10px;}"
    + scope + " .roadmap-item{width:100%;padding:14px;text-align:left;display:flex;gap:12px;align-items:flex-start;background:#f8fafc;}"
    + scope + " .roadmap-number{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;background:#2563eb;color:#fff;font-weight:900;flex:0 0 auto;}"
    + scope + " .roadmap-item em{display:none;margin-top:6px;color:#64748b;font-style:normal;font-weight:650;line-height:1.45;}"
    + scope + " .roadmap-item.is-open{background:#eef2ff;border-color:#818cf8;}"
    + scope + " .roadmap-item.is-open em{display:block;}"
    + scope + " .adventure-path-shell{display:grid;gap:14px;}"
    + scope + " .adventure-path-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}"
    + scope + " .adventure-path-header h2{margin-bottom:8px;}"
    + scope + " .adventure-path-meter{flex:0 0 auto;min-width:104px;border:1px solid #bfdbfe;border-radius:14px;background:#eff6ff;padding:10px;text-align:center;color:#1d4ed8;}"
    + scope + " .adventure-path-meter strong{display:block;font-size:24px;font-weight:950;line-height:1;}"
    + scope + " .adventure-path-meter span{display:block;margin-top:3px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .adventure-path-meter b{font-weight:950;}"
    + scope + " .adventure-path-progressbar{height:10px;border-radius:999px;background:#e2e8f0;overflow:hidden;box-shadow:inset 0 1px 2px rgba(15,23,42,.08);}"
    + scope + " .adventure-path-progressbar span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#2563eb,#14b8a6);transition:width .35s ease;}"
    + scope + " .adventure-path-status{min-height:30px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:9px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.4;}"
    + scope + " .adventure-path-list{position:relative;list-style:none;margin:4px 0 0;padding:4px 0;display:grid;gap:10px;}"
    + scope + " .adventure-path-list:before{content:\"\";position:absolute;top:30px;bottom:30px;left:50%;width:3px;border-radius:999px;background:linear-gradient(180deg,#bfdbfe,#99f6e4);transform:translateX(-50%);}"
    + scope + " .adventure-path-stop{position:relative;display:flex;min-width:0;}"
    + scope + " .adventure-path-stop:before{content:\"\";position:absolute;top:28px;left:50%;width:36px;height:3px;border-radius:999px;background:#bfdbfe;transform:translateX(-50%);}"
    + scope + " .adventure-path-stop.is-left{justify-content:flex-start;padding-right:46%;}"
    + scope + " .adventure-path-stop.is-right{justify-content:flex-end;padding-left:46%;}"
    + scope + " .adventure-path-checkpoint{position:relative;z-index:1;width:min(100%,300px);min-height:70px;display:grid;grid-template-columns:38px minmax(0,1fr);align-items:center;gap:10px;border-radius:16px;background:#ffffff;padding:11px 12px;text-align:left;box-shadow:0 10px 22px rgba(15,23,42,.07);}"
    + scope + " .adventure-path-checkpoint:hover:not(:disabled){background:#eff6ff;border-color:#60a5fa;transform:translateY(-2px);}"
    + scope + " .adventure-path-checkpoint:disabled{opacity:1;cursor:default;}"
    + scope + " .adventure-path-node{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:999px;background:#e2e8f0;color:#475569;font-size:14px;font-weight:950;box-shadow:inset 0 0 0 1px rgba(148,163,184,.28);}"
    + scope + " .adventure-path-copy{min-width:0;display:grid;gap:3px;}"
    + scope + " .adventure-path-copy strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#0f172a;font-size:14px;font-weight:950;line-height:1.25;}"
    + scope + " .adventure-path-copy em{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:#64748b;font-size:12px;font-style:normal;font-weight:750;line-height:1.3;}"
    + scope + " .adventure-path-stop.is-current .adventure-path-checkpoint{border-color:#2563eb;background:linear-gradient(135deg,#eff6ff,#ffffff);transform:scale(1.02);box-shadow:0 14px 30px rgba(37,99,235,.16);}"
    + scope + " .adventure-path-stop.is-current .adventure-path-node{background:#2563eb;color:#fff;box-shadow:0 0 0 5px rgba(37,99,235,.12);}"
    + scope + " .adventure-path-stop.is-complete .adventure-path-checkpoint{border-color:#86efac;background:#ecfdf5;}"
    + scope + " .adventure-path-stop.is-complete .adventure-path-node{background:#22c55e;color:#fff;}"
    + scope + " .adventure-path-stop.is-complete:before{background:#86efac;}"
    + scope + " .adventure-path-stop.is-future .adventure-path-checkpoint{background:#f8fafc;border-color:#e2e8f0;}"
    + scope + " .adventure-path-stop.is-future .adventure-path-copy strong," + scope + " .adventure-path-stop.is-future .adventure-path-copy em{color:#94a3b8;}"
    + scope + " .adventure-path-checkpoint.is-activating .adventure-path-node{animation:adventureNodePulse .38s ease-out;}"
    + scope + " .adventure-path-complete{display:grid;gap:4px;border:1px solid #bbf7d0;border-radius:16px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:16px;text-align:center;}"
    + scope + " .adventure-path-complete strong{color:#047857;font-size:17px;font-weight:950;}"
    + scope + " .adventure-path-complete span{color:#475569;font-size:12px;font-weight:850;}"
    + scope + " .adventure-path-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + scope + " .adventure-path-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .adventure-path-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + scope + " .level-unlock-shell{display:grid;gap:14px;}"
    + scope + " .level-unlock-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}"
    + scope + " .level-unlock-header h2{margin-bottom:8px;}"
    + scope + " .level-unlock-summary{flex:0 0 auto;display:grid;grid-template-columns:repeat(3,minmax(70px,1fr));gap:8px;min-width:240px;}"
    + scope + " .level-unlock-summary div{min-width:0;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:9px 8px;text-align:center;}"
    + scope + " .level-unlock-summary span{display:block;color:#64748b;font-size:9px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;line-height:1.2;}"
    + scope + " .level-unlock-summary strong{display:block;margin-top:3px;color:#0f172a;font-size:15px;font-weight:950;line-height:1.1;}"
    + scope + " .level-unlock-progress{height:11px;border-radius:999px;background:#e2e8f0;overflow:hidden;box-shadow:inset 0 1px 2px rgba(15,23,42,.08);}"
    + scope + " .level-unlock-progress span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#2563eb,#22c55e);transition:width .35s ease;}"
    + scope + " .level-unlock-status{min-height:32px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:9px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.4;}"
    + scope + " .level-unlock-list{position:relative;list-style:none;margin:2px 0 0;padding:6px 0;display:grid;gap:10px;}"
    + scope + " .level-unlock-list:before{content:\"\";position:absolute;top:28px;bottom:28px;left:24px;width:4px;border-radius:999px;background:#dbeafe;}"
    + scope + " .level-unlock-stop{position:relative;min-width:0;padding-left:48px;}"
    + scope + " .level-unlock-stop:before{content:\"\";position:absolute;top:30px;left:24px;width:28px;height:4px;border-radius:999px;background:#dbeafe;}"
    + scope + " .level-unlock-node{position:relative;z-index:1;width:100%;min-height:86px;display:grid;grid-template-columns:42px minmax(0,1fr) minmax(86px,.35fr);align-items:center;gap:10px;border-radius:16px;background:#ffffff;padding:11px 12px;text-align:left;box-shadow:0 10px 22px rgba(15,23,42,.07);}"
    + scope + " .level-unlock-node:hover:not(:disabled){background:#eff6ff;border-color:#60a5fa;transform:translateY(-2px);}"
    + scope + " .level-unlock-node:disabled{opacity:1;cursor:default;}"
    + scope + " .level-unlock-badge{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:999px;background:#e2e8f0;color:#475569;font-size:16px;font-weight:950;box-shadow:inset 0 0 0 1px rgba(148,163,184,.28);}"
    + scope + " .level-unlock-copy{min-width:0;display:grid;gap:3px;}"
    + scope + " .level-unlock-copy strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#0f172a;font-size:14px;font-weight:950;line-height:1.25;}"
    + scope + " .level-unlock-copy em{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:#64748b;font-size:12px;font-style:normal;font-weight:750;line-height:1.3;}"
    + scope + " .level-unlock-rewards{min-width:0;display:grid;justify-items:end;gap:4px;color:#64748b;font-size:11px;font-weight:900;text-align:right;}"
    + scope + " .level-unlock-rewards .is-earned{color:#f59e0b;}"
    + scope + " .level-unlock-rewards .is-empty{color:#cbd5e1;}"
    + scope + " .level-unlock-rewards b{color:#0f172a;font-weight:950;}"
    + scope + " .level-unlock-stop.is-locked .level-unlock-node{background:#f8fafc;border-color:#e2e8f0;}"
    + scope + " .level-unlock-stop.is-locked .level-unlock-copy strong," + scope + " .level-unlock-stop.is-locked .level-unlock-copy em{color:#94a3b8;}"
    + scope + " .level-unlock-stop.is-available .level-unlock-node{border-color:#93c5fd;background:linear-gradient(135deg,#eff6ff,#ffffff);box-shadow:0 12px 26px rgba(37,99,235,.12);}"
    + scope + " .level-unlock-stop.is-available .level-unlock-badge{background:#2563eb;color:#fff;box-shadow:0 0 0 5px rgba(37,99,235,.1);}"
    + scope + " .level-unlock-stop.is-in-progress .level-unlock-node{border-color:#fde68a;background:#fffbeb;}"
    + scope + " .level-unlock-stop.is-in-progress .level-unlock-badge{background:#f59e0b;color:#fff;animation:levelUnlockPulse .5s ease-out;}"
    + scope + " .level-unlock-stop.is-completed .level-unlock-node{border-color:#86efac;background:#ecfdf5;}"
    + scope + " .level-unlock-stop.is-completed .level-unlock-badge{background:#22c55e;color:#fff;}"
    + scope + " .level-unlock-stop.is-mastered .level-unlock-node{border-color:#fde68a;background:linear-gradient(135deg,#fffbeb,#ecfdf5);}"
    + scope + " .level-unlock-stop.is-mastered .level-unlock-badge{background:#f59e0b;color:#fff;box-shadow:0 0 0 5px rgba(245,158,11,.14);}"
    + scope + " .level-unlock-stop.is-completed:before," + scope + " .level-unlock-stop.is-mastered:before{background:#86efac;}"
    + scope + " .level-unlock-complete{display:grid;gap:10px;}"
    + scope + " .level-unlock-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + scope + " .level-unlock-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .level-unlock-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + scope + " .matching-board{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:16px 0;}"
    + scope + " .matching-card{padding:12px;text-align:left;background:#f8fafc;}"
    + scope + " .matching-card.is-selected{background:#dbeafe;border-color:#3b82f6;}"
    + scope + " .matching-card.is-matched{background:#dcfce7;border-color:#22c55e;}"
    + scope + " .matching-card.is-incorrect{background:#fee2e2;border-color:#ef4444;}"
    + scope + " .memory-game-shell{display:grid;gap:14px;}"
    + scope + " .memory-game-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}"
    + scope + " .memory-game-header h2{margin-bottom:8px;}"
    + scope + " .memory-game-progress{flex:0 0 auto;min-width:96px;border:1px solid #bbf7d0;border-radius:14px;background:#ecfdf5;padding:10px;text-align:center;color:#047857;}"
    + scope + " .memory-game-progress strong{display:block;font-size:24px;font-weight:950;line-height:1;}"
    + scope + " .memory-game-progress span{display:block;margin-top:3px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}"
    + scope + " .memory-game-progress b{font-weight:950;}"
    + scope + " .memory-game-feedback{min-height:30px;border-radius:14px;padding:10px 12px;background:#f8fafc;color:#475569;font-size:13px;font-weight:850;line-height:1.45;}"
    + scope + " .memory-game-feedback.is-correct{background:#ecfdf5;color:#047857;border:1px solid #bbf7d0;}"
    + scope + " .memory-game-feedback.is-incorrect{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;}"
    + scope + " .memory-game-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;perspective:1000px;}"
    + scope + " .memory-card{height:118px;min-height:0;padding:0;border:0;background:transparent;perspective:1000px;}"
    + scope + " .memory-card:hover:not(:disabled){background:transparent;border-color:transparent;transform:translateY(-2px);}"
    + scope + " .memory-card-inner{position:relative;display:block;width:100%;height:100%;transform-style:preserve-3d;transition:transform .42s cubic-bezier(.2,.8,.2,1);}"
    + scope + " .memory-card.is-flipped .memory-card-inner," + scope + " .memory-card.is-matched .memory-card-inner{transform:rotateY(180deg);}"
    + scope + " .memory-card-front," + scope + " .memory-card-back{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border:1px solid #dbeafe;border-radius:16px;padding:12px;backface-visibility:hidden;box-shadow:0 10px 22px rgba(15,23,42,.08);}"
    + scope + " .memory-card-front{background:linear-gradient(145deg,#dbeafe,#ffffff);color:#1d4ed8;font-size:30px;font-weight:950;}"
    + scope + " .memory-card-back{background:#ffffff;color:#0f172a;transform:rotateY(180deg);font-size:13px;font-weight:900;line-height:1.3;text-align:center;overflow:hidden;}"
    + scope + " .memory-card.is-matched .memory-card-back{background:#dcfce7;border-color:#22c55e;color:#14532d;}"
    + scope + " .memory-card.is-wrong .memory-card-back{background:#fee2e2;border-color:#fb7185;color:#7f1d1d;}"
    + scope + " .memory-game-complete{display:grid;gap:4px;border:1px solid #bbf7d0;border-radius:16px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:16px;text-align:center;}"
    + scope + " .memory-game-complete strong{color:#047857;font-size:17px;font-weight:950;}"
    + scope + " .memory-game-complete span{color:#475569;font-size:12px;font-weight:850;}"
    + scope + " .memory-game-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + scope + " .memory-game-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .memory-game-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + scope + " .ordering-list{list-style:none;margin:16px 0;padding:0;display:flex;flex-direction:column;gap:10px;}"
    + scope + " .ordering-item{display:grid;grid-template-columns:minmax(0,1fr) 44px 44px;gap:8px;align-items:center;padding:10px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;}"
    + scope + " .ordering-item.is-correct{background:#dcfce7;border-color:#22c55e;}"
    + scope + " .ordering-item button{min-height:36px;}"
    + scope + " .timeline-builder-shell{display:grid;gap:14px;}"
    + scope + " .timeline-builder-header{display:grid;gap:6px;}"
    + scope + " .timeline-builder-header h2{margin:0;font-size:24px;}"
    + scope + " .timeline-builder-header p{margin:0;color:#475569;}"
    + scope + " .timeline-builder-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:12px;font-weight:900;}"
    + scope + " .timeline-builder-meta em{font-style:normal;color:#2563eb;white-space:nowrap;}"
    + scope + " .timeline-builder-list{position:relative;list-style:none;margin:4px 0;padding:18px 0 8px;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:14px;}"
    + scope + " .timeline-builder-list:before{content:\"\";position:absolute;left:8%;right:8%;top:38px;height:4px;border-radius:999px;background:linear-gradient(90deg,#bfdbfe,#bbf7d0);}"
    + scope + " .timeline-builder-card{position:relative;z-index:1;min-width:0;display:grid;grid-template-rows:auto minmax(58px,1fr) auto;gap:8px;align-items:start;border:1px solid #dbeafe;border-radius:16px;background:#ffffff;padding:12px;text-align:center;box-shadow:0 10px 22px rgba(15,23,42,.07);cursor:grab;transition:transform .16s,border-color .16s,background .16s;}"
    + scope + " .timeline-builder-card:hover{border-color:#60a5fa;background:#eff6ff;transform:translateY(-2px);}"
    + scope + " .timeline-builder-card.is-dragging{opacity:.62;cursor:grabbing;}"
    + scope + " .timeline-builder-card.is-drop-target{box-shadow:0 0 0 3px rgba(37,99,235,.16),0 10px 22px rgba(15,23,42,.07);}"
    + scope + " .timeline-builder-card.is-correct{background:#ecfdf5;border-color:#22c55e;}"
    + scope + " .timeline-builder-card.is-incorrect{background:#fff7ed;border-color:#fb923c;}"
    + scope + " .timeline-builder-card.is-hint{box-shadow:0 0 0 4px rgba(250,204,21,.22),0 10px 22px rgba(15,23,42,.07);border-color:#facc15;}"
    + scope + " .timeline-builder-card.is-locked{cursor:default;}"
    + scope + " .timeline-builder-node{justify-self:center;display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:999px;background:#2563eb;color:#fff;font-size:14px;font-weight:950;box-shadow:0 0 0 5px rgba(37,99,235,.1);}"
    + scope + " .timeline-builder-copy{min-width:0;color:#0f172a;font-size:13px;font-weight:900;line-height:1.3;overflow-wrap:anywhere;}"
    + scope + " .timeline-builder-card-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;}"
    + scope + " .timeline-builder-card-actions button{min-height:32px;border-radius:9px;background:#f8fafc;font-size:13px;padding:0;}"
    + scope + " .timeline-builder-feedback{min-height:34px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.4;}"
    + scope + " .timeline-builder-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}"
    + scope + " .timeline-builder-check{background:#111827;color:#fff;border-color:#111827;padding:0 16px;}"
    + scope + " .timeline-builder-hint{background:#fffbeb;color:#92400e;border-color:#fde68a;padding:0 14px;}"
    + scope + " .timeline-builder-results{display:grid;gap:10px;}"
    + scope + " .timeline-builder-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + scope + " .timeline-builder-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + scope + " .timeline-builder-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + scope + " .reflection-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:16px 0;}"
    + scope + " .reflection-text{width:100%;min-height:120px;border:1px solid #cbd5e1;border-radius:12px;padding:12px;font:inherit;resize:vertical;}"
    + scope + " .emoji-checkin-shell{display:grid;gap:14px;}"
    + scope + " .emoji-checkin-header{display:grid;gap:6px;}"
    + scope + " .emoji-checkin-header h2{margin:0;font-size:24px;}"
    + scope + " .emoji-checkin-header p{margin:0;color:#475569;}"
    + scope + " .emoji-checkin-moods{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}"
    + scope + " .emoji-checkin-mood{min-height:96px;display:grid;justify-items:center;align-content:center;gap:7px;border-radius:16px;background:#f8fafc;padding:12px;text-align:center;box-shadow:none;}"
    + scope + " .emoji-checkin-mood:hover:not(:disabled){background:#eff6ff;border-color:#93c5fd;transform:translateY(-1px);}"
    + scope + " .emoji-checkin-mood.is-selected{background:#ecfdf5;border-color:#34d399;box-shadow:0 0 0 3px rgba(16,185,129,.12);}"
    + scope + " .emoji-checkin-mood:disabled{opacity:.82;cursor:default;}"
    + scope + " .emoji-checkin-icon{font-size:30px;line-height:1;}"
    + scope + " .emoji-checkin-mood strong{color:#0f172a;font-size:12px;font-weight:950;line-height:1.2;}"
    + scope + " .emoji-checkin-note{display:grid;gap:7px;color:#475569;font-size:12px;font-weight:900;}"
    + scope + " .emoji-checkin-note textarea{width:100%;min-height:88px;border:1px solid #cbd5e1;border-radius:14px;background:#fff;padding:11px;font:inherit;font-size:13px;line-height:1.45;color:#0f172a;resize:vertical;}"
    + scope + " .emoji-checkin-note textarea:focus{outline:2px solid rgba(59,130,246,.22);border-color:#60a5fa;}"
    + scope + " .emoji-checkin-feedback{min-height:30px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:9px 12px;color:#475569;font-size:13px;font-weight:800;line-height:1.4;}"
    + scope + " .emoji-checkin-submit{justify-self:start;background:#111827;color:#fff;border-color:#111827;padding:0 16px;}"
    + scope + " .emoji-checkin-confirmation{display:grid;gap:4px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:14px;color:#047857;}"
    + scope + " .emoji-checkin-confirmation strong{font-size:15px;font-weight:950;}"
    + scope + " .emoji-checkin-confirmation span{font-size:12px;font-weight:800;color:#166534;line-height:1.4;}"
    + "@keyframes cardRevealPop{0%{filter:brightness(1);transform:rotateY(0) scale(1);}58%{filter:brightness(1.05);transform:rotateY(180deg) scale(1.035);}100%{filter:brightness(1);transform:rotateY(180deg) scale(1);}}"
    + "@keyframes bubbleFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}"
    + "@keyframes bubblePop{0%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(1.28);}}"
    + "@keyframes bubbleWrong{0%,100%{transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);}}"
    + "@keyframes runnerItemSuccess{0%{transform:scale(1);}55%{transform:scale(1.04);}100%{transform:scale(1);}}"
    + "@keyframes runnerItemWrong{0%,100%{transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);}}"
    + "@keyframes quizStreakPulse{0%{transform:scale(1);}55%{transform:scale(1.06);}100%{transform:scale(1);}}"
    + "@keyframes adventureNodePulse{0%{transform:scale(1);}55%{transform:scale(1.18);}100%{transform:scale(1);}}"
    + "@keyframes levelUnlockPulse{0%{transform:scale(1);}55%{transform:scale(1.14);}100%{transform:scale(1);}}"
    + "@media(prefers-reduced-motion:reduce){" + scope + " .card-reveal-card-inner{transition:none;}" + scope + " .card-reveal-card.is-reveal-pop .card-reveal-card-inner{animation:none;}}"
    + "@media(prefers-reduced-motion:reduce){" + scope + " .bubble-pop-bubble{animation:none;}" + scope + " .runner-sort-avatar{transition:none;}" + scope + " .runner-sort-shell.is-correct .runner-sort-item," + scope + " .runner-sort-shell.is-incorrect .runner-sort-item," + scope + " .quiz-show-streak.has-milestone{animation:none;}" + scope + " .memory-card-inner{transition:none;}" + scope + " .adventure-path-progressbar span," + scope + " .level-unlock-progress span{transition:none;}" + scope + " .adventure-path-checkpoint.is-activating .adventure-path-node," + scope + " .level-unlock-stop.is-in-progress .level-unlock-badge{animation:none;}}"
    + "@media(max-width:640px){" + scope + "{padding:18px;border-radius:12px;}" + scope + " h2{font-size:22px;}" + scope + " .sorting-workspace," + scope + " .matching-board," + scope + " .quiz-show-answers," + scope + " .millionaire-answers," + scope + " .multi-select-options{grid-template-columns:1fr;}" + scope + " .bubble-pop-header," + scope + " .runner-sort-header," + scope + " .quiz-show-header," + scope + " .millionaire-header," + scope + " .memory-game-header," + scope + " .adventure-path-header," + scope + " .level-unlock-header," + scope + " .multi-select-header{display:grid;}" + scope + " .bubble-pop-score," + scope + " .runner-sort-score," + scope + " .quiz-show-score," + scope + " .quiz-show-xp," + scope + " .millionaire-score," + scope + " .memory-game-progress," + scope + " .adventure-path-meter," + scope + " .level-unlock-summary," + scope + " .multi-select-score{width:100%;min-width:0;}" + scope + " .activity-results-grid," + scope + " .bubble-pop-roundbar," + scope + " .runner-sort-progress," + scope + " .quiz-show-progress," + scope + " .millionaire-progress," + scope + " .timeline-builder-meta{display:grid;grid-template-columns:1fr;}" + scope + " .multi-select-submit{width:100%;}" + scope + " .scenario-choice-header{display:grid;}" + scope + " .scenario-choice-score{width:100%;min-width:0;}" + scope + " .classroom-hero .scenario-choice-card{grid-template-columns:1fr;}" + scope + " .scenario-choice-submit{width:100%;}" + scope + " .bubble-pop-stage{min-height:460px;}" + scope + " .bubble-pop-bubble{width:min(var(--bubble-size),34vw);height:min(var(--bubble-size),34vw);padding:10px;}" + scope + " .bubble-pop-bubble span{font-size:11px;-webkit-line-clamp:5;}" + scope + " .runner-sort-arena{grid-template-columns:1fr 1fr;grid-template-areas:'item item' 'left right';min-height:0;padding:10px;}" + scope + " .runner-sort-bin{min-height:108px;padding:10px;}" + scope + " .runner-sort-bin.is-left{grid-area:left;}" + scope + " .runner-sort-bin.is-right{grid-area:right;}" + scope + " .runner-sort-lane{grid-area:item;min-height:150px;}" + scope + " .runner-sort-lane:before{bottom:24px;}" + scope + " .runner-sort-avatar{width:62px;height:62px;}" + scope + " .runner-sort-avatar span{width:36px;height:36px;font-size:18px;}" + scope + " .runner-sort-avatar.is-moving-left{transform:translateX(-44px);}" + scope + " .runner-sort-avatar.is-moving-right{transform:translateX(44px);}" + scope + " .runner-sort-controls button{min-height:58px;}" + scope + " .quiz-show-question," + scope + " .millionaire-question{font-size:17px;padding:15px;}" + scope + " .quiz-show-answer," + scope + " .millionaire-answer{min-height:64px;}" + scope + " .millionaire-layout{grid-template-columns:1fr;}" + scope + " .millionaire-ladder{grid-template-columns:repeat(2,minmax(0,1fr));max-height:none;}" + scope + " .millionaire-lifelines{grid-template-columns:1fr;}" + scope + " .millionaire-confirm div{display:grid;grid-template-columns:1fr;}" + scope + " .millionaire-next{width:100%;}" + scope + " .adventure-path-list:before{left:19px;}" + scope + " .adventure-path-stop:before{left:19px;width:22px;transform:none;}" + scope + " .adventure-path-stop.is-left," + scope + " .adventure-path-stop.is-right{justify-content:flex-start;padding-left:38px;padding-right:0;}" + scope + " .adventure-path-checkpoint{width:100%;}" + scope + " .level-unlock-summary{grid-template-columns:repeat(3,minmax(0,1fr));}" + scope + " .level-unlock-list:before{left:18px;}" + scope + " .level-unlock-stop{padding-left:38px;}" + scope + " .level-unlock-stop:before{left:18px;width:22px;}" + scope + " .level-unlock-node{grid-template-columns:38px minmax(0,1fr);grid-template-rows:auto auto;min-height:0;}" + scope + " .level-unlock-badge{width:38px;height:38px;grid-row:1 / span 2;}" + scope + " .level-unlock-rewards{grid-column:2;justify-items:start;text-align:left;grid-template-columns:repeat(3,auto);align-items:center;gap:7px;}" + scope + " .memory-game-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;}" + scope + " .memory-card{height:104px;}" + scope + " .memory-card-back{font-size:11px;padding:9px;}" + scope + " .timeline-builder-list{grid-template-columns:1fr;padding-left:24px;gap:10px;}" + scope + " .timeline-builder-list:before{left:18px;right:auto;top:18px;bottom:18px;width:4px;height:auto;}" + scope + " .timeline-builder-card{grid-template-columns:38px minmax(0,1fr);grid-template-rows:auto auto;text-align:left;align-items:center;}" + scope + " .timeline-builder-node{grid-row:1 / span 2;}" + scope + " .timeline-builder-card-actions{grid-column:2;}" + scope + " .timeline-builder-actions{display:grid;grid-template-columns:1fr;}" + scope + " .timeline-builder-actions button{width:100%;}" + scope + " .emoji-checkin-moods{grid-template-columns:repeat(2,minmax(0,1fr));}" + scope + " .emoji-checkin-mood{min-height:92px;}" + scope + " .emoji-checkin-submit{width:100%;}}";
}

function boolOptions() {
  return [
    { value: "true", label: "True" },
    { value: "false", label: "False" }
  ];
}

function readText(config, key, fallbackText) {
  return BaseStep.readText(config, key, fallbackText);
}

function readBoolean(value, fallbackValue) {
  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return fallbackValue;
}

function parseLines(value, fallbackLines) {
  var text = typeof value === "string" ? value : "";
  var lines = text.split(/\r?\n/).map(function (line) {
    return line.trim();
  }).filter(Boolean);

  return lines.length > 0 ? lines : fallbackLines;
}

function parseCardLines(value) {
  return parseLines(value, CardRevealStep.defaultConfig.cardsText.split(/\r?\n/)).map(function (line) {
    var parts = line.split("|");
    return {
      icon: (parts[0] || "🃏").trim(),
      title: (parts[1] || parts[0] || "Card").trim(),
      description: (parts.slice(2).join("|") || parts[1] || "Reveal this idea.").trim()
    };
  });
}

function parseSortItems(value) {
  return parseLines(value, SortingStep.defaultConfig.itemsText.split(/\r?\n/)).map(function (line) {
    var parts = line.split("|");
    return {
      label: (parts[0] || "Item").trim(),
      category: (parts[1] || "").trim()
    };
  });
}

function parseChoices(value) {
  return parseLines(value, MultipleChoiceStep.defaultConfig.choicesText.split(/\r?\n/)).map(function (line) {
    var parts = line.split("|");
    return {
      label: (parts[0] || "Choice").trim(),
      correct: (parts[1] || "").trim().toLowerCase() === "true"
    };
  });
}

function parseRoadmapItems(value) {
  return parseLines(value, RoadmapStep.defaultConfig.roadmapText.split(/\r?\n/)).map(function (line) {
    var parts = line.split("|");
    return {
      number: (parts[0] || "1").trim(),
      title: (parts[1] || "Topic").trim(),
      description: (parts.slice(2).join("|") || parts[1] || "Explore this idea.").trim()
    };
  });
}

function parsePairs(value) {
  return parseLines(value, MatchingStep.defaultConfig.pairsText.split(/\r?\n/)).map(function (line) {
    var parts = line.split("|");
    return {
      left: (parts[0] || "Term").trim(),
      right: (parts.slice(1).join("|") || "Meaning").trim()
    };
  });
}

function forEachElement(elements, callback) {
  var index = 0;
  while (index < elements.length) {
    callback(elements[index], index);
    index = index + 1;
  }
}

function clearSelection(elements) {
  forEachElement(elements, function (element) {
    element.classList.remove("is-selected");
  });
}

function setCategoryCount(category, count) {
  var counter = category.querySelector("span");
  if (counter) {
    counter.textContent = count + " item" + (count === 1 ? "" : "s");
  }
}

function choicesAreCorrect(options) {
  var correct = true;

  forEachElement(options, function (option) {
    var shouldSelect = option.getAttribute("data-correct") === "true";
    var isSelected = option.classList.contains("is-selected");
    if (shouldSelect !== isSelected) {
      correct = false;
    }
  });

  return correct;
}

function markChoiceResults(options) {
  forEachElement(options, function (option) {
    var correct = option.getAttribute("data-correct") === "true";
    option.classList.toggle("is-correct", correct);
    option.classList.toggle("is-incorrect", !correct && option.classList.contains("is-selected"));
  });
}

function moveOrderingItem(button) {
  var item = button.closest(".ordering-item");
  var list = item ? item.parentElement : null;
  var direction = button.getAttribute("data-move-order");
  var sibling = direction === "up" ? item && item.previousElementSibling : item && item.nextElementSibling;

  if (!item || !list || !sibling) {
    return;
  }

  if (direction === "up") {
    list.insertBefore(item, sibling);
  } else {
    list.insertBefore(sibling, item);
  }
}

function markOrderingState(container) {
  var items = container.querySelectorAll(".ordering-item");
  var correct = items.length > 0;

  forEachElement(items, function (item, index) {
    var isCorrect = item.getAttribute("data-correct-index") === String(index);
    item.classList.toggle("is-correct", isCorrect);
    if (!isCorrect) {
      correct = false;
    }
  });

  return correct;
}
