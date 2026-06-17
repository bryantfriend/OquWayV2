var failures = [];
var warnings = [];

await import("../packages/core/src/shared/stepTypes/BaseStep.js?v=1.1.192-timed-sequence");

globalThis.window = globalThis.window || {};
globalThis.window.CourseEngine = globalThis.CourseEngine;
globalThis.window.setTimeout = setTimeout;

var templateRegistry = await import("../packages/core/src/shared/stepTypes/activityTemplateRegistry.js?v=1.1.192-timed-sequence");
var interactiveSteps = await import("../packages/core/src/shared/stepTypes/InteractiveLearningSteps.js?v=1.1.192-timed-sequence");
var scenarioSimulatorStep = await import("../packages/core/src/shared/stepTypes/ScenarioSimulatorStep.js?v=1.1.192-timed-sequence");
var sequenceMemoryStep = await import("../packages/core/src/shared/stepTypes/SequenceMemoryStep.js?v=1.1.192-timed-sequence");
var timedSequenceStep = await import("../packages/core/src/shared/stepTypes/TimedSequenceStep.js?v=1.1.192-timed-sequence");
var practiceChallengeStep = await import("../packages/core/src/shared/stepTypes/PracticeChallengeStep.js?v=1.1.192-timed-sequence");
var creativeCanvasStep = await import("../packages/core/src/shared/stepTypes/CreativeCanvasStep.js?v=1.1.192-timed-sequence");
var textBriefingStep = await import("../packages/core/src/shared/stepTypes/TextBriefingStep.js?v=1.1.192-timed-sequence");
var vocabularyStep = await import("../packages/core/src/shared/stepTypes/VocabularyStep.js?v=1.1.192-timed-sequence");
var phraseStep = await import("../packages/core/src/shared/stepTypes/PhraseStep.js?v=1.1.192-timed-sequence");
var listeningStep = await import("../packages/core/src/shared/stepTypes/ListeningStep.js?v=1.1.192-timed-sequence");
var speakingPromptStep = await import("../packages/core/src/shared/stepTypes/SpeakingPromptStep.js?v=1.1.192-timed-sequence");
var reflectionShellStep = await import("../packages/core/src/shared/stepTypes/ReflectionStep.js?v=1.1.192-timed-sequence");
var customExperienceStep = await import("../packages/core/src/shared/stepTypes/CustomExperienceStep.js?v=1.1.192-timed-sequence");
var cyberCodeMissionStep = await import("../packages/core/src/shared/stepTypes/CyberCodeMissionStep.js?v=1.1.192-timed-sequence");
var dragMatchIslandStep = await import("../packages/core/src/shared/stepTypes/DragMatchIslandStep.js?v=1.1.192-timed-sequence");

var stepDefinitions = {
  "intro-card": interactiveSteps.IntroCardStep,
  "card-reveal": interactiveSteps.CardRevealStep,
  sorting: interactiveSteps.SortingStep,
  "multiple-choice": interactiveSteps.MultipleChoiceStep,
  "multi-select": interactiveSteps.MultiSelectStep,
  "scenario-choice": interactiveSteps.ScenarioChoiceStep,
  "scenario-simulator": scenarioSimulatorStep.ScenarioSimulatorStep,
  "sequence-memory": sequenceMemoryStep.SequenceMemoryStep,
  "timed-sequence": timedSequenceStep.TimedSequenceStep,
  "practice-challenge": practiceChallengeStep.PracticeChallengeStep,
  "creative-canvas": creativeCanvasStep.CreativeCanvasStep,
  roadmap: interactiveSteps.RoadmapStep,
  matching: interactiveSteps.MatchingStep,
  ordering: interactiveSteps.OrderingStep,
  reflection: interactiveSteps.ReflectionStep,
  textBriefing: textBriefingStep.TextBriefingStep,
  vocabulary: vocabularyStep.VocabularyStep,
  phrase: phraseStep.PhraseStep,
  listening: listeningStep.ListeningStep,
  speakingPrompt: speakingPromptStep.SpeakingPromptStep,
  reflectionShell: reflectionShellStep.ReflectionStep,
  customExperience: customExperienceStep.CustomExperienceStep,
  cyberCodeMission: cyberCodeMissionStep.CyberCodeMissionStep,
  dragMatchIsland: dragMatchIslandStep.DragMatchIslandStep
};

runTemplateRegistrySmoke();
runStepRendererSmoke();
printResults();

function runTemplateRegistrySmoke() {
  var registry = templateRegistry.getActivityTemplateRegistry();
  var stepTypes = Object.keys(registry);
  var stepTypeIndex = 0;

  while (stepTypeIndex < stepTypes.length) {
    runTemplateFamilySmoke(stepTypes[stepTypeIndex], registry[stepTypes[stepTypeIndex]]);
    stepTypeIndex = stepTypeIndex + 1;
  }
}

