import { BaseStep } from "./BaseStep.js?v=1.1.159-emotional-regulation";
import { TextBriefingStep } from "./TextBriefingStep.js?v=1.1.121-student-dashboard-open-clean";
import { VocabularyStep } from "./VocabularyStep.js?v=1.1.121-student-dashboard-open-clean";
import { PhraseStep } from "./PhraseStep.js?v=1.1.121-student-dashboard-open-clean";
import { ListeningStep } from "./ListeningStep.js?v=1.1.121-student-dashboard-open-clean";
import { SpeakingPromptStep } from "./SpeakingPromptStep.js?v=1.1.121-student-dashboard-open-clean";
import { ReflectionStep } from "./ReflectionStep.js?v=1.1.121-student-dashboard-open-clean";
import { EmotionalCheckInStep } from "./EmotionalCheckInStep.js?v=1.1.159-emotional-regulation";
import { CustomExperienceStep } from "./CustomExperienceStep.js?v=1.1.121-student-dashboard-open-clean";
import { CyberCodeMissionStep } from "./CyberCodeMissionStep.js?v=1.1.121-student-dashboard-open-clean";
import { DragMatchIslandStep } from "./DragMatchIslandStep.js?v=1.1.121-student-dashboard-open-clean";
import { ExternalTaskStep } from "./ExternalTaskStep.js?v=1.1.121-student-dashboard-open-clean";

var stepTypes = {
  "emotional-check-in": EmotionalCheckInStep,
  "mood-reset": EmotionalCheckInStep,
  emotionalcheckin: EmotionalCheckInStep,
  emotionalCheckIn: EmotionalCheckInStep,
  EmotionalCheckIn: EmotionalCheckInStep,
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
  void BaseStep;

  return [
    EmotionalCheckInStep,
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
