import { TextBriefingStep } from "./TextBriefingStep.js";
import { VocabularyStep } from "./VocabularyStep.js";
import { PhraseStep } from "./PhraseStep.js";
import { ListeningStep } from "./ListeningStep.js";
import { SpeakingPromptStep } from "./SpeakingPromptStep.js";
import { ReflectionStep } from "./ReflectionStep.js";
import { CustomExperienceStep } from "./CustomExperienceStep.js";
import { CyberCodeMissionStep } from "./CyberCodeMissionStep.js";
import { DragMatchIslandStep } from "./DragMatchIslandStep.js";
import { ExternalTaskStep } from "./ExternalTaskStep.js";

var stepTypes = {
  textBriefing: TextBriefingStep,
  vocabulary: VocabularyStep,
  phrase: PhraseStep,
  listening: ListeningStep,
  speakingPrompt: SpeakingPromptStep,
  reflection: ReflectionStep,
  customExperience: CustomExperienceStep,
  cyberCodeMission: CyberCodeMissionStep,
  dragMatchIsland: DragMatchIslandStep,
  externalTask: ExternalTaskStep
};

export function getStepTypeDefinition(stepType) {
  if (!stepType || !stepTypes[stepType]) {
    return null;
  }

  return stepTypes[stepType];
}

export function listStepTypeDefinitions() {
  return [
    TextBriefingStep,
    VocabularyStep,
    PhraseStep,
    ListeningStep,
    SpeakingPromptStep,
    ReflectionStep,
    CustomExperienceStep,
    CyberCodeMissionStep,
    DragMatchIslandStep,
    ExternalTaskStep
  ];
}

export function isSupportedStepType(stepType) {
  return getStepTypeDefinition(stepType) !== null;
}

export function createDefaultStepConfig(stepType, config) {
  var StepTypeDefinition = getStepTypeDefinition(stepType);

  if (!StepTypeDefinition) {
    if (config && typeof config === "object" && !Array.isArray(config)) {
      return Object.assign({}, config);
    }

    return {};
  }

  return StepTypeDefinition.createConfig(config);
}