function runTemplateFamilySmoke(stepType, entry) {
  var StepTypeDefinition = stepDefinitions[stepType];
  var templates = entry && Array.isArray(entry.templates) ? entry.templates : [];
  var seenReadyOutput = {};
  var index = 0;
  var missingFallbackId = templateRegistry.normalizeActivityTemplateId(stepType, "missing-template-id");

  if (!StepTypeDefinition) {
    failures.push(stepType + " has templates but no local smoke definition.");
    return;
  }

  if (missingFallbackId !== entry.defaultTemplate) {
    failures.push(stepType + " missing template fallback did not normalize to the default template.");
  }

  while (index < templates.length) {
    smokeTemplateRender(stepType, StepTypeDefinition, templates[index], seenReadyOutput);
    index = index + 1;
  }
}

function smokeTemplateRender(stepType, StepTypeDefinition, template, seenReadyOutput) {
  var config = createTemplateConfig(StepTypeDefinition, template.id);
  var html = "";
  var outputHash = "";

  try {
    html = StepTypeDefinition.renderPlayerShell(config);
  } catch (error) {
    failures.push(stepType + " / " + template.id + " render failed: " + readErrorMessage(error));
    return;
  }

  if (typeof html !== "string" || html.length < 32) {
    failures.push(stepType + " / " + template.id + " returned an empty student render.");
    return;
  }

  if (html.indexOf("<article") === -1 && html.indexOf("<div") === -1 && html.indexOf("<section") === -1) {
    failures.push(stepType + " / " + template.id + " did not return recognizable HTML.");
  }

  if (template.status !== "ready") {
    var lowerHtml = html.toLowerCase();
    if (lowerHtml.indexOf("activity-template-fallback-notice") === -1 &&
      lowerHtml.indexOf("coming-soon") === -1 &&
      lowerHtml.indexOf("coming soon") === -1 &&
      lowerHtml.indexOf("template-notice") === -1 &&
      lowerHtml.indexOf("fallback") === -1) {
      warnings.push(stepType + " / " + template.id + " is not ready but did not expose obvious fallback copy.");
    }
    return;
  }

  outputHash = hashTemplateOutput(html);
  if (seenReadyOutput[outputHash]) {
    warnings.push(stepType + " / " + template.id + " matched ready output for " + seenReadyOutput[outputHash] + ".");
  } else {
    seenReadyOutput[outputHash] = template.id;
  }
}

function runStepRendererSmoke() {
  var stepTypes = Object.keys(stepDefinitions);
  var index = 0;

  while (index < stepTypes.length) {
    smokeDefaultStepRender(stepTypes[index], stepDefinitions[stepTypes[index]]);
    index = index + 1;
  }
}

function smokeDefaultStepRender(stepType, StepTypeDefinition) {
  var html = "";

  if (!StepTypeDefinition || typeof StepTypeDefinition.renderPlayerShell !== "function") {
    failures.push(stepType + " does not expose renderPlayerShell.");
    return;
  }

  try {
    html = StepTypeDefinition.renderPlayerShell(createDefaultConfig(StepTypeDefinition));
  } catch (error) {
    failures.push(stepType + " default render failed: " + readErrorMessage(error));
    return;
  }

  if (typeof html !== "string" || html.length < 24) {
    failures.push(stepType + " default render returned empty HTML.");
  }
}

function createTemplateConfig(StepTypeDefinition, templateId) {
  var config = createDefaultConfig(StepTypeDefinition);

  config.activityTemplate = templateId;
  config._activityTemplate = templateId;
  return config;
}

function createDefaultConfig(StepTypeDefinition) {
  if (StepTypeDefinition && typeof StepTypeDefinition.createConfig === "function") {
    return StepTypeDefinition.createConfig({});
  }

  return Object.assign({}, StepTypeDefinition.defaultConfig || {});
}

function hashTemplateOutput(html) {
  var normalized = String(html)
    .replace(/data-[a-z-]+="[^"]*"/g, "")
    .replace(/\s+/g, " ")
    .trim();
  var hash = 0;
  var index = 0;

  while (index < normalized.length) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(index);
    hash = hash | 0;
    index = index + 1;
  }

  return String(hash);
}

function readErrorMessage(error) {
  if (error && error.stack) {
    return error.stack.split("\n")[0];
  }

  if (error && error.message) {
    return error.message;
  }

  return String(error);
}

function printResults() {
  if (warnings.length > 0) {
    console.log("Warnings:");
    warnings.forEach(function (warning) {
      console.log("- " + warning);
    });
  }

  if (failures.length > 0) {
    console.error("Failures:");
    failures.forEach(function (failure) {
      console.error("- " + failure);
    });
    process.exit(1);
  }

  console.log("Step template smoke passed.");
}
