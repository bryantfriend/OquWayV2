import { TextBriefingStep } from "./TextBriefingStep.js?v=1.1.110-student-class-alias-query";
import { VocabularyStep } from "./VocabularyStep.js?v=1.1.110-student-class-alias-query";
import { PhraseStep } from "./PhraseStep.js?v=1.1.110-student-class-alias-query";
import { ListeningStep } from "./ListeningStep.js?v=1.1.110-student-class-alias-query";
import { SpeakingPromptStep } from "./SpeakingPromptStep.js?v=1.1.110-student-class-alias-query";
import { ReflectionStep } from "./ReflectionStep.js?v=1.1.110-student-class-alias-query";
import { CustomExperienceStep } from "./CustomExperienceStep.js?v=1.1.110-student-class-alias-query";
import { CyberCodeMissionStep } from "./CyberCodeMissionStep.js?v=1.1.110-student-class-alias-query";
import { DragMatchIslandStep } from "./DragMatchIslandStep.js?v=1.1.110-student-class-alias-query";
import { ExternalTaskStep } from "./ExternalTaskStep.js?v=1.1.110-student-class-alias-query";

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
