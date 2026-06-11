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
      body += '<span class="card-reveal-front"><span>' + BaseStep.escapeHtml(card.icon) + '</span><strong>' + BaseStep.escapeHtml(card.title) + '</strong></span>';
      body += '<span class="card-reveal-back">' + BaseStep.escapeHtml(card.description) + '</span>';
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
        card.classList.add("is-revealed");
        card.setAttribute("aria-expanded", "true");
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
          complete({ success: true, score: 100, data: { sortedItems: correctCount } });
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
          complete({ success: correct, score: correct ? 100 : 0, data: { correct: correct } });
        }
      });
    }
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

function buildShell(StepType, config, bodyHtml) {
  var rootClass = StepType.type + "-step";

  return '<style>' + buildScopedCss(rootClass) + '</style>'
    + '<article class="oqu-step-engine ' + rootClass + '">'
    + bodyHtml
    + '</article>';
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
    + scope + " .intro-card-icon{font-size:42px;margin-bottom:12px;}"
    + scope + " .intro-card-subtitle{font-weight:800;color:#2563eb;}"
    + scope + " .intro-card-callout{margin:14px 0;padding:12px;border-radius:12px;background:#ecfdf5;border:1px solid #a7f3d0;color:#047857;font-weight:800;}"
    + scope + " .intro-card-button," + scope + " .card-reveal-button," + scope + " .sorting-button," + scope + " .multiple-choice-button," + scope + " .roadmap-button," + scope + " .matching-button," + scope + " .ordering-button," + scope + " .reflection-button{background:#111827;color:#fff;border-color:#111827;padding:0 18px;}"
    + scope + " .card-reveal-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:16px 0;}"
    + scope + " .card-reveal-card{min-height:148px;padding:16px;text-align:left;}"
    + scope + " .card-reveal-front{display:flex;gap:10px;align-items:center;font-size:18px;}"
    + scope + " .card-reveal-front strong{font-size:16px;}"
    + scope + " .card-reveal-back{display:none;margin-top:12px;color:#475569;line-height:1.45;font-weight:650;}"
    + scope + " .card-reveal-card.is-revealed{background:#f0fdf4;border-color:#86efac;}"
    + scope + " .card-reveal-card.is-revealed .card-reveal-back{display:block;}"
    + scope + " .sorting-workspace{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:14px;margin:16px 0;}"
    + scope + " .sorting-items," + scope + " .sorting-categories," + scope + " .matching-column{display:flex;flex-direction:column;gap:10px;min-width:0;}"
    + scope + " .sorting-item{padding:10px 12px;text-align:left;background:#f8fafc;}"
    + scope + " .sorting-item.is-selected{background:#dbeafe;border-color:#3b82f6;}"
    + scope + " .sorting-item.is-correct{background:#dcfce7;border-color:#22c55e;}"
    + scope + " .sorting-item.is-incorrect{background:#fee2e2;border-color:#ef4444;}"
    + scope + " .sorting-category{padding:12px;min-height:90px;text-align:left;background:#fff7ed;display:flex;flex-direction:column;align-items:stretch;gap:8px;}"
    + scope + " .sorting-feedback," + scope + " .multiple-choice-feedback," + scope + " .matching-feedback," + scope + " .ordering-feedback," + scope + " .reflection-feedback{min-height:22px;margin:10px 0;color:#2563eb;font-size:13px;font-weight:800;}"
    + scope + " fieldset{border:0;padding:0;margin:0 0 12px;display:flex;flex-direction:column;gap:10px;}"
    + scope + " legend{font-size:17px;font-weight:900;margin-bottom:10px;color:#1e293b;}"
    + scope + " .multiple-choice-option," + scope + " .reflection-choice{padding:12px;text-align:left;background:#f8fafc;}"
    + scope + " .multiple-choice-option.is-selected," + scope + " .reflection-choice.is-selected{background:#dbeafe;border-color:#3b82f6;}"
    + scope + " .multiple-choice-option.is-correct{background:#dcfce7;border-color:#22c55e;}"
    + scope + " .multiple-choice-option.is-incorrect{background:#fee2e2;border-color:#ef4444;}"
    + scope + " .roadmap-list{list-style:none;margin:16px 0;padding:0;display:flex;flex-direction:column;gap:10px;}"
    + scope + " .roadmap-item{width:100%;padding:14px;text-align:left;display:flex;gap:12px;align-items:flex-start;background:#f8fafc;}"
    + scope + " .roadmap-number{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;background:#2563eb;color:#fff;font-weight:900;flex:0 0 auto;}"
    + scope + " .roadmap-item em{display:none;margin-top:6px;color:#64748b;font-style:normal;font-weight:650;line-height:1.45;}"
    + scope + " .roadmap-item.is-open{background:#eef2ff;border-color:#818cf8;}"
    + scope + " .roadmap-item.is-open em{display:block;}"
    + scope + " .matching-board{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:16px 0;}"
    + scope + " .matching-card{padding:12px;text-align:left;background:#f8fafc;}"
    + scope + " .matching-card.is-selected{background:#dbeafe;border-color:#3b82f6;}"
    + scope + " .matching-card.is-matched{background:#dcfce7;border-color:#22c55e;}"
    + scope + " .matching-card.is-incorrect{background:#fee2e2;border-color:#ef4444;}"
    + scope + " .ordering-list{list-style:none;margin:16px 0;padding:0;display:flex;flex-direction:column;gap:10px;}"
    + scope + " .ordering-item{display:grid;grid-template-columns:minmax(0,1fr) 44px 44px;gap:8px;align-items:center;padding:10px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;}"
    + scope + " .ordering-item.is-correct{background:#dcfce7;border-color:#22c55e;}"
    + scope + " .ordering-item button{min-height:36px;}"
    + scope + " .reflection-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:16px 0;}"
    + scope + " .reflection-text{width:100%;min-height:120px;border:1px solid #cbd5e1;border-radius:12px;padding:12px;font:inherit;resize:vertical;}"
    + "@media(max-width:640px){" + scope + "{padding:18px;border-radius:12px;}" + scope + " h2{font-size:22px;}" + scope + " .sorting-workspace," + scope + " .matching-board{grid-template-columns:1fr;}}";
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
