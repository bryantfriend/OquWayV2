var activityTemplateRegistry = {
  "intro-card": {
    defaultTemplate: "classic-intro-card",
    templates: [
      createTemplate("classic-intro-card", "Classic Intro Card", "The current welcome card layout with title, copy, callout, and continue action.", "ready"),
      createTemplate("visual-hero-intro", "Visual Hero Intro", "A more visual opening card for image-led lesson introductions.", "ready")
    ]
  },
  "card-reveal": {
    defaultTemplate: "classic-card-reveal",
    templates: [
      createTemplate("classic-card-reveal", "Classic Card Reveal", "The current tap-to-reveal card experience.", "ready"),
      createTemplate("mystery-flip-cards", "Mystery Flip Cards", "A richer flip-card reveal with stronger game-like feedback.", "ready")
    ]
  },
  sorting: {
    defaultTemplate: "classic-click-sorting",
    templates: [
      createTemplate("classic-click-sorting", "Classic Click Sorting", "The current click-to-place sorting activity.", "ready"),
      createTemplate("drag-drop-sorting", "Drag and Drop Sorting", "Students drag items into target groups.", "ready"),
      createTemplate("character-runner-sorting", "Character Runner Sorting", "Students guide a character toward the correct category.", "ready"),
      createTemplate("bubble-pop-sorting", "Bubble Pop Sorting", "Students pop items into the matching group.", "ready"),
      createTemplate("conveyor-belt-sorting", "Conveyor Belt Sorting", "Items move past categories for fast sorting choices.", "ready"),
      createTemplate("basket-catch-sorting", "Basket Catch Sorting", "Students catch examples in the right category basket.", "ready"),
      createTemplate("timed-sorting-challenge", "Timed Sorting Challenge", "A quick sorting round with a visible timer.", "ready")
    ]
  },
  "multiple-choice": {
    defaultTemplate: "classic-multiple-choice",
    templates: [
      createTemplate("classic-multiple-choice", "Classic Multiple Choice", "The current single-answer question layout.", "ready"),
      createTemplate("quiz-show", "Quiz Show", "A more energetic classroom quiz presentation.", "ready"),
      createTemplate("millionaire-style", "Millionaire Style", "A staged answer ladder with dramatic feedback.", "ready"),
      createTemplate("wheel-spin", "Wheel Spin", "Students spin into a question or answer reveal.", "ready"),
      createTemplate("timed-challenge", "Timed Challenge", "A faster question round with timer pressure.", "ready")
    ]
  },
  "multi-select": {
    defaultTemplate: "classic-multi-select",
    templates: [
      createTemplate("classic-multi-select", "Classic Multi Select", "Students select all correct answers with checkbox options.", "ready"),
      createTemplate("technology-scanner", "Technology Scanner", "Students scan large cards and tap every option that uses technology.", "ready"),
      createTemplate("grid-detective", "Grid Detective", "Students investigate a grid and select all matching items.", "ready")
    ]
  },
  "scenario-choice": {
    defaultTemplate: "classic-scenario-choice",
    templates: [
      createTemplate("classic-scenario-choice", "Classic Scenario Choice", "Students choose the best response to a realistic situation.", "ready"),
      createTemplate("what-happens-next", "What Happens Next?", "Students predict the best action and see the consequence.", "ready"),
      createTemplate("classroom-hero", "Classroom Hero", "Students choose positive actions in classroom and digital citizenship scenarios.", "ready")
    ]
  },
  "scenario-simulator": {
    defaultTemplate: "rapid-decision",
    templates: [
      createTemplate("rapid-decision", "Rapid Decision", "Students read a scenario and choose the best action before time runs out.", "ready"),
      createTemplate("branching-story", "Branching Story", "A future branching narrative simulation. Falls back safely to Rapid Decision.", "coming-soon"),
      createTemplate("crisis-command", "Crisis Command", "A future high-pressure command simulation. Falls back safely to Rapid Decision.", "coming-soon"),
      createTemplate("ethical-dilemma", "Ethical Dilemma", "A future ethics-focused scenario simulation. Falls back safely to Rapid Decision.", "coming-soon")
    ]
  },
  "sequence-memory": {
    defaultTemplate: "synth-sequence",
    templates: [
      createTemplate("synth-sequence", "Synth Sequence", "Students watch and repeat a sound-and-light pad sequence.", "ready"),
      createTemplate("pattern-repeat", "Pattern Repeat", "Students repeat a visual sequence without sound.", "ready"),
      createTemplate("rhythm-builder", "Rhythm Builder", "A future rhythm-focused sequence template. Falls back safely to Synth Sequence.", "coming-soon"),
      createTemplate("algorithm-trace", "Algorithm Trace", "A future algorithm tracing template. Falls back safely to Pattern Repeat.", "coming-soon")
    ]
  },
  "timed-sequence": {
    defaultTemplate: "defusal-sequence",
    templates: [
      createTemplate("defusal-sequence", "Defusal Sequence", "Students complete a high-focus sequence before time runs out.", "ready"),
      createTemplate("workflow-sequence", "Workflow Sequence", "Students complete real-world process steps in order.", "ready"),
      createTemplate("code-execution-order", "Code Execution Order", "A future code-order challenge. Falls back safely to Workflow Sequence.", "coming-soon"),
      createTemplate("emergency-response", "Emergency Response", "A future emergency-response sequence challenge. Falls back safely to Defusal Sequence.", "coming-soon")
    ]
  },
  "practice-challenge": {
    defaultTemplate: "competitive-collector",
    templates: [
      createTemplate("competitive-collector", "Competitive Collector", "A configurable collection challenge for many subjects, resources, and rule modes.", "ready"),
      createTemplate("defense-challenge", "Defense Challenge", "Students protect a target by clearing threats, collecting power-ups, and surviving the round.", "ready"),
      createTemplate("tuning-challenge", "Tuning Challenge", "Students adjust controls to match a target pattern, signal, value, or model.", "ready"),
      createTemplate("falling-target-challenge", "Falling Target Challenge", "Students tap falling targets before they reach the danger zone.", "ready"),
      createTemplate("navigation-challenge", "Navigation Challenge", "Students control an avatar, avoid obstacles, collect items, and complete a movement challenge.", "ready"),
      createTemplate("care-simulator", "Care Simulator", "Students care for a character or system by giving it the correct resources.", "ready")
    ]
  },
  "creative-canvas": {
    defaultTemplate: "free-draw-canvas",
    templates: [
      createTemplate("free-draw-canvas", "Free Draw Canvas", "Open drawing space with creative canvas tools.", "ready"),
      createTemplate("label-and-draw", "Label and Draw", "Students draw and add at least one label before submitting.", "ready"),
      createTemplate("diagram-builder", "Diagram Builder", "A grid-friendly canvas for ICT, science, process, and network diagrams.", "ready")
    ]
  },
  roadmap: {
    defaultTemplate: "classic-roadmap",
    templates: [
      createTemplate("classic-roadmap", "Classic Roadmap", "The current expandable ordered topic roadmap.", "ready"),
      createTemplate("adventure-path", "Adventure Path", "A quest-style path through lesson stops.", "ready"),
      createTemplate("island-map", "Island Map", "A map-based journey between topic islands.", "ready"),
      createTemplate("level-unlock-map", "Level Unlock Map", "A level path that unlocks each stop in sequence.", "ready")
    ]
  },
  matching: {
    defaultTemplate: "classic-matching",
    templates: [
      createTemplate("classic-matching", "Classic Matching", "The current two-column matching activity.", "ready"),
      createTemplate("memory-game", "Memory Game", "Students flip cards to find matching pairs.", "ready"),
      createTemplate("card-flip-matching", "Card Flip Matching", "A compact matching game with animated pair reveals.", "ready"),
      createTemplate("connect-lines", "Connect Lines", "Students connect related terms and meanings.", "ready"),
      createTemplate("race-mode", "Race Mode", "A faster matching round with progress pressure.", "ready")
    ]
  },
  ordering: {
    defaultTemplate: "classic-ordering",
    templates: [
      createTemplate("classic-ordering", "Classic Ordering", "The current move-up and move-down sequence activity.", "ready"),
      createTemplate("drag-sequence", "Drag Sequence", "Students drag items into the correct order.", "ready"),
      createTemplate("timeline-builder", "Timeline Builder", "Students build a timeline from ordered events.", "ready"),
      createTemplate("stack-order-game", "Stack Order Game", "Students stack steps from first to last.", "ready")
    ]
  },
  reflection: {
    defaultTemplate: "classic-reflection",
    templates: [
      createTemplate("classic-reflection", "Classic Reflection", "The current choice and short-response reflection activity.", "ready"),
      createTemplate("emoji-check-in", "Emoji Check-In", "Students reflect by choosing an emoji-led response.", "ready"),
      createTemplate("sentence-starter", "Sentence Starter", "Students complete guided reflection prompts.", "ready"),
      createTemplate("exit-ticket", "Exit Ticket", "A concise end-of-lesson reflection card.", "ready")
    ]
  }
};

