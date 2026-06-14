export var SCENARIO_SIMULATOR_DEFAULT_PRESET = "ict-systems";

var defaultScenarios = [
  createScenario("overloaded-core", "The Overloaded Core", [
    "Reactor temperatures critical",
    "Core meltdown imminent",
    "Target: Engage primary COOLANT"
  ], "Choose the best action.", "COOLANT", ["VENT", "POWER", "FLUSH"], "Coolant engaged. Core temperature stabilized.", "Incorrect action. The core became unstable."),
  createScenario("rogue-ai", "The Rogue AI", [
    "Rogue intelligence lockout",
    "Corrupted sectors detected",
    "Target: Initiate system DIAGNOSTIC"
  ], "Choose the best action.", "DIAGNOSTIC", ["FORMAT", "REBOOT", "PING"], "Diagnostic started. Corrupted sectors identified.", "Incorrect action. The rogue process spread."),
  createScenario("data-heist", "The Data Heist", [
    "Intruders detected",
    "Blueprints being copied",
    "Target: ENCRYPT remaining files"
  ], "Choose the best action.", "ENCRYPT", ["DELETE", "TRANSFER", "COPY"], "Files encrypted. Data protected.", "Incorrect action. More files were exposed."),
  createScenario("virus-breach", "The Virus Breach", [
    "Malicious code in sector 7",
    "Threat spreading rapidly",
    "Target: QUARANTINE infected nodes"
  ], "Choose the best action.", "QUARANTINE", ["PURGE", "IGNORE", "SCAN"], "Infected nodes quarantined.", "Incorrect action. The infection spread."),
  createScenario("power-grid", "The Power Grid", [
    "Main relays offline",
    "City sector 4 is dark",
    "Target: REROUTE auxiliary power"
  ], "Choose the best action.", "REROUTE", ["SHUTDOWN", "OVERLOAD", "CYCLE"], "Power rerouted successfully.", "Incorrect action. The outage continued.")
];

