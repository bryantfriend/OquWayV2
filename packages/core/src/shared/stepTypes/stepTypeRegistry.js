import { TextBriefingStep } from "./TextBriefingStep.js?v=1.1.29-module-render-fix";
import { VocabularyStep } from "./VocabularyStep.js?v=1.1.29-module-render-fix";
import { PhraseStep } from "./PhraseStep.js?v=1.1.29-module-render-fix";
import { ListeningStep } from "./ListeningStep.js?v=1.1.29-module-render-fix";
import { SpeakingPromptStep } from "./SpeakingPromptStep.js?v=1.1.29-module-render-fix";
import { ReflectionStep } from "./ReflectionStep.js?v=1.1.29-module-render-fix";
import { CustomExperienceStep } from "./CustomExperienceStep.js?v=1.1.29-module-render-fix";
import { CyberCodeMissionStep } from "./CyberCodeMissionStep.js?v=1.1.29-module-render-fix";
import { DragMatchIslandStep } from "./DragMatchIslandStep.js?v=1.1.29-module-render-fix";
import { ExternalTaskStep } from "./ExternalTaskStep.js?v=1.1.29-module-render-fix";

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