export function getActivityTemplateRegistry() {
  return activityTemplateRegistry;
}

export function getActivityTemplateOptions(stepType) {
  var entry = readRegistryEntry(stepType);

  return entry.templates.map(function (template) {
    return Object.assign({}, template);
  });
}

export function getActivityTemplateDefinition(stepType, templateId) {
  var entry = readRegistryEntry(stepType);
  var normalizedId = normalizeActivityTemplateId(stepType, templateId);
  var index = 0;

  while (index < entry.templates.length) {
    if (entry.templates[index].id === normalizedId) {
      return Object.assign({}, entry.templates[index]);
    }
    index = index + 1;
  }

  return Object.assign({}, entry.templates[0]);
}

export function getDefaultActivityTemplateId(stepType) {
  return readRegistryEntry(stepType).defaultTemplate;
}

export function normalizeActivityTemplateId(stepType, templateId) {
  var entry = readRegistryEntry(stepType);
  var safeId = typeof templateId === "string" ? templateId.trim() : "";
  var index = 0;

  while (index < entry.templates.length) {
    if (entry.templates[index].id === safeId) {
      return safeId;
    }
    index = index + 1;
  }

  return entry.defaultTemplate;
}

export function isDefaultActivityTemplate(stepType, templateId) {
  return normalizeActivityTemplateId(stepType, templateId) === getDefaultActivityTemplateId(stepType);
}

export function isReadyActivityTemplate(stepType, templateId) {
  return getActivityTemplateDefinition(stepType, templateId).status === "ready";
}

function readRegistryEntry(stepType) {
  if (stepType && activityTemplateRegistry[stepType]) {
    return activityTemplateRegistry[stepType];
  }

  return {
    defaultTemplate: "",
    templates: [
      createTemplate("", "Classic", "The default renderer for this step type.", "ready")
    ]
  };
}

function createTemplate(id, name, description, status) {
  return {
    id: id,
    name: name,
    description: description,
    status: status
  };
}