var presets = {
  "ict-systems": {
    id: "ict-systems",
    name: "ICT Systems",
    scenarios: defaultScenarios
  },
  cybersecurity: {
    id: "cybersecurity",
    name: "Cybersecurity",
    scenarios: [
      createScenario("phishing-attack", "Phishing Attack", ["A message asks for your password", "The sender looks suspicious", "Target: Verify before responding"], "Choose the safest action.", "VERIFY", ["REPLY", "CLICK", "FORWARD"], "You verified the sender before acting.", "The unsafe action increased risk."),
      createScenario("malware-infection", "Malware Infection", ["A file is behaving strangely", "Popups are appearing", "Target: ISOLATE the device"], "Choose the safest action.", "ISOLATE", ["IGNORE", "SHARE", "INSTALL"], "Device isolated. The threat stopped spreading.", "The threat continued spreading."),
      createScenario("password-compromise", "Password Compromise", ["A login alert appears", "You did not sign in", "Target: RESET password"], "Choose the safest action.", "RESET", ["WAIT", "POST", "DELETE"], "Password reset started.", "The account stayed exposed.")
    ]
  },
  "digital-citizenship": {
    id: "digital-citizenship",
    name: "Digital Citizenship",
    scenarios: [
      createScenario("suspicious-message", "Suspicious Message", ["A stranger asks for personal details", "The message feels urgent", "Target: REPORT the message"], "Choose the best response.", "REPORT", ["ANSWER", "SHARE", "MEET"], "You reported the suspicious message.", "The choice could put privacy at risk."),
      createScenario("privacy-concern", "Privacy Concern", ["A site asks for your full address", "It is not needed for class", "Target: ASK an adult"], "Choose the best response.", "ASK", ["TYPE", "GUESS", "POST"], "You paused and asked for help.", "Personal information was exposed."),
      createScenario("online-safety", "Online Safety Decision", ["A link promises a free prize", "It asks you to sign in", "Target: AVOID the link"], "Choose the best response.", "AVOID", ["LOGIN", "DOWNLOAD", "SEND"], "You avoided a risky link.", "The choice could lead to account risk.")
    ]
  },
  science: {
    id: "science",
    name: "Science",
    scenarios: [
      createScenario("lab-emergency", "Lab Emergency", ["A beaker spills", "Students are nearby", "Target: ALERT the teacher"], "Choose the safe action.", "ALERT", ["TOUCH", "HIDE", "RUN"], "You alerted the teacher and kept distance.", "The unsafe action made the lab less safe."),
      createScenario("equipment-failure", "Equipment Failure", ["Equipment makes a strange sound", "The reading is unstable", "Target: STOP the equipment"], "Choose the safe action.", "STOP", ["SHAKE", "IGNORE", "BOOST"], "Equipment stopped safely.", "The issue continued."),
      createScenario("environmental-event", "Environmental Event", ["Smoke is visible outside", "Air quality is changing", "Target: MOVE indoors"], "Choose the safe action.", "MOVE", ["OPEN", "WAIT", "FILM"], "You moved indoors safely.", "The choice increased exposure.")
    ]
  },
  history: {
    id: "history",
    name: "History",
    scenarios: [
      createScenario("leadership-choice", "Leadership Choice", ["A community faces a difficult decision", "People need clear direction", "Target: CONSULT trusted advisors"], "Choose the wise action.", "CONSULT", ["IGNORE", "RUSH", "BLAME"], "You gathered advice before deciding.", "The rushed decision created more conflict."),
      createScenario("crisis-response", "Crisis Response", ["A shortage affects the settlement", "Supplies must be protected", "Target: PRIORITIZE essential needs"], "Choose the responsible action.", "PRIORITIZE", ["HOARD", "WASTE", "DELAY"], "Essential needs were protected first.", "The choice made the shortage harder to manage."),
      createScenario("treaty-decision", "Treaty Decision", ["Two groups disagree", "A peaceful solution is possible", "Target: NEGOTIATE fairly"], "Choose the strongest response.", "NEGOTIATE", ["THREATEN", "LEAVE", "MISLEAD"], "Fair negotiation kept dialogue open.", "The choice damaged trust.")
    ]
  },
  business: {
    id: "business",
    name: "Business",
    scenarios: [
      createScenario("customer-complaint", "Customer Complaint", ["A customer reports a product issue", "They are frustrated", "Target: LISTEN and solve"], "Choose the professional action.", "LISTEN", ["ARGUE", "IGNORE", "DELETE"], "You listened and moved toward a solution.", "The response made the customer experience worse."),
      createScenario("budget-decision", "Budget Decision", ["The team has limited funds", "Several requests compete", "Target: REVIEW priorities"], "Choose the best action.", "REVIEW", ["GUESS", "SPEND", "POSTPONE"], "You reviewed priorities before spending.", "The choice risked poor use of funds."),
      createScenario("product-issue", "Product Issue", ["A feature is failing for users", "Reports are increasing", "Target: INVESTIGATE the cause"], "Choose the best next step.", "INVESTIGATE", ["DENY", "HIDE", "RELEASE"], "You investigated before making changes.", "The issue continued without a clear cause.")
    ]
  },
  sel: {
    id: "sel",
    name: "SEL",
    scenarios: [
      createScenario("conflict-resolution", "Conflict Resolution", ["Two classmates disagree", "The conversation is getting tense", "Target: PAUSE and listen"], "Choose the kind action.", "PAUSE", ["SHOUT", "LEAVE", "MOCK"], "You slowed the conversation and listened.", "The choice made the conflict worse."),
      createScenario("helping-classmate", "Helping a Classmate", ["A classmate looks confused", "They are afraid to ask", "Target: OFFER help respectfully"], "Choose the supportive action.", "OFFER", ["LAUGH", "IGNORE", "TAKEOVER"], "You offered help without taking over.", "The choice did not support your classmate."),
      createScenario("emotional-regulation", "Emotional Regulation", ["You feel frustrated", "The task is difficult", "Target: BREATHE and try again"], "Choose the healthy response.", "BREATHE", ["QUIT", "SNAP", "RUSH"], "You used a calm strategy and kept going.", "The choice made it harder to recover.")
    ]
  },
  "classroom-expectations": {
    id: "classroom-expectations",
    name: "Classroom Expectations",
    scenarios: [
      createScenario("finish-early", "Finish Early", ["You completed the task", "Others are still working", "Target: CHECK your work"], "Choose the responsible action.", "CHECK", ["TALK", "WANDER", "GAME"], "You used time responsibly.", "The choice distracted learning."),
      createScenario("device-misuse", "Device Misuse", ["A classmate opens random websites", "The teacher is helping another group", "Target: STAY on task"], "Choose the responsible action.", "STAY", ["JOIN", "LAUGH", "COPY"], "You stayed focused on the task.", "The choice moved away from expectations."),
      createScenario("group-work", "Group Work Challenge", ["A teammate is left out", "The group is rushing", "Target: INCLUDE them"], "Choose the kind action.", "INCLUDE", ["IGNORE", "BLAME", "QUIT"], "You helped the group include everyone.", "The choice did not support teamwork.")
    ]
  }
};

export function listScenarioSimulatorPresetOptions() {
  return Object.keys(presets).map(function (key) {
    return {
      value: presets[key].id,
      label: presets[key].name
    };
  });
}

export function readScenarioSimulatorPreset(presetId) {
  var preset = presets[presetId] || presets[SCENARIO_SIMULATOR_DEFAULT_PRESET];

  return {
    id: preset.id,
    name: preset.name,
    scenarios: preset.scenarios.map(cloneScenario)
  };
}

export function createDefaultScenarioText() {
  return serializeScenarioText(defaultScenarios);
}

export function serializeScenarioText(scenarios) {
  return (Array.isArray(scenarios) ? scenarios : []).map(function (scenario) {
    return [
      "Title: " + scenario.title,
      "Description: " + scenario.descriptionLines.join(" | "),
      "Prompt: " + scenario.prompt,
      "Correct: " + scenario.correctAction,
      "Incorrect: " + scenario.incorrectActions.join(" | "),
      "Success: " + scenario.successFeedback,
      "Failure: " + scenario.failureFeedback
    ].join("\n");
  }).join("\n---\n");
}

function createScenario(id, title, descriptionLines, prompt, correctAction, incorrectActions, successFeedback, failureFeedback) {
  return {
    id: id,
    title: title,
    descriptionLines: descriptionLines,
    prompt: prompt,
    correctAction: correctAction,
    incorrectActions: incorrectActions,
    successFeedback: successFeedback,
    failureFeedback: failureFeedback
  };
}

function cloneScenario(scenario) {
  return {
    id: scenario.id,
    title: scenario.title,
    descriptionLines: scenario.descriptionLines.slice(),
    prompt: scenario.prompt,
    correctAction: scenario.correctAction,
    incorrectActions: scenario.incorrectActions.slice(),
    successFeedback: scenario.successFeedback,
    failureFeedback: scenario.failureFeedback
  };
}
